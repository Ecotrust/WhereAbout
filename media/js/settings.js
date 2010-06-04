Ext.namespace('gwst');

/*
    Class: gwst.settings
    
    Place all application level settings here including web service urls,
	various parameters, etc.  Third party overrides should go here too.
*/

gwst.settings = {
    /*adminEmail: 'fish@ecotrust.org',
    displayProjection: new OpenLayers.Projection("EPSG:900913"),
    unusedProjection: new OpenLayers.Projection("EPSG:4326"),
    equalAreaProjection: new OpenLayers.Projection("EPSG:3310"),

    //Loaded from server at runtime
    user: null,			//user settings
    interview: null, 	//interview settings
    group: null, 		//group settings
    region: null,		//region settings

    //Should be removed, provided by group object
    survey_group_id: null,
    survey_group_name: null,
    
    resourceStore: null,	//Ext JsonStore of available resources
    shapeStore: null		//GeoExt FeatureStore of user-drawn shapes
    */
    
    adminEmail: 'fish@ecotrust.org',
    step1text: '<b>1. Select one place you participated in the above activity during your last trip.  If this place is not in the lists below, move on to step two.</b>',
    step1CumulText: '<b>1. Select one place, in the lists below, you have participated in the above activity.  If this place is not in the lists below, move on to step two.</b>',
    zoomText: '',
    zoomImgText: '<img src="/site-media/images/help_nav.png"/>',
    navText: '<b>2. Use the navigation controls to zoom the map in and center it over the location of the activity.</b><br/> (<a href="/videos/navigating" target="_blank">Watch demonstration video</a>)',
    markerText: '<b>3. Place a marker on the map where the activity took place. Start by clicking the \'Add New Marker\' button on the map.</b> (<a href="/videos/markers" target="_blank">Watch demonstration video</a>)',
    polyDrawText: '<b>3. Draw the area on the map where the activity took place. Start by clicking the \'Draw New Area\' button on the map.</b> (<a href="/videos/areas" target="_blank">Watch demonstration video</a>)',
    markerImgText: '<img src="/site-media/images/help_point_steps.png">',
    polyImgText: '<img src="/site-media/images/help_draw_poly.png"/>',
    repeatPointText: '<b>4.Place markers on the rest of the locations you participated in this activity on your last trip, repeating steps 1-3 as needed.  Click \'Continue\' when you are done.</b>',
    repeatPolyText: '<b>4.Draw the rest of the areas you particpated in this activity on your last trip, repeating steps 1-3 as needed.  Click \'Continue\' when you are done.</b>',
    cumulRepeatPointText: '<b>4.Place markers on the rest of the locations you have participated in this activity, repeating steps 1-3 as needed.  Click \'Continue\' when you are done.</b>',
    cumulRepeatPolyText: '<b>4.Draw the rest of the areas you have particpated in this activity, repeating steps 1-3 as needed.  Click \'Continue\' when you are done.</b>',
    cityComboText: 'Oregon coast towns',
    placeComboText: 'Places of interest (parks, beaches, etc.)',

	point_panel_one_instructions: '<h2>Instructions</h2><p>In this next step, you will <u>place markers</u> on a map where you participated in the following activity:</p>',
	cumul_point_panel_one_instructions: '<h2>Instructions</h2><p>In this next step, you will <u>place markers</u> on a map for as many places as you can where you participated in the following activity:</p>',
	point_panel_two_instructions: '<h3>Example</h3><img class="example-img" src="/site-media/images/help_point_intro.jpg"><p>If you are not able to complete this step for this activity you can skip to the next one.</p><p>Click the \'Continue\' button</p>',    
    poly_panel_one_instructions: '<h2>Instructions</h2><p>In this next step, you will <u>draw</u> on a map the areas where you participated in the following activity:</p>',
    poly_panel_two_instructions: '<h3>Example</h3><img class="example-img" src="/site-media/images/help_poly_intro.jpg"><p>If you are not able to complete the step for an activity you can skip to the next one.</p><p>Click the \'Continue\' button</p>',
    
    shape_error_text: '<p class="error_text"><b>There was a problem</b> <img class="vab-img" src="/site-media/images/exclamation.png"></p>',
    shape_self_overlap_text: '<p>Your area is not valid because it overlaps itself (example below).</p> <img class="invalid-image" src="/site-media/images/invalid_bowtie.png">',
    shape_other_overlap_text: '<p>Your new area overlaps one of your other areas. They are not allowed to do this.</p>  <p>If you have two that border each other, just draw the second one along the edge of the first as best as you can.</p><img class="invalid-image" src="/site-media/images/invalid_overlap.png">',
    invalid_poly_text: '<p>Your area is not valid because it had less than 3 points.</p> <p>You probably accidentally double clicked and completed it before you were done.</p>',
    poly_too_large_text: '<p>Your area is not valid because it is too large. Please break it up into smaller areas.</p>',
    
    zoom_error_text: 'For accuracy reasons, you must zoom in further before drawing on the map.  Please zoom in and try again',    
    
    minimum_draw_zoom: 3
};

gwst.settings.urls = {
    user: '/user/',
	group_resources: '/group_resources/',
	shapes: '/shapes/',
	shape_validate: '/shape/validate/',
	region: '/region/',
    group_draw_settings: '/draw_settings/',   //URL to fetch runtime settings
    nav_help: '/video/navigation',
    draw_help: '/video/starting_drawing',
    draw_2_help: '/video/drawing',
    penny_help: '/video/allocating_pennies',
    statuses: '/statuses/',
    session: '/session/'
};

/*
    splash: '/gwst/splash/',
    tutorials: '/gwst/tutorials/',
    faq: '/gwst/faq/',
    sendPassword: '/gwst/user/sendpassword/',
    changePassword: '/gwst/user/changepassword/',
    newMPAForm: '/gwst/forms/create/mpa',
    // designationsService: '/gwst/domains/designations',
    submitNewMPA: '/gwst/mpa/create/',
    validateGeometry: '/validate_shape/',
    mpas: '/gwst/mpas/public/?srid=900913',
    editMPA: '/gwst/shape/edit/',
    // mpas: '/gwst/mpas/public'
    deleteMPA: '/gwst/shape/delete/',
    MPAKml: '/gwst/mpa/kml/',
    login: '/gwst/login/',
    logout: '/gwst/logout/',
    user: '/user/',
    index: '/gwst/',
    geoserver: '/gwst/geoserver/wfs/',
    mpaAttributes: '/gwst/shape/edit/',
    createArray: '/gwst/array/create/',
    // arrays : '/gwst/domains/arrays',
    addtoarray: '/gwst/mpa/addtoarray/',
    emptyarrays: '/gwst/arrays/getempty/',
    deleteArray: '/gwst/array/delete/',
    mpaImpactAnalysis: '/gwst/econ_analysis/mpa/
*/

Ext.Ajax.timeout = 120000;