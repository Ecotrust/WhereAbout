Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.AddPolyWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('draw-poly-clicked');
		
		Ext.apply(this, {          
            height: 25,
            width: 122,
            layout:'fit',
            html:'blort',
            resizable: false,
            closable: false,
            collapsible: false,
            draggable: false,
            tbar: [{
				text: 'Draw New Area',
				iconCls: 'poly-icon',
				handler: this.addClicked,
				scope: this
            }]                   
        });
		gwst.widgets.AddPolyWindow.superclass.initComponent.call(this);		
	},
	
	addClicked: function() {
		this.fireEvent('draw-poly-clicked');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-add-poly-window', gwst.widgets.AddPolyWindow);