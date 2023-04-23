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

    @factory.post_generation
    def create_related_objects(obj, create, extracted, **kwargs):
        if not create:
            return

        # For 20% of the ratings, create a report to another user
        # TODO: make attributes dynamic so there is variety in the reports
        if fake.boolean(chance_of_getting_true=100):
            # 50% of the times, the driver will report the passenger
            # The another half of the times, it will be the other way around
            if fake.boolean(chance_of_getting_true=50):
                reporter_user = obj.trip_request.trip.driver_routine.driver.user
                reported_user = obj.trip_request.passenger.user
                reporter_is_driver = True
                reported_is_driver = False
            else:
                reporter_user = obj.trip_request.passenger.user
                reported_user = obj.trip_request.trip.driver_routine.driver.user
                reporter_is_driver = False
                reported_is_driver = True

            ReportFactory(
                trip=obj.trip_request.trip,
                reporter_user=reporter_user,
                reported_user=reported_user,
                reporter_is_driver=reporter_is_driver,
                reported_is_driver=reported_is_driver,
            )


class ReportFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Report

    # TODO: lazy attributes for all 4 booleans
    print("Creating reports...")

    trip = factory.SubFactory("trips.factories.TripFactory")
    reporter_user = factory.SubFactory("users.factories.UserFactory")
    reported_user = factory.SubFactory("users.factories.UserFactory")
    note = factory.LazyAttribute(lambda x: fake.text(max_nb_chars=2000))

    # reporter_is_driver and reported_is_driver are inferred from the users
