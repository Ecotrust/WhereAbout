#!/bin/bash
#Use to run a python console. Sets up django environment
export PYTHONPATH=$PYTHONPATH:/usr/local/django-trunk/:/usr/local/django-apps/
export DJANGO_SETTINGS_MODULE=settings

#Find proper GDAL_DATA setting with command `gdal-config --datadir`                                            
#export GDAL_DATA=/usr/share/gdal15                                                                            
#Mac OSX                                                                                                       
export GDAL_DATA=/Library/Frameworks/GDAL.framework/Versions/1.6/Resources/gdal

#export PYTHONSTARTUP=utilities/shell_config.py
python manage.py runserver 0.0.0.0:$1