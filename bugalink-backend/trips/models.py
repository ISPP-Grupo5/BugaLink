import datetime
from users.models import User
from django.db import models
from django.utils import timezone
from driver_routines.models import DriverRoutine
from passengers.models import Passenger
from transactions.models import Transaction

# class TripModelManager(models.Manager):
#     def pending(self):
#         return self.filter(arrival_datetime__lt=timezone.now())


class Trip(models.Model):
    driver_routine = models.ForeignKey(
        DriverRoutine, on_delete=models.CASCADE, related_name="trips"
    )
    departure_datetime = models.DateTimeField()
    arrival_datetime = models.DateTimeField()

    def __str__(self):
        return f"{self.pk} - {self.driver_routine} on {self.departure_datetime}"

    @property
    def status(self):
        return "FINISHED" if self.arrival_datetime < timezone.now() else "PENDING"

    def get_avaliable_seats(self):
        return self.driver_routine.available_seats - len(
            TripRequest.objects.filter(trip=self, status="ACCEPTED")
        )


# Model TripRequest has the following fields:
# * trip: The trip that the passenger wants to join to
# * is_recurrent: If the passenger wants to request a single ride or to be a recurrent passenger for the routine
# * status: Can have the values "Pending" when the driver hasn't decided, "Accepted", "Rejected" or "Finished" when the ride has happened in the past
# * note: An optional text note the passenger can write to the driver to inform of something
# * reject_note: An optional text note the driver can write to the passenger to inform of something
# * passenger: The passenger that wants to join the trip
# * price: The price the passenger has to pay for the trip
# * transaction: The transaction that has been made to pay for the trip


class TripRequest(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="requests")
    status = models.CharField(
        choices=(
            ("PENDING", "PENDING"),
            ("ACCEPTED", "ACCEPTED"),
            ("REJECTED", "REJECTED"),
        ),
        default="PENDING",
        max_length=10,
    )
    note = models.CharField(max_length=2000, null=True)
    reject_note = models.CharField(max_length=2048, null=True)
    passenger = models.ForeignKey(
        Passenger, on_delete=models.CASCADE, related_name="passenger"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    transaction = models.ForeignKey(
        Transaction, on_delete=models.CASCADE, related_name="transaction", null=True
    )

    def __str__(self):
        return f"{self.pk} - {self.passenger} requests to join {self.trip} on {self.trip.departure_datetime}"
