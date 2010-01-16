Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawOrDropPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-or-drop-panel',
	resource: 'unknown',
    res_group_name: 'unknown',
    shape_name: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('draw-another');
        this.addEvents('drop-pennies');
		
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
			<b>Would you like to draw another '+ this.shape_name +', or are you \
            done with this '+this.res_group_name +' and ready to allocate pennies?</b>\
            </p><br />';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'draw_or_drop_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.CustomButtons ({
            element_list: [{
                elem: this.drawBtnClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Draw Another',
                type: 'text'
            },{
                elem: '<p>Return to draw mode and make another '+ this.shape_name +'.</p>',
                type: 'text'
            },{
                elem: this.addBtnClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Allocate Pennies',
                type: 'text'
            },{
                elem: '<p>Add penny values to your '+ this.shape_name +'s.</p>',
                type: 'text'
            }]
        });
        
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
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