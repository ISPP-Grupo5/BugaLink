from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.response import Response
from users.models import User

from .models import Conversation
from .serializers import ConversationListSerializer, ConversationSerializer


class GetConversationView(viewsets.GenericViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    def get(self, request, *args, **kwargs):
        user_id = kwargs["user_id"]
        other_user = User.objects.get(id=user_id)

        if not other_user:
            return Response(
                {"message": "User does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if other_user == request.user:
            return Response(
                {"message": "You cannot chat with yourself"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Filter by conversations where the both me and the other user take place
        conversation = Conversation.objects.filter(
            Q(initiator=request.user, receiver=other_user)
            | Q(initiator=other_user, receiver=request.user)
        )

        conversation = (
            conversation[0]
            if conversation.exists()
            else Conversation.objects.create(
                initiator=request.user, receiver=other_user
            )
        )

        serializer = ConversationSerializer(instance=conversation)
        return Response(serializer.data)

    def conversations(self, request, *args, **kwargs):
        conversation_list = Conversation.objects.filter(
            Q(initiator=request.user) | Q(receiver=request.user)
        )
        serializer = ConversationListSerializer(instance=conversation_list, many=True)
        return Response(serializer.data)

    def count(self, request, *args, **kwargs):
        # Count the number of conversations with unread messages
        conversations = Conversation.objects.filter(
            Q(initiator=request.user) | Q(receiver=request.user)
        )

        for c in conversations:
            c.last_message = c.get_last_message()

        count = len(
            [
                c
                for c in conversations
                if c.last_message is not None
                and not c.last_message.read_by_recipient
                and c.last_message.sender != request.user
            ]
        )

        return Response({"count": count})
