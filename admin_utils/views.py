from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.servers.basehttp import FileWrapper
from django.core.files import File
from django.contrib.auth.models import User
from gwst_app.models import *
from forms import *
from django.core import serializers
from shapes.views import ShpResponder
from django.template.defaultfilters import slugify
import datetime
import os
import csv
import zipfile
from StringIO import StringIO
import tempfile

'''
Accessed from the Survey Management Admin interface 
Returns a rendered template that displays the form for Exporting a Survey and a form for Importing a Survey
'''
def port_surveys(request, template='port_surveys.html'):
    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'GET':
        return HttpResponse('Action not permitted', status=403)
    export_form = ExportSurveysForm()
    import_form = ImportSurveysForm()
    return render_to_response( template, RequestContext(request,{'import_form': import_form, 'export_form': export_form}))        
 
'''
Accessed when user clicks the Export Surveys button
Creates a fixture from all the completed surveys
Returns a response that contains the fixture as a .json file
'''
def export_surveys(request):

    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    form = ExportSurveysForm(request.POST)
        
    if not form.is_valid():
        return render_to_response( template, RequestContext( request, {'export_form':form} ) )
    #compile a fixture from all the completed surveys
    fixture_text = compile_survey_fixture()
    response = HttpResponse(fixture_text, mimetype='application/json')
    #return fixture with <staff_username>_<today's date>.json convention
    username = clean_username(User.objects.get(username = request.user).first_name)
    response['Content-Disposition'] = 'attachment; filename=%s_%s.json' % (username, datetime.date.today())
    return response

'''
Accessed when user clicks the Export Shapefile button
Creates a shapefile from all the completed surveys' geometries
Returns a response that contains the shapefile
'''
def export_shapefile(request):
    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    form = ExportSurveysForm(request.POST)
        
    if not form.is_valid():
        return render_to_response( template, RequestContext( request, {'export_form':form} ) )
    #compile a queryset of shapes from the completed surveys
    completed_shapes = compile_completed_shapes()    
    shp_response = ShpResponder(completed_shapes)
    username = clean_username(User.objects.get(username = request.user).first_name)
    shp_response.file_name = '%s_%s' % (username, datetime.date.today())
    return shp_response()
 
'''
Accessed when user clicks the Export CSVs button
Creates a CSV for each interview from all the completed surveys' answers
Returns a response that contains a zipfile of all of the CSVs.
'''
def export_csv(request, template='port_surveys.html'):

    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    form = ExportSurveysForm(request.POST)
    if not form.is_valid():
        return render_to_response( template, RequestContext( request, {'export_form':form} ) )
    interviews = get_interview_types()

    zipname = 'survey_csvs_%s.zip' % (datetime.date.today())
    zipdata = StringIO()
    zf = zipfile.ZipFile(zipdata, 'w')
    tempdir = tempfile.mkdtemp()
    
    #Create the User Answer CSVs
    for interview in interviews:
        #compile a queryset of users from the completed surveys
        data_rows = compile_data_rows(interview)
        
        if data_rows.__len__() > 0:
            if data_rows[0].__class__() != []:
                return data_rows[0]
            filename = slugify('USER_ANSWERS_%s_%s' % (interview['group'].header, datetime.date.today())) + '.csv'
            f = open(tempdir + os.sep + filename, 'wb')
            csv_file = File(f)
            writer = csv.writer(csv_file)
            writer.writerows(data_rows)
            csv_file.close()
            zf.write(f.name, filename)
            os.remove(f.name)
            
    #Create the Raw Data CSVs
    #TODO: add csvs for full answer output, resources, questions, groups, etc...
    #can use models.get_models() -- needs to be cleaned of old cruft
    for model in [User, Resource, Interview, InterviewGroup, InterviewGroupMembership, GroupMemberResource, InterviewAnswerOption, InterviewQuestion, InterviewAnswer, InterviewStatus, InterviewShape, UserProfile]:
        model_rows = []
        model_fields = []
        for field in model._meta.fields:
            model_fields.append(field.name)
        model_rows.append(model_fields)
        for entry in model.objects.all().values():
            entry_row = []
            for field in model_fields:
                value = ''
                if not entry.has_key(field) and entry.has_key(field+'_id'):     #sometimes the field has '_id' appended
                    field = field + '_id'
                if entry.has_key(field) and field != 'password':                #Don't export touchy information
                    if isinstance(entry[field], unicode):                       #Prevent unknown characters from breaking export
                        value = entry[field].encode('utf-8', 'ignore')
                    elif isinstance(entry[field], datetime.datetime):           #Make sure date is readable
                        value = entry[field].isoformat()
                    else:
                        value = str(entry[field])
                entry_row.append(value)
            model_rows.append(entry_row)
        filename = slugify('%s_%s' % (model._meta.module_name, datetime.date.today())) + '.csv'
        f = open(tempdir + os.sep + filename, 'wb')
        csv_file = File(f)
        writer = csv.writer(csv_file)
        writer.writerows(model_rows)
        csv_file.close()
        zf.write(f.name, filename)
        os.remove(f.name)
            
    zf.close()
    
    zipdata.seek(0)
    response = HttpResponse(zipdata.read())
    response['Content-Disposition'] = 'attachment; filename=' + zipname
    response['Content-Type'] = 'application/zip'
    
    os.removedirs(tempdir)
    
    return response

