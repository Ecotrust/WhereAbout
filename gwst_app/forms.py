from django import forms
from models import *
from django.forms.util import ValidationError
from django.forms.util import ErrorList
from fields import PhoneField, MoneyField, PercentField
import re


class NameModelChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.name
        
class NameModelMultipleChoiceField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        return obj.name


class SelectInterviewForm( forms.Form ):
    interview = NameModelChoiceField(label='Select the interview',queryset=None,required=True)
    
class SelectInterviewGroupForm( forms.Form ):
    group = NameModelChoiceField(label='Select the group you belong to',queryset=None,required=True)
    
class SelectInterviewGroupsForm( forms.Form ):
    #groups = NameModelMultipleChoiceField(label='Select the groups you belong to',queryset=None,required=True)
    def __init__(self, groups, *args, **kwargs):
        forms.Form.__init__(self, *args, **kwargs)
        self.groups = groups
        for i, group in enumerate(groups):
            dynamic_args = {}
            
            # percent involvement field
            dynamic_args['label'] = group.name+' (%)'
            dynamic_args['required'] = False
            self.fields['group_%s_pc' % group.id] = PercentField( **dynamic_args )
            self.fields['group_%s_pc' % group.id].group = group
         
    def clean(self):
        pct_sum = 0
        for i, group in enumerate(self.groups):
            try:
                pct_val = self.cleaned_data['group_%s_pc' % group.id]
                if pct_val: 
                    self.cleaned_data['group_%s_pc' % group.id] = int(re.sub("%","",pct_val))
                    pct_sum = pct_sum + int(re.sub("%","",pct_val))
                elif pct_val == "":
                    self.cleaned_data['group_%s_pc' % group.id] = 0
            except Exception, e:
                pass
                
        if pct_sum != 100:
            raise forms.ValidationError( 'Percentages must add up to 100.' )
            
        return self.cleaned_data
    
