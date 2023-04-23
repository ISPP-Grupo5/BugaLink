import random

import factory
from faker import Faker
from passenger_routines.factories import PassengerRoutineFactory

from .models import Passenger

Faker.seed(69420)
fake = Faker("es_ES")


class PassengerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Passenger

    print("Creating passengers...")

    user = factory.SubFactory("users.factories.UserFactory")
    # Add any other fields you want to generate for the Passenger model

    @factory.post_generation
    def create_related_objects(obj, create, extracted, **kwargs):
        if not create:
            return

        for _ in range(0, random.randint(0, 5)):
            PassengerRoutineFactory.create(passenger=obj)
