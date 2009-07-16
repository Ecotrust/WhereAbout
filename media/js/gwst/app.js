// reference local blank image
Ext.BLANK_IMAGE_URL = '/site-media/js/extjs/resources/images/default/s.gif';

// create namespace
Ext.namespace('gwst');

gwst.backWarn = function () {
   return "Your shape drawing session will end if you continue.";
};

// create application
gwst.app = function() {
    // do NOT access DOM from here; elements don't exist yet
    // private variables
    /*********** Event handlers **************/
    function onViewportResize(target, adjWidth, adjHeight, width, height) {
        /** Update Legend Size **/
        var reportsHeight = 350;
        var tbar = Ext.getCmp('map').getTopToolbar();
        // alert(jQuery.browser.msie);
        // if(jQuery.browser.msie){
        //     reportsHeight = 370;
        // }
        var nheight = adjHeight - reportsHeight - tbar.getSize().height;
        // Ext.getCmp('legend').setHeightConstrained(nheight);
        /** Update Reports Size **/
        // var reportsVisor = Ext.getCmp('reportsvisor');
        // if (reportsVisor) {
        //     reportsVisor.setWidth(adjWidth);
        //     reportsVisor.setExpandedY(adjHeight - reportsVisor.height);
        // }
        var edit = Ext.getCmp('editmodetoolbar');
        if (edit) {
            edit.setWidth(gwst.app.viewport.getSize().width);
        }
        // if(Ext.getCmp('viewport')){
        //     
        // }
        // reportsVisor.initSwf();
    }

    // private functions

    // public space
    return {
        // public properties, e.g. strings to translate

        // public methods
        initUser: function(){
            jQuery.ajax({
                url: gwst.urls.user,
                dataType: 'json',
                success: function(data){
			        gwst.app.userManager.setUser(
			            new gwst.data.mlpaFeatures.User(data['user'])
			        );
			        //gwst.app.reportsVisor.activate();                  
                },
                error: function(){
                    gwst.app.userManager.setUser(null);
                    //gwst.app.reportsVisor.activate();
                }
            })
        },
        
        init: function(){
            
            this.userManager = new gwst.ui.UserManager();
            
            $('#jLoading').ajaxStart(function(){
                $(this).show();
            });
            $('#jLoading').ajaxStop(function(){
                $(this).hide();
            });
            
            /*********** First Browser Checks *******************************/
            //Kill application if these browsers are found
            /*if (jQuery.browser.msie && jQuery.browser.version.substr(0,1) == '8') {
                alert('You will need to enable "Compatibility View" to use gwst with Microsoft Internet Explorer 8. Press the broken-page button next to the url field to enable Compatibility View. We are hoping to fix this problem shortly.');
                // Ext.MessageBox.alert("Browser Check","Sorry gwst does not function correctly in Internet Explorer 6.  Supported browsers include Mozilla Firefox 2+, Apple Safari 3+, Opera 9.6+ and Internet Explorer 7+");
                // this.hide_load();
                return;
            }*/
            
            if (jQuery.browser.msie && jQuery.browser.version.substr(0,1) == '6') {
                Ext.MessageBox.alert("Browser Check","Sorry gwst does not function correctly in Internet Explorer 6.  Supported browsers include Mozilla Firefox 2+, Apple Safari 3+, Opera 9.6+ and Internet Explorer 7+");
                this.hide_load();
                return;
            }
            //Need google chrome check
            
            window.onbeforeunload = gwst.backWarn;
            
            /*********** Global Variables *******************************/
            
            this.selectionManager = new gwst.ui.SelectionManager();

            $(this.selectionManager).bind('selectionChange', function(e, m, f){
                if(e.caller && e.caller.id == "selection-breadcrumbs" && f['model'] == 'array'){
                    gwst.app.map.zoomToFeature(f);
                }
            });
            
            // $(this.selectionManager).bind('selectionChange', function(e, m, f, o){
            //     alert('selectionChange');
            // });

            /*********** Map and Viewport Setup *****************/

            var options = {
                projection: gwst.config.projection,
                displayProjection: gwst.config.displayProjection,
                units: "m",
                numZoomLevels: 18,
                maxResolution: 156543.0339,
                studyRegion: new gwst.data.StudyRegion({
                    name: "California North Coast",
                    bounds: "-15077376.825366,4202140.84394,-12930699.199147,5584937.481539"
                }),
                maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34),
                //             restrictedExtent: new OpenLayers.Bounds(-13877376.825366, 3552140.84394,-12430699.199147, 4334937.481539),
                controls: []
                // theme: null
            };
            
            this.clientStore = new gwst.ui.ClientStore();
            
            $(this.clientStore).bind('removed', function(e, items){
                gwst.app.selectionManager.clearSelection();
                if(items['mpa'] && items['mpa'].length){
                    for(var i=0; i<items['mpa'].length; i++){
                        // AVOID MEMORY LEAKS, DESTROY UNUSED FEATURES!!                    
                        var old_mpa = items['mpa'][i];
                        if(old_mpa.feature){
                            old_mpa.feature.destroy();
                        }
                    }
                }
            });
                        
            $(this.clientStore).bind('updated', function(e, items){
                var mpas_updated = (items['mpa'] && items['mpa'].length);
                var arrays_updated = (items['array'] && items['array'].length);
                if(mpas_updated || arrays_updated){
                    gwst.app.selectionManager.clearSelection();
                    if(mpas_updated){
                        for(var i=0; i<items['mpa'].length; i++){
                            var old_mpa = items['mpa'][i][1];
                            // AVOID MEMORY LEAKS, DESTROY UNUSED FEATURES!!
                            if(old_mpa.feature){
                                old_mpa.feature.destroy();
                            }
                        }
                    }
                }
            });
            
            gwst.app.FeaturesMenu = new gwst.widgets.FeaturesMenu({
                selectionManager: this.selectionManager,
                store: this.clientStore,
                extWindow: true,
                userManager: this.userManager
            });
            
            $(gwst.app.FeaturesMenu).bind('mpaToggle', function(event, mpas, state){
                state ? gwst.app.map.addMPAs(mpas) : gwst.app.map.removeMPAs(mpas)
            });
            
            $(gwst.app.FeaturesMenu).bind('featureDoubleClick', function(e, feature){
               gwst.editMpaAttributes(feature);
            });
            
            $(gwst.app.FeaturesMenu).bind('folderDoubleClick', function(e, pk){
            });
            
            $(this.userManager).bind('change', function(e, user, oldUser){
                gwst.app.selectionManager.clearSelection();
                gwst.app.clientStore.clear();
                gwst.app.FeaturesMenu.clear();
                gwst.app.FeaturesMenu.showSpinner();
                
                var url;
                //if(user){
                    url = '/shapes/';
                    gwst.app.FeaturesMenu.showTools();
                //}else{
                //url = '/gwst/public_features/';
                //    gwst.app.FeaturesMenu.hideTools();
                //}
                
                jQuery.ajax({
                    type: 'GET',
                    url: url,
                    success: function(data){
                        gwst.app.FeaturesMenu.hideSpinner();
                        var json = eval('('+data+')');
                        var features = gwst.app.FeaturesMenu.init(json);
                        delete json['features'];
                        delete json['me'];
                        delete json['mpa'];
                        //delete json['array'];
                        var hash = gwst.ui.data.from_json(json, gwst.data.mlpaFeatures.lookup);
                        hash['mpa'] = features['mpa'];
                        //hash['array'] = features['array'];
                        gwst.app.clientStore.load(hash);
                        if(!gwst.app.userManager.user){
                            gwst.app.FeaturesMenu.tree.append('<br /><div style="color:#6C7C90;"><h3>Public Account</h3><p>Please login to view your saved shapes or create new ones.</p></div>');
                        }
                    },
                    error: function(){
                        gwst.ui.error.show({errorText: 'There was a problem fetching the feature listing.'});
                    }
                });
            });
            
            this.mapToolbar = new gwst.widgets.MapToolbar({
                user: this.user,
                id: 'maptoolbar',
                featuresMenu: gwst.app.FeaturesMenu,
                userManager: this.userManager,
                onAddMapLayer: function(layer) {
                    gwst.app.map.addDataLayer(layer);
                },
                onRemoveMapLayer: function(layer) {
                    gwst.app.map.removeDataLayer(layer);                 
                },
                selectionManager: this.selectionManager
            });
            
            
            this.map = new gwst.widgets.Map({
                id: 'map',
                region: 'center',
                map: new OpenLayers.Map(document.getElementById('map'), options),
                studyRegion: options.studyRegion, //this.user.get('studyRegion'),
                selectionManager: gwst.app.selectionManager,
                listeners: {
                    'resize': onViewportResize
                },
                tbar: this.mapToolbar,
                userManager: this.userManager,
                store: this.clientStore
            });

            this.viewport = new Ext.Viewport({
                id: 'viewport',
                layout: 'border',
                minWidth: 1024,
                items: [
                    this.map,
                    {
                        region:'south',
                        height: 40
                    }
                ]
            });
            // 
            // this.layer = new Ext.Layer({
            //     id: 'testlayer',
            //     shadow: true,
            //     width: 1000,
            //     height: 10,
            //     html: 'blah',
            //     x: 0,
            //     y: 100,
            //     region: 'center',
            //     layout: 'absolute',
            //     shim: true,
            //     constrain: true
            // });
            // this.layer.update('<div><img src="" width="2000" height="5" /></div>');
            // this.layer.center();
            // this.layer.setLocation(0, gwst.app.mapToolbar.getEl().getSize().height - 5);
            // this.layer.setZIndex(100);
            // this.layer.show();
            // 
            // Ext.getCmp('map').el.on(
            //     'click',
            //     function(target){
            //         Ext.getCmp('maptoolbar').collapseMenus();
            //     }
            // );

            /*********** MapToolWindow setup ***********************/            
            
            this.mapToolWindow = new gwst.widgets.MapToolWindow();
            this.mapToolWindow.show();
            
            /*********** ReportsVisor setup ***********************/

            //this.reportsVisor = new gwst.widgets.ReportsViewer(this.selectionManager, this.userManager, this.clientStore);
            //need to show then hide to have this render properly
            // this.reportsVisor.show();
            // this.reportsVisor.hide();

            this.statusPanel = new Ext.Window({
                // title: 'About Geometry Changes',
                html: '',
                width: 400,
                autoHeight: true,
                resizable: false,
                collapsible: true,
                draggable: false,
                closable: false,
                x: 2,
                y: 35
            });
            this.statusPanel.show();
            this.statusPanel.hide();

            /* Setup reportsVisor dimensions and position */
            var size = this.viewport.getSize();
            // this.reportsVisor.setWidth(size.width);
            // this.reportsVisor.setExpandedY(size.height - this.reportsVisor.height);
            // this.statusPanel.setPosition(size.width/2 - this.statusPanel.width/2, 30);

            // Enable tooltips. Tooltip text is set within gwst.actions
            Ext.QuickTips.init();
            this.initUser();
                        
            //gwst.actions.help.execute();
            
            /********* Fishery Impact Analysis Setup **********/
            
            //gwst.actions.setupEconomicAnalysis();                      

            /*********** Second Browser Checks *******************************/
            //Just warn the user if they have these browsers, still allow the tool to load
            //if (Ext.isOpera) {
            //    Ext.MessageBox.alert("Browser Check","You may experience problems using the Opera web browser.  Supported browsers include Mozilla Firefox 2+, Apple Safari 3+ and Internet Explorer 7+");                
            //} 
            
            this.hide_load();
            
            // Hotkeys
            var app = this;
            /*$(document).keypress(function(e){
                if(e.which == 181 || e.which==109 && e.altKey == true){ // alt+m
                    var ids = prompt("Type in an MPA ID, or multiple ID's seperated by a comma.");
                    ids = ids.split(',');
                    for(var i=0; i< ids.length; i++){
                        if(ids[i]){
                            var id = ids[i].replace(' ', '');
                            var feature = app.clientStore.get('mpa', id);
                            if(feature){
                                app.FeaturesMenu.toggleFeature(feature);                            
                            }                            
                        }
                    }
                    if(ids.length == 1){
                        var id = ids[0].replace(' ', '');
                        var feature = app.clientStore.get('mpa', ids[0]);
                        if(feature){
                            app.selectionManager.setSelectedFeature(feature);
                        }
                    }
                }
            });*/
        },
        
        hide_load: function(){
            //turn off loading mask
            Ext.get('loading-mask').fadeOut({remove: true});
            Ext.get('loading').fadeOut({remove: true});            
        }
    };
}(); // end of app
