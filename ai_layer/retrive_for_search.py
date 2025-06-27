from pinecone import Pinecone
from langchain_huggingface import HuggingFaceEmbeddings
from sentence_transformers import SentenceTransformer
import dotenv
import os

dotenv.load_dotenv("ai_layer/keys.env")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")    

pc = Pinecone(api_key=PINECONE_API_KEY)

model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': False}
hf = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)


def search(text: str) -> list:
    vector = hf.embed_query(text)

    index = pc.Index(index_name="rag-search-engine",host="https://rag-search-engine-nuu3fjt.svc.aped-4627-b74a.pinecone.io")  

    results = index.query(
        vector=vector,
        top_k=3,
        namespace="pdf-search",  
        include_metadata=True
    )
    
    return [match['metadata'].get('lec_id') for match in results['matches']]