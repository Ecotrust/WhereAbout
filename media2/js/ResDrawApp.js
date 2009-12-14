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
			}, {
				xtype: 'gwst-select-res-grp-panel',
				region: "west",
				res_group_name: 'Species',
				split: true
			}]
		});	
    }
});
	