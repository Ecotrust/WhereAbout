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
from gwst_app.utils.geojson_encode import *

# ultimately the Region table needs to move to MM core
class Region(Model):
    name = CharField( max_length=100, unique=True )
    bounds = MultiPolygonField(srid=3310, null=True, blank=True)
    code = CharField( max_length=10, unique=True )
    
    class Meta:
        db_table = u'gwst_region'
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.code, self.name))

        
class Resource(Model):
    name = CharField( max_length=100, unique=True )
    code = CharField( max_length=10, unique=True )
    shape_color = CharField( max_length=2, default = 'FF', blank=True )
    
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
    active = BooleanField( default=False )
    group_status_text = TextField( blank=True, default='' )
    draw_shape_text = TextField( blank=True, default='' )    
    class Meta:
        db_table = u'gwst_interview'
        
    def __unicode__(self):
        return unicode('%s-%s' % (self.region.code, self.code))
    
    
class InterviewGroup(Model):
    interview = ForeignKey(Interview)
    name = CharField( max_length=100 )
    description = CharField( max_length=200 )
    code = CharField( max_length=10 )
    resources = ManyToManyField(Resource,blank=True,null=True)
    required_group = BooleanField( default=False )
    user_draws_shapes = BooleanField( default=True )
    shape_color = CharField( max_length=2, blank=True, default="FF" )
    
    class Meta:
        db_table = u'gwst_group'
        unique_together = (("interview", "code"),("interview", "name"))
        
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
    user_status_msg = CharField( max_length=200, blank=True, default='no shapes drawn' )
    num_complete_resources = IntegerField( default = 0 )
    num_incomplete_resources = IntegerField( default = 0 )
    date_started = DateTimeField( blank=True, null=True )
    completed = BooleanField( default=False )
    date_completed = DateTimeField( blank=True, null=True )
    reviewed = BooleanField( default = False )
    date_reviewed = DateTimeField( blank=True, null=True )
    percent_involvement = IntegerField( blank=True, null=True )
    
    class Meta:
        db_table = u'gwst_groupmemb'
        unique_together = (("int_group", "user"),)
        
    def __unicode__(self):
        return unicode('%s-%s' % (self.user, self.int_group))
       
'''
Captures which resources a user is associated with as a member 
of a given group.  Takes advantage of the fact that resources 
are tied to interview groups and so are users.  Allows you to
narrow down which resources users care about in relation to
a given user group before asking them to draw shapes.
'''
class GroupMemberResource(Model):
    group_membership = ForeignKey(InterviewGroupMembership)    
    resource = ForeignKey(Resource)
    
    class Meta:
        db_table = u'gwst_groupmemb_res'
        
    def __unicode__(self):
        return unicode('%s - %s' % (self.group_membership, self.resource))
       
class InterviewAnswerOption(Model):
    eng_text = CharField( max_length=200 )
    display_order = FloatField()
    
    class Meta:
        db_table = u'gwst_answeroption'
        
    def __unicode__(self):
        return unicode('%s' % (self.eng_text[0:100]))
        
'''
Represents group-level validation for questions.  For example, the sum
of the answers must add up to 100.  The param fields are a simple way
of being able to support a variable number of parameters for each
validator.  This is not very robust.
'''
class QuestionGroupValidator(Model):
    ValidatorTypeChoices = (
        ( 'sum', 'Sum to target integer' ),
    )
    description = CharField( help_text='Description of the validator', max_length=100)
    type = CharField( max_length=30, choices=ValidatorTypeChoices ) 
    param_1 = CharField(help_text='', max_length=20)
    param_2 = CharField(help_text='', max_length=20, blank=True, null=True)
    param_3 = CharField(help_text='', max_length=20, blank=True, null=True)
    param_4 = CharField(help_text='', max_length=20, blank=True, null=True)        
    
    def __unicode__(self):
        return self.description
    
    class Meta:
        db_table = u'gwst_qstn_grp_validator'

