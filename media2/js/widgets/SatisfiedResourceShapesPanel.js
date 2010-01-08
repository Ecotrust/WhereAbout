Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SatisfiedResourceShapesPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'satisfied-resource-shapes-panel',
    resource: 'unknown',
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
			title: '3. Draw',
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
        gwst.widgets.SatisfiedResourceShapesPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        
        var html_text = '<p class="top_instruct">\
			<b>Are you satisfied with all '+ this.shape_name +'s you have drawn \
            for '+ this.resource +' that you '+ this.action +' as a '+ this.user_group +' ?</b></p><br />\
			\
			<p> \
            Click \'Yes\' to save your '+ this.shape_name +'s and move on to pennies.\
            </p><br />\
            <p>\
			Clicking \'No\' will let you redraw or delete the '+ this.shape_name +'s if you wish\
			</p><br />\
			';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'satisfied_resource_shapes_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        // Call parent (required)
        gwst.widgets.SatisfiedResourceShapesPanel.superclass.onRender.apply(this, arguments); 
	},
    
    yesClicked: function() {
        this.fireEvent('satisfied',{satisfied:true});
    },
    
	noClicked: function() {
		this.fireEvent('satisfied',{satisfied:false});
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-satisfied-resource-shapes-panel', gwst.widgets.SatisfiedResourceShapesPanel);