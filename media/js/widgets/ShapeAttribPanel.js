Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ShapeAttribPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'shape-attrib-panel',
    shape_name: 'unknown',
    days_max: 'unknown',
    resource: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
        
        this.addEvents('shape-attrib-cont');

        // Call parent (required)
        gwst.widgets.ShapeAttribPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_text_panel.getEl().update(this.getHtmlText());
        this.inner_form_panel.getForm().reset();
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2><p>Please provide more detailed boundary information for this '+ this.shape_name +'.</p> <p>For example, your North boundary might be the mouth of the Nehalem River and your West boundary 30 fathoms.</p>';
        return html_text;
    },
    
    makeSelect: function() {
            this.prev_site_group = '';
            // if (navigator.appName == "Netscape" && navigator.appVersion.indexOf("Safari") == -1){
            if (Ext.isGecko || Ext.isGecko2 || Ext.isGecko3){
                this.select_action = ' onchange="eval(this.value);" onmouseover="gwst.settings.actualSelection = true;" onmouseout="gwst.settings.actualSelection = false;" ';
            } else {
                gwst.settings.actualSelection = true;
                this.select_action = ' onchange="eval(this.value);" ';
            }
            this.html_text = '<select id="northsouth-select"' + this.select_action + 'style="width: 265px"><option selected disabled>'+gwst.settings.placeComboText+'</option>';
            for (this.i = 0; this.i < gwst.settings.placemarkStore.data.length; this.i++) {
                this.site_group = gwst.settings.placemarkStore.getAt(this.i).get('feature').attributes.site_group;
                if (this.site_group) {
                    if (this.prev_site_group != this.site_group) {
                        this.html_text = this.html_text + '<optgroup label="'+this.site_group+'"></optgroup>';
                        this.prev_site_group = this.site_group;
                    }
                }
                this.html_text = this.html_text + '<option value = "app.draw_manager.shapeAttribPanel.selectPlacemarkSelected(\'' +
                    gwst.settings.placemarkStore.getAt(this.i).id +
                    '\')">' + gwst.settings.placemarkStore.getAt(this.i).data.name +
                    '</option>';
            }
            this.html_text = this.html_text+'</select>';
            return this.html_text;
        },
        
        makeAlphSelect: function() {
            // if (navigator.appName == "Netscape" && navigator.appVersion.indexOf("Safari") == -1){
            if (Ext.isGecko || Ext.isGecko2 || Ext.isGecko3){
                this.select_action = ' onchange="eval(this.value);" onmouseover="gwst.settings.alphActualSelection = true;" onmouseout="gwst.settings.alphActualSelection = false;" ';
            } else {
                gwst.settings.alphActualSelection = true;
                this.select_action = ' onchange="eval(this.value);" ';
            }
            this.html_text = '<select id="alph-select"' + this.select_action + 'style="width: 265px"><option selected disabled>'+gwst.settings.alphPlaceComboText+'</option>';
            for (this.i = 0; this.i < gwst.settings.alphPlacemarkStore.data.length; this.i++) {
                this.site_group = gwst.settings.alphPlacemarkStore.getAt(this.i).get('feature').attributes.site_group;
                this.html_text = this.html_text + '<option value = "app.draw_manager.shapeAttribPanel.selectAlphPlacemarkSelected(\'' +
                    gwst.settings.alphPlacemarkStore.getAt(this.i).id +
                    '\')">' + gwst.settings.alphPlacemarkStore.getAt(this.i).data.name +
                    '</option>';
            }
            this.html_text = this.html_text+'</select>';
            return this.html_text;
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
        
        this.primary_acc_method = new Ext.form.ComboBox({
            id: 'prim-acc-method',
            name: 'primary_acc_method',
            fieldLabel: 'Primary access method to this harvesting location last year (2010) for this species',
            store: [
                'swimming',
                'kayak',
                'Sport boat',
                'charter',
                'paddleboard'
            ],
            emptyText:'Select a method',
            editable: false,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 10px',
			border: false,
            boxMaxWidth: 119,
            width: 120
        });
        
        this.days_visited = new Ext.form.NumberField({
            fieldLabel: 'Number of days this site was visited',
            name: 'days_visited',
            maxValue: this.days_max
        });

        this.select_panel = new Ext.Panel({
            id:'drop-down-panel',
            border: false,
            width: 265,
            style: 'margin: 5px 15px 0px 15px',
            items: [{
        		html:gwst.settings.primaryPtText,
        		border: false,
        		style:'padding: 6px 3px 3px 3px'
        	},{
                html: this.makeSelect(),
                border: false,
                id: 'select-point-ns',
                style: 'margin: 5px auto 5px auto'
        	},{
                html: this.makeAlphSelect(),
                border: false,
                id: 'select-point-alph',
                style: 'margin: 5px auto 5px auto'
            }]        	        
        });   
    
		this.inner_form_panel = new Ext.form.FormPanel({
            id: 'shape_attrib_form_panel',
			style: 'margin: 10px',
			border: false,
            width: 265,
            url:'save-form.php',
            defaultType: 'textfield',
            items: [
            // hidden field to store value of selection from either combo in the form
            {
                fieldLabel: 'Primary Access Point',
                id: 'prim-acc-point',
                name: 'primary_acc_point',
                hidden: true
            },
            this.primary_acc_method,
            this.days_visited,
            {
                // fieldLabel: 'Number of days this site was visited',
                // name: 'days_visited',
                // maxValue
            // },{
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
            },
            this.notes_area 
            ]
		});
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            cont_enabled: false
        });

		this.add(this.select_panel);
		this.add(this.inner_form_panel);
        this.inner_form_panel.hide();
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.ShapeAttribPanel.superclass.onRender.apply(this, arguments);     
	},
    
    selectPlacemarkSelected: function(rec_id) {
        if (gwst.settings.actualSelection) {
            this.inner_form_panel.show();
            Ext.getDom('alph-select').selectedIndex=0;
            this.rec = gwst.settings.placemarkStore.getById(rec_id);
            this.fireEvent('place-selected', this.rec);
            // Ext.getDom('prim-acc-point').value = rec_id;
            this.inner_form_panel.get('prim-acc-point').setValue(this.rec.get('feature').data.pk_uid);
            this.button_panel.enableCont();
        }
	},
    
    selectAlphPlacemarkSelected: function(rec_id) {
        if (gwst.settings.alphActualSelection) {
            this.inner_form_panel.show();
            Ext.getDom('northsouth-select').selectedIndex=0;
            this.rec = gwst.settings.alphPlacemarkStore.getById(rec_id);
            this.fireEvent('place-selected', this.rec);
            // Ext.getDom('prim-acc-point').value = rec_id;
            this.inner_form_panel.get('prim-acc-point').setValue(this.rec.get('feature').data.pk_uid);
            this.button_panel.enableCont();
        }
	},
    
    update: function() {
        this.updateText();
        Ext.getDom('northsouth-select').selectedIndex=0;
        Ext.getDom('alph-select').selectedIndex=0;
        this.inner_form_panel.getForm().reset();
        this.inner_form_panel.hide();
        this.button_panel.disableCont();
    },

    contBtnClicked: function() {
        this.form_values = this.inner_form_panel.getForm('shape_attrib_form_panel').getValues();
        if ( this.form_values.primary_acc_point == '') {
            gwst.error.load('Please select a primary access point for this '+this.shape_name+'.');
        } else if (this.form_values.primary_acc_method == 'Select a method') {
            gwst.error.load('Please select a primary access method for this '+this.shape_name+'.');
        } else if (this.form_values.days_visited == '' || isNaN(this.form_values.days_visited) ) {
            gwst.error.load('Please enter the number of days that you visited this '+this.shape_name+'.');
        } else if (this.form_values.days_visited > this.days_max ) {
            gwst.error.load('The numer of days you visited is greater than number of days you spent targeting '+this.resource+'. Please only count days spent targeting '+this.resource+' at this '+this.shape_name+'.');
        } else {
            this.fireEvent('shape-attrib-cont',this.form_values);
        }
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-shape-attrib-panel', gwst.widgets.ShapeAttribPanel);