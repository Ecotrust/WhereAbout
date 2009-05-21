from django.conf.urls.defaults import *
from views import *


urlpatterns = patterns('',
    (r'^$', select_interview ),
    (r'^assign_groups/$', assign_groups ),
)
