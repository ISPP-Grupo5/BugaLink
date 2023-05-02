import json
import os
import random

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bugalink_backend.settings")
django.setup()

from driver_routines.models import DriverRoutine
from drivers.models import Driver
from locations.models import Location
from passenger_routines.models import PassengerRoutine
from passengers.models import Passenger
from payment_methods.models import Balance, CreditCard, PaypalAccount
from ratings.models import DriverRating, Report
from trips.models import Trip, TripRequest
from users.models import User

modelos = json.load(open("populate_db.json", "r", encoding="utf-8"))

modelos_piloto = json.load(open("populate_pilots.json", "r", encoding="utf-8"))


def get_random_color():
    colors = ["\033[96m", "\033[93m", "\033[91m", "\033[94m", "\033[95m"]
    style = ["", "\033[1m", "\033[4m"]
    return f"{random.choice(colors)}{random.choice(style)}"


def execute():
    #si se quiere poblar con datos genéricos: modelos, para usuarios piloto: modelos_piloto
    populate = modelos_piloto

    ##IMPORTANTE no funciona, hacer flush como de normal y luego ejecutar el script
    #elimina los datos de las tablas al igual que un flush
    print("\033[92m" + "Deleting database...")
    for key in populate:
        print(get_random_color() + "Deleting " + key + "s" + "\033[0m")
        globals()[key].objects.all().delete()
    print("\033[92m" + "Delete FINISHED" + "\033[0m")

    #crea los datos de las tablas
    print("\033[92m" + "Populating database...")
    for key in populate:
        print(get_random_color() + "Creating " + key + "s" + "\033[0m")
        for attrs in populate[key]:
            globals()[key].objects.create(**attrs)
    print("\033[92m" + "Populate FINISHED" + "\033[0m")


if __name__ == "__main__":
    execute()