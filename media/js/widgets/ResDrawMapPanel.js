Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResDrawMapPanel = Ext.extend(GeoExt.MapPanel, {
    //Default properties can defined here and overriden by config object passed to contructor
	
    defaultZoom: 8,
    maxZoom: 13,
    minZoom: 6,
    autoZoom: false,
    
    initComponent: function(){
    	//Constructor config object already applied by now.  Properties can be added/overridden using Ext.apply	
		
    	//res-shape-drawn event fired after user draws a new shape on the map.
    	//Arguments: the OL feature drawn on the map
		this.addEvents('res-shape-started');
		this.addEvents('res-shape-complete');
	
		//Map region
		var region = gwst.settings.region;
		var map_extent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
	    var region_extent = new OpenLayers.Bounds(region.w_bound,region.s_bound,region.e_bound,region.n_bound)
	    
	    //Map base options
        var map_options = {
			controls: [],
            projection: new OpenLayers.Projection("EPSG:900913"),
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            units: "m",
            numZoomLevels: 18,
            maxResolution: 156543.0339,
            maxExtent: map_extent,
            eventListeners: {
                "zoomend": this.zoomHandler,
                scope: this
            }
        };        
        
        //------------------------------------ ISSUE -------------------------------------------------------//
        // The style used for 'default' is applied to both the features that the user draws as well as
            // the circles created for vertices in edit mode. With the 'label' attribute set, this leads to 
            // 'undefined' being printed on every vertex and virtual vertex.  This was overcome with a rule
            // borrowed mostly from some forum postings between Alex Dean and Arnd Wippermann:
            // http://osgeo-org.1803224.n2.nabble.com/undefined-at-vertices-while-editing-vector-layer-td5478330.html

        //Map vector style
        var defaultStyle = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            fillColor: '#ff8c00',
            fillOpacity: 0.4,
            strokeColor: '#ff8c00',
            strokeOpacity: 1,
            strokeWidth: 1,
            cursor: 'pointer',
            pointerEvents: "visiblePainted",
            // label : "${pennies}",
            fontColor: "black",
            fontSize: "12px",
            labelAlign: "cm"            
        }, OpenLayers.Feature.Vector.style["default"]));
        
        var otherDefaultStyle = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            fillColor: 'blue',
            fillOpacity: 0.4,
            strokeColor: 'blue',
            strokeOpacity: 1,
            strokeWidth: 1,
            cursor: 'pointer',
            pointerEvents: "visiblePainted",
            // label : "${resource}",
            fontColor: "black",
            fontSize: "12px",
            labelAlign: "cm"            
        }, OpenLayers.Feature.Vector.style["default"]));
        
        var selectStyle = new OpenLayers.Style(OpenLayers.Util.applyDefaults({ 
            strokeWidth: 3,
            fillColor: '#ff8c00',
            strokeColor: 'yellow',
            strokeOpacity: 1,
            fillOpacity: 0.4,
            cursor: 'default',
            pointerEvents: "visiblePainted",
            label : "${pennies}",
            fontColor: "black",
            fontSize: "12px",
            labelAlign: "cm"
        }, OpenLayers.Feature.Vector.style["select"]));
        
        var otherSelectStyle = new OpenLayers.Style(OpenLayers.Util.applyDefaults({ 
            strokeWidth: 3,
            fillColor: 'blue',
            strokeColor: 'lightgreen',
            strokeOpacity: 1,
            fillOpacity: 0.4,
            cursor: 'default',
            pointerEvents: "visiblePainted",
            // label : "${Resource}",
            fontColor: "black",
            fontSize: "12px",
            labelAlign: "cm"
        }, OpenLayers.Feature.Vector.style["select"]));

        var tempStyle = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            fillColor: '#ff8c00',
            fillOpacity: 0.4,
            strokeWidth: 2,
            strokeColor: '#ff8c00',
            strokeOpacity: 1
        }, OpenLayers.Feature.Vector.style["temporary"]));
        
        var labelRules = [
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                    property: "pennies",
                    value: undefined
                }),
                symbolizer: {
                    label: "${pennies}"
                },
                elseFilter: false
            }),
            new OpenLayers.Rule({
                symbolizer: {},
                elseFilter: true
            })
        ]; 
        
        defaultStyle.addRules(labelRules);

        var myStyle = new OpenLayers.StyleMap({
            'default': defaultStyle,
            'select': selectStyle,
            'temporary': tempStyle
        }); 
        
        var myOtherStyle = new OpenLayers.StyleMap({
            'default': otherDefaultStyle,
            'select': otherSelectStyle,
            'temporary': tempStyle
        });
        
        var accessPointStyle = new OpenLayers.StyleMap({
            'default':{
                label : "${name}",
                externalGraphic : "/site-media/images/access_marker.png",
                fontColor: "black",
                fontSize: "9px",
                labelAlign: "l",
                pointRadius: 5,
                labelXOffset : "5"
            },
            'select':{
                externalGraphic : "/site-media/images/selected_marker.png"
            }
        });
	    
        var baseLayer = new OpenLayers.Layer.TMS(
            "NCC California Nautical Charts", 
            ["/tiles/Cali_Nautical_Charts/Charts/"], 
            {              
                buffer: 1,
                'isBaseLayer': true,
                visibility: false,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = map.getZoom();
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 12 && z >= 6 ) {
                        var res = map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        );
        
        this.vecLayer = new OpenLayers.Layer.Vector('Target Areas',{
            styleMap: myStyle
        });       

        this.vecOtherLayer = new OpenLayers.Layer.Vector('Other Target Areas',{
            styleMap: myOtherStyle
        });
        
        this.acc_pt_vector = new OpenLayers.Layer.Vector("Access Points", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            projection: map_options.displayProjection,
            protocol: new OpenLayers.Protocol.HTTP({
                url: "/site-media/kml/ncc_access_points.kml",
                format: new OpenLayers.Format.KML({
                    extractStyles: false, 
                    extractAttributes: true,
                    maxDepth: 2
                })
            }),
            styleMap: accessPointStyle
        });
        
        this.acc_pt_vector.events.on({
            "featureselected": this.onFeatureSelect,
            "featureunselected": this.onFeatureUnselect
        });
        
        this.mpa_all = new OpenLayers.Layer.Vector("All MPAs", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            projection: map_options.displayProjection,
            protocol: new OpenLayers.Protocol.HTTP({
                url: "/site-media/kml/ncc_mpa_existing_all.kml",
                format: new OpenLayers.Format.KML({
                    extractStyles: true, 
                    extractAttributes: true,
                    maxDepth: 2
                })
            })
        });
        
        this.mpa_all.events.on({
            "featureselected": this.onFeatureSelect,
            "featureunselected": this.onFeatureUnselect
        });
        
        this.mpa_smr = new OpenLayers.Layer.Vector("State Marine Reserves", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            projection: map_options.displayProjection,
            protocol: new OpenLayers.Protocol.HTTP({
                url: "/site-media/kml/ncc_mpa_existing_smr.kml",
                format: new OpenLayers.Format.KML({
                    extractStyles: true, 
                    extractAttributes: true,
                    maxDepth: 2
                })
            })
        });
        
        this.mpa_smr.events.on({
            "featureselected": this.onFeatureSelect,
            "featureunselected": this.onFeatureUnselect
        });
        
        this.mpa_smca = new OpenLayers.Layer.Vector("State Marine Conservation Areas", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            projection: map_options.displayProjection,
            protocol: new OpenLayers.Protocol.HTTP({
                url: "/site-media/kml/ncc_mpa_existing_smca.kml",
                format: new OpenLayers.Format.KML({
                    extractStyles: true, 
                    extractAttributes: true,
                    maxDepth: 2
                })
            })
        });
        
        this.mpa_smca.events.on({
            "featureselected": this.onFeatureSelect,
            "featureunselected": this.onFeatureUnselect
        });
        
        this.mpa_smrma = new OpenLayers.Layer.Vector("State Marine Recreational Management Area", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            projection: map_options.displayProjection,
            protocol: new OpenLayers.Protocol.HTTP({
                url: "/site-media/kml/ncc_mpa_existing_smrma.kml",
                format: new OpenLayers.Format.KML({
                    extractStyles: true, 
                    extractAttributes: true,
                    maxDepth: 2
                })
            })
        });
        
        this.mpa_smrma.events.on({
            "featureselected": this.onFeatureSelect,
            "featureunselected": this.onFeatureUnselect
        });
        
        this.mpa_specialclosures = new OpenLayers.Layer.Vector("Special Closures", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            projection: map_options.displayProjection,
            protocol: new OpenLayers.Protocol.HTTP({
                url: "/site-media/kml/ncc_mpa_existing_specialclosure.kml",
                format: new OpenLayers.Format.KML({
                    extractStyles: true, 
                    extractAttributes: true,
                    maxDepth: 2
                })
            })
        });
        
        this.mpa_specialclosures.events.on({
            "featureselected": this.onFeatureSelect,
            "featureunselected": this.onFeatureUnselect
        });
        
        this.vecLayer.events.on({
            "sketchstarted": this.resShapeStarted,
            "skethmodified": this.resShapeModified,
            "sketchcomplete": this.resShapeComplete,
            // "featureselected": this.onAreaSelect,
            // "featureunselected": this.onFeatureUnselect,
            scope: this
        });        

		//Required: Create div element for OL map before constructing it.  OL really wants you to tell
        //it what it's div is in the constructor.  If you let Ext create it's own div element at render time
        //OL won't know where it is.  This is fine usually except the Google base map doesn't work properly in
        //Safari in this case, it won't let you draw vectors.
		Ext.DomHelper.append(document.body, [{
			id: 'ol-map'
		}]);        
        
        //Create the map and dump everything in
	    map = new OpenLayers.Map('ol-map', map_options);
		map.addControl(new OpenLayers.Control.Navigation());		
        map.addControl(new OpenLayers.Control.PanZoomBar());
		map.addControl(new OpenLayers.Control.MousePosition());
        map.addControl(new OpenLayers.Control.KeyboardDefaults());
        
        
		this.drawResControl = new OpenLayers.Control.DrawFeature(
            this.vecLayer, 
            OpenLayers.Handler.Polygon
        );
        
       	map.addControl(this.drawResControl);
        map.addLayers([baseLayer, this.vecLayer, this.vecOtherLayer, this.mpa_smr, this.mpa_smca, this.mpa_smrma, this.mpa_specialclosures, this.acc_pt_vector]);
        
        this.selectControl = new OpenLayers.Control.SelectFeature([this.vecLayer, this.vecOtherLayer, this.acc_pt_vector ,this.mpa_smr, this.mpa_smca, this.mpa_smrma, this.mpa_specialclosures]);
        map.addControl(this.selectControl);
        this.selectControl.activate();

        this.modifyControl = new OpenLayers.Control.ModifyFeature(this.vecLayer);
        map.addControl(this.modifyControl);
        
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        
        var layerStore = new GeoExt.data.LayerStore({
            layers: [baseLayer],
            map: this.map
        });
        
        //Update internal MapPanel properties
		Ext.apply(this, {
		    map: map,
		    layers: layerStore,
		    extent: map_extent,
	        center: region_extent.getCenterLonLat(),
	        zoom: this.defaultZoom
		});   

        this.acc_pt_vector.setVisibility(false);
		
        // Call parent (required)
		gwst.widgets.ResDrawMapPanel.superclass.initComponent.call(this);
    },
    
    
    onPopupClose: function(evt) {
        this.select_all.unselectAll();
        this.select_smr.unselectAll();
        this.select_smca.unselectAll();
        this.select_smrma.unselectAll();
        this.select_specialclosures.unselectAll();
    },
    
    onFeatureSelect: function(event) {
        var feature = event.feature;
        var popup = new OpenLayers.Popup.FramedCloud(
            "MPA-popup",                                        //id
            feature.geometry.getBounds().getCenterLonLat(),     //lon-lat
            new OpenLayers.Size(100,100),                       //size
            "<h2>"+feature.attributes.name + "</h2>",           //html
            null,                                               //anchor
            true,                                               //closeBox
            this.onPopupClose                                   //closeBoxCallback
        );
        feature.popup = popup;
        map.addPopup(popup);
    },
    
    // onAreaSelect: function(event) {
        // var area = event.feature;
        // var popup = new OpenLayers.Popup.FramedCloud(
            // "Area-popup",                                       //id
            // area.geometry.getBounds().getCenterLonLat(),        //lon-lat
            // new OpenLayers.Size(100,100),                       //size
            // "<h2>"+area.attributes.resource + "</h2> Pennies: "+area.attributes.pennies,           //html
            // null,                                               //anchor
            // true,                                               //closeBox
            // this.onPopupClose                                   //closeBoxCallback
        // );
        // area.popup = popup;
        // map.addPopup(popup);
    // },
    
    // onOtherAreaSelect: function(event) {
        // var other_area = event.feature;
        // var popup = new OpenLayers.Popup.FramedCloud(
            // "other-area-popup",                                 //id
            // other_area.geometry.getBounds().getCenterLonLat(),  //lon-lat
            // new OpenLayers.Size(100,100),                       //size
            // "<h2>"+other_area.attributes.resource + "</h2>",    //html
            // null,                                               //anchor
            // true,                                               //closeBox
            // this.onPopupClose                                   //closeBoxCallback
        // );
        // feature.popup = popup;
        // map.addPopup(popup);
    // },
    
    onFeatureUnselect: function(event) {
        var feature = event.feature;
        if(feature.popup) {
            map.removePopup(feature.popup);
            feature.popup.destroy();
            delete feature.popup;
        }
    },

    
    zoomHandler: function() {
        var zoomLvl = this.map.getZoom();
        if (zoomLvl > this.maxZoom){
            if (!this.autoZoom) {
                gwst.error.load('You are already at the maximum zoom level available.');
            }
            this.map.zoomTo(this.maxZoom);
        } else if (zoomLvl < this.minZoom){
            if (!this.autoZoom) {
                gwst.error.load('You are already at the minimum zoom level available.');
            }
            this.map.zoomTo(this.minZoom);
        }
        this.autoZoom = false;
    },
    
    getLayerStore: function() {
    	return this.layers;
    },
    
    hidePanZoomBar: function() {
    	Ext.query(".olControlPanZoomBar")[0].style.display = 'none';
    },
    
    showPanZoomBar: function() {
        Ext.query(".olControlPanZoomBar")[0].style.display = 'none';
    	Ext.query(".olControlPanZoomBar")[0].style.display = 'block';
        Ext.query(".olControlPanZoomBar")[0].style.left = '';
    },
    
    zoomToMapRegion: function(region) {
        this.autoZoom = true
    	this.mapRegion = region;
    	this.mapRegion.bounds = new OpenLayers.Bounds(region.w_bound,region.s_bound,region.e_bound,region.n_bound);
    	this.map.zoomToExtent(this.mapRegion.bounds);
    },
    
    zoomToResShape: function(feature) {
        this.autoZoom = true
        this.map.zoomToExtent(feature.geometry.bounds);
        this.selectControl.unselectAll();
    	this.selectControl.select(feature);
    },
    
    zoomToOtherResShape: function(feature) {
        this.autoZoom = true
        this.map.zoomToExtent(feature.geometry.bounds);
        // this.selectOtherControl.unselectAll();
        this.selectControl.unselectAll();
    	// this.selectOtherControl.select(feature);
    	this.selectControl.select(feature);
    },
    
    zoomToAllShapes: function() {
        this.autoZoom = true
    	this.map.zoomToExtent(this.vecLayer.getDataExtent());    	
    },
    
    zoomToAllOtherShapes: function() {
        this.autoZoom = true
    	this.map.zoomToExtent(this.vecOtherLayer.getDataExtent());    	
    },
    
    zoomToPoint: function(pnt) {
    	var lonlat = new OpenLayers.LonLat(pnt.geometry.x, pnt.geometry.y);
    	this.map.setCenter(lonlat, this.maxZoom-1);
    },
    
    getShapeLayer: function() {
        this.autoZoom = true
    	return this.vecLayer;
    },
    
    getOtherShapeLayer: function() {
        this.autoZoom = true
    	return this.vecOtherLayer;
    },
    
    enableResDraw: function() {
    	this.drawResControl.activate();
        this.selectControl.unselectAll();
    },
    
    disableResDraw: function() {
        this.drawResControl.deactivate();
    },
    
    resShapeStarted: function(evt) {
    	this.fireEvent('res-shape-started');
    },
    
    resShapeModified: function(evt) {
    	this.fireEvent('res-shape-modified', evt);
    },
    
    resShapeComplete: function(evt) {
    	this.fireEvent('res-shape-complete', evt.feature);
    	return false;
    },
    
    modifyShape: function(feature) {
        this.modifyControl.activate();
        this.modifyControl.selectControl.select(feature);
    },
    
    finModifyShape: function() {
        this.modifyControl.deactivate();
    },
    
    removeLastShape: function() {
    	this.vecLayer.removeFeatures([this.curShape]);
    },

    cancelResShape: function() {
    	this.disableResDraw();
    },
    
    redoResShape: function() {
    	this.disableResDraw();
    },
    
    addShape: function(vec) {
    	//Initialize the feature so that the label is accurate
    	Ext.apply(vec.attributes,{'pennies':0});
    	this.vecLayer.addFeatures([vec]);
    	this.selectControl.select(vec);
    	this.curShape = vec;
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-res-draw-map-panel', gwst.widgets.ResDrawMapPanel);