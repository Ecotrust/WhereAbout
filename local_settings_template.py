# local settings.  Override default settings.py

DATABASE_NAME = ''
DATABASE_USER = ''
DATABASE_PASSWORD = '' # like: '1234'
MEDIA_ROOT = '' # like: os.path.abspath(os.path.dirname(sys.argv[0])) + '/media/' - where the Django development server goes to look for your static files
MEDIA_URL = '' # the URL dir through which your web server serves static pages and images

GMAPS_API_KEY = '' # like: a big long string of characters you get from Google

TEMP_DIR = '' # Like /tmp

ACCOUNT_ACTIVATION_DAYS = 7

DEFAULT_FROM_EMAIL=''
BCC_EMAIL='' # Addresses to blind carbon copy on each automated registration (SurveyMonkey)
EMAIL_HOST=''
EMAIL_PORT=610
EMAIL_HOST_USER=''
EMAIL_HOST_PASSWORD=''
EMAIL_USE_TLS = True

#COMPRESS = True #(just for dev)

COMPRESS_CSS = {}

COMPRESS_JS = {
    'gwst_or_rec': {
        'source_filenames':('third-party/GeoExt-0.6/widgets/MapPanel.js',	
            'third-party/GeoExt-0.6/data/LayerRecord.js',
            'third-party/GeoExt-0.6/data/LayerReader.js',
            'third-party/GeoExt-0.6/data/LayerStore.js',
            'third-party/GeoExt-0.6/data/ProtocolProxy.js',	
            'third-party/GeoExt-0.6/data/FeatureRecord.js',
            'third-party/GeoExt-0.6/data/FeatureReader.js',
            'third-party/GeoExt-0.6/data/FeatureStore.js',		
            'third-party/GeoExt-0.6/widgets/grid/FeatureSelectionModel.js',
            'third-party/ext-ux/multiselect/MultiSelect.js',
            'third-party/ext-ux/multiselect/DDView.js',
            'third-party/ext-ux/grid/RowActions.js',
            'js/settings.js', 
            'js/util.js', 
            'js/ResDrawApp.js', 
            'js/ResDrawManager.js',
            'js/data/ResFeatureStore.js', 
            'js/widgets/MainViewport.js', 
            'js/widgets/ResDrawMapPanel.js', 
            'js/widgets/WestPanel.js', 
            'js/widgets/WaitWindow.js', 
            'js/widgets/AllocPanel.js', 
            'js/widgets/PennyPanel.js', 
            'js/widgets/QuitWindow.js', 
            'js/widgets/BackContButtons.js', 
            'js/widgets/CustomButtons.js', 
            'js/widgets/Draw2Panel.js', 
            'js/widgets/DrawInstructionPanel.js', 
            'js/widgets/DrawOrDropPanel.js', 
            'js/widgets/SatisfiedShapePanel.js', 
            'js/widgets/DrawPanel.js', 
            'js/widgets/SelResPanel.js', 
            'js/widgets/DrawToolWindow.js', 
            'js/widgets/ShapeAttribPanel.js', 
            'js/widgets/ErrorWindow.js', 
            'js/widgets/SpeciesSelect.js', 
            'js/widgets/FinishedResourceSelectedWindow.js', 
            'js/widgets/SplashPanel.js', 
            'js/widgets/FinishPanel.js', 
            'js/widgets/SplashWindow.js', 
            'js/widgets/InvalidShapePanel.js', 
            'js/widgets/UnfinishedCheckWindow.js', 
            'js/widgets/UnfinishedResourceStartPanel.js', 
            'js/widgets/NavigatePanel.js', 
            'js/widgets/PennyWindow.js', 
            'js/widgets/YesNoButtons.js', 
            'js/widgets/QuitCheckWindow.js'), 
        'output_filename': 'compressed/gwst_or_rec.js'
    }
}