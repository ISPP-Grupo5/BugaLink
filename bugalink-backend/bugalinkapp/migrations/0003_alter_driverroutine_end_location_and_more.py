# Generated by Django 4.1.7 on 2023-03-23 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bugalinkapp', '0002_alter_report_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='driverroutine',
            name='end_location',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='driverroutine',
            name='start_location',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='passengerroutine',
            name='end_location',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='passengerroutine',
            name='start_location',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='ride',
            name='end_location',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='ride',
            name='start_location',
            field=models.CharField(max_length=256),
        ),
    ]
