Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.AllocPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'alloc-panel',
	resource: 'unknown',
    shape_name: 'unknown',
    shape_name_plural: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('alloc-cont');
        this.addEvents('alloc-back');
        		
        // Call parent (required)
        gwst.widgets.AllocPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2> <p>Now imagine you have <b>100 pennies</b>. You\'re going to allocate those pennies over the <i>'+ this.resource +'</i> '+ this.shape_name_plural +' you just drew. The more pennies you place on a '+ this.shape_name +', the more value or importance it has to you.</p> <p>Look over your '+this.resource+' '+ this.shape_name_plural +' on the map and think about which are the most important to you. Those are the ones on which you will allocate the most pennies.</p> <p>Click the \'Continue\' button to begin allocating pennies.</p> <img src="/site-media/images/penny_overview.gif" style="margin-left: 40px">';
        return html_text;
    },
            
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
			// html: '<img src="/site-media/images/4a_PennyInstructions_header.png">',
			html: '<h3>Penny Instructions - '+ this.resource +'</h3>',
            id: 'alloc_header_panel',
			border: 'north',
            bodyCfg: {
                cls: 'action-panel-header'
            }
        });
    
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'alloc_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            back_handler: this.backBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.AllocPanel.superclass.onRender.apply(this, arguments);     
	},
    
    backBtnClicked: function() {
        this.fireEvent('alloc-back',this);
    },
    
    contBtnClicked: function() {
        this.fireEvent('alloc-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-alloc-panel', gwst.widgets.AllocPanel);