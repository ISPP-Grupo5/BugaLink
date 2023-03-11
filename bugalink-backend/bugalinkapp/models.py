from django.db import models

from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from enum import Enum


# Create your models here.
class LiftStatus(Enum):
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
        if value is None:
            return None
        return list(map(float, value.split(',')))

    def to_python(self, value):
        if isinstance(value, list):
            return value
        if value is None:
            return None
        return list(map(float, value.split(',')))

    def get_prep_value(self, value):
        if not value:
            return value
        return ','.join(str(coord) for coord in value)

    def db_type(self, connection):
        return 'varchar'


class Passenger(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    city = models.CharField(max_length=256)
    province = models.CharField(max_length=256)
    biography = models.CharField(max_length=256)
    birth_date = models.DateField()
    balance = models.DecimalField(max_digits=8, decimal_places=2)
    photo = models.FileField(null=True)
    verified = models.BooleanField(default=False)


class Driver(models.Model):
    passenger = models.OneToOneField(Passenger, primary_key=True, on_delete=models.CASCADE)
    preferences = models.CharField(max_length=2048)
    biography = models.CharField(max_length=256)
    has_driver_license = models.BooleanField(default=False)
    has_sworn_declaration = models.BooleanField(default=False)
    entry_date = models.DateField(null=True)
    sworn_declaration = models.FileField()
    driver_license = models.FileField()
    dni_front = models.FileField()
    dni_back = models.FileField()


class Rating(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    value = models.FloatField(default=1, validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    comment = models.CharField(max_length=1024)


class Vehicle(models.Model):
    driver = models.ManyToManyField(Driver)
    model = models.CharField(max_length=256)
    plate = models.CharField(max_length=256)
    has_insurance = models.BooleanField(max_length=256)
    insurance = models.FileField()


# Posible creacion de entidad Default_Driver_Routine con
# default_vehicle
# default_num_seats
# default_start_location
# default_end_location

class DriverRoutine(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    default_vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='default_vehicle')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='vehicle')
    default_num_seats = models.IntegerField()
    start_date = models.TimeField()
    end_date = models.TimeField()
    start_location = Coord(null=True)
    end_location = Coord(null=True)
    frecuency = models.CharField(max_length=256)
    one_lift = models.BooleanField(default=False)


class Lift(models.Model):
    driver_routine = models.ForeignKey(DriverRoutine, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    default_num_seats = models.IntegerField()  # Relacionarlo con default_num_seats
    status = models.CharField(max_length=256, choices=LiftStatus.choices(), default=LiftStatus.Pending_start)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_location = Coord(null=True)
    end_location = Coord(null=True)


class IndividualLift(models.Model):
    lift = models.ForeignKey(Lift, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_location = Coord(null=True)
    end_location = Coord(null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    lift_status = models.CharField(max_length=256, choices=LiftStatus.choices(), default=LiftStatus.Pending_start)
    acceptation_status = models.CharField(max_length=256, choices=AcceptationStatus.choices(), default=AcceptationStatus.Pending_Confirmation)


class PassengerRoutine(models.Model):
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    start_date = models.TimeField()
    end_date = models.TimeField()
    start_place = models.CharField(max_length=256)
    end_place = models.CharField(max_length=256)
    frequency = models.CharField(max_length=256)
    time_diff_before = models.DurationField()
    time_diff_after = models.DurationField()

class RoutineRequest(models.Model):
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    driver_routine = models.ForeignKey(DriverRoutine, on_delete=models.CASCADE)
    acceptation_status = models.CharField(max_length=256, choices=AcceptationStatus.choices(), default=AcceptationStatus.Pending_Confirmation)

class CreditCard(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    card = models.CharField(max_length=32)
    CVC = models.CharField(max_length=16)
    expiration_date = models.DateField()

class Paypal(models.Model):
    mail = models.CharField(max_length=256)
    password = models.CharField(max_length=256)
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)


class FavDirection(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    direction = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    location = Coord(null=True)
    cp = models.CharField(max_length=256)


class DiscountCode(models.Model):
    code = models.CharField(max_length=256, unique=True)
    discount_perc = models.FloatField()
    lifts = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField()


class IndividualDiscountCode(models.Model):
    code = models.CharField(max_length=256, unique=True)
    discount_perc = models.FloatField()
    start_date = models.DateField()
    end_date = models.DateField()
    disabled = models.BooleanField(default=False)
    initial_lifts = models.IntegerField()
    lifts_left = models.IntegerField()


class PassengerDiscountCode(models.Model):
    discount = models.ForeignKey(DiscountCode, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    activation_date = models.DateField()
    lifts_left = models.IntegerField()
    active = models.BooleanField(default=True)
