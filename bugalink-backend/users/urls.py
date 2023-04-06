from django.urls import include, path
from rest_framework import routers

from users.views import BecomeDriverView, UserTripsView, UserViewSet, UserUpdateView, UserStatsView, UserRatingView

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("users/become-driver", BecomeDriverView.as_view()),
    path("users/<int:id>/trip-requests/", UserTripsView.as_view()),
    path("users/<int:id>/edit/", UserUpdateView.as_view()),
    path("users/<int:pk>/stats/", UserStatsView.as_view({"get":"get"})),
    path("users/<int:pk>/rating/", UserRatingView.as_view({"get":"get"})),
]
