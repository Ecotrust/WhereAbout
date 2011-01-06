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

SERVER_EMAIL='fish@ecotrust.org'

SEND_BROKEN_LINK_EMAILS = False

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = 'set-in-local_settings'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/site-media/'

# Absolute path to the directory that holds media from multiple applications.
STATICFILES_ROOT = 'set-in-local_settings'

STATICFILES_URL = 'set-in-local-settings'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/admin-media/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'set-in-local_settings'

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

TILE_BASE = 'set-in-local_settings' #os.path.abspath(os.path.dirname(sys.argv[0])) + '/tiles/'

TEMPLATE_DIRS = ( # use os.path.abspath(os.path.dirname(sys.argv[0])) to get a directory root that will be correct for py2exe'd version
    os.path.abspath(os.path.dirname(sys.argv[0])) +'/gwst_app/templates/',
    os.path.abspath(os.path.dirname(sys.argv[0])) +'/registration_custom/templates/',
    os.path.abspath(os.path.dirname(sys.argv[0])) +'/site-media/third-party/django_extjs/templates/',
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
    'django.contrib.staticfiles',
    'registration_custom',
    'gwst_app',
    #'gwst_surveymonkey',
    'compress',
    'django_extensions',
    'django_extjs',
    'admin_utils'
)

SELF_REGISTRATION=False
SELF_SURVEY_RESET=False

DEFAULT_FROM_EMAIL='fish@ecotrust.org'
BCC_EMAIL='fish@ecotrust.org' # Addresses to blind carbon copy on each automated registration (SurveyMonkey)
EMAIL_HOST='mail.ecotrust.org'
EMAIL_PORT=610
EMAIL_HOST_USER='fish@ecotrust.org'
EMAIL_HOST_PASSWORD='set-in-local_settings'
EMAIL_USE_TLS = True
SELF_REGISTRATION = False

CLIENT_SRID = 900913    #Google projection
SERVER_SRID = 3310   #Google projection

COMPRESS_CSS = {}

COMPRESS_JS = {
    'gwst_compressed': {
        'source_filenames':('third-party/GeoExt-0.6/widgets/MapPanel.js',	
            'third-party/GeoExt-0.6/data/LayerRecord.js',
            'third-party/GeoExt-0.6/data/LayerReader.js',
            'third-party/GeoExt-0.6/data/LayerStore.js',
            'third-party/GeoExt-0.6/data/ProtocolProxy.js',	
            'third-party/GeoExt-0.6/data/FeatureRecord.js',
            'third-party/GeoExt-0.6/data/FeatureReader.js',
            'third-party/GeoExt-0.6/data/FeatureStore.js',		
            'third-party/GeoExt-0.6/widgets/grid/FeatureSelectionModel.js',
            'third-party/ext-ux/multiselect/MultiSelect.js',
            'third-party/ext-ux/multiselect/DDView.js',
            'third-party/ext-ux/grid/RowActions.js',
            '../install-media/js/ext.ux.djangoforms.js',
            'js/settings.js', 
            'js/util.js', 
            'js/ResDrawApp.js', 
            'js/ResDrawManager.js',
            'js/data/ResFeatureStore.js', 
            'js/widgets/MainViewport.js', 
            'js/widgets/ResDrawMapPanel.js', 
            'js/widgets/WestPanel.js', 
            'js/widgets/WaitWindow.js', 
            'js/widgets/AllocPanel.js', 
            'js/widgets/PennyPanel.js', 
            'js/widgets/QuitWindow.js', 
            'js/widgets/BackContButtons.js', 
            'js/widgets/CustomButtons.js', 
            'js/widgets/Draw2Panel.js', 
            'js/widgets/DrawInstructionPanel.js', 
            'js/widgets/DrawOrDropPanel.js', 
            'js/widgets/SatisfiedShapePanel.js', 
            'js/widgets/DrawPanel.js', 
            'js/widgets/SelResPanel.js', 
            'js/widgets/DrawToolWindow.js', 
            'js/widgets/EditShapePanel.js', 
            'js/widgets/ShapeAttribPanel.js', 
            'js/widgets/ErrorWindow.js', 
            'js/widgets/SpeciesSelect.js', 
            'js/widgets/FinishedResourceSelectedWindow.js', 
            'js/widgets/SplashPanel.js', 
            'js/widgets/FinishPanel.js', 
            'js/widgets/SplashWindow.js', 
            'js/widgets/InvalidShapePanel.js', 
            'js/widgets/UnfinishedCheckWindow.js', 
            'js/widgets/UnfinishedResourceStartPanel.js', 
            'js/widgets/GroupQuestionsPanel.js', 
            'js/widgets/NavigatePanel.js', 
            'js/widgets/PennyWindow.js', 
            'js/widgets/YesNoButtons.js', 
            'js/widgets/QuitCheckWindow.js'), 
        'output_filename': 'compressed/gwst_compressed.js'
    }
}

try:
    from local_settings import *
except ImportError, exp:
    pass
    
#TW - django-extensions UUID overrides.  Force use of UUID.
import overrides