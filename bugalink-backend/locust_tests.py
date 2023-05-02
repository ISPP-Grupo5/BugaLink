import decimal
import random

from locust import HttpUser, between, events, task

passenger_credentials = [
    ("JoseDelgado@bugalink.es", "JoseDelgadoBL123"),
    ("AishaQazza@bugalink.es", "AishaQazzaBL123"),
    ("MarinaRamiro@bugalink.es", "MarinaRamiroBL123"),
    ("JuanAlvarez@bugalink.es", "JuanAlvarezBL123"),
    ("RubenSuarez@bugalink.es", "RubenSuarezBL123"),
    ("CeliaHermoso@bugalink.es", "CeliaHermosoBL123"),
    ("ManuelDominguez@bugalink.es", "ManuelDominguezBL123"),
    ("RicardoNadal@bugalink.es", "RicardoNadalBL123"),
    ("CarlosDelgado@bugalink.es", "CarlosDelgadoBL123"),
    ("MarcosOlmedo@bugalink.es", "MarcosOlmedoBL123"),
    ("OlivaSanchez@bugalink.es", "OlivaSanchezBL123"),
    ("NicolasSanchez@bugalink.es", "NicolasSanchezBL123"),
    ("ManuelSanchez@bugalink.es", "ManuelSanchezBL123"),
    ("NoeliaLopez@bugalink.es", "NoeliaLopezBL123"),
    ("IreneDominguez@bugalink.es", "IreneDominguezBL123"),
    ("IsabelSanchez@bugalink.es", "IsabelSanchezBL123"),
    ("LucasPerez@bugalink.es", "LucasPerezBL123"),
    ("BeatrizBeltran@bugalink.es", "BeatrizBeltranBL123"),
    ("CarmenMunyoz@bugalink.es", "CarmenMunyozBL123"),
    ("MartaCumbrera@bugalink.es", "MartaCumbreraBL123"),
    ("MartaSanz@bugalink.es", "MartaSanzBL123"),
    ("GemaVela@bugalink.es", "GemaVelaBL123"),
    ("RosaMolina@bugalink.es", "RosaMolinaBL123"),
    ("BenitoVenegas@bugalink.es", "BenitoVenegasBL123"),
    ("LauraMunyoz@bugalink.es", "LauraMunyozBL123"),
    ("PaulaCortes@bugalink.es", "PaulaCortesBL123"),
    ("MarcosAleman@bugalink.es", "MarcosAlemanBL123"),
    ("GuillermoDiz@bugalink.es", "GuillermoDizBL123"),
    ("MarinaMoya@bugalink.es", "MarinaMoyaBL123"),
    ("IsmaelPerez@bugalink.es", "IsmaelPerezBL123"),
    ("DamarisGomez@bugalink.es", "DamarisGomezBL123"),
    ("AlvaroEscalante@bugalink.es", "AlvaroEscalanteBL123"),
    ("ClaradelaCruz@bugalink.es", "ClaradelaCruzBL123"),
    ("PaulaBenabal@bugalink.es", "PaulaBenabalBL123"),
    ("JuanSanchez@bugalink.es", "JuanSanchezBL123"),
    ("JoseLozano@bugalink.es", "JoseLozanoBL123"),
    ("RocioLopez@bugalink.es", "RocioLopezBL123"),
]
driver_credentials = [
    ("JoseDelgado@bugalink.es", "JoseDelgadoBL123"),
    ("AishaQazza@bugalink.es", "AishaQazzaBL123"),
    ("MarinaRamiro@bugalink.es", "MarinaRamiroBL123"),
    ("JuanAlvarez@bugalink.es", "JuanAlvarezBL123"),
    ("RubenSuarez@bugalink.es", "RubenSuarezBL123"),
    ("CeliaHermoso@bugalink.es", "CeliaHermosoBL123"),
    ("ManuelDominguez@bugalink.es", "ManuelDominguezBL123"),
    ("RicardoNadal@bugalink.es", "RicardoNadalBL123"),
    ("CarlosDelgado@bugalink.es", "CarlosDelgadoBL123"),
    ("MarcosOlmedo@bugalink.es", "MarcosOlmedoBL123"),
    ("OlivaSanchez@bugalink.es", "OlivaSanchezBL123"),
    ("NicolasSanchez@bugalink.es", "NicolasSanchezBL123"),
    ("ManuelSanchez@bugalink.es", "ManuelSanchezBL123"),
    ("NoeliaLopez@bugalink.es", "NoeliaLopezBL123"),
    ("LucasPerez@bugalink.es", "LucasPerezBL123"),
    ("MartaSanz@bugalink.es", "MartaSanzBL123"),
    ("GemaVela@bugalink.es", "GemaVelaBL123"),
    ("RosaMolina@bugalink.es", "RosaMolinaBL123"),
    ("BenitoVenegas@bugalink.es", "BenitoVenegasBL123"),
    ("RocioLopez@bugalink.es", "RocioLopezBL123"),
]
locations = [
    {
        "address": "Sevilla Santa Justa, Av. de Kansas City, S/N, 41007 Sevilla, España",
        "latitude": "37.3931893",
        "longitude": "-5.9737897",
    },
    {
        "address": "Calle de Fuencarral, 28, 28004 Madrid, España",
        "latitude": "40.4255438",
        "longitude": "-3.7036182",
    },
    {
        "address": "Carrer de Balmes, 129, 08008 Barcelona, España",
        "latitude": "41.3950627",
        "longitude": "2.1553563",
    },
    {
        "address": "Plaza Mayor, 28012 Madrid, España",
        "latitude": "40.4153634",
        "longitude": "-3.7073988",
    },
    {
        "address": "Calle Larios, 29005 Málaga, España",
        "latitude": "36.7209237",
        "longitude": "-4.4205783",
    },
    {
        "address": "Plaza de España, 41013 Sevilla, España",
        "latitude": "37.3772884",
        "longitude": "-5.9868999",
    },
    {
        "address": "Av. de la Reina Mercedes, s/n, 41012 Sevilla, España",
        "latitude": "37.3595301",
        "longitude": "-5.9862615",
    },
    {
        "address": "Av. de los Descubrimientos, S / N, 41927 Mairena del Aljarafe, Sevilla, España",
        "latitude": "37.3502362",
        "longitude": "-6.0512162",
    },
    {
        "address": "Pl. de la Encarnación, s/n, 41003 Sevilla, España",
        "latitude": "37.3932701",
        "longitude": "-5.9917478",
    },
    {
        "address": "Villavicencio de Los Caballeros, 1, 41701 Dos Hermanas, Sevilla, España",
        "latitude": "37.2854858",
        "longitude": "-5.9250307",
    },
    {
        "address": "Calle San Jacinto, 43, 41010 Sevilla, España",
        "latitude": "37.386865",
        "longitude": "-6.0025288",
    },
    {
        "address": "Calle Feria, 102, 41003 Sevilla, España",
        "latitude": "37.3926665",
        "longitude": "-5.9943749",
    },
    {
        "address": "Avenida de la Palmera, 2, 41012 Sevilla, España",
        "latitude": "37.3765631",
        "longitude": "-5.9868936",
    },
    {
        "address": "Calle Francos, 14, 41004 Sevilla, España",
        "latitude": "37.3892979",
        "longitude": "-5.9939536",
    },
    {
        "address": "Calle O'Donnell, 16, 41001 Sevilla, España",
        "latitude": "37.3859916",
        "longitude": "-5.9948651",
    },
    {
        "address": "Calle Asunción, 57, 41011 Sevilla, España",
        "latitude": "37.3800148",
        "longitude": "-5.9861531",
    },
    {
        "address": "Calle Betis, 29, 41010 Sevilla, España",
        "latitude": "37.3823332",
        "longitude": "-6.0003442",
    },
    {
        "address": "Calle Torneo, 33, 41002 Sevilla, España",
        "latitude": "37.3998183",
        "longitude": "-5.9924998",
    },
    {
        "address": "Calle Alfonso XII, 4, 41002 Sevilla, España",
        "latitude": "37.3841708",
        "longitude": "-5.9957389",
    },
    {
        "address": "Calle Arjona, 27, 41001 Sevilla, España",
        "latitude": "37.3860796",
        "longitude": "-5.9958323",
    },
    {
        "address": "Calle San Eloy, 9, 41001 Sevilla, España",
        "latitude": "37.3900077",
        "longitude": "-5.9970359",
    },
    {
        "address": "Calle Cuna, 19, 41004 Sevilla, España",
        "latitude": "37.3902494",
        "longitude": "-5.9941448",
    },
    {
        "address": "Calle Betis, 17, 41010 Sevilla, España",
        "latitude": "37.3821761",
        "longitude": "-6.0001243",
    },
    {
        "address": "Calle San Luis, 44, 41003 Sevilla, España",
        "latitude": "37.3960331",
        "longitude": "-5.9920974",
    },
    {
        "address": "Calle Reyes Católicos, 11, 41001 Sevilla, España",
        "latitude": "37.3892579",
        "longitude": "-5.9987862",
    },
]
days_of_week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


