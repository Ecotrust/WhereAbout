from django import forms
from models import *
from django.forms.util import ValidationError

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
            pct_val = self.cleaned_data['group_%d_pc' % group.id]
            if pct_val:
                pct_sum = pct_sum + self.cleaned_data['group_%d_pc' % group.id]
                
        if pct_sum < 100 or pct_sum > 100:
            raise forms.ValidationError( 'Percentages must sum to 100.' )
            
        return self.cleaned_data
    
# from http://code.djangoproject.com/wiki/CookBookNewFormsDynamicFields
class AnswerForm(forms.Form):
    def __init__(self, questions, answers, *args, **kwargs):
        forms.Form.__init__(self, *args, **kwargs)
        for i, question in enumerate(questions):
            dynamic_args = {}
            dynamic_args['label'] = question.eng_text
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
            
            # now add any tooltip text
            if question.eng_tooltip:
                self.fields['question_%d' % question.id].widget.attrs.update({'title':question.eng_tooltip})
                
            self.fields['question_%d' % question.id].question = question
            self.fields['question_%d' % question.id].answer = answer

class InterviewShapeAttributeForm(forms.ModelForm):
    pennies = forms.IntegerField( min_value=1, max_value=100, required=True )
    
    def clean_pennies(self):
        new_pennies = self.cleaned_data['pennies']
        total_pennies = new_pennies + self.group_pennies

        if total_pennies > 100:
            raise ValidationError('The total number of pennies across all shapes in this group cannot exceed 100.') 
            
        return self.cleaned_data['pennies']
        
    class Meta:
        model = InterviewShape
        exclude = ('user','int_group','resource','geometry','geometry_clipped','geometry_edited','edit_notes','edit_status','creation_date','last_modified','num_times_saved')
