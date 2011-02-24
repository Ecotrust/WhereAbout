Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.CopyPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'copy-panel',
    shape_name: 'unknown',
    record: null,
    resource_type: 'unknown',
    resource_name: 'unknown',
    shape_name_plural: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('copy-cont');
        this.addEvents('copy-back');
        this.addEvents('copy-zoom-shape');
        this.addEvents('copy-zoom-all');
        
        // Call parent (required)
        gwst.widgets.CopyPanel.superclass.initComponent.apply(this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
	
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2><p>a. Click on the '+ this.shape_name +' that you want to copy to see which entry is highlighted in the table.</p><p>b. Click \'Copy This\' to copy that '+this.shape_name+' to your current resource.</p> <p>c. Click \'Go Back\' if you don\'t want to copy any of these '+this.shape_name_plural+'.</p>';
        return html_text;
    },
    
    gridActionClicked: function(grid, record, action, row, col) {
        if(action == 'copy-shape') {
            this.record = record;
            if (!this.copyWin) {
            	//Create a new penny window
                this.copyWin = new gwst.widgets.CopyWindow({
                    shape_name: this.shape_name,
                    record: this.record
                });
                this.copyWin.on('copy-set', this.copySet, this);             
            } else {
            	//Update the existing penny window
                this.copyWin.update({
                    shape_name: this.shape_name,
                    record: this.record
                });
            }
            this.copyWin.show();
        } else if (action == 'copy-zoom') {
            this.fireEvent('copy-zoom-shape', record);
        }
    },
    
    copySet: function(record){
        this.record = record;
        this.fireEvent('copy-cont', this.record);
    },
                
    onRender: function(){        
        this.header_panel = new Ext.Panel({  
			html: 'Copy '+ this.shape_name_plural +' from other '+this.resource_name+'.',
            id: 'copy_header_panel',
			border: 'north',
            bodyCfg: {
                cls: 'action-panel-header'
            }
        });

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'copy_inner_panel',
			style: 'margin: 10px',
			border: false
		});

        //Grid button actions
	 	this.grid_actions = new Ext.ux.grid.RowActions({
			 header:'',
			 autoWidth: false,
			 width: 160,
			 sortable: false,
			 keepSelection:true,
			 actions:[{
				iconCls:'copy-shape',
				text: 'Copy This'
			},{
				iconCls:'copy-zoom',
				text: 'Zoom To'
			}]
		});

		//Grid button event handlers
		this.grid_actions.on({
                //set scope to Panel (defaults to RowActions)
			action:this.gridActionClicked.createDelegate(this)
		});
				
        this.copy_inner_grid_panel = new Ext.grid.GridPanel ({
            store: gwst.settings.otherResourceShapeStore,
            columns: [{
            	width: 30,
            	sortable: false,
            	renderer: function() {return '<img src="/site-media/images/control_play.png"/>';}
            },
            new Ext.grid.RowNumberer(),
            this.grid_actions
            ],
            plugins: this.grid_actions,
            sm: new GeoExt.grid.FeatureSelectionModel(),
            stripeRows: true,
            height: 200,
            width: 275,
            title: 'Your NON-'+this.resource+' '+capWords(this.shape_name)+'s',
            style: 'margin: 10px;',
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
        
        this.copy_inner_grid_panel.getColumnModel().setHidden(2, false);
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            back_handler: this.backBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
		this.add(this.copy_inner_grid_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.CopyPanel.superclass.onRender.apply(this, arguments); 
	},
    
    backBtnClicked: function() {
        this.fireEvent('copy-back',this);
    },

    zoomAllClicked: function() {
    	this.fireEvent('copy-zoom-all');
    },
    
    //Refresh the whole grid to update the row numberer
    refresh: function() {
    	this.copy_inner_grid_panel.getView().refresh();
    }

});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-copy-panel', gwst.widgets.CopyPanel);