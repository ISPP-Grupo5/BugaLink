from rest_framework import serializers
from users.serializers import UserSerializer
from django.db.models import Q
from .models import Conversation, Message
from trips.serializers import SimpleTripSerializer
from trips.models import TripRequest

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        exclude = ("conversation_id",)


class ConversationListSerializer(serializers.ModelSerializer):
    initiator = UserSerializer()
    receiver = UserSerializer()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "initiator", "receiver", "last_message"]

    def get_last_message(self, instance):
        message = instance.message_set.first()
        if message:
            return MessageSerializer(instance=message).data
        else:
            return None


class ConversationSerializer(serializers.ModelSerializer):
    initiator = UserSerializer()
    receiver = UserSerializer()
    message_set = MessageSerializer(many=True)
    most_recent_trip = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "initiator", "receiver", "message_set", "most_recent_trip"]

    def get_most_recent_trip(self,obj) -> SimpleTripSerializer():  
        common_trips = TripRequest.objects.filter(
            Q(passenger__user=obj.initiator, trip__driver_routine__driver__user=obj.receiver) 
            | Q(passenger__user=obj.receiver, trip__driver_routine__driver__user=obj.initiator)
            )
        if len(common_trips) == 0:
            return SimpleTripSerializer()
        print([c.pk for c in common_trips])
        most_recent_trip = common_trips.order_by('trip__departure_datetime').last().trip
        return SimpleTripSerializer(most_recent_trip).data