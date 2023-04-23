import random

import factory
from driver_routines.factories import DriverRoutineFactory
from faker import Faker

from .models import Driver

Faker.seed(69420)
fake = Faker("es_ES")


def random_bool():
    return random.choice([True, False])


class DriverFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Driver

    print("Creating drivers...")

    user = factory.SubFactory("users.factories.DriverFactory")

    # Each driver has a 90% chance of having each document
    # This means that there will be some drivers without all documents
    # uploaded, and therefore, not verified

    dni_status = "Waiting upload"
    driver_license_status = "Waiting upload"
    sworn_declaration_status = "Waiting upload"

    dni_front = None
    dni_back = None
    driver_license = None
    sworn_declaration = None

    # TODO: not working, always returning true. Manage in a future
    if factory.LazyAttributeSequence(random_bool):
        dni_status = "Validated"
        dni_front = factory.django.ImageField(color="blue")
        dni_back = factory.django.ImageField(color="blue")

    if factory.LazyAttributeSequence(random_bool):
        driver_license_status = "Validated"
        driver_license = factory.django.ImageField(color="blue")

    if factory.LazyAttributeSequence(random_bool):
        sworn_declaration_status = "Validated"
        sworn_declaration = factory.django.ImageField(color="blue")

    if (
        dni_status == "Validated"
        and driver_license_status == "Validated"
        and sworn_declaration_status == "Validated"
    ):
        prefers_talk = factory.LazyFunction(random_bool)
        allows_smoke = factory.LazyFunction(random_bool)
        prefers_music = factory.LazyFunction(random_bool)
        allows_pets = factory.LazyFunction(random_bool)

    @factory.post_generation
    def create_related_objects(obj, create, extracted, **kwargs):
        if not create:
            return

        obj.user.is_driver = True
        obj.user.is_validated_driver = True
        obj.user.save()
