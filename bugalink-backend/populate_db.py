import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE','BugaLink.settings')
django.setup()
from bugalinkapp.models import *

print('hola')