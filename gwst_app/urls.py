from django.conf.urls.defaults import *
from django.contrib.auth.views import *

from registration.views import register
from registration_custom.forms import RegistrationFormFull

from views import *

urlpatterns = patterns('',                      
    (r'^accounts/login/$', login, {'template_name': 'login.html'}),
    (r'^accounts/logout/$', 'django.contrib.auth.views.logout_then_login', {'login_url': '/accounts/login/'}),

    #Custom registration with extra profile fields
    url(r'^accounts/register/$',
        register,
        {'form_class': RegistrationFormFull},                           
        name='registration_register'),
    
    (r'^accounts/', include('registration.urls')),
    
    (r'^draw_help/text/$', draw_help_text ),

    (r'^$', select_interview ),
    (r'^select_interview/$', select_interview ),
    (r'^assign_groups/$', assign_groups ),
    (r'^interview_complete/$', interview_complete ),
    
    (r'^group_status/$', group_status ),
    (r'^group_qs/(\d+)/answer/$', answer_questions ),
    (r'^group_qs/(\d+)/view/$', view_answers ),
    (r'^answer_resource_questions/(\d+)/$', answer_resource_questions ),
    (r'^review_resource_questions/(\d+)/$', answer_resource_questions, {'next_url': '/group_status/'} ),

    (r'^select_group_resources/(\d+)/$', select_group_resources ),
	(r'^draw_group_resources/(\d+)/$', draw_group_resources ),
	
    (r'^draw_overview/(\d+)/$', draw_overview ),
    (r'^penny_overview/(\d+)/$', penny_overview ),
        
    (r'^finalize_group/(\d+)/$', finalize_group ),
    (r'^unfinalize_group/(\d+)/$', unfinalize_group ),
    (r'^skip_group/(\d+)/$', skip_group ),
    (r'^finalize_interview/(\d+)/$', finalize_interview ),
    (r'^reset_interview/(\d+)/$', reset_interview ),
    
    (r'^draw_settings/(\d+)/json/$', draw_settings),
    (r'^shapes/$', shapes),
    (r'^shape/$', shape),    
    (r'^shape/validate/$', validate_shape),
    (r'^video/(\w+)$', video),

    (r'^admin/surveymonkey/', include('gwst_surveymonkey.urls')),   
    (r'^faq', faq),
	
	(r'^samples/(\S+)/$', sample)
)
