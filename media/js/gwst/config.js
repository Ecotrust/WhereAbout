Ext.namespace('gwst');

gwst.config = {
    adminEmail: 'fish@ecotrust.org',
    identifyBboxRadius: 500,
    projection: new OpenLayers.Projection("EPSG:900913"),
    displayProjection: new OpenLayers.Projection("EPSG:4326"),
    equalAreaProjection: new OpenLayers.Projection("EPSG:3310")
};

Ext.Ajax.timeout = 120000;