Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SelResPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'select-res-grp-panel',
    
    /* ``Ext.ux.Multiselect``
     * For species selection
     */
    res_grp_select: null,
    user_group: 'unknown',
    res_group_name: 'unknown',
    contact_address: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('res-sel-cont');
		
		Ext.apply(this, {
			title: '1. Select a '+this.res_group_name,			
			bbar: [
				{xtype:'tbfill'},
				{text: '<< Go Back'},
				{xtype:'tbseparator'},
				{
                    text: 'Continue >>',
                    handler: this.continueBtnClicked.createDelegate(this)
                }
			]
		});

		var species_store = new Ext.data.SimpleStore({
			fields: ['id','name'],
			idIndex:0,
			data: [['123','Halibut'],  
				['1', 'Rockfish'], ['2', 'Salmon'], ['3', 'Tuna'], ['4', 'Dungeness Crab'], ['5', 'Rock Crab']]
		});
		
		this.res_grp_select = new gwst.widgets.SpeciesSelect({
			store: species_store
		});
		
        // Call parent (required)
        gwst.widgets.SelResPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    onRender: function(){
        // Before parent code 
        // Call parent (required)
        gwst.widgets.SelResPanel.superclass.onRender.apply(this, arguments); 
        // After parent code
		var html_text = '<p class="top_instruct">\
			<b>Instructions:</b> Select 1 of the '+ this.res_group_name +' \
			you harvest as a <i>'+ this.user_group +'</i> from the list below \
			and then click the \'Continue\' button.\
			</p><br />\
			<p>\
			<b>Note:</b> Next, you are going to draw your fishing grounds for that '+ this.res_group_name +'. \
			You will have a chance to do this for all of the '+ this.res_group_name +' below, \
			but you don\'t have to do all of them.\
			</p><br />\
			<p> \
			If you think an important '+ this.res_group_name +' is missing from the list, \
			notify us at '+ this.contact_address +'.\
			</p><br />'
		;
		var inner_panel = {
			html: html_text,
			style: 'margin: 10px',
			border: false
		};
		this.add(inner_panel);
		this.add(this.res_grp_select);
	},
    
    continueBtnClicked: function() {
		var species_rec = this.res_grp_select.getValue();
		if (species_rec == '') {
			alert('You must select a species before continuing.');
		} else {
			this.res_grp_select.reset();
			this.fireEvent('res-sel-cont',this,species_rec);
		}
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-sel-res-panel', gwst.widgets.SelResPanel);