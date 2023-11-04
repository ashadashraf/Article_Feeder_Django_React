from rest_framework import generics, status
from .serializers import CategorySerializer, ArticleSerializer
from .models import Category, Article
from authentication.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from PIL import Image

# Create your views here.

class CategoryView(generics.CreateAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class GetAllCategories(generics.ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class CreateArticleView(generics.CreateAPIView):
    serializer_class = ArticleSerializer
    queryset = Article.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class GetAllArticles(generics.ListAPIView):
    serializer_class = ArticleSerializer
    queryset = Article.objects.filter(block=False)
    permission_classes = [IsAuthenticated]

class LikeDislikeArticleView(generics.UpdateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        article = self.get_object()
        user = self.request.user
        action_type = kwargs.get('type', None)
        liked = disliked = False

        if action_type == 'like':    
            if article.like.filter(id=user.id).exists():
                article.like.remove(user)
                liked = False
            else:
                article.like.add(user)
                liked = True
                article.dislike.remove(user)
                disliked = False
        elif action_type == 'dislike':
            if article.dislike.filter(id=user.id).exists():
                article.dislike.remove(user)
                disliked = False
            else:
                article.dislike.add(user)
                disliked = True
                article.like.remove(user)
                liked = False
        else:
            return Response({"detail": "Invalid action type."}, status=status.HTTP_400_BAD_REQUEST)
        
        like_count = article.like.count()
        user_likes_article = liked
        dislike_count = article.dislike.count()
        user_dislikes_article = disliked
        serialized_article = ArticleSerializer(article, context={'request': request}).data
        serialized_article['like_count'] = like_count
        serialized_article['user_likes_article'] = user_likes_article
        serialized_article['dislike_count'] = dislike_count
        serialized_article['user_dislikes_article'] = user_dislikes_article
        
        if action_type == 'like':
            if liked:
                message = 'Article like added successfully.'
            else:
                message = 'Article like removed successfully.'
        
        if action_type == 'dislike':
            if disliked:
                message = 'Article dislike added successfully.'
            else:
                message = 'Article dislike removed successfully.'

        return Response({"detail": message, "article": serialized_article}, status=status.HTTP_200_OK)
    
class UserBlockUnblockArticleView(generics.UpdateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        article = self.get_object()
        user = self.request.user
        is_author = request.data.get('author', False)

        print(is_author,'ssssss')
        if is_author:
            author_blocked_article = article.block
            if author_blocked_article:
                article.block = False
                message = 'unblock'
            else:
                article.block = True
                message = 'block'
        else:
            user_has_blocked = article.blocked_users.filter(id=user.id).exists()
            message = 'updat'
            if user_has_blocked:
                article.blocked_users.remove(user)
                message = 'unblock'
            elif not user_has_blocked:
                article.blocked_users.add(user)
                message = 'block'
            else:
                return Response({"detail": "Error in " + message + "ing article."}, status=status.HTTP_400_BAD_REQUEST)

        article.save()
        serialized_article = ArticleSerializer(article, context={'request': request}).data
        return Response({"detail": 'Article '+ message + 'ed successfully.', "article": serialized_article}, status=status.HTTP_200_OK)
    

class MyArticlesView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        id = self.kwargs.get('id')
        user = User.objects.get(id=id)
        return Article.objects.filter(author__id=user.id)