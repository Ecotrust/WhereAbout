/*
Base class for windows that drop down from the map toolbar
*/
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DropdownWindow = Ext.extend(Ext.Window, {
    // Constructor Defaults, can be overridden by user's config object
    layout: 'fit',
    closable: false,
    draggable: true,
    // minimizable: true,
    // resizable: true,
    // resizeHandles: 's e',
    hideCollapseTool: true,
    layoutConfig: {
        titleCollapse: true,
        animate: true,
        hideCollapseTool: true
    },
    width: 350,
    constrain: true,
    height: 400,
    listeners: {
        'minimize': function(w){
            w.button.toggle(false);
        }
    }
});
 
// Base class, no need for xtype declaration