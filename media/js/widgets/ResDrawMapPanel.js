Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResDrawMapPanel = Ext.extend(GeoExt.MapPanel, {
    //Default properties can defined here and overriden by config object passed to contructor
	
    defaultZoom: 1,
    maxZoom: 6,
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

        //Map vector style
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
	    
	    //Map base layers
        var baseLayer = new OpenLayers.Layer.Google(
            "Satellite Imagery",
            {
            	type: G_HYBRID_MAP, 
            	sphericalMercator: true,
            	minZoomLevel: 6, 
            	maxZoomLevel: 14
            }
        );             

		if ( gwst.settings.desktop_build )
		{
			var nautLayer = new OpenLayers.Layer.TMS(
				"Oregon Nautical Charts", 
				["/tiles/OregonCharts/"], 
				{               
					buffer: 1,
                    'isBaseLayer': false,
                    visibility: false,
                    'opacity': 1.0,
                    'sphericalMercator': true,
					getURL: function (bounds) {
						var layerExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
                        var z = map.getZoom()+6;
						var url = this.url;
						var path = 'blank.png' ;
						if ( z <= 12 && z >= 6 ) {
							var res = map.getResolution();
							var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
							var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
							var limit = Math.pow(2, z);
							var path = z + "/" + x + "/" + y + ".png";
						}
						if (url instanceof Array) {
							url = this.selectUrl(path, url);
						}
						tilepath = url + path;
						return url + path;
					}
				}
            );
		}	
		else
		{
			var nautLayer = new OpenLayers.Layer.TMS( 
				"Nautical Charts", 
				["http://d34dcc2grel7cy.cloudfront.net/OregonCharts/"], 
				{ 
					buffer: 1,
					'isBaseLayer': false,
					visibility: false,
					'opacity': 1.0,
					'sphericalMercator': true,
					getURL: function (bounds) {
						//Default global google extent
						var layerExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
						var z = this.map.getZoom()+6;	//Amount to add should match the minZoomLevel setting on the google layer
						var url = this.url;
						var path = 'blank.png' ;

							var res = this.map.getResolution();
							var x = Math.round((bounds.left - layerExtent.left) / (res * this.tileSize.w));
							var y = Math.round((layerExtent.top - bounds.top) / (res * this.tileSize.h));
							var limit = Math.pow(2, z);
							var path = z + "/" + x + "/" + y + ".png";

						if (url instanceof Array) {
							url = this.selectUrl(path, url);
						}
						tilepath = url + path;
						return url + path;
					}
				}
			);
		}
        
        this.vecLayer = new OpenLayers.Layer.Vector('Fishing Grounds',{
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
			id: 'ol-map'
		}]);        
        
        //Create the map and dump everything in
	    map = new OpenLayers.Map('ol-map', map_options);
		map.addControl(new OpenLayers.Control.Navigation());		
        map.addControl(new OpenLayers.Control.PanZoomBar());
		map.addControl(new OpenLayers.Control.MousePosition());
        
		this.drawResControl = new OpenLayers.Control.DrawFeature(
            this.vecLayer, 
            OpenLayers.Handler.Polygon
        );
       	map.addControl(this.drawResControl);
        this.selectControl = new OpenLayers.Control.SelectFeature(this.vecLayer);        
        map.addControl(this.selectControl);
        this.selectControl.activate();

        map.addLayers([baseLayer, nautLayer, this.vecLayer]);
        
        var layerStore = new GeoExt.data.LayerStore({
            layers: [nautLayer],
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
    
    zoomToAllShapes: function() {
        this.autoZoom = true
    	this.map.zoomToExtent(this.vecLayer.getDataExtent());    	
    },
    
    getShapeLayer: function() {
    	return this.vecLayer;
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