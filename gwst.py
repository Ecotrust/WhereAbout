import os, sys

os.environ['DJANGO_SETTINGS_MODULE'] = "settings"

import overrides

import admin_utils
import admin_utils.urls
import admin_utils.forms
import admin_utils.models
import admin_utils.views

import gwst_app
import gwst_app.admin
import gwst_app.fields
import gwst_app.forms
import gwst_app.managers
import gwst_app.models
import gwst_app.shortcuts
import gwst_app.urls
import gwst_app.views
import registration_custom
import map_layers

import django.template.loaders.filesystem
import django.template.loaders.app_directories
import django.middleware.common
import django.contrib.sessions.middleware
import django.contrib.auth.middleware
import django.middleware.doc
import django.contrib.auth
import django.contrib.contenttypes
import django.contrib.sessions
import django.contrib.sessions.backends.db
import django.contrib.gis.geometry.backend.geos
import django.contrib.gis.db.backends.spatialite.base
import django.contrib.sites
import django.contrib.admin
import django.contrib.gis
import django.contrib.gis.admin
import django.contrib.gis.admin.options
import django.contrib.gis.admin.widgets
import django.contrib.humanize
import django.core.cache.backends
import django.db.backends.sqlite3.base
import django.db.backends.sqlite3.introspection
import django.db.backends.sqlite3.creation
import django.db.backends.sqlite3.client
import django.template.defaulttags
import django.template.defaultfilters
import django.template.loader_tags

from django.conf.urls.defaults import *
import django.contrib.admin.views.main
import django.core.context_processors
import django.contrib.auth.views
import django.contrib.auth.backends
import django.views.static
import django.contrib.admin.templatetags.adminmedia
import django.contrib.admin.templatetags.admin_list
import django.contrib.admin.templatetags.admin_modify
import django.contrib.admin.templatetags.log
import django.contrib.admin.views.template
import django.contrib.admin.sites
import django.conf.urls.shortcut
import django.views.defaults

import email.mime.audio
import email.mime.base
import email.mime.image
import email.mime.message
import email.mime.multipart
import email.mime.nonmultipart
import email.mime.text
import email.charset
import email.encoders
import email.errors
import email.feedparser
import email.generator
import email.header
import email.iterators
import email.message
import email.parser
import email.utils
import email.base64mime
import email.quoprimime

import django.core.cache.backends.locmem
import django.templatetags
import django.templatetags.i18n

import copy
import urls
import manage
import settings
import compress
import simplejson
import registration

#let us hook up cherrypy
from cherrypy import wsgiserver
import cherrypy
import webbrowser
from django.core.handlers.wsgi import WSGIHandler
from django.core.servers.basehttp import AdminMediaHandler


if __name__ == "__main__":
    print '*****************************************************'
    print 'Service running, to stop, close this window'
    print 'Admin username/password: admin/admin'
    print '*****************************************************'
    os.environ["DJANGO_SETTINGS_MODULE"] = "settings"
    # Set up site-wide config first so we get a log if errors occur.

    cherrypy.config.update({'environment': 'production',
                            'log.screen': True})

    try:
        sys.path.insert(0,"..")
        #2nd param to AdminMediaHandler should be absolute path to the admin media files
        cherrypy.tree.graft(AdminMediaHandler(WSGIHandler(),media_dir=os.path.dirname(os.path.abspath(sys.argv[0])) + settings.ADMIN_MEDIA_PREFIX), '/')
        cherrypy.server.socket_port = 8001
        cherrypy.server.threading = 0
        cherrypy.engine.start_with_callback( webbrowser.open, ( 'http://127.0.0.1:8001/', ), )
        cherrypy.engine.block()

    except KeyboardInterrupt:
        SystemExit(0)