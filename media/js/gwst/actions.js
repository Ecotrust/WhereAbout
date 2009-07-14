Ext.namespace('gwst');

gwst.actions = {};

gwst.actions.utils = {};

jQuery.fn.bindButton = function(action, data){
    $(this).bind('click', data, function(e){action(e); return false});
};

gwst.actions.utils.showGeometryChangeInfo = function(html){
    gwst.app.statusPanel.body.update(html);
    gwst.app.statusPanel.show();
};

gwst.actions.utils.clearGeometryChangeInfo = function(){
    gwst.app.statusPanel.hide();
};

gwst.actions.utils.clearMenus = function(e){
    if(e){
        e.stopPropagation();
    }
    Ext.getCmp('maptoolbar').collapseMenus();
};

gwst.actions.utils.restoreComponents = [];

gwst.actions.utils.disableComponents = function(){
    // gwst.app.legend.collapse();
    // gwst.app.legend.hide();
    if(gwst.app.mapToolbar.dataLayersMenu.window.isVisible()){
        gwst.actions.utils.restoreComponents.push(
            gwst.app.mapToolbar.dataLayersMenu
        );
    }
    if(gwst.app.FeaturesMenu.extWindow.isVisible()){
        gwst.actions.utils.restoreComponents.push(
            gwst.app.FeaturesMenu.getExtButton()
        );
    }
    gwst.actions.utils.clearMenus();
    gwst.app.mapToolbar.dataLayersMenu.window.isVisible()
    gwst.app.mapToolWindow.hide();    
    //gwst.app.reportsVisor.deactivate();
    gwst.ui.modal.hide();
    // gwst.app.mapToolbar.setDisabled(true);
};

gwst.actions.utils.enableComponents = function(){
    gwst.app.mapToolWindow.show();
    for(var i=0; i<gwst.actions.utils.restoreComponents.length; i++){
        gwst.actions.utils.restoreComponents[i].toggle();
    }
    gwst.actions.utils.restoreComponents = [];
    //gwst.app.reportsVisor.activate();
};

gwst.actions.utils.mapToolbarItems = [];

gwst.actions.utils.changeMapToolbarMode = function(buttonConfig){
    var tbar = gwst.app.mapToolbar;
    tbar.addClass('editmodetoolbar');
    // gwst.actions.utils.mapToolbarItems = [];
    var removeList = [];
    for(var i=0; i< tbar.items.length; i++){
        var item = tbar.items.itemAt(i);
        if(item.restore){
            item.hide();
        }else{
            removeList.push(i);
            item.destroy();
        }
    }
    for(var p=0;p<removeList.length;p++){
        tbar.items.removeAt(removeList[p]);
    }

    for(var j = 0; j<buttonConfig.length; j++){
        buttonConfig[j]['restore'] = false;
        tbar.add(buttonConfig[j]);
    }
};

gwst.actions.utils.restoreMapToolbar = function(){
    var tbar = gwst.app.mapToolbar;
    tbar.removeClass('editmodetoolbar');
    var removeList = [];
    
    for(var i = 0; i<tbar.items.length; i++){
        var item = tbar.items.item(i);
        if(item.restore){
            // tbar.add(item);
            item.show();
        }else{
            removeList.push(i);
            item.destroy();
        }
    }
    for(var p=0;p<removeList.length;p++){
        tbar.items.removeAt(removeList[p]);
    }
};

