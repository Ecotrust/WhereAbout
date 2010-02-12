Ext.namespace('gwst');

/*
    Class: gwst.settings
    
    Place all application level settings here including web service urls,
	various parameters, etc.  Third party overrides should go here too.
*/

gwst.settings = {
    adminEmail: 'fish@ecotrust.org',
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
};

gwst.settings.urls = {
    user: '/user/',
	group_resources: '/group_resources/',
	shapes: '/shapes/',
	shape_validate: '/shape/validate/',
	region: '/region/',
    group_draw_settings: '/draw_settings/',   //URL to fetch runtime settings
    nav_help: '/video/nav_help',
    draw_help: '/video/draw_help',
    draw_2_help: '/video/draw_2_help',
    penny_help: '/video/penny_help'
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