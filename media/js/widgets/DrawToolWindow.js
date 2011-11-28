Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawToolWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('cancel-res-shape');
		
		Ext.apply(this, {          
            height: 25,
            width: 140,
            layout:'fit',
            html:'blort',
            resizable: false,
            closable: false,
            collapsible: false,
            draggable: false,
            tbar: [{
                cls: 'map-button',
				text: 'Cancel Area',
				iconCls: 'cancel-draw',
				handler: this.cancelShape,
				scope: this,
                height: 30,
                width: 123,
                font: 14
            }]                   
        });
		gwst.widgets.DrawToolWindow.superclass.initComponent.call(this);		
	},
	
	cancelShape: function() {
		this.fireEvent('cancel-res-shape');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-draw-tool-window', gwst.widgets.DrawToolWindow);