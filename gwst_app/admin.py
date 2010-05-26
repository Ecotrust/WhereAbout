from django.contrib.gis import admin
from django.contrib.gis.admin.options import GeoModelAdmin
from gwst_app.models import *
from django.contrib import databrowse
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.conf import settings

databrowse.site.register(Interview)
databrowse.site.register(Region)
databrowse.site.register(Resource)
databrowse.site.register(InterviewQuestion)
databrowse.site.register(QuestionGroupValidator)
databrowse.site.register(QuestionGroup)
databrowse.site.register(InterviewGroup)
databrowse.site.register(InterviewGroupMembership)
databrowse.site.register(InterviewAnswerOption)
databrowse.site.register(InterviewAnswer)
databrowse.site.register(InterviewStatus)
databrowse.site.register(InterviewShape)
databrowse.site.register(InterviewInstructions)
databrowse.site.register(FaqGroup)
databrowse.site.register(Faq)
databrowse.site.register(GroupMemberResource)

class InterviewQuestionInline(admin.StackedInline):
    model = InterviewQuestion
    
class InterviewGroupInline(admin.TabularInline):
    model = InterviewGroup
    
class InterviewAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'name', 'organization')
    list_filter = ('region', 'organization')
    inlines = [
        InterviewGroupInline,
    ]
    
class InterviewGroupAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'name','code','description')
    list_filter = ('interview',)
    inlines = [
        InterviewQuestionInline,
    ]

class InterviewQuestionAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'answer_type', 'question_set', 'display_order')
    ordering = ('int_group','question_set','display_order')

class InterviewAnswerAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'interview_group')
    search_fields = ('user__username','int_question__code')    

class InterviewShapeAdmin(GeoModelAdmin):
    list_display = ('user', 'int_group_name', 'resource','pennies')

class FaqAdmin(admin.ModelAdmin):
    search_fields = ('question', 'answer')
    list_display = ('question','importance','faq_group')   

class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name','code','select_description','shape_color')
    ordering = ('name','code')

class FaqGroupAdmin(admin.ModelAdmin):
    pass

class InterviewStatusAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'completed', 'complete_date', 'first_login', 'last_login', 'num_logins')

class GroupMemberResourceAdmin(admin.ModelAdmin):
    list_display = ('user', 'group_membership', 'resource')
    list_filter = ('resource',)
    search_fields = ('group_membership__user__username','resource__name',)

class IntAdmin(admin.ModelAdmin):
    pass

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_by')
    

if settings.FULL_ADMIN:
    admin.site.register(Interview,InterviewAdmin)
    admin.site.register(Region,IntAdmin)
    admin.site.register(Resource,ResourceAdmin)
    admin.site.register(InterviewQuestion,InterviewQuestionAdmin)
    admin.site.register(QuestionGroupValidator,IntAdmin)
    admin.site.register(QuestionGroup,IntAdmin)
    admin.site.register(InterviewGroup,InterviewGroupAdmin)
    admin.site.register(InterviewGroupMembership,IntAdmin)
    admin.site.register(GroupMemberResource,GroupMemberResourceAdmin)
    admin.site.register(InterviewAnswerOption,IntAdmin)
    admin.site.register(InterviewAnswer,InterviewAnswerAdmin)
    admin.site.register(InterviewStatus,InterviewStatusAdmin)
    admin.site.register(InterviewShape,InterviewShapeAdmin)
    admin.site.register(InterviewInstructions,IntAdmin)
    admin.site.register(FaqGroup,FaqGroupAdmin)
    admin.site.register(Faq,FaqAdmin)
    admin.site.register(UserProfile,UserProfileAdmin)
else:
    #from django.contrib.admin.sites import AdminSite

    #manager_admin = AdminSite()
    #manager_admin.index_template = 'admin/manage-index.html'
    #manager_admin.disable_action('delete_selected')
    #manager_admin.register(User,UserAdmin)
    admin.site.index_template = 'admin/manage-index.html'
    admin.site.disable_action('delete_selected')

    class OverrideUserAdmin(UserAdmin):
        list_display = ('username', 'first_name', 'last_name', 'is_staff', 'login_as', 'delete_survey')
        def login_as( self, obj ):
            return '<a href="/accounts/login_as/?next_user=' + obj.id + '">Start/continue survey for ' + obj.username +'</a>'
        login_as.allow_tags = True
        login_as.short_description = ''
        
        def delete_survey( self, obj ):
            return '<a href="/admin/auth/user/' + obj.id + '/delete/">Delete survey for ' + obj.username +'</a>'
        delete_survey.allow_tags = True
        delete_survey.short_description = ''

    admin.site.unregister(User)
    admin.site.register(User,OverrideUserAdmin)