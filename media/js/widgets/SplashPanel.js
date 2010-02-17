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
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<p>\
            The drawing portion will now begin for the '+ this.user_group +' user group.</p>\
            <p>You will be able to come back and finish later if you need more time.</p>\
			<p>To do so, click the \'Go To Main Menu\' button at the top left of the map screen.</p>\
            <img src="/site-media/images/go_to.png" style="margin-left: 65px">';
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
			html: this.getHtmlText(),
            id: 'intro_inner_panel',
			style: 'margin: 10px',
			border: false
        });
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
        this.add(this.inner_panel);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.SplashPanel.superclass.onRender.apply(this, arguments);     
	},

    contBtnClicked: function() {
        this.fireEvent('splash-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-splash-panel', gwst.widgets.SplashPanel);