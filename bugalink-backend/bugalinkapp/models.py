from django.db import models

from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from enum import Enum

EMAIL_STR = ", email="
DRIVER_STR = ": driver="
DATE_STR = ", date="
PASSENGER_STR = ", passenger="
USER_STR = ": user="
DISCOUNT_STR = ", discunt="
CODE_STR = ": code="
ACTIVE_STR = ", active="


def get_file_path(instance, filename):
    return 'passenger{0}/{1}'.format(instance.get_passenger().pk, filename)

class User(User):
    class Meta:
        proxy = True
        ordering = ('username', )

class DocumentValidationStatus(Enum):
    none = 'None'
    Waiting_Validation = 'Waiting Validation'
    Validated = 'Validated'
    Cancelled = 'Cancelled'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class RideStatus(Enum):
    Pending_start = 'Pending start'
    Finished = 'Finished'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class TransactionStatus(Enum):
    Accepted = 'Accepted'
    Declined = 'Declined'
    Pending = 'Pending'

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
    Wed = 'Wed'
    Thu = 'Thu'
    Fri = 'Fri'
    Sat = 'Sat'
    Sun = 'Sun'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class Passenger(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=8, decimal_places=2)
    photo = models.ImageField(null=True, blank=True, upload_to=get_file_path)
    verified = models.BooleanField(default=False)

    def get_passenger(self):
        return self

    def __str__(self):
        return "Passenger " + str(self.pk) + ": username=" + self.user.get_username() + EMAIL_STR + self.user.email

    class Meta:
        verbose_name = "Passenger"
        verbose_name_plural = "Passengers"
     
    def get_driver_rating(passenger):
        ratings = list(DriverRating.objects.all())
        if ratings:
            rating_sum = 0
            for rating in ratings:
                if passenger.id == rating.individual_ride.ride.driver_routine.driver.passenger.id:
                    rating_sum += rating.rating
            if len(rating):
                return float(rating_sum/len(ratings))
            else:
                return 0.0
        else:
            return 0.0


class Driver(models.Model):
    passenger = models.OneToOneField(Passenger, primary_key=True, on_delete=models.CASCADE)
    preference_0 = models.BooleanField(default=False)
    preference_1 = models.BooleanField(default=False)
    preference_2 = models.BooleanField(default=False)
    preference_3 = models.BooleanField(default=False)
    dni_status = models.CharField(max_length=32, choices=DocumentValidationStatus.choices(),
                                  default=DocumentValidationStatus.none)
    entry_date = models.DateField(default=timezone.now)
    driver_license_status = models.CharField(max_length=32, choices=DocumentValidationStatus.choices(),
                                             default=DocumentValidationStatus.none)
    sworn_declaration_status = models.CharField(max_length=32, choices=DocumentValidationStatus.choices(),
                                                default=DocumentValidationStatus.none)
    sworn_declaration = models.FileField(null=True, blank=True, upload_to=get_file_path)
    driver_license = models.FileField(null=True, blank=True, upload_to=get_file_path)
    dni_front = models.FileField(null=True, blank=True, upload_to=get_file_path)
    dni_back = models.FileField(null=True, blank=True, upload_to=get_file_path)

    def get_passenger(self):
        return self.passenger

    def __str__(self):
        return "Driver " + str(
            self.pk) + ": username=" + self.passenger.user.get_username() + EMAIL_STR + self.passenger.user.email

    class Meta:
        verbose_name = "Driver"
        verbose_name_plural = "Drivers"


