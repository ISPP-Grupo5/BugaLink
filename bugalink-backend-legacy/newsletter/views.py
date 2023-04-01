from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core import serializers
from rest_framework.views import APIView
from .models import newsletter
from django.http import HttpResponse

from rest_framework import serializers


class newsletter_post(APIView):
    def post(self, request): 
        try:
            new_newsletter = newsletter.objects.create(email = request.data['email'])
            new_newsletter.save()
            return HttpResponse('True')
        except Exception:
            return HttpResponse('False')