# from http://code.djangoproject.com/wiki/CookBookNewFormsDynamicFields
class AnswerForm(forms.Form):
    def __init__(self, questions, answers, group_id, resource_id, *args, **kwargs):
        self.group_id = group_id
        self.resource_id = resource_id
        self.questions = questions
        self.answers = answers
        if resource_id:
            resource_postfix = '_'+str(resource_id)
        else:
            resource_postfix = ''
        self.resource_postfix = resource_postfix
        forms.Form.__init__(self, *args, **kwargs)            
        prev_question = None
        for i, question in enumerate(questions):
            dynamic_args = {}
            other_dynamic_args = {}
            dynamic_args['label'] = question.eng_text

            if question.required is True:
                dynamic_args['required'] = True
            else:
                dynamic_args['required'] = False   
                
            answer = answers.filter(int_question=question,resource__pk=resource_id)
            
            # set up the appropriate widget
            if question.answer_type == 'integer': # integer
                if question.val_min != None:
                    dynamic_args['min_value']=int(question.val_min)
                if question.val_max != None:
                    dynamic_args['max_value']=int(question.val_max)
                if answer.count() == 1:
                    dynamic_args['initial']=answer[0].integer_val
                elif question.val_default != '':
                    dynamic_args['initial']=int(question.val_default)                    
                                                     
                self.fields['question_' + str(question.id) + resource_postfix] = forms.IntegerField( **dynamic_args )
                
            elif question.answer_type == 'decimal': # decimal  
                if question.val_min != None:
                    dynamic_args['min_value']=question.val_min
                if question.val_max != None:
                    dynamic_args['max_value']=question.val_max
                if answer.count() == 1:
                    dynamic_args['initial']=answer[0].decimal_val
                elif question.val_default != '':
                    dynamic_args['initial']=float(question.val_default)

                self.fields['question_' + str(question.id) + resource_postfix] = forms.FloatField( **dynamic_args )
                
            elif question.answer_type == 'boolean': # boolean  
                if answer.count() == 1:
                    dynamic_args['initial']=answer[0].boolean_val
                elif question.val_default != '':
                    dynamic_args['initial']=bool(question.val_default)
                dynamic_args['required'] = False
                self.fields['question_' + str(question.id) + resource_postfix] = forms.BooleanField( **dynamic_args )
                
            elif question.answer_type == 'select': #choice list 
                dynamic_args['queryset'] = question.options
                if answer.count() == 1:
                    if answer[0].option_val:
                        dynamic_args['initial']=answer[0].option_val.id
                elif question.val_default != '':
                    default_ans = question.options.filter(eng_text__istartswith=question.val_default)
                    if default_ans.count() == 1:
                        dynamic_args['initial']=default_ans[0].id

                select_form = forms.ModelChoiceField( **dynamic_args )
                select_form.queryset = select_form.queryset.order_by('display_order')
                self.fields['question_' + str(question.id) + resource_postfix] = select_form
                
            elif question.answer_type == 'radio': #radio button list
                dynamic_args['queryset'] = question.options
                dynamic_args['widget'] = forms.RadioSelect()
                dynamic_args['required'] = True
                dynamic_args['initial'] = question.options.values().order_by('display_order')[0]['id']

                if answer.count() == 1:
                    if answer[0].option_val:
                        dynamic_args['initial']=answer[0].option_val.id
                elif question.val_default != '':
                    default_ans = question.options.filter(eng_text__istartswith=question.val_default)
                    if default_ans.count() == 1:
                        dynamic_args['initial']=default_ans[0].id

                select_form = forms.ModelChoiceField( **dynamic_args )
                select_form.queryset = select_form.queryset.order_by('display_order')
                self.fields['question_' + str(question.id) + resource_postfix] = select_form
                
            elif question.answer_type == 'checkbox': #checkbox list 
                option_values = question.options.values().order_by('display_order')
                choices = []
                for val in option_values:
                    choices.append((val.get('id'), val.get('eng_text')))
                dynamic_args['choices'] = choices
                dynamic_args['widget'] = forms.CheckboxSelectMultiple()
                option_list = []
                for ans in answer:
                    if ans.boolean_val:
                        option_list.append(ans.option_id) 
                dynamic_args['initial']= option_list
                self.fields['question_' + str(question.id) + resource_postfix] = forms.MultipleChoiceField( **dynamic_args )

            elif question.answer_type == 'other': #choice w/enter text for other
                dynamic_args['queryset'] = question.options
                other_dynamic_args['label'] = 'Other value for '+question.eng_text
                other_dynamic_args['max_length'] = 300
                other_dynamic_args['required'] = False
                if answer.count() == 1:
                    dynamic_args['initial']=answer[0].option_val.id
                    other_dynamic_args['initial']=answer[0].text_val
                elif question.val_default != '':
                    default_ans = question.options.filter(eng_text__istartswith=question.val_default)
                    if default_ans.count() == 1:
                        dynamic_args['initial']=default_ans[0].id

                self.fields['question_' + str(question.id) + resource_postfix] = forms.ModelChoiceField( **dynamic_args )
                self.fields['question_' + str(question.id) + resource_postfix + '_other'] = forms.CharField( **other_dynamic_args )
            
            elif question.answer_type == 'text': #text
                dynamic_args['max_length'] = 300
                if answer.count() == 1:
                    dynamic_args['initial']=answer[0].text_val
                elif question.val_default != '':
                    dynamic_args['initial']=question.val_default

                self.fields['question_' + str(question.id) + resource_postfix] = forms.CharField( **dynamic_args )
             
            elif question.answer_type == 'textarea': #text area
                if answer.count() == 1:
                    dynamic_args['initial']=answer[0].text_val
                elif question.val_default != '':
                    dynamic_args['initial']=question.val_default

                self.fields['question_' + str(question.id) + resource_postfix] = forms.CharField( widget=forms.widgets.Textarea(), **dynamic_args )
            
            elif question.answer_type == 'phone':
                if answer.count() == 1:
                    ans = answer[0].text_val
                    dynamic_args['initial']=ans
                elif question.val_default != '':
                    dynamic_args['initial']=question.val_default                 
                self.fields['question_' + str(question.id) + resource_postfix] = PhoneField(**dynamic_args )   

            elif question.answer_type == 'money':
                if answer.count() == 1:
                    ans = answer[0].text_val
                    dynamic_args['initial']=ans
                elif question.val_default != '':
                    dynamic_args['initial']=question.val_default
                self.fields['question_' + str(question.id) + resource_postfix] = MoneyField( **dynamic_args )     

            elif question.answer_type == 'percent':
                if answer.count() == 1:
                    ans = answer[0].text_val
                    dynamic_args['initial']=ans
                elif question.val_default != '':
                    dynamic_args['initial']=question.val_default                    
                self.fields['question_' + str(question.id) + resource_postfix] = PercentField( **dynamic_args )
            
            # now add any tooltip text
            if question.eng_tooltip:
                self.fields['question_' + str(question.id) + resource_postfix].widget.attrs.update({'title':question.eng_tooltip})
                
            # mark this question if it is the first in a question set
            if not prev_question or question.question_set != prev_question.question_set:
                if not question.question_set:
                    set_val = '-'
                else:
                    set_val = str(question.question_set)
                self.fields['question_' + str(question.id) + resource_postfix].question_set = set_val
                            
            self.fields['question_' + str(question.id) + resource_postfix].question = question
            self.fields['question_' + str(question.id) + resource_postfix].answer = answer
            prev_question = question

    def clean(self): 
        # first loop through all answers and clean out unnecessary characters
        for question in self.questions:
            key = 'question_'+ unicode(question.id) + self.resource_postfix
            # Due to new custom types (percent & money) proper values aren't populated in cleaned_data.
            if question.answer_type == "money":
                self.cleaned_data[key] = re.sub("\$","",str(self.data[key]))
            elif question.answer_type == "percent":
                self.cleaned_data[key] = re.sub("%","",str(self.data[key]))
            if self.data.get(key) == "" and (question.answer_type == "money" or question.answer_type == "percent"):
                self.cleaned_data[key] = 0

        # now loop again running validation assuming all fields have been cleaned.
        for question in self.questions:        
            if question.question_group:
                self.question_group_validation() 
                break         
        
        return self.cleaned_data

    def question_group_validation(self):
        #Get all of the question groups
        q_groups = QuestionGroup.objects.filter(interviewquestion__int_group=self.group_id)
        for group in q_groups:
            #Get questions in current group
            qs = group.interviewquestion_set.all()            
            #Get answers to these questions from the form
            answers = {}           
            for q in qs:
                key = 'question_'+unicode(q.id) + self.resource_postfix
                
                #If any individual fields in the group already have errors, 
                #skip the group validation until they're fixed
                if self._errors.has_key(key):
                    return
                
                if self.cleaned_data.has_key(key):
                    answer = self.cleaned_data.get(key)                    
                    answers[key] = answer
                else:
                    continue

            #If there are validators, make sure we found some values
            vals = group.validators.all()

            for val in vals:
                if val.type == 'sum':
                    self.validate_sum(int(val.param_1), answers)

    def validate_sum(self, target, answers):
        sum = 0
        key = ''
        for key, value in answers.iteritems():
            if str(value) != "":
                sum += float(value)
        if sum != target:
            msg = 'Values must add up to '+unicode(int(target))+', currently at '+unicode(int(sum))
            self._errors[key] = ErrorList([msg])
    
    def save(self, user):
        for field_name in self.fields:
            field = self.fields[field_name]
            if field.answer.count() == 1:
                answer = field.answer[0]
                answer.last_modified = datetime.datetime.today()
                answer.num_times_saved = answer.num_times_saved + 1
            else:
                answer = InterviewAnswer()
                answer.int_question = field.question
                answer.user = user
                
            if self.resource_id:
                answer.resource_id = self.resource_id
                
            if field.question.answer_type == 'integer' or field.question.answer_type == 'percent':
                answer.integer_val = self.cleaned_data['question_' + str(field.question.id) + self.resource_postfix]
                answer.text_val = str(answer.integer_val) # makes the db a little more human readable
            elif field.question.answer_type == 'decimal' or field.question.answer_type == 'money':
                answer.decimal_val = self.cleaned_data['question_' + str(field.question.id) + self.resource_postfix]
                answer.text_val = str(answer.decimal_val) # makes the db a little more human readable
            elif field.question.answer_type == 'boolean':
                answer.boolean_val = self.cleaned_data['question_' + str(field.question.id) + self.resource_postfix]
                answer.text_val = str(answer.boolean_val) # makes the db a little more human readable
            elif field.question.answer_type == 'select' or field.question.answer_type == 'radio':
                answer.option_val = self.cleaned_data['question_' + str(field.question.id) + self.resource_postfix]
                if answer.option_val:
                    answer.text_val = answer.option_val.eng_text # makes the db a little more human readable
            elif field.question.answer_type == 'checkbox':
                answer_ids = self.cleaned_data['question_' + str(field.question.id) + self.resource_postfix]
                answers = [InterviewAnswerOption.objects.get(pk=opt_id) for opt_id in answer_ids]
                all_options = [InterviewAnswerOption.objects.get(pk=opt['id']) for opt in InterviewQuestion.objects.get(id=field.question.id).options.values()]
                if (Resource.objects.filter(id = self.resource_id)):
                    resource = Resource.objects.get(id = self.resource_id)
                    for val in all_options:
                        ia_qs = InterviewAnswer.objects.get_or_create(int_question = field.question, user = user, resource = resource, option = val)
                        res_answer = ia_qs[0]
                        if not ia_qs[1]:
                            res_answer.num_times_saved = res_answer.num_times_saved + 1
                        res_answer.last_modified = datetime.datetime.today()
                        res_answer.text_val = str(val)
                        if val in answers:
                            res_answer.boolean_val = True
                        else:
                            res_answer.boolean_val = False
                        res_answer.save()
                else:
                    for val in all_options:
                        ia_qs = InterviewAnswer.objects.get_or_create(int_question = field.question, user = user,  option = val)
                        answer = ia_qs[0]
                        if not ia_qs[1]:
                            answer.num_times_saved = answer.num_times_saved + 1
                        answer.last_modified = datetime.datetime.today()
                        answer.text_val = str(val)
                        if val in answers:
                            answer.boolean_val = True
                        else:
                            answer.boolean_val = False
                        answer.save()
                    
                        
                        
                        
            elif field.question.answer_type == 'other':
                answer.option_val = self.cleaned_data['question_' + str(field.question.id) + self.resource_postfix]
                answer.text_val = self.cleaned_data['question_' + str(field.question.id) + self.resource_postfix + '_other']
            elif field.question.answer_type == 'text' or field.question.answer_type == 'phone' or field.question.answer_type == 'textarea':
                answer.text_val = str(self.cleaned_data['question_' + str(field.question.id) + self.resource_postfix])
            if field.question.answer_type != 'checkbox':
                answer.save()
        

