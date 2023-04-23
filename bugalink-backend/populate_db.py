import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bugalink_backend.settings")
django.setup()

from driver_routines.factories import DriverRoutineFactory
from drivers.factories import DriverFactory
from faker import Faker
from locations.factories import LocationFactory
from passenger_routines.factories import PassengerRoutineFactory
from passengers.factories import PassengerFactory
from ratings.factories import DriverRatingFactory, ReportFactory
from trips.factories import TripFactory, TripRequestFactory
from users.factories import UserFactory

Faker.seed(69420)
fake = Faker("es_ES")

NUMBER_OF_LOCATIONS = 50
NUMBER_OF_USERS = 20

MAX_NUMBER_OF_ROUTINES_PER_PASSENGER = 5  # Each passenger will have up to 5 routines
MAX_NUMBER_OF_ROUTINES_PER_DRIVER = 5  # Each driver will have up to 5 routines
MAX_NUMBER_OF_TRIP_REQUESTS_PER_TRIP = 5  # Each trip will have up to 5 requests

CHANCE_OF_USER_BEING_DRIVER = 80  # 80% of users will be also drivers
CHANCE_OF_REQUEST_HAVING_RATING = 90  # 90% of suitable trip requests will have a rating
CHANCE_OF_USER_REPORTING_TRIP = 20  # 20% of trips will end in reports
CHANCE_OF_REPORT_BEING_FROM_DRIVER = 50  # 50% of reports will be from the driver

locations = LocationFactory.create_batch(NUMBER_OF_LOCATIONS)
users = UserFactory.create_batch(NUMBER_OF_USERS)

# Turn some users into drivers
for user in users:
    if fake.boolean(chance_of_getting_true=CHANCE_OF_USER_BEING_DRIVER):
        DriverFactory.create(user=user)

# Create some passenger routines for each user
for passenger in PassengerFactory._meta.model.objects.all():
    for _ in range(0, fake.random_int(0, MAX_NUMBER_OF_ROUTINES_PER_PASSENGER)):
        PassengerRoutineFactory.create(passenger=passenger)

# Create some driver routines for each driver
for driver in DriverFactory._meta.model.objects.all():
    for _ in range(0, fake.random_int(0, MAX_NUMBER_OF_ROUTINES_PER_DRIVER)):
        DriverRoutineFactory.create(driver=driver)

# Create some trip requests by random users for each trip
for trip in TripFactory._meta.model.objects.all():
    for _ in range(0, fake.random_int(0, MAX_NUMBER_OF_TRIP_REQUESTS_PER_TRIP)):
        TripRequestFactory.create(trip=trip)

# Create some driver ratings and reports for each trip request accepted and finished
for trip_request in TripRequestFactory._meta.model.objects.all():
    if (
        trip_request.status == "ACCEPTED"
        and trip_request.trip.status == "FINISHED"
        and fake.boolean(chance_of_getting_true=CHANCE_OF_REQUEST_HAVING_RATING)
    ):
        DriverRatingFactory.create(trip_request=trip_request)

    if fake.boolean(chance_of_getting_true=CHANCE_OF_USER_REPORTING_TRIP):
        reporter_is_driver = fake.boolean(
            chance_of_getting_true=CHANCE_OF_REPORT_BEING_FROM_DRIVER
        )
        reported_is_driver = not reporter_is_driver
        if reporter_is_driver:
            reporter_user = trip_request.trip.driver_routine.driver.user
            reported_user = trip_request.passenger.user
        else:
            reporter_user = trip_request.passenger.user
            reported_user = trip_request.trip.driver_routine.driver.user

        ReportFactory(
            trip=trip_request.trip,
            reporter_user=reporter_user,
            reported_user=reported_user,
            reporter_is_driver=reporter_is_driver,
            reported_is_driver=reported_is_driver,
        )
