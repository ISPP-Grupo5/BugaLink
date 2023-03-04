from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from enum import Enum


# Create your models here.
class TRIP_STATE(Enum):
    ACTIVE = 'Active'
    FINISHED = 'Finished'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class Passenger(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    dni = models.CharField(max_length=64, unique=True)
    address = models.CharField(max_length=256)
    country = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    province = models.CharField(max_length=256)
    zip_code = models.CharField(max_length=256)
    biography = models.CharField(max_length=256)
    date_of_birth = models.DateField()
    money = models.BooleanField()
    profile_pic = models.CharField(max_length=256)


class Driver(models.Model):
    user = models.OneToOneField(Passenger, primary_key=True, on_delete=models.CASCADE)
    driver_license = models.CharField(max_length=256)
    VTC_license = models.CharField(max_length=256)
    sign = models.BooleanField(default=False)


class Valuation(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    value = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])


class Vehicle(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    model = models.CharField(max_length=256)
    registration = models.CharField(max_length=256)
    insurance = models.CharField(max_length=256)


class Trip(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.DO_NOTHING)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    max_seats = models.IntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_place = models.CharField(max_length=256)
    end_place = models.CharField(max_length=256)


class Seats(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_place = models.CharField(max_length=256)
    end_place = models.CharField(max_length=256)
    price = models.BooleanField()
    state = models.CharField(max_length=256, choices=TRIP_STATE.choices(), default=TRIP_STATE.ACTIVE)


class Routine(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    start_date = models.TimeField()
    end_date = models.TimeField()
    start_place = models.CharField(max_length=256)
    end_place = models.CharField(max_length=256)
    frequency = models.CharField(max_length=256)


class Card(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    card = models.CharField(max_length=32, primary_key=True)
    CVC = models.CharField(max_length=16)
    expiration_date = models.DateField()


class Paypal(models.Model):
    mail = models.CharField(max_length=256, primary_key=True)
    password = models.CharField(max_length=256)
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)


class Address_fav(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
    country = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    province = models.CharField(max_length=256)
    zip_code = models.CharField(max_length=256)


class Discount_code(models.Model):
    users = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    discount = models.BooleanField()
