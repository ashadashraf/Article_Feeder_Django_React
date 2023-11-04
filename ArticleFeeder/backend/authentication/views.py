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
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


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


class UpdateUserDataView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        data = request.data
        if 'username' in data:
            del data['username']
        if 'phone_number' in data:
            del data['phone_number']
        if 'dob' in data:
            del data['dob']

        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            return Response(
                {"error": "Passwords do not match"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if password:
            try:
                validate_password(password)
            except ValidationError as e:
                return Response(
                    {"error": e.messages},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password = make_password(password)
        
        user.email = data.get('email')
        user.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDataView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        user = User.objects.get(id=kwargs['id'])
        serialized_user = self.get_serializer(user)
        return Response(serialized_user.data, status=status.HTTP_200_OK)
    

#User Sameview for update and retrive of user


class CategoryPreferenceView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_url_kwarg = 'id'

    def update(self, request, *args, **kwargs):
        user_preference = self.get_object()
        data = request.data
        category = data.get('category_id')
        message = ''
        
        category_exist = user_preference.category_preference.filter(id=category).exists()
        if category_exist:
            user_preference.category_preference.remove(category)
            message = 'removed'
        elif not category_exist:
            user_preference.category_preference.add(category)
            message = 'added'
        else:
            print('yes')
            return Response({"detail": "Error in updating category preference."}, status=status.HTTP_400_BAD_REQUEST)
        
        user_preference.save()
        serialized_user_preference = UserSerializer(user_preference)
        return Response({"detail": 'User Category Preference '+ message + ' successfully.', "article": serialized_user_preference.data}, status=status.HTTP_200_OK)
        

    # def get(self, request, *args, **kwargs):
    #     user = self.request.user
