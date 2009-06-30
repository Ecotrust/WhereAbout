from django.conf.urls.defaults import *
from django.contrib.auth.views import *
from views import *

urlpatterns = patterns('',
    (r'^accounts/login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
    (r'^accounts/logout/$', 'django.contrib.auth.views.logout_then_login', {'login_url': '/accounts/login/'}),


    (r'^$', select_interview ),
    (r'^select_interview/$', select_interview ),
    (r'^assign_groups/$', assign_groups ),
    (r'^interview_complete/$', interview_complete ),
    
    (r'^group_status/$', group_status ),
    (r'^group_qs/(\d+)/answer/$', answer_questions ),
    (r'^group_qs/(\d+)/view/$', view_answers ),
    (r'^draw_group_shapes/(\d+)/$', draw_group_shapes ),
    
    (r'^finalize_group/(\d+)/$', finalize_group ),
    (r'^finalize_interview/(\d+)/$', finalize_interview ),
    
    (r'^validate_shape/$', validate_shape ),
    (r'^save_shape/$', save_shape ),
    (r'^user/$', GetUser ),
    (r'^shapes/$', get_user_shapes ),
    (r'^geojson/shape/(\d+)$', get_shape ),
    (r'^gwst/shape/delete/(\d+)$', delete_shape ),
    (r'^gwst/shapes/copy/$', copy_shapes ),
    (r'^gwst/shape/editgeom/(\d+)$', editgeom_shape ),
    #(r'^gwst/shape/copy/(\d+)$', copy_shape ),
    (r'^gwst/shape/edit/(\d+)$', edit_shape ),

    (r'^admin/surveymonkey/', include('gwst_surveymonkey.urls')),    
)
