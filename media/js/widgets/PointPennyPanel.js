Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PointPennyPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'point-penny-panel',
	resource: 'unknown',
	cur_num: 'unknown',
	total_num: 'unknown',
	pennies_remaining: 'unknown',
    shape_name: 'unknown',
    record: null,
    penniesLeft: null,	//pennies remaining for group 
    shape_name_plural: 'unknown',
    help_url: "/videos/marker_pennies",
    activity_num: null,
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('point-penny-cont');
        this.addEvents('point-penny-back');
        this.addEvents('penny-zoom-shape');
        this.addEvents('penny-zoom-all');
        
        // Call parent (required)
        gwst.widgets.PointPennyPanel.superclass.initComponent.apply(this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
        Ext.get('header_penny_point').update(this.getHeaderText());
    },
	
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2><p>a. Click \'Edit Pennies\' below and give each of your '+this.shape_name_plural+' a penny value.  You must use all 100 pennies.</p> <p>b. Click \'Go Back\' if you need to add more '+this.shape_name_plural+'.</p> <p>c. Click \'Continue\' after you have allocated 100 pennies.</p> <p class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ this.help_url +'" target="_blank">View Video Demonstration</a></p>';
        return html_text;
    },
    
    gridActionClicked: function(grid, record, action, row, col) {
        if(action == 'pennies-edit') {
            this.record = record;
            if (!this.pointPennyWin) {
            	//Create a new penny window
                this.pointPennyWin = new gwst.widgets.PointPennyWindow({
                    prev_pennies: parseInt(record.get('pennies')),
                    rem_pennies: this.getPenniesRemaining(),
                    shape_name: this.shape_name
                });
                this.pointPennyWin.on('penny-set', this.pennySet, this);             
            } else {
            	//Update the existing penny window
                this.pointPennyWin.load({
                    prev_pennies: parseInt(record.get('pennies')),
                    rem_pennies: this.getPenniesRemaining(),
                    shape_name: this.shape_name
                });
            }
            this.pointPennyWin.show();
        } else if (action == 'pennies-zoom') {
            this.fireEvent('penny-zoom-shape', record);
        }
    },
    
    pennySet: function(pennies_value){
        this.record.set('pennies', pennies_value);
    },
                
    onRender: function(){        
    
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_penny_point', html:this.getHeaderText()},
			style: 'padding:5px',
            id: 'point_penny_header_panel',
			border: false   
        });

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'point_penny_inner_panel',
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
				
        this.point_penny_inner_grid_panel = new Ext.grid.GridPanel ({
            store: gwst.settings.shapeStore,
            columns: [{
            	width: 30,
            	sortable: false,
            	renderer: function() {return '<img src="/media/img/control_play.png"/>';}
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
            sm: new GeoExt.grid.FeatureSelectionModel({selectControl:this.manager.getSelectControl()}),
            stripeRows: true,
            height: 200,
            width: 285,
            title: 'Your Markers',
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
        
        this.point_penny_inner_grid_panel.getColumnModel().setHidden(2, false);
        
        this.addUpdateListeners();
        
        this.status_panel = new Ext.Panel({
            id: 'point-penny-status-panel',
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
                html: '<p class="x-panel-static">Remaining:&nbsp;</p>'
            },{
                html: '<img src="/media/img/coins.png"/> <span id="pen-rem-point">'+this.getPenniesRemaining()+'</span>'
            },{
                html: 'Status:'
            },{
                html: '<span id="pen-status-point">'+this.getStatusMsg()+'</span>'
            }]
        });
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            cont_enabled: this.isComplete(),
            back_handler: this.backBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
		this.add(this.point_penny_inner_grid_panel);
        this.add(this.status_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.PointPennyPanel.superclass.onRender.apply(this, arguments); 
	},
    
    addUpdateListeners: function() {
        gwst.settings.shapeStore.on('update', this.updateStatus, this);
        gwst.settings.shapeStore.on('remove', this.updateStatus, this);    
    },
    
    remUpdateListeners: function() {
        gwst.settings.shapeStore.un('update', this.updateStatus);
        gwst.settings.shapeStore.un('remove', this.updateStatus);
    },    
    
    backBtnClicked: function() {
        this.fireEvent('point-penny-back',this);
    },
    
    contBtnClicked: function() {
    	if (this.getPenniesRemaining() == 0) {
    		this.fireEvent('point-penny-cont',this);
    		this.remUpdateListeners();
    	}
    },
    
    zoomAllClicked: function() {
    	this.fireEvent('penny-zoom-all');
    },
    
    //Refresh the whole grid to update the row numberer
    refresh: function() {
    	this.point_penny_inner_grid_panel.getView().refresh();
    },
    
    getPenniesRemaining: function() {
    	return (100 - gwst.settings.shapeStore.getPennyCount());
    },
    
    pennilessShapesExist: function() {
        for (var i = 0; i < gwst.settings.shapeStore.getCount(); i++) {
            if (gwst.settings.shapeStore.getAt(i).get('pennies') == 0) {
                return true;
            }
        }
        return false;
    },
    
    
    getStatusMsg: function() {
    	if (this.getPenniesRemaining() > 0) {
    		return 'Incomplete, use all 100 pennies';
    	} else if (this.pennilessShapesExist()) {
            return 'Incomplete, not all '+ this.shape_name_plural +' have pennies allocated';
        } else {
    		return 'Complete, ready to move on';
    	}
    },
    
    isComplete: function() {
    	if (this.getPenniesRemaining() == 0 && !(this.pennilessShapesExist())) {
    		return true;
    	} else {
    		return false;
    	}
    },
    
    updateStatus: function() {
    	var penniesLeft = this.getPenniesRemaining();
    	Ext.get('pen-rem-point').update(penniesLeft);
    	if (penniesLeft == 0 && !(this.pennilessShapesExist())) {
    		this.button_panel.enableCont();    		
    	} else {
    		this.button_panel.disableCont();
    	}
    	Ext.get('pen-status-point').update(this.getStatusMsg());
    },
    
    getHeaderText: function() {
    	return 'Activity #'+this.activity_num+': <span class="activity-text">'+this.resource+'</span>';
    }   
    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-point-penny-panel', gwst.widgets.PointPennyPanel);