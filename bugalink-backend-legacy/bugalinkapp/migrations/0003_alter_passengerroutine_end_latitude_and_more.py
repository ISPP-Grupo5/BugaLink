# Generated by Django 4.1.7 on 2023-03-28 22:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bugalinkapp', '0002_alter_driver_dni_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='passengerroutine',
            name='end_latitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AlterField(
            model_name='passengerroutine',
            name='end_longitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AlterField(
            model_name='passengerroutine',
            name='start_latitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AlterField(
            model_name='passengerroutine',
            name='start_longitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AlterField(
            model_name='ride',
            name='end_latitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AlterField(
            model_name='ride',
            name='end_longitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AlterField(
            model_name='ride',
            name='start_latitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
        migrations.AlterField(
            model_name='ride',
            name='start_longitude',
            field=models.DecimalField(blank=True, decimal_places=10, max_digits=15, null=True),
        ),
    ]
