from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Classroom, UploadedMaterial, ClassroomMembership
from .serializers import ClassroomSerializer, UploadedMaterialSerializer
from ai_layer.extract_and_clean import extract_and_clean
from ai_layer.chunk_and_summary import chunk_generator, summariser
from ai_layer.flashcard_and_quiz_generator import generate_flash, generate_quiz
from ai_layer.embedd_and_upload import embedd_and_upload
from ai_layer.chatbot import pdf_chat
from classrooms.tasks import process_uploaded_material
from ai_layer.mindmap import generate_mindmap_from_texts
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from classrooms.models import UploadedMaterial
from ai_layer.chunk_and_summary import chunk_generator, summariser


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()  # Add this line
    serializer_class = ClassroomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self): 
        return Classroom.objects.filter(teacher=self.request.user)

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    
class StudentClassroomView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        memberships = ClassroomMembership.objects.filter(student=request.user)
        classrooms = [membership.classroom for membership in memberships]
        serializer = ClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)


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
            return Response({"message": "Joined classroom"})
        except Classroom.DoesNotExist:
            return Response({"error": "Invalid code"}, status=400)


class SummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            material = UploadedMaterial.objects.get(pk=pk)
        except UploadedMaterial.DoesNotExist:
            return Response({"error": "Material not found."}, status=status.HTTP_404_NOT_FOUND)

        # If summary already exists
        if material.summary:
            return Response({"summary": material.summary})

        # Get cleaned text
        full_text = material.cleaned_text
        if not full_text:
            return Response({"error": "No cleaned text available."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate summary
        chunks = chunk_generator(full_text)
        summary_chunks = summariser(chunks)
        final_summary = "\n\n".join(summary_chunks)

        # Save summary to Database
        material.summary = final_summary
        material.save()

        return Response({"summary": final_summary})



class ChatbotView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_message = request.data.get("message")
        if not user_message:
            return Response({"error": "Message is required"}, status=400)
        try:
            # Get the authenticated user's ID for the thread_id
            thread_id = str(request.user.id)  # Using user ID as thread identifier
            response = pdf_chat(user_message, thread_id)
            return Response({"response": response})
        except Exception as e:
            return Response({"error": str(e)}, status=500)



class GenerateQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        material_id = request.data.get("material_id")
        if not material_id:
            return Response({"error": "material_id is required"}, status=400)

        try:
            material = UploadedMaterial.objects.get(id=material_id)

            if not material.summary:
                return Response({"error": "Summary not found for this material."}, status=404)

            # Generate quiz from summary
            quiz_json_str = generate_quiz(material.summary)

            # Parse and store the quiz
            quiz = json.loads(quiz_json_str)
            material.quiz = quiz
            material.save()

            return Response({"quiz": quiz}, status=200)

        except UploadedMaterial.DoesNotExist:
            return Response({"error": "Material not found."}, status=404)
        except json.JSONDecodeError:
            return Response({"error": "Quiz generation failed: Invalid JSON returned by LLM."}, status=500)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class MindmapView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        summaries = request.data.get("summaries")
        if not summaries or not isinstance(summaries, list):
            return Response({"error": "A list of summaries is required."}, status=400)
        try:
            mindmap = generate_mindmap_from_texts(summaries)
            return Response(mindmap, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class MaterialMindmapView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, material_id):
        try:
            material = UploadedMaterial.objects.get(id=material_id)
            if not material.mindmap:
                return Response({"error": "Mindmap not found for this material."}, status=404)
            return Response({"mindmap": material.mindmap}, status=200)
        except UploadedMaterial.DoesNotExist:
            return Response({"error": "Material not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)