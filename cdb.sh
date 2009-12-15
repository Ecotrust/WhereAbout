#!/bin/bash
DB="spatial-survey-demo"

export PYTHONPATH=$PYTHONPATH:/usr/local/django-trunk/:/usr/local/django-apps/:.

createdb -T gis_template $DB
python manage.py syncdb --noinput
psql -d $DB -f database/functions/gwst_clip_shape_to_study_area.sql
psql -d $DB -f database/functions/gwst_clip_shape_to_shoreline.sql
psql -d $DB -f database/functions/gwst_largest_poly_in_multipoly.sql
psql -d $DB -f database/functions/gwst_validate_shape.sql
psql -d $DB -f database/data/CaliOregonBoundaries.sql