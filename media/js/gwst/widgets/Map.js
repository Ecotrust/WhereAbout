/*
Map
* 
* Google base layer switching happens 2 different ways.  using the zoomend map event
* it will switch to satellite base when zoomed far in.  Switching on the sat 
* layer via the data layers menu will also trigger a base layer switch and use
* a flag 'baseToggled' to make sure that it stays on regardless of any zoom level
* changes. 
*/

Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.Map = Ext.extend(mapfish.widgets.MapComponent, {
    // Constructor Defaults, can be overridden by user's config object
    id: 'map',
    layout: 'fit',
    region: 'center',
    border: false,
    buttonAlign: 'right',
    baseToggled: false,
    initComponent: function(){

        // avoid pink tiles
        OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
        //OpenLayers.Util.onImageLoadErrorColor = "transparent";
        OpenLayers.Tile.Image.useBlankTile = true;
        
        OpenLayers.Util.onImageLoadError = function() {
            /**
             * For images that don't exist in the cache, you can display
             * a default image - one that looks like water for example.
             * To show nothing at all, leave the following lines commented out.
             */
            //this.src = OpenLayers.Util.getImagesLocation() + "blank.gif";
            //this.style.display = "";
        };
        
        this.balloonTemplate = tmpl([
            '<div class="mpaPopup" style="width:225px;height:6em;">',
                '<a class="closePopup" href="#" onclick="gwst.app.selectionManager.clearSelection();"><img src="/site-media/images/silk/icons/cancel.png" /></a>',
                '<h3><%= mpa.name.length > 23 ? mpa.name.substr(0, 23) + "..." : mpa.name %></h3>',
                '<p class="creator">created by <%= mpa.get_user().name %> on <%= new Date(mpa.date_created).format("m/d/y") %></p>',
                '<p class="designation"><img style="background-color:<%= mpa.feature.attributes.fillColor %>;" width="15" height="10" src="/site-media/js/extjs/resources/images/default/s.gif" /> <%= mpa.get_designation() != null ? mpa.get_designation().name : "No designation" %></p>',
                '<div id="popupToolbarSpace">&nbsp;</div>',
            '</div>'
        ].join(''));
        
        this.wktParser = new OpenLayers.Format.WKT();
        
        var self = this;
        $(this.userManager).bind('change', function(e, user, oldUser){
            self.clearFeatures();
        });
        
        $(this.store).bind('removed', function(e, items){
            if(items['mpa'] && items['mpa'].length){
                for(var i=0; i<items['mpa'].length; i++){
                    var mpa = items['mpa'][i];
                    if(mpa.feature && self.vectorLayer.getFeatureById(mpa.feature.id)){
                        self.destroyMPAs([mpa]);
                    }
                }
            }
        });
        
        $(this.store).bind('updated', function(e, items){
            self.deselectAllMPAs();
            self.hideMPAPopup();
            if(items['mpa'] && items['mpa'].length){
                var add = [];
                for(var i=0; i<items['mpa'].length; i++){
                    var mpa = items['mpa'][i][0];
                    var old_mpa = items['mpa'][i][1];
                    add.push(mpa);
                    // old_mpa feature should be destroyed already
                }
                // if(remove.length){
                //     self.destroyMPAs(remove);
                // }
                self.addMPAs(add);
            }
        });
        
        this.on("bodyresize", function(){
            var x = (Ext.Element(this.contentEl).getWidth() / 2) - 30;
            this.panzoom.position = new OpenLayers.Pixel(x, 15);
            this.panzoom.redraw();
        }, this);

        var styleMap = new OpenLayers.StyleMap({
            'default': new OpenLayers.Style({
                fillColor: '${fillColor}',
                fillOpacity: 0.4,
                strokeColor: '${strokeColor}',
                strokeOpacity: 1,
                strokeWidth: 1,
                cursor: 'pointer'
            }),
            'select': new OpenLayers.Style({
               strokeWidth: 3,
               fillColor: '${fillColor}',
               strokeColor: 'yellow',
               strokeOpacity: 1,
               fillOpacity: 0.4,
               cursor: 'default'
            }),
            'temporary': new OpenLayers.Style({
                fillColor: 'red'
            })
        });
        
        this.vectorLayer = new OpenLayers.Layer.Vector('mlpaFeatures',{
            styleMap: styleMap
        });
  
        this.map.addLayers([
            gwst.data.GoogleTerrain, 
            gwst.data.GoogleSat, 
            this.vectorLayer
        ]);

        this.clippedGeometryPreview = null;
        
        //Panzoom
        this.panzoom = new OpenLayers.Control.PanZoomBar();
        var x = (Ext.Element(this.contentEl).getWidth() / 2) - 30;
        this.panzoom.position = new OpenLayers.Pixel(x, 15);
        this.map.addControl(this.panzoom);       
        
        this.map.events.register("zoomend", this, this.toggleBase);
        
        // Might be needed
        this.map.events.register("click", this, function(){
            this.selectionManager.clearSelection();
        });
        
        this.drawMPAControl = new OpenLayers.Control.DrawFeature(
            this.vectorLayer, 
            OpenLayers.Handler.Polygon, 
            {
                featureAdded: this.handleDrawMPA,
                handlerOptions: {
                    options: {
                        scope: this
                    }
                }
            }
        );
        this.map.addControl(this.drawMPAControl);
        
        this.map.addControl(new OpenLayers.Control.MousePosition());
        //Wheel zoom and double click zoom
        navopt = { handleRightClicks: true };
        this.map.addControl(new OpenLayers.Control.Navigation(navopt));
        this.map.addControl(new OpenLayers.Control.ZoomBox());        

        //this.map.addControl(new OpenLayers.Control.Measure(null, {}));
        
        this.map.zoomToExtent(this.studyRegion.extent());
        // Call parent (required)
        gwst.widgets.Map.superclass.initComponent.apply(this, arguments);
        
        var self = this;
        
        this.over = null;
        this.selectControl = new OpenLayers.Control.SelectFeature(
            this.vectorLayer,
            {
                multiple: true,
                clickout: true,
                callbacks: {
                    'click': function(feature){
                        self.selectionManager.setSelectedFeature(feature.attributes.mpa, self);
                        feature.attributes.mpa.selectedOnMap = true;
                    },
                    'clickout': function(feature){
                        if(self.over == null){
                            // self.deselectAllMPAs()
                            self.selectionManager.clearSelection(self);
                        }else{
                            // do nothing, changing
                        }
                        feature.attributes.mpa.selectedOnMap = false;
                    },
                    'over': function(feature){
                        self.over = feature;
                    },
                    'out': function(feature){
                        self.over = null;
                    }
                }
            }
        );
        
        $(this.selectionManager).bind('selectionChange', function(e, sm, selected, old, caller){
            self.selectItem(selected, caller);
        });
        
        this.map.addControl(this.selectControl);
        this.selectControl.activate();
        
        this.editVectorLayer = new OpenLayers.Layer.Vector('editFeature');
        this.editSelectControl = new OpenLayers.Control.SelectFeature(
            this.editVectorLayer,
            {
                clickout: false,
                multiple: false,
                toggle: false
            }
        );
        this.modifyControl = new OpenLayers.Control.ModifyFeature(this.editVectorLayer, {selectControl: this.editSelectControl});
        this.map.addLayer(this.editVectorLayer);
        this.map.addControl(this.modifyControl);
        this.map.addControl(this.editSelectControl);
        this.map.extCmp = this;
        
        // this.selectionManager.addListener('change', this.onSelectionManagerChange, this);
        
        // this.addEvents({
        //     // Fires whenever a polygon is drawn successfully.
        //     // func(mapComponent, geometry)
        //     'MPAGeometryDrawn': true,
        //     // Fires whenever an MPA or Array is added to the Map
        //     'MLPAFeaturseAdded': true,
        //     // Fires whenever an MPA or Array is removed from the map
        //     'MLPAFeaturesRemoved': true,
        //     // Data Layer Added
        //     'DataLayersAdded': true,
        //     // Data Layer Removed
        //     'DataLayersRemoved': true
        // });
        // After parent code
        // e.g. install event handlers on rendered component
    },
    
    selectItem: function(selected, caller){
        var self = this;
        if(selected != null && selected.model == 'mpa'){
            selected.callWithFeature(function(){self.showMPAPopup(selected)});
        }else{
            this.hideMPAPopup();
        }
        if(caller != this){
            if(selected){
                if(selected.model == 'mpa'){
                    this.deselectAllMPAs();
                    selected.callWithFeature(function(mpa, feature){
                        self.selectMPA(mpa);
                    });
                }else{
                    this.deselectAllMPAs();
                    selected.callWithFeature(function(array){
                        array.each_mpa(function(mpa){
                            if(self.vectorLayer.getFeatureById(mpa.feature.id)){
                                self.selectMPA(mpa);
                            }else{
                                // console.log('mpa not on the map yet!: '+mpa.pk);
                            }
                        });
                    });
                }
            }else{
                this.deselectAllMPAs();
            }
        }
    },
    
    deselectAllMPAs: function(){
        var remove = [];
        for(var i=0; i<this.vectorLayer.selectedFeatures.length; i++){
            remove.push(this.vectorLayer.selectedFeatures[i].attributes.mpa);
        }
        for(var i=0; i<remove.length;i++){
            this.deselectMPA(remove[i]);
        }
    },
    
    selectMPA: function(mpa){
        if(!mpa.selectedOnMap){
            this.selectControl.select(mpa.feature);
            mpa.selectedOnMap = true;
        }
        var bounds = mpa.feature.geometry.getBounds();
        var center = bounds.getCenterLonLat();
        if(!this.map.getExtent().containsBounds(bounds)){
            this.map.setCenter(center);
        }
    },
    
    deselectMPA: function(mpa){
        if(mpa.selectedOnMap){
            this.selectControl.unselect(mpa.feature);
            mpa.selectedOnMap = false;
        }
    },
        
    toggleBase: function() {    	            
    	var new_zoom_level = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
    	//Check if sat is on and should remain on
    	if (this.baseSatOn) {
    		return;
    	}    	    	
        if (new_zoom_level > gwst.data.TERRAIN_MAX_ZOOM_LEVEL) {
            this.map.setBaseLayer(gwst.data.GoogleSat);
        } else {
        	this.map.setBaseLayer(gwst.data.GoogleTerrain);
        }
    },
    
    // onSelectionManagerChange: function(mngr, selection, oldSelection){
    //     if(selection && selection instanceof gwst.data.MPA){
    //         this.selectControl.unselectAll();
    //         var loaded = this.loadedMPA[selection.get('pk')];
    //         if(loaded == null && selection instanceof gwst.data.MPA){
    //             this.addMLPAFeatures([selection]);
    //             loaded = this.loadedMPA[selection.get('pk')];
    //         }
    //         this.selectControl.select(loaded[1]);
    //         if(!this.changeFromClick){
    //             var bounds = loaded[1].geometry.getBounds();
    //             var center = bounds.getCenterLonLat();
    //             if(this.map.getExtent().containsBounds(bounds)){
    //                 this.map.panTo(center);
    //             }else{
    //                 this.map.setCenter(center);
    //             }
    //         }
    //         this.showMPAPopup(loaded[1]);
    //     }else{
    //         this.selectControl.unselectAll();
    //         if(selection && selection instanceof gwst.data.Array){
    //             var mpas = gwst.actions.nonExt.addArrayMpasToMap(selection);
    //             this.selectControl.multiple = true;
    //             for(var i = 0; i <= mpas.length; i++){
    //                 var mpa = mpas[i];
    //                 if(mpa){
    //                     var loaded = this.loadedMPA[mpa.get('pk')];
    //                     this.selectControl.select(loaded[1]);
    //                 }
    //             }
    //             this.selectControl.multiple = false;                
    //         }
    //     }
    // },

    showMPAPopup: function(mpa){
        // var user = mpa.get_user();
        // //
        // if(!user){
        //     throw('mpa.get_user not working!'+ mpa.client_id);
        // }
        /*if(mpa.model != 'mpa'){
            throw('oh crap not an mpa', mpa);
        }
        html = this.balloonTemplate({mpa: mpa});
        ll = mpa.feature.geometry.getBounds().getCenterLonLat();
        var callback = function(feature){this.map.extCmp.selectControl.unselectAll();};
        this.popup = new OpenLayers.Popup.Anchored("mpaPopup",ll,null,html, null, false);
        this.popup.panMapIfOutOfView = false;
        this.popup.autoSize = true;
        this.popup.padding = 0;
        if(!mpa.feature.onScreen(true)){
            this.map.setCenter(mpa.feature.geometry.getBounds().getCenterLonLat());
        }
        this.map.addPopup(this.popup, true);

        var full = new Ext.Button(gwst.actions.openMpaAttributes);
        full.mpa = mpa;
        var geoedit = new Ext.Button(gwst.actions.enterMPAGeometryEditMode);
        geoedit.mpa = mpa;
        // var addToArray = new Ext.Button(gwst.actions.addMpaToArray);
        // addToArray.mpa = mpa;
        items = [full];
        if(this.userManager.user && mpa.user == this.userManager.user.pk){
            items.push(geoedit);
        }
        items.push({xtype: 'tbtext', text: '<a onmouseover="window.onbeforeunload = null;" onmouseout="window.onbeforeunload = gwst.backWarn;" class="gwst-button kml" href="/gwst/kml/mpa/'+mpa.pk+'">kml</a>'});
        
        var bbar = new Ext.Toolbar({
            id: 'popupTbar',
            items: items,
            renderTo: 'mpaPopup'
        });
        bbar.show();*/
    },
    
    hideMPAPopup: function(feature){
        if(this.popup){
            this.map.removePopup(this.popup);
            this.popup = null;
        }
    },
    
    zoomIn: function(){
        this.map.zoomIn();
    },

    zoomOut: function(){
        this.map.zoomOut();
    },

    handleDrawMPA: function(feature, opts){
        gwst.app.map.newFeature = feature;
        this.deactivate();
        feature.layer.removeFeatures([feature]);
        gwst.app.map.fireEvent('GeometryCreated', feature.geometry);
    },

    startDrawMPA: function(){
        this.deselectAllMPAs();
        this.drawMPAControl.activate();
    },

    cancelDrawMPA: function(){
        this.drawMPAControl.deactivate();
    },
    
    addDataLayer: function(layer) {
        if (layer instanceof OpenLayers.Layer.Google) {
        	//Says sat should stay on all the time regardless of zoom level, because its on in the menu
            this.baseSatOn = true;       	
            this.map.setBaseLayer(gwst.data.GoogleSat);
            // Dirty, ugly, shamefull hack to get tiles in the lower half of 
            // the screen to load
            this.setWidth(this.getSize().width + 1);
            this.setWidth(this.getSize().width - 1);
        } else {
            this.map.addLayer(layer);
        }
    },
    
    removeDataLayer: function(layer) {
        if (layer instanceof OpenLayers.Layer.Google) {
        	//Allow google base layer switching based on zoom level to happen again
            this.baseSatOn = false;        	
            this.map.setBaseLayer(gwst.data.GoogleTerrain);
        } else {
            this.map.removeLayer(layer);
        }
    },

    addMPAs: function(mpas){
        var self = this;
        for(var i=0; i<mpas.length;i++){
            mpas[i].callWithFeature(function(mpa, feature){
                self.vectorLayer.addFeatures([feature]);
                if(gwst.app.selectionManager.selectedFeature && (mpa.pk == gwst.app.selectionManager.selectedFeature.pk || mpa.array == gwst.app.selectionManager.selectedFeature.pk)){
                    self.selectMPA(mpa);
                    if(gwst.app.selectionManager.selectedFeature.client_id == mpa.client_id){
                        self.showMPAPopup(mpa);
                    }
                }
            });
        }
    },
    
    removeMPAs: function(mpas){
        var self = this;
        this.hideMPAPopup();
        for(var i=0; i<mpas.length;i++){
            mpas[i].callWithFeature(function(mpa, feature){
                self.deselectMPA(mpa);
                self.vectorLayer.removeFeatures([feature]);
            });
        }
    },
    
    destroyMPAs: function(mpas){
        var self = this;
        this.hideMPAPopup();
        for(var i=0; i<mpas.length;i++){
            mpas[i].callWithFeature(function(mpa, feature){
                self.selectControl.unselect(mpa.feature);
                self.vectorLayer.destroyFeatures([feature]);
            });
        }        
    },
    
    addClippedGeometryPreview: function(wkt){
        this.clearClippedGeometryPreview();
        this.clippedGeometryPreview = this.wktParser.read(wkt);
        this.clippedGeometryPreview.attributes = {fillColor: 'purple', strokeColor: 'orange'};
        this.vectorLayer.addFeatures([this.clippedGeometryPreview]);
        // this.editVectorLayer.addFeatures([this.clippedGeometryPreview]);
        this.selectControl.select(this.clippedGeometryPreview);
        bounds = this.clippedGeometryPreview.geometry.getBounds();
        this.map.panTo(bounds.getCenterLonLat());
        
        // KJV 11/21/08: deactivate zoom to newly created MPA
        //zoom = this.map.getZoomForExtent(bounds, true);
        //this.map.zoomTo(zoom - 1);
    },
    
    clearClippedGeometryPreview: function(){
        if(this.clippedGeometryPreview){
            this.vectorLayer.removeFeatures(this.clippedGeometryPreview);            
            this.clippedGeometryPreview = null;
        }else{
        }
    },

    addEditableGeometry: function(geometry){
        this.selectControl.deactivate();
        var feature;
        if(geometry instanceof OpenLayers.Feature.Vector){
            feature = geometry;
        }else{
            feature = this.wktParser.read(geometry);
        }
        feature.id = 'featureforedit';
        this.editVectorLayer.addFeatures([feature]);

        this.editSelectControl.activate();

        
        this.modifyControl.activate();
        
        this.editSelectControl.select(feature);
    },
    
    finishGeometryEditing: function(){
        this.editSelectControl.unselectAll();

        // IF YOU DONT CALL THIS NEXT LiNE YOU WONT GET MPA CLICK SELECTIONS BACK!!!
        this.modifyControl.deactivate();
        
        this.editSelectControl.deactivate();
        
        var feature = this.editVectorLayer.getFeatureById('featureforedit');
        var geo = feature.geometry;
        feature.layer.removeFeatures([feature]);
        
        this.selectControl.activate();
        return geo;
    },
    
    zoomToFeature: function(feature){
        if(feature['model'] != 'mpa' && feature['model'] != 'array'){
            throw('zoomToFeature must be called with feature of type mpa or array');
        }
        var self = this;
        feature.callWithFeature(function(){
            self._zoomToFeatureCallback(feature);
        });
    },
    
    _zoomToFeatureCallback: function(feature){
        var bounds = new OpenLayers.Bounds();
        if(feature['model'] == 'mpa'){
            bounds = feature.feature.geometry.getBounds();
        }else if(feature['model'] == 'array'){
            feature.each_mpa(function(mpa){
                if(!bounds){
                    bounds = mpa.feature.geometry.getBounds();
                }else{
                    bounds.extend(mpa.feature.geometry.getBounds());
                }
            });
        }
        var center = bounds.getCenterLonLat();
        var zoom = this.map.getZoomForExtent(bounds);
        if(zoom > 8){
            zoom = 8;
        }
        if(zoom > 5){
            zoom = zoom - 1;
        }
        this.map.setCenter(center, zoom);
    },
    
    clearFeatures: function(feature){
        this.vectorLayer.removeFeatures(this.vectorLayer.features);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-widgets-map', gwst.widgets.Map);