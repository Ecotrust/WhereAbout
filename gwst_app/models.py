from django.contrib.gis.db.models import *
from django.contrib.auth.models import User
from django.conf import settings
import datetime
from gwst_app.utils.geojson_encode import *
from gwst_app.managers import *

class Region(Model):
    name = CharField( max_length=100, unique=True )
    n_bound = FloatField()
    s_bound = FloatField()
    e_bound = FloatField()
    w_bound = FloatField()
    code = CharField( max_length=10, unique=True )
    
    class Meta:
        db_table = u'gwst_region'
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.code, self.name))

#Region to clip user-drawn shapes to.
class ClipRegion(Model): 
    pk_uid = IntegerField(primary_key = True)
    name = models.TextField()
    feature = CharField( max_length=50 )
    # Geometry = PolygonField(srid=settings.SERVER_SRID) # for spatialite testing
    Geometry = PolygonField(srid=settings.SERVER_SRID)
    objects = GeoManager()
    class Meta:
        db_table = u'gwst_region_clip'
        
    def __unicode__(self):
        return unicode('%s' % (self.name))   

class Resource(Model):

    MethodChoices = (
        ('Brail', 'Brail'),
        ('Dip Net', 'Dip Net'),
        ('Dive', 'Dive'),
        ('Drift or Set Gill Net', 'Drift or Set Gill Net'),
        ('Gillnet', 'Gillnet'),
        ('Handgear/Longline', 'Handgear/Longline'),
        ('Handgear/Longline/Gillnet', 'Handgear/longline/Gillnet'),
        ('Handpicking', 'Handpicking'),
        ('Hook and Line', 'Hook and Line'),
        ('Hook and Line/Longline', 'Hook and Line/Longline'),
        ('Longline', 'Longline'),
        ('Net', 'Net'),
        ('Net or Seine', 'Net or Seine'),
        ('Seine', 'Seine'),
        ('Seine or Dip Net', 'Seine or Dip Net'),
        ('Set Gill Net', 'Set Gill Net'),
        ('Trap', 'Trap'),
        ('Trawl', 'Trawl'),
        ('Troll', 'Troll'),
        ('Fishery', 'Fishery'),
        ('Activity', 'Activity')
    )    
    name = CharField( max_length=100 )
    verbose_name = CharField( max_length=133, unique=True ) #Should be name - method
    id = CharField( max_length=133, primary_key=True ) #Should be name - method
    method = CharField( max_length=30, choices = MethodChoices, blank = True, default = 'Dive' )
    code = CharField( max_length=133, default='' )
    select_description = CharField( max_length=300, default = '', blank=True) #Holds information on why you would/should select this resource
    shape_color = CharField( max_length=6, default = 'FFFF00', blank=True )
    display_order = FloatField(default = 0)
    
    class Meta:
        db_table = u'gwst_resource'
        
    def __unicode__(self):
        return unicode('%s: %s - %s' % (self.code, self.name, self.method))
        
class Interview(Model):
    id = models.AutoField( primary_key = True )
    region = ForeignKey(Region)
    clip_region = ForeignKey(ClipRegion)
    name = CharField( max_length=100, unique=True )
    organization = CharField( max_length=100 )
    description = CharField( max_length=200 )
    code = CharField( max_length=20, unique=True )
    active = BooleanField( default=False )
    group_status_text = TextField( blank=True, default='' )
    draw_shape_text = TextField( blank=True, default='' )
    interview_complete_text = TextField( blank=True, default='' )
    assign_groups_text = TextField( blank=True, default='' ) 
    resource_name = CharField( max_length=60, default='species' )
    resource_name_plural = CharField( max_length=60, default='species' )
    resource_action = CharField( max_length=20, default='target' )
    resource_action_past_tense = CharField( max_length=20, default='targeted' )
    shape_name = CharField( max_length=20, default='fishing ground' )
    shape_name_plural = CharField( max_length=20, default='fishing grounds' )
    multiple_user_groups = BooleanField( default=True )
    class Meta:
        db_table = u'gwst_interview'
        
    def __unicode__(self):
        return unicode('%s-%s' % (self.region.code, self.code))
    
