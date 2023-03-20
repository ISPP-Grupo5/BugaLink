from django.db import models

from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from enum import Enum

def get_file_path(instance, filename):
    return 'passenger{0}/{1}'.format(instance.get_passenger().pk, filename)

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
    
class Days(Enum):
    Mon = 'Mon'
    Tue = 'Tue'
    Wed  = 'Wed'
    Thu = 'Thu'
    Fri = 'Fri'
    Sat = 'Sat'
    Sun = 'Sun'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

# A los valores se accede con el nombre de la variable [0] y [1]: Por ejemplo start_location[0]
class Coord(models.Field):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 50
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, expression, connection):
        try:
            if not value:
                return value
            values = value.split(',')
            return tuple(float(v) for v in values)
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

    def __str__(self):
        return f"({self.value[0]}, {self.value[1]})" if self.value else ""


class Passenger(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    biography = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    province = models.CharField(max_length=256)
    birth_date = models.DateField()
    balance = models.DecimalField(max_digits=8, decimal_places=2)
    photo = models.ImageField(null=True, blank=True, upload_to=get_file_path)
    verified = models.BooleanField(default=False)
    def get_passenger(self):
        return self
    def __str__(self):
        return "Passenger " + str(self.pk) + ": username=" + self.user.get_username() + ", email=" + self.user.email
    class Meta:
        verbose_name = "Passenger"
        verbose_name_plural = "Passengers"

class Driver(models.Model):
    passenger = models.OneToOneField(Passenger, primary_key=True, on_delete=models.CASCADE)
    preferences = models.CharField(max_length=2048)
    biography = models.CharField(max_length=256)
    has_dni = models.BooleanField(default=False)
    entry_date = models.DateField()
    has_driver_license = models.BooleanField(default=False)
    has_sworn_declaration = models.BooleanField(default=False)
    sworn_declaration = models.FileField(null=True, blank=True, upload_to=get_file_path)
    driver_license = models.FileField(null=True, blank=True, upload_to=get_file_path)
    dni_front = models.FileField(null=True, blank=True, upload_to=get_file_path)
    dni_back = models.FileField(null=True, blank=True, upload_to=get_file_path)
    def get_passenger(self):
        return self.passenger

    def __str__(self):
        return "Driver " + str(self.pk) + ": username=" + self.passenger.user.get_username() + ", email=" + self.passenger.user.email
    class Meta:
        verbose_name = "Driver"
        verbose_name_plural = "Drivers"

class Vehicle(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    model = models.CharField(max_length=256)
    plate = models.CharField(max_length=256)
    has_insurance = models.BooleanField(default=False)
    insurance = models.FileField(null=True, blank=True)
    def get_passenger(self):
        return self.driver.passenger
    def __str__(self):
        return "Vehicle " + str(self.pk) + ": driver=" + str(self.driver.pk) + ", plate=" + self.plate
    class Meta:
        verbose_name = "Vehicle"
        verbose_name_plural = "Vehicles"
    

class DriverRoutine(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    default_vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, blank=True)
    default_num_seats = models.IntegerField(validators=[MinValueValidator(1)])
    start_date = models.TimeField()
    end_date = models.TimeField()
    start_location = Coord(null=False)
    end_location = Coord(null=False)
    day = models.CharField(max_length=6, choices=Days.choices(), default= Days.Mon)
    one_ride = models.BooleanField(default=False)
    def __str__(self):
        return "Driver routine " + str(self.pk) + ": driver=" + str(self.driver.pk) + ", day=" + self.day
    class Meta:
        verbose_name = "Driver routine"
        verbose_name_plural = "Driver routines"

class Ride(models.Model):
    driver_routine = models.ForeignKey(DriverRoutine, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    num_seats = models.IntegerField()  # Relacionarlo con default_num_seats
    status = models.CharField(max_length=256, choices=RideStatus.choices(), default=RideStatus.Pending_start)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_location = Coord(null=False)
    end_location = Coord(null=False)
    def __str__(self):
        return "Ride " + str(self.pk) + ": driverRoutine=" + str(self.driver_routine.pk) + ", date=" + str(self.start_date.date())
    class Meta:
        verbose_name = "Ride"
        verbose_name_plural = "Rides"

class PassengerRoutine(models.Model):
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    start_location = Coord(null=False)
    end_location = Coord(null=False)
    day = models.CharField(max_length=6, choices=Days.choices(), default= Days.Mon)
    end_date = models.TimeField()
    start_time_initial = models.TimeField()
    start_time_final = models.TimeField()
    def __str__(self):
        return "Passenger routine " + str(self.pk) + ": passenger=" + str(self.passenger.pk) + ", day=" + self.day
    class Meta:
        verbose_name = "Passenger routine"
        verbose_name_plural = "Passenger routines"

class IndividualRide(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    passenger_routine= models.ForeignKey(PassengerRoutine, on_delete=models.CASCADE, null=True, blank=True)
    acceptation_status = models.CharField(max_length=256, choices=AcceptationStatus.choices(), default=AcceptationStatus.Pending_Confirmation)
    message= models.CharField(max_length=256, null=True, blank=True)
    def __str__(self):
        return "Individual Ride " + str(self.pk) + ": driver=" + str(self.ride.driver_routine.driver.pk) + ", passenger=" + str(self.passenger.pk) + ", date=" + str(self.ride.start_date.date()) + " " + str(self.ride.start_date.time())
    class Meta:
        verbose_name = "Individual ride"
        verbose_name_plural = "Individual rides"

class DriverRating(models.Model):
    individual_ride = models.OneToOneField(IndividualRide, null=False, on_delete=models.CASCADE) # Validar que sólo se pueda hacer una vez por viaje
    rating = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    comment = models.CharField(max_length=1024)

    def __str__(self):
        return "Driver rating " + str(self.pk) + ": driver=" + str(self.individual_ride.ride.driver_routine.driver.pk) + ", passenger=" + str(self.individual_ride.passenger.pk) + ", rating=" + str(self.rating) + ", date=" + str(self.individual_ride.start_date.date())
    class Meta:
        verbose_name = "Driver rating"
        verbose_name_plural = "Driver ratings"
    
    def get_driver_rating(self, driver):
        ratings = list(DriverRating.objects.all())
        rating_sum = 0
        for rating in ratings:
            if driver.passenger.id == rating.individual_ride.ride.driver_routine.driver.passenger.id:
                rating_sum += rating.rating
        return rating_sum/len(ratings)

class PassengerRating(models.Model):
    individual_ride = models.OneToOneField(IndividualRide, null=False, on_delete=models.CASCADE) # Validar que sólo se pueda hacer una vez por viaje
    rating = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    comment = models.CharField(max_length=1024)
    def __str__(self):
        return "Passenger rating " + str(self.pk) + ": driver=" + str(self.individual_ride.ride.driver_routine.driver.pk) + ", passenger=" + str(self.individual_ride.passenger.pk) + ", rating=" + str(self.rating) + ", date=" + str(self.individual_ride.start_date.date())
    class Meta:
        verbose_name = "Passenger rating"
        verbose_name_plural = "Passenger ratings"

class Report(models.Model):
    individual_ride = models.OneToOneField(IndividualRide, null=False, on_delete=models.CASCADE) # Validar que sólo se pueda hacer una vez por viaje
    message = models.CharField(max_length=1024)
    is_user_reported_the_driver = models.BooleanField(null=False)
    def __str__(self):
        result= "Report " + str(self.pk) + ": userReported="
        if self.is_user_reported_the_driver:
            result += str(self.individual_ride.ride.driver_routine.driver.passenger.user.pk)
        else:
            result += str(self.individual_ride.passenger.user.pk)
        result += ", date=" + str(self.individual_ride.start_date.date())
        return result
    class Meta:
        verbose_name = "Report"
        verbose_name_plural = "Report"

class RoutineRequest(models.Model):
    passenger_routine = models.ForeignKey(PassengerRoutine, on_delete=models.CASCADE)
    driver_routine = models.ForeignKey(DriverRoutine, on_delete=models.CASCADE)
    acceptation_status = models.CharField(max_length=256, choices=AcceptationStatus.choices(), default=AcceptationStatus.Pending_Confirmation)
    def __str__(self):
        return "Routine request " + str(self.pk) + ": driverRoutine=" + str(self.driver_routine.pk) + ", passengerRoutine=" + str(self.passenger_routine.pk)
    class Meta:
        verbose_name = "Routine request"
        verbose_name_plural = "Routine requests"

class CreditCard(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    card = models.CharField(max_length=32)
    CVC = models.CharField(max_length=16)
    expiration_date = models.DateField()
    def __str__(self):
        return "Credit card " + str(self.pk) + ": user=" + str(self.user.user.pk) + ", card=" + str(self.card)
    class Meta:
        verbose_name = "Credit card"
        verbose_name_plural = "Credit cards"

class Paypal(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    email = models.CharField(max_length=256)
    password = models.CharField(max_length=256)
    def __str__(self):
        return "Paypal " + str(self.pk) + ": user=" + str(self.user.user.pk) + ", email=" + str(self.email)
    class Meta:
        verbose_name = "Paypal"
        verbose_name_plural = "Paypals"

class FavDirection(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    location = Coord(null=False)
    direction = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    cp = models.CharField(max_length=10)
    def __str__(self):
        return "Direction " + str(self.pk) + ": user=" + str(self.user.user.pk) + ", name=" + str(self.name) + ", location=" + str(self.location)
    class Meta:
        verbose_name = "FavDirection"
        verbose_name_plural = "FavDirections"

class DiscountCode(models.Model):
    code = models.CharField(max_length=256, unique=True)
    discount_perc = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    rides = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField()
    def __str__(self):
        return "Discount code " + str(self.pk) +": code=" + self.code + ", discount=" + str(self.discount_perc) + ", start=" + str(self.start_date) + ", end=" + str(self.end_date) + ", active=" + str(self.active)
    class Meta:
        verbose_name = "Discount code"
        verbose_name_plural = "Discount codes"

class PassengerDiscountCode(models.Model):
    discount = models.ForeignKey(DiscountCode, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    activation_date = models.DateField()
    rides_left = models.IntegerField()
    active = models.BooleanField(default=True)
    def __str__(self):
        return "Passenger Discount code " + str(self.pk) +": code=" + self.discount.code + ", user=" + str(self.passenger.pk) +  ", discount=" + str(self.discount.discount_perc) + ", active=" + str(self.active)
    class Meta:
        verbose_name = "Passenger Discount code"
        verbose_name_plural = "Passenger Discount codes"


class IndividualDiscountCode(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    code = models.CharField(max_length=256, unique=True)
    discount_perc = models.FloatField(validators=[MinValueValidator(0.0),MaxValueValidator(1.0)])
    start_date = models.DateField()
    end_date = models.DateField()
    initial_rides = models.IntegerField()
    rides_left = models.IntegerField()
    active = models.BooleanField(default=True)
    def __str__(self):
        return "Individual Discount code " + str(self.pk) +": code=" + self.code + ", user=" + str(self.user.pk) +  ", discount=" + str(self.discount_perc) + ", ridesLeft=" + str(self.rides_left) + "/" + str(self.initial_rides) + ", active=" + str(self.active)
    class Meta: 
        verbose_name = "Individual Discount code"
        verbose_name_plural = "Individual Discount codes"