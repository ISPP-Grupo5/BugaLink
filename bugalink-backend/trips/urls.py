from django.urls import include, path
from rest_framework import routers
from trips.views import TripRequestViewSet, TripSearchViewSet, TripViewSet

router = routers.DefaultRouter()
router.register(r"trips", TripViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("trips/<int:id>/request/", TripRequestViewSet.as_view({"post": "create"})),
    path(
        "trips/<str:origin>/<str:destination>/<str:days>/<str:minstars>/<str:minprice>/<str:maxprice>/<str:date_from>/<str:date_to>/<str:hour_from>/<str:hour_to>/<str:prefers_music>/<str:prefers_talk>/<str:allows_pets>/<str:allows_smoking>/search",
        TripSearchViewSet.as_view({"get": "get"}),
    ),
    path(
        "trip-requests/<int:pk>/accept/", TripRequestViewSet.as_view({"put": "accept"})
    ),
    path(
        "trip-requests/<int:pk>/reject/", TripRequestViewSet.as_view({"put": "reject"})
    ),
]
