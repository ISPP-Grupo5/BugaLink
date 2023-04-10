from django.db.models import Q
from django.shortcuts import redirect, reverse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import User
from rest_framework import mixins, status, viewsets

from .models import Conversation
from .serializers import ConversationListSerializer, ConversationSerializer


# Create your views here.
@api_view(["POST"])
def start_convo(
    request,
):
    data = request.data
    email = data.get("email")
    try:
        participant = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "You cannot chat with a non existent user"})

    conversation = Conversation.objects.filter(
        Q(initiator=request.user, receiver=participant)
        | Q(initiator=participant, receiver=request.user)
    )
    if conversation.exists():
        return redirect(reverse("get_conversation", args=(conversation[0].id,)))
    else:
        conversation = Conversation.objects.create(
            initiator=request.user, receiver=participant
        )
        return Response(ConversationSerializer(instance=conversation).data)



class GetConversationView(viewsets.GenericViewSet):
    serializer_class=ConversationSerializer

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
            else Conversation.objects.create(initiator=request.user, receiver=other_user)
        )

        serializer = ConversationSerializer(instance=conversation)
        return Response(serializer.data)

    



@api_view(["GET"])
def conversations(request):
    conversation_list = Conversation.objects.filter(
        Q(initiator=request.user) | Q(receiver=request.user)
    )
    serializer = ConversationListSerializer(instance=conversation_list, many=True)
    return Response(serializer.data)
