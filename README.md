# Bugalink
## Información para desarrolladores
### Ejecución del backend
Para ejecutar el backend se debe configurar la base de datos y establecer los valores en un fichero .env que tiene que encontrarse en la raíz del proyecto. Debe contener las siguientes variables:
```
DEBUG='' # Indica si queremos ejecutar en modo DEBUG, no recomendado para producción
ENGINE='django.db.backends.postgresql_psycopg2' #Si es POSTGRESQL
NAME='' # Nombre de la base de datos
USER='' # Usuario para acceder a la base de datos
PASSWORD='' #  Contraseña  para acceder a la base de datos
HOST='localhost' # Host que escucha la base de datos
PORT='5432' # Puerto que escucha la base de datos
```

Es necesario también crear un entorno virtual python en la raiz del proyecto. Su directorio debe llamarse "venv" para que funcionen correctamente los scripts de inicialización.
```
python -m venv venv
```
Una vez hecho esto podemos ejecutar el script "backend-startup.cmd".
### Ejecución del frontend
Para ejecutar el frontend debemos ejecutar el script "frontend-startup.cmd".
### Ejecución del proyecto completo
Si queremos ejecutar el proyecto completo debemos ejecutar el script "startup.cmd"
