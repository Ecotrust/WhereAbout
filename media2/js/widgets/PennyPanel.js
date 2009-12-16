Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PennyPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'penny-panel',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

		Ext.apply(this, {
			title: '4. Allocate Pennies',
			bbar: [
				{xtype:'tbfill'},
				{text: '<< Go Back'},
				{xtype:'tbseparator'},
				{text: 'Continue >>'}
			]
		});
		
        // Call parent (required)
        gwst.widgets.PennyPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    onRender: function(){
        // Call parent (required)
        gwst.widgets.PennyPanel.superclass.onRender.apply(this, arguments); 
        var html_text = '<p>\
			<b>Instructions</b><br />\
			<p>\
			a. Your first <i>'+ this.resource +'</i> fishing ground is now loaded. \
			Enter a penny value for it below in the white box. \
			Then click the right arrow (>>) to move to your next fishing ground. \
			</p><br />\
			<p> \
			b. Keep entering penny values.  Every fishing ground must have at least 1 penny\
			and you must yest all 100 pennies.\
			</p><br />\
			<p>\
			c. Click the \'Continue\' button when you are done.\
			</p><br />\
			<p> <a href=http://www.google.com>View Demonstration</a></p>\
			<br />';
		var nav_text = '<p>\
			<b>Current Fishing Ground: #'+ this.cur_num +' of '+ this.total_num +'</b>\
			</p>\
			<input type="button" name="prev_shape" value="<<" /> \
			Pennies (<font color="red">'+ this.pennies_remaining +' left</font>):\
			<input type="text" size="3" maxlength="3" />  \
			<input type="button" name="next_shape" value=">>" /> \
			<br /><br />\
			<b>Status</b>';
		var shape_text = '\
			\
			';//gwst_usershape: Shape# = select rownum(*) from gwst_usershape where user_id, int_group_id, AND resource_id
				//Pennies = select pennies from gwst_usershape where user_id, int_group_id, AND resource_id
		var inner_panel = {
			html: html_text,
			style: 'margin: 10px',
			border: false
		};
		var nav_panel = {
			html: nav_text,
			border: false,
			style: 'margin: 10px'
		};
		var shape_data = [
			[1, 25],
			[2, 10],
			[3, 20],
			[4, ],
			[5, ]
		];
		var shape_reader = new Ext.data.ArrayReader({}, [
			{name: 'shape', type: 'int'},
			{name: 'pennies', type: 'int'}
		]);
		var shape_grid = new Ext.grid.GridPanel({
			store: new Ext.data.Store({
				data: shape_data,
				reader: shape_reader
			}),
			columns: [
				{header: 'Shape #', width: 140, sortable: false, dataIndex: 'shape'},
				{header: 'Pennies', width: 140, sortable: false, dataIndex: 'pennies'}
			],
			viewConfig: {
				forceFit: false
			},
			width: 280,
			autoHeight: true,
			frame: false,
			style: 'margin-left: 10px; margin-bottom: 10px',
			border: false
		});
		this.add(inner_panel);
		this.add(nav_panel);
		this.add(shape_grid);
	}
});
 
// register xtype to allow for lazy initialization
Ext.reg('penny-panel', gwst.widgets.PennyPanel);