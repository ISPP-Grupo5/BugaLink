from rest_framework import serializers
from .models import *

class main_page_serializer(serializers.ModelSerializer):

    class Meta:
    
        model = User
        fields = ['idUser']

class RideSerializer(serializers.ModelSerializer):

    class Meta:

        model = Ride
        fields = '__all__'

class ListRideSerializer(serializers.Serializer):
    rides = RideSerializer(many=True)