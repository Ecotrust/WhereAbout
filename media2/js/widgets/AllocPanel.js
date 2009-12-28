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
	
    onRender: function(){
        // Call parent (required)
        gwst.widgets.AllocPanel.superclass.onRender.apply(this, arguments); 
        var html_text = '<p><b>Overview</b><br /> \
			<p>\
			Now imagine you have a bag of <b>100 pennies</b>.  You\'re going to \
			distribute those pennies over the <i>'+ this.resource +'</i> '+ this.shape_name +'s \
			you just drew.  The more pennies you place on a '+ this.shape_name +', the more \
			value or importance it has to you.  This information will provide a much \
			more accurate picture of your most important '+ this.shape_name +'s.\
			</p><br />\
			<p> \
			Click continue to move to the next step.\
			</p><br />\
			<br />\
			<img src="/site-media/images/tux.png" style="width: 50px; height: 50px"><br />';
		var inner_panel = {
			html: html_text,
			style: 'margin: 10px',
			border: false
		};
		this.add(inner_panel);
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