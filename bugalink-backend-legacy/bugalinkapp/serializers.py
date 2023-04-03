from rest_framework import serializers
from .models import User, Passenger, Ride, Driver, DriverRating, PassengerRating, Vehicle, IndividualRide,PassengerRoutine, DriverRoutine, CreditCard, Paypal,DiscountCode,IndividualDiscountCode,PassengerDiscountCode,RoutineRequest,Report, Transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields    = '__all__'

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields    = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields    = '__all__'

class DriverRoutineSerializer(serializers.ModelSerializer):
    driver = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = DriverRoutine
        fields = '__all__'

    def create(self, validated_data):
        user_id = self.context['user_id']
        driver = Driver.objects.get(pk=user_id)
        routine = DriverRoutine.objects.create(driver=driver, **validated_data)
        return routine

class ListDriverRoutineSerializer(serializers.Serializer):
    driver_routines = DriverRoutineSerializer(many=True)

class RideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ride
        fields = '__all__'

class ListRideSerializer(serializers.Serializer):
    rides = RideSerializer(many=True)


class PassengerRoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerRoutine
        fields = ['start_longitude', 'start_latitude', 'end_longitude', 'end_latitude', 'start_location', 'end_location', 'day', 'end_date', 'start_time_initial', 'start_time_final']

    def create(self, validated_data):
        user_id = self.context['user_id']
        passenger = Passenger.objects.get(pk=user_id)
        routine = PassengerRoutine.objects.create(passenger=passenger, **validated_data)
        return routine

class ListPassengerRoutineSerializer(serializers.Serializer):
    passenger_routines = PassengerRoutineSerializer(many=True)

class IndividualRideSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualRide
        fields = '__all__'


class ListIndividualRideSerializer(serializers.Serializer):
    individual_rides = IndividualRideSerializer(many=True)


class RoutineRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutineRequest
        fields = '__all__'

class ListRoutineRequestSerializer(serializers.Serializer):
    routines_requests = RoutineRequestSerializer(many=True)

class ListIndividualRideAndRoutineRquestSerializer(serializers.Serializer):
    individual_rides = IndividualRideSerializer(many=True)
    routine_requests = RoutineRequestSerializer(many=True)

class DriverRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverRating
        fields = '__all__'


class PassengerRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerRating
        fields = '__all__'

class ListRatingSelieaizer(serializers.Serializer):
    driver_rating = DriverRatingSerializer(many=True)
    passenger_rating = PassengerRatingSerializer(many=True)


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class RoutineRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutineRequest
        fields = '__all__'

class CreditCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCard
        fields = '__all__'

class PaypalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paypal
        fields = '__all__'

class Transaction(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class DiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountCode
        fields = '__all__'

class PassengerDiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerDiscountCode
        fields = '__all__'

class IndividualDiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualDiscountCode
        fields = '__all__'

class DriverPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['preference_0', 'preference_1', 'preference_2', 'preference_3']