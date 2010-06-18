set DJANGO_SETTINGS_MODULE=settings
createdb -U postgres -T template_postgis gwst
python add_merc.py
python manage.py syncdb --noinput
python manage.py loaddata test_users.json