# Generated by Django 4.2 on 2023-04-04 22:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('drivers', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='driver',
            old_name='preference_0',
            new_name='allows_pets',
        ),
        migrations.RenameField(
            model_name='driver',
            old_name='preference_1',
            new_name='allows_smoke',
        ),
        migrations.RenameField(
            model_name='driver',
            old_name='preference_2',
            new_name='prefers_music',
        ),
        migrations.RenameField(
            model_name='driver',
            old_name='preference_3',
            new_name='prefers_talk',
        ),
    ]
