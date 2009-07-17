from django import forms
from models import *
from django.forms.util import ValidationError
from django.forms.util import ErrorList
from fields import PhoneField

class NameModelChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.name
        
class NameModelMultipleChoiceField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        return obj.name


class SelectInterviewForm( forms.Form ):
    interview = NameModelChoiceField(label='Select the interview',queryset=None,required=True)
    
class SelectInterviewGroupsForm( forms.Form ):
    #groups = NameModelMultipleChoiceField(label='Select the groups you belong to',queryset=None,required=True)
    def __init__(self, groups, *args, **kwargs):
        forms.Form.__init__(self, *args, **kwargs)
        self.groups = groups
        for i, group in enumerate(groups):
            dynamic_args = {}
            
            # percent involvement field
            dynamic_args['label'] = '% involvement in ' + group.name
            dynamic_args['required'] = False
            dynamic_args['min_value']=0
            dynamic_args['max_value']=100
            self.fields['group_%d_pc' % group.id] = forms.IntegerField( **dynamic_args )
            self.fields['group_%d_pc' % group.id].group = group
         
    def clean(self):
        pct_sum = 0
        
        for i, group in enumerate(self.groups):
            try:
                pct_val = self.cleaned_data['group_%d_pc' % group.id]
                if pct_val:
                    pct_sum = pct_sum + self.cleaned_data['group_%d_pc' % group.id]
            except Exception, e:
                pass
                
        if pct_sum < 100 or pct_sum > 100:
            raise forms.ValidationError( 'Percentages must sum to 100.' )
            
        return self.cleaned_data
    
# from http://code.djangoproject.com/wiki/CookBookNewFormsDynamicFields
class AnswerForm(forms.Form):
    def __init__(self, questions, answers, group_id, *args, **kwargs):
        self.group_id = group_id
        
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
                
            answer = answers.filter(int_question=question)
            
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
                                                     
                self.fields['question_%d' % question.id] = forms.IntegerField( **dynamic_args )
                
            elif question.answer_type == 'decimal': # decimal  
                if question.val_min != None:
                    dynamic_args['min_value']=question.val_min
                if question.val_max != None:
                    dynamic_args['max_value']=question.val_max
                if answer.count() == 1:
                    dynamic_args['initial']=answer[0].decimal_val
                elif question.val_default != '':
                    dynamic_args['initial']=float(question.val_default)

                self.fields['question_%d' % question.id] = forms.FloatField( **dynamic_args )
                
            elif question.answer_type == 'boolean': # boolean  
                if answer.count() == 1:
                    dynamic_args['initial']=answer[0].boolean_val
                elif question.val_default != '':
                    dynamic_args['initial']=bool(question.val_default)
                dynamic_args['required'] = False
                self.fields['question_%d' % question.id] = forms.BooleanField( **dynamic_args )
                
            elif question.answer_type == 'select': #choice list 
                dynamic_args['queryset'] = question.options
                if answer.count() == 1:
                    if answer[0].option_val:
                        dynamic_args['initial']=answer[0].option_val.id
                elif question.val_default != '':
                    default_ans = question.options.filter(eng_text__istartswith=question.val_default)
                    if default_ans.count() == 1:
                        dynamic_args['initial']=default_ans[0].id

                self.fields['question_%d' % question.id] = forms.ModelChoiceField( **dynamic_args )
                
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

                self.fields['question_%d' % question.id] = forms.ModelChoiceField( **dynamic_args )
                self.fields['question_%d_other' % question.id] = forms.CharField( **other_dynamic_args )
            
            elif question.answer_type == 'text': #text
                dynamic_args['max_length'] = 300
                if answer.count() == 1:
                    dynamic_args['initial']=answer[0].text_val
                elif question.val_default != '':
                    dynamic_args['initial']=question.val_default

                self.fields['question_%d' % question.id] = forms.CharField( **dynamic_args )
            
            elif question.answer_type == 'phone':
                if answer.count() == 1:
                    ans = answer[0].text_val
                    dynamic_args['initial']=ans
                elif question.val_default != '':
                    dynamic_args['initial']=question.val_default                 
                self.fields['question_%d' % question.id] = PhoneField(**dynamic_args )                        
            
            # now add any tooltip text
            if question.eng_tooltip:
                self.fields['question_%d' % question.id].widget.attrs.update({'title':question.eng_tooltip})
                
            # mark this question if it is the first in a question set
            if not prev_question or question.question_set != prev_question.question_set:
                if not question.question_set:
                    set_val = '-'
                else:
                    set_val = str(question.question_set)
                self.fields['question_%d' % question.id].question_set = set_val
                            
            self.fields['question_%d' % question.id].question = question
            self.fields['question_%d' % question.id].answer = answer
            
            prev_question = question

    def clean(self):
        self.question_group_validation()            
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
                key = 'question_'+unicode(q.id)
                
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
        for key, value in answers.iteritems():
            sum += int(value)
        if sum != target:
            msg = 'Values must add up to '+unicode(target)+', currently at '+unicode(sum)
            self._errors[key] = ErrorList([msg])            

class InterviewShapeAttributeForm(forms.ModelForm):
    pennies = forms.IntegerField( min_value=1, max_value=100, required=True )
    boundary_n = forms.CharField( max_length=100, label='Northern boundary', required=False ) 
    boundary_s = forms.CharField( max_length=100, label='Southern boundary', required=False )
    boundary_e = forms.CharField( max_length=100, label='Eastern boundary', required=False )
    boundary_w = forms.CharField( max_length=100, label='Western boundary', required=False )
    
    def clean_pennies(self):
        new_pennies = self.cleaned_data['pennies']
        total_pennies = new_pennies + self.group_pennies

        if total_pennies > 100:
            raise ValidationError('The total number of pennies across all shapes in this group cannot exceed 100. (current: %s)' % (total_pennies,)) 
            
        return self.cleaned_data['pennies']
        
    class Meta:
        model = InterviewShape
        exclude = ('user','int_group','resource','geometry','geometry_clipped','geometry_edited','edit_notes','edit_status','creation_date','last_modified','num_times_saved')


class GroupMemberResourceForm(forms.Form):
    def __init__(self, resources, *args, **kwargs):
        forms.Form.__init__(self, *args, **kwargs) 
        choices = [(resource.id, resource.name) for resource in resources]
        
        self.fields['resources'] = forms.MultipleChoiceField(choices=choices, widget=forms.CheckboxSelectMultiple())

    def save(self, group_memb, profile_callback=None):
        resource_ids = self.cleaned_data['resources']
        try:
            resources = [Resource.objects.get(pk=r_id) for r_id in resource_ids]
        except Exception, e:
            return {'status':'fail','error':'Unknown resource submitted'}         
        for r in resources:
            gmr = GroupMemberResource()
            gmr.resource = r
            gmr.group_membership = group_memb
            gmr.save()
        return True