Ext.namespace('gwst', 'gwst.data');

gwst.data.ActFeatureStore = Ext.extend(GeoExt.data.FeatureStore, {
	
    // Constructor Defaults, can be overridden by user's config object
	// new_property: null,
	
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
        
        Ext.apply(this, {
        });
        
        // Call parent (required)
        gwst.data.ActFeatureStore.superclass.initComponent.apply(this, arguments);                     
    },
    
    //Get the total number of pennies allocated so far
    getPennyCount: function() {
    	this.pennyCount = 0;
    	this.each(function(r) {
    		this.pennyCount = this.pennyCount + parseInt(r.get('pennies'));
    	}, this);
    	return this.pennyCount;
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-act-feature-store', gwst.data.ActFeatureStore);