class BugalinkUser(HttpUser):
    abstract = True
    user_data = None
    user_id = None
    passenger_id = None
    driver_id = None
    credentials = None

    def generate_token(self, email, password):
        # hacer una solicitud HTTP para autenticar al usuario
        try:
            response = self.client.post(
                "/api/v1/auth/login/", json={"email": email, "password": password}
            )
            token = response.json()["access"]
            return token
        except Exception:
            return None

    def is_status_code_2xx(self, status_code):
        return status_code >= 200 and status_code < 300

    def on_start(self):
        # Login
        email, password = random.choice(self.credentials)
        token = self.generate_token(email, password)
        if token is None:
            print(f"Error logging user {email}")
            self.stop(force=True)
            return
        self.client.headers.update({"Authorization": f"Bearer {token}"})
        # Get user_id
        user = self.client.get("/api/v1/auth/user/").json()
        self.user_id = user["pk"]

        # Get user data
        self.user_data = self.client.get(
            f"/api/v1/users/{self.user_id}/", name="/api/v1/users/{user_id}/"
        ).json()
        self.passenger_id = self.user_data["passenger"]
        self.driver_id = self.user_data["driver"]
        # print(f"user_id {self.user_id} for user {email}: passenger {self.passenger_id}, driver {self.driver_id}")

    @task(2)
    def get_base_page(self):
        self.client.get("/api/v1/conversations/pending/count/")
        self.client.get("/api/v1/trip-requests/pending/count/")
        upcomming_trips = self.client.get(
            f"/api/v1/users/{self.user_id}/trip-requests/?requestStatus=PENDING,ACCEPTED&tripStatus=PENDING&distinct=true",
            name="/api/v1/users/{user_id}/trip-requests/?requestStatus=PENDING,ACCEPTED&tripStatus=PENDING&distinct=true",
        ).json()
        # print([t["trip"]["id"] for t in upcomming_trips])
        if (
            len(upcomming_trips) > 0 and random.randint(1, 5) == 1
        ):  # Establezco que 1 de cada 5 veces se entra en un upcomming trip
            trip = random.choice(upcomming_trips)
            trip_id = trip["trip"]["id"]
            trip_driver_id = trip["trip"]["driver"]["id"]
            trip_driver_user_id = trip["trip"]["driver"]["user"]["id"]
            self.client.get(
                f"/api/v1/trips/{trip_id}/", name="/api/v1/trips/{trip_id}/"
            )
            self.client.get(
                f"/api/v1/drivers/{trip_driver_id}/preferences/",
                name="/api/v1/drivers/{driver_id}/preferences/",
            )
            self.client.get(
                f"/api/v1/users/{trip_driver_user_id}/stats/",
                name="/api/v1/users/{user_id}/stats/",
            )

        if (
            random.randint(1, 3) == 1
        ):  # Establezco que 1 de cada 3 veces se entra en las recomendaciones
            self.client.get("/api/v1/trips/recommendations/")

    @task(1)
    def get_profile(self):
        self.client.get(
            f"/api/v1/users/{self.user_id}/", name="/api/v1/users/{user_id}/"
        )
        self.client.get(
            f"/api/v1/users/{self.user_id}/stats/",
            name="/api/v1/users/{user_id}/stats/",
        )


