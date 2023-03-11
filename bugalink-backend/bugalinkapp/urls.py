from django.urls import include, path
from rest_framework import routers
from . import views
from .views import RatingViewSet

router = routers.DefaultRouter()
router.register(r'users/(?P<user_id>\d+)/reviews', RatingViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]