from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ClassroomViewSet,
    UploadedMaterialViewSet,
    JoinClassroomView,
    SummaryView,
    StudentClassroomView, GenerateQuizView
)

router = DefaultRouter()
router.register(r'classrooms', ClassroomViewSet)
router.register(r'materials', UploadedMaterialViewSet)

urlpatterns = router.urls + [
    path('join/', JoinClassroomView.as_view()),
    path('summary/<int:pk>/', SummaryView.as_view()),
    path('student-classrooms/', StudentClassroomView.as_view()),
    path("generate-quiz/", GenerateQuizView.as_view(), name="generate-quiz"),
]