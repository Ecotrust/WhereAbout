Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawPolyWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('draw-poly-clicked');
		
		Ext.apply(this, {          
            height: 25,
            width: 149,
            layout:'fit',
            html:'blort',
            resizable: false,
            closable: false,
            collapsible: false,
            draggable: false,
            tbar: [{
				text: 'Draw New Area',
				iconCls: 'poly-icon',
				handler: this.drawClicked,
				scope: this
            }]                   
        });
		gwst.widgets.DrawPolyWindow.superclass.initComponent.call(this);		
	},
	
	drawClicked: function() {
		this.fireEvent('draw-poly-clicked');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-draw-poly-window', gwst.widgets.DrawPolyWindow);