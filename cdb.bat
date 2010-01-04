createdb -U postgres -T template_postgis gwst-or-rec
psql -d gwst-or-rec -f database\data\CaliOregonBoundaries.sql -U postgres
python manage.py syncdb --noinput
python add_merc.py