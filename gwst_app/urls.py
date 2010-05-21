from django.conf.urls.defaults import *
from django.contrib.auth.views import *

from registration.views import register
from registration_custom.forms import RegistrationFormFull

from views import *

urlpatterns = patterns('',                      
    (r'^accounts/login/$', login, {'template_name': 'login.html'}),
    (r'^accounts/login_as/$', login_as ),
    (r'^accounts/logout/$', 'django.contrib.auth.views.logout_then_login', {'login_url': '/accounts/login/'}),

    #Custom registration with extra profile fields
    url(r'^accounts/register/$',
        register,
        {'form_class': RegistrationFormFull},                           
        name='registration_register'),
    
    (r'^accounts/', include('registration.backends.default.urls')),
    
    (r'^draw_help/text/$', draw_help_text ),

    (r'^$', select_interview ),
    (r'^select_interview/$', select_interview ),
    (r'^assign_groups/$', assign_groups ),
    (r'^interview_complete/$', interview_complete ),
    
    (r'^group_status', group_status ),
    (r'^group_qs/([A-Za-z0-9_-]+)/answer/$', answer_questions ),
    (r'^group_qs/([A-Za-z0-9_-]+)/view/$', view_answers ),
    (r'^answer_resource_questions/([A-Za-z0-9_-]+)/$', answer_resource_questions ),
    (r'^review_resource_questions/([A-Za-z0-9_-]+)/$', answer_resource_questions, {'next_url': '/group_status#main_menu'} ),

    (r'^select_group_resources/([A-Za-z0-9_-]+)/$', select_group_resources ),
	(r'^draw_group_resources/([A-Za-z0-9_-]+)/$', draw_group_resources ),
	
    (r'^draw_overview/([A-Za-z0-9_-]+)/$', draw_overview ),
    (r'^penny_overview/([A-Za-z0-9_-]+)/$', penny_overview ),
        
    (r'^finalize_group/([A-Za-z0-9_-]+)/$', finalize_group ),
    (r'^skip_res_finalize_group/([A-Za-z0-9_-]+)/$', skip_res_finalize_group ),
    (r'^unfinalize_group/([A-Za-z0-9_-]+)/$', unfinalize_group ),
    (r'^skip_group/([A-Za-z0-9_-]+)/$', skip_group ),
    (r'^finalize_interview/([A-Za-z0-9_-]+)/$', finalize_interview ),
    (r'^reset_interview/([A-Za-z0-9_-]+)/$', reset_interview ),
    
    (r'^draw_settings/([A-Za-z0-9_-]+)/json/$', draw_settings),
    (r'^shapes/([A-Za-z0-9_-]*)$', shapes),
    (r'^shape/validate/$', validate_shape),
    url(r'^video/(\w+)$', video, name="video"),

    #(r'^admin/surveymonkey/', include('gwst_surveymonkey.urls')),   
    (r'^faq', faq),
	
	(r'^samples/(\S+)/$', sample),
    (r'^tiles/(\S+)$', tiles ),
)
