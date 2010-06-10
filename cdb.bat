set DJANGO_SETTINGS_MODULE=settings
createdb -U postgres -T template_postgis gwst
python add_merc.py
psql -d gwst -f database\data\OregonRecClipRegion.sql -U postgres
python manage.py syncdb --noinput
python manage.py loaddata test_users.json