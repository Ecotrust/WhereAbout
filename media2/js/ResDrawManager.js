Ext.namespace('gwst');

/*
gwst.ResDrawManager- manages resource drawing process including user information, user groups,
shapes and pennies.  Extends Ext.Observable providing event handling
*/
gwst.ResDrawManager = Ext.extend(Ext.util.Observable, {
    user:null,    		//The current user object
    curResource: null,  //Current resource user has selected
    curSaveRecord: null,   //Current feature getting saved
    curDeleteRecord: null, //Current feature getting deleted
    curUpdateRecord: null, //Current feature getting updated
    studyRegion: null,	//Current study region
    viewport: null,  	//Reference to viewport container
    mapPanel: null,  	//Reference to map panel
    layerWin: null,		//Map layers window
    layerWinOffset: [-8, 8],	//Offset from top right to render
    drawToolWinOffset: [308, 8],	//Offset from top left to render

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
    	this.on('settings-loaded', this.finInit, this);
    	this.on('shape-saved', this.loadAnotherShapePanel, this);
        this.fetchSettings();
        this.loadWait('While the drawing tool loads');
    },               

    finInit: function() {
        this.hideWait();
        this.loadViewport();
        this.startSplashStep();  
        this.createError();
    },
        
    /******************** Top-level survey step handlers *******************/
    
    startSplashStep: function() {
    	this.loadSplash();
    },
    
    /* Finish splash and start resource selection */
    finSplashStep: function() {
    	this.startResSelStep();
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
        this.startNavStep();
    },
    
    /*
     * Go back from resource selection to splash
     */
    backResSelStep: function(){
         this.loadSplash();
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
        if (gwst.settings.shapeStore.getCount() <= 0) {    
            this.startDrawStep();        
        } else {
            this.startDraw2Step();
        }
	},
	
	/*
	 * Go back from the navigation step to resource selection
	 */
    backNavStep: function() {
        this.loadResSelPanel();
	},    
    
    /******************** Draw Step *******************/
    
    /* 
     * Setup UI for resource drawing step 
     */
    startDrawStep: function() {  
        this.loadDrawPanel();        
        this.mapPanel.enableResDraw(); //Turn on drawing
    },
       
    /*
     * Process and finish draw step
     */
    finDrawStep: function() {
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
        this.mapPanel.disableResDraw();
    },    
    
    /*
     * Go back from draw step to resource selection
     */
    backDrawStep: function() {
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
        if (gwst.settings.shapeStore.getCount() > 0) {
            this.loadDraw2Panel();        
            this.mapPanel.enableResDraw(); //Turn on drawing   
        } else {
            this.startDrawStep();
        }
    },
       
    /*
     * Process and finish draw step
     */
    finDraw2Step: function() {
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
        this.mapPanel.disableResDraw();
        this.startPennyInstrStep();
    },    
    
    /*
     * Go back from draw step to resource selection
     */
    backDraw2Step: function() {
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
        this.mapPanel.disableResDraw();  
        this.startNavStep();         
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
        this.startAnotherShapeStep();
    },
    
    /******************** Satisfied with shape step *******************/
    
    /* 
     * Setup UI for satisfied with shape step 
     */
    startSatisfiedShapeStep: function(shape_obj) {
    	this.addValidatedShape(shape_obj.geom);
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
            this.startAnotherShapeStep();
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
    finAttribStep: function() {
        this.saveNewShape();    
        this.startAnotherShapeStep();
    },    
    
    
    /******************** draw another shape / drop penny steps *******************/
    
    /* 
     * Setup UI for draw another shape or drop penny step 
     */
    startAnotherShapeStep: function() {    
        this.startDraw2Step();
    },
       
    /*
     * Check if any valid shapes exist
     * 
     * TODO: Should they be able to get here (click to allocate) without any shapes?
     * Maybe a check should be done just before this panel gets loaded
     */
    penniesStepSelected: function() {
        if (gwst.settings.shapeStore.getCount() > 0) {
            this.moveToDropPenniesStep();
        } else {
            this.startFinishStep();
        }
    },
    
    /*
     * Move on to drop pennies
     * 
     * TODO: Can we just call startPennyInstrStep directly? Is this needed?
     */
    moveToDropPenniesStep: function() {
        this.startSatisfiedResourceShapesStep();
    },   
    
    /******************** Satisfied with resource shapes step *******************/
    
    /* 
     * Setup UI for satisfied with resource shapes step 
     */
    startSatisfiedResourceShapesStep: function() {
        this.loadSatisfiedResourceShapesPanel();        
    },
       
    /*
     * Process and finish satisfied with shape step
     */
    finSatisfiedResourceShapesStep: function(result) {
    	if (!result.satisfied) {
            this.startDraw2Step();
    	} else {
            this.startPennyInstrStep();
        }
    },
    
    /******************** Penny Allocation Instruction Step *******************/

    /*
     * show basic instructions for penny use
     */
    startPennyInstrStep: function() {
        this.loadAllocPanel();
    },
    
    /*
     * Cleanup allocation help step
     */
    finPennyInstrStep: function() {
        this.startPennyStep();
    },
    
    /*
     * Go back from allocation to resource drawing
     */
    backPennyInstrStep: function() {
        this.startDraw2Step();
    },
    
    /******************** Penny Allocation Step *******************/
    
    /*
     * Setup UI for penny allocation step
     */
    startPennyStep: function() {
        this.loadPennyPanel();
        this.mapPanel.enableResDraw();
    },
    
    /*
     * Process penny allocation step
     */
    finPennyStep: function() {
        this.startSatisfiedPenniesStep();
    },
    
    /*
     * Go back from penny allocation to resource drawing
     */
    backPennyStep: function() {
        this.startDraw2Step();
    },
    
    /******************** Satisfied with pennies step *******************/
    
    /* 
     * Setup UI for satisfied with pennies step 
     */
    startSatisfiedPenniesStep: function() {
        this.loadSatisfiedPenniesPanel();        
    },
       
    /*
     * Process and finish satisfied with shape step
     */
    finSatisfiedPenniesStep: function(result) {
    	if (!result.satisfied) {
            this.startPennyStep();
    	} else {
            this.startFinishStep();
        }
    },
    
    /******************** Finish Step *******************/
    
    /*
     * Load option panel to finish/finish later/select new resource 
     */
    startFinishStep: function() {
        this.loadFinishPanel();
    },
    
    /*
     * Process finish/finish later/delect new resource step
     */
    finFinishStep: function() {
        this.startSatisfiedGroupStep();
    },
    
    /*
     * Go back from penny allocation to resource drawing
     */
    selNewResStep: function() {
        this.startResSelStep();
    },
    /*
     * Process completion of drawing phase
     */
    finDrawingPhase: function() {
        gwst.error.load('TODO: get back to group status!');
        this.startResSelStep();
    },
    
    /******************** Satisfied with group step *******************/
    
    /* 
     * Setup UI for satisfied with group step 
     */
    startSatisfiedGroupStep: function() {
        this.loadSatisfiedGroupPanel();        
    },
       
    /*
     * Process and finish satisfied with shape step
     */
    finSatisfiedGroupStep: function(result) {
    	if (!result.satisfied) {
            this.startResSelStep();
    	} else {
            this.finDrawingPhase();
        }
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
    
    /* Load the map layer toggle window */
    loadMapLayerWin: function() {
		var sm = new Ext.grid.CheckboxSelectionModel();
		this.layerWin = new Ext.Window({
			items: [
		        new Ext.grid.GridPanel({
		        	hideHeaders: true,
		            store: gwst.settings.layerStore,
		            cm: new Ext.grid.ColumnModel({
		                defaults: {
		                    width: 120,
		                    sortable: true
		                },
		                columns: [
		                    sm,
		                    {header: "Title", dataIndex: 'title'}
		                ]
		            }),
		            sm: sm,
		            columnLines: true,
		            iconCls:'icon-grid'
		      })
			],
	        title: 'Maps',
	        width: 140,
	        height: 95,
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
	
    loadNavPanel: function() {
        if (!this.navPanel) {
            this.navPanel = new gwst.widgets.NavigatePanel({
                xtype: 'gwst-navigate-panel',
                resource: this.curResource.get('name'),
                shape_name: gwst.settings.interview.shape_name
            });
            this.navPanel.on('nav-cont', this.finNavStep, this);
            this.navPanel.on('nav-back', this.backNavStep, this);
        } else {
            this.navPanel.updateText({
                resource: this.curResource.get('name'),
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.navPanel);    	
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
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.draw2Panel);    	
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
    
    /* Load the Invalid Shape west panel */
    loadInvalidShapePanel: function(status_code) {
    	if (!this.invalidShapePanel) {
            this.invalidShapePanel = new gwst.widgets.InvalidShapePanel({
                xtype: 'gwst-invalid-shape-panel',
                status_code: status_code,
                resource: this.curResource.get('name'),
                member_title: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.invalidShapePanel.on('okay-btn', this.finInvalidShapeStep, this);
        } else {
            this.invalidShapePanel.updateText({
                status_code: status_code,
                resource: this.curResource.get('name'),
                member_title: gwst.settings.group.member_title,
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
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.shapeAttribPanel.on('shape-attrib-cont', this.finAttribStep, this);            
        } else {
            this.shapeAttribPanel.updateText({
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.shapeAttribPanel);    	
    },
    
    
    /* Load the draw another shape or drop pennies question west panel */
    loadAnotherShapePanel: function() {
    	if (!this.drawOrDropPanel) {
            this.drawOrDropPanel = new gwst.widgets.DrawOrDropPanel({
                xtype: 'gwst-draw-or-drop-panel',
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.drawOrDropPanel.on('drop-pennies', this.penniesStepSelected, this);
            this.drawOrDropPanel.on('draw-another', this.startDraw2Step, this);            
        } else {
            this.drawOrDropPanel.updateText({
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.drawOrDropPanel);    	
    },

    /* Load the satisfied with resource shapes west panel */
    loadSatisfiedResourceShapesPanel: function() {
    	if (!this.satResPanel) {
            this.satResPanel = new gwst.widgets.SatisfiedResourceShapesPanel({
                xtype: 'gwst-satisfied-resource-shapes-panel',
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.satResPanel.on('satisfied', this.finSatisfiedResourceShapesStep, this);   
        } else {
            this.satResPanel.updateText({
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.satResPanel);    	
    },
    
     /* Load the alloc west panel */
    loadAllocPanel: function() {
    	if (!this.allocPanel) {
            this.allocPanel = new gwst.widgets.AllocPanel({
                xtype: 'gwst-alloc-panel',
                resource: this.curResource.get('name'),
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.allocPanel.on('alloc-cont', this.finPennyInstrStep, this);
            this.allocPanel.on('alloc-back', this.backPennyInstrStep, this);
        } else {
            this.allocPanel.updateText({
                resource: this.curResource.get('name'),
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.allocPanel);    	
    },
    
    /* Load the penny allocation west panel */
    loadPennyPanel: function() {
    	if (!this.pennyPanel) {
            this.pennyPanel = new gwst.widgets.PennyPanel({
                xtype: 'gwst-penny-panel',
                resource: this.curResource.get('name'),
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.pennyPanel.on('penny-cont', this.finPennyStep, this);
            this.pennyPanel.on('penny-back', this.backPennyStep, this);
            this.pennyPanel.on('penny-zoom-shape', this.zoomMapToShape, this);
            this.pennyPanel.on('penny-zoom-all', this.zoomToAllShapes, this);
        } else {
            this.pennyPanel.updateText({
                resource: this.curResource.get('name'),
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.pennyPanel);    	
    },
    
    /* Load the satisfied with pennies west panel */
    loadSatisfiedPenniesPanel: function() {
    	if (!this.satPenniesPanel) {
            this.satPenniesPanel = new gwst.widgets.SatisfiedPenniesPanel({
                xtype: 'gwst-satisfied-pennies-panel',
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.satPenniesPanel.on('satisfied', this.finSatisfiedPenniesStep, this);   
        } else {
            this.satPenniesPanel.updateText({
                resource: this.curResource.get('name'),
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.satPenniesPanel);    	
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
    
    /* Load the satisfied with group west panel */
    loadSatisfiedGroupPanel: function() {
    	if (!this.satGroupPanel) {
            this.satGroupPanel = new gwst.widgets.SatisfiedGroupPanel({
                xtype: 'gwst-satisfied-group-panel',
                resource_name: gwst.settings.interview.resource_name,
                resource_name_plural: gwst.settings.interview.resource_name_plural,
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.satGroupPanel.on('satisfied', this.finSatisfiedGroupStep, this);   
        } else {
            this.satGroupPanel.updateText({
                resource_name: gwst.settings.interview.resource_name,
                resource_name_plural: gwst.settings.interview.resource_name_plural,
                action: gwst.settings.interview.resource_action,
                user_group: gwst.settings.group.member_title,
                shape_name: gwst.settings.interview.shape_name
            });
        }
        this.viewport.setWestPanel(this.satGroupPanel);    	
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
    	this.loadMapLayerWin();    	
    	this.mapPanel.on('res-shape-started', this.resShapeStarted, this);
    	this.mapPanel.on('res-shape-complete', this.resShapeComplete, this);
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

    zoomToAllShapes: function(record) {
        this.mapPanel.zoomToAllShapes();
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
    	console.log('keep track of me');
    	if (records.length == 1) {
    		this.curSaveRecord = records[0];
    	} else {
    		console.error('More than one record added!');
    	}
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
        this.fireEvent('settings-loaded');      
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
    
    saveNewShape: function() {        
    	this.loadWait('Saving');
    	var data = {
    		geometry: this.curSaveRecord.get('feature').geometry.toString(),
            pennies: this.curSaveRecord.get('pennies'),
            boundary_n: this.curSaveRecord.get('boundary_n'),
            boundary_s: this.curSaveRecord.get('boundary_s'),
            boundary_e: this.curSaveRecord.get('boundary_e'),
            boundary_w: this.curSaveRecord.get('boundary_w'),
            group_id: parseInt(gwst.settings.survey_group_id),
            resource_id: parseInt(this.curResource.id)
        };
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
        this.loadWait('Deleting');
        this.curDeleteRecord = record;
        Ext.Ajax.request({
            url: gwst.settings.urls.shapes+record.get('id'),
            method: 'DELETE',
            disableCachingParam: true,
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
    	if (this.pennyPanel) {
    		this.pennyPanel.refresh();
    	}
    },
    
    //Update a shape already saved on the server
    updateSavedShape: function(store, record, operation) {
    	//if the pennies weren't modified, ignore it
    	if (!record.modified.pennies) {
    		return;
    	}
    	var data = {
            pennies: parseInt(record.get('pennies')),
            group_id: parseInt(gwst.settings.survey_group_id),
            resource_id: parseInt(this.curResource.id)
        };
    	this.loadWait('Updating');
        this.curUpdateRecord = record;
        
        Ext.Ajax.request({
            url: gwst.settings.urls.shapes+record.get('id'),
            method: 'POST',
            disableCachingParam: true,
            params: {feature: Ext.util.JSON.encode(data)},
            success: this.finUpdateSavedShape,
         	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait.defer(500, this);
              	gwst.error.load('An unknown error has occurred while trying to update your '+gwst.settings.interview.shape_name+'.  Please try again and notify us if this keeps happening.');
           	},
            scope: this
	    });    	
    }, 
    
    finUpdateSavedShape: function(response) {
    	this.hideWait.defer(500, this);
    	this.curUpdateRecord = null;
    	//We've already saved the change, but telling the store to commit 
    	//will remove any cell edit styling
    	gwst.settings.shapeStore.commitChanges();
    },
    
    /******************** Utility Methods ********************/
    
    loadResourceStore: function(resources) {
        //Initialize resource store
        this.ResourceRecord = Ext.data.Record.create([
	       {name: 'id', type: 'float'},
	       {name: 'name'}
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
    
    loadShapeStore: function(shapeLayer) {
	    gwst.settings.shapeStore = new gwst.data.ResFeatureStore({
	    	layer: shapeLayer, 	        
		    proxy: new GeoExt.data.ProtocolProxy({
	            protocol: new OpenLayers.Protocol.HTTP({
	                url: gwst.settings.urls.shapes+'?group_id='+gwst.settings.survey_group_id,
	                format: new OpenLayers.Format.GeoJSON()
	            })
	        }),
	        fields: [{
        		name:'id',
        		type:'float',
        		defaultValue: null
	        },{
                name:'pennies',
                type:'int',
                defaultValue: 0
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
	        autoLoad: true     
	    });
	    gwst.settings.shapeStore.on('load', this.configShapeStore, this);   
    },
    
    //Once store has been initially loaded, add events to handle adding and updating of records.
    configShapeStore: function() {
    	gwst.settings.shapeStore.on('add', this.trackNewShape, this);
    	gwst.settings.shapeStore.on('update', this.updateSavedShape, this);    	
    },
    
    //Add a freshly validated shape to the map
    //TODO: See if just adding it to the feature store will trigger the add to the layer
    addValidatedShape: function(wkt) {
    	var vec = this.wktParser.read(wkt);
    	this.mapPanel.addShape(vec);
    }
    
});