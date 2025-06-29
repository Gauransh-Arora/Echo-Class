from background_task import background
import asyncio
from .models import UploadedMaterial
from ai_layer.extract_and_clean import extract_and_clean
from ai_layer.chunk_and_summary import chunk_generator, summariser
from ai_layer.flashcard_and_quiz_generator import generate_flash, generate_quiz
from ai_layer.embedd_and_upload import embedd_and_upload
from ai_layer.mindmap import generate_mindmap_from_texts

@background(schedule=1)
def process_uploaded_material(material_id):
    print(f"Processing material {material_id}")  
    instance = UploadedMaterial.objects.get(id=material_id)
    file_path = instance.file.path

    cleaned_text = extract_and_clean(file_path)
    print("Cleaned text extracted")  
    instance.cleaned_text = cleaned_text

    chunks = chunk_generator(cleaned_text)
    summaries = summariser(chunks)
    summary_text = " ".join(summaries)
    print("Summary generated")
    instance.summary = summary_text

    async def generate_study_material(summary_text: str):
        flash_task = asyncio.to_thread(generate_flash, summary_text)
        quiz_task = asyncio.to_thread(generate_quiz, summary_text)

        flashcards, quiz = await asyncio.gather(flash_task, quiz_task)
        return flashcards , quiz
    
    flashcards, quiz = asyncio.run(generate_study_material(summary_text))

    instance.flashcards = flashcards
    instance.quiz = quiz

    embedd_and_upload(summaries, str(instance.uuid))
    print("Embeddings uploaded")  # Debug print
    instance.mindmap = generate_mindmap_from_texts(summaries)
    instance.save()
    print(f"Finished processing material {material_id}")  # Debug print
