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

    title = request.session['interview'].name + ' - Group Membership Selection'
    
    if request.method == 'GET':
        # let user select which groups they are in
        groups = InterviewGroup.objects.filter(interview=request.session['interview'],required_group=False)
        form = SelectInterviewGroupsForm( groups )
        return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'form': form, 'value':'Continue'}))
        
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
        return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'form': form, 'value':'Continue'}))
    
    
# show a list of user's groups and current status of each
@login_required
def group_status(request):

    try:
        int_groups = InterviewGroup.objects.filter(interview=request.session['interview'])
    except Exception, e:
        return HttpResponseRedirect('/select_interview/')

    # show list of interview groups with current status (including global interview questions)
    
    title = request.session['interview'].name + ' Status'
       
    qs = InterviewGroupMembership.objects.filter(user=request.user, int_group__in=int_groups).order_by('-percent_involvement')
    
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
                
                for resource in group_memb.int_group.resources.all():
                    res_shapes = InterviewShape.objects.filter(user=request.user,int_group=group_memb.int_group,resource=resource)
                    res_count = res_shapes.count()
                    if res_count > 0:
                        res_pennies = res_shapes.aggregate(Sum('pennies'))['pennies__sum']
                        if res_pennies == 100:
                            num_complete_resources = num_complete_resources + 1
                        else:
                            num_incomplete_resources = num_incomplete_resources + 1
                            
                if num_incomplete_resources > 0:
                    group_memb.user_status_msg = '%s/%s resource group(s) incomplete' % (num_incomplete_resources,num_incomplete_resources+num_complete_resources)
                else:
                    group_memb.user_status_msg = '%s resource group(s) complete' % (num_complete_resources,)
                
                group_memb.num_complete_resources = num_complete_resources
                group_memb.num_incomplete_resources = num_incomplete_resources
                
            group_memb.save()
                        
            
    
    # if user has finalized each of their registered groups, let them finalize their interview
    finalized_groups = qs.filter(status='finalized')
    allow_finalize = qs.count() == finalized_groups.count()
    
    return render_to_response( 'group_status.html', RequestContext(request,{'title':title, 'interview':request.session['interview'], 'object_list':qs, 'allow_finalize':allow_finalize}))
    
    
@login_required    
def view_answers(request,group_id):
    # show questions for this group, with any existing user answers
    questions = InterviewQuestion.objects.filter(int_group__pk=group_id).order_by('question_set', 'display_order')
    answers = InterviewAnswer.objects.filter(user=request.user, int_question__in=questions)
    
    group = InterviewGroup.objects.get(pk=group_id)
    title = group.name + ' Answered Questions'
    
    return render_to_response( 'view_answers.html', RequestContext(request,{'title':title, 'questions': questions, 'answers':answers}))        
    
    
@login_required    
def answer_questions(request,group_id):

    group = InterviewGroup.objects.get(pk=group_id)
    title = group.name + ' Questions'

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
                    answer.text_val = str(answer.integer_val) # makes the db a little more human readable
                elif field.question.answer_type == 'decimal':
                    answer.decimal_val = form.cleaned_data['question_%d' % field.question.id]
                    answer.text_val = str(answer.decimal_val) # makes the db a little more human readable
                elif field.question.answer_type == 'boolean':
                    answer.boolean_val = form.cleaned_data['question_%d' % field.question.id]
                    answer.text_val = str(answer.boolean_val) # makes the db a little more human readable
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
            request.session['int_group'] = group
            
            return HttpResponseRedirect('/group_status/')

    return render_to_response( 'base_form.html', RequestContext(request,{'title':title, 'form': form, 'value':'Continue'}))     
    
    
# start draw shapes for indicated group    
@login_required
def draw_group_shapes(request, group_id):
    group = InterviewGroup.objects.get(pk=group_id)
    request.session['int_group'] = group
        
    title = request.session['interview'].name + ' - ' + group.name + ' Group Shape Drawing'
        
    return render_to_response( 'map.html', RequestContext(request, {'title':title, 'GMAPS_API_KEY': settings.GMAPS_API_KEY}))



# user finalizes group
@login_required
def finalize_group(request,id):
    if request.method == 'GET':
        # update InterviewGroupMembership record
        int_group = InterviewGroup.objects.get(pk=id)
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
            return render_to_response( 'notfound.html', RequestContext(request,{}))
        
        # redirect to interview_group_status
        return HttpResponseRedirect('/group_status/')
        
        
