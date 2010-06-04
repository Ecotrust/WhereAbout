Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PolyAllocPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'poly-alloc-panel',
	resource: 'unknown',
    shape_name: 'unknown',
    shape_name_plural: 'unknown',
    activity_num: null,
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('poly-alloc-cont');
        this.addEvents('poly-alloc-back');
        		
        // Call parent (required)
        gwst.widgets.PolyAllocPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
        Ext.get('header_alloc_poly').update(this.getHeaderText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2> <p>Now that you have drawn where you participated in <i>'+ this.resource +'</i>, tell us more about how important these areas are to you. Imagine you have <b>100 pennies</b>. You\'re going to allocate those pennies over the '+ this.shape_name_plural +' you just drew. The more pennies you place on a '+ this.shape_name +', the more value or importance it has to you.</p> <img src="/media/img/penny_overview.gif" style="margin-left: 40px"> <p>Look over your '+ this.shape_name_plural +' on the map and think about which are the most important to you. Those are the ones on which you will allocate the most pennies.</p> <p>Click the \'Continue\' button to begin allocating pennies.</p>';
        return html_text;
    },
            
    onRender: function(){
    
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_alloc_poly', html:this.getHeaderText()},
			style: 'padding:5px',
            id: 'poly_alloc_header_panel',
			border: false   
        });
    
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'poly-alloc_inner_panel',
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
        gwst.widgets.PolyAllocPanel.superclass.onRender.apply(this, arguments);     
	},
    
    getHeaderText: function() {
    	return 'Activity #'+this.activity_num+': <span class="activity-text">'+this.resource+'</span>';
    },   
    
    backBtnClicked: function() {
        this.fireEvent('poly-alloc-back',this);
    },
    
    contBtnClicked: function() {
        this.fireEvent('poly-alloc-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-poly-alloc-panel', gwst.widgets.PolyAllocPanel);