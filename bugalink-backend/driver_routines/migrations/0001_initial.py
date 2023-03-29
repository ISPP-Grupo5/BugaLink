# Generated by Django 4.1.7 on 2023-03-27 01:57

import django.contrib.postgres.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("locations", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="DriverRoutine",
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
                (
                    "price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
                ),
                ("note", models.CharField(blank=True, max_length=2000)),
                ("is_single_ride", models.BooleanField(default=False)),
                ("available_seats", models.IntegerField(default=1)),
                (
                    "departure_time_start",
                    models.TimeField(verbose_name="Departure time window begin"),
                ),
                (
                    "departure_time_end",
                    models.TimeField(verbose_name="Departure time window end"),
                ),
                (
                    "days_of_week",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(
                            choices=[
                                ("Mon", "Monday"),
                                ("Tue", "Tuesday"),
                                ("Wed", "Wednesday"),
                                ("Thu", "Thursday"),
                                ("Fri", "Friday"),
                                ("Sat", "Saturday"),
                                ("Sun", "Sunday"),
                            ],
                            max_length=7,
                            verbose_name="Day of week",
                        ),
                        size=None,
                    ),
                ),
                (
                    "destination",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="destination",
                        to="locations.location",
                    ),
                ),
                (
                    "origin",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="origin",
                        to="locations.location",
                    ),
                ),
            ],
        ),
    ]
