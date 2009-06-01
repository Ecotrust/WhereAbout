/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.namespace('Foo', 'Foo.bar');

Ext.onReady(function(){

    Ext.QuickTips.init();
    
    var xg = Ext.grid;

    // shared reader
    var reader = new Ext.data.ArrayReader({}, [
       {name: 'name'},
       {name: 'group'},
       {name: 'layer'},
       {name: 'desc'},
       {name: 'metadata'}
    ]);

    ////////////////////////////////////////////////////////////////////////////////////////
    // Grid 1
    ////////////////////////////////////////////////////////////////////////////////////////
    // row expander
    var expander = new xg.RowExpander({
        tpl : new Ext.Template(
            '<p><u>Description:</u> {desc}</p>',
            '<p><u>Metadata:</u> {metadata}</p>'
        )
    });

    var grid1 = new xg.GridPanel({
        store: new Ext.data.Store({
            reader: reader,
            data: xg.dummyData
        }),
        cm: new xg.ColumnModel([
            expander,
            {id:'name',header: "Name", width: 40, sortable: true, dataIndex: 'name'},
            {header: "Group", sortable: true, dataIndex: 'group'}
        ]),
        viewConfig: {
            forceFit:true
        },
        width: 600,
        height: 300,
        plugins: expander,
        collapsible: true,
        animCollapse: false,
        title: 'Expander Rows, Collapse and Force Fit',
        iconCls: 'icon-grid',
        renderTo: document.body 
    });

    ////////////////////////////////////////////////////////////////////////////////////////
    // Grid 2
    ////////////////////////////////////////////////////////////////////////////////////////
    var sm = new xg.CheckboxSelectionModel();
    Foo.bar.grid2 = new xg.GridPanel({
        store: new Ext.data.Store({
            reader: reader,
            data: xg.dummyData
        }),
        cm: new xg.ColumnModel([
            expander,
            sm,
            {id:'name',header: "Name", width: 150, sortable: true, dataIndex: 'name'},
            {header: "group", width: 100, sortable: true, dataIndex: 'group'}
        ]),
        sm: sm,
        width:300,
        height:300,
        viewConfig: {
            forceFit:true
        },        
        plugins: expander,        
        frame:true,
        title:'Data Layers By Category',
        iconCls:'icon-grid',
        renderTo: document.body
    });
});



// Array data for the grids
Ext.grid.dummyData = [
    [
        'Bathymetry',
        'Group 1',
        new OpenLayers.Layer.TMS( 
            "Bathymetry", 
            ["http://gwst.org/downloads/dwuthrich/bathymetry/"], 
            {
                layername: 'bathymetry', buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.5,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom();
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 19 && z >= 6 ) {
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
        }),
        'Bathymetry shaded relief with contour lines.',
        'Insert link here'        
    ],
    [
        'Nautical Charts',
        'Group 2',
        new OpenLayers.Layer.TMS( 
            "Nautical Charts", 
            ["http://gwst.org/downloads/dwuthrich/Charts/"], 
            {
                layername: 'Charts', buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom();
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 19 && z >= 6 ) {
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
        'NOAA ENC Nautical Charts',
        'Insert link here'
    ]
];

// add in some dummy descriptions
//for(var i = 0; i < Ext.grid.dummyData.length; i++){
//    Ext.grid.dummyData[i].push('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, sodales a, porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales non, iaculis ac, lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet tincidunt quam turpis vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla vel, urna.<br/><br/>Aliquam commodo ullamcorper erat. Nullam vel justo in neque porttitor laoreet. Aenean lacus dui, consequat eu, adipiscing eget, nonummy non, nisi. Morbi nunc est, dignissim non, ornare sed, luctus eu, massa. Vivamus eget quam. Vivamus tincidunt diam nec urna. Curabitur velit.');
//}