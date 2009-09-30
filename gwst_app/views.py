from django.shortcuts import get_object_or_404
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext, loader
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest
from django.conf import settings
from models import *
from forms import *
from gwst_app.utils.geojson_encode import *
from django.db.models import Sum

#Pass extra settings around whether user can self-register
def login(request, template_name='registration/login.html'):
    request.user.SELF_REGISTRATION = settings.SELF_REGISTRATION
    from django.contrib.auth.views import login as default_login
    return default_login(request, template_name)

def handleSelectInterview(request,selected_interview):

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
            membership, created = InterviewGroupMembership.objects.get_or_create(user=request.user, int_group=group)
            membership.user = request.user
            membership.int_group = group
            membership.save()
    
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
        req_groups = int_groups.filter(required_group=True)
        num_group_membs = InterviewGroupMembership.objects.filter(user=request.user, int_group__in=int_groups).count()
        
        # if there are no group memberships, a user may have aborted before selecting them before, give them another chance now
        if num_group_membs == 0:
            # redirect to assign_groups
            return HttpResponseRedirect('/assign_groups/')
           
        # if the user has only the required groups, they may have aborted before selecting optional groups
        if num_group_membs == req_groups.count() and req_groups.count() != int_groups.count():
            # redirect to assign_groups
            return HttpResponseRedirect('/assign_groups/')
         
        # redirect to interview_group_status
        return HttpResponseRedirect('/group_status/')
                

@login_required
def select_interview(request):
    
    if request.user.is_staff:
        active_interviews = Interview.objects.all()
    else:
        active_interviews = Interview.objects.filter(active=True)
    
    # special handling if there is only one active interview
    if active_interviews.count() == 1:
        return handleSelectInterview( request, active_interviews[0] )
    
    title = 'Select the interview you wish to complete.'
    
    if request.method == 'GET':
        # show list of available interviews
        form = SelectInterviewForm()
        form.fields['interview'].queryset = active_interviews
        return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'form': form, 'value':'Continue'}))
        
    else:
        # handle the user's interview selection from a POST
        form = SelectInterviewForm(request.POST)
        form.fields['interview'].queryset = active_interviews
        
        if form.is_valid():
            selected_interview = form.cleaned_data['interview']
            return handleSelectInterview( request, selected_interview )
                
        # validation errors
        return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'form': form, 'value':'Continue'}))        
    
    
# on first entrance to a new interview, user selects which groups they belong to  
@login_required  
def assign_groups(request):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')


    title = request.session['interview'].name + ' - Group Membership Selection'
    interview = request.session['interview']
    instructions={}
    instructions['main'] = interview.assign_groups_text

    if request.method == 'GET':
        # let user select which groups they are in
        groups = InterviewGroup.objects.filter(interview=interview,required_group=False)
        form = SelectInterviewGroupsForm( groups )
        return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'form': form, 'instructions':instructions, 'value':'Continue'}))
        
    else:
        groups = InterviewGroup.objects.filter(interview=request.session['interview'],required_group=False)
        form = SelectInterviewGroupsForm( groups, request.POST )

        if form.is_valid():       
            # save InterviewGroupMembership records
            for field_name in form.fields:
                field = form.fields[field_name]
                if field.group and form.cleaned_data['group_%d_pc' % field.group.id] > 0:
                    membership, created = InterviewGroupMembership.objects.get_or_create(user=request.user, int_group=field.group)
                    membership.user = request.user
                    membership.int_group = field.group
                    membership.percent_involvement = form.cleaned_data['group_%d_pc' % field.group.id]
                    membership.save()
                
            # redirect to interview_group_status
            return HttpResponseRedirect('/group_status/')
        
        # validation errors
        return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'instructions':instructions, 'form': form, 'value':'Continue'}))
    
    
