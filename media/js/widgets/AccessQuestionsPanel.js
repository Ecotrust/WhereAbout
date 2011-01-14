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
    resource_id: '',
    hidden_q_id: '',    //The id for the form question that we had to hide on this panel

    
    /*
     *  Creates the drop-down selector box of access points ordered from north to south
     */
    makeSelect: function() {
        this.prev_site_group = '';
        if (Ext.isGecko || Ext.isGecko2 || Ext.isGecko3){ //get instances of firefox
            this.select_action = ' onchange="eval(this.value);" onmouseover="gwst.settings.actualSelection = true;" onmouseout="gwst.settings.actualSelection = false;" ';
        } else {  //No other browser had this problem
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
            this.html_text = this.html_text + '<option value = "app.draw_manager.PrimaryLocationQuestionPanel.selectPlacemarkSelected(\'' +
                gwst.settings.placemarkStore.getAt(this.i).id +
                '\')">' + gwst.settings.placemarkStore.getAt(this.i).data.name +
                '</option>';
        }
        this.html_text = this.html_text+'</select>';
        return this.html_text;
    },
    
    /*
     *  Creates the drop-down selector box of access points ordered by alphabet
     */
    makeAlphSelect: function() {
        if (Ext.isGecko || Ext.isGecko2 || Ext.isGecko3){
            this.select_action = ' onchange="eval(this.value);" onmouseover="gwst.settings.alphActualSelection = true;" onmouseout="gwst.settings.alphActualSelection = false;" ';
        } else {
            gwst.settings.alphActualSelection = true;
            this.select_action = ' onchange="eval(this.value);" ';
        }
        this.html_text = '<select id="alph-select"' + this.select_action + 'style="width: 265px"><option selected disabled>'+gwst.settings.alphPlaceComboText+'</option>';
        for (this.i = 0; this.i < gwst.settings.alphPlacemarkStore.data.length; this.i++) {
            this.site_group = gwst.settings.alphPlacemarkStore.getAt(this.i).get('feature').attributes.site_group;
            this.html_text = this.html_text + '<option value = "app.draw_manager.PrimaryLocationQuestionPanel.selectAlphPlacemarkSelected(\'' +
                gwst.settings.alphPlacemarkStore.getAt(this.i).id +
                '\')">' + gwst.settings.alphPlacemarkStore.getAt(this.i).data.name +
                '</option>';
        }
        this.html_text = this.html_text+'</select>';
        return this.html_text;
    },

    onRender: function(){
    
        //New custom panel to replace question 1 of the form
        this.select_panel = new Ext.Panel({
            id:'drop-down-panel',
            border: false,
            width: 265,
            style: 'margin: 5px 15px 0px 15px',
            items: [{
        		html:'Before you changed your primary diving location, where did you dive/shore pick?',
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

        // // Call parent (required)
        gwst.widgets.AccessQuestionsPanel.superclass.onRender.apply(this, arguments); 
        
        this.question_panel.on('added', this.hideDuplicates.createDelegate(this));

        this.add(this.header_panel);
        this.add(this.select_panel);  //fit the custom panel into the form panel
		this.add(this.question_panel);
        this.add(this.button_panel);
        
    },
    
    // Hide the question that we've replaced with the custom drop-downs, collect it's ID for future use
    hideDuplicates: function() {
        this.hidden_q_id = this.question_panel.items.get(0).id;
        this.question_panel.get(this.hidden_q_id).hide();
    },
    
    selectPlacemarkSelected: function(rec_id) {
        if (gwst.settings.actualSelection) {
            Ext.getDom('alph-select').selectedIndex=0;
            this.rec = gwst.settings.placemarkStore.getById(rec_id);
            this.fireEvent('place-selected', this.rec);
            this.question_panel.get(this.hidden_q_id).setValue(this.rec.get('name'));
        }
	},
    
    selectAlphPlacemarkSelected: function(rec_id) {
        if (gwst.settings.alphActualSelection) {
            Ext.getDom('northsouth-select').selectedIndex=0;
            this.rec = gwst.settings.alphPlacemarkStore.getById(rec_id);
            this.fireEvent('place-selected', this.rec);
            this.question_panel.get(this.hidden_q_id).setValue(this.rec.get('name'));
        }
	},
    
    update: function(context) {
        Ext.apply(context);
        Ext.getDom('northsouth-select').selectedIndex=0;
        Ext.getDom('alph-select').selectedIndex=0;
    }
	
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-access-questions-panel', gwst.widgets.AccessQuestionsPanel);