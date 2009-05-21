from django.contrib.gis import admin
from django.contrib.gis.admin.options import OSMGeoAdmin
from gwst.gwst_app.models import *
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

class IntAdmin(admin.ModelAdmin):
    pass

admin.site.register(Interview,InterviewAdmin)
admin.site.register(Region,IntAdmin)
admin.site.register(Resource,IntAdmin)
admin.site.register(InterviewQuestion,IntAdmin)
admin.site.register(InterviewGroup,InterviewGroupAdmin)
admin.site.register(InterviewGroupMembership,IntAdmin)
admin.site.register(InterviewAnswerOption,IntAdmin)
admin.site.register(InterviewAnswer,IntAdmin)
admin.site.register(InterviewStatus,IntAdmin)
admin.site.register(InterviewShape,IntAdmin)


