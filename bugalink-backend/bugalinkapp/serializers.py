from rest_framework import serializers
from bugalinkapp.models import *

class main_page_serializer(serializers.ModelSerializer):

    class Meta:
    
        model = User
        fields = '__all__'

class individual_ride_acceptance_serializer(serializers.ModelSerializer):

    class Meta:
    
        model = IndividualRide
        fields = '__all__'
