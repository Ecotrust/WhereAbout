import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

import settings

os.system('cat utilities/insert_google_ref_sys.sql | psql -U postgres -d '+settings.DATABASE_NAME)