from pinecone.grpc import PineconeGRPC as Pinecone
import os 
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import time

load_dotenv("ai_layer/keys.env")
PINECONE_API = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API")
pc = Pinecone(api_key=PINECONE_API)

index_name = "rag-search-engine"
namespace_name = "pdf-search"

index = pc.Index(name=index_name)

model = SentenceTransformer('all-MiniLM-L6-v2')

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
                "lec_id": str(lec_id)
            }
        },
        range(last_index + 1, last_index + len(record) + 1)
    ))

def retry_on_rate_limit(func, *args, max_retries=5, **kwargs):
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            # Pinecone may have its own rate limit error structure, but for consistency, check for a similar pattern
            if hasattr(e, "args") and e.args and isinstance(e.args[0], dict):
                err = e.args[0]
                if (
                    isinstance(err, dict)
                    and "error" in err
                    and err["error"].get("code") == "rate_limit_exceeded"
                ):
                    import re as _re
                    msg = err["error"].get("message", "")
                    match = _re.search(r"in ([\d.]+)s", msg)
                    wait_time = float(match.group(1)) if match else 6
                    print(f"Rate limit hit, waiting {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
            raise
    raise RuntimeError("Max retries exceeded for rate limit")

def embedd_and_upload(chunks:list,lec_id) -> None:
    documents = format_chunks(chunks,get_last_index(index_name,namespace_name),lec_id)
    vectors = []
    for doc in documents:
        vector = model.encode(doc["chunk_text"]).tolist()
        vectors.append({
            "id": doc["_id"],
            "values": vector,
            "metadata": doc["metadata"]
        })
    retry_on_rate_limit(index.upsert, vectors=vectors)

