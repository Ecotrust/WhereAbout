Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PennyWindow = Ext.extend(Ext.Window, {
    // Constructor Defaults, can be overridden by user's config object
	shape_name: 'unknown',
    prev_pennies: null,		//If user is changing a penny value, this will be the previous value
    rem_pennies: null,		//Maximum number of pennies that can be entered
    
    initComponent: function(){
        this.pennies_field = new Ext.form.NumberField ({
            fieldLabel: 'Pennies',
            id: 'penny-window-numfield',
            name: 'pennies',
            allowBlank:false,
            allowDecimals: false,
            width: 100,
            minValue: 1,
            minText: 'Not Enough',
            maxValue: this.getMaxValue(),
            maxText: 'Too Many',
            msgTarget: 'under',
            selectOnFocus: true,
            xtype: 'numberfield'
        });

        this.penny_form = new Ext.form.FormPanel({  
            bodyStyle: 'background-color: transparent',
            border: false,
            width: 170,
            labelWidth: 50,
            items: [ this.pennies_field ],
            id: 'penny-window-form-panel',
            defaultType: 'numberfield'
        });
        
        this.penny_form.on('show', this.prepPennyForm);
        
        var table_panel = new Ext.Panel({
            layout: 'table',
            bodyStyle: 'background-color: transparent',
            border: false,
            defaults: {
                bodyStyle: 'border: none; padding: 5px; background-color: transparent'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'penny_window_panel',
            items: [
                this.penny_form,
                {tag: 'div', id: 'penny-left-text', html: this.getLabelValue()},  //Ext.DomHelper object
            ]
        });        
        
		Ext.apply(this, {          
            title: 'Enter a Penny Value',
            id: 'penny-window',
        	layout:'fit',
            x: 9,
            y: 130,
            width:280,
            height:160, 
            bodyStyle: 'padding: 10px',            
            plain: true,
            closable: false,
            modal: true,
            resizable: false,
            closable: false,
            draggable: false,
            constrain: true,	//Ensure window is never rendered outside of viewable area
            items: [ table_panel ],
            buttons: [{
                text: 'Save',
                handler: this.saveBtnClicked.createDelegate(this)
            },{
                text: 'Cancel',
                handler: this.cancelBtnClicked.createDelegate(this)
            }]            
        });
        
		gwst.widgets.PennyWindow.superclass.initComponent.call(this);
	},
    
    prepPennyForm: function() {
        this.pennies_field.setRawValue(null);
        this.pennies_field.focus(true, true);
    },
    
    saveBtnClicked: function() {
        var penny_form = this.penny_form.getForm();
        if (penny_form.isValid()) {
            var pennies_value = penny_form.getValues().pennies;
            this.fireEvent('penny-set', pennies_value);          
            this.hide();
        }
    },
    
    cancelBtnClicked: function() {
        this.hide();
    },

    getMaxValue: function() {
	    var maxValue = this.rem_pennies;
		if (this.prev_pennies) {
			maxValue = this.prev_pennies+this.rem_pennies;
		}
		return maxValue;
    },
    
    getLabelValue: function() {
    	return '<span style="color:red">('+this.getMaxValue()+' left)</span>';    	
    },
    
    load: function(config) {
        this.rem_pennies = config.rem_pennies;
        this.prev_pennies = config.prev_pennies;
        Ext.get('penny-left-text').update(this.getLabelValue());
        this.pennies_field.maxValue = this.getMaxValue();
        this.pennies_field.setRawValue(null);
        
    }
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-penny-window', gwst.widgets.PennyWindow);