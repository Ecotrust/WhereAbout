Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.CancelWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('cancel-vector');
		
		Ext.apply(this, {          
            height: 25,
            width: 120,
            layout:'fit',
            html:'blort',
            resizable: false,
            closable: false,
            collapsible: false,
            draggable: false,
            tbar: [{
				text: 'Cancel Drawing',
				iconCls: 'cancel-icon',
				handler: this.cancelShape,
				scope: this
            }]                   
        });
		gwst.widgets.CancelWindow.superclass.initComponent.call(this);		
	},
	
	cancelShape: function() {
		this.fireEvent('cancel-clicked');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-cancel-window', gwst.widgets.CancelWindow);