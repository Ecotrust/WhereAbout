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
    "Satellite/Aerial Imagery" , 
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
        'Satellite/Aerial Imagery',
        'Base',
         gwst.data.GoogleSat,
        '/site-media/js/openlayers/img/blank.gif',
        'Google satellite/aerial imagery',
        'Insert link here'        
    ],[
        'Bathymetry',
        'Base',
        new OpenLayers.Layer.TMS( 
            "Bathymetry", 
            ["http://marinemap.org/tiles/Bathymetry/"], 
            {
                layer_id: 1,
                layername: 'Bathymetry',                 
                buffer: 1,                
                'isBaseLayer': false,
                'opacity': 0.75,
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
        'http://marinemap.org/tiles/Bathymetry/Legend.png',
        'Bathymetric Shaded Relief',
        'Resolution is 200 meters. The original grid file was made from 75 original tiled DEMs that were mosaicked into one grid and resampled to 200 meters.  These mosaicked DEMs were produced by Teale Data Center from a contract with the Department of Fish and Game, funded by the Resources Agency.'        
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
        'Study Region',
        'Base',
        new OpenLayers.Layer.TMS(
            "Study Region",
            ["http://marinemap.org/tiles/StudyRegion/"],
            {
                layer_id: 3,
                layername: 'StudyRegion',
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
        'http://marinemap.org/tiles/StudyRegion/Legend.png',
        'MLPA Initiative South Coast Study Region',
        'Study region boundary for the Marine Life Protection Act (MLPA) South Coast Study Region. The South Coast Study Region is broken into 7 subregions which are intended to represent logical biogeographic subunits.',
        true
    ],[
        'Graticules',
        'Base',
        new OpenLayers.Layer.TMS(
            "Graticules",
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
        'Coastal Energy',
        'Management',
        new OpenLayers.Layer.TMS(
            "Coastal Energy",
            ["http://marinemap.org/tiles/CoastalEnergy/"],
            {
                layer_id: 5,
                layername: 'CoastalEnergy',
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
        'http://marinemap.org/tiles/CoastalEnergy/Legend.png',
        'Coastal Energy',
        'Active desalination facilities on the California coast as of 2008. Locations were provided by  California Department of Fish and Game.The power plant data layer for the power plants located in the south coast study region. The information provided by the California Energy Commission under strict usage guidelines. For cartographic display only. The oil platforms data layer represents locations of oil platforms offshore of California. Developed for Department of Fish and Game, Office of Spill Prevention and Response. November 20, 2002.'
    ],[
        'Recreational Fishing',
        'Consumptive',
        new OpenLayers.Layer.TMS(
            "Recreational Fishing",
            ["http://marinemap.org/tiles/RecreationalFishing/"],
            {   
                layer_id: 6,
                layername: 'RecreationalFishing',
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
        'http://marinemap.org/tiles/RecreationalFishing/Legend.png',
        'Recreational Fishing',
        'The kayak launch sites data layer depicts point locations as identified by Kayak Fishing Association of California based on survey results.  The information was collected in 2008. The spearfishing competition sites data layer depicts specific dive sites along the California coast as used by the Central California Diving Council (CenCal) for freedive spearfishing competitions. These data are a subset of fishing locations compiled by David VenTresca, California Department of Fish and Game.The fishing piers and jetties data layer is all public piers and jetties used by California Recreational Fisheries Survey (CRFS), as identified by Pacific States Marine Fisheries Commission between 2007 to 2008. The kayak fishing areas data layer demarcates areas identified by Kayak Fishing Association of California based on survey results.  The information was collected in 2008.'
    ],[
        'Coastal Access and Recreation',
        'Non-Consumptive Use',
        new OpenLayers.Layer.TMS(
            "Coastal Access and Recreation",
            ["http://marinemap.org/tiles/CoastalAccessRecreation/"],
            {
                layer_id: 7,
                layername: 'CoastalAccessRecreation',
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
        'http://marinemap.org/tiles/CoastalAccessRecreation/Legend.png',
        'Coastal Access and Recreation',
        'The boat launch sites dataset represents Table 5.9-9 in the MLPA South Coast Study Region Regional Profile.  Locations were researched on the Internet and placed accordingly by DFGs Marine Region GIS Lab.  The shore dive sites data layer depicts shore diving locations for Southern California from <a href="http://www.shorediving.com/Earth/USA_West/CalS/index.htm" target="_blank">here</a>. The kayak launch sites data layer depicts point locations as identified by Kayak Fishing Association of California based on survey results.  The information was collected in 2008.  The coastal access points data layer shows the locations and facilities of the beach access points and coastal features of interest documented by the California Coastal Access Guide, which was published in 2002. The harbors data layer  is a subset of place names from a California statewide extract features from the USGS Geographic Names Information System (GNIS), provided by USGS GNIS staff, dated January 2006 The ports data layer identifies 194 marine and inland port locations used by marine fisheries for the landing and sale of fish and invertebrates. The data layer was created by the California Department of Fish and Game in 2001.'
    ],[
        'Research and Monitoring',
        'Management',
        new OpenLayers.Layer.TMS(
            "Coastal Access and Recreation",
            ["http://marinemap.org/tiles/ResearchMonitoring/"],
            {
                layer_id: 8,
                layername: 'ResearchMonitoring',
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
        'http://marinemap.org/tiles/ResearchMonitoring/Legend.png',
        'Research Institutions and Monitoring Locations',
        'The research institutions data layer provides location information (address and lat/long) for the marine research and education institutions in and around the MLPA study region from Point Conception to Pigeon Point. The data was developed by the University of California Santa Barbara in 2006. The marine monitoring sites data layer provides location information for marine monitoring sites in and around the MLPA study region. The data was developed by the University of California Santa Barbara in 2006.Monitoring sites for the Cooperative Research and Assessment of Nearshore Ecosystems (CRANE) survey.  Diver surveys are conducted using PISCO protocols to characterize fish, invertebrate and macroalgal assemblages.'
    ],[
        'Estuaries',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Estuaries",
            ["http://marinemap.org/tiles/Estuaries/"],
            {
                layer_id: 9,
                layername: 'Estuaries',
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
        'http://marinemap.org/tiles/Estuaries/Legend.png',
        'Estuaries',
        'The estuaries data layer is from the U.S. Fish and Wildlife Service, National Wetlands Survey, NOAA ESI (2004).'
    ],[
        'Agricultural Impacts to Watersheds',
        'Physical',
        new OpenLayers.Layer.TMS(
            "Agricultural Impacts to Watersheds",
            ["http://marinemap.org/tiles/CoastalWatershedsImpactAgriculture/"],
            {
                layer_id: 10,
                layername: 'CoastalWatershedsImpactAgriculture',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.9,
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
        'http://marinemap.org/tiles/CoastalWatershedsImpactAgriculture/Legend.png',
        'Agricultural Impacts to Coastal Watersheds',
        'Shows the presence of Agricultural Areas provided by National Oceanic and Atmospheric Administration (NOAA). The Agricultural Impact on Coastal Watersheds layer shows the percentage of urban areas within major watersheds. It has been created by performing a spatial intersection between major watershed (Watershed Map of 1999, Calwater 2.2.1)  and agricultural areas provided by NOAA.'
    ],[
/*        'Substrate Proxy (0-30m)',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Substrate Proxy (0-30m)",
            ["http://marinemap.org/tiles/LinearSubstrate/"],
            {
                layer_id: 11,
                layername: 'LinearSubstrate',
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
        'http://marinemap.org/tiles/LinearSubstrate/Legend.png',
        'Substrate Proxy (0-30m)',
        'The Substrate Proxy (0-30m) data layer was developed by PISCO to conduct an initial evaluation of MPAs in the south coast study region of the MLPA process. This line was developed using course scale area substrate data and will be replaced by a line developed from higher resolution data as soon as it becomes available. These data should be replaced by approximately November 2008.'
    ],[
*/        'Urban Impacts to Watersheds',
        'Physical',
        new OpenLayers.Layer.TMS(
            "Urban Impacts to Watersheds",
            ["http://marinemap.org/tiles/CoastalWatershedsImpactUrban/"],
            {
                layer_id: 12,
                layername: 'CoastalWatershedsImpactUrban',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.9,
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
        'http://marinemap.org/tiles/CoastalWatershedsImpactUrban/Legend.png',
        'Urban Impacts to Coastal Watersheds',
        'The Urban Impact on Coastal Watersheds layer shows the percentage of urban areas within major watersheds. It has been created by performing a spatial intersection between major watershed (Watershed Map of 1999, Calwater 2.2.1) and urban areas provided by National Oceanic and Atmospheric Administration (NOAA). Shows the presence of Urban Areas provided by NOAA.'
    ],[
        'Cowcod Conservation Area',
        'Management',
        new OpenLayers.Layer.TMS(
            "Cowcod Conservation Area",
            ["http://marinemap.org/tiles/CowcodConservationArea/"],
            {    
                layer_id: 13,
                layername: 'CowcodConservationArea',
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
        'http://marinemap.org/tiles/CowcodConservationArea/Legend.png',
        'Cowcod Conservation Area',
        'The cowcod conservation area data layer depicts the Cowcod management boundaries based on California Code Title 14, section 150.06.  California Department of Fish and Game, Marine Region January 2003.'
    ],[
        'Managed Areas',
        'Management',
        new OpenLayers.Layer.TMS(
            "Managed Areas",
            ["http://marinemap.org/tiles/ExistingMarineandCoastalManagedAreas/"],
            {    
                layer_id: 14,
                layername: 'ExistingMarineandCoastalManagedAreas',
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
        'http://marinemap.org/tiles/ExistingMarineandCoastalManagedAreas/Legend.png',
        'Existing Marine and Coastal Managed Areas',
        'The aquaculture layer outlines aquaculture seabed lease locations in California.  The layer does not include any aquaculture activities that take place on land.   Data provided by Tom Moore, California Department of Fish and Game. The kelp bed leases data layer identifies areas of kelp management in the south coast study region. Digitized from existing kelp maps, these maps were produced by the California Department of Fish and Game in 1989. The terrestrial managed areas data layer was developed by the California Resources Agency Legacy Project in 2004 and updated by the Nature Conservancy in March 2005. The Channel Islands National Marine Sanctuary  layer shows the legal boundaries of  this National Marine Sanctuary as defined within the Code of Federal Regulations, at 15 C.F.R. Part 922 and the subparts for each national marine sanctuary.  This data was provided by NOAA / National Marine Sanctuaries Program and published in 2004. These data include all of Californias marine protected areas that do not have associated Department of Fish and Game fishing regulations of 2004. Data was provided b California Department of Fish and Game, Marine Region GIS Lab. Published in 2004.'
    ],[
        'MPAs: Existing State',
        'Management',
        new OpenLayers.Layer.TMS(
            "MPAs: Existing State",
            ["http://marinemap.org/tiles/ExistingStateMarineProtectedAreas/"],
            {    
                layer_id: 15,
                layername: 'ExistingStateMarineProtectedAreas',
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
        'http://marinemap.org/tiles/ExistingStateMarineProtectedAreas/Legend.png',
        'Existing State Marine Protected Areas',
        'Marine Protected Areas in California as of October 31, 2008. Data provided by the California Department of Fish and Game'
    ],[
        'Marine Mammals',
        'Biological',
        new OpenLayers.Layer.TMS(
            "Marine Mammals",
            ["http://marinemap.org/tiles/MarineMammalHauloutsandRookeries/"],
            {
                layer_id: 16,
                layername: 'MarineMammalHauloutsandRookeries',
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
        'http://marinemap.org/tiles/MarineMammalHauloutsandRookeries/Legend.png',
        'Marine Mammal Haulouts and Rookeries',
        'The Pinniped Rookeries layer  describes the location of rookeries (areas in which the pinnipeds repeatedly haul out and breed), the species found there and the months that species breeds at that rookery. Data is provided by U.S. Department of Commerce NOAA/National Marine Fisheries Service - Southwest Region and published on March 30, 2007.The Pinniped Haulouts layer shows Seal and sea lion haul-out sites in California, including the offshore islands. Data is provided by U.S. Department of Commerce NOAA/National Marine Fisheries Service - Southwest Region and published on March 30, 2007.'
    ],[
        'RCA: Commercial, Non-Trawl',
        'Management',
        new OpenLayers.Layer.TMS(
            "RCA: Commercial, Non-Trawl",
            ["http://marinemap.org/tiles/RCACommercialNonTrawl/"],
            {
                layer_id: 17,
                layername: 'RCACommercialNonTrawl',
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
        'http://marinemap.org/tiles/RCACommercialNonTrawl/Legend.png',
        'Rockfish Conservation Area: Commercial, Non-Trawl',
        'This layer depicts the non-trawl fishing closures off the California coast as described <a href="http://www.nwr.noaa.gov/Groundfish-Halibut/Groundfish-Fishery-Management/Groundfish-Closed-Areas/Index.cfm" target="_blank">here</a> '
    ],[
        'RCA: Commercial, Trawl',
        'Management',
        new OpenLayers.Layer.TMS(
            "RCA: Commercial, Trawl",
            ["http://marinemap.org/tiles/RCACommercialTrawl/"],
            {
                layer_id: 18,
                layername: 'RCACommercialTrawl',
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
        'http://marinemap.org/tiles/RCACommercialTrawl/Legend.png',
        'Rockfish Conservation Area: Commercial, Trawl',
        'This layer dipicts year round trawl fishing closures off the California coast as described <a href="http://www.nwr.noaa.gov/Groundfish-Halibut/Groundfish-Fishery-Management/Groundfish-Closed-Areas/Index.cfm" target="_blank">here</a>'
    ],[
        'RCA: Recreational',
        'Management',
        new OpenLayers.Layer.TMS(
            "RCA: Recreational",
            ["http://marinemap.org/tiles/RCARecreational/"],
            {
                layer_id: 19,
                layername: 'RCARecreational',
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
        'http://marinemap.org/tiles/RCARecreational/Legend.png',
        'Rockfish Conservation Area: Recreational',
        'This layer dipicts the year round recreational fishing closures off the California coast as described <a href="http://www.nwr.noaa.gov/Groundfish-Halibut/Groundfish-Fishery-Management/Groundfish-Closed-Areas/Index.cfm" target="_blank">here</a>'
    ],[
        'Nearshore Habitats',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Recreational Fishing",
            ["http://marinemap.org/tiles/Nearshorehabitats/"],
            {
                layer_id: 20,   
                layername: 'Nearshorehabitats',
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
        'http://marinemap.org/tiles/Nearshorehabitats/Legend.png',
        'Nearshore Habitats',
        'The surfgrass data layer shows the distribution of surfgrass along the California coast.  It was derived from aerial surveys that were done by the Mineral Management Service during years 1980 to 1982. The eelgrass data layer shows the eelgrass distribution for the California coast and the data is provided by the Nature Conservancy, Humboldt Atlas, California Department of Fish and Game, and NOAA (2004).'
    ],[
        'Hard and Soft Substrata',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Hard and Soft Substrata",
            ["http://marinemap.org/tiles/HardSoftSubstrata/"],
            {
                layer_id: 21,
                layername: 'HardSoftSubstrata',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.8,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png';
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
        'http://marinemap.org/tiles/HardSoftSubstrata/Legend.png',
        'Hard and Soft Substrata',
        'The shipwrecks layer shows the locations of shipwrecks along the coast of California, including offshore islands.  The data are provided by National Oceanic and Atmospheric Administration (NOAA) as Electronic Navigational Chart (ENC) data.  <a href="http://www.nauticalcharts.noaa.gov/csdl/encdirect_met.html" target="_blank">The full metadata can be downloaded here</a>. The artificial reefs layer shows the locations of artificial reefs along the California coast.  The data were provided by the California Department of Fish and Game. The seafloor substrate data layer depicts benthic substrate types in the form of either hard or soft substrate. These data were developed in 2006 by the Moss Landing Marine Laboratory, but have been revised to include additional areas of hard bottom added by researchers at the University of California-Santa Barbara. The submarine canyon data layer delineates geological seafloor characteristics of the contenental margin of the Unites States West Coast. It is a synthesis of various data sources including side-scan sonar, bottom samples, seismic data, and multibeam bathymetry.  The data was created in 2004 by TerraLogic GIS, Inc., Active Tectonics and Seafloor Mapping Lab, College of Oceanic and Atmospheric Sciences (Oregon State University), Center for Habitat Studies, Moss Landing Marine Laboratories.'
    ],[
        'Predicted Substrate',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Predicted Substrate",
            ["http://marinemap.org/tiles/PredictedSubstrate/"],
            {
                layer_id: 21,
                layername: 'Predicted Substrate',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.8,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png';
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
        'http://marinemap.org/tiles/PredictedSubstrate/Legend.png',
        'Predicted Substrate',
        'Fine-scale substrate data displayed on this map represent a union of data collected by, Seafloor Mapping Lab at California State University Monterey Bay, United States Geological Survey (USGS), Ocean Imaging, and the San Diego Association of Governments (SANDAG). Most datasets included in the fine scale substrate layer are derived from multibeam sonar. Gaps in the fine-scale data exist in the vicinity of all islands as well as along the mainland nearshore area, shallower than approximately 20 meters. Where fine scale data were unavailable at San Nicolas Island, coarse scale data are displayed. Coarse-scale data tends to overestimate abundance of rocky substrate. Where nearshore fine-scale data were unavailable, a linear proxy was created by drawing a line roughly parallel to shore, through nearshore areas where fine-scale data exist. Sections of the line were divided into either "hard" or "soft" categories in each area, depending on the dominant habitat type in that portion of the coast between 0 and 30 meters depth. Additional datasets were referenced where possible, including areas of kelp growth, shoreline habitat types, and Bight 08 reef characterizations. '
    ],[
        'Military Areas',
        'Management',
        new OpenLayers.Layer.TMS(
            "Military Areas",
            ["http://marinemap.org/tiles/MilitaryAreas/"],
            {
                layer_id: 22,
                layername: 'Military Areas',
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
        'http://marinemap.org/tiles/MilitaryAreas/Legend.png',
        'Military Areas',
        'Data regarding military use areas displayed on this map have been developed in conjuction with representatives from the United States Department of Defense. This information is not comprehensive and does not include all activities occuring in the MLPA South Coast Study Region. This information represents current uses, which may change in the future. Pending military closures displayed on this map are under consideration by the MLPA Blue Ribbon Task Force. Additional information regarding military use areas and pending military closures at San Clemente Island and San Nicolas Island can be found <a href="http://www.dfg.ca.gov/mlpa/pdfs/agenda_040109c3.pdf" target="_blank">here</a>'
    ],[
        'Watersheds',
        'Physical',
        new OpenLayers.Layer.TMS(
            "Watersheds",
            ["http://marinemap.org/tiles/Watersheds/"],
            {
                layer_id: 23,
                layername: 'Watersheds',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.7,
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
        'http://marinemap.org/tiles/Watersheds/Legend.png',
        'Watersheds',
        'This hydrography layer shows flowing streams and rivers of California as assembled from data originally published by the U.S. Geological Survey (USGS) in Digital Line Graph (DLG-3) format.  These data were last updated in 1998. The major watersheds data layer depicts the major hydrologic units in the south coast study region.  The information comes from the Calwater data layer and may vary slightly from the major hydrologic units described in the Regional Water Quality Control Boards Basin Plans. Differences exist because the GIS data layer, in some places, used smaller units to provide more detail than the major hydrologic units. This data is an extract from the California Interagency Watershed Map of 1999 (Calwater 2.2.1) for more information visit <a href="http://gis.ca.gov/casil/gis.ca.gov/calwater" target="_blank">here</a>. The impaired rivers data layer depicts coastal rivers of water quality concern in the study region.  The information was developed in 2003 by the State Water Resources Control Board (SWRCB) and Regional Water Quality Control Boards (RWQCB). The impaired water bodies data layer depicts water bodies of water quality concern in coastal watersheds and nearshore areas in the study region.  The information was developed in 2003 by the State Water Resources Control Board (SWRCB) and Regional Water Quality Control Boards (RWQCB).'
    ],[
        'Sea Bird Diversity',
        'Biological',
        new OpenLayers.Layer.TMS(
            "Sea Bird Diversity",
            ["http://marinemap.org/tiles/AtSeaBirdDiversity/"],
            {
                layer_id: 24,
                layername: 'AtSeaBirdDiversity',
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
        'http://marinemap.org/tiles/AtSeaBirdDiversity/Legend.png',
        'Sea Bird Diversity',
        'This layer is derived from the NOAA/USF&WS seabird colony data base.  The layer shows  approximate location of seabird nesting colonies along the central and northern coast of California, including the SF Bay Area.  Original data is from Carter 1980 and Sowles 2000.  These data were then updated in 2004 with information mostly in Baja California from Wolfe SG 2002 using the same format.'
    ],[
        'Isobaths',
        'Base',
        new OpenLayers.Layer.TMS(
            "Isobaths",
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
    ],[
        'Shore Types',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Shore Types",
            ["http://marinemap.org/tiles/ShoreTypes/"],
            {
                layer_id: 26,
                layername: 'ShoreTypes',
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
        'http://marinemap.org/tiles/ShoreTypes/Legend.png',
        'Shore Types',
        'The Shore Types layer is comprised of  the Environmental Sensitivity Index (ESI) maps for the shoreline of northern California. ESI data characterize coastal environments and wildlife by their sensitivity to spilled oil. The ESI data were collected, mapped, and digitized to provide environmental data for oil spill planning and response. The Clean Water Act with amendments by the Oil Pollution Act of 1990 requires response plans for immediate and effective protection of sensitive resources. The data has been provided by the  National Oceanic and Atmospheric Administration (NOAA), National Ocean Service, Office of Response and Restoration (2004).'
    ],[
        'Water Quality',
        'Physical',
        new OpenLayers.Layer.TMS(
            "Water Quality",
            ["http://marinemap.org/tiles/WaterQuality/"],
            {
                layer_id: 27,
                layername: 'WaterQuality',
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
        'http://marinemap.org/tiles/WaterQuality/Legend.png',
        'Water Quality',
        "The power plant entrainment layer was developed by using entrainment estimates and intake volume estimates as outlined in the Clean Water Act Section 316 (b) reports. This area does not define a zone of impact, but rather provides a visual sense of the scale over which larval mortality due to entrainment may be of concern, and the relative sizes of this area due to different pumping rates for different plants. The stormwater data layer provides a rough scale of the possible extent of stormwater impact for each of these major stormwater sites. The estimates of the relative extent of possible toxic impacts are based on a Ballona Creek stormwater toxicity zone study. Developed by the California State Water Resources Control Board in 2004, the municipal wastewater and industrial discharge layer depicts the discharge sites into California’s near-coastal marine waters, but does not include discharges into enclosed bays and estuaries. The SAT determined that the Major dischargers should receive a 0.5 mile buffer zone to act as a typical or average extent of impacted area from the discharger’s effluent. The intermediate and minor dischargers do not have such a buffer and only represent the end point of that outfall. The outfall pipelines and diffusers layers were derived from a variety of sources including; Clean Water Act Section 316 (b) reports, monitoring reports from the sanitation districts, facility maps or construction plans from the sanitation districts, existing shapefiles from the Southern California Coastal Water Resources Project, and a few were created by using a best guess estimate by connecting the offshore outfall point to the land based facility. All offshore outfall points came from National Pollutant Discharge Elimination System permits via the California State Water Resources Control Board in 2004."
    ],[
        'Bioregions',
        'Base',
        new OpenLayers.Layer.TMS(
            "Bioregions",
            ["http://marinemap.org/tiles/Bioregions/"],
            {
                layer_id: 29,
                layername: 'Bioregions',
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
        'http://marinemap.org/tiles/Bioregions/Legend.png',
        'Bioregions',
        "Metadata: "
    ],[
        'Place Names',
        'Cultural',
        new OpenLayers.Layer.TMS(
            "Place Names",
            ["http://marinemap.org/tiles/Placenames/"],
            {
                layer_id: 30,
                layername: 'Placenames',
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
        'http://marinemap.org/tiles/Placenames/Legend.png',
        'Placenames',
        "Metadata: "
    ],[
        'Surfing Locations',
        'Cultural',
        new OpenLayers.Layer.TMS(
            "Surfing Locations",
            ["http://marinemap.org/tiles/SurfingLocations/"],
            {
                layer_id: 31,
                layername: 'Surfing Locations',
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
        'http://marinemap.org/tiles/SurfingLocations/Legend.png',
        'Surfing Locations',
        "Metadata: "
    ],[
        'Halibut Trawl Grounds',
        'Consumptive',
        new OpenLayers.Layer.TMS(
            "Halibut Trawl Grounds",
            ["http://marinemap.org/tiles/HalibutTrawlGrounds/"],
            {
                layer_id: 32,
                layername: 'Halibut Trawl Grounds',
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
        'http://marinemap.org/tiles/HalibutTrawlGrounds/Legend.png',
        'Halibut Trawl Grounds',
        "Metadata: "
    ],[
        'Kelp Persistence',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Kelp Persistence",
            ["http://marinemap.org/tiles/PersistentKelp/"],
            {
                layer_id: 33,
                layername: 'Kelp Persistence',
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
        'http://marinemap.org/tiles/PersistentKelp/Legend.png',
        'Kelp Persistence',
        "The linear kelp layer represents the alongshore length of sustainable kelp beds. CDFG aerial kelp surveys from the years 1989, 1999, and 2002 through 2006 were used to assess kelp persistence--areas with kelp present at least 3 out of the 7 survey years were considered sustainable. The alongshore length of these kelp beds is measured using a line drawn along the outside edge of the kelp bed and roughly parallel to shore."
    ],[
        'Grunion Spawning Locations',
        'Biological',
        new OpenLayers.Layer.TMS(
            "Grunion Spawning Locations",
            ["http://marinemap.org/tiles/GrunionSpawningLocations/"],
            {
                layer_id: 34,
                layername: 'Grunion Spawning Locations',
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
        'http://marinemap.org/tiles/GrunionSpawningLocations/Legend.png',
        'Grunion Spawning Locations',
        "Metadata:"
    ],[
        'Beach Nourishment',
        'Management',
        new OpenLayers.Layer.TMS(
            "Beach Nourishment",
            ["http://marinemap.org/tiles/BeachNourishment/"],
            {
                layer_id: 35,
                layername: 'Beach Nourhishment',
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
        'http://marinemap.org/tiles/BeachNourishment/Legend.png',
        'Beach Nourishment',
        "Metadata:"
    ],[
        'Substrate Proxy (0-30m)',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Substrate Proxy (0-30m)",
            ["http://marinemap.org/tiles/LinearSubstrate/"],
            {
                layer_id: 36,
                layername: 'Substrate Proxy (0-30m)',
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
        'http://marinemap.org/tiles/LinearSubstrate/Legend.png',
        'Substrate Proxy (0-30m)',
        "The shallow substrate proxy line integrates multiple sources of information to estimate the alongshore length of nearshore habitat that is dominated by rocky and soft-bottom respectively.  Information sources used to create this proxy include: finescale substrate data collected by Fugro Pelagos, Kvitek, USGS and others; maximum extent of kelp from CDFG aerial kelp surveys in years 1989, 1999, and 2002 through 2006; reef classifications from the Southern California Coastal Water Research Project (SCCWRP) Southern California Bight 2008 Regional Marine Monitoring Survey (Bight ’08) project; and shoreline type classification from National Oceanic and Atmospheric Administration (NOAA) Environmental Sensitivity Index (ESI) maps. It is important to recognize that this nearshore substrate proxy represents a generalized representation of the entire area from 0-30 meters depth, and not simply the habitat type present where the line is drawn."
    ],[
        'Maximum Extent of Kelp',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Maximum Extent of Kelp",
            ["http://marinemap.org/tiles/MaxKelp/"],
            {
                layer_id: 37,
                layername: 'Maximum Extent of Kelp',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.80,
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
        'http://marinemap.org/tiles/MaxKelp/Legend.png',
        'Maximum Extent of Kelp',
        "The maximum kelp layer represents the alongshore length of all kelp beds captured by CDFG aerial kelp surveys from the years 1989, 1999, and 2002 through 2006. The alongshore length of these kelp beds is measured using a line drawn along the outside edge of the kelp and roughly parallel to shore. Areas with multiple small patches of kelp canopy are represented with a solid linear feature around the outer edge of the broader area where the small patches occur."
    ]
	,[
        'Substrate SAT',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Substrate SAT",
            ["http://marinemap.org/tiles/SubstrateSAT/"],
            {
                layer_id: 38,
                layername: 'Substrate SAT',
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
        'http://marinemap.org/tiles/SubstrateSAT/Legend.png',
        'Substrate SAT',
        "This layer is a combination predicted substrate and linear 0 - 30m substrate proxy layers and aims to illustrate the use of data by the Science Advisory Team (SAT) when evaluating habitats influenced by substrate."
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

/*
gwst.data.EcotrustFishingImpactLayers = [[
        'Ecotrust Fishing Ground Maps',
        'Consumptive',
        new OpenLayers.Layer.WMS(
            "Ecotrust Fishing Ground Maps",
            "/gwst/mapserver/wms/",
            {
                layer_id: 28,
                layers: "SocioEconomicFishing",
                transparent: "true", 
                format: "image/png"
            },
            {
                'opacity': 0.9
            }
        ),
        'media/images/socioecon-legend.png',
        'Ecotrust Fishing Ground Maps',
        'Ecotrust has generated these maps through a series of interviews with commercial and recreational fisherman throughout the South Coast region of California. <br/><br/>To view a map, first turn this layer on.  You will be presented with a menu allowing you to select a user group, species, and port/county.  <br/><br/>A number of other aggregations are also available for selection, which are simply combinations of the individual maps.  Please ask for assistance if you need help understanding what they represent.<br/><br/>Finally click the button to load the map, you will see it come into view on the map display.  If you don\'t see anything make sure you are zoomed into the right area for what you selected.  Be aware that some maps are hard to see zoomed all the way out as well.  Look for red and yellow colors.<br/><br/>To load a different map, simply turn this layer off (checkbox) and then back on again to reload the selection menu.'
]];
*/


/* SubDataLayers are used for querying using WFS.  they are basically individual 
 * layers from the grouped tilecache layers.  so 1 or more sublayers are smashed 
 * together into single tilecache layers.  the subdatalayers are linked to their 
 * parent data layer only in name so make sure the subdatalayer node_name 
 * matches the NAME in the layers above.  That is what's used for linking the 
 * data layers menu with the infoquery window so that only the sublayers of 
 * enabled data layers are queryable.
 * 
 * Ultimately the SubDataLayers structure should probably be integrated into 
 * the DataLayers structure above.  Of course the whole thing should probably 
 * be server side or database driven.
 */

gwst.data.SubDataLayers = [
{
    node_name:'Satellite/Aerial Imagery',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Bathymetry',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Nautical Charts',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Study Region',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Graticules',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Isobaths',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Marine Mammals',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Pinniped Rookeries',
        sde: 'BIO_MAMMAL_PINNIPED_ROOKERIES_2008', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'Sp_Com_Nam',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Pinniped Haulouts',
        sde: 'BIO_MAMMAL_PINNIPEDS_2008', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'Com_Name',
            node_name: 'Name',
            value: ''           
        },{
            field: 'Num_Pups',
            node_name: 'Number of pups',
            value: ''           
        },{
            field: 'Total_Pinn',
            node_name: 'Total number',
            value: ''           
        },{
            field: 'Month',
            node_name: 'Month',
            value: ''           
        },{
            field: 'Year',
            node_name: 'Year',
            value: ''           
        }]
    }]
},{
    node_name:'Sea Bird Diversity',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Colony size and # of species',
        sde: 'BIO_SRSC_BIRD_COLONIES_SEABIRD', 
        shape_field: 'SHAPE',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NumSpecies',
            node_name: 'Total # of species',
            value: ''           
        },{
            field: 'NumBirds',
            node_name: 'Total # of birds',
            value: ''           
        }]
    }]
},{
    node_name:'Recreational Fishing',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Fishing Piers and Jetties',
        sde: 'CUL_SRSC_FISHINGPIERSANDJETTIES', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'MM_BDRY',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Kayak Launch Sites',
        sde: 'CUL_KFACA_KAYAKLAUNCHSITES', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'pmName',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Kayak Fishing Areas',
        sde: 'CON_KFACA_KAYAKFISHINGAREAS', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'pmName',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Spearfish Competition Sites',
        sde: 'CON_CENCALSPEARFISHSITES', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'DESCRIPT',
            node_name: 'Name',
            value: ''           
        }]
    }]
},{
    node_name:'Estuaries',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Nearshore Habitats',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Oil Seeps',
        sde: 'PHY_OILSEEPS', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'DESCRIPTIO',
            node_name: 'Description',
            value: ''           
        }]
    }]
},{
    node_name:'Hard and Soft Substrata',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Hard Substrate',
        sde: 'HAB_SRSC_SUBSTRATE', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'DESCRIPT',
            node_name: 'Description',
            value: ''           
        },{
            field: 'Sub_Depth',
            node_name: 'Depth',
            value: ''           
        }]
    },{
        node_name: 'Artificial Reefs',
        sde: 'HAB_ARTIFICIALREEFS_CENTROIDS', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NAME',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Shipwrecks',
        sde: 'CUL_SHIPWRECKSNOAAENC', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'COASTAL__1',
            node_name: 'Description',
            value: ''           
        }]
    },{
        node_name: 'Submarine Canyons',
        sde: 'PHY_CANYONS', 
        shape_field: 'SHAPE',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'HAB_TYPE',
            node_name: 'Habitat Type',
            value: ''           
        }]
    }]
},{
    node_name:'Coastal Energy',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Power Plants',
        sde: 'CUL_POWERPLANTS',
        shape_field: 'Shape', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'PLANTNAME',
            value: ''
        },{
            node_name: 'Technology',
            field: 'TECHNOLOGY',
            value: ''
        }]
    },{
        node_name: 'Oil Platforms',
        sde: 'CUL_OILPLATFORMS',
        shape_field: 'Shape', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'NAME',
            value: ''
        }]
    }]
},{
    node_name:'Research and Monitoring',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Research Institutions',
        sde: 'CUL_RESEARCH_INSTITUTIONS',
        shape_field: 'Shape', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'INSTITUTE',
            value: ''
        }]
    },{
        node_name: 'Marine Monitoring Sites',
        sde: 'MAN_MONITORINGSITES',
        shape_field: 'SHAPE', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'NAME',
            value: ''
        },{
            node_name: 'Institution',
            field: 'INSTITUTIO',
            value: ''
        }]
    },{
        node_name: 'Crane Monitoring Sites',
        sde: 'MAN_MONITORING_CRANE',
        shape_field: 'SHAPE', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'SITE_NAME',
            value: ''
        }]
    }]
},{
    node_name:'Cowcod Conservation Area',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Managed Areas',
    uiProvider:Ext.tree.ColumnNodeUI,
    iconCls:'',
    children:[{
        node_name: 'Terrestrial Managed Areas',
        sde: 'MAN_MANAGEDAREAS_TERRESTRIAL',
        shape_field: 'SHAPE', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Managing Agency',
            field: 'OWNERCODE',
            value: ''
        }]
    },{
        node_name: 'Marine Managed Areas',
        sde: 'MAN_FEDMPA',                
        shape_field: 'Shape', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'AREANAME1',
            value: ''   
        }]
    }]
},{
    node_name:'MPAs: Existing State',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'State Marine Protected Areas',
        sde: 'MPA_STATE', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NAME',
            node_name: 'Name',
            value: ''           
        },{
            field: 'Type',
            node_name: 'Type',
            value: ''           
        }]
    }]
},{
    node_name:'RCA: Commercial, Non-Trawl',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'RCA: Commercial, Trawl',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'RCA: Recreational',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Restricted Areas',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Restricted Areas',
        sde: 'MAN_RESTRICTEDAREAS',
        shape_field: 'SHAPE',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'TYPE',
            node_name: 'Type',
            value: ''           
        }]
    }]
},{
    node_name:'Coastal Access and Recreation',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Ports',
        sde: 'CUL_PORTS',
        shape_field: 'SHAPE',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'FEAT_NAME',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Harbors',
        sde: 'CUL_HARBORS',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'PROPERNAME',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Coastal Access Points',
        sde: 'CUL_COAST_ACCESSPOINT',
        shape_field: 'SHAPE',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NAME',
            node_name: 'Name',
            value: ''           
        },{
            field: 'FEATURETYP',
            node_name: 'Type',
            value: ''           
        }]
    },{
        node_name: 'Kayak Launch Sites',
        sde: 'CUL_KFACA_KAYAKLAUNCHSITES',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'pmName',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Shore Dive Sites',
        sde: 'NON_SRSC_SHORE_DIVE_LOCATIONS',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'Site_Name',
            node_name: 'Name',
            value: ''           
        }]
    }]
},{
    node_name:'Agricultural Impacts to Watersheds',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Urban Impacts to Watersheds',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Watersheds',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Major Watersheds',
        sde: 'PHY_HUNAMECALWAT221',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'HUNAME',
            node_name: 'Hydrologic Unit Name',
            value: ''           
        }]
    },{
        node_name: 'Coastal Rivers',
        sde: 'PHY_COASTALRIVERS',
        shape_field: 'SHAPE',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'PNAME',
            node_name: 'Name',
            value: ''           
        }]
    }]
},{
    node_name:'Water Quality',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Impaired Rivers',
        sde: 'PHY_IMPAIRED_RIVERS_CART',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'WBNAME',
            node_name: 'Name',
            value: ''           
        },{
            field: 'WBTYPE_NAM',
            node_name: 'Type',
            value: ''           
        }]
    },{
        node_name: 'Impaired Water Bodies',
        sde: 'PHY_IMPAIRED_WATERBODIES',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'WBNAME',
            node_name: 'Name',
            value: ''           
        },{
            field: 'WBTYPE_NAM',
            node_name: 'Type',
            value: ''           
        }]
    },{
        node_name: 'Ocean Outfalls',
        sde: 'CUL_OCEANOUTFALLS',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'FACILITY',
            node_name: 'Facility Name',
            value: ''           
        },{
            field: 'PRIMARY_DI',
            node_name: 'Company/Organization',
            value: ''           
        },{
            field: 'PRIMARY_EF',
            node_name: 'Type',
            value: ''           
        }]
    }]
},{
    node_name:'Shore Types',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Shore Types',
        sde: 'HAB_SHORETYPES',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'MapClass',
            node_name: 'Shore Type',
            value: ''           
        }]
    }]
}];

//Removed non-point layers until bbox intersect is working
/*
{
    node_name:'Marine Mammal Haulouts and Rookeries',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Pinniped Rookeries',
        sde: 'BIO_MAMMAL_PINNIPED_ROOKERIES_2008 ',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'Sp_Com_Nam',
            node_name: 'Pinniped Type',
            value: ''           
        }]
    }]
},{
    node_name:'Seabird Diversity',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Bird Colony Size & Number of Species in Colony',
        sde: 'BIO_SRSC_BIRD_COLONIES_SEABIRD', 
        shape_field: 'SHAPE',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NumSpecies',
            node_name: 'Total Number of Species',
            value: ''           
        },{
            field: 'NumBirds',
            node_name: 'Total Number of Birds',
            value: ''           
        }]
    }]
}
*/
