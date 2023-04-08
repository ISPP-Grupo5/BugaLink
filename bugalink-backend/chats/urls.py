from django.urls import path

from . import views

urlpatterns = [
    path("conversations/start/", views.start_convo, name="start_convo"),
    path(
        "users/<int:user_id>/conversation/",
        views.get_conversation,
        name="get_conversation",
    ),
    path("conversations/", views.conversations, name="conversations"),
]
