from django.db import models
from django.contrib.auth.models import User
import uuid

class Classroom(models.Model):
    code = models.CharField(max_length=10, unique=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)

class ClassroomMembership(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)

class UploadedMaterial(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    file = models.FileField(upload_to='materials/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    cleaned_text = models.TextField(blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    flashcards = models.JSONField(blank=True, null=True)
    quiz = models.JSONField(blank=True, null=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)