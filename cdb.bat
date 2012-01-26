set DJANGO_SETTINGS_MODULE=settings
set OSGEO4W_ROOT=C:\OSGeo4W
set PYTHON_ROOT=C:\Python27
set GDAL_DATA=%OSGEO4W_ROOT%\share\gdal
set PROJ_LIB=%OSGEO4W_ROOT%\share\proj
set PATH=%PATH%;%PYTHON_ROOT%;%OSGEO4W_ROOT%\bin
createdb -U postgres -T template_postgis new-england-boater-survey
python add_merc.py
python manage.py syncdb --noinput
python manage.py loaddata test_users.json