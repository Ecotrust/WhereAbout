Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.YesNoButtons = Ext.extend(Ext.Panel, {
    yes_handler: null,
    yes_text: 'unknown',
    no_handler: null,
    no_text: 'unknown',
    
    
    initComponent: function(){
		
        
        Ext.apply(this, {
            style: 'margin: 15px 35px; padding: 5px',
            cls: 'gwst-button-panel',
            layout:'table',
            border: false,
            defaults: {
                bodyStyle:'border: none; padding: 10px'
            },
            layoutConfig: {
                columns: 2
            }
        });
        
        // Call parent (required)
        gwst.widgets.YesNoButtons.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    onRender: function(){
        // action for the button in the button panel
        var yes = new Ext.Action({
            text: 'Yes',
            handler: this.yes_handler
        });
        
        var no = new Ext.Action({
            text: 'No',
            handler: this.no_handler
        });
        
        this.add({
            items: [
                new Ext.Button(yes)
            ],
            width: 50,
            style: 'margin-left: 55px'
        },{
            items: [
                new Ext.Button(no)
            ],
            width: 55
        });
        
        // Call parent (required)
        gwst.widgets.YesNoButtons.superclass.onRender.apply(this, arguments); 

    }
    
});

// register xtype to allow for lazy initialization
Ext.reg('gwst-yes-no-buttons-panel', gwst.widgets.YesNoButtons);