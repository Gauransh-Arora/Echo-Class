import os 
from dotenv import load_dotenv
import time
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from langgraph.checkpoint.memory import MemorySaver
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

def search_for_data(text: str) -> list[dict]:
    vector = hf.embed_query(text)
    
    index = pc.Index(index_name="rag-search-engine",host="https://rag-search-engine-nuu3fjt.svc.aped-4627-b74a.pinecone.io")  

    results = index.query(
        vector=vector,
        top_k=3,
        namespace="pdf-search",  
        include_metadata=True
    )

    return [
        {
            "chunk_text": match['metadata'].get('chunk_text', ''),
            "score": match.get('score', 0.0)
        }
        for match in results['matches']
        if ('chunk_text' in match.get('metadata', {}) and match.get('score')>0.0)
    ]

template =(
    """You are a factual assistant. Use only the context provided below to answer the question accurately.

    - If the answer cannot be found in the context, respond with: "I don't know."
    - Keep the answer clear, concise, and no more than three sentences.

    Previous Conversation:
    {history}

    Context:
    {context}

    Question:
    {question}

    Answer:"""
)

prompt = PromptTemplate(input_variables=["history","question", "context"], template=template)

def format_retrival(listdict):
    str = ""
    for dicti in listdict:
        str = str+ "\n\n" + dicti

def answer_question(question):
    docs = search_for_data(question)
    contx = format_retrival(docs)
    
    
    


