from django.urls import path
from .views import RegisterView, ProfileView, ActivityChartView, LogoutView, CustomTokenObtainPairView, profile_update
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('activity-chart/', ActivityChartView.as_view(), name='activity-chart'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile-update/', profile_update.as_view(), name='profile-update'),
]