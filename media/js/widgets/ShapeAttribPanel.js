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
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2>';
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
                '\', \'ns\')">' + gwst.settings.placemarkStore.getAt(this.i).data.name +
                '</option>';
        }
        this.html_text = this.html_text+'</select>';
        return this.html_text;
    },
        
    makeAlphSelect: function() {
        if (Ext.isGecko || Ext.isGecko2 || Ext.isGecko3){
            this.select_action = ' onchange="eval(this.value);" onmouseover="gwst.settings.actualSelection = true;" onmouseout="gwst.settings.actualSelection = false;" ';
        } else {
            gwst.settings.actualSelection = true;
            this.select_action = ' onchange="eval(this.value);" ';
        }
        this.html_text = '<select id="alph-select"' + this.select_action + 'style="width: 265px"><option selected disabled>'+gwst.settings.alphPlaceComboText+'</option>';
        this.alphPlacemarkStore = gwst.settings.placemarkStore.query('name','');
        this.alphPlacemarkStore.sort('ASC', this.sortByName);
        for (this.i = 0; this.i < this.alphPlacemarkStore.getCount(); this.i++) {
            this.site_group = this.alphPlacemarkStore.itemAt(this.i).get('feature').attributes.site_group;
            this.html_text = this.html_text + '<option value = "app.draw_manager.shapeAttribPanel.selectPlacemarkSelected(\'' +
                this.alphPlacemarkStore.itemAt(this.i).id +
                '\', \'alph\')">' + this.alphPlacemarkStore.itemAt(this.i).data.name +
                '</option>';
        }
        this.html_text = this.html_text+'</select>';
        return this.html_text;
    },
        
    sortByName: function(obj1, obj2) {
        return obj1.get('name')>obj2.get('name');
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
        
        this.other_box = new Ext.form.Checkbox ({
            boxLabel: 'Other',
            name: 'other_factor'
        });
        
        this.check_factors = new Ext.form.CheckboxGroup ({
            id: 'check-factors',
            xtype: 'checkboxgroup',
            fieldLabel: 'Primary factor(s) considered then choosing this site to dive/shore pick for this species in the last year (2010)',
            itemCls: 'x-check-group-alt',
            style: 'margin: 0px 0px 10px 5px',
            columns: 1,
            items: [
                {boxLabel: 'Size of species', name: 'species_size_factor'},
                {boxLabel: 'Abundance of species', name: 'species_abundance_factor'},
                {boxLabel: 'Easy access/entry', name: 'ease_of_access_factor'},
                {boxLabel: 'Close to home', name: 'close_to_home_factor'},
                {boxLabel: 'Close to campground / hotel / vacation rental', name: 'close_to_base_factor'},
                {boxLabel: 'Protected from weather', name: 'weather_protection_factor'},
                {boxLabel: 'Close to facilities/store', name: 'close_to_facilities_factor'},
                {boxLabel: 'Try a new place', name: 'new_place_factor'},
                this.other_box
            ]
        });
        
        this.other_check = new Ext.form.TextField({
            id: 'other-reason',
            fieldLabel: 'If \'other\' please specify',
            style: 'margin: 0px 0px 10px 0px',
            width: '120px',
            maxLength: 150,
            maxLengthText: 'Your entry is too long'
        });
        
        this.other_box.on('check', this.boxChecked, this);

        this.abalone_criteria = new Ext.form.ComboBox({
            id: 'ab-criteria',
            name: 'abalone_criteria',
            fieldLabel: 'In this '+this.shape_name+' do you primarily harvest',
            store: [
                'The first available abalone',
                'Abalone based on size'
            ],
            emptyText:'Select a citeria',
            editable: false,
            listWidth: 150,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 10px',
			border: false,
            width: 120
        });
        
        this.abalone_time = new Ext.form.ComboBox({
            id: 'abalone-time',
            name: 'abalone_time',
            fieldLabel: 'Based on your previously mentioned harvest method, compared to other years, how much time did it take you, on average, to make your daily harvest limit in this '+ this.shape_name,
            store: [
                'Significantly more time',
                'Somewhat more time',
                'The same amount of time',
                'Somewhat less time',
                'Significantly less time',
                'Didn\'t target last year'
            ],
            emptyText:'Select a choice',
            editable: false,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 10px',
			border: false,
            listWidth: 155,
            width: 120
        });
        
        this.abalone_site = new Ext.form.ComboBox({
            id: 'abalone-site',
            name: 'abalone_site',
            fieldLabel: 'Which Abalone Punch Card Site do you visit for this '+ this.shape_name,
            store: gwst.settings.abaloneSiteList,
            emptyText:'Select a site',
            editable: false,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 10px',
            border: false,
            listWidth: 190,
            width: 120
        });
            
        
        this.days_visited = new Ext.form.NumberField({
            fieldLabel: 'Number of days this site was visited in 2010',
            name: 'days_visited',
            maxValue: this.days_max,
            minValue: 1
        });

        this.select_panel = new Ext.Panel({
            id:'drop-down-panel',
            border: false,
            width: 265,
            style: 'margin: 5px 15px 0px 10px',
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
            autoScroll: false,
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
            this.days_visited,
            this.check_factors,
            this.other_check,
            this.primary_acc_method,
            this.abalone_criteria,
            this.abalone_time,
            this.abalone_site,
            {
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
        this.other_check.hide();
        this.inner_form_panel.hide();
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.ShapeAttribPanel.superclass.onRender.apply(this, arguments);   

        this.setAutoScroll(false);
        
	},
    
    selectPlacemarkSelected: function(rec_id, list) {
        if (gwst.settings.actualSelection) {
            this.inner_form_panel.show();
            if (this.resource.indexOf('Dive') == -1) {
                this.primary_acc_method.hide();
            }
            if (this.resource.indexOf('Abalone') == -1) {
                this.abalone_criteria.hide();
                this.abalone_time.hide();
                this.abalone_site.hide();
            }
            if (list == 'ns') {
                Ext.getDom('alph-select').selectedIndex=0;
            } else if (list == 'alph') {
                Ext.getDom('northsouth-select').selectedIndex=0;            
            }
            this.rec = gwst.settings.placemarkStore.getById(rec_id);
            this.fireEvent('place-selected', this.rec);
            this.inner_form_panel.get('prim-acc-point').setValue(this.rec.get('feature').data.pk_uid);
            this.button_panel.enableCont();
        }
	},
    
    boxChecked: function() {
        if (this.check_factors.items.item(8).checked) {
            this.other_check.show();
        } else {
            this.other_check.hide();
        }
    },
    
    update: function(config) {
        Ext.apply(this, config);
        this.days_visited.applyState({maxValue: this.days_max});
        this.inner_form_panel.getForm().reset();
        Ext.getDom('northsouth-select').selectedIndex=0;
        Ext.getDom('alph-select').selectedIndex=0;
        this.inner_form_panel.getForm().reset();
        this.primary_acc_method.show();
        this.abalone_criteria.show();
        this.abalone_time.show();
        this.abalone_site.show();
        this.inner_form_panel.hide();
        this.button_panel.disableCont();
        this.check_factors.reset();
        this.other_check.reset();
    },

    contBtnClicked: function() {
        this.form_values = this.inner_form_panel.getForm('shape_attrib_form_panel').getValues();
        if ( this.form_values.primary_acc_point == '') {
            gwst.error.load('Please select a primary access point for this '+this.shape_name+'.');
        } else if (this.form_values.primary_acc_method == 'Select a method' && this.resource.indexOf('Dive') != -1) {
            gwst.error.load('Please select a primary access method for this '+this.shape_name+'.');
        } else if (this.form_values.abalone_criteria == 'Select a criteria' && this.resource.indexOf('Abalone') != -1) {
            gwst.error.load('Please select a targeting criteria for this '+this.shape_name+'.');
        } else if (this.form_values.abalone_time == 'Select a choice' && this.resource.indexOf('Abalone') != -1) {
            gwst.error.load('Please select a relative time spent choice for this '+this.shape_name+'.');
        } else if (this.form_values.abalone_site == 'Select a site' && this.resource.indexOf('Abalone') != -1) {
            gwst.error.load('Please select a punch card site for this '+this.shape_name+'.');
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