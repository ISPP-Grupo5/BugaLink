import datetime

from django.db.models import Avg
from locations.models import Location
from ratings.models import DriverRating


def check_days(trips, days):
    return trips.filter(
        driver_routine__day_of_week__in=days.strip().replace(" ", "").split(",")
    )


def check_minstars(trips, minstars):
    result_trips = []
    for trip in trips:
        avg_rating = (
            DriverRating.objects.filter(
                trip_request__trip__driver_routine__driver__user=trip.driver_routine.driver.user
            )
            .aggregate(Avg("rating"))
            .get("rating__avg")
        )
        if avg_rating is not None and avg_rating >= float(minstars):
            result_trips.append(trip)

    return result_trips


def check_minprice(trips, minprice):
    return trips.filter(driver_routine__price__gte=minprice)


def check_maxprice(trips, maxprice):
    return trips.filter(driver_routine__price__lte=maxprice)


def check_date_from(trips, date_from):
    return trips.filter(
        departure_datetime__date__gte=datetime.datetime.strptime(
            date_from, "%Y-%m-%d"
        ).date()
    )


def check_date_to(trips, date_to):
    return trips.filter(
        departure_datetime__date__lte=datetime.datetime.strptime(
            date_to, "%Y-%m-%d"
        ).date()
    )


def check_hour_from(trips, hour_from):
    return trips.filter(
        departure_datetime__time__gte=datetime.datetime.strptime(
            hour_from, "%H:%M"
        ).time()
    )


def check_hour_to(trips, hour_to):
    return trips.filter(
        departure_datetime__time__lte=datetime.datetime.strptime(
            hour_to, "%H:%M"
        ).time()
    )


def check_prefers_music(trips, prefers_music):
    return trips.filter(driver_routine__driver__prefers_music=prefers_music)


def check_prefers_talk(trips, prefers_talk):
    return trips.filter(driver_routine__driver__prefers_talk=prefers_talk)


def check_allows_pets(trips, allows_pets):
    return trips.filter(driver_routine__driver__allows_pets=allows_pets)


def check_allows_smoking(trips, allows_smoking):
    return trips.filter(driver_routine__driver__allows_smoking=allows_smoking)


def check_distance(trips, origin, destination):
    origin_lat, origin_lon = origin.split(",")
    dest_lat, dest_lon = destination.split(",")

    origin_location = Location(latitude=float(origin_lat), longitude=float(origin_lon))
    destination_location = Location(latitude=float(dest_lat), longitude=float(dest_lon))

    result_trips = []
    for trip in trips:
        if (
            trip.driver_routine.origin.get_distance_to(origin_location) <= 1.0
            and trip.driver_routine.destination.get_distance_to(destination_location)
            <= 1.0
        ):
            result_trips.append(trip)
    return result_trips
