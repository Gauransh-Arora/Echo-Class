from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ClassroomViewSet,
    UploadedMaterialViewSet,
    JoinClassroomView,
    SummaryView,
    StudentClassroomView,
    GenerateQuizView,
    ChatbotView,
    MindmapView,
    MaterialMindmapView
)

router = DefaultRouter()
router.register(r'classrooms', ClassroomViewSet)
router.register(r'materials', UploadedMaterialViewSet)

urlpatterns = router.urls + [
    path('join/', JoinClassroomView.as_view(),name="join-classroom"),
    path('summary/<int:pk>/', SummaryView.as_view(),name="summary"),
    path('student-classrooms/', StudentClassroomView.as_view(),name="student-classroom"),
    path("generate-quiz/", GenerateQuizView.as_view(), name="generate-quiz"),
    path('chatbot/', ChatbotView.as_view(), name="chatbot"),
    path('mindmap/', MindmapView.as_view(), name="mindmap"),
    path('material/<int:material_id>/mindmap/', MaterialMindmapView.as_view(), name="material-mindmap"),
]