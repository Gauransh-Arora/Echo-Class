from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered!"}, status=201)
        return Response(serializer.errors, status=400)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile  # assuming OneToOne profile exists

        return Response({
            "username": user.username,
            "role": profile.role
        })

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Assuming your User model has a related profile with role
        token['username'] = user.username
        token['role'] = user.profile.role  

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.profile.role  
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
