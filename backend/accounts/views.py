from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny,IsAuthenticated
from django.db.models import Count
from django.db.models.functions import TruncDate
from .models import ActivityLog
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class ActivityChartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = ActivityLog.objects.annotate(day=TruncDate('timestamp')).values('day', 'activity_type').annotate(count=Count('id'))
        return Response(data)
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except KeyError:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
# @api_view(['POST'])
# @permission_classes([AllowAny])
# def debug_login(request):
#     username = request.data.get('username')
#     password = request.data.get('password')
#     print(f"--- DEBUG: Attempting login for '{username}' with password: '{password}' ---")

#     user = authenticate(username=username, password=password)

#     if user:
#         return Response({
#             'message': 'User authenticated successfully!',
#             'user': user.username,
#             'is_active': user.is_active,
#         })
    
#     user_exists = User.objects.filter(username=username).exists()
#     if user_exists:
#         return Response({'error': 'Authentication failed. User exists, but password was incorrect.'}, status=401)
#     else:
#         return Response({'error': 'Authentication failed. User does not exist.'}, status=401)