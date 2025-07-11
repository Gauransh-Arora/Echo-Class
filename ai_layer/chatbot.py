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
sym_spell.load_dictionary("ai_layer/frequency_dictionary_en_82_765.txt", 0, 1)

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

    - You can respond to greetings normally 
    - Be Polite
    - If the answer cannot be found in the context, respond with: "I don't know."
    - Keep the answer clear, concise, and no more than three sentences except when asked to provide detail.

    Chat History:
    {history}

    Context:
    {context}

    Question:
    {question}

    Answer:"""
)

prompt = PromptTemplate(input_variables=["history","question", "context"], template=template)

def format_retrival(docs: list[str], max_chars: int = 1500) -> str:
    result = []
    total_chars = 0
    for doc in docs:
        if total_chars + len(doc) > max_chars:
            break
        result.append(doc.strip())
        total_chars += len(doc)
    return "\n\n".join(result)


def get_contextual_query(messages: list[BaseMessage]) -> str:
    user_msgs = [m.content for m in messages if isinstance(m, HumanMessage)]
    return " ".join(user_msgs[-2:])  # use last 2 user messages as context

def format_history(messages: list, max_chars: int = 4000) -> str:
    history_lines = []
    total_chars = 0
    for m in reversed(messages):
        role = "User" if isinstance(m, HumanMessage) else "Assistant"
        line = f"{role}: {m.content.strip()}"
        if total_chars + len(line) > max_chars:
            break
        history_lines.append(line)
        total_chars += len(line)
    return "\n".join(reversed(history_lines))

def chatbot_node(state: dict) -> dict:
    messages = state["messages"]

    # Use contextual query for DB search
    contextual_query = correct_query(get_contextual_query(messages))
    docs = search_for_data(contextual_query)
    context = format_retrival(docs, max_chars=1500)

    # Use only the latest user message for the LLM
    latest_user_msg = next((m.content for m in reversed(messages) if isinstance(m, HumanMessage)), "")
    history = format_history(messages[:-1], max_chars=4000)
    
    prompt_text = prompt.format(
        question=latest_user_msg,
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
    config = {"configurable": {"thread_id": thread_id}}

    # Always initialize a clean state with "messages" key
    state = memory.get(config) or {}
    if "messages" not in state:
        state["messages"] = []

    # Add the user query
    state["messages"].append(HumanMessage(content=query))

    max_retries = 3
    delay = 5

    for attempt in range(1, max_retries + 1):
        try:
            result = graph.invoke(state, config)
            assistant_msg = result["messages"][-1]
            return assistant_msg.content
        except Exception as e:
            print(f"[Attempt {attempt}] Error: {e}")
            if attempt < max_retries:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2
            else:
                return "Sorry, I'm currently facing issues and couldn't process your request. Please try again later."


if __name__ == "__main__":
    print("Type 'quit' to exit.")
    thread_id = "1"
    while True:
        user_input = input("User: ")
        if user_input.lower() in {"quit", "exit"}:
            break
        print(pdf_chat(user_input, thread_id))
