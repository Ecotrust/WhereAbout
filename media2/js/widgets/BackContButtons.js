Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.BackContButtons = Ext.extend(Ext.Panel, {
    cont_handler: null,
    cont_enabled: true,
    back_handler: null,
    back_enabled: true,
    
    initComponent: function() {
        Ext.apply(this, {
            style: 'margin: 0px 10px; padding: 5px 0px 5px 5px',
            cls: 'gwst-button-panel',
            layout:'table',
            border: false,
            width: 260,
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
    
    onRender: function() {
        if (this.back_handler) {
            // action for the button in the button panel
            this.backBtn = new Ext.Button({
                text: '<< Go Back',
                handler: this.back_handler
            });
            if (!this.back_enabled) {
            	this.backBtn.disable();
            }            
            this.add({
                items: [this.backBtn],
                width: 105,
                style: 'margin-left: 20px'
            });
        } else {
            this.add({
                html: '',
                width: 105
            })
        };
        if (this.cont_handler) {
            this.contBtn = new Ext.Button({
                text: 'Continue >>',
                handler: this.cont_handler
            });
            if (!this.cont_enabled) {
            	this.contBtn.disable();
            }
            this.add({
                items: [this.contBtn],
                width: 120
            });
        }
        // Call parent (required)
        gwst.widgets.BackContButtons.superclass.onRender.apply(this, arguments); 
    },
    
    enableCont: function() {
    	this.contBtn.enable();
    },
    
    disableCont: function() {
    	this.contBtn.disable();
    }    
});

// register xtype to allow for lazy initialization
Ext.reg('gwst-back-cont-buttons-panel', gwst.widgets.BackContButtons);