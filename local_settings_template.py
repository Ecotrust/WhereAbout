# local settings.  Override default settings.py

# import os, sys

DEBUG = True

TEMPLATE_DEBUG = DEBUG

DESKTOP_BUILD = False 

FULL_ADMIN = True

DATABASE_NAME = '' 

DATABASE_ENGINE = '' # 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.

DATABASE_USER = '' #no need if using spatialite

DATABASE_PASSWORD = "" #no need if using spatialite
    
DATABASE_HOST = '' #no need if using spatialite
    
DATABASE_PORT = '' #no need if using spatialite

MEDIA_ROOT = '' # like: /site-media - where the Django development server goes to look for your static files

SECRET_KEY = ''

GMAPS_API_KEY = ''

EMAIL_HOST_PASSWORD=''

TILE_BASE = ''
