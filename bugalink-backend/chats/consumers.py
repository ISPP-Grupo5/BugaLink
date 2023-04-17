import base64
import json
import secrets

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import ContentFile

from .models import Conversation, Message
from .serializers import MessageSerializer


class ChatsConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        # Mark all messages sent by the other user as read
        conversation = Conversation.objects.get(id=int(self.room_name))
        other_user = (
            conversation.initiator
            if self.scope["user"] == conversation.receiver
            else conversation.receiver
        )
        to_mark_as_read = Message.objects.filter(
            conversation=conversation, sender=other_user
        )
        to_mark_as_read.update(read_by_recipient=True)
        message_list = to_mark_as_read.values_list("id", flat=True)

        self.send_read_confirmation(message_list)
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data=None, bytes_data=None):
        # parse the json data into dictionary object
        text_data_json = json.loads(text_data)
        conversation = Conversation.objects.get(id=int(self.room_name))
        sender = self.scope["user"]

        if text_data_json.get("type"):
            print(f"Received message of type {text_data_json.get('type')}")
            if text_data_json.get("sender") == sender.id:
                return
            to_confirm_id = text_data_json.get("message_id")
            to_confirm = Message.objects.filter(id=to_confirm_id)
            to_confirm.update(read_by_recipient=True)

            read_messages = to_confirm.values_list("id", flat=True)
            print(f"Sending confirmation for messages {read_messages}")
            self.send_read_confirmation(read_messages)
            return

        # unpack the dictionary into the necessary parts
        message, attachment = (
            text_data_json["message"],
            text_data_json.get("attachment"),
        )

        # Attachment
        if attachment:
            file_str, file_ext = attachment["data"], attachment["format"]

            file_data = ContentFile(
                base64.b64decode(file_str), name=f"{secrets.token_hex(8)}.{file_ext}"
            )
            _message = Message.objects.create(
                sender=sender,
                attachment=file_data,
                text=message,
                conversation=conversation,
            )
        else:
            _message = Message.objects.create(
                sender=sender,
                text=message,
                conversation=conversation,
            )

        # Send message to room group
        chat_type = {"type": "chat_message"}
        message_serializer = dict(MessageSerializer(instance=_message).data)
        return_dict = {**chat_type, **message_serializer}

        if _message.attachment:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender": sender.email,
                    "attachment": _message.attachment.url,
                    "time": str(_message.timestamp),
                },
            )
        else:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                return_dict,
            )

    # Receive message from room group
    def chat_message(self, event):
        dict_to_be_sent = event.copy()
        dict_to_be_sent.pop("type")

        # Send message to WebSocket
        self.send(text_data=json.dumps(dict_to_be_sent))

    def send_read_confirmation(self, message_list):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "message_confirmation",
                "read_messages": list(message_list),
            },
        )

    def message_confirmation(self, event):
        self.send(text_data=json.dumps(event))
