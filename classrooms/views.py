from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Classroom, UploadedMaterial, ClassroomMembership
from .serializers import ClassroomSerializer, UploadedMaterialSerializer
from ai_layer.extract_and_clean import extract_and_clean
from ai_layer.chunk_and_summary import chunk_generator, summariser
from ai_layer.flashcard_and_quiz_generator import generate_flash, generate_quiz
from ai_layer.embedd_and_upload import embedd_and_upload
from ai_layer.chatbot_logic import qa_chain
import time


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class UploadedMaterialViewSet(viewsets.ModelViewSet):
    queryset = UploadedMaterial.objects.all()
    serializer_class = UploadedMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save()
        file_path = instance.file.path

        cleaned_text = extract_and_clean(file_path)
        instance.cleaned_text = cleaned_text

        chunks = chunk_generator(cleaned_text)
        summaries = summariser(chunks)
        summary_text = " ".join(summaries)
        instance.summary = summary_text

        instance.flashcards = generate_flash(summary_text)
        instance.quiz = generate_quiz(summary_text)

        embedd_and_upload(summaries, instance.uuid)

        instance.save()

class JoinClassroomView(APIView):
    def post(self, request):
        code = request.data.get("code")
        try:
            classroom = Classroom.objects.get(code=code)
            ClassroomMembership.objects.get_or_create(
                student=request.user, classroom=classroom
            )
            return Response({"message": "Joined classrooms"})
        except Classroom.DoesNotExist:
            return Response({"error": "Invalid code"}, status=400)

class SummaryView(APIView):
    def get(self, request, pk):
        return Response({
            "summary": "This is a dummy summary.",
            "quiz": ["Q1", "Q2"],
            "mindmap": "https://fake-link.com/mindmap.png"
        })

class ChatbotView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        user_message = request.data.get("message")
        if not user_message:
            return Response({"error": "Message is required"}, status=400)
        try:
            response = qa_chain.invoke({"question": user_message})
            time.sleep(1)
            return Response({"response": response})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

