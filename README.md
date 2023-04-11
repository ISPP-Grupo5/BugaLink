# Bugalink
## Información para desarrolladores
### Ejecución del backend
Para ejecutar el backend se debe configurar la base de datos y establecer los valores en un fichero .env que tiene que encontrarse en la raíz del proyecto. Debe contener las siguientes variables:
```
SECRET_KEY = # Clave secreta para los settings de django.
DEBUG='' # Indica si queremos ejecutar en modo DEBUG, no recomendado para producción
DATABASE_URL = "postgres://USER:PASSWORD@db:PORT/USER" # Ruta para conectar con la base de datos.
ENGINE='django.db.backends.postgresql_psycopg2' #Si es POSTGRESQL
NAME='' # Nombre de la base de datos
USER='' # Usuario para acceder a la base de datos
PASSWORD='' #  Contraseña  para acceder a la base de datos
HOST='localhost' # Host que escucha la base de datos
PORT='5432' # Puerto que escucha la base de datos
```

Es necesario también crear un entorno virtual python en la raiz del proyecto, y activarlo:

```
python -m venv venv
.\venv\Scripts\activate # en windows.
```

Debemos instalar pre-commit y docker. pre-commit se puede instalar con pip. Ejecutamos los siguientes comandos:

```
pip install pre-commit
cd bugalink-backend
pre-commit install
```

Finalmente para ejecutar el backend debemos correr los siguientes comandos:

```
docker-compose up
docker-compose exec web python manage.py migrate
```

Notése que el último comando solo debe ejecutarse una vez para crear las tablas de las bases de datos. Si se borraran los contenedores se debería ejecutar de nuevo.

#### Reseto de la base de datos

Para resetear la base de datos podemos ejecutar los siguientes comandos:

```
docker-compose down
docker volume rm bugalink-backend_postgres_data
```

Y ejecutando de nuevo el backend tendríamos una base de datos completeamente vacía.

### Ejecución del frontend
Se debe tener acceso al comando npm. Para ejecutar el frontend debemos ejecutar el script "frontend-startup.cmd".
### Ejecución del proyecto completo
Si queremos ejecutar el proyecto completo debemos ejecutar el script "startup.cmd"
