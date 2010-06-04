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

    onRender: function(){
        //panel of text
		this.inner_panel = new Ext.Panel({
			html: '<h2>Instructions</h2><p>Based on the activities you participated in during your last visit to the coast, we would like you to indicate where these activities took place using a map.</p><p>Press the \'Continue button.</p>',
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
        gwst.widgets.SplashPanel.superclass.onRender.apply(this, arguments);     
	},

    contBtnClicked: function() {
        this.fireEvent('splash-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-splash-panel', gwst.widgets.SplashPanel);