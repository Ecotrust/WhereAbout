Ext.namespace('gwst', 'gwst.data');

gwst.data.ResFeatureStore = Ext.extend(GeoExt.data.FeatureStore, {
	
    // Constructor Defaults, can be overridden by user's config object
	// new_property: null,
	
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
        
        Ext.apply(this, {
        });
        
        // Call parent (required)
        gwst.data.ResFeatureStore.superclass.initComponent.apply(this, arguments);                     
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-res-feature-store', gwst.data.ResFeatureStore);