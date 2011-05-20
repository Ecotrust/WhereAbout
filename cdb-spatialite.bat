set DJANGO_SETTINGS_MODULE=settings
set GDAL_DATA=%gdal_data%
REM spatialite.exe database/cc_db.sqlite < database/data/ORClipRegion.sqlite
spatialite.exe database/cc_db.sqlite < database/init_spatialite-2.3.sql
python manage.py syncdb --noinput