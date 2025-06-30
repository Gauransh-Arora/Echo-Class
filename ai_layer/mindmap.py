import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

load_dotenv("ai_layer/keys.env")

api = os.getenv("GRQ_API_KEY")

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,
    max_tokens=2048,
    timeout=60,
    api_key=api
)

tree_prompt = PromptTemplate.from_template(
    """
You are a concept extraction assistant that builds mind maps.

Extract a hierarchical concept tree in JSON format from the text.

Respond strictly with JSON in the following format and dont include any llm response strings like sure here is.... :

{{
  "name": "Root Topic",
  "description": "Optional description",
  "formula": "Optional formula",
  "children": [
    {{
      "name": "Subtopic",
      "description": "...",
      "formula": "...",
      "children": [...]
    }}
  ]
}}


Text:
{text}
"""
)

import json

def generate_mindmap_from_texts(texts: list[str], llm=llm) -> dict:
    joined_text = "\n".join(texts)
    
    formatted_prompt = tree_prompt.format(text=joined_text)
    
    # Call the LLM
    response = llm.invoke(formatted_prompt).content.strip()

    # Strip out any wrapping ```json blocks
    response = response.strip("` \n")

    # Debug print if empty
    if not response:
        raise ValueError(" LLM returned an empty response. Check your prompt or input.")

    try:
        # Attempt to parse
        mindmap = json.loads(response)
        return mindmap
    except json.JSONDecodeError as e:
        print(" Raw LLM output:\n", response)  # Helpful for debugging malformed JSON
        raise ValueError(f" Failed to parse JSON from LLM output: {e}")

