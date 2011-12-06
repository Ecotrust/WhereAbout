Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawLineWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('draw-line-clicked');
		
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
				text: 'Draw New Line',
				iconCls: 'line-icon',
				handler: this.drawLineClicked,
				scope: this,
                height: 30,
                width: 133,
                font: 14
            }]                   
        });
		gwst.widgets.DrawPolyWindow.superclass.initComponent.call(this);		
	},
	
	drawLineClicked: function() {
		this.fireEvent('draw-line-clicked');
	}
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-draw-line-window', gwst.widgets.DrawLineWindow);