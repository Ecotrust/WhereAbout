Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ShapeGridPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'shape-grid-panel',
	resource: 'unknown',
	user_group: 'unknown',
    shape_name: 'unknown',
    action: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('shape-grid-cont');        
        this.addEvents('shape-grid-back');        
        
		Ext.apply(this, {
			title: '3. Draw',
			bbar: [
				{xtype:'tbfill'},
				{
                    text: '<< Go Back',
                    handler: this.backBtnClicked.createDelegate(this)
                },
				{xtype:'tbseparator'},
				{
                    text: 'Continue >>',
                    handler: this.continueBtnClicked.createDelegate(this)
                }
			]
		});
		
        // Call parent (required)
        gwst.widgets.ShapeGridPanel.superclass.initComponent.apply(
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
    
    getData: function() {
        // sample static data for the store
        var shape_array = [1,2,3];
        var data = [
            [shape_array[0],12,'<input type="button" name="del_shape'+ shape_array[0] +'" value="delete" />','<input type="button" name="zoom'+ shape_array[0] +'" value="Zoom" />'],
            [shape_array[1],24,'<input type="button" name="del_shape'+ shape_array[1] +'" value="delete" />','<input type="button" name="zoom'+ shape_array[1] +'" value="Zoom" />'],
            [shape_array[2],58,'<input type="button" name="del_shape'+ shape_array[2] +'" value="delete" />','<input type="button" name="zoom'+ shape_array[2] +'" value="Zoom" />']
        ];
        return data;
    },
    
    getStore: function() {
        var store = new Ext.data.SimpleStore({
            fields: [
                {name: 'shape'},
                {name: 'pennies'},
                {name: 'delete'},
                {name: 'zoom'}
            ]
        });
        store.loadData(this.getData());
        return store;
    
    },
    
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'draw_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        this.inner_grid_panel = new Ext.grid.GridPanel ({
            store: this.getStore(),
            columns: [
                {
                    id:'shape',
                    header:'Shape',
                    width: 60,
                    sortable: true,
                    dataIndex:'shape'
                },
                {
                    header:'Pennies',
                    width: 60,
                    sortable: false,
                    dataIndex: 'pennies'
                },
                {
                    header:'Delete?',
                    width: 60,
                    sortable: false,
                    dataIndex: 'delete'
                },
                {
                    header:'Zoom in',
                    width: 60,
                    sortable: false,
                    dataIndex: 'zoom'
                }
            ],
            stripeRows: true,
            // autoExpandColumn: 'shape',
            height: 350,
            width: 244,
            title: 'Shapes',
            margin: 30,
            stateful: true,
            stateId: 'grid'
        });
        //grid.render('shape-grid');
        this.add(this.inner_grid_panel);
        
        
        // Call parent (required)
        gwst.widgets.ShapeGridPanel.superclass.onRender.apply(this, arguments); 
	},
    
    continueBtnClicked: function() {
        this.fireEvent('shape-grid-cont',this);
    },
    
    backBtnClicked: function() {
        this.fireEvent('shape-grid-back',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-shape-grid-panel', gwst.widgets.ShapeGridPanel);