class InterviewGroup(Model):
    id = models.AutoField( primary_key = True )
    interview = ForeignKey(Interview)
    name = CharField( max_length=100 )
    header = CharField( max_length=100, blank=True, null=True, default='' )
    description = CharField( max_length=200 )
    code = CharField( max_length=10 )
    resources = ManyToManyField(Resource,blank=True,null=True,verbose_name='Resource Groups')
    select_resource_text = TextField( blank=True, default='' )
    required_group = BooleanField( default=False )
    is_user_group = BooleanField( default=False )
    user_draws_shapes = BooleanField( default=True )
    independent = BooleanField( default=False, help_text="custom group type, will not show in main menu" )
    shape_color = CharField( max_length=6, blank=True, default="FFFFFF" )
    preselect = BooleanField( default=True ) #Allow user to select which resources they use before drawing? 
    member_title = CharField( max_length=50, default='' )
    page_template = CharField( max_length=60, default="base_form.html" )
    question_width = IntegerField( default = 275 )
    resource_page_template = CharField( max_length=60, default="base_formset.html" )
    resource_question_width = IntegerField( default = 420 )
    order = IntegerField()
    class Meta:
        db_table = u'gwst_group'
        unique_together = (("interview", "code"),("interview", "name"))
        
    def __unicode__(self):
        return unicode('%s-%s' % (self.interview, self.code))

class InterviewGroupMembership(Model):

    InterviewGroupStatusChoices = (
        ( 'not yet started', 'not yet started' ),
        ( 'in-progress', 'in-progress' ),
        ( 'selecting resources', 'selecting resources' ),
        #( 'drawing', 'drawing' ),
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
    opt_out = BooleanField( default=False )
    objects = InterviewGroupMembershipManager()   
    order = IntegerField( blank=True, null=True)
 
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

    def user(self):
        return unicode('%s' % self.group_membership.user_id)
       
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
    id = models.AutoField( primary_key = True )
    AnswerTypeChoices = (
        ( 'integer', 'integer value' ),
        ( 'decimal', 'decimal value' ),
        ( 'boolean', 'boolean (true/false) value' ),
        ( 'select', 'select from list of values' ),
        ( 'checkbox', 'check box' ),
        ( 'selectmultiple', 'select multiple from a list' ),
        ( 'text', 'enter text' ),
        ( 'phone', 'phone number' ),
        ( 'money', 'dollar amount'),
        ( 'percent', 'percentage' ),
        ( 'textarea', 'text area')
    )
    
    LayoutChoices = (
        ('hoizontal', 'horizontal'),
        ('vertical', 'vertical')
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
    all_resources = BooleanField( help_text='is this a question to be asked once for each resource?', default=False)
    layout = CharField( max_length=20, choices=LayoutChoices, default=None, blank=True, null=True )
    header_name = CharField( max_length=200, default='', blank=True, null=True )
        
    class Meta:
        db_table = u'gwst_question'
        ordering = ('int_group__interview','int_group','question_set','display_order')
        
    def __unicode__(self):
        return unicode('%s-%s:%s' % (self.int_group, self.code,self.header_name))
    
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
    resource = ForeignKey(Resource, null=True, blank=True) # only used if question.all_resources is set
    option = ForeignKey(InterviewAnswerOption, null=True, blank=True) # only used for questions with multiple answers
    option_val = ForeignKey(InterviewAnswerOption, null=True, blank=True, related_name='opt_val')
    text_val = TextField(null=True, blank=True)
    integer_val = IntegerField(null=True, blank=True)
    decimal_val = FloatField(null=True, blank=True)
    boolean_val = NullBooleanField(null=True, blank=True)
    creation_date = DateTimeField(default=datetime.datetime.now)
    last_modified = DateTimeField(default=datetime.datetime.now)
    num_times_saved = IntegerField(default=1)
    
    class Meta:
        db_table = u'gwst_useranswer'
        unique_together = (("int_question", "user", "resource", "option"),)
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.user, self.int_question))
        
    def save_answer(self):
        pass\
        
    def code(self):
        return unicode('%s' % self.int_question.code)
    
    def interview_group(self):
        return unicode('%s' % self.int_question.int_group.name)

