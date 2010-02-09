from django import forms
from registration.forms import RegistrationFormUniqueEmail
from django.utils.translation import ugettext_lazy as _
from registration_custom.models import OdfwRegistrationProfile

class RegistrationFormFull(RegistrationFormUniqueEmail):

    def save(self, profile_callback=None):
        """
        Create the new ``User``, ``RegistrationProfile``, 
        ``UserProfile`` and returns the ``User``.
        
        This is essentially a light wrapper around
        ``RegistrationProfile.objects.create_inactive_user()``,
        feeding it the form data and a profile callback (see the
        documentation on ``create_inactive_user()`` for details) if
        supplied.
        
        This overrides the default RegistrationForm.save and adds
        the additional info we collected including their first and
        last name and also their profile information   
        """        
        new_user = OdfwRegistrationProfile.objects.create_inactive_user(username=self.cleaned_data['username'],
                                                                    password=self.cleaned_data['password1'],
                                                                    email=self.cleaned_data['email'],
                                                                    profile_callback=profile_callback)
        new_user.save()        
        return new_user