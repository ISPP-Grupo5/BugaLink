from rest_framework import serializers
from bugalinkapp.models import *


class main_page_serializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['idUser']

class individual_ride_acceptance_serializer(serializers.ModelSerializer):

    class Meta:
    
        model = IndividualRide
        fields = ['individual_lift', 'driver', 'acceptation_status']
class DriverRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverRating
        fields = '__all__'

class PassengerRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerRating
        fields = '__all__'
