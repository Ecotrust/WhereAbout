from django import forms

class ExportSurveysForm(forms.Form):
    pass
    
class ImportSurveysForm(forms.Form):
    file  = forms.FileField()
