Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.AccessQuestionsPanel = Ext.extend(gwst.widgets.GroupQuestionsPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.AccessQuestionsPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    instructions: 'unknown',
    group_name: 'unknown',
    form_url: 'unknown',
    resource: 'unknown',
    hidden_q_id: '',    //The id for the form question that we had to hide on this panel

    makeSelect: function(order) {
        this.prev_site_group = '';
        // if (navigator.appName == "Netscape" && navigator.appVersion.indexOf("Safari") == -1){
        if (Ext.isGecko || Ext.isGecko2 || Ext.isGecko3){
            this.select_action = ' onchange="eval(this.value);" onmouseover="gwst.settings.actualSelection = true;" onmouseout="gwst.settings.actualSelection = false;" ';
        } else {
            gwst.settings.actualSelection = true;
            this.select_action = ' onchange="eval(this.value);" ';
        }
        this.html_text = '<select id="northsouth-select-'+order+'"' + this.select_action + ' class="x-form-field-wrap x-form-field-trigger-wrap" style="width: 269px"><option selected disabled>'+gwst.settings.placeComboText+'</option>';
        for (this.i = 0; this.i < gwst.settings.placemarkStore.data.length; this.i++) {
            this.site_group = gwst.settings.placemarkStore.getAt(this.i).get('feature').attributes.site_group;
            if (this.site_group) {
                if (this.prev_site_group != this.site_group) {
                    this.html_text = this.html_text + '<optgroup label="'+this.site_group+'"></optgroup>';
                    this.prev_site_group = this.site_group;
                }
            }
            this.html_text = this.html_text + '<option value = "app.draw_manager.OldLocationQuestionPanel.selectPlacemarkSelected(\'' +
                gwst.settings.placemarkStore.getAt(this.i).id +
                '\', \'ns\', '+order+', false )">' + gwst.settings.placemarkStore.getAt(this.i).data.name +
                '</option>';
        }
        this.html_text = this.html_text+'</select>';
        return this.html_text;
    },
    
    sortByName: function(obj1, obj2) {
        return obj1.get('name')>obj2.get('name');
    },
    
    buildSelectPanel: function(order){
        this.new_id = 'drop-down-panel'+order;
        this.select_panel = new Ext.Panel({
            id: this.new_id,
            border: false,
            width: 269,
            style: 'margin: 5px 15px 0px 0px',
            items: [{
        		html:'If yes, where did you previously target this species in 2009?',
        		border: false,
        		style:'padding: 6px 3px 3px 3px'
            },
                this.makeNSSelect(order)
            ,{
                html: this.makeSelect(order),
                border: false,
                id: 'select-point-ns',
                style: 'margin: 5px auto 5px auto'
            }]        	        
        });
        
        if (this.resource.indexOf('Abalone') != -1) {
            this.select_panel.add(this.buildAbaloneCombobox(order))
        }
        return this.select_panel;
    },
        
    makeNSSelect: function(order){
        this.new_id = 'ns-select'+order;
        this.nsSelect = new Ext.form.ComboBox({
            id: this.new_id,
            order: order,
            name: 'outside',
            store: [
                'North of the region',
                'South of the region'
            ],
            emptyText:'Outside of the region',
            editable: false,
            listWidth: 269,
            triggerAction: 'all',
            style: 'margin: 0px auto 0px auto',
			border: false,
            width: 269
        });
        
        // this.nsSelect.on('select', this.selectPlacemarkSelected(this.nsSelect.record, 'outside', order));
        this.nsSelect.on('select', this.comboSelect, this, order, 'outside');
        
        return this.nsSelect;
    },
    
    buildAbaloneCombobox: function(order) {
        this.new_id = 'abalone-site'+order;
        this.abalone_site = new Ext.form.ComboBox({
            id: this.new_id,
            order: order,
            name: 'abalone',
            store: gwst.settings.abaloneSiteList,
            emptyText:'Punch card site',
            editable: false,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 0px',
            border: false,
            listWidth: 269,
            width: 269
        });
        
        // this.abalone_site.on('select', this.selectPlacemarkSelected(this.abalone_site.record, 'abalone', order));
        this.abalone_site.on('select', this.comboSelect, this);

        return this.abalone_site;
    },
    
    comboSelect: function(combo, rec, index) {
        // alert( combo.order + ', ' + rec.get('field1') + ', ' + index);
        this.selectPlacemarkSelected(rec, combo.name, combo.order, true);
    },

    onRender: function(){
    
        this.select_panel1 = this.buildSelectPanel(1);
        this.select_panel2 = this.buildSelectPanel(2);
        this.select_panel3 = this.buildSelectPanel(3);

        // // Call parent (required)
        gwst.widgets.AccessQuestionsPanel.superclass.onRender.apply(this, arguments); 
       
        this.add(this.header_panel);
		this.add(this.question_panel);
		this.remove(this.button_panel);
       
        this.question_panel.on('loaded', this.organizeDisplay.createDelegate(this));
        
    },loadQuestionPanel: function(form){
        // this.add(form);
        this.organizeDisplay();
    },
    
    organizeDisplay: function() {
        this.question_panel.hide();
        
        this.question_panel.insert(2,this.select_panel1);  //fit the custom panel into the form panel
        this.question_panel.insert(6,this.select_panel2);  //fit the custom panel into the form panel
        this.question_panel.insert(10,this.select_panel3);  //fit the custom panel into the form panel

        this.question_panel.show();
        this.add(this.button_panel);
        this.hideDuplicates();
        this.doLayout();
    },
    
    // Hide the question that we've replaced with the custom drop-downs, collect it's ID for future use
    hideDuplicates: function() {
        this.hidden_q_id1 = this.question_panel.items.get(1).id;
        this.question_panel.get(this.hidden_q_id1).hide();
        this.hidden_q_id2 = this.question_panel.items.get(5).id;
        this.question_panel.get(this.hidden_q_id2).hide();
        this.hidden_q_id3 = this.question_panel.items.get(9).id;
        this.question_panel.get(this.hidden_q_id3).hide();
    },
    
    selectPlacemarkSelected: function(selected_rec, list, order, combo_selection) {
        if (gwst.settings.actualSelection || combo_selection) {
            if (!combo_selection){
                this.rec = gwst.settings.placemarkStore.getById(selected_rec);
                // this.fireEvent('place-selected', this.rec);
                this.rec_name = this.rec.get('name');
            } else {
                this.rec_name = selected_rec.get('field1');
            }
            switch (order) {
                case 1:
                    this.question_panel.get(this.question_panel.items.get(1).id).setValue(this.rec_name);
                    if (list != 'ns'){
                        Ext.getDom('northsouth-select-1').selectedIndex=0;
                    }
                    if (list != 'outside'){
                        this.select_panel1.items.itemAt(1).clearValue();
                    }
                    if (list != 'abalone' && this.resource.indexOf('Abalone') != -1){
                        this.select_panel1.items.itemAt(3).clearValue();
                    }
                    break;
                case 2:
                    this.question_panel.get(this.question_panel.items.get(5).id).setValue(this.rec_name);
                    if (list != 'ns'){
                        Ext.getDom('northsouth-select-2').selectedIndex=0;
                    }
                    if (list != 'outside'){
                        this.select_panel2.items.itemAt(1).clearValue();
                    }
                    if (list != 'abalone' && this.resource.indexOf('Abalone') != -1){
                        this.select_panel2.items.itemAt(3).clearValue();
                    }
                    break;
                case 3:
                    this.question_panel.get(this.question_panel.items.get(9).id).setValue(this.rec_name);
                    if (list != 'ns'){
                        Ext.getDom('northsouth-select-3').selectedIndex=0;
                    }
                    if (list != 'outside'){
                        this.select_panel3.items.itemAt(1).clearValue();
                    }
                    if (list != 'abalone' && this.resource.indexOf('Abalone') != -1){
                        this.select_panel3.items.itemAt(3).clearValue();
                    }
                    break;
                default:
                    break;
            }
        }
	},
    
    update: function(context) {
        Ext.apply(context);
        Ext.getDom('northsouth-select-primary').selectedIndex=0;
        Ext.getDom('alph-select-primary').selectedIndex=0;
    }
	
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-access-questions-panel', gwst.widgets.AccessQuestionsPanel);