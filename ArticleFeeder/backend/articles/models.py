from django.db import models
from django.conf import settings

# Create your models here.

class Category(models.Model):
    name = models.CharField(unique=True, max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    

class Article(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False, blank=False)
    name = models.CharField(max_length=30, null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    image = models.ImageField(upload_to="=media/images", null=False, blank=False)
    tags = models.CharField(max_length=20, null=False, blank=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='articles', null=False, blank=False)
    like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_articles', blank=True)
    dislike = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='disliked_articles', blank=True)
    block = models.BooleanField(default=False)
    blocked_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='blocked_articles', blank=True)