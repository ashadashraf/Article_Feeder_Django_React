from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('create/category/', views.CategoryView.as_view(), name='create-category'),
    path('allcategories/', views.GetAllCategories.as_view(), name='get-all-categories'),
    path('create/article/', views.CreateArticleView.as_view(), name='create-article'),
    path('allarticles/', views.GetAllArticles.as_view(), name='all-articles'),
    path('likedislike/<int:id>/<str:type>/', views.LikeDislikeArticleView.as_view(), name='like-dislike-article'),
    path('user/blockarticle/<int:id>/', views.UserBlockUnblockArticleView.as_view(), name='user-block-article'),
    path('myarticles/<int:id>/', views.MyArticlesView.as_view(), name='my-articles'),
]