from django.urls import include, path
from rest_framework import routers

from passengers.views import PassengerViewSet

router = routers.DefaultRouter()
router.register(r"passengers", PassengerViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
