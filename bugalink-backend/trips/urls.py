from django.urls import include, path
from rest_framework import routers
from trips.views import TripRequestViewSet, TripSearchViewSet, TripViewSet

router = routers.DefaultRouter()
router.register(r"trips", TripViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("trips/<int:id>/request/", TripRequestViewSet.as_view({"post": "create"})),
    path(
        "trips/search",
        TripSearchViewSet.as_view({"get": "get"}),
    ),
    path("trip-requests/<int:pk>/", TripRequestViewSet.as_view({"get": "get"})),
    path(
        "trip-requests/<int:pk>/accept/", TripRequestViewSet.as_view({"put": "accept"})
    ),
    path(
        "trip-requests/<int:pk>/reject/", TripRequestViewSet.as_view({"put": "reject"})
    ),
]