#User input may contain spaces or special characters.
def clean_username(ugly_str):
    for char in ugly_str:
        if not (char.isalnum() or char == '-' or char == '_'):
            bad_index = ugly_str.find(char)
            clean_str = clean_username(ugly_str[0:bad_index]+ugly_str[bad_index+1:])
            return clean_str
    return ugly_str

    
'''
Called from export_survey
Compiles and returns the text of a fixture that embodies all the completed surveys in the database
'''  
def compile_survey_fixture():
    #get all records from gwst_userstatus (InterviewStatus)
    interviews = InterviewStatus.objects.filter(completed=True)
    survey_objects = []
    survey_objects.extend(res for res in Resource.objects.all())
    survey_objects.extend(User.objects.filter(is_staff = True))

    for interview in interviews:
        #compile survey entries into one list
        user = User.objects.get(pk=interview.user_id)
        survey_objects.extend(UserProfile.objects.filter(user=user))
        survey_objects.extend([user])
        survey_objects.extend(InterviewStatus.objects.filter(user=user))
        survey_objects.extend(InterviewGroupMembership.objects.filter(user=user))
        #survey_objects.extend(GroupMemberResource.objects.all()) #not sure this is what we want...
        #how about the following??
        survey_objects.extend([gmres for gmres in GroupMemberResource.objects.all() if gmres.user()==user.id])
        survey_objects.extend(InterviewAnswer.objects.filter(user=user))
        survey_objects.extend(InterviewShape.objects.filter(user=user))
        

    #serialize the survey objects into json 
    fixture_text = serializers.serialize('json', survey_objects, indent=2)
    return fixture_text
  
def compile_completed_shapes():
    #get all shape records from completed interviews
    
    InterviewShapeShapefile.objects.all().delete()
    
    for shape in InterviewShape.objects.all():
        params = {}
        user = shape.user
        group = shape.int_group
        interview = group.interview
        status = InterviewStatus.objects.get(user=user, interview=interview)
        if status.completed:
            new_shapefile_shape = InterviewShapeShapefile()
            new_shapefile_shape.shape = shape.id
            new_shapefile_shape.user = user.id
            new_shapefile_shape.f_name = user.first_name
            new_shapefile_shape.l_name = user.last_name
            new_shapefile_shape.interview = interview.id
            new_shapefile_shape.int_name = interview.name
            new_shapefile_shape.group = group
            new_shapefile_shape.grp_name = group.name
            new_shapefile_shape.resource = shape.resource.verbose_name
            new_shapefile_shape.res_name = shape.resource.name
            new_shapefile_shape.res_method = shape.resource.method
            new_shapefile_shape.geometry = shape.geometry
            new_shapefile_shape.pennies = shape.pennies
            new_shapefile_shape.bound_n = shape.boundary_n
            new_shapefile_shape.bound_s = shape.boundary_s
            new_shapefile_shape.bound_e = shape.boundary_e
            new_shapefile_shape.bound_w = shape.boundary_w
            new_shapefile_shape.note_text = shape.note_text
            new_shapefile_shape.days_visit = shape.days_visited
            year = str(shape.creation_date.year)
            if shape.creation_date.month < 10:
                month = '0' + str(shape.creation_date.month)
            else:
                month = str(shape.creation_date.month)
            if shape.creation_date.day < 10:
                day = '0' + str(shape.creation_date.day)
            else:
                day = str(shape.creation_date.day)
            if shape.creation_date.hour < 10:
                hour = '0' + str(shape.creation_date.hour)
            else:
                hour = str(shape.creation_date.hour)
            if shape.creation_date.minute < 10:
                minute = '0' + str(shape.creation_date.minute)
            else:
                minute = str(shape.creation_date.minute)
            new_shapefile_shape.date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
            lnum_q = InterviewQuestion.objects.filter(code__contains="licnum", int_group__interview=interview)
            if lnum_q.count() > 0:
                lnum_a = InterviewAnswer.objects.filter(int_question=lnum_q[0], user=user)
                if lnum_a.count() > 0:
                    new_shapefile_shape.l_num = lnum_a[0].text_val
                else:
                    new_shapefile_shape.l_num = None
            else:
                new_shapefile_shape.l_num = None
            port_q = InterviewQuestion.objects.filter(code__contains="port11", int_group__interview=interview)
            if port_q.count() > 0:
                port_a = InterviewAnswer.objects.filter(int_question=port_q[0], user=user)
                if port_a.count() > 0:
                    new_shapefile_shape.home_port = port_a[0].text_val
                else:
                    new_shapefile_shape.home_port = None
            else:
                new_shapefile_shape.home_port = None
            new_shapefile_shape.save()
            
    return InterviewShapeShapefile.objects.all()
    
