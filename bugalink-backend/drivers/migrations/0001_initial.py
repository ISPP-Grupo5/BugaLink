# Generated by Django 4.1.7 on 2023-04-04 11:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Driver",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("preference_0", models.BooleanField(default=False)),
                ("preference_1", models.BooleanField(default=False)),
                ("preference_2", models.BooleanField(default=False)),
                ("preference_3", models.BooleanField(default=False)),
                (
                    "dni_status",
                    models.CharField(
                        choices=[
                            ("Waiting validation", "Waiting validation"),
                            ("Validated", "Validated"),
                            ("Cancelled", "Cancelled"),
                        ],
                        default="Waiting validation",
                        max_length=20,
                    ),
                ),
                (
                    "sworn_declaration_status",
                    models.CharField(
                        choices=[
                            ("Waiting validation", "Waiting validation"),
                            ("Validated", "Validated"),
                            ("Cancelled", "Cancelled"),
                        ],
                        default="Waiting validation",
                        max_length=20,
                    ),
                ),
                (
                    "driver_license_status",
                    models.CharField(
                        choices=[
                            ("Waiting validation", "Waiting validation"),
                            ("Validated", "Validated"),
                            ("Cancelled", "Cancelled"),
                        ],
                        default="Waiting validation",
                        max_length=20,
                    ),
                ),
                (
                    "dni_front",
                    models.ImageField(blank=True, null=True, upload_to="drivers/dnis/"),
                ),
                (
                    "dni_back",
                    models.ImageField(blank=True, null=True, upload_to="drivers/dnis/"),
                ),
                (
                    "sworn_declaration",
                    models.ImageField(
                        blank=True, null=True, upload_to="drivers/sworn_declarations/"
                    ),
                ),
                (
                    "driver_license",
                    models.ImageField(
                        blank=True, null=True, upload_to="drivers/driver_licenses/"
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="driver",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
