gwst.widgets.MapToolWindow = Ext.extend(Ext.Window, {
    // Constructor Defaults, can be overridden by user's config object
    id: 'map_tool_win',
    title: '',
    height: 40,
    width: 115,
    closable: false,
    resizable: false,
    initComponent: function(){
        // Called during component initialization
 
        // Config object has already been applied to 'this' so properties can 
        // be overriden here or new properties (e.g. items, tools, buttons) 
        // can be added, eg:

        var toolbar = new gwst.widgets.ControlToolbar({
            map:Ext.getCmp('map').map,
            configurable: false,
            id: 'mt1'
        }); 
        
        Ext.apply(this, {
            x: 0,
            y: 30,
            layout:'fit',
            html:'some stuff goes here',
            tbar: toolbar
        });
 
        // Before parent code
 
        // Call parent (required)
        gwst.widgets.MapToolWindow.superclass.initComponent.apply(this, arguments);
 
        // After parent code
        // e.g. install event handlers on rendered component
    },
    
    onRender: function(){
        // Before parent code 
        // Call parent (required)
        gwst.widgets.MapToolWindow.superclass.onRender.apply(this, arguments); 
        // After parent code    
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst.widgets.MapToolWindow', gwst.widgets.MapToolWindow);