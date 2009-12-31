Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SatisfiedShapePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'satisfied-shape-panel',
	resource: 'unknown',
    shape_name: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('satisfied-yes');
        this.addEvents('satisfied-no');
		
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
        gwst.widgets.SatisfiedShapePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
			<b>Are you satisfied with this shape?</b></p><br />\
			\
			<p> \
            By saying you are satisfied, the shape will stay where it is on the map.\
            </p><br />\
            <p>\
			If not satisfied, the shape will be discarded.\
			</p><br />\
			\
			<p> \
			You will be able to add more shapes or move on to other steps later.\
			</p>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'satisfied_shape_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        // Call parent (required)
        gwst.widgets.SatisfiedShapePanel.superclass.onRender.apply(this, arguments); 
	},
    
    yesClicked: function() {
        this.fireEvent('satisfied-yes',this);
    },
    
	noClicked: function() {
		this.fireEvent('satisfied-no',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-satisfied-shape-panel', gwst.widgets.SatisfiedShapePanel);