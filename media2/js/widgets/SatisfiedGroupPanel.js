Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SatisfiedGroupPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'satisfied-group-panel',
    resource_name: 'unknown',
	resource_name_plural: 'unknown',
    shape_name: 'unknown',
    action: 'unknown',
    user_group: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('satisfied');
        // this.addEvents('satisfied-no');
		
		Ext.apply(this, {
			title: '5. Finish',
			bbar: [
				{xtype:'tbfill'},
				{
                    text: 'No',
                    handler: this.noClicked.createDelegate(this)
                },
				{xtype:'tbseparator'},
				{
                    text: 'Yes',
                    handler: this.yesClicked.createDelegate(this)
				}
			]
		});
        // Call parent (required)
        gwst.widgets.SatisfiedGroupPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
			<b>Are you satisfied with all '+ this.shape_name +'s you have drawn \
            and all penny values for all '+ this.resource_name_plural +' that you \
            '+ this.action +' as a '+ this.user_group +' ?</b></p><br />\
			\
			<p> \
            Click \'Yes\' to save your '+ this.shape_name +'s and pennies.\
            </p><br />\
            <p>\
			Clicking \'No\' will let you choose which '+ this.resource_name +' to edit.\
			</p><br />\
			';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'satisfied_group_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        // Call parent (required)
        gwst.widgets.SatisfiedGroupPanel.superclass.onRender.apply(this, arguments); 
	},
    
    yesClicked: function() {
        this.fireEvent('satisfied',{satisfied:true});
    },
    
	noClicked: function() {
		this.fireEvent('satisfied',{satisfied:false});
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-satisfied-group-panel', gwst.widgets.SatisfiedGroupPanel);