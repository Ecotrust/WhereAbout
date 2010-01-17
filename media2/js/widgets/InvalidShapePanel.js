Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.InvalidShapePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'invalid-shape-panel',
    shape_name: 'unknown',
    member_title: 'unknown',
    resource: 'unknown',
    status_code: null,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('okay-btn');
		
        // Call parent (required)
        gwst.widgets.InvalidShapePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config, status_code) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="error_text"><b>There was a problem</b> <img src="/site-media/images/exclamation.png"></p><br/>';
        if (this.status_code == 2) {
            html_text += '<p>Your '+this.shape_name+' is not valid because it overlaps itself (example below).</p> <img class="invalid-image" src="/site-media/images/invalid_bowtie.png"><br/>';
        } else if (this.status_code == 3) {
            html_text += '<p>Your '+this.shape_name+' falls completely outside the area of interest which is the Pacific Ocean off the Oregon Coast.  Rivers, estuaries and lakes are excluded from this survey.  <br/><br/>In the example below the '+this.shape_name+' falls within Coos Bay which is not valid.  Outside the mouth of Coos Bay would be.  <img class="invalid-image" src="/site-media/images/invalid_bounds.png"><br/>';
        } else if (this.status_code == 4) {
            html_text += '<p>Your new '+this.shape_name+' overlaps one of your other '+this.resource+' '+this.shape_name+'s.  They are not allowed to do this.  If you have two that border each other, just draw the second one along the edge of the first as best as you can and tell us in your boundary notes that it should border the other.  We will take care of the rest.  <img class="invalid-image" src="/site-media/images/invalid_overlap.png"><br/>';
        }
        html_text += '<br/><p>Click the \'Continue\' button to try again.</p>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'invalid_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this)
        });
        
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.InvalidShapePanel.superclass.onRender.apply(this, arguments); 
	},
    
    contBtnClicked: function() {
        this.fireEvent('okay-btn',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-invalid-shape-panel', gwst.widgets.InvalidShapePanel);