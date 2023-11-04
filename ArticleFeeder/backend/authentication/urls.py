from django.urls import path
from . import views

urlpatterns = [
    path('user/create/', views.UserCreateView.as_view(), name='create-user'),
    path('user/token/', views.GenerateTokenPairView.as_view(), name='token_obtain_pair'),
    path('user/updatedata/<int:id>/', views.UpdateUserDataView.as_view(), name='update-user-data'),
    path('user/data/<int:id>/', views.UserDataView.as_view(), name='user-data'),
    path('user/addremovepreference/<int:id>/', views.CategoryPreferenceView.as_view(), name='user-add-remove-preference'),
]
