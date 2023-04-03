from django.urls import include, path
from rest_framework import routers

from trips.views import TripRequestViewSet, TripViewSet

router = routers.DefaultRouter()
router.register(r"trips", TripViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("trips/<int:id>/request/", TripRequestViewSet.as_view({"post": "create"})),
    path(
        "trip-requests/<int:pk>/accept/", TripRequestViewSet.as_view({"put": "accept"})
    ),
    path(
        "trip-requests/<int:pk>/reject/", TripRequestViewSet.as_view({"put": "reject"})
    ),
]
