from pinecone.grpc import PineconeGRPC as Pinecone
import os 
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from huggingface_hub import login
import time

load_dotenv("ai_layer/keys.env")
PINECONE_API = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=PINECONE_API)
login(os.getenv("HUGGINGFACE_HUB_TOKEN"))
      
index_name = "rag-search-engine"
namespace_name = "pdf-search"

index = pc.Index(name=index_name)

model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': False}
hf = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

def get_last_index(index_name: str, namespace_name: str) -> int:
    """Get the count of existing vectors to determine next ID"""
    stats = index.describe_index_stats()
    namespace_stats = stats['namespaces'].get(namespace_name, {})
    return namespace_stats.get('vector_count', 0)

def format_chunks(chunks: list, start_index: int, lec_id: str) -> list:
    """Format chunks with proper IDs and metadata"""
    return [
        {
            "id": f"{lec_id}_chunk_{i}",  # Unique string ID
            "chunk_text": chunk,
            "metadata": {
                "lec_id": str(lec_id),
                "chunk_text": chunk,
                "chunk_num": i
            }
        }
        for i, chunk in enumerate(chunks, start=start_index + 1)
    ]

def embedd_and_upload(chunks: list, lec_id: str) -> None:
    """Process and upload document chunks to Pinecone"""
    try:
        # Get current vector count
        last_index = get_last_index(index_name, namespace_name)
        
        # Format documents with proper IDs
        documents = format_chunks(chunks, last_index, lec_id)
        
        # Prepare vectors for upload
        vectors = []
        for doc in documents:
            vector = hf.embed_query(doc["chunk_text"])
            vectors.append({
                "id": doc["id"],
                "values": vector,
                "metadata": doc["metadata"]
            })
        
        # Upload in batches of 100 (Pinecone's recommended limit)
        for i in range(0, len(vectors), 100):
            batch = vectors[i:i + 100]
            index.upsert(vectors=batch, namespace=namespace_name)
            
        print(f"Successfully uploaded {len(vectors)} chunks for lecture {lec_id}")
        
    except Exception as e:
        print(f"Error uploading to Pinecone: {str(e)}")
        raise  # Re-raise to trigger task retry
