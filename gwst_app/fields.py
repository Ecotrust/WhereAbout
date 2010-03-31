from django.forms import *
import re

phone_re = re.compile('^(\+1\s*[-\/\.]?)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT])\.?\s*(\d+))*$')
money_re = re.compile('^(\$?\s*\d+(\.\d{1,2})?\s*$)|^(\d+(\.\d{1,2})?\s*\$?$)')
percent_re = re.compile('^(%?\s*\d+$)|^(\s*\d+%?$)')

class PhoneField(RegexField):
    default_error_messages = {
        'invalid': u'Enter a valid phone number such as 123-456-7890 or 1(234)567-8901 ext.55',
    }

    def __init__(self, max_length=None, min_length=None, *args, **kwargs):
        RegexField.__init__(self, phone_re, max_length, min_length, *args,
                            **kwargs) 
                            
class MoneyField(RegexField):
    default_error_messages = {
        'invalid': u'Enter a valid number or dollar amount without commas, such as 10000 or $123.45',
    }
    
    def __init__(self, max_length=None, min_length=None, *args, **kwargs):
        RegexField.__init__(self, money_re, max_length, min_length, *args, **kwargs)
        
class PercentField(RegexField):
    default_error_messages = {
        'invalid': u'Enter a valid percentage value such as 12 or 12%',
    }
    
    def __init__(self, max_length=None, min_length=None, *args, **kwargs):
        RegexField.__init__(self, percent_re, max_length, min_length, *args, **kwargs)