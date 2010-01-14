Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PennyPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'penny-panel',
	resource: 'unknown',
	cur_num: 'unknown',
	total_num: 'unknown',
	pennies_remaining: 'unknown',
    shape_name: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('penny-cont');
        this.addEvents('penny-back');
        
        // Call parent (required)
        gwst.widgets.PennyPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
        this.nav_panel.getEl().update(this.getNavText());
    },
	
    getHtmlText: function() {
        var html_text = '<p>\
			<b>Instructions</b><br />\
			<p>\
			a. Your first <i>'+ this.resource +'</i> '+ this.shape_name +' is now loaded. \
			Enter a penny value for it below in the white box. \
			Then click the right arrow (>>) to move to your next '+ this.shape_name +'. \
			</p><br />\
			<p> \
			b. Keep entering penny values.  Every '+ this.shape_name +' must have at least 1 penny\
			and you must use all 100 pennies.\
			</p><br />\
			<p>\
			c. Click the \'Continue\' button when you are done.\
			</p><br />\
			<p> <a href=http://www.google.com>View Demonstration</a></p>\
			<br />';
        return html_text;
    },
    
    getNavText: function() {
		var nav_text = '<p>\
			<b>Current '+ this.shape_name +': #'+ this.cur_num +' of '+ this.total_num +'</b>\
			</p>\
			<input type="button" name="prev_shape" value="<<" /> \
			Pennies (<font color="red">'+ this.pennies_remaining +' left</font>):\
			<input type="text" size="3" maxlength="3" />  \
			<input type="button" name="next_shape" value=">>" /> \
			<br /><br />\
			<b>Status</b>';
        return nav_text;
    },
    
    gridActionClicked: function(grid, record, action, row, col) {
        if(action == 'pennies-edit') {
            alert('TODO: make pennies column editable for '+record.get('id')+'.');
        } else if (action == 'pennies-zoom') {
            alert('TODO: zoom in on '+record.get('id')+'.');
        }
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
		this.nav_panel = new Ext.Panel({
			html: this.getNavText(),
            id: 'penny_nav_panel',
			border: false,
			style: 'margin: 10px'
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
                width: 55,
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
            width: 265,
            title: 'Fishing Grounds',
            style: 'margin: 15px',
            stateful: true,
            stateId: 'grid'
        });
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            back_handler: this.backBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
		this.add(this.nav_panel);
		this.add(this.inner_grid_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.PennyPanel.superclass.onRender.apply(this, arguments); 
	},
    
    backBtnClicked: function() {
        this.fireEvent('penny-back',this);
    },
    
    contBtnClicked: function() {
        this.fireEvent('penny-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-penny-panel', gwst.widgets.PennyPanel);