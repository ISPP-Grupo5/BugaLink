import datetime

from users.serializers import UserRatingSerializer


def check_days(trips, days):
    return trips.filter(
        driver_routine__day_of_week__in=days.strip().replace(" ", "").split(",")
    )


def check_minstars(trips, minstars):
    for trip in trips:
        if UserRatingSerializer().get_rating(trip.driver_routine.driver.user) < float(
            minstars
        ):
            trips.remove(trip)
    return trips


def check_minprice(trips, minprice):
    return trips.filter(driver_routine__price__gte=minprice)


def check_maxprice(trips, maxprice):
    return trips.filter(driver_routine__price__lte=maxprice)


def check_date_from(trips, date_from):
    for trip in trips:
        if (
            trip.departure_datetime.date()
            < datetime.datetime.strptime(date_from, "%Y-%m-%d").date()
        ):
            trips.remove(trip)
    return trips


def check_date_to(trips, date_to):
    for trip in trips:
        if (
            trip.departure_datetime.date()
            > datetime.datetime.strptime(date_to, "%Y-%m-%d").date()
        ):
            trips.remove(trip)
    return trips


def check_hour_from(trips, hour_from):
    for trip in trips:
        if (
            trip.departure_datetime.time()
            < datetime.datetime.strptime(hour_from, "%H:%M").time()
        ):
            trips.remove(trip)
    return trips


def check_hour_to(trips, hour_to):
    for trip in trips:
        if (
            trip.departure_datetime.time()
            > datetime.datetime.strptime(hour_to, "%H:%M").time()
        ):
            trips.remove(trip)
    return trips


def check_prefers_music(trips, prefers_music):
    for trip in trips:
        if str(trip.driver_routine.driver.prefers_music) != prefers_music:
            trips.remove(trip)
    return trips


def check_prefers_talk(trips, prefers_talk):
    for trip in trips:
        if str(trip.driver_routine.driver.prefers_talk) != prefers_talk:
            trips.remove(trip)
    return trips


def check_allows_pets(trips, allows_pets):
    for trip in trips:
        if str(trip.driver_routine.driver.allows_pets) != allows_pets:
            trips.remove(trip)
    return trips


def check_allows_smoking(trips, allows_smoking):
    for trip in trips:
        if str(trip.driver_routine.driver.allows_smoke) != allows_smoking:
            trips.remove(trip)
    return trips


def check_distance(result_trips, trips, origin_location, dest_location):
    for trip in trips:
        if (
            trip.driver_routine.origin.get_distance_to(origin_location) <= 1.0
            and trip.driver_routine.destination.get_distance_to(dest_location) <= 1.0
        ):
            result_trips.append(trip)
    return result_trips
