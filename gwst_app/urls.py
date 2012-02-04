from django.conf.urls.defaults import *
from django.contrib.auth.views import *

from views import *
from django_extjs.example_views import *
from django.views.generic.simple import direct_to_template
from django.views.decorators.cache import cache_page

urlpatterns = patterns('',                      
    (r'^accounts/login/$', login, {'template_name': 'login.html'}),
    (r'^accounts/login_as/$', login_as ),
    (r'^accounts/logout/$', 'django.contrib.auth.views.logout_then_login', {'login_url': '/accounts/login/'}),

    (r'^draw_help/text/$', draw_help_text ),

    (r'^$', select_interview ),
    (r'^select_interview/$', select_interview ),
    (r'^assign_groups/$', assign_groups ),
    (r'^interview_complete/$', interview_complete ),
    
    (r'^group_status', group_status ),
    (r'^group_qs/([A-Za-z0-9_-]+)/answer/$', answer_questions ),
    (r'^group_qs/([A-Za-z0-9_-]+)/view/$', view_answers ),
    (r'^answer_resource_questions/([A-Za-z0-9_-]+)/$', answer_resource_questions ),
    (r'^answer_resource_questions/([A-Za-z0-9_-]+)/([A-Za-z0-9_-]+)/([A-Za-z0-9_-]+)/$', answer_resource_questions ),
    (r'^review_resource_questions/([A-Za-z0-9_-]+)/$', answer_resource_questions, {'next_url': '/group_status#main_menu'} ),

    (r'^select_group_resources/([A-Za-z0-9_-]+)/$', select_group_resources ),
	(r'^draw_group_resources/([A-Za-z0-9_-]+)/$', draw_group_resources ),
	(r'^answers/$', answers ),
	
    (r'^draw_overview/([A-Za-z0-9_-]+)/$', draw_overview ),
    (r'^penny_overview/([A-Za-z0-9_-]+)/$', penny_overview ),
        
    (r'^finalize_group/([A-Za-z0-9_-]+)/$', finalize_group ),
    (r'^skip_res_finalize_group/([A-Za-z0-9_-]+)/$', skip_res_finalize_group ),
    (r'^unfinalize_group/([A-Za-z0-9_-]+)/$', unfinalize_group ),
    (r'^unskip_group/([A-Za-z0-9_-]+)/$', unskip_group ),
    (r'^skip_group/([A-Za-z0-9_-]+)/$', skip_group ),
    (r'^finalize_interview/([A-Za-z0-9_-]+)/$', finalize_interview ),
    (r'^reset_interview/([A-Za-z0-9_-]+)/$', reset_interview ),
    (r'^reopen_interview/([A-Za-z0-9_-]+)/$', reopen_interview ),
    
    (r'^draw_settings/([A-Za-z0-9_-]+)/json/$', draw_settings),
    (r'^shapes/([A-Za-z0-9_-]*)$', shapes),
    (r'^shape/validate/$', validate_shape),
    url(r'^video/(\w+)$', video, name="video"),
    
    (r'^abalone_card_sites/json/$', cache_page(abalone_card_sites, 60*15)),

    (r'^faq', faq),
	
	(r'^samples/(\S+)/$', sample),
    (r'^tiles/(\S+)$', tiles ),
    
    (r'^test', direct_to_template, {'template': 'example.html'}),
    (r'^apps/django_extjs/example_email', example_email),
    (r'^json/email$', example_email),
    (r'^json/model$', example_model),
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': 'django_extjs/static'}),
    
)

if not settings.FULL_ADMIN:
    urlpatterns += patterns ( '',
        (r'^accounts/login_as/([A-Za-z0-9_-]+)$', login_as_admin ),
        (r'^admin/logout/$', logout ),
        (r'^admin/auth/user/logout/$', logout ),
        (r'^management/logout/$', logout ),
        (r'^admin/auth/user/$', survey_management ),
        (r'^admin/$', survey_management ),
        (r'^management/start_new_survey/$', start_new_survey ),
        (r'^admin-lite-login/accounts/login_as/([A-Za-z0-9_-]+)$', login_as_admin ),
        (r'^admin-lite-login/', admin_lite_login),
        (r'^management/', survey_management),
    )
    
