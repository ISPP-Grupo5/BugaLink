import random

import factory
from authentication.factories import AuthenticationFactory
from drivers.factories import DriverFactory
from faker import Faker
from passengers.factories import PassengerFactory
from payment_methods.factories import BalanceFactory

from .models import User

Faker.seed(69420)
fake = Faker("es_ES")


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    print("Creating users...")

    first_name = factory.LazyAttribute(lambda x: fake.first_name())
    last_name = factory.LazyAttribute(lambda x: fake.last_name())

    email = factory.LazyAttribute(
        lambda x: f"{x.first_name}{x.last_name}@bugalink.com".lower().replace(" ", "")
    )  # pedroperez@bugalink.com

    password = factory.PostGenerationMethodCall("set_password", "bugalinbugalin")

    # Create the related Passenger and Authentication objects after the user is created
    @factory.post_generation
    def create_related_objects(obj, create, extracted, **kwargs):
        if not create:
            return

        PassengerFactory.create(user=obj)
        AuthenticationFactory.create(user=obj)  # For login
        BalanceFactory.create(user=obj)  # For payments

        if random.randint(0, 1):
            DriverFactory.create(user=obj)
