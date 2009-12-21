Ext.namespace('gwst.ResDrawApp');


/*
gwst.ResDrawApp - application class for resource group drawing.  Extends Ext.Observable providing event handling
*/
gwst.ResDrawApp = Ext.extend(Ext.util.Observable, {
    constructor: function(){
		gwst.ResDrawApp.superclass.constructor.call(this);
    },

    init: function(){           		
		this.draw_manager = new gwst.ResDrawManager();
		this.draw_manager.init();		        	        
    }	
});
	