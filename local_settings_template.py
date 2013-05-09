# local settings.  Override default settings.py

import os, sys

DEBUG = True

TEMPLATE_DEBUG = DEBUG

DESKTOP_BUILD = False 

FULL_ADMIN = True

INTERVIEW = ''

PASSWORD = ''   #The password used for all users on desktop surveys (in admin lite)

LOGIN_REDIRECT_URL = '/management/'

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.', # Add 'postgis', 'spatialite', 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': '',                        # DB name -- or path to database file if using sqlite3.
        # 'USER': '',                      # Not used with sqlite3.
        # 'PASSWORD': '',                  # Not used with sqlite3.
        # 'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        # 'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

CLIP_FEATURES = True    #Enable clipping on the map-drawing portion

if DESKTOP_BUILD and not FULL_ADMIN:
    MEDIA_ROOT = os.path.abspath(os.path.dirname(sys.argv[0])) + '/site-media' # like: /site-media - where the Django development server goes to look for your static files
    MEDIA_URL = '/media/'
    ADMIN_MEDIA_PREFIX = '/admin-media/'
else:
    MEDIA_ROOT = os.path.abspath(os.path.dirname(sys.argv[0])) + '/media' # like: /site-media - where the Django development server goes to look for your static files
    MEDIA_URL = '/site-media/'
    ADMIN_MEDIA_PREFIX = '/install-media/admin/'

STATIC_URL = '' # like: /install-media - where the Django development server goes to look for your static files from multiple applications

ADMIN_MEDIA_ROOT = os.path.abspath(os.path.dirname(sys.argv[0])) + ADMIN_MEDIA_PREFIX 
# STATICFILES_ROOT = os.path.abspath(os.path.dirname(sys.argv[0])) + STATIC_URL
STATIC_ROOT = os.path.abspath(os.path.dirname(sys.argv[0])) + STATIC_URL

SECRET_KEY = ''

GMAPS_API_KEY = ''

EMAIL_HOST_PASSWORD=''

TILE_BASE = os.path.abspath(os.path.dirname(sys.argv[0])) + '' # like: /tiles/

SHP_UPLOAD_DIR = '' # like: MEDIA_ROOT + '/shapes/'

STATICFILES_DIRS = (
    os.path.abspath('') # like: c:\\Python27\Lib\site-packages\django_extjs\static
)
