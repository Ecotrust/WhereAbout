Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResDrawMapPanel = Ext.extend(GeoExt.MapPanel, {
    //Default properties can defined here and overriden by config object passed to contructor
	
    defaultZoom: 7,
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
        
        this.vecLayer = new OpenLayers.Layer.Vector('Fishing Grounds',{
            styleMap: myStyle
        });       

        this.vecOtherLayer = new OpenLayers.Layer.Vector('Other Fishing Grounds',{
            styleMap: myOtherStyle
        });
        
        this.vecLayer.events.on({
            "sketchstarted": this.resShapeStarted,
            "skethmodified": this.resShapeModified,
            "sketchcomplete": this.resShapeComplete,
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
        this.selectControl = new OpenLayers.Control.SelectFeature(this.vecLayer);        
        map.addControl(this.selectControl);
        this.selectControl.activate();
        
        this.selectOtherControl = new OpenLayers.Control.SelectFeature(this.vecOtherLayer);        
        map.addControl(this.selectOtherControl);
        this.selectOtherControl.activate();
        
        this.modifyControl = new OpenLayers.Control.ModifyFeature(this.vecLayer);
        map.addControl(this.modifyControl);

        map.addLayers([baseLayer, this.vecLayer, this.vecOtherLayer]);
        
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
		
        // Call parent (required)
		gwst.widgets.ResDrawMapPanel.superclass.initComponent.call(this);
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
        this.selectOtherControl.unselectAll();
    	this.selectOtherControl.select(feature);
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
    	this.map.setCenter(lonlat, this.maxZoom);
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
        this.enableResDraw();
    },
    
    redoResShape: function() {
    	this.disableResDraw();
        this.enableResDraw();
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