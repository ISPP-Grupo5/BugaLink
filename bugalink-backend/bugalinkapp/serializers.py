from rest_framework import serializers
from bugalinkapp.models import User

class main_page_serializer(serializers.ModelSerializer):

    class Meta:
    
        model = User
        fields = ['idUser']
