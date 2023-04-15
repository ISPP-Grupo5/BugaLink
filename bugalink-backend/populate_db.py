import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bugalink_backend.settings")
django.setup()

from faker import Faker
from users.factories import UserFactory

Faker.seed(69420)
fake = Faker("es_ES")

for i in range(10):
    UserFactory.create()
