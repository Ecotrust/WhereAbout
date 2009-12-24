createdb -U postgres -T template_postgis gwst-or-rec
python manage.py syncdb --noinput
python add_merc.py
psql -d gwst-or-rec -f database\functions\gwst_clip_shape_to_study_area.sql -U postgres
psql -d gwst-or-rec -f database\functions\gwst_clip_shape_to_shoreline.sql -U postgres
psql -d gwst-or-rec -f database\functions\gwst_largest_poly_in_multipoly.sql -U postgres
psql -d gwst-or-rec -f database\functions\gwst_validate_shape.sql -U postgres
psql -d gwst-or-rec -f database\data\CaliOregonBoundaries.sql -U postgres