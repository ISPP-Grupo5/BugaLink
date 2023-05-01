import os
import shutil

from django.core.management.base import BaseCommand
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

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_DIR = os.path.dirname(os.path.dirname(BASE_DIR))

NUMBER_OF_LOCATIONS = 50
DEFAULT_NUMBER_OF_USERS = 20

MAX_NUMBER_OF_ROUTINES_PER_PASSENGER = 5  # Each passenger will have up to 5 routines
MAX_NUMBER_OF_ROUTINES_PER_DRIVER = 5  # Each driver will have up to 5 routines
MAX_NUMBER_OF_TRIP_REQUESTS_PER_TRIP = 5  # Each trip will have up to 5 requests

CHANCE_OF_USER_BEING_DRIVER = 80  # 80% of users will be also drivers
CHANCE_OF_REQUEST_HAVING_RATING = 90  # 90% of suitable trip requests will have a rating
CHANCE_OF_USER_REPORTING_TRIP = 20  # 20% of trips will end in reports
CHANCE_OF_REPORT_BEING_FROM_DRIVER = 50  # 50% of reports will be from the driver


class Command(BaseCommand):
    help = "Populates the database with sample data. Default is 10 users. REMINDER: BETTER FLUSH BEFORE POPULATING!"

    def add_arguments(self, parser):
        parser.add_argument(
            "--users",
            type=int,
            default=DEFAULT_NUMBER_OF_USERS,
            help="Indicates the amount of users to be populated",
        )

    def _turn_some_users_into_drivers(self, users):
        for user in users:
            if fake.boolean(chance_of_getting_true=CHANCE_OF_USER_BEING_DRIVER):
                DriverFactory.create(user=user)

    def _create_routines_for_passengers(self, users, locations):
        for passenger in PassengerFactory._meta.model.objects.all():
            for _ in range(0, fake.random_int(0, MAX_NUMBER_OF_ROUTINES_PER_PASSENGER)):
                PassengerRoutineFactory.create(passenger=passenger)

    def _create_routines_for_drivers(self, users, locations):
        for driver in DriverFactory._meta.model.objects.all():
            for _ in range(0, fake.random_int(0, MAX_NUMBER_OF_ROUTINES_PER_DRIVER)):
                DriverRoutineFactory.create(driver=driver)

    def _create_trip_requests(self):
        for trip in TripFactory._meta.model.objects.all():
            for _ in range(0, fake.random_int(0, MAX_NUMBER_OF_TRIP_REQUESTS_PER_TRIP)):
                TripRequestFactory.create(trip=trip)

    def _create_ratings_and_reports(self):
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

    def handle(self, *args, **options):
        # Remove folder /files (if exists)
        shutil.rmtree(f"{PROJECT_DIR}/files", ignore_errors=True)

        number_of_users = options.get("users")
        users = UserFactory.create_batch(number_of_users)
        locations = LocationFactory.create_batch(NUMBER_OF_LOCATIONS)

        self._turn_some_users_into_drivers(users)
        self._create_routines_for_passengers(users, locations)
        self._create_routines_for_drivers(users, locations)
        self._create_trip_requests()
        self._create_ratings_and_reports()
