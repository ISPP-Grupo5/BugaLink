# Generated by Django 4.1.7 on 2023-04-16 08:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("transactions", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="transaction",
            name="date",
            field=models.DateField(auto_now=True),
        ),
    ]
