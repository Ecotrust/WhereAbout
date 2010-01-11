Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.Draw2Panel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-two-panel',
	resource: 'unknown',
	user_group: 'unknown',
    shape_name: 'unknown',
    action: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('draw-two-cont');        
        this.addEvents('draw-two-back');        
        this.addEvents('draw-two-instructions');
        
		Ext.apply(this, {
			title: '3. Draw',
			bbar: [
                {
                    text: 'Phase 3 of 5'
                },
				{xtype:'tbfill'},
				{
                    text: '<< Go Back',
                    handler: this.backBtnClicked.createDelegate(this)
                },
				{xtype:'tbseparator'},
                {
                    text: 'Instructions',
                    handler: this.instructionBtnClicked.createDelegate(this)
                },
				{xtype:'tbseparator'},
				{
                    text: 'Continue >>',
                    handler: this.continueBtnClicked.createDelegate(this)
                }
			]
		});
		
        // Call parent (required)
        gwst.widgets.Draw2Panel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p><b>Instructions:</b> \
			Draw your <i>'+ this.resource +'</i> '+ this.shape_name +'s on the map one at a time.<br><br>  \
			<i>Draw only the areas you '+ this.action +' as a '+ this.user_group +'!</i></p><br />';
        return html_text;
    },
    
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'draw_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);

		//Grid button actions
	 	this.grid_actions = new Ext.ux.grid.RowActions({
			 header:'',
			 autoWidth: false,
			 width: 140,
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
			action:function(grid, record, action, row, col) {
				alert('row:'+row+' col:'+col+' action:'+action);
			}
		});
				
        this.inner_grid_panel = new Ext.grid.GridPanel ({
            store: gwst.settings.shapeStore,
            columns: [{
                id:'id',
                header:'Shape #',
                width: 60,
                sortable: true,
                dataIndex:'id'
            },{
                header:'Pennies',
                width: 60,
                sortable: false,
                dataIndex: 'pennies'
            }, this.grid_actions
            ],
            plugins: this.grid_actions,
            sm: new GeoExt.grid.FeatureSelectionModel(),
            stripeRows: true,
            height: 250,
            width: 265,
            title: 'Shapes',
            style: 'margin: 15px',
            stateful: true,
            stateId: 'grid'
        });
        
        this.add(this.inner_grid_panel);        
        
        // Call parent (required)
        gwst.widgets.Draw2Panel.superclass.onRender.apply(this, arguments); 
	},     
	
    continueBtnClicked: function() {
        this.fireEvent('draw-two-cont',this);
    },
    
    instructionBtnClicked: function() {
        this.fireEvent('draw-two-instructions',this);
    },
    
    backBtnClicked: function() {
        this.fireEvent('draw-two-back',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-two-panel', gwst.widgets.Draw2Panel);