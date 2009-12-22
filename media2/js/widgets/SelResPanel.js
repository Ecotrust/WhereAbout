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

		this.res_grp_select = {
			style: 'margin:10px;margin-left:20px',
			xtype: 'multiselect',
			fieldLabel: 'Multiselect<br />(Required)',
			name: 'multiselect',
			width: 200,
			height: 250,
			valueField:"id",
			displayField:"name",
			allowBlank:false,
			//Should reference a global species store
			store: new Ext.data.SimpleStore({
				fields: ['id','name'],
				idIndex:0,
				data: [['123','One Hundred Twenty Three'],
					['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'], ['5', 'Five'],
					['6', 'Six'], ['7', 'Seven'], ['8', 'Eight'], ['9', 'Nine']]
			}),
			ddReorder: false
		};
		
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
        var species_rec = {name:'Salmon',id:4};  //This should come from the species store.
        this.fireEvent('res-sel-cont',this,species_rec);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-sel-res-panel', gwst.widgets.SelResPanel);