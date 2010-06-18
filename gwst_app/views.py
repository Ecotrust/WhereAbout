from django.shortcuts import get_object_or_404
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext, loader
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest, HttpResponseNotFound
from models import *
from forms import *
from gwst_app.utils.geojson_encode import *
from django.db.models import Sum
from shortcuts import render_to_geojson
from django.contrib.auth.models import User
import datetime

#Pass extra settings around whether user can self-register
def login(request, template_name='registration/login.html'):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/select_interview/')
    request.user.SELF_REGISTRATION = settings.SELF_REGISTRATION
    from django.contrib.auth.views import login as default_login
    return default_login(request, template_name)
    
   
''' 
Admin tool allowing staff user to set the interviewee user and proceed with interview with their credentials 
'''
@login_required
def login_as(request):
    if request.user.is_authenticated() and request.user.is_staff:
        next_user_str = request.REQUEST.get('next_user', '')
        if next_user_str:
            next_user_obj = get_object_or_404(User,pk=next_user_str)
            request.session['interviewee'] = next_user_obj
            return HttpResponseRedirect('/select_interview/')
			
    return HttpResponseRedirect('/accounts/login/')

    
def handleSelectInterview(request,selected_interview):
    request.session['interview'] = selected_interview
    
    status_object_qs = InterviewStatus.objects.filter(interview=selected_interview, user=request.session['interviewee'])
            
    if status_object_qs.count() == 0: # no InterviewStatus record exists?
        # create InterviewStatus record
        status = InterviewStatus()
        status.user = request.session['interviewee']
        status.interview = selected_interview
        status.first_login = datetime.datetime.today()
        status.last_login = datetime.datetime.today()
        status.num_logins = 1
        status.save()
        
        # create group records for any required groups
        # required_groups = InterviewGroup.objects.filter(interview=selected_interview, required_group=True)
        all_groups = InterviewGroup.objects.filter(interview=selected_interview)
        
        #for group in required_groups:
        for group in all_groups:
            
            membership, created = InterviewGroupMembership.objects.get_or_create(user=request.session['interviewee'], int_group=group)
            membership.user = request.session['interviewee']
            membership.int_group = group
            if (group.required_group == True) :
                if (group.name != 'Main Questions'):
                    membership.percent_involvement = 0
                else :
                    membership.percent_involvement = 101
            else:
                membership.percent_involvement = 50
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
        num_group_membs = InterviewGroupMembership.objects.filter(user=request.session['interviewee'], int_group__in=int_groups).count()
        
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

    # Post-login checking to make sure a properly-authorized interviewee is set in the session
    # If user came via login-as, interviewee should be set, and request.user should be a staff user
    # otherwise user came from login, and interviewee _must_ be set to the request.user.
    try:
        if request.session['interviewee'] != request.user:
            if not request.user.is_staff:
                request.session['interviewee'] = request.user
    except KeyError: # request.session['interviewee'] is not set yet -- standard handling for normal login
        request.session['interviewee'] = request.user
        
    # From here on, we use request.session['interviewee'] for all interview record resolution for the 
    # remainder of the interview.
    
    if request.session['interviewee'].is_staff:
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
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

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
        groups = InterviewGroup.objects.filter(interview=interview,is_user_group=True)
        
        form = SelectInterviewGroupsForm( groups)
        
        if groups.count() == 1:
            group = groups[0]
                    
            membership, created = InterviewGroupMembership.objects.get_or_create(user=request.session['interviewee'], int_group=group)
            membership.user = request.session['interviewee']
            membership.int_group = group
            membership.percent_involvement = 100 #form.cleaned_data['group_%s_pc' % field.group.id]
            membership.order = 5
            membership.save()
                
            qs = InterviewGroupMembership.objects.all()
            for q in qs:
                if q.int_group_id == 9:
                    q.order = 1000 
                    q.save()
                else:
                    q.order = 0
                    q.save()
                
            # redirect to interview_group_status
            return HttpResponseRedirect('/group_status/')
            
        if groups.count() == 0:
            qs = InterviewGroupMembership.objects.all()
            for q in qs:
                if q.int_group_id == 9:
                    q.order = 1000 
                    q.save()
                else:
                    q.order = 0
                    q.save()
                
            # redirect to interview_group_status
            return HttpResponseRedirect('/group_status/')
        
        
        return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'interview':request.session['interview'], 'form': form, 'instructions':instructions, 'value':'Continue', 'q_width':265}))
        
    else:
        groups = InterviewGroup.objects.filter(interview=request.session['interview'],required_group=False)

        form = SelectInterviewGroupsForm( groups, request.POST )
        
        if form.is_valid():       
            # save InterviewGroupMembership records
            for field_name in form.fields:
                field = form.fields[field_name]
                
                if field.group and (form.cleaned_data['group_%s_pc' % field.group.id] > 0 or field.group.is_user_group == False):
                    if (field.group.name != 'Socio-Economic Questions'):
                        membership, created = InterviewGroupMembership.objects.get_or_create(user=request.session['interviewee'], int_group=field.group)
                        membership.user = request.session['interviewee']
                        membership.int_group = field.group
                        membership.percent_involvement = form.cleaned_data['group_%s_pc' % field.group.id]
                        membership.order = 5
                        membership.save()
            
            qs = InterviewGroupMembership.objects.all()
            for q in qs:
                if q.int_group_id == 9:
                    q.order = 1000 
                    q.save()
                else:
                    q.order = 0
                    q.save()
                
            # redirect to interview_group_status
            return HttpResponseRedirect('/group_status/')
        
        
        # validation errors        
        return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'instructions':instructions, 'form': SelectInterviewGroupsForm( InterviewGroup.objects.filter(interview=interview,is_user_group=True), request.POST ), 'value':'Continue', 'q_width':265}))
    
    
