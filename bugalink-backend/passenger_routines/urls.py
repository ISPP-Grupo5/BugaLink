from django.urls import include, path
from rest_framework import routers

from passenger_routines.views import PassengerRoutineViewSet

router = routers.DefaultRouter()
router.register(r"passenger-routines", PassengerRoutineViewSet)

urlpatterns = [
    path("passenger-routines/<int:pk>/update/", PassengerRoutineViewSet.as_view({"put": "update"})),
    path("", include(router.urls)),
]
