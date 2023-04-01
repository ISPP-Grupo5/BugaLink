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


# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Developer Apps
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
    # Third-party packages
    "drf_spectacular",
    "rest_framework",
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
if os.environ.get("IS_APP_ENGINE"):
    DATABASES = {
        "default": {
            "ENGINE": config("ENGINE"),
            "NAME": config("NAME"),
            "USER": config("USER"),
            "PASSWORD": config("PASSWORD"),
            "HOST": config("HOST"),
            "PORT": config("PORT"),
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
}

SIMPLE_JWT = {
    # TODO: make access token expire after 60 minutes once we have the frontend
    # asking for a new token when the old one expires. We are doing this because
    # we need the auth mechanism to work for now.
    "ACCESS_TOKEN_LIFETIME": timedelta(days=14),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
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


LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_ROOT = "static"
STATIC_URL = "/static/"

STATICFILES_DIRS = []


# TODO: only allow cors requests from the frontend (localhost:3000 or the deployed url)
CORS_ORIGIN_ALLOW_ALL = True
