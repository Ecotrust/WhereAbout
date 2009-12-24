Ext.namespace('gwst');

/*
gwst.ResDrawManager- manages resource drawing process including user information, user groups,
shapes and pennies.  Extends Ext.Observable providing event handling
*/
gwst.ResDrawManager = Ext.extend(Ext.util.Observable, {
    user:null,    		//The current user object
    curResource: null,  //Current resource user has selected
    studyRegion: null,	//Current study region
    viewport: null,  	//Reference to viewport container
    mapPanel: null,  	//Reference to map panel
    layerWin: null,		//Map layers window
    layerWinOffset: [-8, 8],	//Offset from top right to render
    drawToolWinOffset: [308, 8],	//Offset from top left to render

    constructor: function(){
        gwst.ResDrawManager.superclass.constructor.call(this);
        this.addEvents('user-loaded');
        this.addEvents('resources-loaded');
        this.addEvents('res-shapes-loaded');
        this.mapPanelListeners = {
        		'render': this.mapPanelCreated.createDelegate(this),
        		'resize': this.mapResized.createDelegate(this)
        };
    },

    /* Get this thing started */
    init: function(){   
    	this.loadViewport();
        this.fetchUser();
        this.fetchGroupDrawSettings();
        this.startSplashStep();
    },               

    /******************** Top-level survey step handlers *******************/
    
    startSplashStep: function() {
    	this.loadSplash();
    },
    
    /* Finish splash and start resource selection */
    finSplashStep: function() {
    	this.splash_win.hide();
    	this.startResSelStep();
    },
    
    /*
     *  Setup resource selection step 
     */
    startResSelStep: function() {
        this.loadResSelPanel();
    },
    
    /* 
     * Process resource selection and go to Navigation instructions 
     */
    finResSelStep: function(obj, resource_rec) {
        this.curResource = resource_rec;
        this.startNavStep();
    },
    
    /*
     * Go back from resource selection to splash
     */
    backResSelStep: function(){
         this.loadSplash();
    },
    
	/*
	 * setup the navigation step
	 */
    startNavStep: function() {
        this.loadNavPanel();
	},    
	
	/*
	 * Finish navigation and go to Draw Step
	 */
    finNavStep: function() {
        this.startDrawStep();
	},
	
	/*
	 * Go back from the navigation step to resource selection
	 */
    backNavStep: function() {
        this.loadResSelPanel();
	},    
    
    /* 
     * Setup UI for resource drawing step 
     */
    startDrawStep: function() {
        this.loadDrawPanel();        
        this.mapPanel.enableResDraw(); //Turn on drawing
        this.loadDrawToolWin();
    },
       
    /*
     * Process and finish draw step
     */
    finDrawStep: function() {
        //this.mapPanel.disableResDraw();  //Turn off drawing?
        this.drawToolWin.hide();
        this.startAllocStep();
    },
    
    /*
     * Go back from draw step to resource selection
     */
    backDrawStep: function() {
        this.drawToolWin.hide();
        this.loadNavPanel();    
    },
    
    /*
     * show basic instructions for penny use
     */
    startAllocStep: function() {
        this.loadAllocPanel();
    },
    
    /*
     * Cleanup allocation help step
     */
    finAllocStep: function() {
        this.startPennyAllocStep();
    },
    
    /*
     * Go back from allocation to resource drawing
     */
    backAllocStep: function() {
        this.loadDrawPanel();        
        this.mapPanel.enableResDraw(); //Turn on drawing
        this.loadDrawToolWin();
    },
    
    /*
     * Setup UI for penny allocation step
     */
    startPennyAllocStep: function() {
        this.loadPennyPanel();
    },
    
    /*
     * Process penny allocation step
     */
    finPennyAllocStep: function() {
        alert('Foo!');
    },
    
    /*
     * Go back from penny allocation to resource drawing
     */
    backPennyAllocStep: function() {
        this.loadAllocPanel();
    },
    
    /*
     * Process completion of drawing phase
     */
    finDrawingPhase: function() {},
        
    /******************** UI widget handlers ********************/

    /* Render viewport to document body (now) with main widgets in border layout. */
    loadViewport: function() {
		this.viewport = new gwst.widgets.MainViewport({			
			mapPanelListeners: this.mapPanelListeners  //Give the viewport some listeners to pass on to the map panel
		});
    },    

    /* Load the initial splash screen for the user */
    loadSplash: function() {
    	//MOVE INTO ITS OWN CLASS
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
            	   handler: this.finSplashStep.createDelegate(this),
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

    loadMapLayerWin: function() {    	
		this.layerWin = new Ext.Window({
	        html: 'Satellite Imagery<br/>Nautical Charts<br/>Lat/Lon Grid',
	        title: 'Extra Maps',
	        width: 180,
	        height: 80,
	        resizable: false,
	        collapsible: false,
	        draggable: false,
	        closable: false
	    });
		this.layerWin.show();		
		this.layerWin.alignTo(document.body, "tr-tr", this.layerWinOffset);		    			    	    
    },
    
    loadResSelPanel: function() {
    	if (!this.resSelPanel) {
            this.resSelPanel = new gwst.widgets.SelResPanel({
                xtype: 'gwst-sel-res-panel',
                res_group_name: 'Species'
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.resSelPanel.on('res-sel-cont', this.finResSelStep, this);
            this.resSelPanel.on('res-sel-back', this.backResSelStep, this);
        }
        this.viewport.setWestPanel(this.resSelPanel);    	
    },
	
    loadNavPanel: function() {
        if (!this.navPanel) {
            this.navPanel = new gwst.widgets.NavigatePanel({
                xtype: 'gwst-navigate-panel',
                resource: this.curResource
            });
            this.navPanel.on('nav-cont', this.finNavStep, this);
            this.navPanel.on('nav-back', this.backNavStep, this);
        }
        this.viewport.setWestPanel(this.navPanel);    	
    },
    
    /* Load the draw west panel */
    loadDrawPanel: function() {
    	if (!this.drawPanel) {
            this.drawPanel = new gwst.widgets.DrawPanel({
                xtype: 'gwst-draw-panel',
                resource: this.curResource
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.drawPanel.on('draw-cont', this.finDrawStep, this);
            this.drawPanel.on('draw-back', this.backDrawStep, this);            
        }
        this.viewport.setWestPanel(this.drawPanel);    	
    },
    
    /* Create draw tool window and connect events to the map panel */
    loadDrawToolWin: function() {
    	if (!this.drawToolWin) {
			this.drawToolWin = new gwst.widgets.DrawToolWindow();
			this.drawToolWin.on('redo-res-shape', this.mapPanel.redoResShape, this.mapPanel);
			this.drawToolWin.on('cancel-res-shape', this.mapPanel.cancelResShape, this.mapPanel);
		}
		this.drawToolWin.show();		
		this.drawToolWin.alignTo(document.body, "tl-tl", this.drawToolWinOffset);    	
    },
    
     /* Load the alloc west panel */
    loadAllocPanel: function() {
    	if (!this.allocPanel) {
            this.allocPanel = new gwst.widgets.AllocPanel({
                xtype: 'gwst-alloc-panel',
                resource: this.curResource
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.allocPanel.on('alloc-cont', this.finAllocStep, this);
            this.allocPanel.on('alloc-back', this.backAllocStep, this);
        }
        this.viewport.setWestPanel(this.allocPanel);    	
    },
    
    /* Load the penny allocation west panel */
    loadPennyPanel: function() {
    	if (!this.pennyPanel) {
            this.pennyPanel = new gwst.widgets.PennyPanel({
                xtype: 'gwst-penny-panel',
                resource: this.curResource
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.pennyPanel.on('penny-cont', this.finPennyStep, this);
            this.pennyPanel.on('penny-back', this.backPennyStep, this);
        }
        this.viewport.setWestPanel(this.pennyPanel);    	
    },
    
    
    /******************** Event Handlers ********************/

    /* 
     * Listen for map panel creation and then create hooks into it and setup 
     * additional map-related widgets 
     */
    mapPanelCreated: function() {
    	this.mapPanel = Ext.getCmp('mappanel');
    	this.mapPanel.on('res-shape-drawn', this.resShapeDrawn, this)
    	this.loadMapLayerWin();
    },

    /*
     * Listen for map resizing and update the map layer window position each time
     */
    mapResized: function() {
    	if (this.layerWin) {
    		this.layerWin.alignTo(document.body, "tr-tr", this.layerWinOffset);
    	}
    },
    
    /*
     * Handler for user completing a shape
     */
    resShapeDrawn: function(shape_geometry) {
    	//Remove drawn listener?
    	//Show wait message
        this.clipGeometry({
            geometry: shape_geometry,
            resource: gwst.settings.survey_group_id+'-'+this.curResource.id,
            success: this.clipReview,
            error: this.clipError,
            fail: this.clipFail
         });
    },
        
    
    /******************** Server Operations ********************/
    
    /* Fetch user object from server */
    fetchUser: function() {
        Ext.Ajax.request({
           url: gwst.settings.urls.user,
           disableCachingParam: true,
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

    /* Fetch interview info for current user group including resources,
     * region and common terms
     */
    fetchGroupDrawSettings: function() {
        Ext.Ajax.request({
           url: gwst.settings.urls.group_draw_settings+gwst.settings.survey_group_id+'/json',
           disableCachingParam: true,
           scope: this,
           success: this.initGroupDrawSettings,
           failure: function(response, opts) {
              console.log('Res group request failed: ' + response.status);
           }
        });		
    },
    
    initGroupDrawSettings: function(response, opts) {
        var config = Ext.decode(response.responseText);        
        if (config.region) {            
            this.mapPanel.zoomToMapRegion(config.region);
        } else {
            console.error('Region not provided by server');
        }
        if (config.resources) {
            var res_fields = [
                {name: 'id', type: 'float'},
                {name: 'name'}
            ]
            var Resource = Ext.data.Record.create(res_fields);
            var reader = new Ext.data.JsonReader(
                {id: 'id'}, 
                Resource
            );
            console.log(reader.readRecords(config.resources));
            gwst.settings.resourceStore = new Ext.data.Store({
                reader:  reader
            });                           
            gwst.settings.resourceStore.loadData(config.resources);
            console.log(gwst.settings.resourceStore.getTotalCount());
            
        }
    },
    
    clipGeometry: function(config) {
    	Ext.Ajax.request({
	        url: gwst.settings.urls.validate_shape,
	        method: 'POST',
	        disableCachingParam: true,
	        params: { 
	            geometry : config.geometry.toString(),
	            resource : config.resource,
	            orig_shape_id : config.orig_shape_id
	        },
	        success: function(response, opts){
	            //Hide wait message
	            var clip_obj = Ext.decode(response.responseText);
	            var status_code = parseFloat(clip_obj.status_code);
	            if (status_code == 1 || status_code == 0 || status_code == 5) {
	                config.success(status_code, clip_obj.original_geom, clip_obj.clipped_mpa_geom);
	            } else if (status_code != 4){
	                config.error(status_code, config.geometry);
	            } else {
	                config.fail(response, opts);
	            }
	        },
	        failure: function(response, opts){
	            //Hide wait message
	            config.fail(response, opts);
	        }
	    });
    },
    
    clipReview: function(result) {
    	//Show the shape on the map and ask user if they are happy with it.
    	alert('Time to review your shape!');
    },    
    
    clipError: function(result) {
        gwst.actions.utils.changeMapToolbarMode([
             {
                 xtype: 'tbtext',
                 text: 'The shape you defined cannot be accepted'
             },
             {xtype: 'tbfill'},
             {
                 text: 'Go Back and Modify Shape',
                 geometry: original,
                 config: config,
                 handler: function(){
                     gwst.actions.utils.restoreMapToolbar();
                     gwst.actions.utils.clearGeometryChangeInfo();
                     this.config['geometry'] = this.geometry;
                     gwst.actions.utils.askUserToDefineGeometry(this.config);
                 }
             },
             {
                 text: 'Cancel',
                 iconCls: 'remove-icon',
                 handler: function(){
                     gwst.actions.utils.restoreMapToolbar();
                     gwst.actions.utils.clearGeometryChangeInfo();
                     gwst.actions.utils.enableComponents();
                     config['cancel']();
                 }
             }
        ]);
        gwst.actions.utils.showGeometryChangeInfo(gwst.copy.clippedGeometryStatus[status_code]);    	
    },
    
    clipFail: function(result) {
        gwst.ui.error.show({
            errorText: 'An unknown Server Error has Occurred while trying to clip your shape. If you were editing a geometry, that geometry will remain intact as it was before editing. If you were creating a new shape, you will have to start over. We have been notified of this problem.',
            logText: 'Error clipping shape'
        });
        gwst.actions.utils.enableComponents();    	
    },
    
    clipAccept: function(geometry, clipped) {
        $.ajax({
            data: {geometry:geometry, geometry_clipped:clipped, resource:target}, //form.serializeArray(),
            dataType: 'json',
            success: function(data, textStatus){
                mpa = gwst.data.mlpaFeatures.mpa_from_geojson(data);                       
                gwst.actions.utils.enableComponents();
                gwst.app.clientStore.add(mpa);
                gwst.app.selectionManager.setSelectedFeature(mpa);
            },
            error: function(request, textStatus, errorThrown){                       
                 gwst.ui.error.show({errorText: 'There was a problem saving your new MPA. This error will show up in our logs, but if the problem persists please follow up with an administrator.', debugText: request.responseText, logText: 'Error saving new shape'});
                 gwst.actions.utils.enableComponents();
            },
            type: 'POST',
            url: '/save_shape/'
         });                	
    }
});