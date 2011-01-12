Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.CopyWindow = Ext.extend(Ext.Window, {
    // Constructor Defaults, can be overridden by user's config object
	shape_name: 'unknown',
    record: 'unknown',
    
    initComponent: function(){
        
        var text_panel = new Ext.Panel({
            bodyStyle: 'background-color: transparent',
            border: false,
            defaults: {
                bodyStyle: 'border: none; padding: 5px; background-color: transparent'
            },
            id: 'copy_window_panel',
            html: 'Are you sure you want to copy this '+this.shape_name+'?'

        });     
        
		Ext.apply(this, {          
            // title: 'Enter a Penny Value',
            id: 'copy-window',
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
            draggable: false,
            constrain: true,	//Ensure window is never rendered outside of viewable area
            items: [ text_panel ],
            buttons: [{
                text: 'Yes',
                id: 'yesButton',
                handler: this.yesBtnClicked.createDelegate(this)
            },{
                text: 'No',
                id: 'noButton',
                handler: this.noBtnClicked.createDelegate(this)
            }]            
        });
        
		gwst.widgets.CopyWindow.superclass.initComponent.call(this);
	},
    
    yesBtnClicked: function() {
        this.fireEvent('copy-set', this.record);          
        this.hide();
    },
    
    noBtnClicked: function() {
        this.hide();
    },
    
    update: function(config) {
        Ext.apply(this, config);
    }
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-copy-window', gwst.widgets.CopyWindow);