from django import forms

class SelectInterviewForm( forms.Form ):
    interview = forms.ModelChoiceField(label='Select the interview',queryset=None,required=True)
    
class SelectInterviewGroupsForm( forms.Form ):
    groups = forms.ModelMultipleChoiceField(label='Select the groups you belong to',queryset=None,required=True)