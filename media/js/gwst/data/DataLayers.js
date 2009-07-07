Ext.namespace('gwst', 'gwst.data');

/*
 * Unique layer_id's are assigned to each OL layer object so they can be tracked throughout gwst 
 */

//Layer index constants
var NAME = 0;
var GROUP = 1;
var LAYER = 2;
var LEGEND = 3;
var DESC = 4;
var META = 5;
var DEFAULT_ON = 6;

/*Constraining the zoom levels on a google layer affects the zoom indexes.  
 * if google min zoom level is 7 then google zoom level 7 will now be 
 * referenced in OL at zoom index 0. The problem is the TMS tilecaches are 
 * setup to expect 0-18 so they're URL's need to be offset using MIN_ZOOM_LEVEL
 * in their getURL functions.
*/ 
gwst.data.MIN_ZOOM_LEVEL = 7;
gwst.data.MAX_ZOOM_LEVEL = 18;
gwst.data.TERRAIN_MAX_ZOOM_LEVEL = 15;

var getLegendParams = {
    service: "WMS",
    version: "1.1.1",
    request: "GetLegendGraphic",
    exceptions: "application/vnd.ogc.se_inimage",
    format: "image/png"
};

gwst.data.GoogleTerrain = new OpenLayers.Layer.Google(
    "Google Terrain" , 
    {
        type: G_PHYSICAL_MAP,
        'sphericalMercator': true,
        MIN_ZOOM_LEVEL: gwst.data.MIN_ZOOM_LEVEL,
        MAX_ZOOM_LEVEL: gwst.data.MAX_ZOOM_LEVEL,
        projection: new OpenLayers.Projection("EPSG:900913") 
    }
);

gwst.data.GoogleSat = new OpenLayers.Layer.Google(
    "Satellite Imagery" , 
    {
        type: G_SATELLITE_MAP,
        'sphericalMercator': true,
        MIN_ZOOM_LEVEL: gwst.data.MIN_ZOOM_LEVEL,
        MAX_ZOOM_LEVEL: gwst.data.MAX_ZOOM_LEVEL,
        projection: new OpenLayers.Projection("EPSG:900913")
    }
);

gwst.data.DataLayers = [
    [
        'Satellite Imagery',
        'Base',
         gwst.data.GoogleSat,
        '/site-media/js/openlayers/img/blank.gif',
        'Google satellite/aerial imagery',
        'Insert link here'        
    ],[
        'Nautical Charts',
        'Base',
        new OpenLayers.Layer.TMS( 
            "Nautical Charts", 
            ["http://marinemap.org/tiles/Charts/"], 
            {
                layer_id: 2,
                layername: 'Charts', 
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
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
        ),
        'http://marinemap.org/tiles/Charts/Legend.png',        
        'NOAA Nautical Charts',
        'Scanned and georeferenced NOAA nautical charts at varying resolutions.'
  ],[
        'Lat/Long Lines',
        'Base',
        new OpenLayers.Layer.TMS(
            "Lat/Long Lines",
            ["http://marinemap.org/tiles/Graticules/"],
            {
                layer_id: 4,
                layername: 'Graticules',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 7 ) {
                        var res = this.map.getResolution();
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
        ),
        'http://marinemap.org/tiles/Graticules/Legend.png',
        'Graticules at 10, 5 and 1 minute',
        'No Metadata'
    ],[
        'Depth Contours',
        'Base',
        new OpenLayers.Layer.TMS(
            "Depth Contours",
            ["http://marinemap.org/tiles/Isobaths/"],
            {
                layer_id: 25,
                layername: 'Isobaths',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
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
        ),
        'http://marinemap.org/tiles/Isobaths/Legend.png',
        'Isobaths (contours)',
        'No Metadata'
    ]
];

for (var i=0; i<gwst.data.DataLayers.length; i++) {
    var l = gwst.data.DataLayers[i];
    if (l[LAYER] instanceof OpenLayers.Layer.WMS) {
        var params = OpenLayers.Util.extend({LAYER: l[LAYER].params.LAYERS}, getLegendParams);
        var paramsString = OpenLayers.Util.getParameterString(params);
        l[LEGEND] = l[LAYER].url + '?' + paramsString;
    }
}

