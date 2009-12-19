Ext.namespace('gwst');

/*
gwst.ResDrawManager- manages resource drawing process including user information, user groups,
shapes and pennies.  Extends Ext.Observable providing event handling
*/
gwst.ResDrawManager = Ext.extend(Ext.util.Observable, {
    user:null,    		//The current user object
    curResource: null,  //Current resource user has selected
    viewport: null,  	//Reference to viewport container
    mapPanel: null,  	//Reference to map panel

    constructor: function(){
        gwst.ResDrawManager.superclass.constructor.call(this);
        this.addEvents('user-loaded');
        this.addEvents('resources-loaded');
        this.addEvents('res-shapes-loaded');
    },

    /* Initialize interface and fetch initial data from server */
    init: function(){   
    	this.startViewport();
        this.fetchUser();
        this.fetchResources();
        this.startSplash();
    },
 
    /* Render viewport with main widgets in border layout */
    startViewport: function() {
		this.viewport = new gwst.widgets.MainViewport({			
			mapPanelListeners: {'render': this.mapPanelCreated.createDelegate(this)}  //Give the viewport listeners to pass on to the map panel
		});
        //Viewport will render automatically to document body
    },
    
    /* Now that map panel exists we can hook into it */
    mapPanelCreated: function() {
    	this.mapPanel = Ext.getCmp('mappanel');
    	//Register resource shape completed handler
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
    
    /* Process the resource selection and continue on */
    contResSelect: function(obj, resource_rec) {
        this.curResource = resource_rec;
        this.startDraw();
    },
    
    backResSelect: function(){},
    
    startDrawInstruct: function() {},
    
    finishDrawInstruct: function() {},
    
    
    /* Load the draw panel and prepare map for drawing */
    startDraw: function() {
        if (!this.drawPanel) {
            this.drawPanel = new gwst.widgets.DrawPanel({
                xtype: 'gwst-draw-panel',
                resource: this.curResource.name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.drawPanel.on('draw-cont', this.contDraw.createDelegate(this));
        }
        this.viewport.setWestPanel(this.drawPanel);
        
        //Start resource Draw
        this.mapPanel.enableResDraw();
        
        //Add draw toolbar (cancel and redraw button) at top left of map panel
    },
       
    contDraw: function() {
        console.error('Need to implement Allocation');
    },
    
    backDraw: function() {},
    
    startPennyAlloc: function() {},
    
    finishPennyAlloc: function() {},
    
    finishDrawingProcess: function() {}
});