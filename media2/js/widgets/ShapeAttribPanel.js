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
        this.inner_form_panel.getForm().reset();
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
            <b>Instructions</b>\
			Optionally, please provide more detailed boundary information for this '+ this.shape_name +'.\
            You may leave this section blank and just press \'Continue\'.</p><br />\
            \
            <p>For example, your North boundary might be the mouth of the Nehalem River and your West boundary 30 fathoms.\
			</p><br />';
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
                name: 'boundary_n'
            },{
                fieldLabel: 'East Boundary',
                name: 'boundary_e'
            },{
                fieldLabel: 'South Boundary',
                name: 'boundary_s'
            },{
                fieldLabel: 'West Boundary',
                name: 'boundary_w'
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
        this.fireEvent('shape-attrib-cont',this.inner_form_panel.getForm('shape_attrib_form_panel').getValues());
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-shape-attrib-panel', gwst.widgets.ShapeAttribPanel);