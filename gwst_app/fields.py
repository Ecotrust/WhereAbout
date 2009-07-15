from django.forms import *
import re

phone_re = re.compile('^(\+1\s*[-\/\.]?)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT])\.?\s*(\d+))*$')

class PhoneField(RegexField):
    default_error_messages = {
        'invalid': u'Enter a valid phone number such as 123-456-7890 or 1(234)567-8901 ext.55',
    }

    def __init__(self, max_length=None, min_length=None, *args, **kwargs):
        RegexField.__init__(self, phone_re, max_length, min_length, *args,
                            **kwargs) 