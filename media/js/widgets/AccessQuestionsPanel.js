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
    resource_id: '',
    hidden_q_id: '',    //The id for the form question that we had to hide on this panel

    makeSelect: function(order) {
        this.prev_site_group = '';
        if (Ext.isGecko || Ext.isGecko2 || Ext.isGecko3){   //if browser is Firefox...
            this.select_action = ' onchange="eval(this.value);" onmouseover="gwst.settings.actualSelection = true;" onmouseout="gwst.settings.actualSelection = false;" ';
        } else {
            gwst.settings.actualSelection = true;
            this.select_action = ' onchange="eval(this.value);" ';
        }
        this.html_text = '<select id="northsouth-select-'+order+'"' + this.select_action + ' class="x-form-field-wrap x-form-field-trigger-wrap" style="width: 237px"><option selected disabled>'+gwst.settings.placeComboText+'</option>';
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
    
    fill_question_panel: function() {
        var a = new Ext.ux.DjangoForm({
            url:this.form_url, 
            callback:this.loadQuestionPanel.createDelegate(this),
            showButtons: false,
            autoDestroy: false
        });
        return a;
    },
    
    buildSelectPanel: function(order, outside_box, abalone_text, abalone_box){
        this.select_panel = new Ext.Panel({
            id: 'drop-down-panel'+order,
            border: false,
            width: 250,
            style: 'margin: 5px 15px 5px 0px',
            items: [{
        		html:'Where did you previously target this species in 2009?',
        		border: false,
        		style:'padding: 6px 3px 3px 3px'
            },
            outside_box,
            {
                html: this.makeSelect(order),
                border: false,
                id: 'select-point-ns'+order,
                style: 'margin: 5px auto 5px auto'
            },
            abalone_text,
            abalone_box
            ]        	        
        });

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
            emptyText:'If outside of the region',
            editable: false,
            listWidth: 269,
            triggerAction: 'all',
            style: 'margin: 0px auto 0px auto',
			border: false,
            width: 237
        });
        
        this.nsSelect.on('select', this.comboSelect, this);
        
        return this.nsSelect;
    },

    buildAbaloneText: function(order) {
        this.abalone_text = new Ext.Panel({
            id: 'abalone-text-'+order,
            border: false,
            html: 'Which Abalone Punch Card Site did you use?'
        });
        
        return this.abalone_text;
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
            style: 'margin: 0px 0px 0px 0px',
            border: false,
            listWidth: 269,
            width: 237
        });
        
        this.abalone_site.on('select', this.punchSelect, this);

        return this.abalone_site;
    },
    
    comboSelect: function(combo, rec, index) {
        this.selectPlacemarkSelected(rec, combo.name, combo.order, true);
    },
    
    punchSelect: function(combo, rec, index) {
        this.abalonePunchSiteSelected(rec, combo.name, combo.order, true);
    },
    
    buildFacade: function() {
        this.facade = new Ext.FormPanel({
            frame: true,
            title: '2009 Questions',
            style:'padding:5px 5px 5px 0; margin:5px auto 10px auto',
            autoDestroy: false,
            width: 281,
            items: [{
                    xtype: 'fieldset',
                    id: 'facade_block_1',
                    checkboxToggle: true,
                    title: 'In 2009, did you target this species in <br />locations you did not return to in 2010?',
                    autoHeight: true,
                    width: 260,
                    defaultType: 'textfield',
                    collapsed: true,
                    items: [
                        this.select_panel1,
                        new Ext.form.ComboBox({
                            id: 'reason_combo_1',
                            name: 'reason_combo_1',
                            emptyText: 'Select a reason',
                            fieldLabel: ' Why did you not return to this location in 2010 to target this species?',
                            editable: false,
                            triggerAction: 'all',
                            border: false,
                            listWidth: 250,
                            width: 132,
                            store: [
                                'Change in size of species',
                                'Change in abundance of species',
                                'More people around',
                                'Area closed as marine protected area',
                                'Loss of coastal access',
                                'Wanted to check out new/other locations',
                                'Other'
                            ]
                        }),{
                            fieldLabel: 'If \'other\', please specify',
                            name: 'other-1'
                        }
                    ]
                },{
                    xtype: 'fieldset',
                    id: 'facade_block_2',
                    checkboxToggle: true,
                    title: 'Any other sites?',
                    autoHeight: true,
                    width: 260,
                    defaultType: 'textfield',
                    collapsed: true,
                    items:[
                        this.select_panel2,
                        new Ext.form.ComboBox({
                            id: 'reason_combo_2',
                            name: 'reason_combo_2',
                            emptyText: 'Select a reason',
                            fieldLabel: ' Why did you not return to this location in 2010 to target this species?',
                            editable: false,
                            triggerAction: 'all',
                            border: false,
                            listWidth: 250,
                            width: 132,
                            store: [
                                'Change in size of species',
                                'Change in abundance of species',
                                'More people around',
                                'Area closed as marine protected area',
                                'Loss of coastal access',
                                'Wanted to check out new/other locations',
                                'Other'
                            ]
                        }),{
                            fieldLabel: 'If \'other\', please specify',
                            name: 'other-2'
                        }
                    ]
                },{
                    xtype: 'fieldset',
                    id: 'facade_block_3',
                    checkboxToggle: true,
                    title: 'Any other sites?',
                    autoHeight: true,
                    width: 260,
                    defaultType: 'textfield',
                    collapsed: true,
                    items:[
                        this.select_panel3,
                        new Ext.form.ComboBox({
                            id: 'reason_combo_3',
                            name: 'reason_combo_3',
                            emptyText: 'Select a reason',
                            fieldLabel: ' Why did you not return to this location in 2010 to target this species?',
                            editable: false,
                            triggerAction: 'all',
                            border: false,
                            listWidth: 250,
                            width: 132,
                            store: [
                                'Change in size of species',
                                'Change in abundance of species',
                                'More people around',
                                'Area closed as marine protected area',
                                'Loss of coastal access',
                                'Wanted to check out new/other locations',
                                'Other'
                            ]
                        }),{
                            fieldLabel: 'If \'other\', please specify',
                            name: 'other-3'
                        }
                    ]
                }
            ]
        });
        return this.facade;
    },
    
    getReasonUuid: function(index) {
        switch (index) {
            case 0: 
                return "4eb1b170-12df-11e0-9804-0016760580f0";
                break;
            case 1:
                return "652fbff0-12df-11e0-bac9-0016760580f0";
                break;
            case 2:
                return "6cf1d570-12df-11e0-a378-0016760580f0";
                break;
            case 3:
                return "7b0de4f0-12df-11e0-9bf9-0016760580f0";
                break;
            case 4:
                return "832a9d8f-12df-11e0-8278-0016760580f0";
                break;
            case 5:
                return "8c48c0a1-12df-11e0-af6d-0016760580f0";
                break;
            case 6:
                return "a35f659e-12df-11e0-aa68-0016760580f0";
                break;
            default:
                return '';
                break;
        }
    },

    setReasonName: function(combo, uuid) {
        switch (uuid) {
            case "4eb1b170-12df-11e0-9804-0016760580f0": 
                combo.setValue('Change in size of species');
                break;
            case "652fbff0-12df-11e0-bac9-0016760580f0":
                combo.setValue('Change in abundance of species')
                break;
            case "6cf1d570-12df-11e0-a378-0016760580f0":
                combo.setValue('More people around');
                break;
            case "7b0de4f0-12df-11e0-9bf9-0016760580f0":
                combo.setValue('Area closed as marine protected area');
                break;
            case "832a9d8f-12df-11e0-8278-0016760580f0":
                combo.setValue('Loss of coastal access');
                break;
            case "8c48c0a1-12df-11e0-af6d-0016760580f0":
                combo.setValue('Wanted to check out new/other locations');
                break;
            case "a35f659e-12df-11e0-aa68-0016760580f0":
                combo.setValue('Other');
                break;
            default:
                combo.clearValue();
                break;
        }
    },
    
    fillForm: function() {
        if (!this.facade_question_panel.get('facade_block_1').collapsed || !this.facade_question_panel.get('facade_block_2').collapsed || !this.facade_question_panel.get('facade_block_3').collapsed) {
            this.question_panel.items.itemAt(0).setValue("a28");
        } else {
            this.question_panel.items.itemAt(0).setValue("a29");
        }
        if (!this.facade_question_panel.get('facade_block_1').collapsed) {
            this.question_panel.form.items.itemAt(3).setValue(this.getReasonUuid(this.facade_question_panel.form.items.itemAt(2).selectedIndex));
            this.question_panel.form.items.itemAt(4).setValue(this.facade_question_panel.form.items.itemAt(3).getValue());
        } else {
            this.question_panel.form.items.itemAt(1).setValue('');
            this.question_panel.form.items.itemAt(2).setValue('');
            this.question_panel.form.items.itemAt(3).clearValue();
            this.question_panel.form.items.itemAt(4).setValue('');
        }
        if (!this.facade_question_panel.get('facade_block_2').collapsed) {
            this.question_panel.form.items.itemAt(7).setValue(this.getReasonUuid(this.facade_question_panel.form.items.itemAt(6).selectedIndex));
            this.question_panel.form.items.itemAt(8).setValue(this.facade_question_panel.form.items.itemAt(7).getValue());
        } else {
            this.question_panel.form.items.itemAt(5).setValue('');
            this.question_panel.form.items.itemAt(6).setValue('');
            this.question_panel.form.items.itemAt(7).clearValue();
            this.question_panel.form.items.itemAt(8).setValue('');
        }
        if (!this.facade_question_panel.get('facade_block_3').collapsed) {
            this.question_panel.form.items.itemAt(11).setValue(this.getReasonUuid(this.facade_question_panel.form.items.itemAt(10).selectedIndex));
            this.question_panel.form.items.itemAt(12).setValue(this.facade_question_panel.form.items.itemAt(11).getValue());
        } else {
            this.question_panel.form.items.itemAt(9).setValue('');
            this.question_panel.form.items.itemAt(10).setValue('');
            this.question_panel.form.items.itemAt(11).clearValue();
            this.question_panel.form.items.itemAt(12).setValue('');
        }
    },
    
    fillFacade: function() {
        if (this.question_panel.form.items.itemAt(1).getValue() != '') {
            this.facade_question_panel.form.items.itemAt(0).setValue(this.question_panel.form.items.itemAt(1).getValue());
            if(Ext.getDom('northsouth-select-1')){
                Ext.getDom('northsouth-select-1').selectedIndex=0;
            }
            this.facade_question_panel.form.items.itemAt(1).setValue(this.question_panel.form.items.itemAt(2).getValue());
            this.setReasonName(this.facade_question_panel.form.items.itemAt(2), this.question_panel.form.items.itemAt(3).getValue())
            this.facade_question_panel.form.items.itemAt(3).setValue(this.question_panel.form.items.itemAt(4).getValue());
            if (this.facade_question_panel.items.itemAt(0).collapsed) {
                this.facade_question_panel.items.itemAt(0).toggleCollapse();
            }
        } else {
            this.facade_question_panel.form.items.itemAt(0).clearValue();
            if(Ext.getDom('northsouth-select-1')){
                Ext.getDom('northsouth-select-1').selectedIndex=0;
            }
            this.facade_question_panel.form.items.itemAt(1).clearValue();
            this.facade_question_panel.form.items.itemAt(2).clearValue();
            this.facade_question_panel.form.items.itemAt(3).setValue('');
            if (!this.facade_question_panel.items.itemAt(0).collapsed) {
                this.facade_question_panel.items.itemAt(0).toggleCollapse();
            }
        }
        if (this.question_panel.form.items.itemAt(5).getValue() != '') {
            this.facade_question_panel.form.items.itemAt(4).setValue(this.question_panel.form.items.itemAt(5).getValue());
            if(Ext.getDom('northsouth-select-2')){
                Ext.getDom('northsouth-select-2').selectedIndex=0;
            }
            this.facade_question_panel.form.items.itemAt(5).setValue(this.question_panel.form.items.itemAt(6).getValue());
            this.setReasonName(this.facade_question_panel.form.items.itemAt(6), this.question_panel.form.items.itemAt(7).getValue())
            this.facade_question_panel.form.items.itemAt(7).setValue(this.question_panel.form.items.itemAt(8).getValue());
            if (this.facade_question_panel.items.itemAt(1).collapsed) {
                this.facade_question_panel.items.itemAt(1).toggleCollapse();
            }
        } else {
            this.facade_question_panel.form.items.itemAt(4).clearValue();
            if(Ext.getDom('northsouth-select-2')){
                Ext.getDom('northsouth-select-2').selectedIndex=0;
            }
            this.facade_question_panel.form.items.itemAt(5).clearValue();
            this.facade_question_panel.form.items.itemAt(6).clearValue();
            this.facade_question_panel.form.items.itemAt(7).setValue('');
            if (!this.facade_question_panel.items.itemAt(1).collapsed) {
                this.facade_question_panel.items.itemAt(1).toggleCollapse();
            }
        }
        if (this.question_panel.form.items.itemAt(9).getValue() != '') {
            this.facade_question_panel.form.items.itemAt(8).setValue(this.question_panel.form.items.itemAt(9).getValue());
            if(Ext.getDom('northsouth-select-3')){
                Ext.getDom('northsouth-select-3').selectedIndex=0;
            }
            this.facade_question_panel.form.items.itemAt(9).setValue(this.question_panel.form.items.itemAt(10).getValue());
            this.setReasonName(this.facade_question_panel.form.items.itemAt(10), this.question_panel.form.items.itemAt(11).getValue())
            this.facade_question_panel.form.items.itemAt(11).setValue(this.question_panel.form.items.itemAt(12).getValue());
            if (this.facade_question_panel.items.itemAt(2).collapsed) {
                this.facade_question_panel.items.itemAt(2).toggleCollapse();
            }
        } else {
            this.facade_question_panel.form.items.itemAt(8).clearValue();
            if(Ext.getDom('northsouth-select-3')){
                Ext.getDom('northsouth-select-3').selectedIndex=0;
            }
            this.facade_question_panel.form.items.itemAt(9).clearValue();
            this.facade_question_panel.form.items.itemAt(10).clearValue();
            this.facade_question_panel.form.items.itemAt(11).setValue('');
            if (!this.facade_question_panel.items.itemAt(2).collapsed) {
                this.facade_question_panel.items.itemAt(2).toggleCollapse();
            }
        }
        if (this.resource.indexOf('Abalone') != -1) {
            this.abalone_text1.show();
            this.abalone_box1.show();
            this.abalone_text2.show();
            this.abalone_box2.show();
            this.abalone_text3.show();
            this.abalone_box3.show();
        } else {
            this.abalone_text1.hide();
            this.abalone_box1.hide();
            this.abalone_text2.hide();
            this.abalone_box2.hide();
            this.abalone_text3.hide();
            this.abalone_box3.hide();
        }
    },

    getHeaderText: function() {
        return '<h3>' + this.group_name + ' Questions - ' + this.resource + '</h3>';
    },

    onRender: function(){
        this.outside_box1 = this.makeNSSelect(1);
        this.abalone_text1 = this.buildAbaloneText(1);
        this.abalone_box1 = this.buildAbaloneCombobox(1);
        this.select_panel1 = this.buildSelectPanel(1, this.outside_box1, this.abalone_text1, this.abalone_box1);
        this.outside_box2 = this.makeNSSelect(2);
        this.abalone_text2 = this.buildAbaloneText(2);
        this.abalone_box2 = this.buildAbaloneCombobox(2);
        this.select_panel2 = this.buildSelectPanel(2, this.outside_box2, this.abalone_text2, this.abalone_box2);
        this.outside_box3 = this.makeNSSelect(3);
        this.abalone_text3 = this.buildAbaloneText(3);
        this.abalone_box3 = this.buildAbaloneCombobox(3);
        this.select_panel3 = this.buildSelectPanel(3, this.outside_box3, this.abalone_text3, this.abalone_box3);

        // Call parent (required)
        gwst.widgets.AccessQuestionsPanel.superclass.onRender.apply(this, arguments); 
        
        this.remove(this.header_panel);
		this.add(this.question_panel);
        this.add(this.header_panel);
        this.facade_question_panel = this.buildFacade();        
        this.add(this.facade_question_panel)
        this.add(this.button_panel);
    },
    
    loadQuestionPanel: function(form){
        this.organizeDisplay();
    },

    organizeDisplay: function() {
        this.question_panel.hide();
        this.fillFacade();
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
                    break;
                case 2:
                    this.question_panel.get(this.question_panel.items.get(5).id).setValue(this.rec_name);
                    if (list != 'ns'){
                        Ext.getDom('northsouth-select-2').selectedIndex=0;
                    }
                    if (list != 'outside'){
                        this.select_panel2.items.itemAt(1).clearValue();
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
                    break;
                default:
                    break;
            }
        }
	},
    
    abalonePunchSiteSelected: function(selected_rec, list, order, combo_selection) {            
        this.rec_name = selected_rec.get('field1');

        switch (order) {
            case 1:
                this.question_panel.get(this.question_panel.items.get(2).id).setValue(this.rec_name);

                break;
            case 2:
                this.question_panel.get(this.question_panel.items.get(6).id).setValue(this.rec_name);

                break;
            case 3:
                this.question_panel.get(this.question_panel.items.get(10).id).setValue(this.rec_name);

                break;
            default:
                break;
        }
	},
    
    contBtnClicked: function() {
        this.fillForm();
        if (this.question_panel.getForm().isValid()) {
            this.question_panel.getForm().submit({
                scope:this.question_panel,
                source: 'Draw Manager'
            });
        } else {
            this.invalid()
        }
        this.fireEvent('grp-qstn-cont', this.result, this);
    },
    
    update: function(context) {
        Ext.apply(this, context);
        this.remove(this.question_panel);
        this.question_panel.destroy();
        Ext.get('basic_qs_header_html'+this.group_name).update(this.getHeaderText());
        this.question_panel = this.fill_question_panel();
        this.add(this.question_panel);
    }
	
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-access-questions-panel', gwst.widgets.AccessQuestionsPanel);