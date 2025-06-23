from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User.objects.create_user(**validated_data)

        # Ensure Profile exists (signals should create it)
        profile, created = Profile.objects.get_or_create(user=user)
        profile.role = role
        profile.save()

        return user