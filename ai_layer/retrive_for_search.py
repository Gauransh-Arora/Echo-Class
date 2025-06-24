from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import dotenv
import os

dotenv.load_dotenv("ai_layer/keys.env")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

pc = Pinecone(api_key=PINECONE_API_KEY)

class HuggingFaceEmbedder:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
    def embed_query(self, text):
        return self.model.encode(text).tolist()

embedder = HuggingFaceEmbedder()

def search(text: str) -> list:
    vector = embedder.embed_query(text)

    index = pc.Index(index_name="rag-search-engine")  

    results = index.query(
        vector=vector,
        top_k=3,
        namespace="pdf-search",  
        include_metadata=True
    )

    return [match['metadata'].get('lec_id') for match in results['matches']]


