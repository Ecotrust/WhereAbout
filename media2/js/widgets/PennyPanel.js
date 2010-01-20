Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PennyPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'penny-panel',
	resource: 'unknown',
	cur_num: 'unknown',
	total_num: 'unknown',
	pennies_remaining: 'unknown',
    shape_name: 'unknown',
    record: null,
    penniesLeft: null,	//pennies remaining for group 
    shape_name_plural: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('penny-cont');
        this.addEvents('penny-back');
        this.addEvents('penny-zoom-shape');
        this.addEvents('penny-zoom-all');
        
        // Call parent (required)
        gwst.widgets.PennyPanel.superclass.initComponent.apply(this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
	
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2>\
            <p>a. Click \'Edit Pennies\' below and give each of your '+this.shape_name_plural+' a penny value.  You must use all 100.</p>\
            <p>b. Click \'Go Back\' if you need to change your '+this.shape_name_plural+'.</p>\
            <p>c. Click \'Continue\' to move on.</p>\
            <p class="video-link"><img src="/site-media/images/film_go.png"/> <a onclick="return false;" href="#">View Video Demonstration</a>';
        return html_text;
    },
    
    gridActionClicked: function(grid, record, action, row, col) {
        if(action == 'pennies-edit') {
            this.record = record;
            if (!this.pennyWin) {
            	//Create a new penny window
                this.pennyWin = new gwst.widgets.PennyWindow({
                    prev_pennies: parseInt(record.get('pennies')),
                    rem_pennies: this.getPenniesRemaining(),
                    shape_name: this.shape_name
                });
                this.pennyWin.on('penny-set', this.pennySet, this);                
                this.pennyWin.show();	
            } else {
            	//Update the existing penny window
                this.pennyWin.load({
                    prev_pennies: parseInt(record.get('pennies')),
                    rem_pennies: this.getPenniesRemaining(),
                    shape_name: this.shape_name
                });
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
			 width: 157,
			 sortable: false,
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
            	width: 24,
            	sortable: false,
            	renderer: function() {return '<img src="/site-media/images/control_play.png"/>';}
            },
            new Ext.grid.RowNumberer(),{
                header:'Pennies',
                width: 50,
                sortable: false,
                dataIndex: 'pennies',
                align: 'center'
            }, this.grid_actions
            ],
            plugins: this.grid_actions,
            sm: new GeoExt.grid.FeatureSelectionModel(),
            stripeRows: true,
            height: 200,
            width: 275,
            title: 'Your '+this.resource+' '+capWords(this.shape_name)+'s',
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
        
        gwst.settings.shapeStore.on('update', this.updateStatus, this);
        
        this.status_panel = new Ext.Panel({
            id: 'penny-status-panel',
        	layout: 'table',
            border: false,
            style: 'margin: 5px; margin-left: 10px',
            defaults: {
                bodyStyle: 'border: none;'
            },
            layoutConfig: {
                columns: 2
            },
            items: [{
                html: 'Remaining:&nbsp;'
            },{
                html: '<img src="/site-media/images/coins.png"/> <span id="pen-rem">'+this.getPenniesRemaining()+'</span>'
            },{
                html: 'Status:'
            },{
                html: '<span id="pen-status">'+this.getStatusMsg()+'</span>'
            }]
        });
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            cont_enabled: this.isComplete(),
            back_handler: this.backBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
		this.add(this.inner_grid_panel);
        this.add(this.status_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.PennyPanel.superclass.onRender.apply(this, arguments); 
	},
    
    backBtnClicked: function() {
        this.fireEvent('penny-back',this);
    },
    
    contBtnClicked: function() {
    	if (this.getPenniesRemaining() == 0) {
    		this.fireEvent('penny-cont',this);
    	}
    },
    
    zoomAllClicked: function() {
    	this.fireEvent('penny-zoom-all');
    },
    
    //Refresh the whole grid to update the row numberer
    refresh: function() {
    	this.inner_grid_panel.getView().refresh();
    },
    
    getPenniesRemaining: function() {
    	return (100 - gwst.settings.shapeStore.getPennyCount());
    },
    
    getStatusMsg: function() {
    	if (this.getPenniesRemaining() > 0) {
    		return 'Incomplete, use all 100 pennies';
    	} else {
    		return 'Complete, ready to move on';
    	}
    },
    
    isComplete: function() {
    	if (this.getPenniesRemaining() == 0) {
    		return true;
    	} else {
    		return false;
    	}
    },
    
    updateStatus: function() {
    	var penniesLeft = this.getPenniesRemaining();
    	Ext.get('pen-rem').update(penniesLeft);
    	if (penniesLeft == 0) {
    		this.button_panel.enableCont();    		
    	} else {
    		this.button_panel.disableCont();
    	}
    	Ext.get('pen-status').update(this.getStatusMsg());
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-penny-panel', gwst.widgets.PennyPanel);