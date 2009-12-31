Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.FinishPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'finish-panel',
	resource: 'unknown',
    shape_name: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('select-another');
        this.addEvents('finish-map');
		
		Ext.apply(this, {
			title: '5. Finish',
			bbar: [
				{xtype:'tbfill'},
				{
                    text: 'Select Another Species',
                    handler: this.selectBtnClicked.createDelegate(this)
                },
				{xtype:'tbseparator'},
				{
					text: 'Finish',
                    handler: this.finishBtnClicked.createDelegate(this)
				}
			]
		});
        // Call parent (required)
        gwst.widgets.FinishPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
			<b>Would you like to finish with the map tool or draw fishing grounds for another species?</b></p><br />\
			\
			<p> \
            Click on the \'Select Another Species\' button to save your shapes for this species and restart on another.\
            </p><br />\
            <p>\
			Click on the \'Finish\' button to save your shapes and return to the main menu.\
			</p><br />\
			\
			<p> \
			Note:\
			</p>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'finish_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        // Call parent (required)
        gwst.widgets.FinishPanel.superclass.onRender.apply(this, arguments); 
	},
    
    selectBtnClicked: function() {
        this.fireEvent('select-another',this);
    },
    
	finishBtnClicked: function() {
		this.fireEvent('finish-map',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-finish-panel', gwst.widgets.FinishPanel);