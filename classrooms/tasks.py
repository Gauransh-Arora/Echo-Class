from background_task import background
from .models import UploadedMaterial
from ai_layer.extract_and_clean import extract_and_clean
from ai_layer.chunk_and_summary import chunk_generator, summariser
from ai_layer.flashcard_and_quiz_generator import generate_flash, generate_quiz
from ai_layer.embedd_and_upload import embedd_and_upload

@background(schedule=1)
def process_uploaded_material(material_id):
    print(f"Processing material {material_id}")  # Debug print
    instance = UploadedMaterial.objects.get(id=material_id)
    file_path = instance.file.path

    cleaned_text = extract_and_clean(file_path)
    print("Cleaned text extracted")  # Debug print
    instance.cleaned_text = cleaned_text

    chunks = chunk_generator(cleaned_text)
    summaries = summariser(chunks)
    summary_text = " ".join(summaries)
    print("Summary generated")  # Debug print
    instance.summary = summary_text

    instance.flashcards = generate_flash(summary_text)
    instance.quiz = generate_quiz(summary_text)

    embedd_and_upload(summaries, str(instance.uuid))
    print("Embeddings uploaded")  # Debug print
    instance.save()
    print(f"Finished processing material {material_id}")  # Debug print
