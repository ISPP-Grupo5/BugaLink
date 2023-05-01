import datetime
import random

import factory
from faker import Faker
from locations.models import Location

from .models import PassengerRoutine

Faker.seed(69420)
fake = Faker("es_ES")


class PassengerRoutineFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PassengerRoutine

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

    print("Creating passenger routines...")

    passenger = factory.SubFactory("passengers.factories.PassengerFactory")

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

    @factory.lazy_attribute
    def origin(self):
        return random.choice(Location.objects.all())

    @factory.lazy_attribute
    def destination(self):
        # Make sure the destination is not the same as the origin
        available_destinations = Location.objects.exclude(pk=self.origin.pk)
        return random.choice(available_destinations)

    day_of_week = factory.LazyAttribute(
        lambda x: fake.random_element(
            elements=("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
        )
    )
