set DJANGO_SETTINGS_MODULE=settings
set GDAL_DATA=%gdal_data%
REM spatialite.exe database/dive_db.sqlite < database/data/ORClipRegion.sqlite
REM spatialite.exe database/dive_db.sqlite < database/init_spatialite-2.3.sql
python manage.py syncdb --noinput