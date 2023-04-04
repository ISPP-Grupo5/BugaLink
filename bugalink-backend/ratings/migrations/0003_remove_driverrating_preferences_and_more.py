# Generated by Django 4.1.7 on 2023-04-04 10:50

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("ratings", "0002_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="driverrating",
            name="preferences",
        ),
        migrations.AddField(
            model_name="driverrating",
            name="preference_0",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="driverrating",
            name="preference_1",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="driverrating",
            name="preference_2",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="driverrating",
            name="preference_3",
            field=models.BooleanField(default=False),
        ),
    ]