def get_interview_types():
    
    interviews = []
    for interview in Interview.objects.all():
        default_groups = InterviewGroup.objects.filter(interview = interview, is_user_group = False)       #Get groups like "main" that everyone uses or can use
        user_groups = InterviewGroup.objects.filter(interview = interview, is_user_group = True)       #Get groups like "fishermen" that don't apply to all users
        default_fields = ['user_id', 'resource']
        for group in default_groups.order_by('required_group'):
            for question in InterviewQuestion.objects.filter(int_group = group).order_by('question_set','display_order'):
                ext_question = getExtendedQuestionFields(question)
                default_fields.extend(ext_question)
        if user_groups.count() > 0:
            for ugroup in user_groups.order_by('id'):
                int_type = {}
                group_fields = []
                group_fields.extend(default_fields)
                for question in InterviewQuestion.objects.filter(int_group = ugroup).order_by('question_set','display_order'):
                    ext_question = getExtendedQuestionFields(question)
                    group_fields.extend(ext_question)
                int_type['interview'] = interview
                int_type['type'] = 'user group'
                int_type['name'] = ugroup.name
                int_type['group'] = ugroup
                int_type['fields'] = group_fields
                interviews.append(int_type)
        else:
            main_group = InterviewGroup.objects.get(interview = interview, name = 'Main Questions')
            int_type = {}
            int_type['interview'] = interview
            int_type['type'] = 'default'
            int_type['name'] = 'main'
            int_type['group'] = main_group
            int_type['fields'] = default_fields
            interviews.append(int_type)
    return interviews
    
def compile_data_rows(interview):
    data_rows = []
    header_row = []
    for field in interview['fields']:
        if field.__class__() == '':
            header_row.append(field)
        else:
            header_row.append(field['header'])
    data_rows.append(header_row)
    for survey in InterviewStatus.objects.filter(completed = True, interview = interview['interview']):
        membership = InterviewGroupMembership.objects.filter(user = survey.user, int_group = interview['group'])
        if membership.count() == 1:
            memb = membership[0]
            if interview['group'].user_draws_shapes:
                resources = GroupMemberResource.objects.filter(group_membership = memb)
                for resource in resources:
                    data_rows.append(create_row({'user': survey.user, 'fields': interview['fields'], 'resource': resource}))
            else:
                data_rows.append(create_row({'user': survey.user, 'fields': interview['fields']}))
        elif membership.count() > 1:
            return HttpResponse('multiple group memberships found: compile_data_rows', status=500)
    return data_rows
    
def create_row(row_data):
    row = []
    answers = InterviewAnswer.objects.filter(user = row_data['user'])

    for field in row_data['fields']:
        if field.__class__() == '':
            if field == 'user_id':
                row.append(row_data['user'].id)
            elif field == 'resource':
                if row_data.keys().__contains__('resource'):
                    row.append(row_data['resource'].resource.verbose_name)
                else:
                    row.append('')
        else:
            potential_answers = answers.filter(int_question = field['question'])
            if field['question'].all_resources:
                potential_answers = potential_answers.filter(resource = row_data['resource'].resource)
            if field.keys().__contains__('field'):
                potential_answers = potential_answers.filter(text_val = field['field'])
            if potential_answers.count() != 1:
                return HttpResponse('multiple answers found for single question: create_row', status=500)
            q_ans = potential_answers[0]
            if field['question'].answer_type == 'integer':
                ans = q_ans.integer_val
            elif field['question'].answer_type =='decimal':
                ans = q_ans.decimal_val
            elif field['question'].answer_type =='boolean':
                ans = q_ans.boolean_val
            elif field['question'].answer_type =='select' or field['question'].answer_type =='text' or field['question'].answer_type =='phone' or field['question'].answer_type =='money' or field['question'].answer_type =='percent' or field['question'].answer_type =='textarea':
                ans = q_ans.text_val
            elif field['question'].answer_type =='checkbox' or field['question'].answer_type =='selectmultiple' :
                ans = q_ans.boolean_val
            else:
                ans = ''
            row.append(ans)
    return row
    
