Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.Draw2Panel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-two-panel',
	resource: 'unknown',
	user_group: 'unknown',
    shape_name: 'unknown',
    action: 'unknown',
    //store the selected record to delete to pass around
    cur_action_record: null,
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('draw-two-cont');        
        this.addEvents('draw-two-back');        
        this.addEvents('draw-two-instructions');
        this.addEvents('draw-two-zoom-shape');
        this.addEvents('draw-two-zoom-all');
        
        // Call parent (required)
        gwst.widgets.Draw2Panel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
            <b>Instructions:</b> \
            Finish drawing all of your <i>'+ this.resource +'</i> '+ this.shape_name +'s \
            you '+ this.action +' as a '+ this.user_group +'!</i></p><br />\
            \
            <p>Each '+this.resource+' '+this.shape_name+' you draw will be displayed on the table below.\
            Click on the table row to highlight it on the map.  You can remove a '+this.shape_name+' with\
            the \'Remove\' button.</p><br />\
            \
            <p>Click the \'Continue\' button when you are finished.</p><br />';
        return html_text;
    },
    
    deleteCheck: function(btn, text) {
        if(btn == 'yes') {
            this.fireEvent('draw-two-delete', this.cur_action_record);
        }
    },

    gridActionClicked: function(grid, record, action, row, col) {
        if(action == 'shape-delete') {
            this.cur_action_record = record;
            Ext.Msg.show({
                title:'Delete?',
                msg:'Do you really want to delete this '+this.shape_name+'?',
                buttons: Ext.Msg.YESNO,
                fn: this.deleteCheck.createDelegate(this),
                animEl:'elId',
                icon:Ext.MessageBox.QUESTION,
                
            });
        } else if (action == 'shape-zoom') {
            this.fireEvent('draw-two-zoom-shape', record);
        }
    },

    onRender: function(){
        this.header_panel = new Ext.Panel({  
			html: '<img src="/site-media/images/3_2_DrawExtended_header.png">',
            id: 'draw_extended_header_panel',
			border: 'north',
            bodyCfg: {
                cls: 'action-panel-header'
            }
        });
    
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'draw_extended_inner_panel',
			style: 'margin: 10px',
			border: false
		});

		//Grid button actions
	 	this.grid_actions = new Ext.ux.grid.RowActions({
			 header:'',
			 autoWidth: false,
			 sortable: false,
			 width: 132,
			 keepSelection:true,
			 actions:[{
				iconCls:'shape-delete',
				text: 'Remove'
			},{
				iconCls:'shape-zoom',
				text: 'Zoom To'
			}]
		});

		//Grid button event handlers
		this.grid_actions.on({
                //set scope to Panel (defaults to RowActions)
			action:this.gridActionClicked.createDelegate(this)
		});
				
        this.inner_grid_panel = new Ext.grid.GridPanel ({
            store: gwst.settings.shapeStore,
            columns: [{
            	width: 20,
            	sortable: false,
            	renderer: function() {return '<img src="/site-media/images/control_play.png"/>';}
            },
            new Ext.grid.RowNumberer(),{
                header:'Pennies',
                width: 50,
                sortable: false,
                dataIndex: 'pennies',
                align: 'center',
            }, this.grid_actions
            ],
            viewConfig: {
                forceFit: true
            },            
            plugins: this.grid_actions,
            sm: new GeoExt.grid.FeatureSelectionModel({singleSelect:true}),
            stripeRows: true,
            height: 200,
            width: 275,
            title: 'Your '+this.resource+' '+capWords(this.shape_name)+'s',
            style: 'margin: 10px',
            stateful: true,
            enableColumnResize: false,
            enableColumnHide: false,            
            stateId: 'grid',
            bbar: [{
            	xtype:'tbfill'
            },{
            	text: 'Show All',
            	iconCls: 'shape-zoom-all',
            	handler: this.zoomAllClicked,
            	scope: this
            }]
        });
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            back_handler: this.backBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.inner_grid_panel); 
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.Draw2Panel.superclass.onRender.apply(this, arguments); 
	},     
	
    contBtnClicked: function() {    
	    this.fireEvent('draw-two-cont');
    },
    
    backBtnClicked: function() {
        this.fireEvent('draw-two-back');
    },
    
    zoomAllClicked: function() {
    	this.fireEvent('draw-two-zoom-all');
    },
    
    //Refresh the whole grid to update the row numberer
    refresh: function() {
    	this.inner_grid_panel.getView().refresh();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-two-panel', gwst.widgets.Draw2Panel);