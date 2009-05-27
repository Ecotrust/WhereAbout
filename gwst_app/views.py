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
        # handle the user's interview selection from a POST
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
                
                # create group records for any required groups
                required_groups = InterviewGroup.objects.filter(interview=selected_interview, required_group=True)
                for group in required_groups:
                    new_group = InterviewGroupMembership()
                    new_group.user = request.user
                    new_group.int_group = group
                    new_group.save()
            
                # redirect to assign_groups
                return HttpResponseRedirect('/assign_groups/')
        
            else:
                status = status_object_qs[0]
                
                # see if the interview has been marked complete
                if status.completed:
                    # redirect to interview_complete
                    return HttpResponseRedirect('/interview_complete/')
                    
                # update user access timestamp if they are returning to a live interview
                status.last_login = datetime.datetime.today()
                status.num_logins = status.num_logins + 1
                status.save()
            
                # see if there are any group memberships
                int_groups = InterviewGroup.objects.filter(interview=selected_interview)
                num_group_membs = InterviewGroupMembership.objects.filter(user=request.user, int_group__in=int_groups).count()
                
                # if there are no group memberships, a user may have aborted before selecting them before, give them another chance now
                if num_group_membs == 0:
                    # redirect to assign_groups
                    return HttpResponseRedirect('/assign_groups/')
                 
                # redirect to interview_group_status
                return HttpResponseRedirect('/group_status/')
                
        # validation errors
        return render_to_response( 'base_form.html', RequestContext(request,{'form': form, 'value':'Continue'}))        
    
# on first entrance to a new interview, user selects which groups they belong to    
def assign_groups(request):
    if request.method == 'GET':
        # let user select which groups they are in
        form = SelectInterviewGroupsForm()
        form.fields['groups'].queryset = InterviewGroup.objects.filter(interview=request.session['interview'],required_group=False)
        return render_to_response( 'base_form.html', RequestContext(request,{'form': form, 'value':'Continue'}))
        
    else:
        form = SelectInterviewGroupsForm( request.POST )
        form.fields['groups'].queryset = InterviewGroup.objects.filter(interview=request.session['interview'],required_group=False)
        if form.is_valid():       
            # save InterviewGroupMembership records
            selected_groups = form.cleaned_data['groups']
            
            for group in selected_groups:
                new_group = InterviewGroupMembership()
                new_group.user = request.user
                new_group.int_group = group
                new_group.save()
                
            # redirect to interview_group_status
            return HttpResponseRedirect('/group_status/')
        
        # validation errors
        return render_to_response( 'base_form.html', RequestContext(request,{'form': form, 'value':'Continue'}))
    
    
# show a list of user's groups and current status of each
def group_status(request):
    # show list of interview groups with current status (including global interview questions)
    int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])   
    qs = InterviewGroupMembership.objects.filter(user=request.user, int_group__in=int_groups)
    
    # if user has finalized each of their registered groups, let them finalize their interview
    finalized_groups = qs.filter(status='finalized')
    allow_finalize = qs.count() == finalized_groups.count()
    
    return render_to_response( 'group_status.html', RequestContext(request,{'interview':request.session['interview'], 'object_list':qs, 'allow_finalize':allow_finalize}))
    
    
    
def answer_questions(request,group_id):
    if request.method == 'GET':
        # show questions for this group, with any existing user answers
        questions = InterviewQuestion.objects.filter(int_group__pk=group_id).order_by('question_set', 'display_order')
        answers = InterviewAnswer.objects.filter(user=request.user, int_question__in=questions)
        form = AnswerForm(questions, answers)
        
    else:
        # form validation
        questions = InterviewQuestion.objects.filter(int_group__pk=group_id).order_by('question_set', 'display_order')
        answers = InterviewAnswer.objects.filter(user=request.user, int_question__in=questions)
        form = AnswerForm(questions, answers, request.POST)
        

        if form.is_valid():
            # create or update InterviewAnswer records
            for field_name in form.fields:
                field = form.fields[field_name]
                if field.answer.count() == 1:
                    answer = field.answer[0]
                    answer.last_modified = datetime.datetime.today()
                    answer.num_times_saved = answer.num_times_saved + 1
                else:
                    answer = InterviewAnswer()
                    answer.int_question = field.question
                    answer.user = request.user
                    
                if field.question.answer_type == 'integer':
                    answer.integer_val = form.cleaned_data['question_%d' % field.question.id]
                elif field.question.answer_type == 'decimal':
                    answer.decimal_val = form.cleaned_data['question_%d' % field.question.id]
                elif field.question.answer_type == 'boolean':
                    answer.boolean_val = form.cleaned_data['question_%d' % field.question.id]
                elif field.question.answer_type == 'select':
                    answer.option_val = form.cleaned_data['question_%d' % field.question.id]
                    answer.text_val = answer.option_val.eng_text # makes the db a little more human readable
                elif field.question.answer_type == 'other':
                    answer.option_val = form.cleaned_data['question_%d' % field.question.id]
                    answer.text_val = form.cleaned_data['question_%d_other' % field.question.id]
                elif field.question.answer_type == 'text':
                    answer.text_val = form.cleaned_data['question_%d' % field.question.id]
                answer.save()
                
                # update the InterviewGroupMembership to show in-progress status
                group_memb = InterviewGroupMembership.objects.filter(user=request.user, int_group__pk=group_id)
                if group_memb.count()==1:
                    updated_group = group_memb[0]
                    if updated_group.status == 'not yet started':
                        updated_group.date_started = datetime.datetime.now()
                    updated_group.status = 'in-progress'
                    updated_group.save()
                else: #404
                    return render_to_response( 'test.html', RequestContext(request,{}))
            
            # if not global questions, proceed to draw_group_shapes
            group = InterviewGroup.objects.get(pk=group_id)
            
            if group.user_draws_shapes:
                return HttpResponseRedirect('/draw_group_shapes/')
            else:
                return HttpResponseRedirect('/group_status/')

    return render_to_response( 'base_form.html', RequestContext(request,{'form': form, 'value':'Continue'}))     
    
    
# start draw shapes for indicated group    
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
def finalize_group(request,id):
    if request.method == 'GET':
        # update InterviewGroupMembership record
        group_memb = InterviewGroupMembership.objects.filter(user=request.user, int_group__pk=id)
        
        if group_memb.count() == 1:
            update_memb = group_memb[0]
            update_memb.status = 'finalized'
            update_memb.date_completed = datetime.datetime.now()
            update_memb.save()
        else: #404
            return render_to_response( 'test.html', RequestContext(request,{}))
        
        # redirect to interview_group_status
        return HttpResponseRedirect('/group_status/')
        
        
# user finalizes group
def finalize_interview(request,id):
    if request.method == 'GET':

        # make sure this interview is the current one for this user session
        if int(id) == request.session['interview'].id:
            # get the interviewstatus object
            int_status = InterviewStatus.objects.get(user=request.user,interview=id)
            int_status.completed = True
            int_status.complete_date = datetime.datetime.today()
            int_status.save()
        
        # redirect to finished page
        return HttpResponseRedirect('/interview_complete/')
    
   
def interview_complete(request):
    return render_to_response( 'interview_complete.html', RequestContext(request,{'name':request.session['interview'].name}))