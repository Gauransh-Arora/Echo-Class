import time
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph
from langchain_core.messages import BaseMessage
from langchain_core.messages import AIMessage, HumanMessage
from symspellpy.symspellpy import SymSpell
from pinecone import Pinecone


load_dotenv("ai_layer/keys.env")


llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,
    max_tokens=None,
    timeout=None
)

pc = Pinecone()

model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': False}
hf = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

sym_spell = SymSpell(max_dictionary_edit_distance=2)
sym_spell.load_dictionary("frequency_dictionary_en_82_765.txt", 0, 1)

def correct_query(query: str) -> str:
    suggestions = sym_spell.lookup_compound(query, max_edit_distance=2)
    return suggestions[0].term if suggestions else query

def search_for_data(text: str) -> list[str]:
    vector = hf.embed_query(text)
    
    index = pc.Index(index_name="rag-search-engine",host="https://rag-search-engine-nuu3fjt.svc.aped-4627-b74a.pinecone.io")  

    results = index.query(
        vector=vector,
        top_k=3,
        namespace="pdf-search",  
        include_metadata=True
    )

    return [
        match['metadata']['chunk_text']
        for match in results['matches']
        if 'chunk_text' in match.get('metadata', {}) and match.get('score', 0.0) > 0.0
    ]

template =(
    """You are a factual assistant. Use only the context provided below to answer the question accurately.

    - You can repond to greetings normally 
    - If the answer cannot be found in the context, respond with: "I don't know."
    - Keep the answer clear, concise, and no more than three sentences.

    Chat History:
    {history}

    Context:
    {context}

    Question:
    {question}

    Answer:"""
)

prompt = PromptTemplate(input_variables=["history","question", "context"], template=template)

def format_retrival(docs : list[str]):
    return "\n\n".join(doc for doc in docs)


def format_history(messages: list) -> str:
    return "\n".join(
        f"{'User' if isinstance(m, HumanMessage) else 'Assistant'}: {m.content}"
        for m in messages
    )

def chatbot_node(state: dict) -> dict:
    messages = state["messages"]

    user_msg = correct_query(next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), ""))

    history = format_history(messages[:-1])

    docs = search_for_data(user_msg)
    context = format_retrival(docs)
    
    prompt_text = prompt.format(
        question=user_msg,
        context=context,
        history=history
    )
    
    answer = llm.invoke(prompt_text)
    
    return {
        "messages": messages + [AIMessage(content=answer.content)]
    }

def append_messages(x: list, y: list) -> list:
    return x + y

class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], append_messages]

graph_builder = StateGraph(ChatState)
graph_builder.add_node("chatbot", chatbot_node)
graph_builder.set_entry_point("chatbot")

memory = MemorySaver()
graph = graph_builder.compile(checkpointer=memory)

def pdf_chat(query: str, thread_id: str = "1"):

    state = memory.get(thread_id) or {"messages": []}

    state["messages"].append(HumanMessage(content=query))

    max_retries = 3
    delay = 5  

    for attempt in range(1, max_retries + 1):
        try:
            result = graph.invoke(state, {"configurable": {"thread_id": thread_id}})
            assistant_msg = result["messages"][-1]
            memory.set(thread_id, result)
            return assistant_msg.content

        except Exception as e:
            print(f"[Attempt {attempt}] Error: {e}")
            if attempt < max_retries:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *=2

            else:
                return "Sorry, I'm currently facing issues and couldn't process your request. Please try again later."

if __name__ == "__main__":
    print("Type 'quit' to exit.")
    thread_id = "1"
    state = {"messages": []}
    while True:
        user_input = input("User: ")
        if user_input.lower() in {"quit", "exit"}:
            break
        state["messages"].append(HumanMessage(content=user_input))
        result = graph.invoke(state, {"configurable": {"thread_id": thread_id}})
        assistant_msg = result["messages"][-1]
        print(f"Assistant: {assistant_msg.content}")
        state = result

