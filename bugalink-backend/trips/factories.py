import random
from datetime import datetime

import factory
from faker import Faker
from utils import next_weekday

from .models import Trip, TripRequest

Faker.seed(69420)
fake = Faker("es_ES")


class TripFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Trip

    driver_routine = factory.SubFactory(
        "driver_routines.factories.DriverRoutineFactory"
    )

    departure_datetime = factory.LazyAttribute(
        lambda x: datetime.combine(
            next_weekday(datetime.now(), x.driver_routine.day_of_week),
            x.driver_routine.departure_time_start.time(),
        )
    )
    arrival_datetime = factory.LazyAttribute(
        lambda x: datetime.combine(
            next_weekday(datetime.now(), x.driver_routine.day_of_week),
            x.driver_routine.arrival_time.time(),
        )
    )

    @factory.post_generation
    def create_related_objects(obj, create, extracted, **kwargs):
        # Create up to 5 requests for the trip. Assure that there won't be more
        # accepted passengers than available seats!
        for _ in range(0, random.randint(0, 5)):
            TripRequestFactory.create(trip=obj)


class TripRequestFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TripRequest

    class Props:
        # If the number of free seats is 0, the status will be rejected
        # If the number of free seats is 1, the status will be accepted/rejected with a 50% probability
        # If the number of free seats is 2 or more, the status will be accepted
        available_seats = factory.LazyAttribute(
            lambda x: x.trip.driver_routine.available_seats
        )

        if available_seats == 0:
            status = "REJECTED"
        elif available_seats == 1 and random.randint(0, 1):
            status = "ACCEPTED"
        else:
            status = "PENDING"

    trip = factory.SubFactory(
        "trips.factories.TripFactory"
    )  # TODO: check if is assigning the same trip
    status = factory.LazyAttribute(lambda x: x.Props.status)

    note = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=2000))
    reject_note = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=2000))
    # Choose a random existing passenger
    passenger = factory.SubFactory("passengers.factories.PassengerFactory")
    price = factory.LazyAttribute(lambda x: random.randint(1, 10))
