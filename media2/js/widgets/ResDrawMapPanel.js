Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResDrawMapPanel = Ext.extend(GeoExt.MapPanel, {
    //Default properties can defined here and overriden by config object passed to contructor
	
    initComponent: function(){
    	//Constructor config object already applied by now.  Properties can be added/overridden using Ext.apply	
		
    	//res-shape-drawn event fired after user draws a new shape on the map.
    	//Arguments: the OL feature drawn on the map
		this.addEvents('res-shape-started');
		this.addEvents('res-shape-complete');
	
		//Map region
		var region = gwst.settings.region;	    
	    var map_extent = new OpenLayers.Bounds(region.w_bound,region.s_bound,region.e_bound,region.n_bound)
	    
	    //Map base options
        var map_options = {
			controls: [],
            projection: new OpenLayers.Projection("EPSG:900913"),
            units: "m",
            numZoomLevels: 18,
            maxResolution: 156543.0339,
            maxExtent: map_extent,
        };        

        //Map vector style
        var styleMap = new OpenLayers.StyleMap({
            'default': new OpenLayers.Style({
                fillColor: 'orange',
                fillOpacity: 0.4,
                strokeColor: 'orange',
                strokeOpacity: 1,
                strokeWidth: 1,
                cursor: 'pointer',
                pointerEvents: "visiblePainted",
                label : "${pennies}",
                fontColor: "black",
                fontSize: "12px",
                labelAlign: "cm"
            }),
            'select': new OpenLayers.Style({
                strokeWidth: 3,
                fillColor: 'orange',
                strokeColor: 'yellow',
                strokeOpacity: 1,
                fillOpacity: 0.4,
                cursor: 'default',
                pointerEvents: "visiblePainted",
                label : "${pennies}",
                fontColor: "black",
                fontSize: "12px",
                labelAlign: "cm"
            }),
            'temporary': new OpenLayers.Style({
                fillColor: 'orange',
                fillOpacity: 0.4,
                strokeWidth: 2,
                strokeColor: 'orange',
                strokeOpacity: 1
            })
        });	    
	    
	    //Map base layers
        var baseLayer = new OpenLayers.Layer.Google(
            "Google Satellite",
            {
            	type: G_HYBRID_MAP, 
            	sphericalMercator: true,
            	minZoomLevel: 6, 
            	maxZoomLevel: 14
            }
        );             
        this.vecLayer = new OpenLayers.Layer.Vector('mlpaFeatures',{
            styleMap: styleMap
        });              
        
        this.vecLayer.events.on({
            "sketchstarted": this.resShapeStarted,
            "sketchcomplete": this.resShapeComplete,
            scope: this
        });        

		//Required: Create div element for OL map before constructing it.  OL really wants you to tell
        //it what it's div is in the constructor.  If you let Ext create it's own div element at render time
        //OL won't know where it is.  This is fine usually except the Google base map doesn't work properly in
        //Safari in this case, it won't let you draw vectors.
		Ext.DomHelper.append(document.body, [{
			id: 'ol-map',
		}]);        
        
        //Create the map and dump everything in
	    map = new OpenLayers.Map('ol-map', map_options);
		map.addControl(new OpenLayers.Control.Navigation());		
		map.addControl(new gwst.controls.gwstPanZoom());
		map.addControl(new OpenLayers.Control.MousePosition());
        
		this.drawResControl = new OpenLayers.Control.DrawFeature(
            this.vecLayer, 
            OpenLayers.Handler.Polygon
        );
       	map.addControl(this.drawResControl);
        this.selectControl = new OpenLayers.Control.SelectFeature(this.vecLayer);        
        map.addControl(this.selectControl);
        this.selectControl.activate();
        
		Ext.apply(this, {
		    map: map,
		    layers: [baseLayer, this.vecLayer],
		    extent: map_extent
		});    		
		
        // Call parent (required)
		gwst.widgets.ResDrawMapPanel.superclass.initComponent.call(this);
    },

    zoomToMapRegion: function(region) {
    	this.mapRegion = region;
    	this.mapRegion.bounds = new OpenLayers.Bounds(region.w_bound,region.s_bound,region.e_bound,region.n_bound);
    	this.map.zoomToExtent(this.mapRegion.bounds);
    },
    
    getShapeLayer: function() {
    	return this.vecLayer;
    },
    
    enableResDraw: function() {
    	this.drawResControl.activate();
    },
    
    disableResDraw: function() {
        this.drawResControl.deactivate();
    },
    
    resShapeStarted: function(evt) {
    	this.fireEvent('res-shape-started');
    },
    
    resShapeComplete: function(evt) {
    	this.fireEvent('res-shape-complete', evt.feature);
    	return false;
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