Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.WestPanel = Ext.extend(Ext.Panel, {
    id: 'west-panel',
	width: '300px',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		// Constructor, config object already applied to 'this' so properties can 
    	// be created and added/overridden here: Ext.apply(this, {});
         
        gwst.widgets.WestPanel.superclass.initComponent.call(this);  
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-west-panel', gwst.widgets.WestPanel);