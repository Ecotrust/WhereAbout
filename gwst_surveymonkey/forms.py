import os
import datetime
import sys

from django import forms
from django.conf import settings
from django.forms.fields import email_re

from gwst_app.models import *
from gwst_app.forms import NameModelChoiceField
from registration.models import RegistrationProfile
from models import SMRegistrationProfile, SMRegistrationError

from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.core.mail import SMTPConnection, EmailMessage

class SMAddForm(forms.Form):
    userfile = forms.FileField(required=True)
    num_to_register = forms.IntegerField(required=False, label="Maximum number of people to sign up", widget=forms.TextInput(attrs={'size':'3'}))
    interview = NameModelChoiceField(label='Interview',queryset=None,required=True)

    def clean_userfile(self):
        if 'userfile' in self.cleaned_data:
            userfile = self.cleaned_data['userfile']
                       
            #Can't access content-type, waiting on patch
            #if userfile.get('content-type') != 'application/vnd.ms-excel' or userfile.get('content-type') != 'text/csv':
            the_split = os.path.splitext(userfile.name)
            extension = ""
            if the_split and len(the_split) == 2:
                 extension = the_split[1]
                 
            if extension != '.csv' and extension != '.CSV':
                msg = 'Only .CSV files are allowed.'
                raise forms.ValidationError(msg)
            return userfile

    def validate_username(self, username):
        """
        Validates that the username is alphanumeric and is not already
        in use.
        
        """
        if not email_re.search(username):
            return {'success':False, 'error':u'Invalid username'}
        try:
            user = User.objects.get(username__exact=username)
        except User.DoesNotExist:
            return {'success':True}
        return {'success':False, 'error':u'Username already exists.'}

    def validate_email(self, email):
        """
        Validates that the username is alphanumeric and is not already
        in use.        
        """  
        if not email_re.search(email):
            return {'success':False, 'error':u'Invalid email'}
        else:
            return {'success':True}

    def save(self, profile_callback=None):
        interview = self.cleaned_data['interview']
        file = self.cleaned_data['userfile']
        num_to_register = self.cleaned_data['num_to_register']

        #Save the uploaded file to a temp directory and open using
        #a handy CSV reader (parset)
        filename = file.name
        filepath = settings.TEMP_DIR
        full_name = filepath+'/'+filename
        fd = open('%s/%s' % (filepath, filename), 'w')  
        fd.write(file.read())
        fd.close()
        fd = open('%s/%s' % (filepath, filename), 'rU')     
        import csv
        from utilities import unicode_csv as csv_u
        reader = csv_u.UnicodeReader(fd, csv.excel, 'utf-8')          

        #Manually iterate through the new signups and create survey accounts
        #stopping if the maximum wanted is reached.
        output_list = []   
        num_success = 0
        num_failed = 0        
        try:
            while 1:
                try:                   
                    new_person = reader.next()
                    
                    #Skip header rows
                    if new_person[0] == 'RespondentID' or new_person[0] == '':
                        continue     
                    #Stop if we've added the number we want.                   
                    elif num_to_register and num_success == num_to_register:
                        break
                                   
                    result = self.create_survey(interview, new_person)            
                    
                    #Check status of create and update accordingly
                    if result.get('status') == 'success':
                        num_success += 1
                    else:
                        num_failed += 1                        
                    output_list.append(result.get('output'))
                        
                #Handle junky header rows
                except csv.Error:
                    continue                
        except StopIteration:
            pass                       

        fd.close()        
        os.remove(full_name) #Remove temp file
        
        return {'output_list':output_list, 'num_success':num_success, 'num_failed':num_failed} 
        
    def create_survey(self, interview, new_person):      
        output = []
               
        sm_id = new_person[0]           
        first_name = new_person[9]            
        last_name = new_person[10]
        city = new_person[11]
        state = new_person[12]
        phone = new_person[13]            
        #Make the email address lowercase
        email = new_person[14].lower()            
        #Username is the email address
        username = email
        kyk = new_person[15]
        dive = new_person[16]
        prvsl = new_person[17]                      
        
        output.append(first_name + ' ' + last_name)            
        output.append(email)
        group_str = ''
        if kyk != '':
            group_str += 'kayak, '
        elif dive != '':
            group_str += 'dive, '
        elif prvsl != '':
            group_str += 'prvsl'            
        output.append(group_str)
                 
        from utilities.passwords import GenPasswd
        password = GenPasswd(chars=email)
        password = password.replace('.','')
        password = password.replace('@','')

        result = self.validate_email(email)            
        
        if not result.get('success'):
            output.append('Failed: '+result.get('error'))
            return {'status':'fail','output':output}   
        
        result = self.validate_username(username)
        if not result.get('success'):
            output.append('Failed: '+result.get('error'))               
            return {'status':'fail','output':output}

        if not prvsl and not kyk and not dive:
            output.append('Skipped: Didn\'t sign up for prvsl, kyk or dive')
            return {'status':'fail','output':output}
        
        user_group_text = ""
        if prvsl:    
            user_group_text += 'Private Vessel\n'
        if kyk:
            user_group_text += 'Kayak\n'
        if dive:
            user_group_text += 'Dive/Spear\n'                     
 
        #Create user                                   
        new_user = SMRegistrationProfile.objects.create_inactive_user(
            interview=interview,
            username=username,
            first_name=first_name,
            last_name=last_name,                                                                    
            password=password,
            email=email,
            user_group_text=user_group_text
        )

        #Get active survey main question group
        main_group = InterviewGroup.objects.filter(interview=interview,code='main')
        
        #Get questions
        try:
            city_q = InterviewQuestion.objects.get(int_group=main_group,code='city')
        except InterviewQuestion.DoesNotExist:
            raise SMRegistrationError('Missing main question with code \'city\' required by survey monkey importer.')
        except InterviewQuestion.MultipleObjectsReturned:
            raise SMRegistrationError('Duplication of main question with code \'city\' ')

        try:        
            state_q = InterviewQuestion.objects.get(int_group=main_group,code='state')
        except InterviewQuestion.DoesNotExist:
            raise SMRegistrationError('Missing main question with code \'state\' required by survey monkey importer.')
        except InterviewQuestion.MultipleObjectsReturned:
            raise SMRegistrationError('Duplication of main question with code: \'state\'')

        try:            
            phone_q = InterviewQuestion.objects.get(int_group=main_group,code='phone')
        except InterviewQuestion.DoesNotExist:
            raise SMRegistrationError('Missing main question: \'Phone Number\' required by survey monkey importer.')
        except InterviewQuestion.MultipleObjectsReturned:
            raise SMRegistrationError('Duplication of main question with code: \'phone\'')

        #Set city
        city_a = InterviewAnswer()
        city_a.int_question = city_q
        city_a.user = new_user
        city_a.text_val = city
        city_a.save()
        
        #Set state
        state_a = InterviewAnswer()
        state_a.int_question = state_q
        state_a.user = new_user
        state_a.text_val = state
        state_a.save()
        
        #Set phone number
        phone_a = InterviewAnswer()
        phone_a.int_question = phone_q
        phone_a.user = new_user
        phone_a.text_val = phone
        phone_a.save()        
        
        #Add user to appropriate interview groups
        if prvsl:
            prvsl_group = InterviewGroup.objects.get(interview=interview,code='prvsl')
            gm = InterviewGroupMembership()
            gm.user = new_user
            gm.int_group = prvsl_group
            gm.save()

        if kyk:
            kyk_group = InterviewGroup.objects.get(interview=interview,code='kyk')
            gm = InterviewGroupMembership()
            gm.user = new_user
            gm.int_group = kyk_group
            gm.save()
            
        if dive:
            dive_group = InterviewGroup.objects.get(interview=interview,code='div')
            gm = InterviewGroupMembership()
            gm.user = new_user
            gm.int_group = dive_group
            gm.save()            
        
        output.append('Success') 
        return {'status':'success','output':output}                    