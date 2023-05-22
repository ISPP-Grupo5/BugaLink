from django.urls import include, path
from rest_framework import routers
from trips.views import (
    CreateNextWeekTrip,
    ReportIssueGetViewSet,
    ReportIssuePostViewSet,
    TripRateViewSet,
    TripRequestViewSet,
    TripSearchViewSet,
    TripViewSet,
)

router = routers.DefaultRouter()
router.register(r"trips", TripViewSet)

urlpatterns = [
    path(
        "trips/<int:trip_id>/request/", TripRequestViewSet.as_view({"post": "create"})
    ),
    path(
        "trips/search/",
        TripSearchViewSet.as_view({"get": "get"}),
    ),
    path("trips/<int:trip_id>/rate/", TripRateViewSet.as_view({"post": "post"})),
    path(
        "trips/<int:trip_id>/report-issue/",
        ReportIssuePostViewSet.as_view({"post": "post"}),
    ),
    path(
        "trips/<int:pk>/users/",
        ReportIssueGetViewSet.as_view({"get": "get"}),
    ),
    path("trip-requests/<int:pk>/", TripRequestViewSet.as_view({"get": "get"})),
    path("trip-requests/pending/count/", TripRequestViewSet.as_view({"get": "count"})),
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
    path("trips/create_next_week_trips/", CreateNextWeekTrip.as_view({"post": "post"})),
    path("", include(router.urls)),
]
