Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResDrawMapPanel = Ext.extend(GeoExt.MapPanel, {
    
	mapRegion: null,	//Current region map is focused on
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
    	// Constructor, config object already applied to 'this' so properties can 
		// be created and added/overridden here: Ext.apply(this, {});
		
	    var extent = new OpenLayers.Bounds(-5, 35, 15, 55);
	
        var options = {
			controls: [],
            projection: new OpenLayers.Projection("EPSG:900913"),
            units: "m",
            numZoomLevels: 18,
            maxResolution: 156543.0339,
            maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
                                             20037508, 20037508.34)
        };

        var baseLayer = new OpenLayers.Layer.Google(
            "Google Satellite",
            {type: G_SATELLITE_MAP, sphericalMercator: true}
        );

        extent.transform(
            new OpenLayers.Projection("EPSG:4326"), options.projection
        );	

        var styleMap = new OpenLayers.StyleMap({
            'default': new OpenLayers.Style({
                fillColor: 'orange',
                fillOpacity: 0.4,
                strokeColor: 'orange',
                strokeOpacity: 1,
                strokeWidth: 1,
                cursor: 'pointer',
                pointerEvents: "visiblePainted",
                label : "${shape_label}",
                fontColor: "black",
                fontSize: "12px",
                //fontFamily: "Courier New, monospace",
                //fontWeight: "bold",
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
                label : "${shape_label}",
                fontColor: "black",
                fontSize: "12px",
                //fontFamily: "Courier New, monospace",
                //fontWeight: "bold",
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
        
        this.vectorLayer = new OpenLayers.Layer.Vector('mlpaFeatures',{
            styleMap: styleMap
        });                
        
	    map = new OpenLayers.Map(options);
		map.addControl(new OpenLayers.Control.Navigation());		
		map.addControl(new gwst.controls.gwstPanZoom());
		map.addControl(new OpenLayers.Control.MousePosition());
        this.drawResControl = new OpenLayers.Control.DrawFeature(
            this.vectorLayer, 
            OpenLayers.Handler.Polygon, {
                featureAdded: this.resDrawn.createDelegate(this)
            }
        );
       	map.addControl(this.drawResControl);		
				
		Ext.apply(this, {
		    map: map,
		    layers: [baseLayer, this.vectorLayer],
		    extent: extent
		});    
    
        // Call parent (required)
		gwst.widgets.ResDrawMapPanel.superclass.initComponent.call(this);
    },

    zoomToMapRegion: function(region) {
    	this.mapRegion = region;
    	this.mapRegion.bounds = new OpenLayers.Bounds(region.w_bound,region.s_bound,region.e_bound,region.n_bound);
    	this.map.zoomToExtent(this.mapRegion.bounds);
    },
    
    enableResDraw: function() {
    	this.drawResControl.activate();
    	//Show cancel/redo toolbar
    },
    
    disableResDraw: function() {
        this.drawResControl.deactivate();
    },
    
    resDrawn: function(feature, opts) {
    	this.fireEvent('res-shape-drawn', feature.geometry);
    },
    
    onRender: function(){
        // Call parent (required)
        gwst.widgets.ResDrawMapPanel.superclass.onRender.apply(this, arguments);        
    },
    
    cancelResShape: function() {
    	
    },
    
    redoResShape: function() {
    	
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-res-draw-map-panel', gwst.widgets.ResDrawMapPanel);