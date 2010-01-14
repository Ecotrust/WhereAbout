Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.BackContButtons = Ext.extend(Ext.Panel, {
    cont_handler: null,
    back_handler: null,
    
    
    initComponent: function(){
		
        
        Ext.apply(this, {
            style: 'margin: 15px 35px; padding: 5px',
            cls: 'gwst-button-panel',
            layout:'table',
            border: false,
            defaults: {
                bodyStyle:'border: none'
            },
            layoutConfig: {
                columns: 2
            }
        });
        
        
        // Call parent (required)
        gwst.widgets.BackContButtons.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    onRender: function(){
        // action for the button in the button panel
        var cont = new Ext.Action({
            text: 'Continue >>',
            handler: this.cont_handler
        });
        
        var back = new Ext.Action({
            text: '<< Go Back',
            handler: this.back_handler
        });
        
        this.add({
            items: [
                new Ext.Button(back)
            ],
            width: 100
        });
        this.add({
            items: [
                new Ext.Button(cont)
            ],
            width: 100,
            style: 'padding-left: 10px'
        });
        
        // Call parent (required)
        gwst.widgets.BackContButtons.superclass.onRender.apply(this, arguments); 

    }
    
});

// register xtype to allow for lazy initialization
Ext.reg('gwst-back-cont-buttons-panel', gwst.widgets.BackContButtons);