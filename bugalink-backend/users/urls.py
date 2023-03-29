from django.urls import include, path
from rest_framework import routers

from users.views import BecomeDriverView, UserTripsView, UserViewSet

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("users/become-driver", BecomeDriverView.as_view()),
    path("users/<int:id>/trip-requests", UserTripsView.as_view()),
]
