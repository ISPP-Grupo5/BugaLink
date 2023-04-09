from django.urls import include, path
from rest_framework import routers
from trips.views import TripRecommendationViewSet, TripRequestViewSet, TripViewSet

router = routers.DefaultRouter()
router.register(r"trips", TripViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("trips/<int:id>/request/", TripRequestViewSet.as_view({"post": "create"})),
    path(
        "trips/recommendations",
        TripRecommendationViewSet.as_view({"get": "get"}),
    ),
    path(
        "trip-requests/<int:pk>/accept/", TripRequestViewSet.as_view({"put": "accept"})
    ),
    path(
        "trip-requests/<int:pk>/reject/", TripRequestViewSet.as_view({"put": "reject"})
    ),
]
