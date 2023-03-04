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


class Passenger(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    address = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    province = models.CharField(max_length=256)
    biography = models.CharField(max_length=256)
    birth_date = models.DateField()
    balance = models.BooleanField()
    profile_pic = models.CharField(max_length=256)
    verified = models.BooleanField(default=False)
    entry_date = models.CharField(max_length=2048)


class Driver(models.Model):
    passenger = models.OneToOneField(Passenger, primary_key=True, on_delete=models.CASCADE)
    preferences = models.CharField(max_length=256)
    biography = models.CharField(max_length=256)  # A revisar, duplicado en Passenger.biography
    has_driver_license = models.BooleanField()
    has_sworn_declaration = models.BooleanField()
    entry_date = models.DateField
    sworn_declaration = models.CharField(max_length=256)
    driver_license = models.CharField(max_length=256)
    dni_front = models.CharField(max_length=256)
    dni_back = models.CharField(max_length=256)


class Rating(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    value = models.FloatField(default=1, validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    comment = models.CharField(max_length=1024)


class Vehicle(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    model = models.CharField(max_length=256)
    registration = models.CharField(max_length=256)
    has_insurance = models.BooleanField(max_length=256)
    insurance = models.CharField(max_length=256)


class DriverRoutine(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    default_vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='default_vehicle')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='vehicle')
    default_num_seats = models.IntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=256)
    end_location = models.CharField(max_length=256)
    frecuency = models.CharField(max_length=256)
    one_lift = models.BooleanField(default=False)


class Lift(models.Model):
    driver_routine = models.ManyToManyField(DriverRoutine)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    default_num_seats = models.IntegerField()
    status = models.CharField(max_length=256, choices=LiftStatus.choices(), default=LiftStatus.Pending_start)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=256)
    end_location = models.CharField(max_length=256)


class IndividualLift(models.Model):
    lift = models.ForeignKey(Lift, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=256)
    end_location = models.CharField(max_length=256)
    price = models.BooleanField()
    status = models.CharField(max_length=256, choices=LiftStatus.choices(), default=LiftStatus.Pending_start)


class TravellerRoutine(models.Model):
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    start_date = models.TimeField()
    end_date = models.TimeField()
    start_place = models.CharField(max_length=256)
    end_place = models.CharField(max_length=256)
    frequency = models.CharField(max_length=256)
    time_diff_before = models.DateTimeField()
    time_diff_after = models.DateTimeField()


class CreditCard(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    card = models.CharField(max_length=32)
    CVC = models.CharField(max_length=16)
    expiration_date = models.DateField()


class Paypal(models.Model):
    mail = models.CharField(max_length=256, primary_key=True)
    password = models.CharField(max_length=256)
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)


class FavDirection(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    direction = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    location = models.CharField(max_length=256)
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
    lifts = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    disabled = models.BooleanField()
    initial_lifts = models.IntegerField()
    lifts_left = models.IntegerField()


class TravellerDiscountCode(models.Model):
    discount = models.ForeignKey(DiscountCode, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    activation_date = models.DateField()
    lifts_left = models.IntegerField()
    active = models.BooleanField()
