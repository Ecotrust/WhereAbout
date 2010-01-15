createdb -U postgres -T template_postgis gwst-or-rec
python add_merc.py
psql -d gwst-or-rec -f database\data\OregonRecClipRegion.sql -U postgres
python manage.py syncdb --noinput