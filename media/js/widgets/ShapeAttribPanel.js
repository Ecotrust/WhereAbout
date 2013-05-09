Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ShapeAttribPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'shape-attrib-panel',
    shape_name: 'unknown',
    days_max: 365,
    resource: 'unknown',
    feature: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
        
        this.addEvents('shape-attrib-cont');
        this.addEvents('shape-attrib-back');

        // Call parent (required)
        gwst.widgets.ShapeAttribPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2>';
        return html_text;
    },
    
    onRender: function(){

		this.inner_text_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'shape_attrib_text_panel',
			style: 'margin: 10px',
			border: false
        });
        this.add(this.inner_text_panel);
        
        this.notes_area = new Ext.form.TextArea({
            fieldLabel: 'More Information',
            name: 'note_text',
            autoHeight: false,
            height: 100,
            width: 127
        });
        
        this.days_visited = new Ext.form.NumberField({
            fieldLabel: 'Number of days this site was visited in 2011',
            name: 'days_visited',
            maxValue: this.days_max,
            minValue: 1
        });
        
        this.boundary_n = new Ext.form.TextField({
            fieldLabel: 'North Boundary',
            name: 'boundary_n'
        });
        
        this.boundary_s = new Ext.form.TextField({
            fieldLabel: 'South Boundary',
            name: 'boundary_s'
        });
        
        this.boundary_e = new Ext.form.TextField({
            fieldLabel: 'East Boundary',
            name: 'boundary_e'
        });
        
        this.boundary_w = new Ext.form.TextField({
            fieldLabel: 'West Boundary',
            name: 'boundary_w'
        });

		this.inner_form_panel = new Ext.form.FormPanel({
            id: 'shape_attrib_form_panel',
			style: 'margin: 10px',
			border: false,
            autoScroll: false,
            width: 265,
            url:'save-form.php',
            defaultType: 'textfield',
            keys: [{
                key: [Ext.EventObject.UP, Ext.EventObject.DOWN, Ext.EventObject.LEFT, Ext.EventObject.RIGHT, Ext.EventObject.INSERT, Ext.EventObject.HOME, Ext.EventObject.END, Ext.EventObject.PAGEUP, Ext.EventObject.PAGEDOWN], 
                handler: function(keyCode, event) {
                    event.stopPropagation();
                }
            }],
            items: [
                this.days_visited,
                this.boundary_n,
                this.boundary_e,
                this.boundary_s,
                this.boundary_w,
                this.notes_area 
            ]
		});
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            back_handler: this.backBtnClicked.createDelegate(this)
        });

		this.add(this.inner_form_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.ShapeAttribPanel.superclass.onRender.apply(this, arguments);   

        this.setAutoScroll(false);
        
        this.update();        
	},

    update: function(config) {
        Ext.apply(this, config);
        this.days_visited.applyState({maxValue: this.days_max});
        this.inner_form_panel.getForm().reset();
        if (this.feature != 'unknown' && this.feature != null ) {
            //this.days_visited.setValue(this.feature.days_visited);
            this.days_visited.setValue(this.feature.get('days_visited'))
            this.boundary_n.setValue(this.feature.get('boundary_n'));
            this.boundary_s.setValue(this.feature.get('boundary_s'));
            this.boundary_e.setValue(this.feature.get('boundary_e'));
            this.boundary_w.setValue(this.feature.get('boundary_w'));
            this.notes_area.setValue(this.feature.get('note_text'));
        } else {
            this.days_visited.setRawValue(null);
            this.boundary_n.setRawValue(null);
            this.boundary_e.setRawValue(null);
            this.boundary_s.setRawValue(null);
            this.boundary_w.setRawValue(null);
            this.notes_area.setRawValue(null);
        }
    },

    contBtnClicked: function() {
        this.form_values = this.inner_form_panel.getForm('shape_attrib_form_panel').getValues();
        this.fireEvent('shape-attrib-cont',{ 'values': this.form_values, 'feature': this.feature });
    },
    
    backBtnClicked: function () {
        this.fireEvent('shape-attrib-back');
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-shape-attrib-panel', gwst.widgets.ShapeAttribPanel);