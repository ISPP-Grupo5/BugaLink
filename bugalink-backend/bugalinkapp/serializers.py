from rest_framework import serializers
from bugalinkapp.models import *

class UserSerializer(serializers.ModelSerializer):

    class Meta:
    
        model = User
        fields = '__all__'

class IndividualRideSerializer(serializers.ModelSerializer):

    class Meta:
    
        model = IndividualRide
        fields = '__all__'

class ListaIndividualRideSerializer(serializers.Serializer):
    rides = IndividualRideSerializer(many=True)

class DriverRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverRating
        fields = '__all__'

class PassengerRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerRating
        fields = '__all__'
