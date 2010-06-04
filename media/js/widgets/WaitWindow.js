Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.WaitWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){			
		Ext.apply(this, {          
            title: 'Please Wait',
        	layout:'fit',
            width:250,
            html: {tag: 'div', id: 'msg_panel', html: 'Crock'},  //Ext.DomHelper object
            height:75,
            plain: true,
            bodyStyle: 'padding: 8px; font-weight: bold',
            closeAction:'hide',
            closable: false,
            modal: true
        });
		gwst.widgets.WaitWindow.superclass.initComponent.call(this);		
	},
    
    showMsg: function(msg) {
        this.show();
        Ext.get('msg_panel').update(msg);
    }
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-wait-window', gwst.widgets.WaitWindow);