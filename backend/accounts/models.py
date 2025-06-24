from django.contrib.auth.models import User
from django.db import models

class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=10)  # 'login' or 'logout'
    timestamp = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()