# show a list of user's groups and current status of each
@login_required
def group_status(request):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')

        
    # show list of interview groups with current status (including global interview questions)
    
    title = request.session['interview'].name + ' Status'
       
    qs = InterviewGroupMembership.objects.filter(user=request.session['interviewee'], int_group__in=int_groups).order_by('order','-percent_involvement','int_group')
    
    num_shapes = None
    # update the user status message for each in-progress group
    
    current_group = InterviewGroupMembership.objects.get_current_group(request.session['interviewee'], request.session['interview'])    
    result = []
    
    for group_memb in qs.all(): 
        if current_group and (group_memb.int_group == current_group.int_group):
            result.append({'current':True, 'group_memb':group_memb})
        else:
            result.append({'current':False, 'group_memb':group_memb})
            
        #if current group has drawing and is 'in-progress'
        if group_memb.status == 'in-progress' and group_memb.int_group.user_draws_shapes:
            #'num shapes' is how many have been drawn
            num_shapes = InterviewShape.objects.filter(user=request.session['interviewee'],int_group=group_memb.int_group).count()
            
            shape_name_plural = request.session['interview'].shape_name_plural
            resource_name = request.session['interview'].resource_name
            if num_shapes == 0:
                group_memb.user_status_msg = 'no '+shape_name_plural+' drawn'
                
            else:
                # tally complete and incomplete resource groups
                num_complete_resources = 0
                num_incomplete_resources = 0
                bZeroPennyShapes = False
                # iterate through all resources currently checked
                for resource in GroupMemberResource.objects.filter(group_membership=group_memb.id):
                    #find shapes for each
                    res_shapes = InterviewShape.objects.filter(user=request.session['interviewee'],int_group=group_memb.int_group,resource=resource.resource)
                    zero_penny_shapes = res_shapes.filter(pennies=0)
                        
                    #find any shapes with no pennies and count resource as incomplete
                    if zero_penny_shapes.count() > 0:
                        num_incomplete_resources = num_incomplete_resources + 1
                        bZeroPennyShapes = True
                    else:
                        # all shapes have pennies
                        res_count = res_shapes.count()
                        if res_count > 0:
                            # existing shapes found for selected resource
                            res_pennies = res_shapes.aggregate(Sum('pennies'))['pennies__sum']
                            if res_pennies == 100:
                                # 100/100 pennies alotted, count 1 resource complete
                                num_complete_resources = num_complete_resources + 1
                            else:
                                # <100 pennies alotted, resource incomplete
                                num_incomplete_resources = num_incomplete_resources + 1
                        else:
                            # No shapes drawn for selected resource
                            num_incomplete_resources = num_incomplete_resources + 1
                
                # calculate completion of total resources selected
                num_resources = num_incomplete_resources+num_complete_resources
                group_memb.user_status_msg = '%s/%s %s group(s) complete' % (num_complete_resources,num_resources,resource_name)

                if bZeroPennyShapes:
                    group_memb.user_status_msg = group_memb.user_status_msg + ', you have '+shape_name_plural+' with 0 pennies, please allocate or remove them to move on'
                        
                group_memb.num_complete_resources = num_complete_resources
                group_memb.num_incomplete_resources = num_incomplete_resources
                
        group_memb.save() 

    # if user has finalized each of their registered groups, let them finalize their interview
    finalized_groups = InterviewGroupMembership.objects.filter(Q(status='finalized') | Q(status='skipped')).filter(user=request.session['interviewee'], int_group__in=int_groups)
    allow_finalize = qs.count() == finalized_groups.count()

    return render_to_response( 'group_status.html', RequestContext(request,{'title':title, 'interview':request.session['interview'], 'result':result, 'allow_finalize':allow_finalize, 'num_shapes':num_shapes}))
    
