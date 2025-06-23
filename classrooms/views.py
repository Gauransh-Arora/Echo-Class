from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Classroom, UploadedMaterial, ClassroomMembership
from .serializers import ClassroomSerializer, UploadedMaterialSerializer

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
