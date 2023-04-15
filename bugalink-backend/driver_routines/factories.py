import datetime
import random

import factory
from faker import Faker
from trips.factories import TripFactory

from .models import DriverRoutine

Faker.seed(69420)
fake = Faker("es_ES")


class DriverRoutineFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = DriverRoutine

    class Params:
        today = datetime.date.today()
        time_of_day = datetime.time(hour=8, minute=30)
        departure_time_base = datetime.datetime.combine(today, time_of_day)

        hours_of_difference_base = factory.LazyAttribute(
            lambda x: random.randint(0, 12)
        )

        minutes_of_difference_departure = factory.LazyAttribute(
            lambda x: random.randint(10, 20)
        )
        minutes_of_difference_arrival = factory.LazyAttribute(
            lambda x: random.randint(10, 100)
        )

    print("Creating driver routines...")

    driver = factory.SubFactory("drivers.factories.DriverFactory")
    price = factory.LazyAttribute(lambda x: random.randint(1, 10))
    note = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=2000))
    is_recurrent = False
    available_seats = factory.LazyAttribute(lambda x: random.randint(1, 6))

    departure_time_start = factory.LazyAttribute(
        lambda x: x.departure_time_base
        + datetime.timedelta(hours=x.hours_of_difference_base)
    )
    departure_time_end = factory.LazyAttribute(
        lambda x: x.departure_time_start
        + datetime.timedelta(minutes=x.minutes_of_difference_departure)
    )
    arrival_time = factory.LazyAttribute(
        lambda x: x.departure_time_end
        + datetime.timedelta(minutes=x.minutes_of_difference_arrival)
    )

    origin = factory.SubFactory("locations.factories.LocationFactory")
    destination = factory.SubFactory("locations.factories.LocationFactory")
    day_of_week = factory.LazyAttribute(
        lambda x: fake.random_element(
            elements=("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
        )
    )

    @factory.post_generation
    def create_related_objects(obj, create, extracted, **kwargs):
        if not create:
            return

        # Create the first trip of the routine
        TripFactory.create(driver_routine=obj)