# user finalizes group
@login_required
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
    
   
@login_required
def interview_complete(request):
    title = request.session['interview'].name + ' Completed'
    return render_to_response( 'interview_complete.html', RequestContext(request,{'title':title, 'name':request.session['interview'].name}))
    
    
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
    folder = create_superfolder('Right click any item for options', icon=settings.MEDIA_URL+'images/silk/icons/status_online.png', id="userFeatures")
    
    int_groups = InterviewGroup.objects.filter(interview=interview,user_draws_shapes=True)
    int_group_membs = InterviewGroupMembership.objects.filter(user=user, int_group__in=int_groups).exclude(status='not yet started').order_by('-percent_involvement')
    
    for int_group_memb in int_group_membs.all():
        int_group = int_group_memb.int_group
        group = create_folder(int_group.name, pk=int_group.id, toggle=True, context=True)
        for resource in int_group.resources.all():
            resource_shapes = InterviewShape.objects.filter(user=user,int_group=int_group,resource=resource)
            resource_pennies = resource_shapes.aggregate(Sum('pennies'))['pennies__sum']
            if resource_pennies == None:
                resource_pennies = 0
            mpas = create_folder(resource.name+' group ('+str(resource_pennies)+' pennies)', pk=str(int_group.id)+'-'+str(resource.id), toggle=True, context=True)
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
    # validate indicated group, resource
    result = '{"status_code":"-1",  "success":"false",  "message":"error in validate_shape in views.py"}'
    try:
        m = InterviewShape(geometry=request.REQUEST["geometry"])
        result = m.validate()
    except Exception, e:
        return HttpResponse(result + e.message, status=500)
    return HttpResponse(result)
 
    
# AJAX post that user accepted clipped shape    
@login_required
def save_shape(request):
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
            
    except Exception, e:
        return HttpResponse(result + e.message, status=500)
    return HttpResponse(result)

    
    
# AJAX delete handler
@login_required
def delete_shape(request,id):
    shape = InterviewShape.objects.filter(pk=id)
    if shape.count() == 1 and shape[0].user == request.user:
        msg = 'Shape %s deleted.' % (id, )
        shape[0].delete()
    else:
        msg = 'Not authorized.'
        
    return HttpResponse(msg)  

    
def copy_shape(request):
    source_id = request.REQUEST.get('source')
        
    target = request.REQUEST.get('target')
    target_group_id, target_resource_id = target.split('-')
    target_resource = Resource.objects.get(pk=target_resource_id)
    target_group = InterviewGroup.objects.get(pk=target_group_id)
    
    shape = InterviewShape.objects.filter(pk=source_id)
    if shape.count() == 1 and shape[0].user == request.user:
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

    if request.REQUEST.get('source_type') == 'shape':
        return copy_shape(request)

    target = request.REQUEST.get('target')
    target_group_id, target_resource_id  = target.split('-')
    target_resource = Resource.objects.get(pk=target_resource_id)
    target_group = InterviewGroup.objects.get(pk=target_group_id)
    
    source = request.REQUEST.get('source')
    source_group_id, source_resource_id = source.split('-')
    
    copy_shapes = InterviewShape.objects.filter(user=request.user,resource=source_resource_id,int_group=source_group_id)
    
    new_copies = []
    if copy_shapes.count() > 0:
    
        # if the target group already has any pennies assigned, don't bring a copied groups pennies
        resource_shapes = InterviewShape.objects.filter(user=request.user,int_group=target_group,resource=target_resource)
        resource_agg = resource_shapes.aggregate(Sum('pennies'))
    
        for shape in copy_shapes.all():
            copy = shape.copy()
            copy.int_group = target_group
            copy.resource = target_resource
            
            if resource_agg['pennies__sum'] > 0:
                copy.pennies = 0;
            
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
    shape = InterviewShape.objects.filter(pk=id,user=request.user)
    if shape.count() == 1:
        action = "/gwst/shape/edit/"+str(shape[0].pk)
        if request.method == 'GET':
            form = InterviewShapeAttributeForm( instance=shape[0] )
            #form.fields['resource'].queryset = Resource.objects.filter(interviewgroup=shape[0].int_group)
            t = loader.get_template('base_form.html')
            opts = {
                'form': form,
                'action': action,
                'value': 'Save'
            }
            return HttpResponse(t.render(RequestContext(request, opts)))
            
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
                    'value': 'Save'
                }
                return HttpResponseBadRequest(t.render(RequestContext(request, opts )))
            
    else:
        # forbidden
        return render_to_response( 'test.html', RequestContext())

 
# AJAX edit geometry handler 
@login_required
def editgeom_shape(request,id):
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

