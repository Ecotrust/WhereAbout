Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.QuitWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('quit-button');
		
		Ext.apply(this, {          
            height: 25,
            width:165,
            layout:'fit',
            html:'blort',
            closable: false,
            resizable: false,
            tbar: [{
                cls: 'map-button',
				text: 'Go To Main Menu',
				iconCls: 'quit-main',
				handler: this.goToMain,
				scope: this,
                height: 30,
                width: 148,
                font: 14
            }]                   
        });
		gwst.widgets.QuitWindow.superclass.initComponent.call(this);		
	},
	
	goToMain: function() {
		this.fireEvent('quit-button');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-quit-window', gwst.widgets.QuitWindow);