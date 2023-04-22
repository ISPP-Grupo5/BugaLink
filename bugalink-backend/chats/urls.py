from django.urls import path

from . import views

urlpatterns = [
    path(
        "users/<int:user_id>/conversation/",
        views.GetConversationView.as_view({"get": "get"}),
        name="get_conversation",
    ),
    path(
        "conversations/pending/count/",
        views.GetConversationView.as_view({"get": "count"}),
        name="get_conversation_count",
    ),
    path(
        "conversations/",
        views.GetConversationView.as_view({"get": "conversations"}),
        name="conversations",
    ),
]