@login_required    
def view_answers(request,group_id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')

        
    # show questions for this group, with any existing user answers
    questions = InterviewQuestion.objects.filter(int_group__pk=group_id,all_resources=False).order_by('question_set', 'display_order')
    answers = InterviewAnswer.objects.filter(user=request.session['interviewee'], int_question__in=questions)
    
    try:
        group = InterviewGroup.objects.get(pk=group_id)
    except ObjectDoesNotExist:
        return render_to_response( '404.html', RequestContext(request,{}))
        
    title = group.name + ' Answered Questions'
    
    q_width = group.question_width
    
    return render_to_response( 'view_answers.html', RequestContext(request,{'title':title, 'questions': questions, 'answers':answers, 'q_width':q_width}))        
        
@login_required    
def answer_questions(request,group_id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

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
    answers = InterviewAnswer.objects.filter(user=request.session['interviewee'], int_question__in=questions)
            
    if request.method == 'GET':
        # show questions for this group, with any existing user answers
        form = AnswerForm(questions, answers, group_id, resource_id)
        
    else:
        # form validation
        form = AnswerForm(questions, answers, group_id, resource_id, request.POST )
        if form.is_valid():
            # update the group membership status, if necessary
            group_memb = InterviewGroupMembership.objects.filter(user=request.session['interviewee'], int_group__pk=group_id)
            if group_memb.count()==1:
                updated_group = group_memb[0]
                if updated_group.status == 'not yet started':
                    updated_group.date_started = datetime.datetime.now()
                    if updated_group.int_group.user_draws_shapes:
                        updated_group.status = 'selecting resources'
                    else:
                        updated_group.status = 'in-progress'
                updated_group.save()
            else: #404
                return render_to_response( '404.html', RequestContext(request,{}))
        
            # create or update InterviewAnswer records
            form.save(request.session['interviewee'])
            
            return HttpResponseRedirect('/group_status#main_menu')
            
    q_width = group.question_width
    return render_to_response( group.page_template, RequestContext(request,{'title':title, 'instructions':instructions, 'form': form, 'value':'Continue', 'q_width':q_width}))     
    

@login_required
def select_group_resources(request, group_id):
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        interview = request.session['interview']
        status_object_qs = InterviewStatus.objects.filter(interview=interview, user=request.session['interviewee'])

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')
 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')

    try:
        group = InterviewGroup.objects.get(pk=group_id)
        group_memb = InterviewGroupMembership.objects.get(user=request.session['interviewee'], int_group__pk=group_id)
            
    except ObjectDoesNotExist:
        return render_to_response( '404.html', RequestContext(request,{}))

    #Get all resources for current group
    resources = group.resources.all().order_by('name')

    if request.method == 'GET':        
        resource_list = []
        for resource in GroupMemberResource.objects.filter(group_membership=group_memb):
            resource_list.append(resource.resource_id);
        if resource_list == []:
            form = GroupMemberResourceForm(interview, resources) 
        else:
            form = GroupMemberResourceForm(interview, resources, {'resources':resource_list})
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
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')
        
    try:
        group = InterviewGroup.objects.get(pk=group_id)
        group_memb = InterviewGroupMembership.objects.get(user=request.session['interviewee'], int_group__pk=group_id )
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
            return HttpResponseRedirect('/group_status#main_menu')
            
    answers = InterviewAnswer.objects.filter(user=request.session['interviewee'], int_question__in=questions)
    
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
            group_memb = InterviewGroupMembership.objects.filter(user=request.session['interviewee'], int_group__pk=group_id)
            if group_memb.count()==1:
                updated_group = group_memb[0]
                if updated_group.status == 'selecting resources':
                    updated_group.date_started = datetime.datetime.now()
                    updated_group.status = 'in-progress'
                updated_group.save()
            else: #404
                return render_to_response( '404.html', RequestContext(request,{}))
            for name, form in forms.items():
                form.save(request.session['interviewee'])
                
            if next_url:
                return HttpResponseRedirect(next_url)
            else:
                return HttpResponseRedirect('/group_status#main_menu')
        
    return render_to_response( 'base_formset.html', RequestContext(request,{'group':group, 'forms': forms, 'value':'Continue', 'instructions':instructions, 'q_width':165}))   

@login_required
def draw_group_resources(request, group_id):
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')
        
    # see if the drawing overview has been shown
    
    if not status.overview_completed:
        # redirect to overview
        return HttpResponseRedirect('/draw_overview/'+str(group_id)+'/')

    group = InterviewGroup.objects.get(pk=group_id)
    group_memb = InterviewGroupMembership.objects.get(user=request.session['interviewee'], int_group__pk=group_id)
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
        
        if settings.DESKTOP_BUILD:
            return render_to_response( 'draw_group_resources_desktop.html', RequestContext(request, {'title':title, 'group_id':group_id,  'group_name':group.name, 'GMAPS_API_KEY': settings.GMAPS_API_KEY}))
        else:
            return render_to_response( 'draw_group_resources.html', RequestContext(request, {'title':title, 'group_id':group_id,  'group_name':group.name, 'GMAPS_API_KEY': settings.GMAPS_API_KEY}))
            
# start draw shapes quick tutorial   
@login_required
def draw_overview(request, group_id):

    if request.method == 'POST':
        # return HttpResponseRedirect('/penny_overview/'+str(group_id)+'/')
        interview = InterviewStatus.objects.get(user=request.session['interviewee'], interview=request.session['interview'])
        interview.overview_completed = True
        interview.save()
        return HttpResponseRedirect('/draw_group_resources/'+str(group_id)+'/')
    return render_to_response( 'draw_overview.html', RequestContext(request,{'interview':request.session['interview']})) 
    
# start drop penny quick tutorial 
@login_required
def penny_overview(request, group_id):

    if request.method == 'POST':
        #update status to reflect that this overview has been seen
        interview = InterviewStatus.objects.get(user=request.session['interviewee'], interview=request.session['interview'])
        interview.overview_completed = True
        interview.save()
        return HttpResponseRedirect('/draw_group_resources/'+str(group_id)+'/')
    return render_to_response( 'penny_overview.html', RequestContext(request))   

# user finalizes group
@login_required
def finalize_group(request,id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

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
            
        group_memb = InterviewGroupMembership.objects.filter(user=request.session['interviewee'], int_group=int_group)
        if group_memb.count() == 1:
        
            # validation based on number of pennies assigned by user
            if int_group.user_draws_shapes:
            
                total_shape_count = 0
                
                for resource in int_group.resources.all():
                    resource_shapes = InterviewShape.objects.filter(user=request.session['interviewee'],int_group=int_group,resource=resource)
                    shape_count = resource_shapes.count()
                    if shape_count > 0:
                        shape_pennies = resource_shapes.aggregate(Sum('pennies'))['pennies__sum']
                    
                        # check if user drew shapes but didn't get pennies to 100
                        if shape_count > 0 and shape_pennies != 100:
                            return HttpResponseRedirect('/group_status#main_menu')
                        
                        total_shape_count = total_shape_count + shape_count
                    
                # check if user failed to draw any shapes
                if total_shape_count == 0:
                    return HttpResponseRedirect('/group_status#main_menu')
                
            update_memb = group_memb[0]
            update_memb.status = 'finalized'
            update_memb.date_completed = datetime.datetime.now()
            update_memb.save()
            
        else: #404
            return render_to_response( '404.html', RequestContext(request,{}))
        
        # redirect to interview_group_status
        return HttpResponseRedirect('/group_status#main_menu')
        
# user skips unfinished resources if at least one is finished and finalizes group
@login_required
def skip_res_finalize_group(request,id):        
        
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

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
            
        group_memb = InterviewGroupMembership.objects.filter(user=request.session['interviewee'], int_group=int_group)
        if group_memb.count() == 1:
        
            # validation based on number of pennies assigned by user
            if int_group.user_draws_shapes:
            
                total_shape_count = 0
                
                for resource in int_group.resources.all():
                    resource_shapes = InterviewShape.objects.filter(user=request.session['interviewee'],int_group=int_group,resource=resource)
                    shape_count = resource_shapes.count()
                    if shape_count > 0:
                        shape_pennies = resource_shapes.aggregate(Sum('pennies'))['pennies__sum']
                    
                        # check if user drew shapes but didn't get pennies to 100
                        if shape_count > 0 and shape_pennies != 100:
                            resource_shapes.delete()
                        else: 
                            total_shape_count = total_shape_count + shape_count
                    
                # check if user failed to draw any shapes
                if total_shape_count == 0:
                    return HttpResponseRedirect('/group_status#main_menu')
                
            update_memb = group_memb[0]
            update_memb.status = 'finalized'
            update_memb.date_completed = datetime.datetime.now()
            update_memb.save()
            
        else: #404
            return render_to_response( '404.html', RequestContext(request,{}))
        
        # redirect to interview_group_status
        return HttpResponseRedirect('/group_status#main_menu')        
        
# user unfinalizes group
@login_required
def unfinalize_group(request,id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

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
        group_memb = InterviewGroupMembership.objects.filter(user=request.session['interviewee'], int_group=int_group)
        
        if group_memb.count() == 1:
        
            update_memb = group_memb[0]
            update_memb.status = 'in-progress'
            update_memb.save()
            
        else: #404
            return render_to_response( '404.html', RequestContext(request,{}))
        
        # redirect to interview_group_status
        return HttpResponseRedirect('/group_status#main_menu')
     
@login_required
def skip_group(request, id):
    try:
        int_group = InterviewGroup.objects.get(pk=id)
    except ObjectDoesNotExist:
        return render_to_response( '404.html', RequestContext(request,{}))            
    group_memb = InterviewGroupMembership.objects.get(user=request.session['interviewee'], int_group=int_group)
    group_memb.opt_out = True
    group_memb.status = 'skipped'
    group_memb.save()
    return HttpResponseRedirect('/group_status#main_menu')
        
# user finalizes interview
@login_required
def finalize_interview(request,id):

    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])

        status = status_object_qs[0]
        
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

 
    # see if the interview has been marked complete
    if status.completed:
        # redirect to interview_complete
        return HttpResponseRedirect('/interview_complete/')
        
        
    if request.method == 'GET':

        # make sure this interview is the current one for this user session
        if str(id) == request.session['interview'].id:
            # get the interviewstatus object
            int_status = InterviewStatus.objects.get(user=request.session['interviewee'],interview=id)
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
    answers = InterviewAnswer.objects.filter(user=request.session['interviewee'], int_question__int_group__interview__id=id)
    answers.delete()
    shapes = InterviewShape.objects.filter(user=request.session['interviewee'], int_group__interview__id=id)
    shapes.delete()
    group_membs = InterviewGroupMembership.objects.filter(user=request.session['interviewee'], int_group__interview__id=id)
    group_membs.delete()
    survey_status = InterviewStatus.objects.filter(user=request.session['interviewee'], interview__id=id)
    survey_status.delete()
    return HttpResponseRedirect('/')        

@login_required
def draw_settings(request, id) :
    interview = request.session['interview']
    int_group = InterviewGroup.objects.get(pk=id)
    group_memb = InterviewGroupMembership.objects.get(user=request.session['interviewee'], int_group__pk=id )
    
    #extract info on users selected resources including whether they are finished or not
    resources = Resource.objects.filter(groupmemberresource__group_membership=group_memb)
    res_list = [];
    finished = False
    for res in resources:
        res_item = {}
        res_item['id'] = res.id
        res_item['name'] = res.name

        res_item['started'] = False
        res_item['finished'] = False
        
        resource_shapes = InterviewShape.objects.filter(user=request.session['interviewee'],int_group=int_group,resource=res)        
        if resource_shapes and len(resource_shapes) > 0:
            res_item['started'] = True
        
        if res_item['started'] == True:
            resource_pennies = resource_shapes.aggregate(Sum('pennies'))['pennies__sum']
            zero_penny_shapes = resource_shapes.filter(pennies=0)                        
            if resource_pennies == 100 and zero_penny_shapes.count() == 0 and resource_shapes.filter(pennies=0).count() == 0:
                res_item['finished'] = True        
            
        res_list.append(res_item)

    result = {}      
    #User settings
    result['user'] = {
        'name': request.session['interviewee'].first_name+" "+request.session['interviewee'].last_name,
        'email': request.session['interviewee'].email,
        'username': request.session['interviewee'].username,
        'is_staff': request.user.is_staff # maybe the one time we want to use request.user instead of session interviewee -- send is_staff if logged in user is staff
    }     
    #Interview settings
    result['interview'] = {
		'resource_name': interview.resource_name,
	    'resource_name_plural': interview.resource_name_plural,
    	'resource_action': interview.resource_action,
        'shape_name_plural': interview.shape_name_plural,
        'shape_name': interview.shape_name
    }    
    #Group settings
    result['group'] = {
        'name': int_group.name,
        'description': int_group.description,
        'sel_resources': res_list,
        'member_title': int_group.member_title
    }    
    #Region settings
    result['region'] = {
        'name': interview.region.name,
        'n_bound': interview.region.n_bound,
        's_bound': interview.region.s_bound,
        'e_bound': interview.region.e_bound,
        'w_bound': interview.region.w_bound,
        'code': interview.region.code
    }
    return HttpResponse(geojson_encode(result), mimetype='application/json')

'''
Shape web service - 
GET: filter by interview group: 'group_id'
POST - expects {'feature':{geometry, group_id, resource_id, boundary_n, boundary_s, boundary_e, boundary_w}}
DELETE - expects a shape id /shapes/id or resource_id param
'''
def shapes(request, id=None):    
    if request.method == 'GET':  
        shape_qs = InterviewShape.objects.filter(user=request.session['interviewee']).order_by('id')
        if (request.GET.get('group_id')):
            shape_qs = shape_qs.filter(int_group__id=request.GET.get('group_id'))
        if (request.GET.get('resource_id')):
            shape_qs = shape_qs.filter(resource__id =request.GET.get('resource_id'))
        return render_to_geojson(
            shape_qs,
            geom_attribute='geometry',
            excluded_fields=['creation_date'],
            mimetype = 'text/plain',
            proj_transform=settings.CLIENT_SRID,
            pretty_print=True
        )
        
    elif request.method == 'POST':        
        #Get session and status
        try:
            int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])        
            status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])
            status = status_object_qs[0]        
        except Exception, e:
            return HttpResponse('{"status_code":"-1",  "success":"false",  "message":"Action not permitted"}', status=403)
            
        #DELETE events (since it's not supported with params in Ext 2.2.1
        if (request.POST.get('action') ==  'DELETE'):
            if (id):
                shape = get_object_or_404(InterviewShape, pk=id)
                if (shape.user == request.session['interviewee']):
                    shape.delete()
                    result = {"success":True, "message":"Deleted successfully"}
                    return HttpResponse(geojson_encode(result)) 
                else:
                    result = {"success":False, "message":"None of users shapes have given ID"}
                    return HttpResponse(result, status=403)
            else:
                resource_id = request.POST.get('resource_id')
                group_id = request.POST.get('group_id')
                if (resource_id):
                    shapes = InterviewShape.objects.filter(resource=resource_id, int_group=group_id, user=request.session['interviewee'])
                    shapes.delete()
                    result = {"success":True, "message":"Deleted successfully"}
                    return HttpResponse(geojson_encode(result)) 
                else:
                    result = {"success":False, "message":"None of users shapes have given ID"}
                    return HttpResponse(result, status=500)
            
        
        #See if the interview is complete
        if status.completed:
            return HttpResponse('{"status_code":"-1",  "success":"false",  "message":"Survey already completed"}', status=403)      
        
        #Make sure we were passed a feature
        if not request.POST.has_key('feature'):
            return HttpResponse('{"status_code":"-1",  "success":"false",  "message":"Expected \'feature\'"}', status=403)
        import simplejson
        feat = simplejson.loads(request.POST.get('feature'))        
        
        #Check if it's an update
        if (id):
            shape = InterviewShape.objects.get(pk=id)
            
            if (shape.user == request.session['interviewee']):
                shape.pennies = feat.get('pennies')
                shape.save()
                result = {"success":True, "message":"Update successfully"}
                return HttpResponse(geojson_encode(result)) 
            else:
                result = {"success":False, "message":"None of users shapes have given ID"}
                return HttpResponse(result, status=403)

        #It must be a new shape, create it                                 
        result = '{"status_code":"-1",  "success":"false",  "message":"Error saving"}'
        try:
            geom = GEOSGeometry(feat.get('geometry'), srid=settings.CLIENT_SRID)
            geom.transform(settings.SERVER_SRID)                        
             
            new_shape = InterviewShape(
                user = request.session['interviewee'],
                geometry = geom,
                boundary_n = feat.get('boundary_n'),
                boundary_s = feat.get('boundary_s'),
                boundary_e = feat.get('boundary_e'),
                boundary_w = feat.get('boundary_w'),
                int_group_id = feat.get('group_id'),
                resource_id = feat.get('resource_id')                
            )                        
            new_shape.save() 
            
            # check the status of the interview group membership for this shape and unfinalize it if necessary
            group_memb = InterviewGroupMembership.objects.get(user=request.session['interviewee'],int_group=new_shape.int_group_id)
            if group_memb.status == 'finalized':
                group_memb.status = 'in-progress'
                group_memb.save()
                
        except Exception, e:
            return HttpResponse(result + e.message, status=500)

        result = {
            "status_code":1,  
            "success":True, 
            "message":"Saved successfully",
            "feature": new_shape
        }              
        return HttpResponse(geojson_encode(result))                  
    