class InterviewStatus(Model):
    interview = ForeignKey(Interview)
    user = ForeignKey(User)
    completed = BooleanField(default=False)
    creation_date = DateTimeField(default=datetime.datetime.now)
    first_login = DateTimeField(null=True)
    last_login = DateTimeField(null=True)
    num_logins = IntegerField(default=0)
    complete_date = DateTimeField(null=True)
    notes = TextField(null=True)
    overview_completed = BooleanField(default=False)
    
    class Meta:
        db_table = u'gwst_userstatus'
        unique_together = (("interview", "user"),)
        
    def __unicode__(self):
        return unicode('%s: %s' % (self.user, self.interview))

class InterviewShape(Model):
    user = ForeignKey(User)
    int_group = ForeignKey(InterviewGroup)
    resource = ForeignKey(Resource)
    geometry = PolygonField(srid=settings.SERVER_SRID)#, blank=True, null=True)
    pennies = IntegerField( default=0 )
    boundary_n = CharField( max_length=100, blank=True, null=True ) 
    boundary_s = CharField( max_length=100, blank=True, null=True )
    boundary_e = CharField( max_length=100, blank=True, null=True )
    boundary_w = CharField( max_length=100, blank=True, null=True )
    note_text = CharField( max_length=1000, blank=True, null=True )
    importance = CharField( max_length=1000, blank=True, null=True )
    days_visited = IntegerField( blank=True, null=True )
    creation_date = DateTimeField(default=datetime.datetime.now)
    objects = InterviewShapeManager()
    
    class Meta:
        db_table = u'gwst_usershape'

    def __unicode__(self):
        return unicode('%s: %s %s' % (self.user, self.resource.code, self.int_group))

    def int_group_name(self):
        return unicode('%s' % self.int_group.name)        

class InterviewShapeShapefile(Model):
    shape = CharField( max_length=300, blank=False, null=False)
    user = CharField( max_length=300, blank=False, null=False)
    f_name = CharField( max_length=300, blank=False, null=False)
    l_name = CharField( max_length=300, blank=False, null=False)
    l_num = CharField( max_length=300, blank=True, null=True)
    home_port = CharField( max_length=300, blank=True, null=True)
    interview = CharField( max_length=300, blank=False, null=False)
    int_name = CharField( max_length=100, blank=False, null=False)
    group = ForeignKey(InterviewGroup)
    grp_name = CharField( max_length=100, blank=False, null=False)
    resource =  CharField( max_length=300, blank=False, null=False)
    res_name = CharField( max_length=300, blank=False, null=False)
    res_method = CharField( max_length=300, blank=False, null=False)
    geometry = PolygonField(srid=settings.SERVER_SRID)
    pennies = IntegerField()
    bound_n = CharField( max_length=100, blank=True, null=True ) 
    bound_s = CharField( max_length=100, blank=True, null=True )
    bound_e = CharField( max_length=100, blank=True, null=True )
    bound_w = CharField( max_length=100, blank=True, null=True )
    note_text = CharField( max_length=1000, blank=True, null=True )
    importance = CharField( max_length=1000, blank=True, null=True )
    days_visit = IntegerField( blank=True, null=True )
    date = CharField( max_length=100, blank=False, null=False )
    objects = models.GeoManager() 
    
    class Meta:
        db_table = u'gwst_usershape_shapefile'
        
    def __unicode__(self):
        return unicode('%s: %s %s' % (self.user, self.resource.code, self.group))
        
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

class UserProfile(models.Model):
    class Meta:
        db_table = u'gwst_userprofile'
        
    user = models.ForeignKey(User, unique=True)
    created_by = models.ForeignKey(User, related_name="user_creator_fk", null=True)
    
def user_post_save(sender, instance, **kwargs):
    qs = User.objects.filter(is_staff=True).order_by('-last_login')
    if qs.count() == 0:
        creator = instance
    else:
        creator = qs[0]

    try:
        if not instance.is_staff:
            profile = UserProfile.objects.get(user=instance)
    except ObjectDoesNotExist:
        profile = UserProfile()
        profile.user = instance
        profile.created_by = creator
        profile.save()
        print 'Added profile object'

models.signals.post_save.connect(user_post_save, sender=User)