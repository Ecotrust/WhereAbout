Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.CustomButtons = Ext.extend(Ext.Panel, {
    element_list: [],
    
    initComponent: function(){
		
        Ext.apply(this, {
            style: 'margin: 15px; padding: 8px 15px 8px 15px',
            cls: 'gwst-button-panel',
            layout:'table',
            border: false,
            defaults: {
                bodyStyle:'border: none; margin-left: auto; margin-right: auto'
            },
            layoutConfig: {
                columns: 2
            }
        });
        
        // Call parent (required)
        gwst.widgets.CustomButtons.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    onRender: function(){
        // action for the button in the button panel
        var btn_action = null;
        var col_no = 1;
        this.cell_cls = 'custom-table-cell';

        for (var i = 0;i<this.element_list.length;i++) {
            if (this.element_list[i].type == 'handler') {
                this.add(
                    new Ext.Button({
                        text: this.element_list[i+1].elem,
                        handler: this.element_list[i].elem,
                        cls: this.cell_cls,
                        width: 100,
                        style: 'margin: 5px'
                    })
                );
                i++;
            } else if (this.element_list[i].type == 'text') {
                this.add({ 
                    html: this.element_list[i].elem,
                    cls: this.cell_cls                    })
            }
            col_no++;            
        };

        // Call parent (required)
        gwst.widgets.CustomButtons.superclass.onRender.apply(this, arguments); 
    }
});

// register xtype to allow for lazy initialization
Ext.reg('gwst-custom-buttons-panel', gwst.widgets.CustomButtons);