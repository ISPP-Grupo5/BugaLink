from django.db import models

from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from enum import Enum


# Create your models here.
class RideStatus(Enum):
    Pending_start = 'Pending start'
    Ongoing = 'Ongoing'
    Finished = 'Finished'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

class AcceptationStatus(Enum):
    Accepted = 'Accepted'
    Cancelled = 'Cancelled'
    Pending_Confirmation = 'Pending Confirmation'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

class Coord(models.Field):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 50
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, expression, connection):
        try:
            if not value:
                return value
            values = value.split(',')
            return (float(v) for v in values)
        except Exception:
            raise ValidationError

    def to_python(self, value):
        return self.from_db_value(value, None, None)

    def get_prep_value(self, value):
        try:
            if not value:
                return value
            return ','.join(str(coord) for coord in value)
        except Exception:
            raise ValidationError

    def db_type(self, connection):
        return 'varchar'


class Passenger(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    biography = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    province = models.CharField(max_length=256)
    birth_date = models.DateField()
    balance = models.DecimalField(max_digits=8, decimal_places=2)
    photo = models.ImageField(null=True)
    verified = models.BooleanField(default=False)

class Driver(models.Model):
    passenger = models.OneToOneField(Passenger, primary_key=True, on_delete=models.CASCADE)
    preferences = models.CharField(max_length=2048)
    biography = models.CharField(max_length=256)
    has_dni = models.BooleanField(default=False)
    entry_date = models.DateField()
    has_driver_license = models.BooleanField(default=False)
    has_sworn_declaration = models.BooleanField(default=False)
    sworn_declaration = models.FileField(null=True)
    driver_license = models.FileField(null=True)
    dni_front = models.FileField(null=True)
    dni_back = models.FileField(null=True)

class Vehicle(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    model = models.CharField(max_length=256)
    plate = models.CharField(max_length=256)
    has_insurance = models.BooleanField(default=False)
    insurance = models.FileField(null=True)

class DriverRoutine(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    default_vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True)
    default_num_seats = models.IntegerField(validators=[MinValueValidator(1)])
    start_date = models.TimeField()
    end_date = models.TimeField()
    start_location = Coord(null=False)
    end_location = Coord(null=False)
    days = models.CharField(max_length=20)
    one_ride = models.BooleanField(default=False)

class Ride(models.Model):
    driver_routine = models.ForeignKey(DriverRoutine, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    num_seats = models.IntegerField()  # Relacionarlo con default_num_seats
    status = models.CharField(max_length=256, choices=RideStatus.choices(), default=RideStatus.Pending_start)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_location = Coord(null=False)
    end_location = Coord(null=False)

class PassengerRoutine(models.Model):
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    start_location = Coord(null=False)
    end_location = Coord(null=False)
    days = models.CharField(max_length=256)
    end_date = models.TimeField()
    start_time_initial = models.TimeField()
    start_time_final = models.TimeField()

class IndividualRide(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    passenger_routine= models.ForeignKey(PassengerRoutine, on_delete=models.CASCADE, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    ride_status = models.CharField(max_length=256, choices=RideStatus.choices(), default=RideStatus.Pending_start)
    acceptation_status = models.CharField(max_length=256, choices=AcceptationStatus.choices(), default=AcceptationStatus.Pending_Confirmation)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_location = Coord(null=False)
    end_location = Coord(null=False)
    message= models.CharField(max_length=256, null=True)

class DriverRating(models.Model):
    individual_ride = models.OneToOneField(IndividualRide, null=False, on_delete=models.CASCADE) # Validar que sólo se pueda hacer una vez por viaje
    rating = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    comment = models.CharField(max_length=1024)

class PassengerRating(models.Model):
    individual_ride = models.OneToOneField(IndividualRide, null=False, on_delete=models.CASCADE) # Validar que sólo se pueda hacer una vez por viaje
    rating = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    comment = models.CharField(max_length=1024)

class Report(models.Model):
    individual_ride = models.OneToOneField(IndividualRide, null=False, on_delete=models.CASCADE) # Validar que sólo se pueda hacer una vez por viaje
    message = models.CharField(max_length=1024)
    is_user_reported_the_driver = models.BooleanField(null=False)

class RoutineRequest(models.Model):
    passenger_routine = models.ForeignKey(PassengerRoutine, on_delete=models.CASCADE)
    driver_routine = models.ForeignKey(DriverRoutine, on_delete=models.CASCADE)
    day = models.CharField(max_length=3)
    acceptation_status = models.CharField(max_length=256, choices=AcceptationStatus.choices(), default=AcceptationStatus.Pending_Confirmation)

class CreditCard(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    card = models.CharField(max_length=32)
    CVC = models.CharField(max_length=16)
    expiration_date = models.DateField()

class Paypal(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    email = models.CharField(max_length=256)
    password = models.CharField(max_length=256)

class FavDirection(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    location = Coord(null=False)
    direction = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    cp = models.CharField(max_length=10)

class DiscountCode(models.Model):
    code = models.CharField(max_length=256, unique=True)
    discount_perc = models.FloatField(validators=[MinValueValidator(0.0),MaxValueValidator(1.0)])
    rides = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField()

class PassengerDiscountCode(models.Model):
    discount = models.ForeignKey(DiscountCode, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    activation_date = models.DateField()
    rides_left = models.IntegerField()
    active = models.BooleanField(default=True)

class IndividualDiscountCode(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    code = models.CharField(max_length=256, unique=True)
    discount_perc = models.FloatField(validators=[MinValueValidator(0.0),MaxValueValidator(1.0)])
    start_date = models.DateField()
    end_date = models.DateField()
    initial_rides = models.IntegerField()
    rides_left = models.IntegerField()
    active = models.BooleanField(default=True)