import os
import datetime
import sys

from django import forms
from django.conf import settings
from django.forms.fields import email_re

from gwst_app.models import *
from registration.models import RegistrationProfile
from models import SMRegistrationProfile

from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.core.mail import SMTPConnection, EmailMessage

class SMAddForm(forms.Form):
    userfile = forms.FileField(required=True)
    num_to_register = forms.IntegerField(required=False, label="Maximum number of people to sign up", widget=forms.TextInput(attrs={'size':'3'}))

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
                                        
                    result = self.create_survey(new_person)            
                    
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
        
    def create_survey(self, new_person):      
        output = []
               
        #Make the email address lowercase
        email = new_person[14].lower()            
        #Username is the email address
        username = email
        #SurveyMonkey ID
        sm_id = new_person[0]           
        first_name = new_person[9]            
        last_name = new_person[10]            

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
            username=username,
            first_name=first_name,
            last_name=last_name,                                                                    
            password=password,
            email=email,
            user_group_text=user_group_text
        )

        #Get activated interview
        active_interview = Interview.objects.filter(active=True)[0]
        #Get active survey main question group
        main_group = InterviewGroup.objects.filter(interview=active_interview,code='main')
        #Create main question group record
                
        #Answer main profile questions

        #Create interview record
        #i = RecInterviewData(user=new_user, sm_id=sm_id)
        #i.save()
        # 
        #Add to rec user groups
        #if prvsl:    
        #    new_user.recoverallgrp_set.create(grp_type='prvsl', mid_name='Private', long_name='Private Vessel')
        #if kyk:
        #    new_user.recoverallgrp_set.create(grp_type='kyk', mid_name='Kayak', long_name='Kayak Angler')
        #if dive:
        #    new_user.recoverallgrp_set.create(grp_type='dive', mid_name='Dive', long_name='Dive Angler - spear or hand take')
        
        #Add to rec_fish group
        #new_user.groups.add(Group.objects.filter(name='Recreational Fisherman')[0])
        
        output.append('Success') 
        return {'status':'success','output':output}                    