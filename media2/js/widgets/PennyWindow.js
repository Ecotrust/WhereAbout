Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PennyWindow = Ext.extend(Ext.Window, {
    shape_name: 'unknown',
    // selected_record: null,
    prev_pennies: null,
    rem_pennies: 100,
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		

        this.pennies_field = new Ext.form.NumberField ({
            fieldLabel: 'Pennies<br />('+this.rem_pennies+' left)',
            id: 'penny-window-numfield',
            name: 'pennies',
            allowBlank:false,
            minValue: 1,
            maxValue: this.rem_pennies,
            msgTarget: 'under',
            xtype: 'numberfield'
        });
        
		Ext.apply(this, {          
            title: 'Enter a Penny Value',
            id: 'penny-window',
        	layout:'fit',
            plain: true,
            closeAction:'hide',
            closable: false,
            modal: true,
            width:280,
            height:150,
            bodyStyle: 'padding: 10px',
            resizable: true,
            x: 9,
            y: 68,
            items: [
                new Ext.form.FormPanel({  
                    bodyStyle: 'background-color: transparent',
                    border: false,
                    items: [ this.pennies_field ],
                    buttons: [{
                        text: 'Save',
                        handler: this.saveBtnClicked.createDelegate(this)
                    },{
                        text: 'Cancel',
                        handler: this.cancelBtnClicked.createDelegate(this)
                    }],
                    id: 'penny_window_form_panel',
                    defaultType: 'numberfield'
                })
            ]

        });
        
        if (this.prev_pennies) {
            Ext.apply(this.pennies_field, {
                value: this.prev_pennies
            });
        }
        
		gwst.widgets.PennyWindow.superclass.initComponent.call(this);
	},
    
    saveBtnClicked: function() {
        var penny_form = this.getComponent('penny_window_form_panel').getForm();
        if (penny_form.isValid()) {
            var pennies_value = penny_form.getValues().pennies;
            this.fireEvent('penny-set', pennies_value);          
            this.hide();
        }
    },
    
    cancelBtnClicked: function() {
        this.hide();
    }
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-penny-window', gwst.widgets.PennyWindow);