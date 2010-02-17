Ext.namespace('gwst.ResDrawApp');


/*
gwst.ResDrawApp - application class for resource group drawing.  Extends Ext.Observable providing event handling
*/
gwst.ResDrawApp = Ext.extend(Ext.util.Observable, {
    constructor: function(){
		gwst.ResDrawApp.superclass.constructor.call(this);
    },

    init: function(){
    	Ext.override(Ext.form.Field, {
		  setFieldLabel : function(text) {
		    if (this.rendered) {
		      this.el.up('.x-form-item', 10, true).child('.x-form-item-label').update(text);
		    }
		    this.fieldLabel = text;
		  }
		});    	
		this.draw_manager = new gwst.ResDrawManager();
		this.draw_manager.startInit();		        	        
    }	
});
	