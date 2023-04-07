from django.urls import path

from . import views

urlpatterns = [
    path("conversations/start/", views.start_convo, name="start_convo"),
    path(
        "conversations/<int:convo_id>/",
        views.get_conversation,
        name="get_conversation",
    ),
    path("conversations/", views.conversations, name="conversations"),
]