def getExtendedQuestionFields(question):
    question_fields = []
    if question.answer_type == 'checkbox' or question.answer_type == 'selectmultiple' :        
        options = question.options
        for field in options.values_list():
            question_field = {}
            question_field['question'] = question
            question_field['header'] = str(question.id) + '-' + field.__getitem__(1) + '-' + question.header_name
            question_field['field'] = field.__getitem__(1)
            question_field['display_order'] = question.display_order
            question_fields.append(question_field)
        
    else :
        question_field = {}
        question_field['question'] = question
        question_field['header'] = str(question.id) + '-' + question.header_name
        question_field['display_order'] = question.display_order
        question_fields.append(question_field)
        
    return question_fields
    
'''
Uploads a survey fixture file from an admin enabled user.
Calls loaddata on that fixture, loading into the database.
Note: This action will overwrite data entries for cases in which the primary key is the same but the data is different.
'''
def import_surveys(request, template='surveys_imported.html'):
    if not request.user.is_staff:
        return HttpResponse('You do not have permission to view this feature', status=401)
    if request.method != 'POST':
        return HttpResponse('Action not permitted', status=403)
    form = ImportSurveysForm(request.POST, request.FILES)
    #check form for validity
    if not form.is_valid():
        return render_to_response( 'port_surveys.html', RequestContext( request, {'import_form':form} ) )
    #retrieve file
    survey_file = request.FILES['file']
    #copy contents of survey file to a temporary fixture file
    tempfile = copy_to_tempfile(survey_file)
    #call loaddata on the temporary fixture file, and collect the output
    success, output = load_fixture(tempfile)
    #render a template informing the admin user that the fixture has been loaded (or not)
    return render_to_response( template, RequestContext( request, {'fixture': survey_file, 'output': output, 'success': success} ) )
    
'''    
Called form import_surveys
Copies the contents of the imported fixture into a temporary file
(This will allow the application to call loaddata on that fixture)
'''
def copy_to_tempfile(fixture):
    import tempfile
    #create temporary file for storing fixture data
    __, temp_file = tempfile.mkstemp(suffix='.json')
    dest = open(temp_file, 'wb+')
    #write fixture data to temporary file
    for chunk in fixture.chunks():
        dest.write(chunk)
    #close temporary file and return the path name
    dest.close()
    return dest.name
    
'''    
The following is (still) a bit of a hack to retrieve the output from loaddata
Called from import_surveys
Calls loaddata on given fixture 
Returns the an indication of success and the last line of the output generated by the loaddata call
'''
def load_fixture(fixture):
    import tempfile, sys
    from django.core import management
    #create a temporary location to store the output generated by loaddata
    tempdir = tempfile.mkdtemp()
    tempout = os.path.join(tempdir, 'temp.txt')
    #call loaddata on the temporary fixture file, storing any output from the loaddata call into a temporary location
    
    #the following lines temporarily redirect the output from stdout to tempout 
    saveout = sys.stdout
    fsock = open(tempout, 'w')
    sys.stdout = fsock
    #this output rediction allows us to capture the output generated by loaddata
    #management.call_command('loaddata', fixture, verbosity=1)
    
    from django.core.management.commands.loaddata import Command
    klass = Command()
    klass.execute(fixture, verbosity=1)
    
    #and the following lines redirect the output back to stdout
    sys.stdout = saveout     
    fsock.close()
    
    #read and store the last line from the output file 
    #(this should be something similar to: 'Installed xx object(s) from xx fixture(s)')
    outfile_reader = open(tempout, 'r')
    output_all = outfile_reader.readlines()
    output = output_all[-1]

    #the following is a pretty lame way of determining whether the fixture loaded anything or not
    #but i'm not sure how else this might be accomplished since the management.call_command to loaddata
    #doesn't seem to provide any additional information about its success or failure
    if 'Installed' in output:
        success = True
    else:
        success = False
        
    return success, output
    