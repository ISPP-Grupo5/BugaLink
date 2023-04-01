<h1>
	bugalink_backend REST API.
</h1>


## What is this about?
This project was generated using the ADVANCED template of the drf-cli


## Running the Project

- Run `pre-commit install` in your project's root directory to install git hooks 
in your `.git` directory

- To see your git hooks in action, make your first git commit. The first time your hooks run,
it will take a while to execute. It's normal. Subsequent executions won't take that long

- Run `docker-compose up --build` to build your docker image and start your docker container.

- Navigate to your project directory in a new terminal and run 
`docker-compose exec `web python manage.py makemigrations users` to create migrations for the customUser model

- Run `docker-compose exec web python manage.py migrate`

- Point your browser to `http://localhost:8000/api/v1/docs`. You should see the auto-generated 
docs on that page


## This project comes bundled with:
- git initialized

- python-decouple: for managing environment varibales 
[See Package Docs Here](https://pypi.org/project/python-decouple/). 

- drf-spactacular: for auto-generating APi docs 
[See Package Docs Here](https://drf-spectacular.readthedocs.io/en/latest/readme.html). 

- dj-database-url: for connecting to various databases 
[See Package Docs Here](https://github.com/jazzband/dj-database-url). 

- pre-commit, black, isort, flake8: for code linting with pre-commit hooks 
[See this tutorial for more on working with pre-commit hooks in Python](https://ljvmiranda921.github.io/notebook/2018/06/21/precommits-using-black-and-flake8/)

- pytest-django: for writing unit tests with pytest 
[See Package Docs Here](https://pytest-django.readthedocs.io/en/latest/). 

- Docker for containerization. We are using docker to setup the postgres db for this project as well.
[check out this tutorial for guide on how to work with docker, and postgres in Django](
	https://learndjango.com/tutorials/django-docker-and-postgresql-tutorial
)

- A custom user model defined in a `users` app

- Authentication endpoints defined in an `authentication` app with the `dj-rest-auth and all-auth` packages.
[See Package Docs Here](https://dj-rest-auth.readthedocs.io/en/latest/introduction.html). 


## Quick note on pre-commit hooks
With precommit hooks setup in this project, when you try to commit a change, 
your imports are automatically sorted with `isort`, your code formatted with `black`
and `flake8` is run on your code to catch formatting issues missed by black.
If isort, black, flake8 do not return errors, your changes will be commited.
Else isort and black would automatically fix the errors they catch. You'd have to manually fix the 
issues identified by flake8 though. Stage your changes
before commiting again. Repeat the cycle again if new code formatting issues are found.