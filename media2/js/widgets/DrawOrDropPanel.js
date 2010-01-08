Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawOrDropPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-or-drop-panel',
	resource: 'unknown',
    shape_name: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('draw-another');
        this.addEvents('drop-pennies');
		
		Ext.apply(this, {
			title: '3. Draw',
			bbar: [
                {
                    text: 'Phase 3 of 5'
                },
				{xtype:'tbfill'},
				{
                    text: 'Draw Another Shape',
                    handler: this.drawBtnClicked.createDelegate(this)
                },
				{xtype:'tbseparator'},
				{
					text: 'Add Pennies',
                    handler: this.addBtnClicked.createDelegate(this)
				}
			]
		});
        // Call parent (required)
        gwst.widgets.DrawOrDropPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
			<b>Would you like to draw another shape, or are you ready to begin adding pennies?</b></p><br />\
			\
			<p> \
            Click on the \'Draw Another Shape\' button to return to draw mode and make another shape.\
            </p><br />\
            <p>\
			Click on the \'Add Pennies\' button to add penny values to your shapes.\
			</p><br />\
			\
			<p> \
			Note: if you have not drawn any valid shapes and try to add pennies, you will be directed to the species select menu.\
			</p>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'draw_or_drop_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        // Call parent (required)
        gwst.widgets.DrawOrDropPanel.superclass.onRender.apply(this, arguments); 
	},
    
    drawBtnClicked: function() {
        this.fireEvent('draw-another',this);
    },
    
	addBtnClicked: function() {
		this.fireEvent('drop-pennies',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-or-drop-panel', gwst.widgets.DrawOrDropPanel);