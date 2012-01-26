set DJANGO_SETTINGS_MODULE=settings
REM set GDAL_DATA=%gdal_data%
REM geodjango_setup.bat
REM spatialite.exe database/cc_db.sqlite < database/data/ORClipRegion.sqlite
set OSGEO4W_ROOT=C:\OSGeo4W
set PYTHON_ROOT=C:\Python27
set GDAL_DATA=%OSGEO4W_ROOT%\share\gdal
set PROJ_LIB=%OSGEO4W_ROOT%\share\proj
set PATH=%PATH%;%PYTHON_ROOT%;%OSGEO4W_ROOT%\bin
spatialite.exe database/nebs_db.sqlite < database/init_spatialite-2.3.sql
python manage.py syncdb --noinput