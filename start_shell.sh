#!/bin/bash
#Use to run a python console. Sets up django environment
export PYTHONPATH=$PYTHONPATH:/usr/local/django-trunk/:/usr/local/django-apps/
export DJANGO_SETTINGS_MODULE=settings
export GDAL_DATA=/usr/local/share
export PYTHONSTARTUP=utilities/shell_config.py
python $@