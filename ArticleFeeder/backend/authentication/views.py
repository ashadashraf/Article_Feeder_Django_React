from rest_framework import generics
from .models import User
from rest_framework import serializers
from .serializers import UserSerializer, GenerateTokenPairSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView


# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Raise an exception if validation fails
        password = serializer.validated_data.get('password')
        confirm_password = request.data.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": ["Passwords do not match."]})

        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"password": e.messages})
        
        hashed_password = make_password(password)
        serializer.validated_data['password'] = hashed_password
        serializer.validated_data['is_active'] = True

        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()


class GenerateTokenPairView(TokenObtainPairView):
    serializer_class = GenerateTokenPairSerializer