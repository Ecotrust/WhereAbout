Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PennyPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'penny-panel',
	resource: 'unknown',
	cur_num: 'unknown',
	total_num: 'unknown',
	pennies_remaining: 'unknown',
    shape_name: 'unknown',
    record: null,
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('penny-cont');
        this.addEvents('penny-back');
        this.addEvents('penny-zoom-shape');
        
        // Call parent (required)
        gwst.widgets.PennyPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
	
    getHtmlText: function() {
        var html_text = '<p>\
			<b>Instructions</b><br />\
			<p>\
			- Enter a penny value for each of your '+this.shape_name+'s below by clicking \'Edit Pennies\'.\
			<br />\
			- Every '+this.shape_name+' must have at least 1 penny and you must use all 100 pennies.\
            <br />\
			- Click the \'Continue\' button when you are done.\
			</p><br />\
			<p> <a href=http://www.google.com>View Demonstration</a></p>\
			<br />\
            <p><b>Current Allocations</b></p>';
        return html_text;
    },
    
    gridActionClicked: function(grid, record, action, row, col) {
        if(action == 'pennies-edit') {
            this.record = record;
            if (!this.pennyWin) {
                this.pennyWin = new gwst.widgets.PennyWindow({
                    prev_pennies: record.get('pennies'),
                    shape_name: this.shape_name
                });
                this.pennyWin.on('penny-set', this.pennySet, this);
                this.pennyWin.show();	
            } else {
                Ext.apply(this.pennyWin, {
                    prev_pennies: record.get('pennies'),
                    shape_name: this.shape_name
                });
                this.pennyWin.on('penny-set', this.pennySet, this);
                this.pennyWin.show();
            }
        } else if (action == 'pennies-zoom') {
            this.fireEvent('penny-zoom-shape', record);
        }
    },
    
    pennySet: function(pennies_value){
        this.record.set('pennies', pennies_value);
    },
                
    onRender: function(){
        
        this.header_panel = new Ext.Panel({  
			html: '<img src="/site-media/images/4b_PennyAllocation_header.png">',
            id: 'penny_header_panel',
			border: 'north',
            bodyCfg: {
                cls: 'action-panel-header'
            }
        });

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'penny_inner_panel',
			style: 'margin: 10px',
			border: false
		});

        //Grid button actions
	 	this.grid_actions = new Ext.ux.grid.RowActions({
			 header:'',
			 autoWidth: false,
			 width: 155,
			 keepSelection:true,
			 actions:[{
				iconCls:'pennies-edit',
				text: 'Edit Pennies'
			},{
				iconCls:'pennies-zoom',
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
                id:'id',
                header:'#',
                width: 35,
                sortable: true,
                dataIndex:'id'
            },{
                header:'Pennies',
                width: 50,
                sortable: false,
                dataIndex: 'pennies'
            }, this.grid_actions
            ],
            plugins: this.grid_actions,
            sm: new GeoExt.grid.FeatureSelectionModel(),
            stripeRows: true,
            height: 250,
            width: 255,
            title: ''+this.shape_name+'s',
            style: 'margin: 15px',
            stateful: true,
            stateId: 'grid'
        });
        
        this.lower_panel = new Ext.Panel ({
            id: 'penny_lower_panel',
            html: '<p>\
                '+this.pennies_remaining+' of 100 pennies allocated</p><br />\
                <p>\
                Status: Incomplete<br />\
                - Use all 100 pennies<br />\
                - Give each '+this.shape_name+' at least one penny\
                </p>',
            style: 'margin: 10px',
			border: false
        });
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            back_handler: this.backBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
		this.add(this.inner_grid_panel);
        this.add(this.lower_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.PennyPanel.superclass.onRender.apply(this, arguments); 
	},
    
    backBtnClicked: function() {
        this.fireEvent('penny-back',this);
    },
    
    contBtnClicked: function() {
        this.fireEvent('penny-cont',this);
    },
    
    //Refresh the whole grid to update the row numberer
    refresh: function() {
    	this.inner_grid_panel.getView().refresh();
    }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-penny-panel', gwst.widgets.PennyPanel);