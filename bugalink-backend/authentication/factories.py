import factory
from allauth.account.models import EmailAddress
from faker import Faker

Faker.seed(69420)
fake = Faker("es_ES")


class AuthenticationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EmailAddress

    print("Creating authentications...")

    email = factory.LazyAttribute(
        lambda x: f"{x.user.first_name}{x.user.last_name}@bugalink.com".lower().replace(
            " ", ""
        )
    )
    verified = False
    primary = True
    user = factory.SubFactory("users.factories.UserFactory")
