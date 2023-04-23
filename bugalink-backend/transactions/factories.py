from datetime import datetime

import factory
from django.utils import timezone
from faker import Faker

from .models import Transaction

Faker.seed(69420)
fake = Faker("es_ES")


class TransactionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Transaction

    print("Creating transactions...")

    # sender, reciver and amount are set in the post_generation method

    @factory.lazy_attribute
    def status(self):
        # Status can be PENDING, ACCEPTED or DECLINED
        if self.is_refund:
            return "DECLINED"
        elif self.status == "PENDING":
            return "PENDING"
        else:
            return "ACCEPTED"

    # If the trip_request status is REJECTED, the transaction is a refund
    is_refund = factory.LazyAttribute(lambda x: x.status == "REJECTED")

    # TODO: the date should be the moment when the trip request was made
    date = factory.LazyAttribute(lambda x: datetime.now(tz=timezone.utc))
