from rest_framework import serializers
from .models import Category, Article
from authentication.models import User
from authentication.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    author_first_name = serializers.SerializerMethodField()
    # like = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    user_likes_article = serializers.SerializerMethodField()
    user_has_blocked_article = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = '__all__'
        
    def get_author_first_name(self, article):
        author_user = User.objects.get(id=article.author.id)
        return author_user.first_name
        
    def get_like(self, article):
        liked_users_data = UserSerializer(article.like.all(), many=True).data
        return liked_users_data
    
    def get_like_count(self, article):
        return article.like.count()

    def get_user_likes_article(self, article):
        user = self.context['request'].user
        return article.like.filter(id=user.id).exists()
    
    def get_user_has_blocked_article(self, article):
        user = self.context['request'].user
        return article.blocked_users.filter(id=user.id).exists()