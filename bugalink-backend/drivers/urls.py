from django.urls import include, path
from rest_framework import routers

from drivers.views import DriverViewSet, DriverPreferencesView

router = routers.DefaultRouter()
router.register(r"drivers", DriverViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("drivers/<int:pk>/preferences/", DriverPreferencesView.as_view({"get":"obtener", "put":"actualizar"})),
]
