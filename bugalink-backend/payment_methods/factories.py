import random

import factory
from faker import Faker

from .models import Balance

Faker.seed(69420)
fake = Faker("es_ES")


class BalanceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Balance

    print("Creating balances...")

    amount = factory.LazyAttribute(
        lambda x: random.randint(0, 2000) / 100
    )  # 0.00 - 20.00 EUR
    user = factory.SubFactory("users.factories.UserFactory")
