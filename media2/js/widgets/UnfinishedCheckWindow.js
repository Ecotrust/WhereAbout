Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.UnfinishedCheckWindow = Ext.extend(Ext.Window, {
    res_group_name: 'unknown',
    shape_name_plural: 'unknown',
    resource_id: 'unknown',
    cur_resource: 'unknown',
    user_group_desc: 'unknown',

    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	
        // this.addEvents('unfin-cancel');
        this.addEvents('unfin-okay');
        
		Ext.apply(this, {          
        	layout:'fit',
            width:260,
            html: '<p>If you select another '+ this.res_group_name +' now, you will <u><b>lose all of your \
                '+ this.user_group_desc +' '+ this.shape_name_plural +' \
                for '+ this.cur_resource +'</b></u>.\
                <br /><br />\
                Are you sure you want to select another '+ this.res_group_name +'?</p>',
            height:175,
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
		gwst.widgets.UnfinishedCheckWindow.superclass.initComponent.call(this);		
	},
    
    yesBtnClicked: function() {
        this.fireEvent('unfin-okay');
    },
    
    noBtnClicked: function() {
        this.hide();
    }    
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-unfinished-check-window', gwst.widgets.UnfinishedCheckWindow);