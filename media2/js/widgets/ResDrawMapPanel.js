Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResDrawMapPanel = Ext.extend(GeoExt.MapPanel, {
    
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

        var layer = new OpenLayers.Layer.Google(
            "Google Satellite",
            {type: G_SATELLITE_MAP, sphericalMercator: true}
        );

        extent.transform(
            new OpenLayers.Projection("EPSG:4326"), options.projection
        );	
	
	    var map = new OpenLayers.Map(options);
		var nav = new OpenLayers.Control.Navigation();		
		map.addControl(new gwst.controls.gwstPanZoom());
		map.addControl(nav);
				
		Ext.apply(this, {
		    map: map,
		    layers: [layer],
		    extent: extent
		});    
    
        // Call parent (required)
		gwst.widgets.ResDrawMapPanel.superclass.initComponent.call(this);
    },
    
    onRender: function(){
        // Call parent (required)
        gwst.widgets.ResDrawMapPanel.superclass.onRender.apply(this, arguments);        
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-res-draw-map-panel', gwst.widgets.ResDrawMapPanel);