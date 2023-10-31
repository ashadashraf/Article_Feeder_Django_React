from django.urls import path
from . import views

urlpatterns = [
    path('user/create/', views.UserCreateView.as_view(), name='create-user'),
    path('user/token/', views.GenerateTokenPairView.as_view(), name='token_obtain_pair'),
]
