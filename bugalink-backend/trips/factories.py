import random
from datetime import datetime, timedelta, timezone

import factory
from faker import Faker
from passengers.models import Passenger
from ratings.factories import DriverRatingFactory
from transactions.factories import TransactionFactory
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

    class Params:
        # The day of the trip can be from the last 2 months (to simulate history trip) to the next 7 days (which will be PENDING trips)
        day_difference = factory.LazyAttribute(
            lambda x: random.randint(-60, -7)
            if random.random() < 0.5
            else random.randint(0, 7)
        )
        trip_day = factory.LazyAttribute(
            lambda x: datetime.now(tz=timezone.utc) + timedelta(days=x.day_difference)
        )

    print("Creating trips...")

    departure_datetime = factory.LazyAttribute(
        lambda x: datetime.combine(
            next_weekday(x.trip_day, x.driver_routine.day_of_week),
            x.driver_routine.departure_time_start.time(),
            timezone.utc,
        )
    )
    arrival_datetime = factory.LazyAttribute(
        lambda x: datetime.combine(
            next_weekday(x.trip_day, x.driver_routine.day_of_week),
            x.driver_routine.arrival_time.time(),
            timezone.utc,
        )
    )

    @factory.lazy_attribute
    def status(self):
        if self.arrival_datetime < datetime.now(tz=timezone.utc):
            return "FINISHED"
        else:
            return "PENDING"

    @factory.post_generation
    def create_related_objects(obj, create, extracted, **kwargs):
        # Create up to 5 requests for the trip if there are enough users in the database
        if Passenger.objects.count() > 5:
            for _ in range(0, random.randint(0, 5)):
                TripRequestFactory.create(trip=obj)


class TripRequestFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TripRequest

    @factory.lazy_attribute
    def status(self):
        num_filled_seats = TripRequest.objects.filter(
            trip=self.trip, status="ACCEPTED"
        ).count()

        available_seats = self.trip.driver_routine.available_seats - num_filled_seats

        if available_seats == 0:
            return "REJECTED"
        elif available_seats >= 1 and random.randint(0, 1):
            return "ACCEPTED"
        else:
            return "PENDING"

    @factory.lazy_attribute
    def passenger(self):
        # Choose a random passenger from the database.

        # Restriction: Make sure the passenger is not the driver of the trip
        available_passengers = Passenger.objects.exclude(
            user_id=self.trip.driver_routine.driver.user.id
        )

        # Restriction: A user cannot request the same trip twice
        available_passengers = available_passengers.exclude(
            user_id__in=TripRequest.objects.filter(trip=self.trip).values_list(
                "passenger__user_id"
            )
        )

        return random.choice(available_passengers)

    note = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=2000))
    reject_note = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=2000))
    price = factory.LazyAttribute(lambda x: random.randint(1, 10))

    @factory.post_generation
    def create_related_objects(obj, create, extracted, **kwargs):
        if not create:
            return

        # For every trip request, create a transaction in which the passenger pays the driver
        TransactionFactory.create(
            sender=obj.passenger.user,
            receiver=obj.trip.driver_routine.driver.user,
            status=obj.status,
            amount=obj.price,
        )

        # For 50% of the trip requests that comply, create a rating for the driver
        if (
            obj.status == "ACCEPTED"
            and obj.trip.status == "FINISHED"
            and random.randint(0, 1)
        ):
            DriverRatingFactory.create(trip_request=obj)