'''
Shape validation and clipping

HTTP error codes
403 - interview already completed
500 - exception raised

Result status codes
0 - successfully clipped
1 - Multiple geometry, largest kept
2 - shape not valid
3 - zero area after clipping
4 - overlapped existing shape
5 - single point
6 - too large
'''    
@login_required
def validate_shape(request):
    #maximum size a shape should logically be.  It is probably in square meters.
    maxArea = 11000000000
    
    result = '{"status_code":"-1",  "success":"false",  "message":"disallowed"}'    
    # make sure the user has a valid session in-progress
    interview = request.session['interview']
    try:                        
        status_object_qs = InterviewStatus.objects.filter(interview=interview, user=request.session['interviewee'])
        status = status_object_qs[0]        
    except Exception, e:
        return HttpResponse(result, status=403)
    
    if status.completed:
        return HttpResponse(result, status=403)

    result = '{"status_code":"-1",  "success":"false",  "message":"error in validate_shape in views.py"}'

    try:    
        # validate against this user's other shapes in this resource
        new_shape = GEOSGeometry( request.REQUEST["geometry"], srid=settings.CLIENT_SRID )
    except Exception, e:
        return gen_validate_response(5, 'Shape is not valid', None)
    
    try:        
        new_shape.transform( settings.SERVER_SRID )
        
        #If editing an existing shape, get its record and resource/group id's,
        #else get the resource/group id's from the request
        if request.REQUEST.get("orig_shape_id"):
            orig_shape = InterviewShape.objects.get(pk=request.REQUEST.get("orig_shape_id"))
            int_group_id = orig_shape.int_group.id
            resource_id = orig_shape.resource.id
        else:
            int_group_id, resource_id = request.REQUEST['resource'].split('-')        
            
        other_shapes = InterviewShape.objects.filter(user=request.session['interviewee'],int_group__id=int_group_id,resource__id=resource_id)

        #If editing, exclude original shape from those to check
        if request.REQUEST.get("orig_shape_id"):
            other_shapes = other_shapes.exclude(pk=request.REQUEST["orig_shape_id"])

        #Error if new shape intersects
        for i, shape in enumerate( other_shapes.all() ):
            if new_shape.intersects( shape.geometry ):
                return gen_validate_response(4, 'New geometry overlaps existing shapes', None)
    
        #Error if shape is not valid
        if not new_shape.valid:
            return gen_validate_response(2, 'Shape is not valid', new_shape)
        
        #Clip the shape to the region
        # clipped_shape = new_shape.difference( interview.clip_region.geom )          

        #Error if no area and shape was completely clipped away by clip region, 
        # if clipped_shape.area == 0:
            # return gen_validate_response(3, 'Zero area after clipping', clipped_shape)
        if new_shape.area == 0:
            return gen_validate_response(3, 'Zero area', new_shape)
         
        #Error if area is too large (set by maxArea) 
        # if clipped_shape.area > maxArea:
        if new_shape.area > maxArea:
            return gen_validate_response(6, 'Shape is too large', new_shape)
          
        #If clipped into more than one polygon, return the largest
        # if clipped_shape.num_geom > 1:
            # largest_area = 0.0
            # for g in clipped_shape: # find the largest polygon in the multi polygon 
                # if g.area > largest_area:
                    # largest_geom = g
                    # largest_area = g.area
            # return gen_validate_response(1, 'Shape clipped to shoreline', largest_geom)            
        # return gen_validate_response(0, 'Shape clipped to shoreline', clipped_shape)                   
        return gen_validate_response(0, 'Shape is valid', new_shape)                   
    except Exception, e:
        return HttpResponse(result + e.message, status=500)

