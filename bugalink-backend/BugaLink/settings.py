"""
Django settings for BugaLink project.

Generated by 'django-admin startproject' using Django 4.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""
from pathlib import Path
from urllib.parse import urlparse
from dotenv import dotenv_values
import os
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

#This is for the correct reading of the .env file
config_file = BASE_DIR.parent.joinpath("config.env")
env = dotenv_values(dotenv_path=config_file)

SECRET_KEY = 'django-insecure-br8yvhx^^w#x0e3i03qy($-^q49(xk-9uhf^=vj8igoa-8g#75'

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = env['DEBUG']

if os.environ.get("IS_APP_ENGINE"):
    print("The app is being run in App Engine")
    #####
    # Para despliege en APP ENGINE
    APPENGINE_URL = env['APPENGINE_URL']
    if APPENGINE_URL:
        # Ensure a scheme is present in the URL before it's processed.
        if not urlparse(APPENGINE_URL).scheme:
            APPENGINE_URL = f"https://{APPENGINE_URL}"
        APP_URL="https://app.bugalink.es"
        WWW_APP_URL="https://www.app.bugalink.es"
        

        ALLOWED_HOSTS = [urlparse(APPENGINE_URL).netloc,urlparse(APP_URL).netloc,urlparse(WWW_APP_URL).netloc]
        CSRF_TRUSTED_ORIGINS = [APPENGINE_URL,APP_URL,WWW_APP_URL]
        SECURE_SSL_REDIRECT = True
    else:
        ALLOWED_HOSTS = ["*"]
    #
    #####
else:
    print("The app is being run locally")
    ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'newsletter',
    'bugalinkapp',
    'corsheaders',


]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CONFIGURACION DE SESIONES
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 31536000

ROOT_URLCONF = 'BugaLink.urls'

CORS_ORIGIN_ALLOW_ALL = True


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'BugaLink.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

if os.environ.get("IS_APP_ENGINE"):

    DATABASES = {
        'default': {
            'ENGINE': env['ENGINE'],
            'NAME': env['NAME'],
            'USER': env['USER'],
            'PASSWORD': env['PASSWORD'],
            'HOST': env['HOST'],
            'PORT': env['PORT'],
        }
    }
else:
    DATABASES = {
        'default': { 
            'ENGINE': env['ENGINE'],
            'NAME': env['NAME'],
            'USER': env['USER'],
            'PASSWORD': env['PASSWORD'],
            'HOST': 'localhost',
            'PORT': env['PORT'],
        }
    }



# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_ROOT = "static"
STATIC_URL = "/static/"
STATICFILES_DIRS = []


MEDIA_ROOT = os.path.join(BASE_DIR.parent, 'files')
MEDIA_URL = '/media/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
