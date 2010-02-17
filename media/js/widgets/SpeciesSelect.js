Ext.namespace('gwst', 'gwst.widgets');


gwst.widgets.SpeciesSelect = Ext.extend(Ext.ux.Multiselect, {
    style: 'margin:10px;margin-left:20px', 
	width: 250,
	height: 150,
	valueField:"id",
	displayField:"name",
	allowBlank:false,
	ddReorder: false,
	xtype: 'multiselect',
	fieldLabel: 'Speciesselect<br />(Required)',
	name: 'speciesselect',	
	

    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		// Constructor, config object already applied to 'this' so properties can 
    	// be created and added/overridden here: Ext.apply(this, {});

        gwst.widgets.SpeciesSelect.superclass.initComponent.call(this);  
    },
	onViewBeforeClick: function(vw, index, node, e) {
        this.preClickSelections = this.view.getSelectedIndexes();
        if (this.disabled) {return false;}
		this.reset();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-species-select', gwst.widgets.SpeciesSelect);