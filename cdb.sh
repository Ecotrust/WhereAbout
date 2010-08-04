#!/bin/bash

export DJANGO_SETTINGS_MODULE=settings

DB="or-charter-survey"

export PYTHONPATH=$PYTHONPATH:/usr/local/django-trunk/:/usr/local/django-apps/:.

createdb -T gis_template $DB
# psql -d $DB -f database/data/OregonRecClipRegion.sql
python manage.py syncdb --noinput