# Django settings for gwst project.

#DATABASE_ENGINE = 'django.contrib.gis.db.backends.postgis'           # 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
#DATABASE_NAME = 'gwst'             # Or path to database file if using sqlite3.
#DATABASE_USER = 'gwst'             # Not used with sqlite3.
#DATABASE_PASSWORD = ''         # Not used with sqlite3.
#DATABASE_HOST = ''             # Set to empty string for localhost. Not used with sqlite3.
#DATABASE_PORT = ''             # Set to empty string for default. Not used with sqlite3.

SPATIALITE_LIBRARY_PATH = 'libspatialite-1.dll'
DESKTOP_BUILD = True
FULL_ADMIN = False

AUTH_PROFILE_MODULE = 'gwst_app.userprofile'


# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Los_Angeles'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 'a1'

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = 'set-in-local_settings'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/site-media/'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/media/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'ox6_$0433w05!fzz_$ts5(xs1v3_q$!p@uw#wrzt=!6#kem2#9'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.load_template_source',
    'django.template.loaders.app_directories.load_template_source',
#     'django.template.loaders.eggs.load_template_source',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
)

ROOT_URLCONF = 'urls'

import os, sys

TILE_BASE = os.path.abspath(os.path.dirname(sys.argv[0])) + '/tiles/'

TEMPLATE_DIRS = ( # use os.path.abspath(os.path.dirname(sys.argv[0])) to get a directory root that will be correct for py2exe'd version
    os.path.abspath(os.path.dirname(sys.argv[0])) +'/gwst_app/templates/',
    os.path.abspath(os.path.dirname(sys.argv[0])) +'/registration_custom/templates/',
    os.path.abspath(os.path.dirname(sys.argv[0])) +'/admin_utils/templates/',
    os.path.abspath(os.path.dirname(sys.argv[0])) +'/templates/', # for admin, in desktop configuration
    #os.path.abspath(os.path.dirname(sys.argv[0])) +'/gwst_surveymonkey/templates/',
    #'/usr/local/django-trunk/django/contrib/gis/templates/'
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.databrowse',
    'django.contrib.humanize',
    'django.contrib.gis',
    'registration_custom',
    'gwst_app',
    #'gwst_surveymonkey',
    'compress',
    'django_extensions',
    'admin_utils'
)

SELF_REGISTRATION=False
SELF_SURVEY_RESET=False

CLIENT_SRID = 900913    #Google projection
SERVER_SRID = 3310   #Google projection

try:
    from local_settings import *
except ImportError, exp:
    pass