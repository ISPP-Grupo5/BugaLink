# Generated by Django 4.1.7 on 2023-03-06 21:13

import bugalinkapp.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bugalinkapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='individualride',
            name='status',
        ),
        migrations.AddField(
            model_name='individualride',
            name='acceptation_status',
            field=models.CharField(choices=[('Accepted', 'Accepted'), ('Cancelled', 'Cancelled'), ('Pending Confirmation', 'Pending_Confirmation')], default=bugalinkapp.models.AcceptationStatus['Pending_Confirmation'], max_length=256),
        ),
        migrations.AddField(
            model_name='individualride',
            name='ride_status',
            field=models.CharField(choices=[('Pending start', 'Pending_start'), ('Ongoing', 'Ongoing'), ('Finished', 'Finished')], default=bugalinkapp.models.RideStatus['Pending_start'], max_length=256),
        ),
    ]
