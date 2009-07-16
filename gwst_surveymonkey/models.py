from registration.models import *
from django.db import models
from gwst_app.models import Interview, InterviewGroup

class SMRegistrationManager(RegistrationManager):
    """
    The methods defined here provide shortcuts for account creation
    using SurveyMonkey records as input.  This is special purpose
    automated registration that can be used alongside the typical
    manual user registration.    
    """
    
    def create_inactive_user(self, interview, username, first_name, last_name, password, email,
                             user_group_text, send_email=True, profile_callback=None):
        """
        Creates a new, inactive ``User``, generates a
        ``RegistrationProfile`` and emails its activation key to the
        ``User``. Returns the new ``User``.
        
        To disable the email, call with ``send_email=False``.
        
        To enable creation of a custom user profile along with the
        ``User`` (e.g., the model specified in the
        ``AUTH_PROFILE_MODULE`` setting), define a function which
        knows how to create and save an instance of that model with
        appropriate default values, and pass it as the keyword
        argument ``profile_callback``. This function should accept one
        keyword argument:

        ``user``
            The ``User`` to relate the profile to.
        
        """
        new_user = User.objects.create_user(username, email, password)
        new_user.first_name = first_name
        new_user.last_name = last_name
        new_user.is_active = False
        new_user.save()
       
        #Create registration specific profile with activation key
        registration_profile = self.create_profile(new_user)
        
        if profile_callback is not None:
            profile_callback(user=new_user)
        
        if send_email:
            from django.core.mail import SMTPConnection, EmailMessage
            current_site = Site.objects.get_current()        
            
            subject = render_to_string('registration/sm_activation_email_subject.txt',
                                       { 'site': current_site,
                                         'interview': interview })

            # Email subject *must not* contain newlines
            subject = ''.join(subject.splitlines())
            
            message = render_to_string('registration/sm_activation_email.txt',
                                       { 'activation_key': registration_profile.activation_key,
                                         'expiration_days': settings.ACCOUNT_ACTIVATION_DAYS,
                                         'site': current_site,
                                         'first_name': first_name,
                                         'user_group_text': user_group_text,
                                         'username': username,
                                         'password': password,
                                         'interview': interview })
            
            connection = SMTPConnection()
            
            EmailMessage(subject, 
                         message, 
                         settings.DEFAULT_FROM_EMAIL, 
                         [new_user.email],
                         connection=connection,
                         bcc=[settings.BCC_EMAIL]).send()                                     
        return new_user  
    
class SMRegistrationProfile(RegistrationProfile):
    objects = SMRegistrationManager()      
    
'''
Thrown when importing and registration of a user from survey monkey fails.
'''
class SMRegistrationError(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return repr(self.value)
