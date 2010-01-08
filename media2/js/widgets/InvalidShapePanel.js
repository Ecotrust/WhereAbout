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
		
		Ext.apply(this, {
			title: '3. Draw',
			bbar: [
                {
                    text: 'Phase 3 of 5'
                },
				{xtype:'tbfill'},
				{
                    text: 'Okay',
                    handler: this.okayBtnClicked.createDelegate(this)
                }
			]
		});
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
			<b><u>ERROR</u>: Invalid Shape Drawn!</b></p><br />\
			\
			<b> Why?</b> \
			\
			<p> \
            There are several reasons your shape may be invalid.\
            Please review the below expectations if you are unsure of why your shape isn\'t accepted:\
            </p><br />\
            <p>\
			a. No \'bow-tie\' shapes are accepted.<br />\
			a \'bow-tie\' shape is one where the lines cross themselves.  \
			Take extra care to keep your shapes simple, and focus on tracing the border in a systematic clockwise or counter-clockwise fashion \
            rather than just randomly clicking corners.\
			</p><br />\
			\
			<p> \
			b. Your shape must be at least partially over the water.<br />\
			If your shape overlaps with the shoreline, that is fine, but the shape should represent\
			the water area you use, and not the land you launch from.\
			</p><br />\
			\
			<p> <a href=http://www.google.com>Watch Demonstration</a></p>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'invalid_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        // Call parent (required)
        gwst.widgets.InvalidShapePanel.superclass.onRender.apply(this, arguments); 
	},
    
    okayBtnClicked: function() {
        this.fireEvent('okay-btn',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-invalid-shape-panel', gwst.widgets.InvalidShapePanel);