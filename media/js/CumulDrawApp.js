Ext.namespace('gwst.DrawApp');

/*
gwst.ResDrawApp - application class for resource group drawing.  Extends Ext.Observable providing event handling
*/
gwst.CumulDrawApp = Ext.extend(Ext.util.Observable, {
    constructor: function(){
		gwst.CumulDrawApp.superclass.constructor.call(this);
    },

    init: function(){
		this.draw_manager = new gwst.CumulDrawManager();
		this.draw_manager.startInit();		        	        
    }	
});
	