class InterviewShapeAttributeForm(forms.ModelForm):
    boundary_n = forms.CharField( max_length=100, label='Northern boundary', required=False ) 
    boundary_s = forms.CharField( max_length=100, label='Southern boundary', required=False )
    boundary_e = forms.CharField( max_length=100, label='Eastern boundary', required=False )
    boundary_w = forms.CharField( max_length=100, label='Western boundary', required=False )
    
    class Meta:
        model = InterviewShape
        exclude = ('user','int_group','resource','geometry','geometry_clipped','geometry_edited','edit_notes','edit_status','creation_date','last_modified','num_times_saved')

class GroupMemberResourceForm(forms.Form):
    def __init__(self, interview, resources, *args, **kwargs):

        forms.Form.__init__(self, *args, **kwargs) 
        choices = []
        for resource in resources:
            if not resource.select_description:
                choices.append((resource.id, resource.verbose_name))
            else:
                choices.append((resource.id, unicode(resource.verbose_name)+': '+unicode(resource.select_description)))
        label = str(interview.resource_name).capitalize()+' groups'
        self.fields['resources'] = forms.MultipleChoiceField(label=label, choices=choices, widget=forms.CheckboxSelectMultiple(), required = False)

    def save(self, group_memb, profile_callback=None):
        resource_ids = self.cleaned_data['resources']
        try:
            resources = [Resource.objects.get(pk=r_id) for r_id in resource_ids]
        except Exception, e:
            return {'status':'fail','error':'Unknown resource submitted'}
        for res_membership in GroupMemberResource.objects.filter(group_membership=group_memb):
            if str(res_membership.resource.id) not in resource_ids:
                res_membership.delete()
        for r in resources:
            #Check if resource has already been added to group membership
            cur_resource = GroupMemberResource.objects.filter(group_membership=group_memb, resource=r)
            if len(cur_resource) > 0:              
                continue                          
            gmr = GroupMemberResource()       
            gmr.resource = r                 
            gmr.group_membership = group_memb  
            gmr.save()
            
        return True     

    def clean(self):
        return self.cleaned_data        