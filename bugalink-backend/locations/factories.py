import factory
from faker import Faker

from .models import Location

Faker.seed(69420)
fake = Faker("es_ES")


class LocationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Location

    class Params:
        # https://faker.readthedocs.io/en/master/providers/faker.providers.geo.html#faker.providers.geo.Provider.local_latlng
        values = factory.LazyAttribute(lambda x: fake.local_latlng(country_code="ES"))

    print("Creating locations...")

    # TODO: not working, probably it would be better to create random locations and then
    # assign them to the trips randomly
    latitude = factory.LazyAttribute(lambda x: x.values[0])
    longitude = factory.LazyAttribute(lambda x: x.values[1])
    address = factory.LazyAttribute(lambda x: x.values[2])

    @factory.post_generation
    def remove_duplicate_locations(self, create, extracted, **kwargs):
        if not create:
            return

        locations = Location.objects.all()

        for location in locations:
            if location.address == self.address:
                location.delete()
