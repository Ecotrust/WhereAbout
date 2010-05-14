set DJANGO_SETTINGS_MODULE=settings
set GDAL_DATA=gdal_data

spatialite.exe database/db.sqlite < database/init_spatialite-2.3.sql
python manage.py syncdb --noinput
python manage.py loaddata test_users.json
spatialite.exe database/db.sqlite < database/data/fake-or-coast.sql