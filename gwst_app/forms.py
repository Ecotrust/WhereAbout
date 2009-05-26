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
            if question.answer_type == 0: # integer
                value_range_args = {}
                value_range_args['label'] = question.eng_text
                if question.val_min:
                    value_range_args['min_value']=int(question.val_min)
                if question.val_max:
                    value_range_args['max_value']=int(question.val_max)
                self.fields['question_%d' % question.id] = forms.IntegerField( **value_range_args )
                
            elif question.answer_type == 1: # decimal  
                value_range_args = {}
                value_range_args['label'] = question.eng_text
                if question.val_min:
                    value_range_args['min_value']=question.val_min
                if question.val_max:
                    value_range_args['max_value']=question.val_max
                self.fields['question_%d' % question.id] = forms.FloatField( label=question.eng_text )
                
            elif question.answer_type == 2: # boolean  
                self.fields['question_%d' % question.id] = forms.BooleanField( label=question.eng_text )
                
            elif question.answer_type == 3: #choice list 
                self.fields['question_%d' % question.id] = forms.ModelChoiceField( label=question.eng_text, queryset=question.options )
                
            elif question.answer_type == 4: #choice w/enter text for other
                self.fields['question_%d' % question.id] = forms.ModelChoiceField( label=question.eng_text, queryset=question.options )
            
            elif question.answer_type == 5: #text
                self.fields['question_%d' % question.id] = forms.CharField( label=question.eng_text, max_length=300 )



