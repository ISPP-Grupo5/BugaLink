from django.db import models

from driver_routines.models import DriverRoutine
from passengers.models import Passenger


class Trip(models.Model):
    driver_routine = models.ForeignKey(
        DriverRoutine, on_delete=models.CASCADE, related_name="trips"
    )
    passengers = models.ManyToManyField(Passenger, related_name="trips")
    departure_datetime = models.DateTimeField()

    def __str__(self):
        return f"{self.driver_routine} on {self.departure_datetime}"


# Model TripRequest has the following fields:
# * trip: The trip that the passenger wants to join to
# * is_recurrent: If the passenger wants to request a single ride or to be a recurrent passenger for the routine
# * status: Can have the values "Pending" when the driver hasn't decided, "Accepted", "Rejected" or "Finished" when the ride has happened in the past
# * note: An optional text note the passenger can write to the driver to inform of something
class TripRequest(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="requests")
    is_recurrent = models.BooleanField(default=False)
    status = models.CharField(
        choices=(
            ("PENDING", "PENDING"),
            ("ACCEPTED", "ACCEPTED"),
            ("REJECTED", "REJECTED"),
            ("FINISHED", "FINISHED"),
        ),
        default="PENDING",
        max_length=10,
    )
    note = models.CharField(max_length=2000, blank=True)

    def __str__(self):
        return f"{self.passenger} requests to join {self.trip} on {self.trip.departure_datetime}"
