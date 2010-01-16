Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.InvalidShapePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'invalid-shape-panel',
	resource: 'unknown',
    shape_name: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('okay-btn');
		
        // Call parent (required)
        gwst.widgets.InvalidShapePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="error_text">\
			<b><u>ERROR</u>: Invalid '+ this.shape_name +'</b></p><br />\
			\
			<b> Why?</b> \
			\
			a. No \'bow-tie\' shapes are accepted.\
			a \'bow-tie\' shape is one where the lines cross themselves.  \
			</p><br />\
			\
			<p> \
			b. '+ this.shape_name +' falls outside eligible area, which is\
			ocean and estuaries from Crescent City, California north to Ilwaco.\
			</p><br />\
            \
            <p> \
			c. Your '+ this.shape_name +' overlaps another\
            '+ this.shape_name+' you drew, which isn\'t allowed.\
			</p><br />\
			<p>Press continue to redraw your '+this.shape_name+'.</p>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'invalid_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this)
        });
        
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.InvalidShapePanel.superclass.onRender.apply(this, arguments); 
	},
    
    contBtnClicked: function() {
        this.fireEvent('okay-btn',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-invalid-shape-panel', gwst.widgets.InvalidShapePanel);