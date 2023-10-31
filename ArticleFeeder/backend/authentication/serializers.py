from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import permissions

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class GenerateTokenPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(GenerateTokenPairSerializer, cls).get_token(user)
        token['user_id'] = user.id
        token['email'] = user.email
        # token['username'] = user.username
        # token['first_name'] = user.first_name
        # token['last_name'] = user.last_name
        # token['phone_number'] = user.phone_number
        # token['dob'] = user.dob.strftime('%Y-%m-%d')
        # token['password'] = user.password
        # token['is_superuser'] = user.is_superuser

        return token
    