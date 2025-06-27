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

def get_last_index(index_name:str,namespace_name:str):
    cursor = pc.Index(index_name)
    records = list(cursor.list(namespace = namespace_name))  
    a = []
    b = []
    for item in records:
        items = list(map(lambda x : int(x), item))
        a.append(items)
        for i in a:
            b.append(max(i))
    try:
        return(max(b))
    except:
        return 0

def format_chunks(record: list, last_index: int, lec_id: str):
    return list(map(
        lambda i: {
            "_id": f"doc_{i}",
            "chunk_text": record[i - last_index - 1],
            "metadata": {
                "lec_id": str(lec_id),
                "chunk_text": record[i - last_index - 1]  
            }
        },
        range(last_index + 1, last_index + len(record) + 1)
    ))

def embedd_and_upload(chunks:list,lec_id) -> None:
    documents = format_chunks(chunks,get_last_index(index_name,namespace_name),lec_id)
    vectors = []
    for doc in documents:
        vector = hf.embed_query(doc["chunk_text"])
        vectors.append({
            "id": doc["_id"],
            "values": vector,
            "metadata": doc["metadata"]
        })
    index.upsert(vectors=vectors,namespace=namespace_name)
print(index.describe_index_stats())
