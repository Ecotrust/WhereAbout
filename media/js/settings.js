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
    shapeStore: null,		//GeoExt FeatureStore of user-drawn shapes
    otherResourceShapeStore: null,		//GeoExt FeatureStore of user-drawn shapes for non-current resource
    
    resource_days: null,    //number of days user targeted specific resource
    
    cityComboText: 'California coast towns',
    placeComboText: 'Access Points (north to south)',
    alphPlaceComboText: 'Access Points (alphabetical)',
    primaryPtText: '<b style="panel_instruct">Select from one of the lists below the location of your PRIMARY access point for this diving/fishing area.</b>'
};

gwst.settings.urls = {
    user: '/user/',
	group_resources: '/group_resources/',
	shapes: '/shapes/',
	shape_validate: '/shape/validate/',
	region: '/region/',
    group_draw_settings: '/draw_settings/',   //URL to fetch runtime settings
    answers: '/answers/',    //retrieve or post 1 answer to db
    questions: '/group_qs/',
    resource_questions: '/answer_resource_questions/',
    abalone_card_sites: '/abalone_card_sites/json/'
};

Ext.Ajax.timeout = 120000;