# Generated by Django 4.2 on 2023-04-08 12:47

from django.db import migrations, models
import drivers.models


class Migration(migrations.Migration):
    dependencies = [
        ("drivers", "0002_rename_preference_0_driver_allows_pets_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="driver",
            name="dni_back",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=drivers.models.OverwriteStorage(),
                upload_to=drivers.models.user_directory_path,
            ),
        ),
        migrations.AlterField(
            model_name="driver",
            name="dni_front",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=drivers.models.OverwriteStorage(),
                upload_to=drivers.models.user_directory_path,
            ),
        ),
        migrations.AlterField(
            model_name="driver",
            name="dni_status",
            field=models.CharField(
                choices=[
                    ("Waiting upload", "Waiting upload"),
                    ("Waiting validation", "Waiting validation"),
                    ("Validated", "Validated"),
                    ("Cancelled", "Cancelled"),
                ],
                default="Waiting upload",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="driver",
            name="driver_license",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=drivers.models.OverwriteStorage(),
                upload_to=drivers.models.user_directory_path,
            ),
        ),
        migrations.AlterField(
            model_name="driver",
            name="driver_license_status",
            field=models.CharField(
                choices=[
                    ("Waiting upload", "Waiting upload"),
                    ("Waiting validation", "Waiting validation"),
                    ("Validated", "Validated"),
                    ("Cancelled", "Cancelled"),
                ],
                default="Waiting upload",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="driver",
            name="sworn_declaration",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=drivers.models.OverwriteStorage(),
                upload_to=drivers.models.user_directory_path,
            ),
        ),
        migrations.AlterField(
            model_name="driver",
            name="sworn_declaration_status",
            field=models.CharField(
                choices=[
                    ("Waiting upload", "Waiting upload"),
                    ("Waiting validation", "Waiting validation"),
                    ("Validated", "Validated"),
                    ("Cancelled", "Cancelled"),
                ],
                default="Waiting upload",
                max_length=20,
            ),
        ),
    ]
