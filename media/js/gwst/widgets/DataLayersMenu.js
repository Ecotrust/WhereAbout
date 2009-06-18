/*
DataLayersMenu
*/
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DataLayersMenu = Ext.extend(gwst.widgets.DropdownMenu, {
    id: 'dataLayersMenu',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Called during component initialization
        // Config object has already been applied to 'this' so properties can 
        // be overriden here or new properties (e.g. items, tools, buttons) 
        // can be added, eg:
        Ext.apply(this, {
            text: 'Data Layers'
        });
 
        // Before parent code
 
        // Call parent (required)
        gwst.widgets.DataLayersMenu.superclass.initComponent.apply(
          this, arguments);
        // After parent code                      
    },
          
    // redraw layers: a brute-force way of rendering the map layers in their current list order
    redrawLayers: function(){
        var num_recs = this.store.getCount();
        var curr_rec;
 
        new_index = 0;
        
        // arrange the OpenLayers layers in the order they appear in the store
        for ( i = num_recs-1; i >= 0; i-- )
        {
            curr_rec = this.store.getAt(i); 
            if ( curr_rec.layerOn )
            {
                layer = curr_rec.get('layer');
                gwst.app.map.map.setLayerIndex( layer, new_index );
                new_index = new_index + 1;
            }
        }
    },
    
    turnOnDefaultLayers: function() {
        //TODO: NEED NEW GRID SUBCLASS WITH OWN ONRENDER
        //AND ALL OF THIS PUSHED INTO THAT METHOD.  selection model
        //simply isn't hooked up to the grid yet at this point
        var default_on_query = function(rec) {
        	var on_default = rec.get('on_default'); 
            return (on_default === true);
        };       
        //Look for layers to turn on by default
        var layer_recs = this.store.queryBy(default_on_query, this);
        
        //sm.selectRecords(layer_recs).createDelegate(sm);        
        var map = Ext.getCmp('map');
        for (var i=0; i<layer_recs.items.length; i++) {
            map.addDataLayer(layer_recs.items[i].get('layer'));
            layer_recs.items[i].layerOn = true; // draw check this row by default
        }
    },
    
    reinitLayers: function() {
        var map = Ext.getCmp('map');
        var num_recs = this.store.getCount();
        var curr_rec;

        // turn off any active layers
        for ( i = num_recs-1; i >= 0; i-- )
        {
            curr_rec = this.store.getAt(i); 
            if ( curr_rec.layerOn )
            {
                layer = curr_rec.get('layer');
                map.removeDataLayer( layer );            
                curr_rec.layerOn = false;
            }
        }
        
        this.store.removeAll();
        this.store.loadData( gwst.data.DataLayers );
        this.turnOnDefaultLayers();
        this.store.sort( 'group', 'ASC' );

    },
    
    toggleLayerHandler: function(sm, rowIndex, rec) {
        var layer = rec.get('layer');
        if ( !rec.layerOn )
        {
            rec.layerOn = true;
            this.onAddMapLayer(rec.get('layer'));  
        } else {
            rec.layerOn = false;
            this.onRemoveMapLayer(rec.get('layer'));
        }
        this.redrawLayers();
    },
    
 
    // Override other inherited methods 
    onRender: function(){
        // Before parent code 
        // Call parent (required)
        gwst.widgets.DataLayersMenu.superclass.onRender.apply(this, arguments); 
        // After parent code
        
        var expander = new Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<p><i>Description: {desc}</i></p>',
                '<p><img src=\'{legend_url}\'></p>',
                '<p><i>Metadata: {metadata}</i></p>'
            )
        });
        
        var reader = new Ext.data.ArrayReader({}, [
           {name: 'name'},
           {name: 'group'},
           {name: 'layer'},
           {name: 'legend_url'},
           {name: 'desc'},
           {name: 'metadata'},
           {name: 'on_default'}
        ]);
    
        var sm = new Ext.grid.MmappSelectionModel({
            singleSelect:true,
            header: '<div id="fool-ext-into-hiding-header2" class="eh"></div>'
        });
        
        // e.g. install event handlers on rendered component        
        sm.addListener('toggleLayer', this.toggleLayerHandler, this);
        
        var toolbar = new gwst.widgets.ControlToolbar({
            map:Ext.getCmp('map').map,
            configurable: false,
            id: 'mt1'
        });  
        
        
        this.store = new Ext.data.Store({
            reader: reader,
            data: gwst.data.DataLayers
        });
        this.store.sort( 'group' );
        
        this.grid = new Ext.grid.GridPanel({        	
            id:'the-grid',
            store: this.store,
            cm: new Ext.grid.ColumnModel([
                sm,
                expander,
                {id:'name',header: "Name", width: 210, sortable: true, dataIndex: 'name'},
                {header: "Category", width: 140, sortable: true, dataIndex: 'group'}
            ]),
            sm:sm,
            width:500,
            height:150,
            viewConfig: {
                forceFit:true
            },        
            plugins: expander,        
            frame:false,
            enableDragDrop:true,
            ddGroup: 'mmDDGroup',
            listeners: {
                sortchange: function() {
                    Ext.getCmp('dataLayersMenu').redrawLayers();
                },
                render: function(g) {
                    // Best to create the drop target after render, so we don't need to worry about whether grid.el is null

                    // constructor parameters:
                    //    grid (required): GridPanel or EditorGridPanel (with enableDragDrop set to true and optionally a value specified for ddGroup, which defaults to 'GridDD')
                    //    config (optional): config object
                    // valid config params:
                    //    anything accepted by DropTarget
                    //    listeners: listeners object. There are 4 valid listeners, all listed in the example below
                    //    copy: boolean. Determines whether to move (false) or copy (true) the row(s) (defaults to false for move)
                    var ddrow = new Ext.ux.dd.GridReorderDropTarget(g, {
                        copy: false,
                        listeners: {
                            beforerowmove: function(objThis, oldIndex, newIndex, records) {
                                // return false to cancel the move
                            }
                            ,afterrowmove: function(objThis, oldIndex, newIndex, records) {
                                Ext.getCmp('dataLayersMenu').redrawLayers();
                            }
                            ,beforerowcopy: function(objThis, oldIndex, newIndex, records) {
                                // return false to cancel the copy
                            }
                            ,afterrowcopy: function(objThis, oldIndex, newIndex, records) {
                            }
                        }
                    });
                    
                    // if you need scrolling, register the grid view's scroller with the scroll manager
                    Ext.dd.ScrollManager.register(g.getView().getEditorParent());
                }
                ,beforedestroy: function(g) {
                    // if you previously registered with the scroll manager, unregister it (if you don't it will lead to problems in IE)
                    Ext.dd.ScrollManager.unregister(g.getView().getEditorParent());
                }
            },
            iconCls:'icon-grid'        
        });
        sm.addListener({
            'beforerowselect': function(sm, rowIndex, keepExisting, record){
                // console.log(sm, rowIndex, keepExisting, record);
                // console.log(e);
                // sm.selectRow(rowIndex);
                if(keepExisting === false){
                    return false;
                }
            }
        });
        
        this.turnOnDefaultLayers();
        
        this.window.add(this.grid);
        this.window.x = 0;
        this.window.y = 76;
        this.window.setHeight(150);
        this.window.setTitle('Data Layers');          
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-widgets-datalayersmenu', gwst.widgets.DataLayersMenu);