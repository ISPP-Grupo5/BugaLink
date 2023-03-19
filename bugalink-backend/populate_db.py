import os
import django
import json
from operator import attrgetter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BugaLink.settings')
django.setup()
modelos = json.load(open('populate_db.json', 'r', encoding='utf-8'))



from bugalinkapp.models import *
from django.contrib.auth.models import User

# #Borrado de todas las tablas
#
# for key in modelos:
#     globals()[key].objects.all().delete()


User.objects.create_superuser(username='admin', email=None, password='admin')

for key in modelos:
    print(key)
    for attrs in modelos[key]:
        if key in 'User':
            User.objects.create_user(**attrs)
        # elif key in 'Vehicle':
        #     driver_id = attrs['driver_id']
        #     del attrs['driver_id']
        #     vehicle = Vehicle.objects.create(**attrs)
        #     vehicle.driver.add(driver_id)
        #     vehicle.save()
        else:
            globals()[key].objects.create(**attrs)
