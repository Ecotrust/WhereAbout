Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SatisfiedPenniesPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'satisfied-pennies-panel',
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
			title: '4. Allocate Pennies',
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
        gwst.widgets.SatisfiedPenniesPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
			<b>Are you satisfied with all the '+ this.resource +' '+ this.shape_name +'s\
            you have drawn and all of the pennies assigned to them for \
            that you '+ this.action +' as a '+ this.user_group +' ?</b></p><br />\
			\
			<p> \
            Click \'Yes\' to save your '+ this.shape_name +'s and pennies.\
            </p><br />\
            <p>\
			Clicking \'No\' will discard the '+ this.shape_name +'s and let you return to edit penny values.\
			</p><br />\
			';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'satisfied_pennies_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        // Call parent (required)
        gwst.widgets.SatisfiedPenniesPanel.superclass.onRender.apply(this, arguments); 
	},
    
    yesClicked: function() {
        this.fireEvent('satisfied',{satisfied:true});
    },
    
	noClicked: function() {
		this.fireEvent('satisfied',{satisfied:false});
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-satisfied-pennies-panel', gwst.widgets.SatisfiedPenniesPanel);