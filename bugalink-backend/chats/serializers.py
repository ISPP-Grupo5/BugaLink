from django.db.models import Q
from rest_framework import serializers
from trips.models import TripRequest
from trips.serializers import SimpleTripSerializer
from users.serializers import UserSerializer

from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        exclude = ("conversation",)


class ConversationListSerializer(serializers.ModelSerializer):
    initiator = UserSerializer()
    receiver = UserSerializer()
    last_message = serializers.SerializerMethodField()
    unread_messages_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "initiator",
            "receiver",
            "last_message",
            "unread_messages_count",
        ]

    def get_last_message(self, instance):
        message = instance.message_set.first()
        if message:
            return MessageSerializer(instance=message).data
        else:
            return None

    def get_unread_messages_count(self, instance):
        return instance.message_set.filter(read_by_recipient=False).count()


class ConversationSerializer(serializers.ModelSerializer):
    initiator = UserSerializer()
    receiver = UserSerializer()
    message_set = MessageSerializer(many=True)
    most_recent_trip = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "initiator", "receiver", "message_set", "most_recent_trip"]

    def get_most_recent_trip(self, obj) -> SimpleTripSerializer():
        common_trips = TripRequest.objects.filter(
            Q(
                passenger__user=obj.initiator,
                trip__driver_routine__driver__user=obj.receiver,
            )
            | Q(
                passenger__user=obj.receiver,
                trip__driver_routine__driver__user=obj.initiator,
            )
        )
        if len(common_trips) == 0:
            return None
        most_recent_trip = common_trips.order_by("trip__departure_datetime").last().trip
        return SimpleTripSerializer(most_recent_trip).data
