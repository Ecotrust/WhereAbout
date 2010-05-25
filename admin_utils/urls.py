from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    (r'^port_surveys', port_surveys ),
    (r'^export_surveys', export_surveys ),
    (r'^import_surveys', import_surveys ),
)