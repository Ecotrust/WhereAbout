Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.QuitCheckWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	
        this.addEvents('main-menu');
        // this.addEvents('cancel-quit');

		Ext.apply(this, {          
        	layout:'fit',
            width:250,
            html: '<p><b>Are you sure you want to quit and return to the main menu?</b><br /><br />Your progress will be saved.</p>',
            height:120,
            plain: true,
            bodyStyle: 'padding: 8px',
            closeAction:'hide',
            closable: false,
            modal: true,
            bbar: [
				{xtype:'tbfill'},
				{
                    text: 'Yes',
                    handler: this.yesBtnClicked.createDelegate(this)
                },
                {xtype:'tbseparator'},
                {
                    text: 'No',
                    handler: this.noBtnClicked.createDelegate(this)
                }
			]
        });
		gwst.widgets.QuitCheckWindow.superclass.initComponent.call(this);		
	},
    
    yesBtnClicked: function() {
        this.fireEvent('main-menu');
    },
    
    noBtnClicked: function() {
        this.hide();
    }    
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-quit-check-window', gwst.widgets.QuitCheckWindow);