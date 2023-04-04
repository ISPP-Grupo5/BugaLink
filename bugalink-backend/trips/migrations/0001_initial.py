# Generated by Django 4.1.7 on 2023-04-04 08:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("driver_routines", "0003_alter_driverroutine_day_of_week"),
        ("passengers", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Trip",
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
                ("departure_datetime", models.DateTimeField()),
                ("arrival_datetime", models.DateTimeField()),
                (
                    "status",
                    models.CharField(
                        choices=[("PENDING", "PENDING"), ("FINISHED", "FINISHED")],
                        default="PENDING",
                        max_length=10,
                    ),
                ),
                (
                    "driver_routine",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="trips",
                        to="driver_routines.driverroutine",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TripRequest",
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
                    "status",
                    models.CharField(
                        choices=[
                            ("PENDING", "PENDING"),
                            ("ACCEPTED", "ACCEPTED"),
                            ("REJECTED", "REJECTED"),
                        ],
                        default="PENDING",
                        max_length=10,
                    ),
                ),
                ("note", models.CharField(blank=True, max_length=2000)),
                ("reject_note", models.CharField(blank=True, max_length=2048)),
                (
                    "price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
                ),
                (
                    "passenger",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="passenger",
                        to="passengers.passenger",
                    ),
                ),
                (
                    "trip",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="requests",
                        to="trips.trip",
                    ),
                ),
            ],
        ),
    ]
