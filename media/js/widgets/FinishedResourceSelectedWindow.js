Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.FinishedResourceSelectedWindow = Ext.extend(Ext.Window, {
    res_group_name: 'unknown',
    shape_name_plural: 'unknown',
    cur_resource: 'unknown',
    user_group_desc: 'unknown',

    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	
        // this.addEvents('unfin-cancel');
        this.addEvents('edit-finished');
        
		Ext.apply(this, {          
        	layout:'fit',
            width:260,
            // html: this.getHtmlText(),
            height:170,
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
		gwst.widgets.FinishedResourceSelectedWindow.superclass.initComponent.call(this);		
	},
    
    getHtmlText: function() {
        var html_text = '<p>You have already finished this '+ this.res_group_name +'.</p> <p>Would you like to edit your '+ this.user_group_desc +' '+ this.shape_name_plural +' for '+ this.cur_resource +'?</p>';
        return html_text;
    },
    
    updateWindow: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    onRender: function(){
    
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'finResSelWin_inner_panel',
			// style: 'margin: 7px',
			border: false
		});
        
        this.add(this.inner_panel);
        
        gwst.widgets.FinishedResourceSelectedWindow.superclass.onRender.apply(this, arguments); 
        
    },
    
    yesBtnClicked: function() {
        this.fireEvent('edit-finished');
    },
    
    noBtnClicked: function() {
        this.hide();
    }    
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-finished-resource-selected-window', gwst.widgets.FinishedResourceSelectedWindow);