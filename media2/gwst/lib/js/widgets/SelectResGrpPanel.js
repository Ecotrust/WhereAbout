Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SelectResGrpPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'select-res-grp-panel',
    
    /* ``Ext.ux.Multiselect``
     * For species selection
     */
    res_grp_select: null,
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		Ext.apply(this, {
			title: '1. Select '+this.res_group_name,			
			bbar: [
				{xtype:'tbfill'},
				{text: '<< Go Back'},
				{xtype:'tbseparator'},
				{text: 'Continue >>'}
			]
		});

		this.res_grp_select = {
			style: 'margin:10px;margin-left:20px',
			xtype: 'multiselect',
			fieldLabel: 'Multiselect<br />(Required)',
			name: 'multiselect',
			width: 250,
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
        gwst.widgets.SelectResGrpPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    onRender: function(){
        // Before parent code 
        // Call parent (required)
        gwst.widgets.SelectResGrpPanel.superclass.onRender.apply(this, arguments); 
        // After parent code
		this.add(this.res_grp_select);
	}
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-select-res-grp-panel', gwst.widgets.SelectResGrpPanel);