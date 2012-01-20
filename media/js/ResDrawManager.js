Ext.namespace('gwst');

/*
gwst.ResDrawManager- manages resource drawing process including user information, user groups,
shapes and pennies.  Extends Ext.Observable providing event handling
*/
gwst.ResDrawManager = Ext.extend(Ext.util.Observable, {
    user:null,    		//The current user object
    curResource: null,  //Current resource user has selected
    lastShapeSaved: true,   //tracks whether old shape should be removed before adding a new shape
    validateEdit: false,    //Was validation called on a feature being edited?
    curSaveRecord: null,   //Current feature getting saved
    curDeleteRecord: null, //Current feature getting deleted
    curUpdateRecord: null, //Current feature getting updated
    studyRegion: null,	//Current study region
    viewport: null,  	//Reference to viewport container
    mapPanel: null,  	//Reference to map panel
    layerWin: null,		//Map layers window
    layerWinOffset: [-8, 8],	//Offset from top right to render
    quitWinOffset: [308, 8],	//Offset from top left to render
    drawWinOffset: [480, 8],
    copyWinOffset: [666, 8],	//Offset from top left to render
    drawLineWinOffset: [636, 8],	//Offset from top left to render
    drawPointWinOffset: [793, 8],	//Offset from top left to render
    drawToolWinOffset: [950, 8],	//Offset from top left to render

    constructor: function(){
        gwst.ResDrawManager.superclass.constructor.call(this);
        this.addEvents('settings-loaded');
        this.addEvents('res-shapes-loaded');
        this.addEvents('shape-saved');
        this.mapPanelListeners = {
            'render': this.mapPanelCreated.createDelegate(this),
            'resize': this.mapResized.createDelegate(this)
        };
        this.wktParser = new OpenLayers.Format.WKT();
    },

    /* Fetch server side settings and initialize the interface
     * once loaded
     */
    startInit: function(){
        this.createError();
    	this.on('settings-loaded', this.finInit, this);
    	this.on('shape-saved', this.startAnotherShapeStep, this);
        this.fetchSettings();
        this.loadWait('While the drawing tool loads');
    },               

    finInit: function() {
        this.hideWait();
        this.loadViewport();
        this.startSplashStep();  
        this.loadQuitWin();
        this.mapPanel.showZoomPanel();
    },
        
    /******************** Top-level survey step handlers *******************/
    
    /*load unfinished resource tool if there is one */
    startSplashStep: function() {
        if (this.curResource) {
            this.startUnfinishedResourceStartStep();
        } else {
            this.loadSplash();
        }
    },
    
    /* Finish splash and start resource selection */
    finSplashStep: function() {
        //If there is only one resource selected, why make them choose?
        if (gwst.settings.resourceStore.getTotalCount() == 1) {
            var species_id = gwst.settings.resourceStore.getAt(0).get('id');
            this.finResSelStep(this, species_id);
        } else {
            this.startResSelStep();
        }
    },
    
    /******************** Unfinished Resource Start Step *******************/
    
    startUnfinishedResourceStartStep: function() {
    	this.loadUnfinishedResourceStartPanel();
    },
    
    /* Finish splash and start resource selection */
    finUnfinishedResourceStartStep: function() {
        if (gwst.settings.shapeStore.getCount() > 0) {
            gwst.settings.shapeStore.removeListener('load', this.finUnfinishedResourceStartStep, this);
            this.startDraw2Step();
        } else {
            gwst.settings.shapeStore.on('load', this.finUnfinishedResourceStartStep, this);
        }
    },
    
    skipUnfinishedResourceStartStep: function () {
        this.loadUnfinishedCheck();
        this.curResource.set('started', false);
        
    },
    
    /******************** Resource Selection Step *******************/

    /*
     *  Setup resource selection step 
     */
    startResSelStep: function() {
        this.loadResSelPanel();
    },
    
    /* 
     * Process resource selection and go to Navigation instructions 
     */
    finResSelStep: function(obj, resource_id) {
        this.curResource = gwst.settings.resourceStore.getById(resource_id);
        if (this.curResource.get('finished') == true) {
            this.loadFinishedResourceSelectedWindow();
        } else {    
            this.startNavStep();
        }
    },
    
    /*
     *  Load and reopen the shape store for a previously finished resource
     */
    reopenResource: function() {
        this.curResource.set('finished', false);   
        this.loadShapeStore(this.mapPanel.getShapeLayer());
        this.finResSelWin.hide();
        this.startNavStep();
    },
    
    /*
     * Go back from resource selection to splash
     */
    backResSelStep: function(){
         this.loadSplash();
         this.startSplashStep();
    },
    
    /******************** Navigation Step *******************/
    
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
        this.startDraw2Step();
	},
	
	/*
	 * Go back from the navigation step to resource questions
	 */
    backNavStep: function() {
        //If there is only one resource selected, why make them choose?
        if (gwst.settings.resourceStore.getTotalCount() == 1) {
            var species_id = gwst.settings.resourceStore.getAt(0).get('id');
            this.loadSplash();
        } else {
            if (gwst.settings.shapeStore.getCount() == 0) {
                this.startResSelStep();
            } else {
                this.loadUnfinishedCheck();
            }
        }
	},    
    
    /******************** Draw Step *******************/
    
    /* 
     * Setup UI for resource drawing step 
     */
    startDrawStep: function() {  
        this.loadDrawPanel();        
    },
       
    /*
     * Process and finish draw step
     */
    finDrawStep: function() {
        this.drawWin.hide();
        this.drawLineWin.hide();
        this.drawPointWin.hide();
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
        this.mapPanel.disableResDraw();
    },    
    
    /*
     * Go back from draw step to resource selection
     */
    backDrawStep: function() {
        this.drawWin.hide();
        this.drawLineWin.hide();
        this.drawPointWin.hide();
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
        this.mapPanel.disableResDraw();
        this.loadNavPanel();    
    },
    
    /******************** Draw Step with Grid*******************/
    
    /* 
     * Setup UI for shape grid drawing step 
     */
    startDraw2Step: function() {
        this.loadDrawWin();
        this.loadDrawLineWin();
        this.loadDrawPointWin();
        this.validateEdit = false;
        if (gwst.settings.shapeStore.getCount() > 0) {
            this.loadDraw2Panel();        
        } else {
            this.startDrawStep();
        }
    },
       
    /*
     * Process and finish draw step
     */
    finDraw2Step: function() {
        this.drawWin.hide();
        this.drawLineWin.hide();
        this.drawPointWin.hide();
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
        this.mapPanel.disableResDraw();
        this.startFinishStep();
    },    
    
    /*
     * Go back from draw step to resource selection
     */
    backDraw2Step: function() {
        this.drawWin.hide();
        this.drawLineWin.hide();
        this.drawPointWin.hide();
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
        this.mapPanel.disableResDraw();  
        this.startNavStep();         
    },
    
    /******************** Copy Shape Step *******************/
    
    /*
     * Load up store for shapes for other resources
     */
    startCopyStep: function(){
        this.loadOtherResouceShapeStore(this.mapPanel.getOtherShapeLayer());
    },
    
    finCopyStep: function(record) {
        // this.mapPanel.vecOtherLayer.display(false);
        gwst.settings.otherResourceShapeStore.removeAll();
        this.resShapeComplete(record.get('feature'));
    },
    
    backCopyStep: function() {
        // this.mapPanel.vecOtherLayer.display(false);
        gwst.settings.otherResourceShapeStore.removeAll();
        this.startDraw2Step();
    },
    
    /******************** Edit Shape Step *******************/
    
    /* 
     * Setup UI for edit shape step 
     */
    startEditShapeStep: function(feature) {
        this.enableFeatureEdit();
        this.loadEditShapePanel();        
    },
       
    /*
     * Process and finish Edit Shape step
     */
    finEditShapeStep: function() {
        this.disableFeatureEdit();
        this.validateEdit = true;
        this.resShapeComplete(this.curSaveRecord.get('feature'));
    },
    
    /******************** Invalid Shape Step *******************/
    
    /* 
     * Setup UI for invalid shape error display step 
     */
    startInvalidShapeStep: function(status_code) {
        this.loadInvalidShapePanel(status_code);        
        this.mapPanel.disableResDraw(); //Turn off drawing
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
    },
       
    /*
     * Process and finish Invalid Shape step
     */
    finInvalidShapeStep: function() {
        if (this.validateEdit) {
            this.startEditShapeStep();
        } else {
            this.startDraw2Step();
        }
    },
    
    /******************** Satisfied with shape step *******************/
    
    /* 
     * Setup UI for satisfied with shape step 
     */
    startSatisfiedShapeStep: function(shape_obj) { 
        if (!this.lastShapeSaved) {
            this.mapPanel.removeLastShape();
        }
    	this.addValidatedShape(shape_obj.geom);
        this.lastShapeSaved = false;
        this.mapPanel.disableResDraw(); //Turn off drawing    	
        this.loadSatisfiedShapePanel();        
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
    },
       
    /*
     * Process and finish satisfied with shape step
     */
    finSatisfiedShapeStep: function(result) {
    	if (!result.satisfied) {
    		this.mapPanel.removeLastShape();
            this.startDraw2Step();
    	} else {
            this.startAttribStep();
        }
    },
    
    /******************** Shape Attribute Step *******************/
    
    /* 
     * Setup UI for Shape Attribute step 
     */
    startAttribStep: function() {
        this.loadAttribPanel();        
    },
       
    /*
     * Process and finish Shape Attribute step
     */
    finAttribStep: function(boundary_values_obj) {
        this.saveNewShape(boundary_values_obj);    
    },    
    
    backAttribStep: function() {
        this.mapPanel.removeLastShape();
        this.startDraw2Step();
    },
    
    
    /******************** draw another shape / drop penny steps *******************/
    
    /* 
     * Setup UI for draw another shape or drop penny step 
     */
    startAnotherShapeStep: function() {    
        this.startDraw2Step();
    },
       
    /******************** Finish Step *******************/
    
    /*
     * Load option panel to finish/finish later/select new resource 
     */
    startFinishStep: function() {
        this.curResource.set('finished', true);
        if (gwst.settings.resourceStore.getTotalCount() == 1) {
            var species_id = gwst.settings.resourceStore.getAt(0).get('id');
            this.loadSingleResFinishPanel();
        } else {
            this.loadFinishPanel();
        }
    },
    
    /*
     * Process finish/finish later/delect new resource step
     */
    finFinishStep: function() {
        this.finDrawingPhase();
    },
    
    /*
     * Go back from penny allocation to resource drawing
     */
    selNewResStep: function() {
        gwst.settings.shapeStore.removeAll();
        if (this.resSelPanel) {
            this.resSelPanel.resetSelect();
        }
        //If there is only one resource selected, why make them choose?
        if (gwst.settings.resourceStore.getTotalCount() == 1) {
            var species_id = gwst.settings.resourceStore.getAt(0).get('id');
            this.finResSelStep(this, species_id);
        } else {
            this.startResSelStep();
        }
        if (this.unfinishedCheckWin) {
            this.unfinishedCheckWin.hide();
        }
    },
    /*
     * Process completion of drawing phase
     */
    finDrawingPhase: function() {
    	window.location = "/group_status#main_menu";
    },
            
    /******************** UI widget handlers ********************/

    /* Render viewport with main widgets to document body (right now) */
    loadViewport: function() {
		this.viewport = new gwst.widgets.MainViewport({			
			mapPanelListeners: this.mapPanelListeners  //Give the viewport some listeners to pass on to the map panel
		});
    },    

    /* Load wait message window.  Tells the user an action is in progress.  Don't forget to hide it again. */
    loadWait: function(msg) {
        if (!this.wait_win) {
            this.wait_win = new gwst.widgets.WaitWindow();            
            this.wait_win.on(
                'show',
                (function(){this.wait_win.center();}).createDelegate(this)
            );            
        }
        this.wait_win.showMsg(msg);
    },
    
    /* Hide the wait window */
    hideWait: function() {
        this.wait_win.hide();
    },
    
    /* Create global error message window. */
    createError: function(msg) {
        if (!gwst.error) {
            gwst.error = new gwst.widgets.ErrorWindow();            
            gwst.error.on(
                'show',
                (function(){gwst.error.center();}).createDelegate(this)
            );            
        }
    },
    
    /* Create Go To Main Menu window*/
    loadQuitWin: function() {
    	if (!this.quitWin) {
			this.quitWin = new gwst.widgets.QuitWindow();
			this.quitWin.on('quit-button', this.loadQuitCheckWin, this);
		}
		this.quitWin.show();		
		this.quitWin.alignTo(document.body, "tl-tl", this.quitWinOffset);    	
    },
    
    /*Show window to check that user wants to leave */
    loadQuitCheckWin: function() {
        if (!this.quitCheckWin) {
            this.quitCheckWin = new gwst.widgets.QuitCheckWindow();
            this.quitCheckWin.on('main-menu', this.finDrawingPhase, this);
        }
        this.quitCheckWin.show();
    },
    
    /* Create Draw New Feature window*/
    loadDrawWin: function() {
    	if (!this.drawWin) {
			this.drawWin = new gwst.widgets.DrawPolyWindow();
			this.drawWin.on('draw-poly-clicked', this.mapPanel.enableResDraw, this.mapPanel);   //enable drawing
		}
		this.drawWin.show();		
		this.drawWin.alignTo(document.body, "tl-tl", this.drawWinOffset);    	
    },  
    
    /* Create Draw New Line window*/
    loadDrawLineWin: function() {
    	if (!this.drawLineWin) {
			this.drawLineWin = new gwst.widgets.DrawLineWindow();
			this.drawLineWin.on('draw-line-clicked', this.mapPanel.enableLineResDraw, this.mapPanel);   //enable line drawing
		}
		this.drawLineWin.show();		
		this.drawLineWin.alignTo(document.body, "tl-tl", this.drawLineWinOffset);    	
    },
    
    /* Create Draw New Point window*/
    loadDrawPointWin: function() {
    	if (!this.drawPointWin) {
			this.drawPointWin = new gwst.widgets.DrawPointWindow();
			this.drawPointWin.on('draw-point-clicked', this.mapPanel.enablePointResDraw, this.mapPanel);   //enable point drawing
		}
		this.drawPointWin.show();		
		this.drawPointWin.alignTo(document.body, "tl-tl", this.drawPointWinOffset);    	
    },

    /* Create Copy Feature window*/
    loadCopyWin: function() {
    	if (!this.copyWin) {
			this.copyWin = new gwst.widgets.CopyButtonWindow();
			this.copyWin.on('copy-button', this.startCopyStep, this);
		}
		this.copyWin.show();		
		this.copyWin.alignTo(document.body, "tl-tl", this.copyWinOffset);    	
    },
    
    /* Load the initial splash screen for the user */
    loadSplash: function() {  
    	if (!this.splashPanel) {
            this.splashPanel = new gwst.widgets.SplashPanel({
                xtype: 'gwst-splash-panel',
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name,
                res_group_name: gwst.settings.interview.resource_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.splashPanel.on('splash-cont', this.finSplashStep, this);
        } else {
            this.splashPanel.updateText({
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name,
                res_group_name: gwst.settings.interview.resource_name
            });
        }
        this.viewport.setWestPanel(this.splashPanel); 
    },
    
    /* Load the initial unfinished resource screen for the user */
    loadUnfinishedResourceStartPanel: function() {  
    	if (!this.unfinResStartPanel) {
            this.unfinResStartPanel = new gwst.widgets.UnfinishedResourceStartPanel({
                xtype: 'gwst-splash-panel',
                user_group: gwst.settings.group.member_title,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                res_group_name: gwst.settings.interview.resource_name,
                cur_resource: this.curResource.get('name'),
                user_group_desc: gwst.settings.group.description
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.unfinResStartPanel.on('unfin-res-start-cont', this.finUnfinishedResourceStartStep, this);
            this.unfinResStartPanel.on('unfin-res-start-skip', this.skipUnfinishedResourceStartStep, this);
        } else {
            this.unfinResStartPanel.updateText({
                user_group: gwst.settings.group.member_title,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                res_group_name: gwst.settings.interview.resource_name,
                cur_resource: this.curResource.get('name'),
                user_group_desc: gwst.settings.group.description
            });
        }
        this.viewport.setWestPanel(this.unfinResStartPanel); 
    },

    loadResSelPanel: function() {
    	if (!this.resSelPanel) {
            this.resSelPanel = new gwst.widgets.SelResPanel({
                xtype: 'gwst-sel-res-panel',
                res_group_name: gwst.settings.interview.resource_name,
                plural_res_group_name: gwst.settings.interview.resource_name_plural,
                user_group: gwst.settings.group.member_title,
                action: gwst.settings.interview.resource_action,
                shape_name: gwst.settings.interview.shape_name,
                contact_address: gwst.settings.adminEmail
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.resSelPanel.on('res-sel-cont', this.finResSelStep, this);
            this.resSelPanel.on('res-sel-back', this.backResSelStep, this);
        } else {
            this.resSelPanel.updateText({
                res_group_name: gwst.settings.interview.resource_name,
                plural_res_group_name: gwst.settings.interview.resource_name_plural,
                user_group: gwst.settings.group.member_title,
                action: gwst.settings.interview.resource_action,
                shape_name: gwst.settings.interview.shape_name,
                contact_address: gwst.settings.adminEmail
            });
        }
        this.viewport.setWestPanel(this.resSelPanel);    	
    },
    
    loadFinishedResourceSelectedWindow: function() {
        if (!this.finResSelWin) {
            this.finResSelWin = new gwst.widgets.FinishedResourceSelectedWindow({
                res_group_name: gwst.settings.interview.resource_name,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                cur_resource: this.curResource.get('name'),
                user_group_desc: gwst.settings.group.description
            });
            this.finResSelWin.on('edit-finished', this.reopenResource, this);
        } else {
            this.finResSelWin.updateWindow({
                res_group_name: gwst.settings.interview.resource_name,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                cur_resource: this.curResource.get('name'),
                user_group_desc: gwst.settings.group.description
            });
        }
        this.finResSelWin.show();
    },
    
    loadNavPanel: function() {
        if (!this.navPanel) {
            this.navPanel = new gwst.widgets.NavigatePanel({
                xtype: 'gwst-navigate-panel',
                resource: this.curResource.get('name'),
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            this.navPanel.on('nav-cont', this.finNavStep, this);
            this.navPanel.on('nav-back', this.backNavStep, this);
        } else {
            this.navPanel.updateText({
                resource: this.curResource.get('name'),
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.navPanel);    	
    },
	
    /*Prevent 'Back' from Nav if shapes are drawn*/
    loadUnfinishedCheck: function() {
        if (!this.unfinishedCheckWin) {
            this.unfinishedCheckWin = new gwst.widgets.UnfinishedCheckWindow({
                res_group_name: gwst.settings.interview.resource_name,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                resource_id: this.curResource.get('id'),
                user_group_desc: gwst.settings.group.description,
                cur_resource: this.curResource.get('name')
            });
            this.unfinishedCheckWin.on('unfin-okay', this.clearResourceShapes, this);
        } 
        this.unfinishedCheckWin.show();
    },
    
    /*delete all of the shapes for one user, for one group, for one resource*/
    clearResourceShapes: function() {
        var delete_config = {
            group_id: gwst.settings.survey_group_id,
            resource_id: this.curResource.id,
            action: 'DELETE'
        };
        this.deleteSavedShapes(delete_config);
        this.selNewResStep();

    },
    
    /* Load the draw west panel */
    loadDrawPanel: function() {
    	if (!this.drawPanel) {
            this.drawPanel = new gwst.widgets.DrawPanel({
                xtype: 'gwst-draw-panel',
                resource: this.curResource.get('name'),
                resource_id: this.curResource.get('id'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.drawPanel.on('draw-cont', this.finDrawStep, this);
            this.drawPanel.on('draw-back', this.backDrawStep, this);            
            this.drawPanel.on('draw-grid', this.loadDraw2Panel, this);
        } else {
            this.drawPanel.updateText({
                resource: this.curResource.get('name'),
                resource_id: this.curResource.get('id'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.drawPanel);    	
    },
    
    /* Load the shape grid draw west panel */
    loadDraw2Panel: function() {
    	if (!this.draw2Panel) {
            this.draw2Panel = new gwst.widgets.Draw2Panel({
                xtype: 'gwst-draw-two-panel',
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.draw2Panel.on('draw-two-cont', this.finDraw2Step, this);
            this.draw2Panel.on('draw-two-back', this.backDraw2Step, this);
            this.draw2Panel.on('draw-two-delete', this.deleteShapeHandler, this);
            this.draw2Panel.on('draw-two-zoom-shape', this.zoomMapToShape, this);
            this.draw2Panel.on('draw-two-zoom-all', this.zoomToAllShapes, this);
        } else {
            this.draw2Panel.updateText({
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.draw2Panel); 
    },
    
     /* Load the copy feature west panel */
    loadCopyPanel: function() {
        this.finDrawStep();
    	if (!this.copyPanel) {
            this.copyPanel = new gwst.widgets.CopyPanel({
                xtype: 'gwst-copy-panel',
                resource: this.curResource.get('name'),
                resource_name: gwst.settings.interview.resource_name,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.copyPanel.on('copy-cont', this.finCopyStep, this);
            this.copyPanel.on('copy-back', this.backCopyStep, this);
            this.copyPanel.on('copy-zoom-shape', this.zoomMapToOtherResourceShape, this);
            this.copyPanel.on('copy-zoom-all', this.zoomToAllOtherShapes, this);
        } else {
            this.copyPanel.updateText({
                resource: this.curResource.get('name'),
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.copyPanel);    	
    },
    
    /* Load the shape grid draw west panel */
    loadEditShapePanel: function() {
    	if (!this.editShapePanel) {
            this.editShapePanel = new gwst.widgets.EditShapePanel();
            //When panel fires event saying it's all done, we want to process it and move on 
            this.editShapePanel.on('redraw-edit-act', this.redrawEditShape, this);
            this.editShapePanel.on('save-edit-act', this.finEditShapeStep, this);
        }
        this.viewport.setWestPanel(this.editShapePanel); 
    },
    
    /* Create draw tool window and connect events to the map panel */
    loadDrawToolWin: function() {
    	if (!this.drawToolWin) {
			this.drawToolWin = new gwst.widgets.DrawToolWindow();
			this.drawToolWin.on('cancel-res-shape', this.mapPanel.cancelResShape, this.mapPanel);
		}
		this.drawToolWin.show();		
		this.drawToolWin.alignTo(document.body, "tl-tl", this.drawToolWinOffset);    	
    },
    
    /* Load the Invalid Shape west panel */
    loadInvalidShapePanel: function(status_code) {
    	if (!this.invalidShapePanel) {
            this.invalidShapePanel = new gwst.widgets.InvalidShapePanel({
                xtype: 'gwst-invalid-shape-panel',
                status_code: status_code,
                resource: this.curResource.get('name'),
                member_title: gwst.settings.group.member_title,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.invalidShapePanel.on('okay-btn', this.finInvalidShapeStep, this);
        } else {
            this.invalidShapePanel.updateText({
                status_code: status_code,
                resource: this.curResource.get('name'),
                member_title: gwst.settings.group.member_title,
                shape_name_plural: gwst.settings.interview.shape_name_plural,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.invalidShapePanel);    	
    },
    
    /* Load the satisfied with shape west panel */
    loadSatisfiedShapePanel: function() {
    	if (!this.satisfiedShapePanel) {
            this.satisfiedShapePanel = new gwst.widgets.SatisfiedShapePanel({
                xtype: 'gwst-satisfied-panel',
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.satisfiedShapePanel.on('satisfied', this.finSatisfiedShapeStep, this);
            this.satisfiedShapePanel.on('edit-shape', this.startEditShapeStep, this);
        } else {
            this.satisfiedShapePanel.updateText({
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.satisfiedShapePanel);    	
    },
    
    /* Load the shape attribute west panel */
    loadAttribPanel: function() {
    	if (!this.shapeAttribPanel) {
            this.shapeAttribPanel = new gwst.widgets.ShapeAttribPanel({
                xtype: 'gwst-shape-attrib-panel',
                shape_name: gwst.settings.interview.shape_name,
                resource: this.curResource.get('name')
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.shapeAttribPanel.on('shape-attrib-cont', this.finAttribStep, this);
            this.shapeAttribPanel.on('shape-attrib-back', this.backAttribStep, this);
    		// this.shapeAttribPanel.on('place-selected', this.zoomToPlacemark, this);
        } else {
            this.shapeAttribPanel.update({
                shape_name: gwst.settings.interview.shape_name,
                resource: this.curResource.get('name')
            });
        }
        this.viewport.setWestPanel(this.shapeAttribPanel);    	
    },
    
    /* Load the finish/finish later/select another resource west panel */
    loadFinishPanel: function() {
    	if (!this.finishPanel) {
            this.finishPanel = new gwst.widgets.FinishPanel({
                xtype: 'gwst-finish-panel',
                res_group_name: gwst.settings.interview.resource_name,
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.finishPanel.on('finish-map', this.finFinishStep, this);
            this.finishPanel.on('select-another', this.selNewResStep, this);            
        } else {
            this.finishPanel.updateText({
                res_group_name: gwst.settings.interview.resource_name,
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.finishPanel);    	
    },
    
    /* Load the finish/continue mapping west panel */
    loadSingleResFinishPanel: function() {
    	if (!this.singleResFinishPanel) {
            this.singleResFinishPanel = new gwst.widgets.SingleResFinishPanel({
                xtype: 'gwst-finish-panel',
                res_group_name: gwst.settings.interview.resource_name,
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.singleResFinishPanel.on('finish-map', this.finFinishStep, this);
            this.singleResFinishPanel.on('continue-mapping', this.selNewResStep, this);
        } else {
            this.singleResFinishPanel.updateText({
                res_group_name: gwst.settings.interview.resource_name,
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.singleResFinishPanel);    	
    },
        
    /******************** Event Handlers ********************/

    /* 
     * Listen for map panel creation and then create hooks into it and setup 
     * additional map-related widgets 
     */
    mapPanelCreated: function() {
    	this.mapPanel = Ext.getCmp('mappanel');
    	this.loadShapeStore(this.mapPanel.getShapeLayer());
    	gwst.settings.layerStore = this.mapPanel.getLayerStore();    	
    	this.mapPanel.on('res-shape-started', this.resShapeStarted, this);
    	this.mapPanel.on('res-shape-complete', this.resShapeComplete, this);
    },
    
    zoomToPlacemark: function(place_rec) {
    	this.mapPanel.zoomToPoint(place_rec.get('feature'));
    },

    /*
     * Listen for map resizing and update the map layer window position each time
     */
    mapResized: function() {
    	if (this.layerWin) {
    		this.layerWin.alignTo(document.body, "tr-tr", this.layerWinOffset);
    	}
    },    
    
    zoomMapToShape: function(record) {
        this.mapPanel.zoomToResShape(record.get('feature'));
    },
    
    zoomMapToOtherResourceShape: function(record) {
        this.mapPanel.zoomToOtherResShape(record.get('feature'));
    },

    zoomToAllShapes: function(record) {
        this.mapPanel.zoomToAllShapes();
    },   

    zoomToAllOtherShapes: function(record) {
        this.mapPanel.zoomToAllOtherShapes();
    },
    
    /*
     * Handler for user starting a shape
     */
    resShapeStarted: function() {
    	this.loadDrawToolWin();
    },       
    
    /*
     * Handler for user completing a shape
     */
    resShapeComplete: function(feature) {
    	//Validate the feature
        this.drawWin.hide();
        this.drawLineWin.hide();
        this.drawPointWin.hide();
        this.validateShape({
            geometry: feature.geometry,
            resource: gwst.settings.survey_group_id+'-'+this.curResource.id
         });
    },
    
    /*
     * Handler for user deleting a shape
     */
    deleteShapeHandler: function(record) {
        this.deleteSavedShape(record);    
    },

    //Keep track of latest shape added to the shape store
    trackNewShape: function(store, records, index) {
    	if (records.length == 1) {
    		this.curSaveRecord = records[0];
    	} else {
    		console.error('More than one record added!');
    	}
    },    
    
    //Given a LayerRecord, toggle the layers visibility
    mapLayerToggled: function(sm, rowIndex, record) {
		var lyr = record.get('layer');
		if (lyr.getVisibility() == false) {
			lyr.setVisibility(true);
		} else {
			lyr.setVisibility(false);
		}
	},
    
    /******************** Feature Handlers ********************/

    enableFeatureEdit: function() {
        this.mapPanel.modifyShape(this.curSaveRecord.get('feature'));
    },
    
    disableFeatureEdit: function() {
        this.mapPanel.finModifyShape();
    },
    
    redrawActivity: function() {
        this.mapPanel.removeLastShape();
    	this.startDraw2Step();
    },    
    
    redrawEditShape: function() {
        this.disableFeatureEdit();
        this.redrawActivity();
    },
    
    /******************** Server Operations ********************/

    /* Fetch interview info for current user group including resources,
     * region and common terms
     */
    fetchSettings: function() {
        Ext.Ajax.request({
        	url: gwst.settings.urls.group_draw_settings+gwst.settings.survey_group_id+'/json',
           	disableCachingParam: true,
           	scope: this,
           	success: this.finFetchSettings,
           	failure: function(response, opts) {
        		//Change to error window
              	alert('Res group request failed: ' + response.status);
           	}
        });		
    },
    
    finFetchSettings: function(response, opts) {
        var settings_obj = Ext.decode(response.responseText);        
        //Update local settings
        Ext.apply(gwst.settings, settings_obj);

        this.loadResourceStore(gwst.settings.group.sel_resources);
        this.loadUnfinishedResource();
        this.testShapeValidate();
    },
    
    testShapeValidate: function() {
    
        var test_poly_origin = new OpenLayers.Geometry.Point(0,0);
        var test_poly = OpenLayers.Geometry.Polygon.createRegularPolygon(test_poly_origin, 1, 3, 0);
    
        Ext.Ajax.request({
	        url: gwst.settings.urls.shape_validate,
	        method: 'POST',
	        disableCachingParam: true,
	        params: { 
	            geometry : test_poly.toString(),
	            resource : gwst.settings.survey_group_id+'-'+ gwst.settings.resourceStore.getAt(0).get('id')
	        },
	        success: this.finTestShapeValidate,
           	failure: function(response, opts) {
        		this.finTestShapeValidate(response, opts);
           	},
            scope: this
	    });
    },
    
    finTestShapeValidate: function(response, opts) {
    
        this.fireEvent('settings-loaded');      
    },
    
    loadUnfinishedResource: function() {
    	gwst.settings.resourceStore.each(function(r) {
        	if (r.get('started') && !r.get('finished')) {
        		this.curResource = r;
        		return false;
        	}
    	}, this);   
    	return;
    },
    
    validateShape: function(config) {
        this.loadWait('Validating your ' + gwst.settings.interview.shape_name);
    	Ext.Ajax.request({
	        url: gwst.settings.urls.shape_validate,
	        method: 'POST',
	        disableCachingParam: true,
	        params: { 
	            geometry : config.geometry.toString(),
	            resource : config.resource,
	            orig_shape_id : config.orig_shape_id
	        },
	        success: this.finValidateShape,
           	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait();
              	gwst.error.load('An unknown error has occurred while trying to validate your '+gwst.settings.interview.shape_name+'.  Please try again and notify us if this keeps happening.');
           	},
            scope: this
	    });
    },

    /* Processes the result of validateShape */
    finValidateShape: function(response, opts) {
        this.hideWait();
        var clip_obj = Ext.decode(response.responseText);
        var status_code = parseFloat(clip_obj.status_code);
        if (status_code == 0 || status_code == 1) {        	
            this.startSatisfiedShapeStep(clip_obj);
        } else if (status_code > 1){
        	this.startInvalidShapeStep(status_code);	
        } else {
        	gwst.error.load('An unknown error has occurred while trying to validate your '+gwst.settings.interview.shape_name+'.  Please try again and notify us if this keeps happening.');
        }        
    },       
    
    saveNewShape: function(boundary_values_obj) {        
    	this.loadWait('Saving');

        var data = {
            geometry: this.curSaveRecord.get('feature').geometry.toString(),
            group_id: gwst.settings.survey_group_id,
            resource_id: this.curResource.id
        };
        
        Ext.apply(data, boundary_values_obj);
        
    	Ext.Ajax.request({
	        url: gwst.settings.urls.shapes,
	        method: 'POST',
	        disableCachingParam: true,
	        params: {feature: Ext.util.JSON.encode(data)},
	        success: this.finSaveNewShape,
           	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait.defer(500, this);
              	gwst.error.load('An unknown error has occurred while trying to save your '+gwst.settings.interview.shape_name+'.  Please try again and notify us if this keeps happening.');
           	},
            scope: this
	    });                	
    },     
    
    finSaveNewShape: function(response) {
        this.lastShapeSaved = true;
    	var new_feat = Ext.decode(response.responseText);
    	//Update the new record with its unique id assigned on the server
    	//This will let us update it later
    	this.curSaveRecord.set('id', new_feat.feature.id);
    	this.hideWait.defer(500, this);
    	this.fireEvent('shape-saved');
    	gwst.settings.shapeStore.commitChanges();
    },
    
    //Remove a shape already saved on the server
    deleteSavedShape: function(record) {
        this.loadWait('Removing your '+this.curResource.get('name')+' '+gwst.settings.interview.shape_name);
        this.curDeleteRecord = record;
        Ext.Ajax.request({
            url: gwst.settings.urls.shapes+record.get('id'),
            method: 'POST',
            disableCachingParam: true,
            params: {action: 'DELETE'},
            success: this.finDeleteSavedShape,
         	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait.defer(500, this);
              	gwst.error.load('An unknown error has occurred while trying to delete your '+gwst.settings.interview.shape_name+'.  Please try again and notify us if this keeps happening.');
           	},
            scope: this
	    });           
    },
    
    finDeleteSavedShape: function(response) {
    	this.hideWait.defer(500, this);
    	if (!this.curDeleteRecord) {
    		console.error('No record to delete!');
    	}
        gwst.settings.shapeStore.remove(this.curDeleteRecord);        
        this.curDeleteRecord = null;
        //Refresh the grids so that the rows are re-numbered
        if (this.draw2Panel) {
    		this.draw2Panel.refresh();
    	}
    },
    
    deleteSavedShapes: function(delete_config){   
        this.loadWait('Deleting');
        
        Ext.Ajax.request({
            url: gwst.settings.urls.shapes,
            method: 'POST',
            disableCachingParam: true,
            params: delete_config,
            success: this.finDeleteSavedShapes,
            failure: function(id_obj, opts) {
                //change to error window
                this.hideWait.defer(500, this);
                gwst.error.load('An unknown error has occurred while trying to delete your '+gwst.settings.interview.shape_name+'.  Please try again and notify us if this keeps happening.');
            },
            scope: this
        });
    },
    
    finDeleteSavedShapes: function(id_obj) {
    	this.hideWait.defer(500, this);
    },
    
    //if not resource specific, use ''
    getAnswer: function(question_code, resource, func) {
        if (resource == "") {
            this.params = {
                question_code : question_code
            };
        } else {
            this.params = {
                question_code : question_code,
                resource : resource
            };
        }
        Ext.Ajax.request({
        	url: gwst.settings.urls.answers,
           	disableCachingParam: true,
            method: 'GET',
            params: this.params,
           	scope: this,
           	success: func,
           	failure: function(response, opts) {
        		// Change to error window
              	alert('get answer request failed: ' + response.status);
           	}
        });		
        
    },
        
    finGetAnswer: function(response, opts) {
        this.answer_obj = Ext.decode(response.responseText);
    },
    
    //if not resource specific, use ''
    postAnswer: function(code, val, resource) {
        if (resource == "") {
            this.params = {
                question_code : code,
                value : val
            };
        } else {
            this.params = {
                question_code : code,
                value : val,
                resource : resource
            };
        }
        Ext.Ajax.request({
        	url: gwst.settings.urls.answers,
           	disableCachingParam: true,
            method: 'POST',
            params: this.params,
           	scope: this,
           	success: this.finPostAnswer,
           	failure: function(response, opts) {
        		// Change to error window
              	alert('post answer request failed: ' + response.status);
           	}
        });		
    },
        
    finPostAnswer: function(response, opts) {
        this.answer_obj = Ext.decode(response.responseText);
    },
    
    getQuestionForm: function(group, func) {
        this.params = {
            group : group,
            request_source : 'Draw Manager'
        };
        
        this.loadWait('Gathering questions');

        Ext.Ajax.request({
        	url: gwst.settings.urls.questions + group + '/answer/',
           	disableCachingParam: true,
            method: 'GET',
            params: this.params,
           	scope: this,
           	success: func,
           	failure: function(response, opts) {
        		// Change to error window
                this.hideWait.defer(500, this);
              	alert('get answer request failed: ' + response.status);
           	}
        });		
    },
    
    finGetQuestionForm: function(response, opts){
        this.hideWait.defer(500, this);
        gwst.settings.question_form = Ext.decode(response.responseText);
    },

    /******************** Utility Methods ********************/
    
    loadResourceStore: function(resources) {
        //Initialize resource store
        this.ResourceRecord = Ext.data.Record.create([
	       {name: 'id'},
	       {name: 'name'},
	       {name: 'started', type: 'boolean'},
	       {name: 'finished', type: 'boolean'}
	   ]);
        var reader = new Ext.data.JsonReader(
            {id: 'id'}, 
            this.ResourceRecord
        );
        gwst.settings.resourceStore = new Ext.data.Store({
            reader:  reader
        });                           
        gwst.settings.resourceStore.loadData(resources);
    },

    _getResourceUrl: function(otherResources) {
    	var service_url = gwst.settings.urls.shapes+'?group_id='+gwst.settings.survey_group_id;
    	if (this.curResource && this.curResource.id) {
    		service_url += '&resource_id='+this.curResource.id;
            if (otherResources) {
                service_url += '&all_other_resources=true';
            }
    	}
        return service_url;
    },
    
    _createResourceProxy: function(otherResources) {
        var prxy = new GeoExt.data.ProtocolProxy({
            protocol: new OpenLayers.Protocol.HTTP({
                url: this._getResourceUrl(otherResources),
                format: new OpenLayers.Format.GeoJSON()
            })
        })
        return prxy;
    },
    
    loadShapeStore: function(shapeLayer) {
	    if (!gwst.settings.shapeStore) {
            var autoLoad = false;
            if (this.curResource && this.curResource.id) {
                autoLoad = true;
            }
            gwst.settings.shapeStore = new gwst.data.ResFeatureStore({
                layer: shapeLayer, 	        
                proxy:  this._createResourceProxy(),
                fields: [{
                    name:'id',
                    type: 'string',
                    defaultValue: ''
                },{
                    name: 'boundary_n',
                    type: 'string',
                    defaultValue: ''
                },{
                    name: 'boundary_s',
                    type: 'string',
                    defaultValue: ''
                },{
                    name: 'boundary_e',
                    type: 'string',
                    defaultValue: ''
                },{
                    name: 'boundary_w',
                    type: 'string',
                    defaultValue: ''
                }],	        
                autoLoad: autoLoad  
            });
            
            //If we're autoloading, don't listen for load event until after its preloaded, otherwise start listening now
            if (autoLoad) {
                //Zoom to all on load
                gwst.settings.shapeStore.on('load', this.afterShapesLoaded, this);
                gwst.settings.shapeStore.on('load', this.configShapeStore, this);
            } else {
                this.configShapeStore();
            }
        } else {
            gwst.settings.shapeStore.on('load', this.afterShapesLoaded, this);
            gwst.settings.shapeStore.proxy = this._createResourceProxy();
            gwst.settings.shapeStore.reload();
        }
	    
    },
    
    loadOtherResouceShapeStore: function(shapeLayer) {
	    if (!gwst.settings.otherResourceShapeStore) {
            var autoLoad = false;
            if (this.curResource && this.curResource.id) {
                autoLoad = true;
            }
            gwst.settings.otherResourceShapeStore = new gwst.data.ResFeatureStore({
                layer: shapeLayer, 	        
                proxy:  this._createResourceProxy(true),
                fields: [{
                    name:'id',
                    type: 'string',
                    defaultValue: ''
                },{
                    name: 'boundary_n',
                    type: 'string',
                    defaultValue: ''
                },{
                    name: 'boundary_s',
                    type: 'string',
                    defaultValue: ''
                },{
                    name: 'boundary_e',
                    type: 'string',
                    defaultValue: ''
                },{
                    name: 'boundary_w',
                    type: 'string',
                    defaultValue: ''
                }],	        
                autoLoad: autoLoad  
            });
            
            //If we're autoloading, don't listen for load event until after its preloaded, otherwise start listening now
            if (autoLoad) {
                // Zoom to all on load
                gwst.settings.otherResourceShapeStore.on('load', this.afterOtherResourceShapesLoaded, this);
                gwst.settings.otherResourceShapeStore.on('load', this.configOtherResourceShapeStore, this);
            } else {
                this.configOtherResourceShapeStore();
            }
        } else {
            gwst.settings.otherResourceShapeStore.on('load', this.afterOtherResourceShapesLoaded, this);
            gwst.settings.otherResourceShapeStore.proxy = this._createResourceProxy(true);
            gwst.settings.otherResourceShapeStore.reload();
        }
	    
    },

    //remove listener and zoom in - listener removed because 'load' is firing when a new shape is drawn and saved.
    afterShapesLoaded: function() {
        this.zoomToAllShapes();
        gwst.settings.shapeStore.removeListener('load', this.afterShapesLoaded, this);
    },
    
    //remove listener and zoom in - listener removed because 'load' is firing when a new shape is drawn and saved.
    afterOtherResourceShapesLoaded: function() {
        if (gwst.settings.otherResourceShapeStore.getCount() > 0) {
            this.zoomToAllOtherShapes();
            gwst.settings.otherResourceShapeStore.removeListener('load', this.afterOtherResourceShapesLoaded, this);
            this.loadCopyPanel();
        } else {
            gwst.error.load('You have no other '+gwst.settings.interview.shape_name_plural+' drawn.');
        }
    },
    
    //Once store has been initially loaded, add events to handle adding and updating of records.
    configShapeStore: function() {
        gwst.settings.shapeStore.removeListener('load', this.configShapeStore, this);
    	gwst.settings.shapeStore.on('add', this.trackNewShape, this);
    	// gwst.settings.shapeStore.on('update', this.updateSavedShape, this);    	
    },
    
    //Once Other Resources store has been initially loaded, add events to handle selecting of records.
    configOtherResourceShapeStore: function() {
        gwst.settings.otherResourceShapeStore.removeListener('load', this.configOtherResourceShapeStore, this);
    	gwst.settings.otherResourceShapeStore.on('add', this.trackNewShape, this);
    	// gwst.settings.otherResourceShapeStore.on('update', this.updateSavedShape, this);    	
    },
    
    //Add a freshly validated shape to the map
    addValidatedShape: function(wkt) {
    	var vec = this.wktParser.read(wkt);
    	this.mapPanel.addShape(vec);
    }
    
});