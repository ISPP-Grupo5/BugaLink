from django.urls import include, path
from rest_framework import routers

from driver_routines.views import DriverRoutineViewSet

router = routers.DefaultRouter()
router.register(r"driver-routines", DriverRoutineViewSet)
# router.register(r"driver-routines", DriverRoutineViewSet, basename="driver-routines")

urlpatterns = [
    path("driver-routines/<int:pk>/update/", DriverRoutineViewSet.as_view({"put": "update"})),
    path("", include(router.urls)),
]