class Vehicle(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    model = models.CharField(max_length=256, null=True)
    plate = models.CharField(max_length=256, null=True)
    insurance_status = models.CharField(max_length=32, choices=DocumentValidationStatus.choices(),
                                        default=DocumentValidationStatus.none)
    insurance = models.FileField(null=True, blank=True)

    def get_passenger(self):
        return self.driver.passenger

    def __str__(self):
        return "Vehicle " + str(self.pk) + DRIVER_STR + str(self.driver.pk) + ", plate=" + self.plate

    class Meta:
        verbose_name = "Vehicle"
        verbose_name_plural = "Vehicles"


class DriverRoutine(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    default_vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, blank=True)
    default_num_seats = models.IntegerField(validators=[MinValueValidator(1)])
    start_date_0 = models.TimeField()
    start_date_1 = models.TimeField()
    end_date = models.TimeField()
    start_longitude = models.DecimalField(max_digits=15, decimal_places=10, null=True, blank=True)
    start_latitude = models.DecimalField(max_digits=15, decimal_places=10,null=True, blank=True)
    end_longitude = models.DecimalField(max_digits=15, decimal_places=10,null=True, blank=True)
    end_latitude = models.DecimalField(max_digits=15, decimal_places=10,null=True, blank=True)
    start_location = models.CharField(max_length=512)
    end_location = models.CharField(max_length=512)
    day = models.CharField(max_length=26, choices=Days.choices(), default=Days.Mon)
    one_ride = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    driver_note = models.CharField(max_length=1024, null=True, blank=True)

    def __str__(self):
        return "Driver routine " + str(self.pk) + DRIVER_STR + str(self.driver.pk) + ", day=" + self.day

    class Meta:
        verbose_name = "Driver routine"
        verbose_name_plural = "Driver routines"


class Ride(models.Model):
    driver_routine = models.ForeignKey(DriverRoutine, on_delete=models.CASCADE)

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, blank=True)
    num_seats = models.IntegerField()  # Relacionarlo con default_num_seats
    status = models.CharField(max_length=256, choices=RideStatus.choices(), default=RideStatus.Pending_start)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    start_longitude = models.DecimalField(max_digits=15, decimal_places=10, null=True)
    start_latitude = models.DecimalField(max_digits=15, decimal_places=10,null=True)
    end_longitude = models.DecimalField(max_digits=15, decimal_places=10,null=True)
    end_latitude = models.DecimalField(max_digits=15, decimal_places=10,null=True)
    start_location = models.CharField(max_length=512)
    end_location = models.CharField(max_length=512)

    def __str__(self):
        return "Ride " + str(self.pk) + ": driverRoutine=" + str(self.driver_routine.pk) + DATE_STR + str(
            self.start_date.date()) + ", available seats: " + str(self.get_available_seats())

    class Meta:
        verbose_name = "Ride"
        verbose_name_plural = "Rides"

    def get_available_seats(self):
        accepted_individual_rides = IndividualRide.objects.filter(ride=self, acceptation_status="Accepted")
        available_seats = self.num_seats
        for ind_ride in accepted_individual_rides:
            available_seats = available_seats - ind_ride.n_seats
        return available_seats

class PassengerRoutine(models.Model):
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    start_longitude = models.DecimalField(max_digits=15, decimal_places=10, null=True)
    start_latitude = models.DecimalField(max_digits=15, decimal_places=10,null=True)
    end_longitude = models.DecimalField(max_digits=15, decimal_places=10,null=True)
    end_latitude = models.DecimalField(max_digits=15, decimal_places=10,null=True)
    start_location = models.CharField(max_length=512)
    end_location = models.CharField(max_length=512)
    day = models.CharField(max_length=26, choices=Days.choices(), default=Days.Mon)
    end_date = models.TimeField()
    start_time_initial = models.TimeField()
    start_time_final = models.TimeField()

    def __str__(self):
        return "Passenger routine " + str(self.pk) + ":" + " passenger=" + str(self.passenger.pk) + ", day=" + self.day

    class Meta:
        verbose_name = "Passenger routine"
        verbose_name_plural = "Passenger routines"


class IndividualRide(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    passenger_routine = models.ForeignKey(PassengerRoutine, on_delete=models.CASCADE, null=True, blank=True)
    acceptation_status = models.CharField(max_length=256, choices=AcceptationStatus.choices(),
                                          default=AcceptationStatus.Pending_Confirmation)
    passenger_note = models.CharField(max_length=1024, null=True, blank=True)
    decline_note = models.CharField(max_length=1024, null=True, blank=True)
    n_seats = models.IntegerField(default=1)

    def __str__(self):
        return "Individual Ride " + str(self.pk) + DRIVER_STR + str(
            self.ride.driver_routine.driver.pk) + PASSENGER_STR + str(self.passenger.pk) + ", ride=" + str(self.ride.pk)

    class Meta:
        verbose_name = "Individual ride"
        verbose_name_plural = "Individual rides"


class DriverRating(models.Model):
    individual_ride = models.OneToOneField(IndividualRide, null=False,
                                           on_delete=models.CASCADE)  # Validar que sólo se pueda hacer una vez por viaje
    rating = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    preference_0 = models.BooleanField(default=False)
    preference_1 = models.BooleanField(default=False)
    preference_2 = models.BooleanField(default=False)

    def __str__(self):
        return "Driver rating " + str(self.pk) + DRIVER_STR + str(
            self.individual_ride.ride.driver_routine.driver.pk) + PASSENGER_STR + str(
            self.individual_ride.passenger.pk) + ", rating=" + str(self.rating) + ", indRide=" + str(
            self.individual_ride.pk)

    class Meta:
        verbose_name = "Driver rating"
        verbose_name_plural = "Driver ratings"

class PassengerRating(models.Model):
    individual_ride = models.OneToOneField(IndividualRide, null=False,
                                           on_delete=models.CASCADE)  # Validar que sólo se pueda hacer una vez por viaje
    rating = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    preference_0 = models.BooleanField(default=False)
    preference_1 = models.BooleanField(default=False)
    preference_2 = models.BooleanField(default=False)

    def __str__(self):
        return "Passenger rating " + str(self.pk) + DRIVER_STR + str(
            self.individual_ride.ride.driver_routine.driver.pk) + PASSENGER_STR + str(
            self.individual_ride.passenger.pk) + ", rating=" + str(self.rating) + ", indRide=" + str(
            self.individual_ride.pk)

    class Meta:
        verbose_name = "Passenger rating"
        verbose_name_plural = "Passenger ratings"


class Report(models.Model):
    ride = models.ForeignKey(Ride, null=False,
                             on_delete=models.CASCADE)  # Validar que sólo se pueda hacer una vez por viaje
    passenger_reported = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='passenger_reported')
    passenger_doing_reporter = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='passenger_reporter')
    message = models.CharField(max_length=1024, null=False)

    def __str__(self):
        result = "Report " + str(self.pk) + ": userReported=" + str(self.passenger_reported.pk)

        return result

    class Meta:
        verbose_name = "Report"
        verbose_name_plural = "Reports"


