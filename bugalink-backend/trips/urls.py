from django.urls import include, path
from rest_framework import routers
from trips.views import (
    ReportIssueViewSet,
    TripRequestViewSet,
    TripSearchViewSet,
    TripViewSet,
)

router = routers.DefaultRouter()
router.register(r"trips", TripViewSet)

urlpatterns = [
    path("trips/<int:id>/request/", TripRequestViewSet.as_view({"post": "create"})),
    path(
        "trips/search/",
        TripSearchViewSet.as_view({"get": "get"}),
    ),
    path(
        "trips/<int:trip_id>/report-issue/",
        ReportIssueViewSet.as_view({"post": "post"}),
    ),
    path(
        "trips/<int:trip_id>/report-issue/",
        ReportIssueViewSet.as_view({"post": "post"}),
    ),
    path("trip-requests/<int:pk>/", TripRequestViewSet.as_view({"get": "get"})),
    path(
        "trips/recommendations/",
        TripViewSet.as_view({"get": "list_recommendations"}),
    ),
    path(
        "trip-requests/<int:pk>/accept/", TripRequestViewSet.as_view({"put": "accept"})
    ),
    path(
        "trip-requests/<int:pk>/reject/", TripRequestViewSet.as_view({"put": "reject"})
    ),
    path("", include(router.urls)),
]
