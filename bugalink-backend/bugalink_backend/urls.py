"""bugalink_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from drf_spectacular.views import (  # SpectacularRedocView,
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from . import settings
from django.conf.urls.static import static
urlpatterns = [
    path("admin/", admin.site.urls),
    # Include URLs for auth app
    path("api/v1/auth/", include("authentication.urls")),
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Docs UI
    path("api/v1/docs", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
    # URLs for the app
    path("api/v1/", include("users.urls")),
    path("api/v1/", include("passengers.urls")),
    path("api/v1/", include("drivers.urls")),
    path("api/v1/", include("driver_routines.urls")),
    path("api/v1/", include("passenger_routines.urls")),
    path("api/v1/", include("trips.urls")),
    path("api/v1/", include("payment_methods.urls")),
    path("api/v1/", include("transactions.urls")),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
