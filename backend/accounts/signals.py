from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from .models import ActivityLog

@receiver(user_logged_in)
def log_login(sender, request, user, **kwargs):
    ActivityLog.objects.create(user=user, activity_type='login')

@receiver(user_logged_out)
def log_logout(sender, request, user, **kwargs):
    ActivityLog.objects.create(user=user, activity_type='logout')
