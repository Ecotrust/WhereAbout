from django.shortcuts import get_object_or_404
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.conf import settings
from django.http import HttpResponseRedirect
from models import *
from forms import *


@login_required
def select_interview(request):
    
    if request.method == 'GET':
        # show list of available interviews
        form = SelectInterviewForm()
        form.fields['interview'].queryset = Interview.objects.all()
        return render_to_response( 'base_form.html', RequestContext(request,{'form': form, 'value':'Continue'}))
        
    else:
        form = SelectInterviewForm(request.POST)
        form.fields['interview'].queryset = Interview.objects.all()
        
        if form.is_valid():
            selected_interview = form.cleaned_data['interview']
            request.session['interview'] = selected_interview
            status_object_qs = InterviewStatus.objects.filter(interview=selected_interview, user=request.user)
            
            if status_object_qs.count() == 0: # no InterviewStatus record exists?
                # create InterviewStatus record
                status = InterviewStatus()
                status.user = request.user
                status.interview = selected_interview
                status.first_login = datetime.datetime.today()
                status.last_login = datetime.datetime.today()
                status.num_logins = 1
                status.save()
            
                # redirect to assign_groups
                return HttpResponseRedirect('/assign_groups/')
        
            else:
                status = status_object_qs[0]
                status.last_login = datetime.datetime.today()
                status.num_logins = status.num_logins + 1
                status.save()
                
                # redirect to interview_group_status
                return render_to_response( 'test.html', RequestContext(request,{}))
    
    # error cases (form not valid)
    return render_to_response( 'test.html', RequestContext(request,{}))
        
    
# on first entrance to a new interview, user selects which groups they belong to    
def assign_groups(request):
    if request.method == 'GET':
        # let user select which groups they are in
        form = SelectInterviewGroupsForm()
        form.fields['groups'].queryset = InterviewGroup.objects.filter(interview=request.session['interview'])
        return render_to_response( 'base_form.html', RequestContext(request,{'form': form, 'value':'Continue'}))
        
    else:
        form = SelectInterviewGroupsForm( request.POST )
        form.fields['groups'].queryset = InterviewGroup.objects.filter(interview=request.session['interview'])
        if form.is_valid():       
            # save InterviewGroupMembership records
            selected_groups = form.cleaned_data['groups']
            
            for group in selected_groups:
                new_group = InterviewGroupMembership()
                new_group.user = request.user
                new_group.int_group = group
                new_group.save()
                
        
        # redirect to interview_group_status
        return render_to_response( 'test.html', RequestContext(request,{}))
    
    
# show a list of user's groups and current status of each
def interview_group_status(request):
    # show list of interview groups with current status (including global interview questions)
    return render_to_response( 'test.html', RequestContext(request,{}))
    
    
# show the questions for an indicated group
def show_group_questions(request):
    if request.method == 'GET':
        # show questions for this group, with any existing user answers
        return render_to_response( 'test.html', RequestContext(request,{}))
        
    else:
        # save InterviewAnswer records
        
        # if not global questions, proceed to draw_group_shapes
        return render_to_response( 'test.html', RequestContext(request,{}))
    
    
# start drawing shapes for indicated group    
def draw_group_shapes(request):
    if request.method == 'GET':
        # get list of resources for this group
        
        # send template page for shape-drawing
        return render_to_response( 'test.html', RequestContext(request,{}))

        
# AJAX post to save a shape     
def save_shape(request):
    if request.method == 'POST':
        # validate indicated group, resource
        
        # validate shape and return validation info
        
        # await confirm_shape from client
        return render_to_response( 'test.html', RequestContext(request,{}))
    

# AJAX post that user accepted clipped shape    
def confirm_shape(request):
    if request.method == 'POST':
        # ack to client to start next shape draw
        return render_to_response( 'test.html', RequestContext(request,{}))


# AJAX post to set pennies for a shape
def assign_pennies(request):
    if request.method == 'POST':
        # validate number of pennies set
        return render_to_response( 'test.html', RequestContext(request,{}))


# user finalizes group
def group_completed(request):
    if request.method == 'POST':
        # update InterviewGroupMembership record
        
        # send to interview_group_status
        return render_to_response( 'test.html', RequestContext(request,{}))
    
    