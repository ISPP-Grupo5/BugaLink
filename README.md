<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://bugalink.es">
    <img src="https://i.imgur.com/qea3scI.jpg" alt="Logo" width="320" height="180">
  </a>
  <br/>

  <p align="center">
    Travel together, save money, save the planet ♻️
    <br />
    <br />
    <a href="bugalink.es">Go to website</a>
    ·
    <a href="https://github.com/ISPP-Grupo5/BugaLink/issues">Report Bug</a>
    ·
    <a href="https://github.com/ISPP-Grupo5/BugaLink/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Bugalink is a webapp that allows you to find other people who share the same routes as you, so you can travel The project is being developed for the ISPP subject of University of Seville.

The landing page is accessible via the [bugalink.es](https://bugalink.es) domain. There is a link in the navigation bar that leads to [app.bugalink.es](https://app.bugalink.es) where the user can access all the functionalities of the application once they have registered and logged in.

  <a href="https://bugalink.es">
  <img src="https://i.imgur.com/DY8N0C0.gif" alt="Landing page" style="width: 100%; height: 100%;">
  </a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Next][next.js]][next-url]
- [![React][react.js]][react-url]
- [![Django][django]][django-url]
- [![PostgreSQL][postgresql]][postgresql-url]
- [![Redis][redis]][redis-url]
- [![Docker][docker]][docker-url]
- [![Google cloud platform][google-cloud-platform]][google-cloud-platform-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these steps:

### Prerequisites

Before working with the project, you need to have installed the following tools:

```sh
# Install python (only for local development)
sudo apt install python3
pip install --upgrade pip
pip install virtualenv

# Install docker
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install npm
npm install npm@latest -g

```

### Installation

1. Clone the repo

```sh
git clone https://github.com/ISPP-Grupo5/BugaLink.git
```

2. Set up your .env files:

```sh
# bugalink-backend/.env
SECRET_KEY="SECRET_KEY"
DEBUG=True
DATABASE_URL="postgres://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}"

ENGINE="django.db.backends.postgresql_psycopg2"
NAME="NAME"
USER="USER"
PASSWORD="PASSWORD"
PORT="5432"
```

```sh
# bugalink-frontend/.env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY='API_KEY'
NODE_ENV='development'

NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_DOMAIN=http://127.0.0.1:3000
NEXTAUTH_URL=http://127.0.0.1:3000
NEXTAUTH_SECRET=SECRET_KEY
```

3. Create, run and set up the backend docker containers **(From the backend directory)**

```sh
cd bugalink-backend

# Install the dependencies (only for local development)
pip install -r requirements.txt
pip install -r requirements-dev.txt
pre-commit install

# Start the django project and PostgreSQL-redis databases
docker-compose up --build
docker-compose exec web python manage.py migrate
docker-compose exec web python populate_db.py
```

4. Run the frontend server **(From the frontend directory)**

```sh
cd bugalink-frontend
npm install
npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

BugaLink - [@buga_link](https://twitter.com/buga_link) - soporte@bugalink.es

Project Link: [https://github.com/ISPP-Grupo5/BugaLink](https://github.com/ISPP-Grupo5/BugaLink)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/ISPP-Grupo5/BugaLink.svg?style=for-the-badge
[contributors-url]: https://github.com/ISPP-Grupo5/BugaLink/graphs/contributors
[stars-shield]: https://img.shields.io/github/stars/ISPP-Grupo5/BugaLink.svg?style=for-the-badge
[stars-url]: https://github.com/ISPP-Grupo5/BugaLink/stargazers
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[django]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green
[django-url]: https://www.djangoproject.com/
[postgresql]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[postgresql-url]: https://www.postgresql.org/
[redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white
[redis-url]: https://redis.io/
[docker]: https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white
[docker-url]: https://www.docker.com/
[google-cloud-platform]: https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white
[google-cloud-platform-url]: https://cloud.google.com/
