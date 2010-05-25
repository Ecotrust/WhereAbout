from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.models import User
from gwst_app.models import *
from forms import *
from django.core import serializers
import datetime
import os

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
    response['Content-Disposition'] = 'filename=%s_%s.json' % (request.user, datetime.date.today())
    return response
  
'''
Called from export_survey
Compiles and returns the text of a fixture that embodies all the completed surveys in the database
'''  
def compile_survey_fixture():
    #get all records from gwst_userstatus (InterviewStatus)
    interviews = InterviewStatus.objects.filter(completed=True)
    survey_objects = []
    for interview in interviews:
        #compile survey entries into one list
        user = User.objects.get(pk=interview.user_id)
        survey_objects.extend([user])
        survey_objects.extend(InterviewStatus.objects.filter(user=user))
        survey_objects.extend(InterviewGroupMembership.objects.filter(user=user))
        #survey_objects.extend(GroupMemberResource.objects.all()) #not sure this is what we want...
        #how about the following??
        survey_objects.extend([res for res in GroupMemberResource.objects.all() if res.user()==user.username])
        survey_objects.extend(InterviewAnswer.objects.filter(user=user))
        survey_objects.extend(InterviewShape.objects.filter(user=user))
    #serialize the survey objects into json 
    fixture_text = serializers.serialize('json', survey_objects, indent=2)
    return fixture_text
  
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
The following is a bit of a hack put together to retrieve the output from loaddata
Called from import_surveys
Calls loaddata on given fixture and returns the success code and the last line of the output generated by the loaddata call
'''
def load_fixture(fixture):
    import tempfile
    #create a temporary location to store the output generated by loaddata
    tempdir = tempfile.mkdtemp()
    tempout = os.path.join(tempdir, 'temp.txt')
    #call loaddata on the temporary fixture file, storing any output from the loaddata call into a temporary location
    loaddata_cmd = 'python manage.py loaddata ' + fixture + ' > ' + tempout
    success = os.system(loaddata_cmd)
    #read and store the second/last line from the output file 
    #this should be the 'Installed xx object(s) from xx fixture(s)' line
    outfile_reader = open(tempout, 'r')
    output_all = outfile_reader.readlines()
    output = output_all[-1]
    #return the success code (from os.system) and the output generated by the loaddata command
    return success, output
    