# show a list of user's groups and current status of each
@login_required
def group_status(request):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')

        
    # show list of interview groups with current status (including global interview questions)
    
    title = request.session['interview'].name + ' Status'
       
    qs = InterviewGroupMembership.objects.filter(user=request.user, int_group__in=int_groups).order_by('-percent_involvement')
    num_shapes = None
    # update the user status message for each in-progress group
    for group_memb in qs.all():
    
        if group_memb.status == 'in-progress' and group_memb.int_group.user_draws_shapes:
        
            num_shapes = InterviewShape.objects.filter(user=request.user,int_group=group_memb.int_group).count()
            
            if num_shapes == 0:
                group_memb.user_status_msg = 'no shapes drawn'
                
            else:
                # tally complete and incomplete resource groups
                num_complete_resources = 0
                num_incomplete_resources = 0
                bZeroPennyShapes = False
                
                for resource in group_memb.int_group.resources.all():
                    res_shapes = InterviewShape.objects.filter(user=request.user,int_group=group_memb.int_group,resource=resource)
                    
                    zero_penny_shapes = res_shapes.filter(pennies=0)
                        
                    if zero_penny_shapes.count() > 0:
                        num_incomplete_resources = num_incomplete_resources + 1
                        bZeroPennyShapes = True
                        
                    else:
                        res_count = res_shapes.count()
                        if res_count > 0:
                            res_pennies = res_shapes.aggregate(Sum('pennies'))['pennies__sum']
                            if res_pennies == 100:
                                num_complete_resources = num_complete_resources + 1
                            else:
                                num_incomplete_resources = num_incomplete_resources + 1
                
                num_resources = num_incomplete_resources+num_complete_resources
                group_memb.user_status_msg = '%s/%s resource group(s) complete' % (num_complete_resources,num_resources)

                if bZeroPennyShapes:
                    group_memb.user_status_msg = group_memb.user_status_msg + ', You have shapes with 0 pennies, please allocate or remove them to move on'
                        
                group_memb.num_complete_resources = num_complete_resources
                group_memb.num_incomplete_resources = num_incomplete_resources
                
            group_memb.save()
                        
            
    
    # if user has finalized each of their registered groups, let them finalize their interview
    finalized_groups = InterviewGroupMembership.objects.filter(Q(status='finalized') | Q(status='skipped')).filter(user=request.user, int_group__in=int_groups)
    allow_finalize = qs.count() == finalized_groups.count()
    
    return render_to_response( 'group_status.html', RequestContext(request,{'title':title, 'interview':request.session['interview'], 'object_list':qs, 'allow_finalize':allow_finalize, 'num_shapes':num_shapes}))
    
    
@login_required    
def view_answers(request,group_id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')

        
    # show questions for this group, with any existing user answers
    questions = InterviewQuestion.objects.filter(int_group__pk=group_id,all_resources=False).order_by('question_set', 'display_order')
    answers = InterviewAnswer.objects.filter(user=request.user, int_question__in=questions)
    
    try:
        group = InterviewGroup.objects.get(pk=group_id)
    except ObjectDoesNotExist:
        return render_to_response( '404.html', RequestContext(request,{}))
        
    title = group.name + ' Answered Questions'
    
    return render_to_response( 'view_answers.html', RequestContext(request,{'title':title, 'questions': questions, 'answers':answers}))        
    
    
@login_required    
def answer_questions(request,group_id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')

    try:
        group = InterviewGroup.objects.get(pk=group_id)
    except ObjectDoesNotExist:
        return render_to_response( '404.html', RequestContext(request,{}))
        
    title = group.name + ' Questions'
    
    instructions_qs = InterviewInstructions.objects.filter(int_group__pk=group_id).order_by('-question_set')
    
    instructions = {}
    for instruct in instructions_qs:
        if instruct.question_set == None:
            instructions['main'] = instruct.eng_text
        else:
            instructions[str(instruct.question_set)] = instruct.eng_text

    resource_id = None
    
    questions = InterviewQuestion.objects.filter(int_group__pk=group_id,all_resources=False).order_by('question_set', 'display_order')
    answers = InterviewAnswer.objects.filter(user=request.user, int_question__in=questions)
            
    if request.method == 'GET':
        # show questions for this group, with any existing user answers
        form = AnswerForm(questions, answers, group_id, resource_id)
        
    else:
        # form validation
        form = AnswerForm(questions, answers, group_id, resource_id, request.POST )
        
        if form.is_valid():
        
            # update the group membership status, if necessary
            group_memb = InterviewGroupMembership.objects.filter(user=request.user, int_group__pk=group_id)
            if group_memb.count()==1:
                updated_group = group_memb[0]
                if updated_group.status == 'not yet started':
                    updated_group.date_started = datetime.datetime.now()
                updated_group.status = 'in-progress'
                updated_group.save()
            else: #404
                return render_to_response( '404.html', RequestContext(request,{}))
        
            # create or update InterviewAnswer records
            form.save(request.user)
            
            return HttpResponseRedirect('/group_status/')

    return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'instructions':instructions, 'form': form, 'value':'Continue'}))     
    
    
