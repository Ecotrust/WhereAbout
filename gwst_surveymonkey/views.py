from django.shortcuts import get_object_or_404
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext, loader
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.conf import settings

from forms import SMAddForm
from models import SMRegistrationError, Interview
    
@login_required
def add(request, success_url='/admin/', profile_callback=None):
    if not request.user.is_staff and not request.user.is_superuser:
        return HttpResponseRedirect('/')

    interviews = Interview.objects.all()
    if request.method == 'POST':
        form = SMAddForm(request.POST, request.FILES)
        form.fields['interview'].queryset = interviews
        if form.is_valid():
            try:                   
                save_result = form.save()
            except SMRegistrationError, e:
                return HttpResponseBadRequest(e)
            
            form.upload_list = save_result['output_list']
            form.num_success = save_result['num_success']
            form.num_failed = save_result['num_failed']             
    else:
        form = SMAddForm()
        form.fields['interview'].queryset = interviews
          
    return render_to_response('add_form.html', {'form': form}, context_instance=RequestContext(request))

 