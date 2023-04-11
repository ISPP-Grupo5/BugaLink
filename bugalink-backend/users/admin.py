from django.contrib import admin

from .models import AdminUser, User

admin.site.register(AdminUser)
admin.site.register(User)
