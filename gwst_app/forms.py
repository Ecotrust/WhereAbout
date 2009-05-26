from django import forms
from models import *

class NameModelChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.name
        
class NameModelMultipleChoiceField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        return obj.name


class SelectInterviewForm( forms.Form ):
    interview = NameModelChoiceField(label='Select the interview',queryset=None,required=True)
    
class SelectInterviewGroupsForm( forms.Form ):
    groups = NameModelMultipleChoiceField(label='Select the groups you belong to',queryset=None,required=True)
    
class AnswerForm(forms.Form):
    def __init__(self, questions, *args, **kwargs):
        forms.Form.__init__(self, *args, **kwargs)
        for i, question in enumerate(questions):
            dynamic_args = {}
            dynamic_args['label'] = question.eng_text
            
            # set up the appropriate widget
            if question.answer_type == 'integer': # integer
                if question.val_min != None:
                    dynamic_args['min_value']=int(question.val_min)
                if question.val_max != None:
                    dynamic_args['max_value']=int(question.val_max)
                self.fields['question_%d' % question.id] = forms.IntegerField( **dynamic_args )
                
            elif question.answer_type == 'float': # decimal  
                if question.val_min != None:
                    dynamic_args['min_value']=question.val_min
                if question.val_max != None:
                    dynamic_args['max_value']=question.val_max
                self.fields['question_%d' % question.id] = forms.FloatField( **dynamic_args )
                
            elif question.answer_type == 'boolean': # boolean  
                self.fields['question_%d' % question.id] = forms.BooleanField( **dynamic_args )
                
            elif question.answer_type == 'select': #choice list 
                dynamic_args['queryset'] = question.options
                self.fields['question_%d' % question.id] = forms.ModelChoiceField( **dynamic_args )
                
            elif question.answer_type == 'select/other': #choice w/enter text for other
                dynamic_args['queryset'] = question.options
                self.fields['question_%d' % question.id] = forms.ModelChoiceField( **dynamic_args )
                self.fields['question_%d_other' % question.id] = forms.CharField( label='Other value for '+question.eng_text, max_length=300, required=False )
            
            elif question.answer_type == 'text': #text
                dynamic_args['max_length'] = 300
                self.fields['question_%d' % question.id] = forms.CharField( **dynamic_args )
            
            # now add any tooltip text
            if question.eng_tooltip:
                self.fields['question_%d' % question.id].widget.attrs.update({'title':question.eng_tooltip})



