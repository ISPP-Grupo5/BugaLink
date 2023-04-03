from django.urls import include, path
from rest_framework import routers

from drivers.views import DriverViewSet

router = routers.DefaultRouter()
router.register(r"drivers", DriverViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
