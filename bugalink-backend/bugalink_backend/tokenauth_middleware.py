import jwt
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from users.models import User


@database_sync_to_async
def get_user(token_key):
    try:
        token = jwt.decode(jwt=token_key, key=settings.SECRET_KEY, algorithms=["HS256"])
        user_id = token["user_id"]
        return User.objects.get(id=user_id)
    except Token.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        token_key = scope["query_string"].decode().split("=")[-1]

        scope["user"] = await get_user(token_key)

        return await super().__call__(scope, receive, send)
