from django.conf import settings
from django.db import models

# Create your models here.


class Conversation(models.Model):
    initiator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="convo_starter",
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="convo_participant",
    )
    start_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"iniciator: {self.initiator} , receiver: {self.receiver}"
    
    def get_messages(self):
        return Message.objects.filter(conversation_id=self)


class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="message_sender",
    )
    text = models.CharField(max_length=200)
    attachment = models.FileField(blank=True)
    conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="message_set")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-timestamp",)

    def __str__(self):
        return f"Conversation {self.conversation_id.pk}: {self.sender} -> {self.text}"
