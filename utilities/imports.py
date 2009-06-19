'''
Basic per project and global geodjango imports to try to speed the
debugging of django projects when jumping into the interpreter.
'''


import atexit
import os
import readline
import rlcompleter

historyPath = os.path.expanduser("~/.pyhistory")

readline.parse_and_bind("tab: complete")

def save_history(historyPath=historyPath):
    import readline
    readline.write_history_file(historyPath)

if os.path.exists(historyPath):
    readline.read_history_file(historyPath)

atexit.register(save_history)
del os, atexit, readline, rlcompleter, save_history, historyPath

imports = (
('from django.conf import settings'),
# basic models
('from django.contrib.gis.db.models import *'),
('from django.contrib.auth.models import User, Group'),
#primary gis methods from gdal
('from django.contrib.gis import gdal'),
#primary gis methods from geos
('from django.contrib.gis import geos'),
# per project app models
('from dive.models import Observer, Mpa, Survey, Site, Record, Species'),
)

def color_print(color,text):
    print "\033[9%sm%s\033[0m" % (color,text)

print
print 'loading default imports from utils/imports.py...'

for item in imports:
 color_print (4,'loading ...%s' % item)
 exec item


def as_sql(queryset):
    q = queryset._clone()
    raw = q.query.as_sql()
    cleaned = raw[0] % tuple(["'%s'" % i for i in raw[1]])
    cleaned = cleaned.replace('"', '')
    return cleaned
    
mpa = Mpa.objects.filter(pk=3)

r = range(10,30)
