from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
class RideSerializer(serializers.ModelSerializer):

    class Meta:

        model = Ride
        fields = '__all__'

class ListRideSerializer(serializers.Serializer):
    rides = RideSerializer(many=True)


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


class RideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ride
        fields = '__all__'


class PassengerRoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerRoutine
        fields = '__all__'


class DriverRoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverRoutine
        fields = '__all__'
