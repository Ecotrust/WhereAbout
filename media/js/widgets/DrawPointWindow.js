Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawPointWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('draw-point-clicked');
		
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
                cls: 'map-button',
				text: 'Draw New Point',
				iconCls: 'point-icon',
				handler: this.drawPointClicked,
				scope: this,
                height: 30,
                width: 133,
                font: 14
            }]                   
        });
		gwst.widgets.DrawPolyWindow.superclass.initComponent.call(this);		
	},
	
	drawPointClicked: function() {
		this.fireEvent('draw-point-clicked');
	}
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-draw-point-window', gwst.widgets.DrawPointWindow);