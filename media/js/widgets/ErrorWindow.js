Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ErrorWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		Ext.apply(this, {          
            title: 'Error',
        	layout:'fit',
            width:250,
            html: {tag: 'div', id: 'err_msg_panel', html: 'Error'},  //Ext.DomHelper object
            height:100,
            plain: true,
            bodyStyle: 'padding: 8px; font-weight: bold',
            closeAction:'hide',
            closable: false,
            modal: true,
            bbar: [
				{xtype:'tbfill'},
				{
                    text: 'OK',
                    handler: this.okBtnClicked.createDelegate(this)
                }
			]
        });
		gwst.widgets.ErrorWindow.superclass.initComponent.call(this);		
	},
    
    okBtnClicked: function() {
        this.hide();
    },
    
    load: function(msg) {
        this.show();
        Ext.get('err_msg_panel').update(msg);
    }
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-error-window', gwst.widgets.ErrorWindow);