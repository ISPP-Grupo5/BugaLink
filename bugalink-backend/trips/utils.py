from django.db.models import Q

from .models import Trip
from .serializers import TripSerializer


def get_recommendations(obj) -> TripSerializer(many=True):
    trips = Trip.objects.filter(
        driver_routine__day_of_week=obj.day_of_week, status="PENDING"
    )

    recommendable_trips = []
    for trip in trips:
        if (
            trip.driver_routine.origin.get_distance_to(obj.origin) <= 1.0
            and trip.driver_routine.destination.get_distance_to(obj.destination) <= 1.0
            and trip.get_avaliable_seats() > 0
            and trip.driver_routine.departure_time_start <= obj.departure_time_end
            and trip.driver_routine.departure_time_end >= obj.departure_time_start
        ):
            recommendable_trips.append(trip)
    recommendable_trips = Trip.objects.filter(
        Q(pk__in=[trip.pk for trip in recommendable_trips])
    ).order_by("-departure_datetime")[:10]
    return TripSerializer(recommendable_trips, many=True)