@login_required
def select_group_resources(request, group_id):
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        interview = request.session['interview']
        status_object_qs = InterviewStatus.objects.filter(interview=interview, user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')
 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')

    try:
        group = InterviewGroup.objects.get(pk=group_id)
        group_memb = InterviewGroupMembership.objects.get(user=request.user, int_group__pk=group_id)
            
    except ObjectDoesNotExist:
        return render_to_response( '404.html', RequestContext(request,{}))

    #Get all resources for current group
    resources = group.resources.all().order_by('name')

    if request.method == 'GET':        
        form = GroupMemberResourceForm(interview, resources)                        
    else:        
        form = GroupMemberResourceForm(interview, resources, request.POST)
        if form.is_valid():
            form.save(group_memb)
            #Store the selected resources
            
            return HttpResponseRedirect('/answer_resource_questions/'+str(group_id)+'/')

    return render_to_response( 'select_group_resources.html', RequestContext(request,{'group':group, 'form': form, 'value':'Continue','interview':request.session['interview']}))     

    
@login_required
def answer_resource_questions(request, group_id, next_url=None):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')
        
    try:
        group = InterviewGroup.objects.get(pk=group_id)
        group_memb = InterviewGroupMembership.objects.get(user=request.user, int_group__pk=group_id )
        sel_resources = GroupMemberResource.objects.filter(group_membership=group_memb)
        
    except ObjectDoesNotExist:
        return render_to_response( '404.html', RequestContext(request,{}))
        
        
    # error checks done, get on with it
    title = group.name + ' Resource Questions'
    
    instructions_qs = InterviewInstructions.objects.filter(int_group__pk=group_id).order_by('-question_set')
    
    instructions = {}
    for instruct in instructions_qs:
        if instruct.question_set == None:
            instructions['main'] = instruct.eng_text
        else:
            instructions[str(instruct.question_set)] = instruct.eng_text
        
    questions = InterviewQuestion.objects.filter(int_group__pk=group_id,all_resources=True).order_by('question_set', 'display_order')
    
    if questions.count() == 0:
        if next_url:
            return HttpResponseRedirect(next_url)
        else:
            return HttpResponseRedirect('/draw_group_shapes/'+str(group_id)+'/')
            
    answers = InterviewAnswer.objects.filter(user=request.user, int_question__in=questions)
    
    forms = {}
        
    if request.method == 'GET':
        
        # show questions for this group, with any existing user answers
        for sel_resource in sel_resources:
            form = AnswerForm( questions, answers, group_id, sel_resource.resource.id )
            forms[sel_resource.resource.name]=form
        
    else:
        # form validation
        forms_valid = True
        for sel_resource in sel_resources:
            form = AnswerForm(questions, answers, group_id, sel_resource.resource.id, request.POST)
            if not form.is_valid():
                forms_valid = False
            forms[sel_resource.resource.name]=form
        
        if forms_valid:
            for name, form in forms.items():
                form.save(request.user)
                
            if next_url:
                return HttpResponseRedirect(next_url)
            else:
                return HttpResponseRedirect('/draw_group_shapes/'+str(group_id)+'/')
        
    return render_to_response( 'base_formset.html', RequestContext(request,{'group':group, 'forms': forms, 'value':'Continue', 'instructions':instructions}))   

    
# start draw shapes for indicated group    
@login_required
def draw_group_shapes(request, group_id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')

    group = InterviewGroup.objects.get(pk=group_id)
    group_memb = InterviewGroupMembership.objects.get(user=request.user, int_group__pk=group_id)
    if group_memb.int_group.user_draws_shapes:
        #Have user select resources if they are required to and haven't yet
        if group.preselect:
            resources = GroupMemberResource.objects.filter(group_membership=group_memb)
            if len(resources) == 0:
                return HttpResponseRedirect('/select_group_resources/'+str(group_id)+'/')
        
        try:
            group = InterviewGroup.objects.get(pk=group_id)
        except ObjectDoesNotExist:
            return render_to_response( '404.html', RequestContext(request,{}))
            
        title = request.session['interview'].name + ' - ' + group.name + ' Group Shape Drawing'
            
        return render_to_response( 'map.html', RequestContext(request, {'title':title, 'GMAPS_API_KEY': settings.GMAPS_API_KEY}))



# user finalizes group
@login_required
def finalize_group(request,id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')
        
        
    if request.method == 'GET':
        # update InterviewGroupMembership record
        try:
            int_group = InterviewGroup.objects.get(pk=id)
        except ObjectDoesNotExist:
            return render_to_response( '404.html', RequestContext(request,{}))
            
        group_memb = InterviewGroupMembership.objects.filter(user=request.user, int_group=int_group)
        
        if group_memb.count() == 1:
        
            # validation based on number of pennies assigned by user
            if int_group.user_draws_shapes:
            
                total_shape_count = 0
                
                for resource in int_group.resources.all():
                    resource_shapes = InterviewShape.objects.filter(user=request.user,int_group=int_group,resource=resource)
                    shape_count = resource_shapes.count()
                    if shape_count > 0:
                        shape_pennies = resource_shapes.aggregate(Sum('pennies'))['pennies__sum']
                    
                        # check if user drew shapes but didn't get pennies to 100
                        if shape_count > 0 and shape_pennies != 100:
                            return HttpResponseRedirect('/group_status/')
                        
                        total_shape_count = total_shape_count + shape_count
                    
                # check if user failed to draw any shapes
                if total_shape_count == 0:
                    return HttpResponseRedirect('/group_status/')
                
            update_memb = group_memb[0]
            update_memb.status = 'finalized'
            update_memb.date_completed = datetime.datetime.now()
            update_memb.save()
            
        else: #404
            return render_to_response( '404.html', RequestContext(request,{}))
        
        # redirect to interview_group_status
        return HttpResponseRedirect('/group_status/')
        
        
# user unfinalizes group
@login_required
def unfinalize_group(request,id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')
        
        
    if request.method == 'GET':
        # update InterviewGroupMembership record
        try:
            int_group = InterviewGroup.objects.get(pk=id)
        except ObjectDoesNotExist:
            return render_to_response( '404.html', RequestContext(request,{}))            
        group_memb = InterviewGroupMembership.objects.filter(user=request.user, int_group=int_group)
        
        if group_memb.count() == 1:
        
            update_memb = group_memb[0]
            update_memb.status = 'in-progress'
            update_memb.save()
            
        else: #404
            return render_to_response( '404.html', RequestContext(request,{}))
        
        # redirect to interview_group_status
        return HttpResponseRedirect('/group_status/')
        
@login_required
def skip_group(request, id):
    try:
        int_group = InterviewGroup.objects.get(pk=id)
    except ObjectDoesNotExist:
        return render_to_response( '404.html', RequestContext(request,{}))            
    group_memb = InterviewGroupMembership.objects.get(user=request.user, int_group=int_group)
    group_memb.opt_out = True
    group_memb.status = 'skipped'
    group_memb.save()
    return HttpResponseRedirect('/group_status/')
        
# user finalizes interview
@login_required
def finalize_interview(request,id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')
        
        
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
    
   
@login_required
def interview_complete(request):

    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

    title = request.session['interview'].name + ' Completed'
    return render_to_response( 'interview_complete.html', RequestContext(request,{'title':title, 'interview':request.session['interview'], 'SELF_SURVEY_RESET':settings.SELF_SURVEY_RESET}))

@login_required
def reset_interview(request, id):
    answers = InterviewAnswer.objects.filter(user=request.user, int_question__int_group__interview__id=id)
    answers.delete()
    shapes = InterviewShape.objects.filter(user=request.user, int_group__interview__id=id)
    shapes.delete()
    group_membs = InterviewGroupMembership.objects.filter(user=request.user, int_group__interview__id=id)
    group_membs.delete()
    survey_status = InterviewStatus.objects.filter(user=request.user, interview__id=id)
    survey_status.delete()
    return HttpResponseRedirect('/')        
    
# client-side usermanager support
def user_client_object(user):
    return {
        'model': 'user',
        'pk': user.pk,
        'name': user.first_name + ' ' + user.last_name,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
    }

@login_required
def GetUser(request):
    if request.user.is_authenticated():
        user = request.user
        retUser = {}
        retUser["name"] = user.first_name + " " + user.last_name
        retUser["email"] = user.email
        retUser["studyRegion"] = {}
        retUser["studyRegion"]["name"] = "California South Coast"
        retUser["studyRegion"]["bounds"] = "-13477376.825366,3752140.84394,-12930699.199147,4134937.481539"
        retUser["pk"] = user.pk
        retUser["username"] = user.username
        retUser['is_staff'] = user.is_staff
        retUser['user'] = user_client_object(user)
    
        return HttpResponse(geojson_encode(retUser), mimetype='text/javascript')
    else:
        return HttpResponseBadRequest('user is not authenticated')
        
        
def add_child(client_object, child):
    if not 'display_properties' in client_object:
        client_object['display_properties'] = {'children': []}
    elif not 'children' in client_object['display_properties']:
        client_object['display_properties']['children'] = []
    client_object['display_properties']['children'].append(child)
    
        
def create_folder(name, open=False, visibility=True, collapsible=True, toggle=True, hideByDefault=False, pk=None, description=None, context=False, model="folder", doubleclick=False):
    return {
        'model': model, 
        'name': name,
        'display_properties': {
            'open': open, 
            'visibility': visibility,
            'children': [],
            'collapsible': True,
            'toggle': toggle,
            'hideByDefault': hideByDefault,
            'description': description,
            'context': context,
            'doubleclick': doubleclick
        },
        'pk': pk
    }

def create_superfolder(name, icon=None, id=None, description=None):
    obj = create_folder(name, open=True, visibility=True, collapsible=False, description=description)
    obj['display_properties']['collapsible'] = False
    if icon:
        obj['display_properties']['icon'] = icon
    obj['display_properties']['toggle'] = False
    obj['pk'] = id
    obj['display_properties']['classname'] = 'marinemap-tree-category'
    return obj
        
def user_features_client_object(user,interview):
    folder = create_superfolder('<b>Right click on a '+interview.resource_name_plural+' to start drawing</b>', icon=settings.MEDIA_URL+'images/silk/icons/status_online.png', id="userFeatures")
    
    int_groups = InterviewGroup.objects.filter(interview=interview,user_draws_shapes=True)
    int_group_membs = InterviewGroupMembership.objects.filter(user=user, int_group__in=int_groups).exclude(status='not yet started').exclude(status='skipped').order_by('-percent_involvement')
    
    for int_group_memb in int_group_membs.all():
        int_group = int_group_memb.int_group
        group_folder_name = int_group.name + ' (' + int_group_memb.status + ')'
        group = create_folder(group_folder_name, pk=int_group.id, toggle=True, context=True)
        
        memb_resources = GroupMemberResource.objects.filter(group_membership=int_group_memb)
        resources = [mr.resource for mr in memb_resources]
        for resource in resources:
            resource_shapes = InterviewShape.objects.filter(user=user,int_group=int_group,resource=resource)
            resource_pennies = resource_shapes.aggregate(Sum('pennies'))['pennies__sum']
            if resource_pennies == None:
                resource_pennies = 0
            if resource_pennies == 100:
                folderName = resource.name+' (complete)'
            else:
                folderName = resource.name+' ('+str(100-resource_pennies)+' pennies left)'
            mpas = create_folder(folderName, pk=str(int_group.id)+'-'+str(resource.id), toggle=True, context=True)
            for mpa in resource_shapes:
                add_child(mpas, mpa.client_object())
            add_child(group,mpas)
        add_child(folder,group)
    return folder
    
@login_required
def get_user_shapes(request):
    data = {}
    u = request.user
    interview = request.session['interview']
    data['user'] = ( user_client_object(u), )
    data['me'] = {
        'model': 'user',
        'pk': u.pk,
        'name': u.first_name + ' ' + u.last_name,
        'username': u.username,
        'email': u.email,
    }
    data['features'] = ( user_features_client_object(u,interview), )
    return HttpResponse(geojson_encode(data), mimetype='application/json')
    
    
@login_required
def get_shape(request,id):
    shape = InterviewShape.objects.filter(pk=id)
    return HttpResponse(shape[0].geojson(), mimetype='application/json')
    
    
# AJAX post to validate a shape     
@login_required
def validate_shape(request):

    result = '{"status_code":"-1",  "success":"false",  "message":"disallowed"}'
    
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponse(result, status=403)

    # see if the interview has been marked complete
    if status.completed:
        return HttpResponse(result, status=403)


    # validate indicated group, resource
    result = '{"status_code":"-1",  "success":"false",  "message":"error in validate_shape in views.py"}'

    try:    
        # validate against this user's other shapes in this resource
        new_geom = GEOSGeometry( request.REQUEST["geometry"], srid=900913 )
        new_geom.transform( 3310 )
        
        if request.REQUEST.get("orig_shape_id"):
            orig_shape = InterviewShape.objects.get(pk=request.REQUEST.get("orig_shape_id"))
            int_group_id = orig_shape.int_group.id
            resource_id = orig_shape.resource.id
        else:
            int_group_id, resource_id = request.REQUEST['resource'].split('-')
        
        other_shapes = InterviewShape.objects.filter(user=request.user,int_group__id=int_group_id,resource__id=resource_id)
        
        if request.REQUEST.get("orig_shape_id"):
            other_shapes = other_shapes.exclude(pk=request.REQUEST["orig_shape_id"])

        for i, shape in enumerate( other_shapes.all() ):
            if new_geom.intersects( shape.geometry_clipped ):
                result = '{"status_code":"6","message":"New geometry overlaps existing shapes"}'
                return HttpResponse(result)

        m = InterviewShape(geometry=request.REQUEST["geometry"])
        result = m.validate()
    except Exception, e:
        return HttpResponse(result + e.message, status=500)
    return HttpResponse(result)
 
    
# AJAX post that user accepted clipped shape    
@login_required
def save_shape(request):

    result = '{"status_code":"-1",  "success":"false",  "message":"disallowed"}'
    
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponse(result, status=403)

    # see if the interview has been marked complete
    if status.completed:
        return HttpResponse(result, status=403)
        

    result = '{"status_code":"-1",  "success":"false",  "message":"error in save_shape in views.py"}'
    try:
        new_shape = InterviewShape()
        new_shape.user = request.user
        
        geom = GEOSGeometry(request.REQUEST['geometry'], srid=900913)
        geom.transform(3310)
        new_shape.geometry = geom
        
        geom_clipped = GEOSGeometry(request.REQUEST['geometry_clipped'], srid=900913)
        geom_clipped.transform(3310)
        new_shape.geometry_clipped = geom_clipped
        
        int_group_id, resource_id = request.REQUEST['resource'].split('-')
        new_shape.int_group_id = int(int_group_id)
        new_shape.resource_id = int(resource_id)
        new_shape.save() 
        
        result = '{"status_code":"1",  "success":"true", "message":"mpa saved successfully"'
        result = new_shape.json()
        
        # check the status of the interview group membership for this shape and unfinalize it if necessary
        group_memb = InterviewGroupMembership.objects.get(user=request.user,int_group=int_group_id)
        if group_memb.status == 'finalized':
            group_memb.status = 'in-progress'
            group_memb.save()
            
    except Exception, e:
        return HttpResponse(result + e.message, status=500)
    return HttpResponse(result)

    
    
# AJAX delete handler
@login_required
def delete_shape(request,id):

    result = '{"status_code":"-1",  "success":"false",  "message":"disallowed"}'
    
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponse(result, status=403)

    # see if the interview has been marked complete
    if status.completed:
        return HttpResponse(result, status=403)
        

    shape = InterviewShape.objects.filter(pk=id)
    if shape.count() == 1 and shape[0].user == request.user:
        msg = 'Shape %s deleted.' % (id, )
        shape[0].delete()
    else:
        msg = 'Not authorized.'
        
    return HttpResponse(msg)  

    
    
def copy_shape(request):
    
    result = '{"status_code":"-1",  "success":"false",  "message":"disallowed"}'
    
    source_id = request.REQUEST.get('source')
        
    target = request.REQUEST.get('target')
    target_group_id, target_resource_id = target.split('-')
    target_resource = Resource.objects.get(pk=target_resource_id)
    target_group = InterviewGroup.objects.get(pk=target_group_id)
    
    shape = InterviewShape.objects.filter(pk=source_id)
    
    if shape.count() == 1 and shape[0].user == request.user:
    
        if target_group == shape[0].int_group and target_resource == shape[0].resource:
            return HttpResponse(result, status=420)
            
        other_shapes = InterviewShape.objects.filter(user=request.user,int_group=target_group,resource=target_resource)
        
        for test_shape in other_shapes.all():
            if shape[0].geometry_clipped.intersects( test_shape.geometry_clipped ):
                return HttpResponse(result, status=421)
        
        copy = shape[0].copy()
        copy.int_group = target_group
        copy.resource = target_resource
        
        # do not copy pennies on single-shape copies
        copy.pennies = 0;
                
        copy.save()
        
        new_copy = []
        new_copy.append( copy.json() )
        
        response = '{"type": "FeatureCollection", "features": [%s]}' % ( ','.join(new_copy), )
        return HttpResponse(response, mimetype='application/json')
    else:
        return HttpResponseForbidden(
            'You cannot copy shapes you do not have access to.')


# AJAX copy handler
@login_required
def copy_shapes(request):

    result = '{"status_code":"-1",  "success":"false",  "message":"disallowed"}'
    
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponse(result, status=403)

    # see if the interview has been marked complete
    if status.completed:
        return HttpResponse(result, status=403)
        
    if request.REQUEST.get('source_type') == 'shape':
        return copy_shape(request)

    target = request.REQUEST.get('target')
    target_group_id, target_resource_id  = target.split('-')
    target_resource = Resource.objects.get(pk=target_resource_id)
    target_group = InterviewGroup.objects.get(pk=target_group_id)
    
    source = request.REQUEST.get('source')
    source_group_id, source_resource_id = source.split('-')
    
    if target_group_id == source_group_id and target_resource_id == source_resource_id:
        return HttpResponse(result, status=403)
    
    copy_shapes = InterviewShape.objects.filter(user=request.user,resource=source_resource_id,int_group=source_group_id)
    
    new_copies = []
    if copy_shapes.count() > 0:
    
        # check for overlap issues before proceeding
        other_shapes = InterviewShape.objects.filter(user=request.user,int_group=target_group,resource=target_resource)
    
        for shape in copy_shapes.all():
            for test_shape in other_shapes.all():
                if shape.geometry_clipped.intersects( test_shape.geometry_clipped ):
                    return HttpResponse(result, status=421)
    
        # if the target group already has any pennies assigned, don't bring a copied groups pennies
        resource_shapes = InterviewShape.objects.filter(user=request.user,int_group=target_group,resource=target_resource)
        resource_agg = resource_shapes.aggregate(Sum('pennies'))
          
        for shape in copy_shapes.all():
        
            copy = shape.copy()
            copy.int_group = target_group
            copy.resource = target_resource
            
            copy.pennies = 0
            
            copy.save()
            new_copies.append( copy.json() )
        
        response = '{"type": "FeatureCollection", "features": [%s]}' % ( ','.join(new_copies), )
        
        return HttpResponse(response, mimetype='application/json')
    else:
        return HttpResponseForbidden(
            'You cannot copy shapes you do not have access to.')
   
    
    
# AJAX interview shape attribute form processing
@login_required
def edit_shape(request,id):

    result = '{"status_code":"-1",  "success":"false",  "message":"disallowed"}'
    
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponse(result, status=403)

    # see if the interview has been marked complete
    if status.completed:
        return HttpResponse(result, status=403)

    instructions = {}
    instructions['main'] = 'Enter the number of pennies for this shape, and any boundary descriptions that could help to make the shape more accurate.'

    shape = InterviewShape.objects.filter(pk=id,user=request.user)
    if shape.count() == 1:
        action = "/gwst/shape/edit/"+str(shape[0].pk)
        if request.method == 'GET':
            form = InterviewShapeAttributeForm( instance=shape[0] )
            
            t = loader.get_template('base_form.html')
            opts = {
                'form': form,
                'action': action,
                'value': 'Save',
                'instructions': instructions
            }
            return HttpResponse(t.render(RequestContext(request, opts )))
            
        else:
            form = InterviewShapeAttributeForm( request.POST )
            
            # calculate how many pennies are already assigned in this group and attach it to form before validation
            group_pennies = InterviewShape.objects.filter(user=request.user,int_group=shape[0].int_group,resource=shape[0].resource).aggregate(Sum('pennies'))
            form.group_pennies = group_pennies['pennies__sum'] - shape[0].pennies
            
            #form.fields['resource'].queryset = Resource.objects.filter(interviewgroup=shape[0].int_group)
            if form.is_valid(): 
                edit_shape = shape[0]
                edit_shape.pennies = form.cleaned_data['pennies']
                edit_shape.boundary_n = form.cleaned_data['boundary_n']
                edit_shape.boundary_s = form.cleaned_data['boundary_s']
                edit_shape.boundary_e = form.cleaned_data['boundary_e']
                edit_shape.boundary_w = form.cleaned_data['boundary_w']
                #edit_shape.resource = form.cleaned_data['resource']
                edit_shape.last_modified = datetime.datetime.now()
                edit_shape.num_times_saved = edit_shape.num_times_saved + 1
                edit_shape.save()
                
                # check the status of the interview group membership for this shape and unfinalize it if necessary
                group_memb = InterviewGroupMembership.objects.get(user=request.user,int_group=edit_shape.int_group)
                if group_memb.status == 'finalized':
                    group_memb.status = 'in-progress'
                    group_memb.save()
                
                return HttpResponse(edit_shape.json(), mimetype='application/json')
                
            else:
                t = loader.get_template('base_form.html')
                opts = {
                    'form': form,
                    'action': action,
                    'value': 'Save',
                    'instructions': instructions
                }
                return HttpResponseBadRequest(t.render(RequestContext(request, opts )))
            
    else:
        # forbidden
        return HttpResponse(result, status=403)

 
# AJAX edit geometry handler 
@login_required
def editgeom_shape(request,id):

    result = '{"status_code":"-1",  "success":"false",  "message":"disallowed"}'
    
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.user)

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponse(result, status=403)

    # see if the interview has been marked complete
    if status.completed:
        return HttpResponse(result, status=403)



    result = '{"status_code":"-1",  "success":"false",  "message":"error in editgeom_shape in views.py"}'
    try:
        edit_shape = InterviewShape.objects.get(pk=id)
        
        geom = GEOSGeometry(request.REQUEST['geometry'], srid=900913)
        geom.transform(3310)
        edit_shape.geometry = geom
        
        geom_clipped = GEOSGeometry(request.REQUEST['geometry_clipped'], srid=900913)
        geom_clipped.transform(3310)
        edit_shape.geometry_clipped = geom_clipped
        
        edit_shape.save() 
        result = '{"status_code":"1",  "success":"true", "message":"mpa saved successfully"'
        result = edit_shape.json()
    except Exception, e:
        return HttpResponse(result + e.message, status=500)
    return HttpResponse(result)

    
@login_required
def draw_help_text(request):
    return render_to_response( 'draw_help_text.html', RequestContext(request,{})) 
    
    
@login_required
def draw_splash(request):
    interview = request.session.get('interview')
    if interview:
        return render_to_response( 'content_template.html', RequestContext(request,{'content':interview.draw_shape_text})) 
    else:
        return HttpResponseRedirect('/select_interview/')
def faq(request):
    faq_groups = FaqGroup.objects.all()
    faqs_by_group = []
    #Build an faq list by group, then by faq.  order them by importance
    for group in faq_groups:
        faq_query = Faq.objects.filter(faq_group__faq_group_name=group.faq_group_name).order_by('importance')
        faqs_by_group.append({'group_obj':group,'group_faqs':faq_query})
    return render_to_response('faq.html', {'faqs_by_group':faqs_by_group}, context_instance=RequestContext(request)) 

def video(request, name):
    import string
    video = {
        'player':settings.MEDIA_URL+'video_player/player.swf',
        'file':settings.MEDIA_URL+'videos/'+str(name)+'.flv',
        'title':string.capwords(name.replace('_',' '))
    }
    return render_to_response('demo_video.html', {'video':video}, context_instance=RequestContext(request)) 
