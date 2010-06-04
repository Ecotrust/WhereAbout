Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResDrawMapPanel = Ext.extend(GeoExt.MapPanel, {
    //Default properties can defined here and overriden by config object passed to contructor
	
    maxZoom: 8,     //Set the highest zoom that any automatic zooming will take you to.
    
    initComponent: function(){		
		//Map region
		var region = {
            e_bound: -13500000,
            n_bound: 5850000,
            s_bound: 5170000,
            w_bound: -14500000,
            name: 'Oregon Coast'
        };
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
            maxExtent: map_extent
        };        

        var styleMap = new OpenLayers.StyleMap({
            'default': new OpenLayers.Style({
                fillColor: '#ff8c00',
                fillOpacity: 0.4,
                strokeColor: '#ff8c00',
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
            }),
            'temporary': new OpenLayers.Style({
                fillColor: '#ff8c00',
                fillOpacity: 0.4,
                strokeWidth: 2,
                strokeColor: '#ff8c00',
                strokeOpacity: 1
            })
        });
        
        var pointStyleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
		externalGraphic: '${icon}',
                graphicOpacity: 1,
                graphicHeight: 25,
                graphicWidth: 15,
                graphicYOffset: -27,
                label : "${pennies}",
                fontColor: "black",
                fontSize: "12px",
                fontWeight: "bold",                
                labelAlign: "cm"                
            }, OpenLayers.Feature.Vector.style["default"]))
        });
	    
	    //Map base layers
        var baseLayer = new OpenLayers.Layer.Google(
            "Satellite Imagery",
            {
            	type: G_HYBRID_MAP, 
            	sphericalMercator: true,
            	minZoomLevel: 6, 
            	maxZoomLevel: 17
            }
        );             

        this.vectorLayer = new OpenLayers.Layer.Vector(
    		"Point Activities",
    		{styleMap: pointStyleMap}
        );        
        this.vectorLayer.events.on({
            "sketchstarted": this.vecStarted,
            "skethmodified": this.vecModified,
            "sketchcomplete": this.vecComplete,
            scope: this
        });        
        
		//Required: Create div element for OL map before constructing it.  OL really wants you to tell
        //it what it's div is in the constructor.  If you let Ext create it's own div element at render time
        //OL won't know where it is.  This is fine usually except the Google base map doesn't work properly in
        //Safari in this case, it won't let you draw vectors.
		Ext.DomHelper.append(document.body, [{
			id: 'the-map',
			tag: 'div'
		}]);        
        
        //Create the map and dump everything in
	    map = new OpenLayers.Map('the-map', map_options);
		map.addControl(new OpenLayers.Control.Navigation());		
		map.addControl(new OpenLayers.Control.PanZoomBar());
		map.addControl(new OpenLayers.Control.MousePosition());
        map.addControl(new OpenLayers.Control.ScaleLine());

		//Point control
        this.drawPointControl = new OpenLayers.Control.DrawFeature(
        	this.vectorLayer,
            OpenLayers.Handler.Point
        );        		
		map.addControl(this.drawPointControl);		
        
        //Polygon 
        this.drawPolyControl = new OpenLayers.Control.DrawFeature(
            	this.vectorLayer,
                OpenLayers.Handler.Polygon
        );        		
		map.addControl(this.drawPolyControl);                

		//Select control
       this.selectControl = new OpenLayers.Control.SelectFeature(
       		this.vectorLayer,{
       			onSelect: this.onFeatureSelect, 
       			onUnselect: this.onFeatureUnselect
       		}
       );		
       map.addControl(this.selectControl);
       this.selectControl.activate();		
		
        //Update internal MapPanel properties
		Ext.apply(this, {
		    map: map,
		    layers: [baseLayer, this.vectorLayer],
		    extent: map_extent,
	        center: region_extent.getCenterLonLat(),
	        zoom: 1,
	        cls: 'tip-target'
		});    		
		
        // Call parent (required)
		gwst.widgets.ResDrawMapPanel.superclass.initComponent.call(this);
    },

    getSelectControl: function() {
	return this.selectControl;
    },

    getFeatureLayer: function() {
    	return this.vectorLayer;
    },

    vecStarted: function(evt) {
    	this.fireEvent('vector-started', evt);
    },
    
    vecModified: function(evt) {
        this.fireEvent('vector-modified', evt);
    },
    
    vecComplete: function(evt) {
        if (this.map.getZoom() >= gwst.settings.minimum_draw_zoom) {
            this.fireEvent('vector-completed', evt.feature);
            Ext.apply(evt.feature.attributes,{'pennies':0,'icon':'/site-media/images/small_red_marker.png'});
            this.curFeature = evt.feature;
            this.disablePointDraw();
            this.disablePolyDraw();
        } else {
            alert("Please zoom in more before marking on the map.");
            this.fireEvent('invalid-vector', evt.feature);
            return false;
        }
    },
    
    removeLastFeature: function() {
    	this.vectorLayer.removeFeatures([this.curFeature]);
    },    
    
//    onPopupClose: function(evt) {
//        selectControl.unselect(selectedFeature);
//    },

    onFeatureSelect: function(feature) {
	    feature.attributes.icon = "/site-media/images/small_red_marker_highlight.png";
	    feature.layer.drawFeature(feature);
    },

    onFeatureUnselect: function(feature) {
	    feature.attributes.icon = "/site-media/images/small_red_marker.png";
	    feature.layer.drawFeature(feature);
    },

//    onFeatureSelect: function(feature) {
//        selectedFeature = feature;
//        popup = new OpenLayers.Popup.FramedCloud("chicken", 
//                                 feature.geometry.getBounds().getCenterLonLat(),
//                                 null,
//                                 "<div style='font-size:.8em'><a href='#'>Delete</a></div>",
//                                 null, true, this.onPopupClose);
//        feature.popup = popup;
//        map.addPopup(popup);
//    },
    
//    onFeatureUnselect: function(feature) {
//        map.removePopup(feature.popup);
//        feature.popup.destroy();
//        feature.popup = null;
//    },
    
    enablePointDraw: function() {
//    	this.selectControl.unselectAll();
        this.drawPointControl.activate();        
    },
    
    disablePointDraw: function() {
    	this.drawPointControl.deactivate();
    },
    
    enablePolyDraw: function() {
//    	this.selectControl.unselectAll();
        this.drawPolyControl.activate();        
    },
    
    disablePolyDraw: function() {
    	this.drawPolyControl.deactivate();
    },    
    
    zoomToPoint: function(pnt) {
    	var lonlat = new OpenLayers.LonLat(pnt.geometry.x, pnt.geometry.y);
    	this.map.setCenter(lonlat, this.maxZoom);
    },
    
    zoomToResShape: function(feature) {
        this.map.zoomToExtent(feature.geometry.bounds);
        this.selectControl.unselectAll();
    	this.selectControl.select(feature);
        var zoomLvl = this.map.getZoom();
        if (zoomLvl > this.maxZoom){
            this.map.zoomTo(this.maxZoom);
        }
    },
    
    zoomToAllShapes: function() {
    	this.map.zoomToExtent(this.vectorLayer.getDataExtent());    
        var zoomLvl = this.map.getZoom();
        if (zoomLvl > this.maxZoom){
            this.map.zoomTo(this.maxZoom);
        }
    },
    
    cancelPoly: function() {
    	this.disablePolyDraw();        
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-res-draw-map-panel', gwst.widgets.ResDrawMapPanel);