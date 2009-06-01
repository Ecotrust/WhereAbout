gwst.widgets.IdentifyWindow = Ext.extend(Ext.Window, {
    // Constructor Defaults, can be overridden by user's config object
    id: 'identify_win',
    title: 'Identify Map Features',
    height: 240,
    width: 600,
    closable: true,
    closeAction: 'hide',
    resizable: true,
    collapsible: false,
    initComponent: function(){
        // Called during component initialization
 
        // Config object has already been applied to 'this' so properties can 
        // be overriden here or new properties (e.g. items, tools, buttons) 
        // can be added, eg:
        
        Ext.apply(this, {
            x: 60,
            y: 100,
            layout:'fit',
            tbar: new Ext.StatusBar({
                id: 'win-statusbar',
                defaultText: 'To use, turn on data layers you want to query, click a location on the map, expand available sublayers',
                busyText: 'Querying features...',
                hidden: false
            })            
        });
 
        // Before parent code
 
        // Call parent (required)
        gwst.widgets.IdentifyWindow.superclass.initComponent.apply(this, arguments);
 
        // After parent code
        // e.g. install event handlers on rendered component
    },
    
    show_load: function() {
        var statusBar = Ext.getCmp('win-statusbar');        
        statusBar.showBusy(); 
    },
    
    hide_load: function() {
        var statusBar = Ext.getCmp('win-statusbar');  
        statusBar.clearStatus({
            anim: true,
            useDefaults:true
        });           	
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst.widgets.IdentifyWindow', gwst.widgets.IdentifyWindow);