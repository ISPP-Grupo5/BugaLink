"""
ASGI config for ChatAPI project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
import django  # new

from django.core.asgi import get_asgi_application



os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bugalink_backend.settings")
django.setup()
asgi_application = get_asgi_application()

from chats import routing  # new
from .tokenauth_middleware import TokenAuthMiddleware  # new

application = ProtocolTypeRouter(
    {
        "http": asgi_application,
        "websocket": AllowedHostsOriginValidator(  # new
            TokenAuthMiddleware(URLRouter(routing.websocket_urlpatterns))
        ),
    }
)
