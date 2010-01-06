Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SplashPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'splash-panel',
	user_group: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

		Ext.apply(this, {
			title: 'Introduction',
			bbar: [
				{xtype:'tbfill'},
				{
                    text: 'Begin >>',
                    handler: this.beginBtnClicked.createDelegate(this)
                }
			]
		});
		
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
			The drawing portion will now begin for the '+ this.user_group +' user group.<br><br>\
            You will have instructions every step of the way on the left hand side of the screen (like this).<br><br>\
            You will also be able to come back and finish later if you need more time.\
			<br />';
        return html_text;
    },

    onRender: function(){
    
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'intro_inner_panel',
			style: 'margin: 10px',
			border: false
        });
        this.add(this.inner_panel);
    
        // Call parent (required)
        gwst.widgets.SplashPanel.superclass.onRender.apply(this, arguments);     
	},

    beginBtnClicked: function() {
        this.fireEvent('splash-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-splash-panel', gwst.widgets.SplashPanel);