class PassengerUser(BugalinkUser):
    wait_time = between(4, 10)

    def on_start(self):
        self.credentials = passenger_credentials
        super().on_start()

    @task(1)
    def get_horario(self):
        self.client.get(
            f"/api/v1/passengers/{self.passenger_id}/",
            name="/api/v1/passengers/{passenger_id}/",
        )

    @task(1)
    def create_passenger_routine(self):
        origin, destination = random.sample(locations, 2)

        number_of_days = random.randint(1, 7)
        days = random.sample(days_of_week, number_of_days)

        data = {
            "origin": origin,
            "destination": destination,
            "days_of_week": days,
            "departure_time_start": "12:00",
            "departure_time_end": "12:10",
            "arrival_time": "13:00",
            "price": "",
            "note": "",
            "is_recurrent": False,
        }
        self.client.post("/api/v1/passenger-routines/", json=data)

    @task(1)
    def search_trips_and_request_one(self):
        origin, destination = random.sample(locations, 2)
        origin_lat = origin["latitude"]
        origin_long = origin["longitude"]
        destination_lat = destination["latitude"]
        destination_long = destination["longitude"]
        trips = self.client.get(
            f"/api/v1/trips/search/?origin={origin_lat},{origin_long}&destination={destination_lat},{destination_long}",
            name="/api/v1/trips/search/",
        ).json()

        if len(trips) > 0:
            trip = random.choice(trips)
            trip_id = trip["id"]
            balance = decimal.Decimal(
                self.client.get(
                    f"/api/v1/users/{self.user_id}/balance/",
                    name="/api/v1/users/{user_id}/balance/",
                ).json()["amount"]
            )
            price = decimal.Decimal(trip["driver_routine"]["price"])
            driver_user_id = trip["driver"]["user"]["id"]
            if balance > price and driver_user_id != self.user_id:
                print(f"{self.user_id} ha solicitado un viaje a {driver_user_id}")
                self.client.post(f"/api/v1/trips/{trip_id}/checkout-balance/")


