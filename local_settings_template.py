# local settings.  Override default settings.py

DATABASE_NAME = ''
DATABASE_USER = ''
DATABASE_PASSWORD = '' # like: '1234'
MEDIA_ROOT = '' # like: 'U:/dev/gwst/media' - where the Django development server goes to look for your static files
MEDIA_URL = '' # the URL dir through which your web server serves static pages and images

GMAPS_API_KEY = '' # like: a big long string of characters you get from Google

TEMP_DIR = '' # Like /tmp

ACCOUNT_ACTIVATION_DAYS = 7

DEFAULT_FROM_EMAIL=''
BCC_EMAIL='' # Addresses to blind carbon copy on each automated registration (SurveyMonkey)
EMAIL_HOST=''
EMAIL_PORT=610
EMAIL_HOST_USER=''
EMAIL_HOST_PASSWORD=''
EMAIL_USE_TLS = True
