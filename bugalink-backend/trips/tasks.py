import datetime

from celery import shared_task


@shared_task()
def set_trip_finished(pk):
    from .models import Trip

    # Set previous trip to Finished.
    trip = Trip.objects.get(pk=pk)
    trip.status = "FINISHED"
    trip.save()
    # Create next week trip
    departure_date = (trip.departure_datetime + datetime.timedelta(days=7)).date()
    arrival_date = (trip.arrival_datetime + datetime.timedelta(days=7)).date()
    departure_time = trip.driver_routine.departure_time_start
    arrival_time = trip.driver_routine.arrival_time
    Trip.objects.create(
        driver_routine=trip.driver_routine,
        departure_datetime=datetime.datetime.combine(departure_date, departure_time),
        arrival_datetime=datetime.datetime.combine(arrival_date, arrival_time),
    )
