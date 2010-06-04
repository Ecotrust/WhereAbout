Ext.namespace('gwst');

/*
gwst.CumulDrawManager- manages resource drawing process including user information, user groups,
shapes and pennies.  Extends Ext.Observable providing event handling
*/
gwst.CumulDrawManager = Ext.extend(Ext.util.Observable, {
	cur_point_activity_index: 0, //Current point activity
	cur_poly_activity_index: 0, //Current poly activity
	cur_activity_num: 1, //Current activity overall
	cur_feature: null, //Last drawn feature
    cur_save_record: null,   //Current feature getting saved
	addMarkerWinOffset: [405, 8],
	addPolyWinOffset: [405, 8],
	cancelWinOffset: [535, 8],
	activityNum: 0,

    constructor: function(){
        gwst.CumulDrawManager.superclass.constructor.call(this);
        this.mapPanelListeners = {
        		'render': this.mapPanelCreated.createDelegate(this)
        };        
    },          

    startInit: function() {
        this.loadViewport();
        this.loadOrCoastPlacemarks();
        this.createError();
    },
                    
    /********************** Survey steps ************************/

    /*Introduction panel for the map tool */
    startSplashStep: function() {
        //this.updateSessionRecord();
        this.loadSplash();
    },
    
    /* Finish splash and start activity specific details*/
    finSplashStep: function() {
    	this.startPointActivity();
    },
    
    
    /*Instructions for mapping point-based activities */
    startPointInstruction: function() {
        this.loadPointInstruction({'activity':this.getCurPointActivity().name});
    },
    
    /* Finish point-based activity instructions*/
    finPointInstruction: function() {
    	this.startPointActivity();
    },
    
    /* Instructions for mapping polygon-based (area) activities */
    startPolyInstruction: function() {
    	this.loadPolyInstruction({'activity':this.getCurPolyActivity().name});
    },
    
    /* Finish polygon-based activities*/
    finPolyInstruction: function() {
    	this.startPolyActivity();
    },

    /* 
     * Setup UI for invalid shape error display step 
     */
    startInvalidShapeStep: function(status_code) {
        this.loadInvalidShapePanel(status_code);        
        this.mapPanel.disablePolyDraw(); //Turn off drawing
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
    },
       
    /*
     * Process and finish Invalid Shape step
     */
    finInvalidShapeStep: function() {
		this.mapPanel.removeLastFeature();
		//Restart the current activity
		if (this.getCurActivity().draw_type == 'polygon') {
    		this.startPolyActivity();
    	} else {
    		this.startPointActivity();
    	}
    },    
    
    /*
     * show basic instructions for penny use
     */
    startPennyInstrStep: function() {
        if (this.getCurActivity().draw_type == 'polygon') {
            this.loadPolyPennyInstrPanel();
        } else {
            this.loadPointPennyInstrPanel();
        }
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
        if (this.getCurActivity().draw_type == 'polygon') {
            this.poly_instruct_loaded = true;
    		this.loadPolyActivity();
    	} else {
            this.point_instruct_loaded = true;
    		this.loadPointActivity();
    	}
    },
    
    /*
     * Setup UI for penny allocation step
     */
    startPennyStep: function() {
        if (this.getCurActivity().draw_type == 'polygon') {
            this.loadPolyPennyPanel();
        } else {
            this.loadPointPennyPanel();
        }
    },
    
    /*
     * Process penny allocation step
     */
    finPennyStep: function() {
        gwst.settings.shapeStore.removeAll();
        this.updateActivityStatus('complete');
    },
    
    /*
     * Go back from penny allocation to resource drawing
     */
    backPennyStep: function() {
        this.startPennyInstrStep();
    },
    
    allFinished: function() {
    	window.location = return_url;
    },
    
    /******************** UI widget handlers ********************/   
    
    /* Load the initial splash screen for the user */
    loadSplash: function() {      	
        this.splashPanel = new gwst.widgets.CumulSplashPanel();
        //When panel fires event saying it's all done, we want to process it and move on 
        this.splashPanel.on('splash-cont', this.finPointInstruction, this);
        this.viewport.setWestPanel(this.splashPanel);
    },    

    loadPointInstruction: function(config) {      	
    	if (!this.pointInstrPanel) {
	    	this.pointInstrPanel = new gwst.widgets.CumulPointInstructionPanel(config);
	        //When panel fires event saying it's all done, we want to process it and move on 
	        this.pointInstrPanel.on('point-cont', this.finPointInstruction, this);
    		this.pointInstrPanel.on('skip-activity', this.skipPointActivity, this);	        
    	} else {
    		this.pointInstrPanel.update(config);
    	}
        this.viewport.setWestPanel(this.pointInstrPanel);  
    },        
    
    loadPolyInstruction: function(config) {      	
        if (!this.polyInstrPanel) {
        	this.polyInstrPanel = new gwst.widgets.CumulPolyInstructionPanel(config);
        	//When panel fires event saying it's all done, we want to process it and move on 
        	this.polyInstrPanel.on('poly-cont', this.finPolyInstruction, this);
    		this.polyInstrPanel.on('skip-activity', this.skipPolyActivity, this);        	
        } else {
        	this.polyInstrPanel.update(config);
        }
        this.viewport.setWestPanel(this.polyInstrPanel);  
    },        
    
    /* Render viewport with main widgets to document body (right now) */
    loadViewport: function() {
        this.viewport = new gwst.widgets.MainViewport({
			mapPanelListeners: this.mapPanelListeners
		});
    },    
    
    loadPointPanel: function(config) {  
    	if (!this.pointPanel) {
    		this.pointPanel = new gwst.widgets.CumulPointPanel(config);
    		this.pointPanel.on('city-selected', this.zoomToCity, this);
    		this.pointPanel.on('place-selected', this.zoomToPlacemark, this);
    		this.pointPanel.on('skip-activity', this.skipPointActivity, this);
    		this.pointPanel.on('next-activity', this.checkPointActivity, this);
    	} else {
    		this.pointPanel.update(config);
    	}
        this.viewport.setWestPanel(this.pointPanel);        
    },    

    loadPolyPanel: function(config) {  
    	if (!this.polyPanel) {
    		this.polyPanel = new gwst.widgets.CumulPolyPanel(config);
    		this.polyPanel.on('city-selected', this.zoomToCity, this);
    		this.polyPanel.on('place-selected', this.zoomToPlacemark, this);
    		this.polyPanel.on('skip-activity', this.skipPolyActivity, this);
    		this.polyPanel.on('next-activity', this.checkPolyActivity, this);
    	} else {
    		this.polyPanel.update(config);
    	}
        this.viewport.setWestPanel(this.polyPanel); 
    },        
    
    loadAddMarkerWin: function() {
    	if (!this.addMarkerWin) {
			this.addMarkerWin = new gwst.widgets.AddMarkerWindow();
            this.addMarkerWin.on('add-marker-clicked', this.activateMarkMode, this);
		}
		this.addMarkerWin.show();		
		this.addMarkerWin.alignTo(document.body, "tl-tl", this.addMarkerWinOffset);    	
    },
    
    hideAddMarkerWin: function() {
    	if (this.addMarkerWin) {
    		this.addMarkerWin.hide();
    	}
    },

    loadAddPolyWin: function() {
    	if (!this.addPolyWin) {
			this.addPolyWin = new gwst.widgets.AddPolyWindow();
            this.addPolyWin.on('draw-poly-clicked', this.activateDrawMode, this);		
		}
		this.addPolyWin.show();		
		this.addPolyWin.alignTo(document.body, "tl-tl", this.addPolyWinOffset);    	
    },   
    
    hideAddPolyWin: function() {
    	if (this.addPolyWin) {
    		this.addPolyWin.hide();
    	}
    },
    
    loadCancelWin: function() {
    	if (!this.cancelWin) {
			this.cancelWin = new gwst.widgets.CancelWindow();
			this.cancelWin.on('cancel-clicked', this.mapPanel.cancelPoly, this.mapPanel);
			this.cancelWin.on('cancel-clicked', this.hideMapTooltip, this);
		}
		this.cancelWin.show();		
		this.cancelWin.alignTo(document.body, "tl-tl", this.cancelWinOffset);    	
    },
    
    hideCancelWin: function() {
    	if (this.cancelWin) {
    		this.cancelWin.hide();
    	}
    },

    /* Load the Invalid Shape west panel */
    loadInvalidShapePanel: function(status_code) {
    	if (!this.invalidShapePanel) {
            this.invalidShapePanel = new gwst.widgets.InvalidShapePanel({
                status_code: status_code
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.invalidShapePanel.on('okay-btn', this.finInvalidShapeStep, this);
        } else {
            this.invalidShapePanel.updateText({
                status_code: status_code
            });
        }
        this.viewport.setWestPanel(this.invalidShapePanel);    	
    },    
    
    /* Load the satisfied with shape west panel */
    loadSatisfiedShapePanel: function() {
    	if (!this.satisfiedShapePanel) {
    		this.satisfiedShapePanel = new gwst.widgets.SatisfiedShapePanel({shape_name: this.getCurActivity().shape_name});
            //When panel fires event saying it's all done, we want to process it and move on 
            this.satisfiedShapePanel.on('satisfied', this.finSatisfiedShapeStep, this);            
        } else {
        	this.satisfiedShapePanel.updateText({shape_name: this.getCurActivity().shape_name});
        }
        this.viewport.setWestPanel(this.satisfiedShapePanel);    	
    },    
    
    finSatisfiedShapeStep: function(result) {
    	if (!result.satisfied) {
    		this.mapPanel.removeLastFeature();
    		//Restart the current activity
    		if (this.getCurActivity().draw_type == 'polygon') {
        		this.startPolyActivity();
        	} else {
        		this.startPointActivity();
        	}
    	} else {
    		this.saveNewFeature();
        }    	
    },
    
    loadPointPennyInstrPanel: function() {
        if (!this.pointPennyInstrPanel) {
            this.pointPennyInstrPanel = new gwst.widgets.PointAllocPanel({
                xtype: 'gwst-point-alloc-panel',
                resource: this.getCurPointActivity().name,
                shape_name_plural: 'points',
                shape_name: 'point',
                activity_num: this.cur_activity_num
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.pointPennyInstrPanel.on('point-alloc-cont', this.finPennyInstrStep, this);
            this.pointPennyInstrPanel.on('point-alloc-back', this.backPennyInstrStep, this);
        } else {
            this.pointPennyInstrPanel.updateText({
                resource: this.getCurPointActivity().name,
                shape_name_plural: 'points',
                shape_name: 'point',
                activity_num: this.cur_activity_num
            });
        }
        this.viewport.setWestPanel(this.pointPennyInstrPanel); 
        this.zoomToAllShapes();
    
    },
    
    loadPolyPennyInstrPanel: function() {
        if (!this.polyPennyInstrPanel) {
            this.polyPennyInstrPanel = new gwst.widgets.PolyAllocPanel({
                xtype: 'gwst-poly-alloc-panel',
                resource: this.getCurPolyActivity().name,
                shape_name_plural: 'use areas',
                shape_name: 'use area',
                activity_num: this.cur_activity_num
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.polyPennyInstrPanel.on('poly-alloc-cont', this.finPennyInstrStep, this);
            this.polyPennyInstrPanel.on('poly-alloc-back', this.backPennyInstrStep, this);
        } else {
            this.polyPennyInstrPanel.updateText({
                resource: this.getCurPolyActivity().name,
                shape_name_plural: 'use areas',
                shape_name: 'use area',
                activity_num: this.cur_activity_num
            });
        }
        this.viewport.setWestPanel(this.polyPennyInstrPanel); 
        this.zoomToAllShapes();
    
    },
    
    loadPointPennyPanel: function() {
        if (!this.pointPennyPanel) {
            this.pointPennyPanel = new gwst.widgets.PointPennyPanel({
                xtype: 'gwst-point-penny-panel',
                resource: this.getCurPointActivity().name,
                shape_name_plural: 'points',
                shape_name: 'point',
                activity_num: this.cur_activity_num,
		manager: this
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.pointPennyPanel.on('point-penny-cont', this.finPennyStep, this);
            this.pointPennyPanel.on('point-penny-back', this.backPennyStep, this);
            this.pointPennyPanel.on('penny-zoom-shape', this.zoomMapToShape, this);
            this.pointPennyPanel.on('penny-zoom-all', this.zoomToAllShapes, this);
        } else {
            this.pointPennyPanel.updateText({
                resource: this.getCurPointActivity().name,
                shape_name_plural: 'points',
                shape_name: 'point',
                activity_num: this.cur_activity_num
            });
        }
        this.viewport.setWestPanel(this.pointPennyPanel);    	
    
    },
    
    getSelectControl: function() {
	return this.mapPanel.getSelectControl();
    },

    loadPolyPennyPanel: function() {
        if (!this.polyPennyPanel) {
            this.polyPennyPanel = new gwst.widgets.PolyPennyPanel({
                xtype: 'gwst-poly-penny-panel',
                resource: this.getCurPolyActivity().name,
                shape_name_plural: 'use areas',
                shape_name: 'use area',
                activity_num: this.cur_activity_num
    	
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.polyPennyPanel.on('poly-penny-cont', this.finPennyStep, this);
            this.polyPennyPanel.on('poly-penny-back', this.backPennyStep, this);
            this.polyPennyPanel.on('penny-zoom-shape', this.zoomMapToShape, this);
            this.polyPennyPanel.on('penny-zoom-all', this.zoomToAllShapes, this);
        } else {
            this.polyPennyPanel.updateText({
                resource: this.getCurPolyActivity().name,
                shape_name_plural: 'use areas',
                shape_name: 'use area',
                activity_num: this.cur_activity_num
            });
        }
        this.viewport.setWestPanel(this.polyPennyPanel);    	
    
    },
    
    /******************** Data store loaders *******************/    
    
    loadOrCoastPlacemarks: function() {
    	this.loadWait('Loading Oregon Placemarks...');
        gwst.settings.placemarkStore = new GeoExt.data.FeatureStore({
            proxy:  new GeoExt.data.ProtocolProxy({
                protocol: new OpenLayers.Protocol.HTTP({
                    url: '/or_coast_placemarks/json/',
                    format: new OpenLayers.Format.GeoJSON()
                })
            }),
            fields: [{
                name:'name',
                type:'string',
                defaultValue: null
            }],	        
            autoLoad: true  
        });
        gwst.settings.placemarkStore.on('load', this.afterPlacemarksLoaded, this);
    },    

    afterPlacemarksLoaded: function() {
    	this.loadOrCoastCities();
    },        	
    
    loadOrCoastCities: function() {
    	this.loadWait('Loading Oregon Cities...');
        gwst.settings.cityStore = new GeoExt.data.FeatureStore({
            proxy:  new GeoExt.data.ProtocolProxy({
                protocol: new OpenLayers.Protocol.HTTP({
                    url: '/or_coast_cities/json/',
                    format: new OpenLayers.Format.GeoJSON()
                })
            }),
            fields: [{
                name:'city',
                type:'string',
                defaultValue: null
            }],	        
            autoLoad: true  
        });    
        gwst.settings.cityStore.on('load', this.afterCitiesLoaded, this);        
    },    
    
    afterCitiesLoaded: function() {
    	this.hideWait();
    	this.startSplashStep();   	
    },    

    /******************** Feature handling *****************/
    
    validateShape: function(feature) {    	
    	var config = {
            geometry: feature.geometry.toString(),
            activity_id: this.getCurActivity().id,
            user_id: user_id,
            group_id: group_id,
            time_period: 'cumulative'
         }    	
        this.loadWait('Validating your shape');
    	Ext.Ajax.request({
	        url: gwst.settings.urls.shape_validate,
	        method: 'POST',
	        disableCachingParam: true,
	        params: config,
	        success: this.finValidateShape,
           	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait();
              	gwst.error.load('An error has occurred.  Please try again and notify us if it happens again.');
           	},
            scope: this
	    });
    },

    /* Processes the result of validateShape */
    finValidateShape: function(response, opts) {
        this.hideWait();
        var res_obj = Ext.decode(response.responseText);
        var status_code = parseFloat(res_obj.status_code);
        if (status_code == 0) {
        	this.loadSatisfiedShapePanel();
        } else if (status_code > 0){
        	this.startInvalidShapeStep(status_code);	
        } else {
        	gwst.error.load('An error has occurred while trying to validate your area.  Please try again and notify us if this keeps happening.');
        }        
    },               

    saveNewFeature: function() {        
    	this.loadWait('Saving');

        var data = {
            geometry: this.cur_feature.geometry.toString(),
            activity_id: this.getCurActivity().id,
            user_id: user_id,
            group_id: group_id,
            time_range: time_range
        };
        
    	Ext.Ajax.request({
	        url: gwst.settings.urls.shapes,
	        method: 'POST',
	        disableCachingParam: true,
	        params: {feature: Ext.util.JSON.encode(data)},
	        success: this.finSaveNewFeature,
           	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait.defer(500, this);
              	gwst.error.load('An error has occurred while trying to save.');
           	},
            scope: this
	    });                	
    },     
        
    finSaveNewFeature: function(response) {
    	var new_feat = Ext.decode(response.responseText);
        this.cur_save_record.set('id', new_feat.feature.id);
    	this.hideWait.defer(500, this);
    	    	
    	this.getCurActivity().num_saved += 1;
    	if (this.getCurActivity().draw_type == 'polygon') {
    		this.startPolyActivity();
    	} else {
    		this.startPointActivity()
    	}    	    	
    },  

    //Update a shape already saved on the server
    updateSavedFeature: function(store, record, operation) {
    	//if the pennies weren't modified, ignore it
    	if (record.modified == null || record.modified.pennies == 'undefined' || record.modified.pennies == null) {
    		return;
    	}
    	var data = {
            geometry: this.cur_feature.geometry.toString(),
            pennies: parseInt(record.get('pennies')),
            activity_id: this.getCurActivity().id,
            user_id: user_id,
            group_id: group_id,
            time_range: time_range
        };
    	this.loadWait('Updating');
        
        Ext.Ajax.request({
            url: gwst.settings.urls.shapes+record.get('id'),
            method: 'POST',
            disableCachingParam: true,
            params: {feature: Ext.util.JSON.encode(data)},
            success: this.finUpdateSavedFeature,
         	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait.defer(500, this);
              	gwst.error.load('An error has occurred while trying to save.');
           	},
            scope: this
	    });    	
    }, 
    
    finUpdateSavedFeature: function(response) {
    	this.hideWait.defer(500, this);
    	//We've already saved the change, but telling the store to commit 
    	//will remove any cell edit styling
    	gwst.settings.shapeStore.commitChanges();
    },
    
   updateActivityStatus: function(stat_update) {        
        this.loadWait('Updating');
    
        var data = {
            status: stat_update,
            activity_id: this.getCurActivity().id,
            user_id: user_id,
            group_id: group_id,
            time_range: time_range
        };
        
    	Ext.Ajax.request({
	        url: gwst.settings.urls.statuses,
	        method: 'POST',
	        disableCachingParam: true,
	        params: {status_record: Ext.util.JSON.encode(data)},
	        success: this.finUpdateActivityStatus,
           	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait.defer(500, this);
              	gwst.error.load('An error has occurred while trying to update status.');
           	},
            scope: this
	    });                	
    },  
    
    finUpdateActivityStatus: function(response) {
    	var new_stat = Ext.decode(response.responseText);
    	this.hideWait.defer(500, this);
    	    	
    	if (this.getCurActivity().draw_type == 'polygon') {
            this.goToNextPolyActivity();
        } else {
            this.goToNextPointActivity()
        } 	    	
    },
    
    
    
    updateSessionRecord: function() {        
        this.loadWait('Updating');
    
        var data = {
            user_id: user_id,
            group_id: group_id,
            time_range: time_range
        };
        
    	Ext.Ajax.request({
	        url: gwst.settings.urls.session,
	        method: 'POST',
	        disableCachingParam: true,
	        params: {session_record: Ext.util.JSON.encode(data)},
	        success: this.finUpdateSessionRecord,
           	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait.defer(500, this);
              	gwst.error.load('An error has occurred while trying to update session.');
           	},
            scope: this
	    });                	
    },  
    
    finUpdateSessionRecord: function(response) {
    	var new_stat = Ext.decode(response.responseText);
    	this.hideWait.defer(500, this);
        
        this.loadSplash();
    },
    
    
    
    /******************** Event handlers *******************/    

    startPointActivity: function() {
    	if (point_activities.length > 0) {
    		if (!this.point_instruct_loaded) { 
    			this.startPointInstruction();
    			//Flag instruction so they don't get shown again next time through
    			this.point_instruct_loaded = true;
    		} else {
    			this.loadPointActivity();
    		}   
    	} else {
    		this.startPolyActivity();
    	}
    },

    goToNextPointActivity: function() {
    	this.cur_point_activity_index += 1;
    	this.cur_activity_num += 1;
    	if (this.cur_point_activity_index >= point_activities.length) {
    		this.startPolyActivity();
    	} else {
    		this.startPointActivity();
    	}
    },    
    
    /* Load the point activity panel */
    loadPointActivity: function() {    	
    	var cur_activity = this.getCurPointActivity();
    	this.loadPointPanel({
    		'activity':cur_activity.name,
    		'activity_num':this.cur_activity_num
    	});
    	this.loadAddMarkerWin();    	
    },

    getCurActivity: function() {
    	if (this.cur_activity_num > point_activities.length) {
    		return poly_activities[this.cur_poly_activity_index];
    	} else {
    		return point_activities[this.cur_point_activity_index];
    	}
    },
    
    getCurPointActivity: function() {
    	return point_activities[this.cur_point_activity_index];
    },    
    
    skipPointActivity: function() {
    	this.hideMapTooltip();
    	this.mapPanel.disablePointDraw();
    	this.hideAddMarkerWin();
    	//Save skip in database
    	//Reset instruction flag so they get shown again for the next activity
    	this.point_instruct_loaded = false;
        gwst.settings.shapeStore.removeAll();
        this.updateActivityStatus('skipped');
    },
    
    checkPointActivity: function() {
    	this.hideMapTooltip();
    	this.mapPanel.disablePointDraw();
    	if (this.getCurActivity().num_saved > 0) {
        	this.hideAddMarkerWin();    		
    		//Reset instruction flag so they get shown again for the next activity
    		this.point_instruct_loaded = false;
            this.startPennyInstrStep();
    	} else {
    		gwst.error.load('You must add at least one marker first.');
    	}
    },    

    startPolyActivity: function() {
		if (poly_activities.length > 0) {
			if (!this.poly_instruct_loaded) { 
				this.startPolyInstruction();
				//Flag instruction so they don't get shown again next time through
				this.poly_instruct_loaded = true;
			} else {
				this.loadPolyActivity();
			}    		
		} else {
			window.location = return_url;	
		}
	},
	
    goToNextPolyActivity: function() {
    	this.cur_poly_activity_index += 1;
    	this.cur_activity_num += 1;    	
    	if (this.cur_poly_activity_index >= poly_activities.length) {
    		this.allFinished();    		
    	} else {
    		this.startPolyActivity();
    	}
    }, 	
    
    loadPolyActivity: function() {
    	var cur_activity = this.getCurPolyActivity();
    	this.loadPolyPanel({
    		'activity':cur_activity.name,
    		'activity_num':this.cur_activity_num
    	});
    	this.loadAddPolyWin();
    },        

    getCurPolyActivity: function() {
    	return poly_activities[this.cur_poly_activity_index];
    },    
    
    skipPolyActivity: function() {
    	this.hideMapTooltip();
    	this.mapPanel.disablePolyDraw();
    	this.hideAddPolyWin();
    	//Save skip in database
    	//Reset instruction flag so they get shown again for the next activity
    	this.poly_instruct_loaded = false;
        gwst.settings.shapeStore.removeAll();
        this.updateActivityStatus('skipped');   	
    },        

    checkPolyActivity: function() {
    	this.hideMapTooltip();
    	this.mapPanel.disablePolyDraw();
    	if (this.getCurActivity().num_saved > 0) {
        	this.hideAddPolyWin();    		
    		//Reset instruction flag so they get shown again for the next activity
    		this.poly_instruct_loaded = false;
    		//this.goToNextPolyActivity();
            this.startPennyInstrStep();
    	} else {
    		gwst.error.load('You must draw at least one area first.');
    	}
    },    
    
    newFeatureHandler: function(feature) {
    	this.cur_feature = feature;
        //If user drew a point, skip straight to satisfied
        if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Point') {
            this.hideAddMarkerWin();
            this.loadSatisfiedShapePanel();
            return;
        } else {
            this.hideAddPolyWin();
            this.validateShape(feature);
        }
    },
    
    invalidFeatureHandler: function(feature) {
        this.cur_feature = feature;
        this.mapPanel.disablePolyDraw(); //Turn off drawing
        this.mapPanel.disablePointDraw(); //Turn off drawing
        if (this.getCurActivity().draw_type == 'polygon') {
                this.startPolyActivity();
            } else {
                this.startPointActivity();
            }
    },
    
    //Keep track of latest shape added to the shape store
    trackNewShape: function(store, records, index) {
    	if (records.length == 1) {
    		this.cur_save_record = records[0];
    	} else {
    		console.error('More than one record added!');
    	}
    },    
    
    /* 
     * Listen for map panel creation and then create hooks into it and setup 
     * additional map-related widgets 
     */
    mapPanelCreated: function() {
    	this.mapPanel = Ext.getCmp('mappanel');    	
    	this.loadShapeStore(this.mapPanel.getFeatureLayer());
    	this.mapPanel.on('vector-completed', this.hideMapTooltip, this);
    	this.mapPanel.on('vector-completed', this.newFeatureHandler, this);
    	this.mapPanel.on('vector-completed', this.hideCancelWin, this);
        this.mapPanel.on('invalid-vector', this.hideMapTooltip, this);
    	this.mapPanel.on('invalid-vector', this.invalidFeatureHandler, this);
    	this.mapPanel.on('invalid-vector', this.hideCancelWin, this);
    },    
    
    zoomToCity: function(city_rec) {
    	this.mapPanel.zoomToPoint(city_rec.get('feature'));
    },
    
    zoomToPlacemark: function(place_rec) {
    	this.mapPanel.zoomToPoint(place_rec.get('feature'));
    },
    
    zoomMapToShape: function(record) {
        this.mapPanel.zoomToResShape(record.get('feature'));
    },

    zoomToAllShapes: function(record) {
        this.mapPanel.zoomToAllShapes();
    },
    
    /******************** UI Utility Functions ********************/    

    loadShapeStore: function(shapeLayer) {
	    if (!gwst.settings.shapeStore) {
            gwst.settings.shapeStore = new gwst.data.ActFeatureStore({
                layer: shapeLayer, 	        
//                 proxy:  new GeoExt.data.ProtocolProxy({
//                     protocol: new OpenLayers.Protocol.HTTP({
//                         url: this._getResourceUrl(),
//                         format: new OpenLayers.Format.GeoJSON()
//                     })
//                 }),
                fields: [{
                    name:'id',
                    type:'float',
                    defaultValue: null
                },{
                    name:'pennies',
                    type:'int',
                    defaultValue: 0
                }],	        
                autoLoad: false
            });    
            this.configShapeStore();
        }
    }, 
    
    //Once store has been initially loaded, add events to handle adding and updating of records.
    configShapeStore: function() {
    	gwst.settings.shapeStore.on('add', this.trackNewShape, this);
    	gwst.settings.shapeStore.on('update', this.updateSavedFeature, this);    	
    },
    
    loadAddMarkerTip: function() {
    	this.loadMapTooltip('Now click on the map where the activity took place');
    },    
    
    activateMarkMode: function() {
        if (this.mapPanel.map.getZoom() < gwst.settings.minimum_draw_zoom) {
            alert(gwst.settings.zoom_error_text);
        } else {
            this.mapPanel.enablePointDraw();
            this.loadAddMarkerTip();        
        }
    },
    
    activateDrawMode: function() {
        if (this.mapPanel.map.getZoom() < gwst.settings.minimum_draw_zoom) {
            alert(gwst.settings.zoom_error_text);
        } else {
            this.mapPanel.enablePolyDraw();
			this.loadDrawAreaTooltip();
			this.loadCancelWin();  
        }
    },
    
    loadDrawAreaTooltip: function() {
    	this.loadMapTooltip('Click on the map to start drawing your area.  Continue clicking and tracing it out. Double-click the last point to finish');
    },
    
    loadMapTooltip: function(text) {
    	if (this.mapTip) {
    		this.mapTip.hide();
    		this.mapTip.destroy();
    		this.mapTip = null;
    	}
    	this.mapTip = new Ext.ToolTip({
    		id: 'map-tip',
            target: 'mappanel',
            width:150,
            trackMouse: true,
            autoHide: false,
            html: text
    	});
    },
    
    hideMapTooltip: function() {
    	if (this.mapTip) {
    		this.mapTip.hide();
    		this.mapTip.destroy();
    		this.mapTip = null;
    	}
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
    }
});