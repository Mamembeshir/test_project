from django.urls import path
from .views import RegisterView, ProfileView, ActivityChartView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('activity-chart/', ActivityChartView.as_view(), name='activity-chart'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
