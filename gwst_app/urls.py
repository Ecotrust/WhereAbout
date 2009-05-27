from django.conf.urls.defaults import *
from views import *


urlpatterns = patterns('',
    (r'^$', select_interview ),
    (r'^assign_groups/$', assign_groups ),
    (r'^group_status/$', group_status ),
    (r'^group_qs/(\d+)/answer/$', answer_group_questions ),
    (r'^draw_group_shapes/$', draw_group_shapes ),
    (r'^finalize_group/(\d+)/$', finalize_group ),
    (r'^show_main_questions/(\d+)/$', answer_main_questions ),
)
