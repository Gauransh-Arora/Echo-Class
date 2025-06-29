import asyncio
import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

load_dotenv("ai_layer/keys.env")

api = os.getenv("GROQ_SUMM")

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


if __name__ == "__main__":
    ir_text_chunks = [
        "Infrared (IR) spectroscopy is a technique used to identify and study chemicals by analyzing the infrared light absorbed by molecules.",
        "Molecules absorb specific frequencies of IR radiation that correspond to the vibrations between the atoms in the molecule.",
        "These vibrations include stretching, bending, and twisting motions of chemical bonds.",
        "The IR spectrum is a graph of infrared light absorbance or transmittance on the vertical axis and frequency or wavelength on the horizontal axis.",
        "Functional groups in molecules absorb IR radiation at specific frequencies, making IR spectroscopy a powerful tool for functional group identification.",
        "The fingerprint region, typically between 400 cm⁻¹ and 1500 cm⁻¹, is highly specific to individual molecules and helps distinguish similar compounds.",
        "Stretching vibrations occur when the bond length increases or decreases in a symmetric or asymmetric fashion.",
        "Bending vibrations involve changes in the angle between bonds, such as scissoring or rocking motions.",
        "A typical IR spectrum includes strong absorption bands for O–H, N–H, C=O, and C–H bonds.",
        "Water and CO₂ in the air can interfere with IR measurements and must be accounted for during analysis.",
        "Sample preparation methods for IR spectroscopy include using liquids between salt plates, solid samples as pellets with KBr, or thin films.",
        "Fourier Transform Infrared Spectroscopy (FTIR) is a modern variation that uses mathematical transforms to generate spectra with higher resolution.",
        "IR spectroscopy is non-destructive and commonly used in organic chemistry, pharmaceuticals, environmental science, and forensic analysis.",
        "The Beer-Lambert Law relates the absorbance of light to the properties of the material through which the light is traveling.",
        "IR spectroscopy can be used quantitatively to determine concentration by measuring absorbance at specific frequencies.",
        "Limitations of IR spectroscopy include difficulty in analyzing complex mixtures and limited ability to detect atoms like noble gases.",
        "An IR spectrum can be used to confirm the identity of a compound by comparing with reference spectra.",
        "Analyzing changes in the IR spectrum before and after a chemical reaction can provide insight into functional group transformations."
    ]

    mindmap = generate_mindmap_from_texts(ir_text_chunks)
    print(json.dumps(mindmap))

