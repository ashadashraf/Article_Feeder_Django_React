from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.

class User(AbstractUser):
    phone_number = models.CharField(max_length=15)
    dob = models.DateField()
    password = models.CharField(max_length=150)

    def __str__(self):
        return self.email
    
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'phone_number', 'dob', 'password']
    USERNAME_FIELD = 'email'