'''
Utility function for generating manipulator response 
'''
def gen_validate_response(code, message, geom):
    if geom:
        geom.transform( settings.CLIENT_SRID )
    result = {
        'status_code':code,
        'message':message,
        'geom':geom
    }
    return HttpResponse(geojson_encode(result))


# Save a user-drawn shape.  Shape should already have been validated 
@login_required
def save_shape(request):
    result = '{"status_code":"-1",  "success":"false",  "message":"disallowed"}'    
    # make sure the user has a valid session in-progress
    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])        
        status_object_qs = InterviewStatus.objects.filter(interview=request.session['interview'], user=request.session['interviewee'])
        status = status_object_qs[0]        
    except Exception, e:
        return HttpResponse(result, status=403)

    # see if the interview has been marked complete
    if status.completed:
        return HttpResponse(result, status=403)        

    result = '{"status_code":"-1",  "success":"false",  "message":"error in save_shape in views.py"}'
    try:
        new_shape = InterviewShape()
        new_shape.user = request.session['interviewee']
        
        geom = GEOSGeometry(request.REQUEST['geometry'], srid=settings.CLIENT_SRID)
        geom.transform(settings.SERVER_SRID)
        new_shape.geometry = geom
        
        geom_clipped = GEOSGeometry(request.REQUEST['geometry_clipped'], srid=settings.CLIENT_SRID)
        geom_clipped.transform(settings.SERVER_SRID)
        new_shape.geometry_clipped = geom_clipped
        
        int_group_id, resource_id = request.REQUEST['resource'].split('-')
        new_shape.int_group_id = int(int_group_id)
        new_shape.resource_id = int(resource_id)
        new_shape.save() 
        
        result = '{"status_code":"1",  "success":"true", "message":"mpa saved successfully"'
        result = new_shape.json()
        
        # check the status of the interview group membership for this shape and unfinalize it if necessary
        group_memb = InterviewGroupMembership.objects.get(user=request.session['interviewee'],int_group=int_group_id)
        if group_memb.status == 'finalized':
            group_memb.status = 'in-progress'
            group_memb.save()
            
    except Exception, e:
        return HttpResponse(result + e.message, status=500)
    return HttpResponse(result)
  
@login_required
def draw_help_text(request):
    return render_to_response( 'draw_help_text.html', RequestContext(request,{})) 
     
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
        'file':settings.VIDEO_URL+str(name)+'.flv',
        'title':string.capwords(name.replace('_',' '))
    }
    return render_to_response('demo_video.html', {'video':video}, context_instance=RequestContext(request)) 
    
def sample(request, name):
		return render_to_response('samples/'+name+'.html', context_instance=RequestContext(request)) 
        
def tiles(request, tilePath):
    from PIL import Image
    try:
        image = Image.open(settings.TILE_BASE+tilePath)
    except Exception, e:
        response = HttpResponseNotFound("Tile not found.", mimetype="text/plain")
        return response

    # serialize to HTTP response
    response = HttpResponse(mimetype="image/png")
    image.save(response, "PNG")
    return response
    
    