class RoutineRequest(models.Model):
    passenger_routine = models.ForeignKey(PassengerRoutine, on_delete=models.CASCADE)
    driver_routine = models.ForeignKey(DriverRoutine, on_delete=models.CASCADE)
    acceptation_status = models.CharField(max_length=256, choices=AcceptationStatus.choices(),
                                          default=AcceptationStatus.Pending_Confirmation)

    def __str__(self):
        return "Routine request " + str(self.pk) + ": driverRoutine=" + str(
            self.driver_routine.pk) + ", passengerRoutine=" + str(self.passenger_routine.pk)

    class Meta:
        verbose_name = "Routine request"
        verbose_name_plural = "Routine requests"


class CreditCard(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    card = models.CharField(max_length=32)
    CVC = models.CharField(max_length=16)
    expiration_date = models.DateField()

    def __str__(self):
        return "Credit card " + str(self.pk) + USER_STR + str(self.user.user.pk) + ", card=" + str(self.card)

    class Meta:
        verbose_name = "Credit card"
        verbose_name_plural = "Credit cards"


class Paypal(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    email = models.CharField(max_length=256)
    password = models.CharField(max_length=256)

    def __str__(self):
        return "Paypal " + str(self.pk) + USER_STR + str(self.user.user.pk) + EMAIL_STR + str(self.email)

    class Meta:
        verbose_name = "Paypal"
        verbose_name_plural = "Paypals"


class DiscountCode(models.Model):
    code = models.CharField(max_length=256, unique=True)
    discount_perc = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    rides = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField()

    def __str__(self):
        return "Discount code " + str(self.pk) + CODE_STR + self.code + DISCOUNT_STR + str(
            self.discount_perc) + ", start=" + str(self.start_date) + ", end=" + str(self.end_date) + ACTIVE_STR + str(
            self.active)

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
        return "Passenger Discount code " + str(self.pk) + CODE_STR + self.discount.code + ", user=" + str(
            self.passenger.pk) + DISCOUNT_STR + str(self.discount.discount_perc) + ACTIVE_STR + str(self.active)

    class Meta:
        verbose_name = "Passenger Discount code"
        verbose_name_plural = "Passenger Discount codes"


class IndividualDiscountCode(models.Model):
    user = models.ForeignKey(Passenger, on_delete=models.CASCADE)
    code = models.CharField(max_length=256, unique=True)
    discount_perc = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    start_date = models.DateField()
    end_date = models.DateField()
    initial_rides = models.IntegerField()
    rides_left = models.IntegerField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return "Individual Discount code " + str(self.pk) + CODE_STR + self.code + ", user=" + str(
            self.user.pk) + DISCOUNT_STR + str(self.discount_perc) + ", ridesLeft=" + str(self.rides_left) + "/" + str(
            self.initial_rides) + ACTIVE_STR + str(self.active)

    class Meta:
        verbose_name = "Individual Discount code"
        verbose_name_plural = "Individual Discount codes"


class Transaction(models.Model):
    sender = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='receiver')
    status = models.CharField(max_length=16, choices=TransactionStatus.choices(), default=TransactionStatus.Pending)
    is_refund = models.BooleanField(default=False)
    amount = models.FloatField()