gwst.actions.utils.askUserToDefineGeometry = function(config){
    if(!config['finish'] || !config['cancel']){
    }else{
        gwst.actions.utils.disableComponents();        
        var clipSuccess = function(status_code, original, clipped){
            gwst.app.map.addClippedGeometryPreview(clipped);
            var title;
            var text;
            if(status_code == 0){
                title = gwst.copy.confirmStudyRegionClippingTitle;
                text = gwst.copy.confirmStudyRegionClipping;
            }else{
                title = gwst.copy.overlapsEstuaryTitle;
                text = gwst.copy.confirmStudyRegionClipping + "<br />" + gwst.copy.overlapsEstuary[status_code];
            }
            
            gwst.actions.utils.changeMapToolbarMode([
                {
                    xtype: 'tbtext',
                    text: title
                },
                {
                    xtype: 'tbfill'
                },
                {
                    text: 'Go Back and Modify Geometry',
                    geometry: original,
                    config: config,
                    handler: function(){
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.clearGeometryChangeInfo();
                        this.config['geometry'] = this.geometry;
                        gwst.app.map.clearClippedGeometryPreview();
                        gwst.actions.utils.askUserToDefineGeometry(this.config);
                    }
                },
                {
                    text: 'Cancel',
                    iconCls: 'remove-icon',
                    handler: function(){
                        gwst.app.map.clearClippedGeometryPreview();
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.clearGeometryChangeInfo();
                        config['cancel']();
                    }
                },
                {
                    text: 'Continue',
                    iconCls: 'yes-icon',
                    geometry: original,
                    clipped: clipped,
                    handler: function(){
                        gwst.app.map.clearClippedGeometryPreview();
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.clearGeometryChangeInfo();
                        gwst.app.map.selectControl.deactivate();
                        gwst.app.map.selectControl.activate();
                        config['finish'](this.geometry, this.clipped);
                    }
                }
            ]);
            gwst.actions.utils.showGeometryChangeInfo(text);
        };
        
        var clipError = function(status_code, original){
            gwst.actions.utils.changeMapToolbarMode([
                {
                    xtype: 'tbtext',
                    text: 'The geometry you defined cannot be accepted'
                },
                {xtype: 'tbfill'},
                {
                    text: 'Go Back and Modify Geometry',
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
        };
        var clipFail = function(response, opts){
            gwst.ui.error.show({
                errorText: 'An unknown Server Error has Occurred while trying to clip your shape. If you were editing a geometry, that geometry will remain intact as it was before editing. If you were creating a new shape, you will have to start over. We have been notified of this problem.',
                logText: 'Error clipping shape'
            });
            gwst.actions.utils.enableComponents();
        };
        if(config['geometry']){
            gwst.app.map.addEditableGeometry(config['geometry']);
            gwst.actions.utils.changeMapToolbarMode([
                {
                    xtype: 'tbtext',
                    text: gwst.copy.editGeometry
                },
                {xtype: 'tbfill'},
                {
                    text: 'Finished',
                    iconCls: 'yes-icon',
                    handler: function(){
                        var new_geo = gwst.app.map.finishGeometryEditing();
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.async.clipGeometry({
                           geometry: new_geo,
                           resource: config['resource'],
                           orig_shape_id: config['orig_shape_id'],
                           success: clipSuccess,
                           error: clipError,
                           fail: clipFail
                        });
                    }
                },
                {
                    text: 'cancel',
                    iconCls: 'remove-icon',
                    handler: function(){
                        gwst.app.map.finishGeometryEditing();
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.enableComponents();
                        config['cancel']();
                    }
                }
            ]);
        }else{
            gwst.app.map.startDrawMPA();
            
            gwst.actions.utils.changeMapToolbarMode([
                {
                    xtype: 'tbtext',
                    text: gwst.copy.createNewGeometry
                },
                {xtype: 'tbfill'},
                {
                    text: 'cancel',
                    iconCls: 'remove-icon',
                    handler: function(){
                        gwst.app.map.cancelDrawMPA();
                        gwst.actions.utils.enableComponents();
                        config['cancel']();
                        gwst.actions.utils.restoreMapToolbar();
                    }
                }
            ]);
            // Cause of bug drawing MPAs where verticies are offset from mouse clicks.
            // Call to map.events.clearMouseCache needed because changes to the maptoolbar effect the size
            //  of the map div. openlayers needs to re-calculate cursor offsets when this div is resized 
            gwst.app.map.map.events.clearMouseCache();
            gwst.app.map.addListener('GeometryCreated', gwst.actions.utils.geometryCreatedCallback, {
                // doneHandler: doneHandler, 
                remove: gwst.actions.utils.geometryCreatedCallback, 
                clipSuccess: clipSuccess,
                clipError: clipError,
                clipFail: clipFail,
                resource: config['resource'],
                orig_shape_id: config['orig_shape_id']
            });
        }
    }
};

gwst.actions.utils.geometryCreatedCallback = function(geometry){
    gwst.actions.utils.restoreMapToolbar();
    gwst.app.map.removeListener('GeometryCreated', this.remove, this);
    gwst.actions.async.clipGeometry({
       geometry: geometry,
       resource: this.resource,
       orig_shape_id: this.orig_shape_id,
       success: this.clipSuccess,
       error: this.clipError,
       fail: this.clipFail
    });
    // this.doneHandler(geometry);
};

gwst.actions.createArray = new Ext.Action({
    text: 'Create Array',
    iconCls: 'add-icon',
    handler: function(target, e) {
        gwst.actions.nonExt.createOrModifyArray();
        // if (!gwst.app.createArrayWindow) {
        //     gwst.app.createArrayWindow = new gwst.widgets.createArrayWindow({});
        //     //gwst.app.createArrayWindow.on('beforehide', function(c) { gwst.app.CreateArrayForm.reset(); });
        //     //gwst.app.createArrayWindow.on('beforeshow', function(c) { gwst.app.CreateArrayForm.reset(); });
        // }
        // 
        // gwst.app.createArrayWindow.show();
        //Ext.getCmp('login_name').focus(false, true);
    },
    tooltip: 'Create a new Array of Marine Protected Areas.'
    // tooltip: '<img src=\"media/images/silk/icons/error.png\" align=\"left\"/><div style=\"padding-bottom:2px;margin-left:25px;\">Newly created arrays will not appear in the MPA\'s window above until an MPA is added to an Array.<br>To do this, edit an MPA and select an Array from the dropdown list.</div>'

});

gwst.actions.utils.setUser = function(json){
    gwst.app.userManager.setUser(new gwst.data.mlpaFeatures.User(json));
}


gwst.actions.help = new Ext.Action({
    text: 'Help',
    handler: function(target, e) {
        if (!gwst.app.helpWindow) {
            gwst.app.helpWindow = new Ext.Window({
                id: 'windowSplash',
                closeAction: 'hide',
                //modal: true,
                width: 600,
                items: [
                    new Ext.TabPanel({
                        deferredRender: false,
                        labelWidth: 75,
                        height: 465,
                        activeTab: 0,
                        border: false,
                        items: [
                            gwst.app.splashScreen = new gwst.widgets.URLViewer({
                                url: gwst.urls.splash,
                                title: 'News'
                            }),
                            gwst.app.tutorialScreen = new gwst.widgets.URLViewer({
                                url: gwst.urls.tutorials,
                                title: 'Screencasts'
                            }),
                            gwst.app.faq = new gwst.widgets.URLViewer({
                                url: gwst.urls.faq,
                                title: 'FAQ',
                                autoScroll: true
                            })
                        ]
                    })

                ]
            });
        }
        gwst.app.helpWindow.show();
    },
    iconCls: 'blist',
    tooltip: 'Show Help Window'
});


gwst.actions.login = new Ext.Action({
    text: 'Login',
    handler: function(target, e) {
        var w = new Ext.Window({
            closable: false,
            modal: true,
            width: 380,
            items: [
			    new gwst.widgets.LoginForm()
		    ]
        });
        gwst.actions.currentLoginWindow = w;
        w.show();
    },
    tooltip: 'Log in to gwst'
});


gwst.actions.logout = new Ext.Action({
    text: 'Logout',
    handler: function(target, e){
		// Basic request
		Ext.Ajax.request({
		   url: gwst.urls.logout,
		   success: function(){
				//window.location = gwst.urls.index
				gwst.app.userManager.setUser(null);
                // gwst.actions.utils.logoutUser();
			},
		   failure: function(){}
		});
    },
    tooltip: 'Log out of gwst'
});


gwst.actions.resetPassword = new Ext.Action({
    text: 'Reset Password',
    handler: function(target, e){
        var w = new Ext.Window({
            closable: false,
		    modal: true,
            width: 380,
		    items:[
			    new gwst.widgets.PasswordResetForm()
		    ]
	    });
		w.show();
    },
    tooltip: 'Email me my password'
});


gwst.actions.changePassword = new Ext.Action({
    text: 'Change Password',
    handler: function(target, e) {
        var w = new Ext.Window({
            closable: false,
            modal: true,
            width: 380,
            items: [
    		    new gwst.widgets.PasswordChangeForm()
    	    ]
        });
		w.show();
    },
    tooltip: 'Change my password'
});


gwst.actions.userPrefsDropdown = new Ext.Action({
    text: 'UserPrefs',
    // handler: function(target, e){
    //     gwst.actions.utils.clearMenus(e);
    //     Ext.Msg.show({
    //         title: 'Not Implemented',
    //         msg: 'Would open a modal dialog for modifying prefs.',
    //         animEl: target.id
    //     });
    // },
    tooltip: 'Modify user preferences',
    user: null
});

gwst.actions.finishGroup = new Ext.Action({
    text: 'Return to Interview Menu',
    iconCls: 'yes-icon',
    handler: function(target, e){
        window.onbeforeunload = null;
        //window.open("/group_status/");
        window.location="/group_status/";
    }
});

gwst.actions.drawMPA = new Ext.Action({
    text: 'Draw area',
    iconCls: 'add-icon',
    handler: function(target, e){
        gwst.actions.utils.askUserToDefineGeometry({
            resource: target,
            finish: function(geometry, clipped){ 
                $.ajax({
                   data: {geometry:geometry, geometry_clipped:clipped, resource:target}, //form.serializeArray(),
                   dataType: 'json',
                   success: function(data, textStatus){
                       // gwst.ui.wait.hide(true);
                       mpa = gwst.data.mlpaFeatures.mpa_from_geojson(data);
                       
                       gwst.actions.utils.enableComponents();
                       gwst.app.clientStore.add(mpa);
                       gwst.app.selectionManager.setSelectedFeature(mpa);
                       //gwst.ui.modal.hide(false, true);
                       //gwst.actions.openMpaAttributes.execute({mpa: mpa});
                   },
                   error: function(request, textStatus, errorThrown){
                       
                       // Ext.Msg.alert('error saving MPA');
                        gwst.ui.error.show({errorText: 'There was a problem saving your new MPA. This error will show up in our logs, but if the problem persists please follow up with an administrator.', debugText: request.responseText, logText: 'Error saving new MPA'});
                        gwst.actions.utils.enableComponents();
                   },
                   type: 'POST',
                   url: '/save_shape/' //form.attr('action')
                });
            
                /*mlpa.mpaForm.show({
                    geometries: [geometry, clipped],
                    success: function(mpa){
                        //gwst.app.reportsVisor.update();
                        gwst.actions.utils.enableComponents();
                        gwst.app.clientStore.add(mpa);
                        gwst.app.selectionManager.setSelectedFeature(mpa);
                        gwst.ui.modal.hide(false, true);
                        gwst.actions.openMpaAttributes.execute({mpa: mpa});
                    },
                    cancel: function(){
                        gwst.actions.utils.enableComponents();
                    },
                    error: function(response){
                        // Ext.Msg.alert('error saving MPA');
                        gwst.ui.error.show({errorText: 'There was a problem saving your new MPA. This error will show up in our logs, but if the problem persists please follow up with an administrator.', logText: 'Error saving new MPA'});
                        gwst.actions.utils.enableComponents();
                    }
                });*/
            },
            cancel: function(){
                gwst.actions.utils.enableComponents();
            }
        });
    }
});

gwst.actions.handlers = {};

/********************* MPA Geometry Editing Actions *************************/

/*gwst.actions.enterMPAGeometryEditMode = new Ext.Action({
    text: 'Edit Geometry',
    iconCls: 'editGeo',
    handler: function(target, e){
        var mpa = target.mpa;
        if(mpa.editable != true){
            alert('This is a read-only MPA that cannot be edited or deleted.');
            return;
        }
        if(mpa.user != gwst.app.userManager.user.pk){
            alert('You cannot edit the geometry of an MPA that does not belong to you.');
            return;
        }
        // gwst.actions.nonExt.removeMPAFromInterface(mpa);
        gwst.app.map.removeMPAs([mpa]);
        gwst.actions.utils.askUserToDefineGeometry({
            geometry: mpa.feature.attributes.original_geometry,
            finish: function(geometry, clipped){
                gwst.ui.wait.show({msg:'While we save your geometry changes'});
                mpa.saveGeometryChanges(geometry, clipped, {
                    success: function(mpa){
                        gwst.ui.wait.hide();
                        gwst.actions.utils.enableComponents();
                        gwst.app.clientStore.add(mpa);
                        gwst.app.selectionManager.setSelectedFeature(mpa);
                    },
                    error: function(request, textStatus, errorThrown){
                        gwst.ui.error.show({errorText: 'Problem saving your geometry', debugText: request.responseText, logText: 'Problem saving geometry changes.'});
                        gwst.actions.utils.enableComponents();
                    }
                });
            },
            cancel: function(){
                gwst.actions.utils.enableComponents();
                
                gwst.app.map.addMPAs([mpa]);
                // gwst.app.selectionManager.setSelectedFeature(mpa, {});
            }
        });
    }
});*/

gwst.actions.englishMeasurements = new Ext.Action({
    text: 'miles',
    enableToggle: true,
    pressed: true,
    toggleGroup: 'measurements',
    tooltip: 'Measure in feet / miles (English/imperial units)',
    toggleHandler: function(target, enabled){
        if (enabled) {
            var controlToolbar = Ext.getCmp('mt1');
            for ( i = 0; i < controlToolbar.controls.length; i++ ) {
                if ( controlToolbar.controls[i].CLASS_NAME = "OpenLayers.Control.Measure" ) {
                    controlToolbar.controls[i].displaySystem = "english";
                }
            }
        }
    }
});

gwst.actions.metricMeasurements = new Ext.Action({
    text: 'kilometers',
    enableToggle: true,
    toggleGroup: 'measurements',
    tooltip: 'Measure in meters / kilometers (metric units)',
    toggleHandler: function(target, enabled){
        if (enabled) {
            var controlToolbar = Ext.getCmp('mt1');
            for ( i = 0; i < controlToolbar.controls.length; i++ ) {
                if ( controlToolbar.controls[i].CLASS_NAME = "OpenLayers.Control.Measure" ) {
                    controlToolbar.controls[i].displaySystem = "metric";
                }
            }
        }
    }
});

gwst.actions.nauticalMeasurements = new Ext.Action({
    text: 'nautical miles',
    enableToggle: true,
    toggleGroup: 'measurements',
    tooltip: 'Measure in nautical miles',
    toggleHandler: function(target, enabled){
        if (enabled) {
            var controlToolbar = Ext.getCmp('mt1');
            for ( i = 0; i < controlToolbar.controls.length; i++ ) {
                if ( controlToolbar.controls[i].CLASS_NAME = "OpenLayers.Control.Measure" ) {
                    controlToolbar.controls[i].displaySystem = "nautical";
                }
            }
        }
    }
});


gwst.actions.openMpaAttributes = new Ext.Action({
    text: 'Full Info',
    // tooltip: 'View attributes and editing options',
    iconCls: 'attributes',
    handler: function(target, e){
        var pk = target.mpa.pk;
        var url = gwst.urls.mpaAttributes + pk;
        if(target['saved']){
            url = url + "?saved=True";
        }
        gwst.ui.modal.show({width: 500, url: url, waitMsg: 'while we retrieve information for this MPA.', afterRender: function(){
            $('li.editmpa a').bindButton(function(e){gwst.actions.nonExt.editMpaAttributes(e);}, {mpa: target.mpa});
            $('li.deletempa a').bindButton(gwst.actions.nonExt.deleteMPA, {mpa: target.mpa});
        }});
    }
});

/********************** Start of non-Ext.Action actions *********************/

gwst.actions.nonExt = {};

gwst.actions.nonExt.editMpaAttributes = function(e){
    $(this).unbind('click');
    //gwst.ui.modal.hide(false);
    var mpa = e.data.mpa;
    gwst.editMpaAttributes(mpa);
}

gwst.editMpaAttributes = function(mpa){
    /*if(mpa.editable != true){
        alert('This is a read-only shape that cannot be edited or deleted.');
        return;
    }*/
    mlpa.mpaForm.show({
       editUrl: mpa.editUrl(),
       success: function(new_mpa){
           gwst.ui.modal.hide(false, true);
           gwst.app.clientStore.add(new_mpa);
           gwst.app.selectionManager.setSelectedFeature(new_mpa);
       },
       error: function(response){
           gwst.ui.error.show({errorText:'There was a problem saving your shape attributes. Please try again.', logText: 'Problem saving shape attributes.'});
       },
       cancel: function(){
       }
    });
}

gwst.actions.nonExt.enterMPAGeometryEditMode = function(e){
    $(this).unbind('click');
    var mpa = e.data.mpa;
    
    if(mpa.user != gwst.app.userManager.user.pk){
        alert('You cannot edit the geometry of an MPA that does not belong to you.');
        return;
    }
    // gwst.actions.nonExt.removeMPAFromInterface(mpa);
    mpa.callWithFeature( function(mpa){
        gwst.app.map.removeMPAs([mpa]);
        gwst.actions.utils.askUserToDefineGeometry({
            geometry: mpa.feature.attributes.original_geometry,
            orig_shape_id: mpa.pk,
            finish: function(geometry, clipped){
                gwst.ui.wait.show({msg:'While we save your geometry changes'});
                mpa.saveGeometryChanges(geometry, clipped, {
                    success: function(mpa){
                        gwst.ui.wait.hide();
                        gwst.actions.utils.enableComponents();
                        gwst.app.clientStore.add(mpa);
                        gwst.app.selectionManager.setSelectedFeature(mpa);
                    },
                    error: function(request, textStatus, errorThrown){
                        gwst.ui.error.show({errorText: 'Problem saving your geometry', debugText: request.responseText, logText: 'Problem saving geometry changes.'});
                        gwst.actions.utils.enableComponents();
                    }
                });
            },
            cancel: function(){
                gwst.actions.utils.enableComponents();
                
                gwst.app.map.addMPAs([mpa]);
                // gwst.app.selectionManager.setSelectedFeature(mpa, {});
            }
        });
    });
};


gwst.actions.nonExt.deleteMPA = function(e){
    var mpa = e.data.mpa;
    /*if(mpa.editable != true){
        alert('This is a read-only shape that cannot be edited or deleted.');
        return;
    }*/
    var answer = confirm('Are you sure you want to delete this shape?');
    // gwst.ui.modal.show({msg: 'while the mpa is deleted'});
    if(answer){
        gwst.ui.modal.hide(false, true);
        $(this).unbind('click');
        $.ajax({
            url: gwst.urls.deleteMPA + mpa.pk,
            type: 'POST',
            success: function(){
                // gwst.ui.modal.hide();
                // gwst.actions.nonExt.removeMPAFromInterface(mpa);
                gwst.app.clientStore.remove(mpa);
            },
            error: gwst.actions.defaultErrorHandler
        });
    }else{
        // do nothing
    }
}

/*gwst.actions.nonExt.deleteArray = function(array){
    var answer = confirm('Are you sure you want to delete this Array? MPAs that you have created will be retained and put back into your MPA list.');
    if(answer){
        $(this).unbind('click');
        // gwst.ui.wait.show({msg: 'while the array is deleted.'});
        $.ajax({
            data: {pk: array.pk},
            url: gwst.urls.deleteArray,
            type: 'POST',
            dataType: 'json',
            success: function(data){
                gwst.ui.modal.hide(false, true);
                gwst.app.selectionManager.clearSelection();
                // gwst.ui.wait.hide();
                var remove = array.get_mpas();
                remove.push(array);
                gwst.app.clientStore.remove(remove);
                if(data && data.length){
                    var mpas = [];
                    for(var i=0; i<data.length;i++){
                        var mpa = gwst.data.mlpaFeatures.mpa_from_geojson(data[i]);
                        mpas.push(mpa);
                    }
                    gwst.app.clientStore.add(mpas);
                }else{
                }
            },
            error: gwst.actions.defaultErrorHandler
        });
    }else{
        // do nothing
    }
};

gwst.actions.nonExt.deleteArrayAndMpas = function(array){
    var answer = confirm('Are you sure you want to delete this Array? THIS ACTION WILL DELETE ALL MPAs IN THIS ARRAY!');
    if(answer){
        var answer = confirm('Are you still sure? (Sorry for the redundancy, we just want to prevent any mistakes.)');
        if(answer){
            $(this).unbind('click');
            // gwst.ui.wait.show({msg: 'while the array is deleted.'});
            gwst.ui.modal.hide(false, true);
            $.ajax({
                data: {pk: array.pk},
                url: '/gwst/array/delete-all/',
                type: 'POST',
                dataType: 'json',
                success: function(data){
                    gwst.app.selectionManager.clearSelection();
                    var mpas = array.get_mpas();
                    mpas.push(array);
                    // gwst.ui.wait.hide();
                    gwst.app.clientStore.remove(mpas);
                },
                error: gwst.actions.defaultErrorHandler
            });
        }
    }
};*/

gwst.actions.nonExt.addMpasToInterface = function(mpas){
    //gwst.app.reportsVisor.update();
    var store = Ext.getCmp('maptoolbar').mlpaFeaturesMenu.MPAStore;
    for(var i = 0; i<mpas.length; i++){
        store.add(mpas[i]);
    }
    store.sort('name');
}

gwst.actions.nonExt.addArrayMpasToMap = function(array){
    return gwst.app.mapToolbar.mlpaFeaturesMenu.addArrayMpas(array);
}

gwst.actions.async = {};


gwst.actions.async.clipGeometry = function(config){
    gwst.ui.wait.show({msg: 'while we validate your geometry'});
    if(config['geometry'] && config['error'] && config['fail'] && config['success']){
        Ext.Ajax.request({
            url: gwst.urls.validateGeometry,
            method: 'POST',
            disableCachingParam: true,
            params: { 
                geometry : config['geometry'].toString(),
                resource : config['resource'],
                orig_shape_id : config['orig_shape_id']
                },
            success: function(response, opts){
                gwst.ui.wait.hide();
                var text = response.responseText;
                var json = eval('(' + text + ')');
                var status_code = parseFloat(json['status_code']);
                if(status_code == 1 || status_code == 0 || status_code == 5){
                    var geometry = json['original_geom'];
                    var clipped_geometry = json['clipped_mpa_geom'];
                    config['success'](status_code, geometry, clipped_geometry);
                }else if(status_code != 4){
                    config['error'](status_code, config['geometry']);
                }else{
                    config['fail'](response, opts);
                }
            },
            failure: function(response, opts){
                gwst.ui.wait.hide();
                config['fail'](response, opts);
            }
        });
    }else{
        gwst.ui.error.show({errorText: 'gwst client is improperly configured to handle this action. Please contact an administrator.', logText: 'gwst.actions.async.clipGeometry was called with improper attributes'});
    }
};

/*gwst.actions.nonExt.createOrModifyArray = function(pk){
    gwst.app.selectionManager.clearSelection();
    var url = '/gwst/arrays/';
    if(pk){
        url = url + pk + '/edit/';
    }else{
        url = url + 'create/';
    }
    gwst.ui.form.show(url, function(json){
        // succes handler
        // errors and cancel handlers are default
        var data = gwst.data.mlpaFeatures.array_and_mpas_from_geojson(json);
        var array = data[0];
        var mpas = data[1];
        mpas.push(array);
        gwst.app.clientStore.add(mpas);
        gwst.ui.wait.hide();
        gwst.app.selectionManager.setSelectedFeature(array);
    });
};

gwst.actions.nonExt.openUserInfo = function(user){
    gwst.ui.modal.show({width: 300, url: '/gwst/user/'+user.pk, waitMsg: 'while we retrieve information for this user.'});
};

gwst.actions.nonExt.openArrayBasicInfo = function(pk){
    gwst.ui.modal.show({width: 500, url: '/gwst/array/'+pk, waitMsg: 'while we retrieve information for this Array.'});
};*/

gwst.actions.nonExt.openTreeTutorial = function(pk){
    gwst.ui.modal.show({width: 500, url: '/gwst/tree_tutorial'});
};

/*gwst.actions.nonExt.copyMPA = function(e){
    gwst.ui.wait.show({
        waitMsg: 'While we copy this shape'
    });
    $.ajax({
        url: '/gwst/shape/copy/', 
        type: 'POST', 
        data: {pk: e.data.mpa.pk}, 
        success: function(data){
            var mpa = gwst.data.mlpaFeatures.mpa_from_geojson(data);
            // var reader = new gwst.data.MLPAFeatureReader({root: 'mpa'}, gwst.data.MPA);
            // mpa_record = reader.readRecords({mpa: [mpa]}).records[0];
            gwst.ui.wait.hide();
            // gwst.actions.nonExt.addMPAToInterface(mpa_record, true);
            gwst.app.clientStore.add(mpa);
            gwst.app.selectionManager.setSelectedFeature(mpa);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if(XMLHttpRequest.status == 401){
                gwst.ui.error.show({
                    errorText: 'You must be logged in to perform this operation.'
                });                        
            }else if(XMLHttpRequest.status == 403){
                gwst.ui.error.show({
                    errorText: 'You do not have permission to copy this object.'
                });
            }else if(XMLHttpRequest.status == 404){
                gwst.ui.error.show({
                    errorText: 'The object you are trying to copy does not exist.'
                });
            }else{
                gwst.ui.error.show({
                    errorText: 'An unknown server error occured. Please try again later.'
                });
            }
        },
        dataType: 'json'
    });
};*/

gwst.actions.nonExt.copyShape = function(e){
    gwst.copyInProgress = true;
    gwst.copySource = e.data.mpa.pk;
    gwst.copySourceType = 'shape';
    
    alert( 'Shape selected. Right-click a group and select paste to finish.' ); 
};

gwst.actions.nonExt.copyAllShapes = function(e){
    gwst.copyInProgress = true;
    gwst.copySource = e.data.pk;
    gwst.copySourceType = 'resource';
    
    alert( 'Shapes selected. Right-click another group and select paste to finish.' ); 
};

gwst.actions.nonExt.copyToTarget = function(e){
    if ( gwst.copyType='resource' && gwst.copySource == e.data.pk ){
        alert('You cannot copy shapes within a single group.');
        return;
    }
    
    gwst.ui.wait.show({
        waitMsg: 'While we copy these shapes'
    });
    
    $.ajax({
        url: '/gwst/shapes/copy/', 
        type: 'POST', 
        data: {target: e.data.pk, source:gwst.copySource, source_type:gwst.copySourceType}, 
        success: function(data){
            var mpas = gwst.data.mlpaFeatures.mpas_from_geojson(data);
            gwst.ui.wait.hide();
            gwst.app.clientStore.add(mpas);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if(XMLHttpRequest.status == 401){
                gwst.ui.error.show({
                    errorText: 'You must be logged in to perform this operation.'
                });                        
            }else if(XMLHttpRequest.status == 403){
                gwst.ui.error.show({
                    errorText: 'You do not have permission to copy this object.'
                });
            }else if(XMLHttpRequest.status == 404){
                gwst.ui.error.show({
                    errorText: 'The object you are trying to copy does not exist.'
                });
            }else if(XMLHttpRequest.status == 420){
                gwst.ui.error.show({
                    errorText: 'You cannot copy a shape into its original resource group.'
                });
            }else if(XMLHttpRequest.status == 421){
                gwst.ui.error.show({
                    errorText: 'One or more shapes would overlap in the target resource group.'
                });
            }else{
                gwst.ui.error.show({
                    errorText: 'An unknown server error occured. Please try again later.'
                });
            }
        },
        dataType: 'json'
    });
    
    gwst.copyInProgress=false;
    gwst.copySource='none';
    gwst.copySourceType = 'none';
};

/*gwst.actions.nonExt.copyArray = function(pk){
    var answer = confirm('By copying an Array, all member MPAs will also be copied and assigned to you so that you can edit them. The Array will recieve the same name + "_copy" added to the end, and will be added to your Marine Protected Areas listing. This may take a moment, please be patient and give your computer a minute to load the new MPAs.');
    if(answer){
        gwst.ui.wait.show({
            waitMsg: 'While we copy this Marine Protected Area'
        });
        $.ajax({
            url: '/gwst/array/copy/', 
            type: 'POST', 
            data: {pk: pk}, 
            success: function(json){
                var data = gwst.data.mlpaFeatures.array_and_mpas_from_geojson(json);
                var array = data[0];
                var mpas = data[1];
                mpas.push(array);
                gwst.app.clientStore.add(mpas);
                gwst.ui.wait.hide();
                gwst.app.selectionManager.setSelectedFeature(array);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                if(XMLHttpRequest.status == 401){
                    gwst.ui.error.show({
                        errorText: 'You must be logged in to perform this operation.'
                    });                        
                }else if(XMLHttpRequest.status == 403){
                    gwst.ui.error.show({
                        errorText: 'You do not have permission to copy this object.'
                    });
                }else if(XMLHttpRequest.status == 404){
                    gwst.ui.error.show({
                        errorText: 'The object you are trying to copy does not exist.'
                    });
                }else{
                    gwst.ui.error.show({
                        errorText: 'An unknown server error occured. Please try again later.'
                    });
                }
            },
            dataType: 'json'
        });        
    }
};

gwst.actions.setupEconomicAnalysis = function(){
    //Request the available fishery impact analysis parameters
    $.ajax({
        url: '/gwst/econ_analysis/available/', 
        type: 'GET',  
        success: function(user_groups){
            //Load the available parameters and display the selector
            gwst.data.FisheryImpactAnalysisUserGroups = user_groups;
            gwst.app.FisheryImpactAnalysisSelector = new gwst.widgets.FisheryImpactAnalysisSelectorWindow();                      
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if(XMLHttpRequest.status == 400){
                gwst.ui.error.show({
                    errorText: 'You must use a GET request.'
                });
            }else if(XMLHttpRequest.status == 401){
                gwst.ui.error.show({
                    errorText: 'You must be logged in to perform this operation.'
                });                        
            }else if(XMLHttpRequest.status == 403){
                gwst.ui.error.show({
                    errorText: 'You do not have permission to analyze this mpa'
                });
            }else if(XMLHttpRequest.status == 404){
                gwst.ui.error.show({
                    errorText: 'That mpa does not exist'
                });
            }else{
                gwst.ui.error.show({
                    errorText: 'An unknown server error occured. Please try again later.'
                });
            }
        },
        dataType: 'json'
    });
};

gwst.actions.openEconomicAnalysis = function(selectedFeature){
    gwst.app.FisheryImpactAnalysisSelector.setMPA(selectedFeature.pk);
    gwst.app.FisheryImpactAnalysisSelector.show();
};

gwst.actions.openStaffSummary = function(arrayId){
    gwst.actions.openUrl('/gwst/array/staffsummary/'+arrayId);
}

gwst.actions.openArrayReplication = function(arrayId){
    gwst.actions.openUrl('/gwst/report/array/replication/'+arrayId);
}

gwst.actions.openHabitatPauloFormat = function(arrayId){
    gwst.actions.openUrl('/gwst/report/array/habitat/antiquated/'+arrayId);
}*/

gwst.actions.openUrl = function(url){
    window.onbeforeunload = null;
    window.open(url);
    window.onbeforeunload = gwst.backWarn;
    return false;
}

gwst.actions.defaultErrorHandler = function(XMLHttpRequest, textStatus, errorThrown){
    if(XMLHttpRequest.status == 401){
        gwst.ui.error.show({
            errorText: 'You must be logged in to perform this operation.'
        });                        
    }else if(XMLHttpRequest.status == 403){
        gwst.ui.error.show({
            errorText: 'You do not have permission to modify this object.'
        });
    }else if(XMLHttpRequest.status == 404){
        gwst.ui.error.show({
            errorText: 'This object cannot be found in the database.'
        });
    }else{
        gwst.ui.error.show({
            errorText: 'An unknown server error occured. Please try again later.'
        });
    }
}

gwst.actions.openAttributesCSV = function(arrayId){
    // console.log(arrayId);
    window.onbeforeunload = null;
    window.open('/gwst/array/csv/'+arrayId);
    window.onbeforeunload = gwst.backWarn;
}

