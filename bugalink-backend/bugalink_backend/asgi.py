"""
ASGI config for ChatAPI project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator  # new
from chats import routing  # new
from django.core.asgi import get_asgi_application

from .tokenauth_middleware import TokenAuthMiddleware  # new

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bugalink_backend.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(  # new
            TokenAuthMiddleware(URLRouter(routing.websocket_urlpatterns))
        ),
    }
)
