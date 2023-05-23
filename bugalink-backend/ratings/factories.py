import factory
from faker import Faker

from .models import DriverRating, Report

Faker.seed(69420)
fake = Faker("es_ES")


class DriverRatingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = DriverRating

    print("Creating driver ratings...")

    trip_request = factory.SubFactory("trips.factories.TripRequestFactory")
    rating = factory.LazyAttribute(lambda x: float(fake.random_int(min=1, max=5)))
    is_good_driver = factory.LazyAttribute(lambda x: fake.boolean())
    is_pleasant_driver = factory.LazyAttribute(lambda x: fake.boolean())
    already_knew = factory.LazyAttribute(lambda x: fake.boolean())


class ReportFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Report

    print("Creating reports...")

    trip = factory.SubFactory("trips.factories.TripFactory")
    reporter_user = factory.SubFactory("users.factories.UserFactory")
    reported_user = factory.SubFactory("users.factories.UserFactory")
    note = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=2000))

    # reporter_is_driver and reported_is_driver are inferred from the users
