Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawToolWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('cancel-res-shape');
		this.addEvents('redo-res-shape');
		
		Ext.apply(this, {          
            height: 25,
            layout:'fit',
            html:'blort',
            closable: false,
            tbar: [{
				text: 'Cancel Shape',
				iconCls: 'cancel-draw',
				handler: this.cancelShape,
				scope: this
            },{
            	xtype:'tbseparator'
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