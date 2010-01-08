Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.AllocPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'alloc-panel',
	resource: 'unknown',
    shape_name: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('alloc-cont');
        this.addEvents('alloc-back');
        
		Ext.apply(this, {
			title: '4. Allocate Pennies',
			bbar: [
				{xtype:'tbfill'},
				{
                    text: '<< Go Back',
                    handler: this.backBtnClicked.createDelegate(this)
                },
				{xtype:'tbseparator'},
				{
                    text: 'Continue >>',
                    handler: this.continueBtnClicked.createDelegate(this)
                }
			]
		});
		
        // Call parent (required)
        gwst.widgets.AllocPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p><b>Overview</b><br /> \
			<p>\
			Now imagine you have a bag of <b>100 pennies</b>. You\'re going to \
			distribute those pennies over the <i>'+ this.resource +'</i> '+ this.shape_name +'s \
			you just drew.  The more pennies you place on a '+ this.shape_name +', the more \
			value or importance it has to you.  This information will provide a much \
			more accurate picture of your most important '+ this.shape_name +'s.\
			</p><br />\
			<p> \
            Please take a moment to examine each shape and to mentally map out \
            how many pennies you value each '+ this.shape_name +'.\
            This will make it easier when you actually begin assigning the pennies.\
            </p><br />\
			<p> \
			Click continue to move to the next step.\
			</p><br />\
			<br />\
			<img src="/site-media/images/tux.png" style="width: 50px; height: 50px"><br />';
        return html_text;
    },
            
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'alloc_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        // Call parent (required)
        gwst.widgets.AllocPanel.superclass.onRender.apply(this, arguments);     
	},
    
    backBtnClicked: function() {
        this.fireEvent('alloc-back',this);
    },
    
    continueBtnClicked: function() {
        this.fireEvent('alloc-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-alloc-panel', gwst.widgets.AllocPanel);