# Generated by Django 4.2 on 2023-04-20 17:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chats", "0005_rename_conversation_id_message_conversation"),
    ]

    operations = [
        migrations.AlterField(
            model_name="message",
            name="text",
            field=models.CharField(max_length=2000),
        ),
    ]
