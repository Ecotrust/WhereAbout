from django.contrib.gis import admin
from django.contrib.gis.admin.options import OSMGeoAdmin
from gwst_app.models import *
from django.contrib import databrowse
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin

databrowse.site.register(Interview)
databrowse.site.register(Region)
databrowse.site.register(Resource)
databrowse.site.register(InterviewQuestion)
databrowse.site.register(InterviewGroup)
databrowse.site.register(InterviewGroupMembership)
databrowse.site.register(InterviewAnswerOption)
databrowse.site.register(InterviewAnswer)
databrowse.site.register(InterviewStatus)
databrowse.site.register(InterviewShape)
databrowse.site.register(InterviewInstructions)
databrowse.site.register(FaqGroup)
databrowse.site.register(Faq)

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
    list_display = ('__unicode__', 'name')
    list_filter = ('interview',)
    inlines = [
        InterviewQuestionInline,
    ]

class InterviewQuestionAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'answer_type', 'question_set', 'display_order')
    ordering = ('int_group','question_set','display_order')

class FaqAdmin(admin.ModelAdmin):
    search_fields = ('question', 'answer')
    list_display = ('question','importance','faq_group')   

class FaqGroupAdmin(admin.ModelAdmin):
    pass

class IntAdmin(admin.ModelAdmin):
    pass

admin.site.register(Interview,InterviewAdmin)
admin.site.register(Region,IntAdmin)
admin.site.register(Resource,IntAdmin)
admin.site.register(InterviewQuestion,InterviewQuestionAdmin)
admin.site.register(InterviewGroup,InterviewGroupAdmin)
admin.site.register(InterviewGroupMembership,IntAdmin)
admin.site.register(InterviewAnswerOption,IntAdmin)
admin.site.register(InterviewAnswer,IntAdmin)
admin.site.register(InterviewStatus,IntAdmin)
admin.site.register(InterviewShape,IntAdmin)
admin.site.register(InterviewInstructions,IntAdmin)
admin.site.register(FaqGroup,FaqGroupAdmin)
admin.site.register(Faq,FaqAdmin)