class DriverUser(BugalinkUser):
    wait_time = between(4, 10)

    def on_start(self):
        self.credentials = driver_credentials
        super().on_start()

    @task(1)
    def get_horario(self):
        self.client.get(
            f"/api/v1/passengers/{self.passenger_id}/",
            name="/api/v1/passengers/{passenger_id}/",
        )
        self.client.get(
            f"/api/v1/drivers/{self.driver_id}/", name="/api/v1/drivers/{driver_id}/"
        )

    @task(1)
    def get_pending_requests_and_accept_or_reject_one(self):
        pending_requests = self.client.get(
            f"/api/v1/users/{self.user_id}/trip-requests/?requestStatus=PENDING&role=driver",
            name="/api/v1/users/{user_id}/trip-requests/?requestStatus=PENDING&role=driver",
        ).json()
        for request in pending_requests:  # Load the info of each user requesting a seat
            request_user_id = request["passenger"]
            self.client.get(
                f"/api/v1/users/{request_user_id}/", name="/api/v1/users/{user_id}/"
            )
        if len(pending_requests) > 0:  # Enter in a random one
            request = random.choice(pending_requests)
            request_id = request["id"]
            trip_id = request["trip"]["id"]
            request_user_id = request["passenger"]
            self.client.get(
                f"/api/v1/trip-requests/{request_id}/",
                name="/api/v1/trip-requests/{trip_request_id}/",
            )
            trip = self.client.get(
                f"/api/v1/trips/{trip_id}/", name="/api/v1/trips/{trip_id}/"
            ).json()
            self.client.get(
                f"/api/v1/users/{request_user_id}/stats/",
                name="/api/v1/users/{user_id}/stats/",
            )

            accept_request = False  # If there is no more available seats the user can only reject requests
            try:
                if len(trip["passengers"]) < trip["driver_routine"]["available_seats"]:
                    accept_request = random.choice([True, False])
            except Exception as e:
                print("\n\n\n" + str(e))
            if accept_request:
                self.client.put(
                    f"/api/v1/trip-requests/{request_id}/accept/",
                    name="/api/v1/trip-requests/{request_id}/accept/",
                )
                print(f"{self.user_id} has accepted {request_user_id}")
            else:
                data = {"reject_note": "No te llevo rey te jodes y andas"}
                self.client.put(
                    f"/api/v1/trip-requests/{request_id}/reject/",
                    json=data,
                    name="/api/v1/trip-requests/{request_id}/reject/",
                )
                print(f"{self.user_id} has rejected {request_user_id}")

    @task(1)
    def create_driver_routine(self):
        origin, destination = random.sample(locations, 2)

        number_of_days = random.randint(1, 7)
        days = random.sample(days_of_week, number_of_days)
        price = str(round(random.uniform(0, 2), 2))
        available_seats = random.randint(1, 6)

        data = {
            "origin": origin,
            "destination": destination,
            "days_of_week": days,
            "departure_time_start": "12:00",
            "departure_time_end": "12:10",
            "arrival_time": "13:00",
            "price": price,
            "note": "Hello there! I'm using Whatsapp",
            "is_recurrent": True,
            "available_seats": available_seats,
        }
        self.client.post("/api/v1/driver-routines/", json=data)