'''
Represents the collection of questions into a group 
'''
class QuestionGroup(Model):
    validators = ManyToManyField(QuestionGroupValidator)
    code = CharField( max_length=10, help_text='unique name for referencing this group of questions', blank=True, null=True)
    eng_text = CharField(max_length=200)
    
    def __unicode__(self):
        return self.code
    
    class Meta:
        db_table = u'gwst_qstn_grp'  
      
class InterviewQuestion(Model):
    AnswerTypeChoices = (
        ( 'integer', 'integer value' ),
        ( 'decimal', 'decimal value' ),
        ( 'boolean', 'boolean (true/false) value' ),
        ( 'select', 'select from list of values' ),
        ( 'other', 'list of values w/"other" text' ),
        ( 'text', 'enter text' ),
        ( 'phone', 'phone number' )
    )
    int_group = ForeignKey(InterviewGroup)
    answer_type = CharField( max_length=20, choices=AnswerTypeChoices )
    code = CharField( max_length=10, help_text='unique name for referencing this question directly', blank=True, null=True)
    val_min = FloatField( help_text='minimum value for numeric answers', blank=True, null=True )
    val_max = FloatField( help_text='maximum value for numeric answers', blank=True, null=True )
    val_default = CharField( max_length=100, help_text='default value displayed when form appears', blank=True, null = True, default='' )
    options = ManyToManyField(InterviewAnswerOption, help_text='if a list question, multi-select valid responses', blank=True, null=True)
    eng_text = TextField( help_text='the question asked of the user' )
    eng_tooltip = CharField( max_length=200, help_text='hover help text shown to user', blank=True, null=True )
    question_set = IntegerField( help_text='for grouping questions together on a page', blank=True, null=True )
    question_group = ForeignKey(QuestionGroup, help_text='assign question to a group', blank=True, null=True )
    display_order = FloatField( help_text='tab order of this question on its page' )
    required = BooleanField( help_text='require that this field be filled out', default=False)
        
    class Meta:
        db_table = u'gwst_question'
        ordering = ('int_group__interview','int_group','question_set','display_order')
        
    def __unicode__(self):
        return unicode('%s-%s' % (self.int_group, self.code))
    
class InterviewInstructions(Model):
    int_group = ForeignKey(InterviewGroup)
    question_set = IntegerField( help_text='for instructions for a particular question set', blank=True, null=True )
    eng_text = CharField( max_length=200 )
    
    class Meta:
        db_table = u'gwst_instructions'
        unique_together = (("int_group", "question_set"),)
        
    def __unicode__(self):
        return unicode('%s-%s' % (self.int_group, self.question_set))
    
        
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
    num_times_saved = IntegerField(default=1)
    
    class Meta:
        db_table = u'gwst_useranswer'
        unique_together = (("int_question", "user"),)
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.user, self.int_question))
        
    def save_answer(self):
        pass

