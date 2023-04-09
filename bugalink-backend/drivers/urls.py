from django.urls import include, path
from drivers.views import DriverPreferencesView, DriverViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"drivers", DriverViewSet)

urlpatterns = [
    path(
        "drivers/docs/",
        DriverViewSet.as_view({"put": "post_docs"}),
        name="driver-post-docs",
    ),
    path(
        "drivers/<int:pk>/preferences/",
        DriverPreferencesView.as_view({"get": "obtener", "put": "actualizar"}),
    ),
    path("", include(router.urls)),
]
