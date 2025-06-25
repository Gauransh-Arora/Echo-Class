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
from classrooms.tasks import process_uploaded_material
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
        print(f"Processing material {instance.id}")  # Debug print
        process_uploaded_material(instance.id)
        print(f"Material {instance.id} processed")  # Debug print
        return Response({"message": "File uploaded. Processing in background."}, status=201)

    def get_queryset(self):
        queryset = super().get_queryset()
        classroom_id = self.request.query_params.get('classroom')
        if classroom_id:
            queryset = queryset.filter(classroom_id=classroom_id)
        return queryset


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
