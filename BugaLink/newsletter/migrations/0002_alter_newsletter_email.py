# Generated by Django 4.1.7 on 2023-02-21 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newsletter', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='newsletter',
            name='email',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
