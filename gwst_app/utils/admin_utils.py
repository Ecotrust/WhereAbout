import settings
from django.contrib import admin
from django.contrib.auth.models import User

"""
Tools to be used for admin-lite. Desktop installs can use these shortcuts to make the tool simpler
and easier to use.
"""
def create_superuser(username):
    if settings.DESKTOP_BUILD:
        new_admin, created = User.objects.get_or_create(username = username, is_staff = True, is_active = True, is_superuser = True )
        if created:
            new_admin.set_password(settings.PASSWORD);
            new_admin.save();

        return created
    return False
            
def create_user():
    if settings.DESKTOP_BUILD:
    
        users = User.objects.filter(is_staff = False, is_superuser = False)
        user_count = users.count()

        while users.filter(username = user_count).count() > 0:
            user_count += 1
    
        new_user, created = User.objects.get_or_create(username = user_count, is_staff = False, is_active = True, is_superuser = False )
        if created:
            new_user.set_password(settings.PASSWORD)
            new_user.save()

            return new_user.id
    return -1