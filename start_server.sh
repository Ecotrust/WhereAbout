#!/bin/bash
#Use to run a python console. Sets up django environment
export PYTHONPATH=$PYTHONPATH:/usr/local/django-trunk/:/usr/local/django-apps/
export DJANGO_SETTINGS_MODULE=settings
export GDAL_DATA=/usr/share/gdal15
#export PYTHONSTARTUP=utilities/shell_config.py
python manage.py runserver 0.0.0.0:$1