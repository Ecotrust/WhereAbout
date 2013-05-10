set DJANGO_SETTINGS_MODULE=settings
createdb -U postgres -T template_postgis sccam_db
python add_merc.py
python manage.py syncdb --noinput
REM python manage.py loaddata test_users.json