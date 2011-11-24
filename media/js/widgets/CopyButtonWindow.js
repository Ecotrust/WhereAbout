Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.CopyButtonWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('copy-button');
		
		Ext.apply(this, {          
            height: 25,
            width: 110,
            layout:'fit',
            html:'loading...',
            closable: false,
            resizable: false,
            tbar: [{
                cls: 'map-button',
				text: 'Copy',
				iconCls: 'copy-button',
				handler: this.copyFeature,
				scope: this,
                height: 50,
                width: 93,
                font: 14
            }]                   
        });
		gwst.widgets.CopyButtonWindow.superclass.initComponent.call(this);		
	},
	
	copyFeature: function() {
		this.fireEvent('copy-button');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-copy-window', gwst.widgets.CopyButtonWindow);