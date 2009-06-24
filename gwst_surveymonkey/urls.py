from django.conf.urls.defaults import *
from django.contrib.auth.views import *
from views import *

urlpatterns = patterns('',
    (r'^add/$', add),  
)
 