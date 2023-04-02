from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# TODO: fix admin panel user stuff
from .models import AdminUser, User

admin.site.register(AdminUser)
admin.site.register(User)
