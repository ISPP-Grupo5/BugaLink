import factory
from faker import Faker

from .models import Balance

Faker.seed(69420)
fake = Faker("es_ES")


class BalanceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Balance

    print("Creating balances...")

    amount = 0.0
    user = factory.SubFactory("users.factories.UserFactory")
