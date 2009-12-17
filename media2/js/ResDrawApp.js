Ext.namespace('gwst.ResDrawApp');


/*
gwst.ResDrawApp - application class for resource group drawing.  Extends Ext.Observable providing event handling
*/
gwst.ResDrawApp = Ext.extend(Ext.util.Observable, {
    constructor: function(){
		gwst.ResDrawApp.superclass.constructor.call(this);
    },

    init: function(){           
		new Ext.Viewport({
			layout: "border",
			items: [{
				region: "center",
				id: "mappanel",
				border: false,
				xtype: "gwst-res-draw-map-panel",
				split: true
			}]
		});
		
		this.draw_manager = new gwst.ResDrawManager();
		this.draw_manager.init();
		
		/*this.statusPanel = new Ext.Window({
            // title: 'About Geometry Changes',
            html: '',
            width: 250,
            autoHeight: true,
            resizable: false,
            collapsible: false,
            draggable: false,
            closable: false
        });
		this.statusPanel.alignTo(Ext.get('mappanel'), "tr-tr", new int[]{0,0});
        this.statusPanel.show();	
        */	
    }	
});
	