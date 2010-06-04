Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.CumulSplashPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'cumul-splash-panel',
	user_group: 'unknown',
    shape_name: 'unknown',
    res_group_name: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.CumulSplashPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        //panel of text
		this.inner_panel = new Ext.Panel({
			html: '<h2>Instructions</h2><p>Based on all the activities you said you\'ve participated in at the coast, we would again like you to indicate where these activities took place using a map and we would also like you indicate how valuable each of these areas are to you.</p><p>Press the \'Continue button.</p>',
			style: 'margin: 10px',
			border: false
        });
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 110,
            left_margin: 50
        });
        
        this.add(this.inner_panel);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.CumulSplashPanel.superclass.onRender.apply(this, arguments);     
	},

    contBtnClicked: function() {
        this.fireEvent('splash-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-cumul-splash-panel', gwst.widgets.CumulSplashPanel);