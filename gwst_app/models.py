# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#     * Rearrange models' order
#     * Make sure each model has one field with primary_key=True
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [appname]'
# into your database.

#from django.db import models
from django.contrib.gis.db.models import *
from django.contrib.auth.models import User
import datetime

# ultimately the Region table needs to move to MM core
class Region(Model):
    name = CharField( max_length=100, unique=True )
    bounds = PolygonField(srid=4326, null=True, blank=True)
    code = CharField( max_length=10, unique=True )
    
    class Meta:
        db_table = u'gwst_region'
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.code, self.name))

        
class Resource(Model):
    name = CharField( max_length=100, unique=True )
    code = CharField( max_length=10, unique=True )
    
    class Meta:
        db_table = u'gwst_resource'
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.code, self.name))
        
        
class Interview(Model):
    region = ForeignKey(Region)
    name = CharField( max_length=100, unique=True )
    organization = CharField( max_length=100 )
    description = CharField( max_length=200 )
    code = CharField( max_length=20, unique=True )
    class Meta:
        db_table = u'gwst_interview'
        
    def __unicode__(self):
        return unicode('%s-%s' % (self.region.code, self.code))
    
    
class InterviewGroup(Model):
    interview = ForeignKey(Interview)
    name = CharField( max_length=100 )
    description = CharField( max_length=200 )
    code = CharField( max_length=10 )
    resources = ManyToManyField(Resource)
    
    class Meta:
        db_table = u'gwst_group'
        
    def __unicode__(self):
        return unicode('%s-%s' % (self.interview, self.code))

        
class InterviewGroupMembership(Model):

    InterviewGroupStatusChoices = (
        ( 'not yet started', 'not yet started' ),
        ( 'in-progress', 'in-progress' ),
        ( 'finalized', 'finalized' ),
        ( 'review', 'review' ),
        ( 'review completed', 'review completed' )
    )

    user = ForeignKey(User)
    int_group = ForeignKey(InterviewGroup)
    status = CharField( max_length=30, choices = InterviewGroupStatusChoices, default='not yet started' )
    
    class Meta:
        db_table = u'gwst_groupmemb'
        
    def __unicode__(self):
        return unicode('%s-%s' % (self.user, self.int_group))
       
       
class InterviewAnswerOption(Model):
    eng_text = CharField( max_length=200 )
    display_order = FloatField()
    
    class Meta:
        db_table = u'gwst_answeroption'
        
    def __unicode__(self):
        return unicode('%s' % (self.eng_text[0:100]))
        
      
class InterviewQuestion(Model):
    AnswerTypeChoices = (
        ( 'integer', 'integer value' ),
        ( 'decimal', 'decimal value' ),
        ( 'boolean', 'boolean (true/false) value' ),
        ( 'select', 'select from list of values' ),
        ( 'other', 'list of values w/"other" text' ),
        ( 'text', 'enter text' ),
    )
    int_group = ForeignKey(InterviewGroup, null=True, blank=True, help_text='set to ask question only of this group')
    interview = ForeignKey(Interview, null=True, blank=True, help_text='set to ask question of all groups in this interview')
    answer_type = CharField( max_length=20, choices=AnswerTypeChoices )
    val_min = FloatField( help_text='minimum value for numeric answers', blank=True, null=True )
    val_max = FloatField( help_text='maximum value for numeric answers', blank=True, null=True )
    val_default = CharField( max_length=100, help_text='default value displayed when form appears', blank=True, null = True, default='' )
    options = ManyToManyField(InterviewAnswerOption, help_text='if a list question, multi-select valid responses', blank=True, null=True)
    eng_text = TextField( help_text='the question asked of the user' )
    eng_tooltip = CharField( max_length=200, help_text='hover help text shown to user', blank=True, null=True )
    question_set = IntegerField( help_text='for grouping questions together on a page', blank=True, null=True )
    display_order = FloatField( help_text='tab order of this question on its page' )
    
    class Meta:
        db_table = u'gwst_question'
        ordering = ('interview','int_group','question_set','display_order')
        
    def __unicode__(self):
        if self.int_group:
            return unicode('%s: %s' % (self.int_group, self.eng_text[0:100]))
        else:
            return unicode('%s: %s' % (self.interview, self.eng_text[0:100]))
        
        
# localization tables, for future use
class InterviewQuestionText(Model):
    int_question = ForeignKey(InterviewQuestion)
    language_id = IntegerField()
    text = TextField()
    tooltip = CharField( max_length=200, null=True )
    
    class Meta:
        db_table = u'gwst_questiontext'
        
    def __unicode__(self):
        return unicode('%s' % (self.text[0:100]))
        
  
# localization tables, for future use  
class InterviewAnswerOptionText(Model):
    int_answer = ForeignKey(InterviewAnswerOption)
    language_id = IntegerField()
    text = CharField( max_length=200 )
    
    class Meta:
        db_table = u'gwst_answeroptiontext'
        
    def __unicode__(self):
        return unicode('%s' % (self.text[0:100]))
        
        
class InterviewAnswer(Model):
    int_question = ForeignKey(InterviewQuestion)
    user = ForeignKey(User)
    option_val = ForeignKey(InterviewAnswerOption, null=True, blank=True)
    text_val = TextField(null=True, blank=True)
    integer_val = IntegerField(null=True, blank=True)
    decimal_val = FloatField(null=True, blank=True)
    boolean_val = NullBooleanField(null=True, blank=True)
    creation_date = DateTimeField(default=datetime.datetime.today())
    last_modified = DateTimeField(default=datetime.datetime.today())
    num_times_saved = IntegerField(default=0)
    
    class Meta:
        db_table = u'gwst_useranswer'
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.user, self.int_question))
        

class InterviewStatus(Model):
    interview = ForeignKey(Interview)
    user = ForeignKey(User)
    completed = BooleanField(default=False)
    creation_date = DateTimeField(default=datetime.datetime.today())
    first_login = DateTimeField(null=True)
    last_login = DateTimeField(null=True)
    num_logins = IntegerField(default=0)
    complete_date = DateField(null=True)
    notes = TextField(null=True)
    
    class Meta:
        db_table = u'gwst_userstatus'
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.user, self.interview))

        
class InterviewShape(Model):
    user = ForeignKey(User)
    int_group = ForeignKey(InterviewGroup)
    resource = ForeignKey(Resource)
    geometry = PolygonField(srid=4326, blank=True, null=True)
    geometry_clipped = PolygonField(srid=4326, blank=True, null=True)
    geometry_edited = PolygonField(srid=4326, blank=True, null=True)
    pennies = IntegerField( default=1 )
    boundary_n = CharField( max_length=100, blank=True, null=True ) 
    boundary_s = CharField( max_length=100, blank=True, null=True )
    boundary_e = CharField( max_length=100, blank=True, null=True )
    boundary_w = CharField( max_length=100, blank=True, null=True )
    edit_notes = TextField( blank=True, null=True )
    edit_status = CharField( max_length=100, default='unedited' )
    creation_date = DateTimeField(default=datetime.datetime.today())
    last_modified = DateTimeField(default=datetime.datetime.today())
    num_times_saved = IntegerField(default=0)
    
    class Meta:
        db_table = u'gwst_usershape'
        
    def __unicode__(self):
        return unicode('%s: %s %s' % (self.user, self.resource.code, self.int_group))

