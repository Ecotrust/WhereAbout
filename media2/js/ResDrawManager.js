Ext.namespace('gwst');

/*
gwst.ResDrawManager- manages resource drawing process including user information, user groups,
shapes and pennies.  Extends Ext.Observable providing event handling
*/
gwst.ResDrawManager = Ext.extend(Ext.util.Observable, {
    //The current user object
    user:null,

    constructor: function(){
        gwst.ResDrawManager.superclass.constructor.call(this);
        this.addEvents('user-loaded');
        this.addEvents('resources-loaded');
        this.addEvents('res-shapes-loaded');        
    },

    /* Initialize draw manager, fetching survey data from server */
    init: function(){   
    	this.startViewport();
        this.fetchUser();
        this.fetchResources();
        this.startSplash();
    },
 
    /* Render the initial viewport with a border layout and the map in the center panel */
    startViewport: function() {
		this.viewport = new gwst.widgets.MainViewport();
        //Viewport displays automatically
    },
    
    /* Fetch user object from server */
    fetchUser: function() {
        Ext.Ajax.request({
           url: gwst.settings.urls.user,
           scope: this,
           success: this.intUser,
           failure: function(response, opts) {
              console.log('User request failed: ' + response.status);
           }
        });		
    },
    
    /* Process user fetched from server */
    initUser: function(response, opts) {
        var user_obj = Ext.decode(response.responseText);
        if (user_obj) {
            this.fireEvent('res-groups-loaded', user_obj);
        }
    },
    
    /* Fetch resources from the server */
    fetchResources: function() {
        Ext.Ajax.request({
           url: gwst.settings.urls.group_resources+gwst.settings.survey_group_id,
           scope: this,
           success: this.initResources,
           failure: function(response, opts) {
              console.log('Res group request failed: ' + response.status);
           }
        });		
    },
    
    /* Process resources fetched from server */
    initResources: function(response, opts) {
        var resources_obj = Ext.decode(response.responseText);
        if (resources_obj) {
            this.fireEvent('resources-loaded', resources_obj);
        }
    },

    /* Load the initial splash screen for the user */
    startSplash: function() {
        this.splash_win = new Ext.Window({
            title: 'Introduction',
        	layout:'fit',
        	modal: true,
            width:350,
            height:130,
            closeAction:'hide',
            plain: true,
            bodyStyle: 'padding: 10px',
            html: "\
            	<p>The drawing portion will now begin for the <u><i>"+gwst.settings.survey_group_name+"</i></u> user group.  You will have instructions every step of the way \
            	on the left hand side of the screen.  You will also be able to come back and finish later \
            	if you need more time. \
            	",
            bbar: [
               {xtype:'tbfill', width:20},
               {
            	   text: 'Begin', 
            	   handler: this.finishSplash.createDelegate(this),
            	   iconCls: 'begin-draw',
            	   iconAlign: 'top'
               }
           ]
        });
    	
    	this.splash_win.on('show',(
    		function(){this.splash_win.center();}).createDelegate(this)
    	);
    	this.splash_win.show();
    },    

    /* Get this drawing portion going already! */
    finishSplash: function() {
    	this.splash_win.hide();
    	this.startResSelect();
    },
    
    /* Load the resource group selection panel */
    startResSelect: function() {
        if (!this.resSelPanel) {
            this.resSelPanel = new gwst.widgets.SelResPanel({
                xtype: 'gwst-sel-res-panel',
                res_group_name: 'Species'
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.resSelPanel.on('res-sel-cont', this.contResSelect.createDelegate(this));
        }
        this.viewport.setWestPanel(this.resSelPanel);
    },
    
    /* Process the resource group selection and move on */
    contResSelect: function(obj, species_rec) {
        console.log(species_rec);
    },
    
    startDrawInstruct: function() {
    
    },
    
    finishDrawInstruct: function() {
    
    },
    
    startDraw: function() {
    
    },
    
    finishDraw: function() {
    
    },
    
    startPennyAlloc: function() {
    
    },
    
    finishPennyAlloc: function() {
    
    },
    
    finishDrawingProcess: function() {
    
    }
});