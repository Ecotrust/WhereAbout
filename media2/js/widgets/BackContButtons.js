Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.BackContButtons = Ext.extend(Ext.Panel, {
    cont_handler: null,
    back_handler: null,
    
    initComponent: function(){
        Ext.apply(this, {
            style: 'margin: 15px 35px; padding: 5px 0px 5px 5px',
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
        if (this.back_handler) {
            // action for the button in the button panel
            var back = new Ext.Action({
                text: '<< Go Back',
                handler: this.back_handler
            });
            this.add({
                items: [
                    new Ext.Button(back)
                ],
                width: 95,
                style: 'margin-left: 20px'
            });
        } else {
            this.add({
                html: '',
                width: 115
            })
        };
        if (this.cont_handler) {
            var cont = new Ext.Action({
                text: 'Continue >>',
                handler: this.cont_handler
            });
            this.add({
                items: [
                    new Ext.Button(cont)
                ],
                width: 85
            });
        }
        // Call parent (required)
        gwst.widgets.BackContButtons.superclass.onRender.apply(this, arguments); 
    }
});

// register xtype to allow for lazy initialization
Ext.reg('gwst-back-cont-buttons-panel', gwst.widgets.BackContButtons);