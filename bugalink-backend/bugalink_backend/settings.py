import os
from datetime import timedelta

from decouple import config
from dj_database_url import parse as db_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY")


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG", default=False, cast=bool)

CSRF_TRUSTED_ORIGINS = ["https://app.bugalink.es", "https://www.app.bugalink.es"]

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Developer Apps
    "bugalink_backend",
    "authentication",
    "driver_routines",
    "drivers",
    "locations",
    "passenger_routines",
    "passengers",
    "payment_methods",
    "ratings",
    "trips",
    "users",
    "chats",
    "transactions",
    # Third-party packages
    "paypal",
    "paypalrestsdk",
    "drf_spectacular",
    "rest_framework",
    "channels",
    "drf_standardized_errors",
    # Auth modules
    "rest_framework.authtoken",
    "dj_rest_auth",
    "allauth",
    "allauth.account",
    "dj_rest_auth.registration",
]

# Custom user model
AUTH_USER_MODEL = "users.User"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]

ROOT_URLCONF = "bugalink_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "bugalink_backend.wsgi.application"


# Database
# If you wish to use some other database other than the default sqlite
# Make sure to update the value of DATABASE_URL in your .env file
APP_ENGINE = False
if os.environ.get("IS_APP_ENGINE"):
    APP_ENGINE = True
    DATABASES = {
        "default": {
            "ENGINE": config("ENGINE"),
            "NAME": config("NAME"),
            "USER": config("USER_DB"),
            "PASSWORD": config("PASSWORD"),
            "HOST": config("HOST"),
            "PORT": 5432,
        }
    }
elif os.environ.get("IS_DOCKER"):
    DATABASES = {
        "default": config(
            "DATABASE_URL",
            default="sqlite:///" + os.path.join(BASE_DIR, "db.sqlite3"),
            cast=db_url,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": config("ENGINE"),
            "NAME": config("NAME"),
            "USER": config("USER"),
            "PASSWORD": config("PASSWORD"),
            "HOST": "localhost",
            "PORT": config("PORT"),
        }
    }


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


REST_FRAMEWORK = {
    # Default permission classes
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    # Authentication
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication"
    ],
    # Activate drf_spectacular
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    # Activate drf_standardized_errors
    "EXCEPTION_HANDLER": "drf_standardized_errors.handler.exception_handler",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
}

# drf_spectacular config
SPECTACULAR_SETTINGS = {
    "TITLE": "bugalink_backend Project API",
    "VERSION": "1.0.0",
}

APPEND_SLASH = True

# Dj-rest-auth and all-auth config
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "optional"
LOGIN_REDIRECT_URL = "/"
REST_USE_JWT = True
JWT_AUTH_COOKIE = "auth"

REST_AUTH_REGISTER_SERIALIZERS = {
    "REGISTER_SERIALIZER": "authentication.serializers.CustomRegisterSerializer",
}

ALLOWED_HOSTS = ["*"]
STRIPE_SECRET_KEY = config("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = config("WEBHOOK_SECRET")
PAYPAL_CLIENT_ID = config("PAYPAL_CLIENT_ID")
PAYPAL_SECRET_KEY = config("PAYPAL_SECRET_KEY")

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


MEDIA_ROOT = os.path.join(BASE_DIR, "files")
STATIC_ROOT = os.path.join(BASE_DIR, "/static/")
MEDIA_URL = "/media/"
STATIC_URL = "/static/"


CORS_ORIGIN_ALLOW_ALL = True

ASGI_APPLICATION = "bugalink_backend.asgi.application"


if os.environ.get("IS_APP_ENGINE"):
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [("10.194.81.115", 6379)],
            },
        },
    }
else:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [("redis", 6379)],
            },
        },
    }
