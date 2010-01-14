Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ShapeAttribPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'shape-attrib-panel',
    shape_name: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        // Call parent (required)
        gwst.widgets.ShapeAttribPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_text_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p><b>Overview</b><br /> \
			<p>\
			Please feel free to add any more information that will help us identify your precise '+ this.shape_name +'.\
			<br />';
        return html_text;
    },
            
    onRender: function(){
    
		this.inner_text_panel = new Ext.Panel({
			html: this.getText(),
            id: 'shape_attrib_text_panel',
			style: 'margin: 10px',
			border: false
        });
        this.add(this.inner_text_panel);
    
		this.inner_form_panel = new Ext.form.FormPanel({
            id: 'shape_attrib_form_panel',
			style: 'margin: 10px',
			border: false,
            url:'save-form.php',
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'North Boundary',
                name: 'n_bound'
            },{
                fieldLabel: 'East Boundary',
                name: 'e_bound'
            },{
                fieldLabel: 'South Boundary',
                name: 's_bound'
            },{
                fieldLabel: 'West Boundary',
                name: 'w_bound'
            }]
		});
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this)
        });

		this.add(this.inner_form_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.ShapeAttribPanel.superclass.onRender.apply(this, arguments);     
	},

    contBtnClicked: function() {
        this.fireEvent('shape-attrib-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-shape-attrib-panel', gwst.widgets.ShapeAttribPanel);