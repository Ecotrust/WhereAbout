Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ShapeAttribPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'shape-attrib-panel',
    shape_name: 'unknown',
    days_max: 365,
    resource: 'unknown',
    
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
        
        // this.days_visiteddays_visited = new Ext.form.NumberField({
            // fieldLabel: 'Number of days this site was visited in 2011',
            // name: 'days_visited',
            // maxValue: this.days_max,
            // minValue: 1
        // });
        
        this.pct_harvested = new Ext.form.NumberField({
            fieldLabel: 'Percent of today\'s catch from this location',
            name: 'pct_catch',
            maxValue: 100,
            minValue: 0
        });

		this.inner_form_panel = new Ext.form.FormPanel({
            id: 'shape_attrib_form_panel',
			style: 'margin: 10px',
			border: false,
            autoScroll: false,
            width: 265,
            url:'save-form.php',
            defaultType: 'textfield',
            items: [
            // this.days_visited,
            this.pct_harvested,
            // {
                // fieldLabel: 'North Boundary',
                // name: 'boundary_n'
            // },{
                // fieldLabel: 'East Boundary',
                // name: 'boundary_e'
            // },{
                // fieldLabel: 'South Boundary',
                // name: 'boundary_s'
            // },{
                // fieldLabel: 'West Boundary',
                // name: 'boundary_w'
            // },
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

        
	},

    update: function(config) {
        Ext.apply(this, config);
        // this.days_visited.applyState({maxValue: this.days_max});
        this.pct_harvested.applyState({maxValue: 100});
        this.inner_form_panel.getForm().reset();
        // this.inner_form_panel.getForm().reset();
    },

    contBtnClicked: function() {
        this.form_values = this.inner_form_panel.getForm('shape_attrib_form_panel').getValues();
        this.fireEvent('shape-attrib-cont',this.form_values);
    },
    
    backBtnClicked: function () {
        this.fireEvent('shape-attrib-back');
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-shape-attrib-panel', gwst.widgets.ShapeAttribPanel);