from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from articles.models import Category

# Create your models here.

class User(AbstractUser):
    phone_number = models.CharField(max_length=15)
    dob = models.DateField()
    password = models.CharField(max_length=150)

    def get_default_category_preference():
        return Category.objects.all()
    
    category_preference = models.ManyToManyField(Category, related_name='category_preferences', default=get_default_category_preference, blank=True)

    def __str__(self):
        return self.email
    
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'phone_number', 'dob', 'password', 'category_preferences']
    USERNAME_FIELD = 'email'