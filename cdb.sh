#!/bin/bash
DB="mlpa-nc-rec-fish-survey"

createdb -U postgres -T gis_template $DB
python manage.py syncdb --noinput
./runpy add_merc.py
psql -d $DB -f database/functions/gwst_clip_shape_to_study_area.sql -U postgres
psql -d $DB -f database/functions/gwst_clip_shape_to_shoreline.sql -U postgres
psql -d $DB -f database/functions/gwst_largest_poly_in_multipoly.sql -U postgres
psql -d $DB -f database/functions/gwst_validate_shape.sql -U postgres
psql -d $DB -f database/data/California.sql -U postgres