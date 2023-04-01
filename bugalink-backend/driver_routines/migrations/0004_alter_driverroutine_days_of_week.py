# Generated by Django 4.1.7 on 2023-03-27 22:57

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("driver_routines", "0003_rename_is_single_ride_driverroutine_is_recurrent"),
    ]

    operations = [
        migrations.AlterField(
            model_name="driverroutine",
            name="days_of_week",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(
                    choices=[
                        (0, "Monday"),
                        (1, "Tuesday"),
                        (2, "Wednesday"),
                        (3, "Thursday"),
                        (4, "Friday"),
                        (5, "Saturday"),
                        (6, "Sunday"),
                    ],
                    max_length=7,
                    verbose_name="Day of week",
                ),
                size=None,
            ),
        ),
    ]
