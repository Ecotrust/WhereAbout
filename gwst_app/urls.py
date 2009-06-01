from django.conf.urls.defaults import *
from views import *


urlpatterns = patterns('',
    (r'^$', select_interview ),
    (r'^assign_groups/$', assign_groups ),
    (r'^interview_complete/$', interview_complete ),
    
    (r'^group_status/$', group_status ),
    (r'^group_qs/(\d+)/answer/$', answer_questions ),
    (r'^draw_group_shapes/$', draw_group_shapes ),
    
    (r'^finalize_group/(\d+)/$', finalize_group ),
    (r'^finalize_interview/(\d+)/$', finalize_interview ),
    
    (r'^validate_shape/$', validate_shape ),
    (r'^save_shape/$', save_shape ),
    (r'^user/$', GetUser ),
    (r'^shapes/$', get_user_shapes ),
    (r'^geojson/shape/(\d+)/$', get_shape ),
)
