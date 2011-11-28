Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.Draw2Panel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-two-panel',
	resource: 'unknown',
	user_group: 'unknown',
    shape_name: 'unknown',
    action: 'unknown',
    shape_name_plural: 'unknown',
    //store the selected record to delete to pass around
    cur_action_record: null,
    help_url: gwst.settings.urls.draw_2_help,
    draw_help_url: gwst.settings.urls.draw_help,
    
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
        this.inner_panel.getEl().update(this.getHtmlText());
        Ext.get('draw_extended_header_html').update(this.getHeaderText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2><p>a. <b>At this time</b>, finish drawing all of your <i>'+ this.resource +'</i> '+ this.shape_name_plural +' you '+ this.action +' as a '+ this.user_group +'.</i> Draw them the same way you drew your first.</p> <p>b. Each of the '+this.resource+' '+this.shape_name+'s you draw can be found in the table below. Click any table row to highlight, remove or zoom to that '+ this.shape_name +'.</p> <p>c. Click the \'Continue\' button when you are satisfied with the '+ this.shape_name +'s you\'ve drawn.</p>';
        return html_text;
    },
    
    getHeaderText: function() {
        var header_text = '<h3>Draw '+ this.shape_name_plural + ' - '+ this.resource +'</h3>';
        return header_text;
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
                icon:Ext.MessageBox.QUESTION
            });
        } else if(action == 'shape-zoom') {
            this.fireEvent('draw-two-zoom-shape', record);
        }
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'draw_extended_header_html', html:this.getHeaderText()},
			style: 'padding:5px',
            id: 'draw_extended_header_panel',
			border: false   
        });
    
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
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
			
        //Shape grid panel - for selection, deletion, and zooming
        this.d2_inner_grid_panel = new Ext.grid.GridPanel ({
            store: gwst.settings.shapeStore,
            columns: [{
            	width: 30,
            	sortable: false,
            	renderer: function() {return '<img src="/site-media/images/control_play.png"/>';}
            }, this.grid_actions
            ],
            viewConfig: {
                forceFit: true
            },            
            plugins: this.grid_actions,
            sm: new GeoExt.grid.FeatureSelectionModel({singleSelect:true}),
            stripeRows: true,
            height: 165,
            width: 260,
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
        
        //collapsible instruction panel - content from first draw panel
        this.instruction_panel = new gwst.widgets.DrawInstructionPanel({
            id: 'draw_extended_instruction_panel',
            title: 'How do I draw, again?',
            collapsible: true,
            collapsed: true,
            shape_name: this.shape_name,
            xtype: 'gwst-draw-instruction-panel'
        });
        
        gwst.settings.shapeStore.on('update', this.updateStatus, this);
        gwst.settings.shapeStore.on('remove', this.updateStatus, this);
        
        //navigation buttons (back/continue)
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            back_handler: this.backBtnClicked.createDelegate(this)
        });

        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.instruction_panel);
        this.add(this.d2_inner_grid_panel); 
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
    	this.d2_inner_grid_panel.getView().refresh();
    },
    
    //disable continue button if all shapes are deleted
    updateStatus: function() {
    	if (gwst.settings.shapeStore.getCount() > 0) {
    		this.button_panel.enableCont();    		
    	} else {
    		this.button_panel.disableCont();
    	}
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-two-panel', gwst.widgets.Draw2Panel);