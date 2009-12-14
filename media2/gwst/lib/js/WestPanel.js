Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.WestPanel = Ext.extend(Ext.Panel, {
    id: 'west-panel',
	width: '300px',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be overriden here: Ext.apply(this, {}); or new properties 
		//(e.g. items, tools, buttons) added
         
        // Call parent (required)
        gwst.widgets.WestPanel.superclass.initComponent.apply(
          this, arguments);                     
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-widgets-west-panel', gwst.widgets.WestPanel);