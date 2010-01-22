Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.FinishPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'finish-panel',
	res_group_name: 'unknown',
    shape_name: 'unknown',
    user_group: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('select-another');
        this.addEvents('finish-map');
		
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
			<b>Would you like to select a new '+ this.res_group_name +' \
            or have you finished them all for'+ this.user_group+'?</b>\
            </p><br />';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'finish_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.CustomButtons ({
            element_list: [{
                elem: this.selectBtnClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Select '+this.res_group_name+'',
                type: 'text'
            },{
                elem: this.finishBtnClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Finish',
                type: 'text'
            }]
        });
        
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
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