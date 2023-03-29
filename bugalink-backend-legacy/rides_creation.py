import django
import datetime
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BugaLink.settings')
django.setup()
from bugalinkapp.models import DriverRoutine, Ride, Days

week_start = datetime.date.today() - datetime.timedelta(
    days=datetime.date.today().isoweekday() % 7) + datetime.timedelta(days=1)
mapper = {}
i = 0
for day in Days.choices():
    mapper[day[1]] = i
    i += 1
routines = DriverRoutine.objects.all()
for routine in routines:
    day = week_start + datetime.timedelta(days=mapper[routine.day])
    start_datetime = datetime.datetime.combine(day, routine.start_date_0)
    end_datetime = datetime.datetime.combine(day, routine.end_date)
    num_seats = routine.default_num_seats
    start_longitude = routine.start_longitude
    start_latitude = routine.start_latitude
    end_longitude = routine.end_longitude
    end_latitude = routine.end_latitude
    start_location = routine.start_location
    end_location = routine.end_location
    status = 'Pending start'
    Ride.objects.create(driver_routine=routine, start_date=start_datetime, end_date=end_datetime,
                        num_seats=num_seats, start_location=start_location, start_latitude=start_latitude,
                        start_longitude=start_longitude, end_location=end_location, end_longitude=end_longitude,
                        end_latitude=end_latitude, status=status)
