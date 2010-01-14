Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SplashPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'splash-panel',
	user_group: 'unknown',
    shape_name: 'unknown',
    res_group_name: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.SplashPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p>\
			<b>Instructions:</b><br />\
            The drawing portion will now begin for the '+ this.user_group +' user group.<br><br>\
            You will be able to come back and finish later if you need more time.\
			<br />';
        return html_text;
    },

    onRender: function(){
        //header image
        this.header_panel = new Ext.Panel({  
			html: '<img src="/site-media/images/0_Introduction_header.png">',
            id: 'intro_header_panel',
			border: false,
            bodyCfg: {
                cls: 'action-panel-header'
            }
        });
        
        //panel of text
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'intro_inner_panel',
			style: 'margin: 10px',
			border: false
        });
        
        //action for the button in the button panel
        var cont = new Ext.Action({
            text: 'Continue >>',
            handler: this.beginBtnClicked.createDelegate(this)
        });
        
        //nice border around button table - will be handled by another class for other panels
        this.button_panel = new Ext.Panel({
            id: 'intro_button_panel',
            style: 'margin: 15px 35px; padding: 5px',
            cls: 'gwst-button-panel',
            layout:'table',
            border: false,
            defaults: {
                bodyStyle:'border: none'
            },
            layoutConfig: {
                columns: 2
            },
            items: [{
                html:'',
                width: 100
            },{
                items: [
                    new Ext.Button(cont)
                ],
                width: 100,
                style: 'padding-left: 10px'
            }
            ]
        });
        
        this.add(this.header_panel);
        this.add(this.inner_panel);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.SplashPanel.superclass.onRender.apply(this, arguments);     
	},

    beginBtnClicked: function() {
        this.fireEvent('splash-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-splash-panel', gwst.widgets.SplashPanel);