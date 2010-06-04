Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.TestPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'test-panel',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.TestPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<p>This is a test</p>';
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
        
        this.add(this.header_panel);
        this.add(this.inner_panel);
    
        // Call parent (required)
        gwst.widgets.TestPanel.superclass.onRender.apply(this, arguments);     
	},

    contBtnClicked: function() {
        this.fireEvent('splash-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-test-panel', gwst.widgets.TestPanel);