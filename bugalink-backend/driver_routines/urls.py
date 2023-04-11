from django.urls import include, path
from rest_framework import routers

from driver_routines.views import DriverRoutineViewSet

router = routers.DefaultRouter()
router.register(r"driver-routines", DriverRoutineViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
