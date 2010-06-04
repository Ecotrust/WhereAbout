Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.AddMarkerWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('add-marker-clicked');
		
		Ext.apply(this, {          
            height: 25,
            width: 130,
            layout:'fit',
            html:'blort',
            resizable: false,
            closable: false,
            collapsible: false,
            draggable: false,
            tbar: [{
				text: 'Add New Marker',
				iconCls: 'marker-icon',
				handler: this.addClicked,
				scope: this
            }]                   
        });
		gwst.widgets.AddMarkerWindow.superclass.initComponent.call(this);		
	},
	
	addClicked: function() {
		this.fireEvent('add-marker-clicked');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-add-marker-window', gwst.widgets.AddMarkerWindow);