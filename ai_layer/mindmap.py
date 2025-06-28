# import asyncio
# import os
# from dotenv import load_dotenv
# from langchain_groq import ChatGroq
# from langchain_experimental.graph_transformers import LLMGraphTransformer
# from langchain_core.documents import Document

# load_dotenv("ai_layer/keys.env")

# llm = ChatGroq(
#     model="llama-3.1-8b-instant",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
# )

# llm_transformer = LLMGraphTransformer(llm=llm)

# async def main():
#     graph_documents = await llm_transformer.aconvert_to_graph_documents(documents)
#     print(f"Nodes:\n{graph_documents[0].nodes}")
#     print(f"Relationships:\n{graph_documents[0].relationships}")

# def generate_mindmap_from_texts(texts: list[str], llm = llm) -> dict:

#     documents = [(Document(page_content=doc)) for doc in texts]

#     transformer = LLMGraphTransformer(llm=llm)

#     graph_documents = asyncio.run(transformer.aconvert_to_graph_documents(documents))
#     graph = graph_documents[0]

#     mindmap = {
#         "nodes": [
#             {
#                 "id": node.id,
#                 "label": getattr(node, "type", node.id)
#             }
#             for node in graph.nodes
#         ],
#         "edges": [
#             {
#                 "source": edge.source,
#                 "target": edge.target,
#                 "label": getattr(edge, "label", "related_to")
#             }
#             for edge in graph.relationships
#         ]
#     }

#     return mindmap
