Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.MainViewport = Ext.extend(Ext.Viewport, {
    id: 'main-viewport',
	curWestPanel: null,    
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

		Ext.apply(this, {
			layout: "border",
			items: [{
				region: "center",
				id: "mappanel",
				border: false,
				xtype: "gwst-res-draw-map-panel",
				split: true,
				listeners: this.mapPanelListeners
			},{
                region: 'west',
                width: 300,
                id: 'west-panel-container',
                collapsed: false,
                layout: 'fit'
            }]        
		});

        // Call parent (required)
        gwst.widgets.MainViewport.superclass.initComponent.apply(this, arguments);                     
    },

    onRender: function(){
        gwst.widgets.MainViewport.superclass.onRender.apply(this, arguments);                       
	},    
    
    setWestPanel: function(panel) {        
        var westPanelContainer = Ext.getCmp('west-panel-container');
        //Remove west panel if there already is one
        if (this.curWestPanel) {
            westPanelContainer.remove(this.curWestPanel);
        }
        westPanelContainer.add(panel);
        this.curWestPanel = panel;
        westPanelContainer.doLayout();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-main-viewport', gwst.widgets.MainViewport);