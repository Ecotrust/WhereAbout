#!/bin/bash
DB="mlpa-nc-rec-survey"

createdb -T gis_template $DB
python manage.py syncdb --noinput
./runpy add_merc.py
psql -d $DB -f database/functions/gwst_clip_shape_to_study_area.sql
psql -d $DB -f database/functions/gwst_clip_shape_to_shoreline.sql
psql -d $DB -f database/functions/gwst_largest_poly_in_multipoly.sql
psql -d $DB -f database/functions/gwst_validate_shape.sql
psql -d $DB -f database/data/CaliOregonBoundaries.sql