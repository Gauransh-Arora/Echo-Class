import os
import time
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from pinecone import Pinecone
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from typing_extensions import TypedDict, Annotated
from typing import TypedDict, Annotated
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq

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
embeddings = HuggingFaceEmbeddings(model_name=model_name, model_kwargs=model_kwargs)

index = pc.Index("rag-search-engine")

# Custom retriever

def search_for_data(text: str):
    xq = embeddings.embed_query(text)
    res = index.query(vector=xq, top_k=3, include_metadata=True, namespace="pdf-search")
    return [
        {"chunk_text": match["metadata"]["chunk_text"], "score": match["score"]}
        for match in res["matches"]
    ]

def format_context(chunks):
    return "\n\n".join(chunk["chunk_text"] for chunk in chunks)

def format_history(messages):
    lines = []
    for msg in messages:
        # Support both dict and LangChain message objects
        if isinstance(msg, dict):
            role = msg.get("role")
            content = msg.get("content")
        else:
            # For HumanMessage, AIMessage, etc.
            role = getattr(msg, "role", None) or getattr(msg, "type", None)
            content = getattr(msg, "content", None)
        if role == "user":
            lines.append(f"User: {content}")
        elif role == "assistant":
            lines.append(f"Assistant: {content}")
    return "\n".join(lines)

template = """
You are a factual assistant. Use only the context and previous conversation below to answer the question accurately.

Previous conversation:
{history}

Context:
{context}

Question:
{question}

Answer:
"""

prompt = PromptTemplate(input_variables=["history", "question", "context"], template=template)

def chatbot_node(state):
    messages = state["messages"]
    # Get the latest user message
    user_message = ""
    for m in reversed(messages):
        if (isinstance(m, dict) and m.get("role") == "user") or (hasattr(m, "role") and getattr(m, "role", None) == "user"):
            user_message = m["content"] if isinstance(m, dict) else getattr(m, "content", "")
            break
    # Retrieve context
    chunks = search_for_data(user_message)
    context = format_context(chunks)
    history_text = format_history(messages[:-1])  # Exclude current user message
    prompt_text = prompt.format(history=history_text, question=user_message, context=context)
    answer = llm.invoke(prompt_text)
    # Ensure answer is a string
    if hasattr(answer, "content"):
        answer_text = answer.content
    else:
        answer_text = answer
    # Append assistant message to state
    new_messages = messages + [{"role": "assistant", "content": answer_text}]
    return {"messages": new_messages}

class State(TypedDict):
    messages: Annotated[list, add_messages]

graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot_node)
graph_builder.set_entry_point("chatbot")
memory = MemorySaver()
graph = graph_builder.compile(checkpointer=memory)

if __name__ == "__main__":
    print("Type 'quit' to exit.")
    thread_id = "1"
    state = {"messages": []}
    while True:
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        # Add user message
        state["messages"].append({"role": "user", "content": user_input})
        # Run through LangGraph
        result = graph.invoke(state, {"configurable": {"thread_id": thread_id}})
        # Get assistant's latest message
        last_msg = result["messages"][-1]
        if isinstance(last_msg, dict):
            assistant_msg = last_msg["content"]
        else:
            assistant_msg = getattr(last_msg, "content", str(last_msg))
        print(f"Assistant: {assistant_msg}")
        # Update state for next turn
        state = result