from rest_framework import serializers
from .models import newsletter

class newsletter_serializer(serializers.ModelSerializer):

    class Meta:
    
        model = newsletter
        fields = ['email']