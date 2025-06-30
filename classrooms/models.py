from django.db import models
from django.contrib.auth.models import User
import uuid

class Classroom(models.Model):
    code = models.CharField(max_length=10, unique=False)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['code']
        unique_together = ('code', 'teacher')
        verbose_name = 'Classroom'
        verbose_name_plural = 'Classrooms'

class ClassroomMembership(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)

    class Meta:
        ordering = ['student', 'classroom']
        unique_together = ('student', 'classroom')
        verbose_name = 'Classroom Membership'
        verbose_name_plural = 'Classroom Memberships'


class UploadedMaterial(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    file = models.FileField(upload_to='materials/')
    title = models.TextField(blank=False, null= False , default='Untitled Material')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    cleaned_text = models.TextField(blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    flashcards = models.JSONField(blank=True, null=True)
    quiz = models.JSONField(blank=True, null=True)
    mindmap = models.JSONField(blank=True, null=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)

    class Meta:
        ordering = ['classroom', 'uploaded_at']
        get_latest_by = 'uploaded_at'
        verbose_name = 'Uploaded Material'
        verbose_name_plural = 'Uploaded Materials'