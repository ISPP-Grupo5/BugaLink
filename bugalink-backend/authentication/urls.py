from authentication.serializers import CustomRegisterSerializer
from authentication.views import EnrichedObtainTokenPairView
from dj_rest_auth.registration.views import RegisterView
from django.conf.urls import include
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("login/", EnrichedObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("", include("dj_rest_auth.urls")),
    # Custom serializer for registration
    path(
        "registration/",
        RegisterView.as_view(serializer_class=CustomRegisterSerializer),
        name="custom_register",
    ),
    # This includes default endpoints for resend-email and verify-email
    path("registration/", include("dj_rest_auth.registration.urls")),
    path("account/", include("allauth.urls")),
]
