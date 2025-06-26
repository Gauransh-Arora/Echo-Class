from pinecone import Pinecone
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain.chains import retrieval_qa   
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from sentence_transformers import SentenceTransformer
import time

class HuggingFaceEmbedder:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
    def embed_query(self, text):
        return self.model.encode(text).tolist()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)
embedder = HuggingFaceEmbedder()

from langchain_pinecone import PineconeVectorStore

pinecone_vectorstore = PineconeVectorStore(
    index_name= "rag-search-engine", 
    embedding=embedder, 
    text_key="chunk_text"
)

query = "test-query"

documents = pinecone_vectorstore.similarity_search(
    query=query,
    k=3  
)


template=(
  "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise."
  "Question: {question}"
  "Context: {context}"
  "Answer:"
)
prompt = PromptTemplate(input_variables=["question", "context"], template=template)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

qa_chain = (
    {
      "context": pinecone_vectorstore.as_retriever() | format_docs,
      "question": RunnablePassthrough(),
    }
    | prompt
    | llm
    | StrOutputParser()
)

def retry_on_rate_limit(func, *args, max_retries=5, **kwargs):
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
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

result = retry_on_rate_limit(qa_chain.invoke, query)




