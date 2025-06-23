from rest_framework import serializers
from .models import Classroom, UploadedMaterial

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ['id', 'code', 'teacher']
        read_only_fields = ['teacher']

class UploadedMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedMaterial
        fields = '__all__'