class InterviewStatus(Model):
    interview = ForeignKey(Interview)
    user = ForeignKey(User)
    completed = BooleanField(default=False)
    creation_date = DateTimeField(default=datetime.datetime.today())
    first_login = DateTimeField(null=True)
    last_login = DateTimeField(null=True)
    num_logins = IntegerField(default=0)
    complete_date = DateTimeField(null=True)
    notes = TextField(null=True)
    
    class Meta:
        db_table = u'gwst_userstatus'
        unique_together = (("interview", "user"),)
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.user, self.interview))

        
class InterviewShape(Model):
    user = ForeignKey(User)
    int_group = ForeignKey(InterviewGroup)
    resource = ForeignKey(Resource)
    geometry = PolygonField(srid=3310, blank=True, null=True)
    geometry_clipped = PolygonField(srid=3310, blank=True, null=True)
    geometry_edited = PolygonField(srid=3310, blank=True, null=True)
    pennies = IntegerField( default=0 )
    boundary_n = CharField( max_length=100, blank=True, null=True ) 
    boundary_s = CharField( max_length=100, blank=True, null=True )
    boundary_e = CharField( max_length=100, blank=True, null=True )
    boundary_w = CharField( max_length=100, blank=True, null=True )
    edit_notes = TextField( blank=True, null=True )
    edit_status = CharField( max_length=100, default='unedited' )
    creation_date = DateTimeField(default=datetime.datetime.today())
    last_modified = DateTimeField(default=datetime.datetime.today())
    num_times_saved = IntegerField(default=1)
    
    class Meta:
        db_table = u'gwst_usershape'
        
    def __unicode__(self):
        return unicode('%s: %s %s' % (self.user, self.resource.code, self.int_group))
        
    def validate(self):
        from django.db import connection
        cursor = connection.cursor()
        query_str = "SELECT gwst_validate_shape('%s')" % (self.geometry)
        cursor.execute(query_str)
        row = cursor.fetchone()
        return row
        
    def client_object(self):
        return {
            'pk': self.pk,
            'model': 'mpa',
            'name': '%s area (%d pennies)' % (self.resource.name, self.pennies),
            'user': self.user_id,
            'date_created': self.creation_date.ctime(),
            'date_modified': self.last_modified.ctime(),
            'display_properties': {
                'toggle': True,
                'context': True,
                'select': True,
                'doubleclick': True,
                'collapsible': False,
            }
        }
        
    def json(self):
        return self.geojson(attributes=True)
        
    def geojson(self, srid=900913, attributes=False):
        
        try:
            geo = self.geometry_clipped.simplify(20, preserve_topology=True)
            geo.transform(srid) 
        except Exception, E:
            raise Exception('%s: geometry was: "%s" ' % (E, self.geometry_clipped.wkt)) 
        
        attr = {}
        
        # regen this shape's folder name to update the UI with current penny count
        resource_shapes = InterviewShape.objects.filter(user=self.user,int_group=self.int_group,resource=self.resource)
        resource_pennies = resource_shapes.aggregate(Sum('pennies'))['pennies__sum']
        if resource_pennies == None:
            resource_pennies = 0
        if resource_pennies == 100:
            folderName = self.resource.name+' (complete)'
        else:
            folderName = self.resource.name+' ('+str(100-resource_pennies)+' pennies left)'
            
        if attributes:
            attr = self.client_object()
            attr['folder'] = 'folder_'+str(self.int_group.id)+'-'+str(self.resource.id)
            attr['folderID'] = 'folder_'+str(self.int_group.id)+'-'+str(self.resource.id)
            attr['folderName'] = folderName
        attr['fillColor'] = '#' + self.int_group.shape_color + self.resource.shape_color + '00'       
        attr['strokeColor'] = "white"
        attr['fillOpacity'] = "0.4"
        attr['shape_label'] = str(self.pennies)+ ' p'
        self.geometry.transform(srid)
        attr['original_geometry'] = self.geometry.wkt
        return '{"id": "mpa_%s", "type": "Feature", "geometry": %s, "properties": %s}' % (self.pk, geo.geojson, geojson_encode(attr))
        
    def copy(self):
        m = self
        shape_id = self.id
        m.id = None
        m.creation_date = datetime.datetime.now()
        m.last_modified = datetime.datetime.now()
        m.num_times_saved = 1
        m.save() #This save generates the new mpa_id
        return m

class FaqGroup(models.Model):
    class Meta:
        db_table = u'gwst_faqgroup'

    def __unicode__(self):
        return u"%s" % (self.faq_group_name)
    
    faq_group_name = models.CharField(max_length=50)

class Faq(models.Model):
    class Meta:
        db_table = u'gwst_faq'

    def __unicode__(self):
        return u"%s" % (self.id)

    IMPORTANCE_CHOICES = (
        (1,'1'),
        (2,'2'),
        (3,'3'),
        (4,'4'),
        (5,'5'),
        (6,'6'),
        (7,'7'),
        (8,'8'),
        (9,'9'),
        (10,'10')                      
    )
                                    
    question = models.TextField(max_length=200)
    answer = models.TextField(max_length=2000)
    importance = models.IntegerField(choices=IMPORTANCE_CHOICES)
    faq_group = models.ForeignKey(FaqGroup)    