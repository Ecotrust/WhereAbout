Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.CustomButtons = Ext.extend(Ext.Panel, {
    element_list: [],
    
    initComponent: function(){
		
        Ext.apply(this, {
            style: 'margin: 15px; padding: 5px',
            cls: 'gwst-button-panel',
            layout:'table',
            border: false,
            defaults: {
                bodyStyle:'border: none; padding: 5px'
            },
            layoutConfig: {
                columns: 2
            }
        });
        
        // Call parent (required)
        gwst.widgets.CustomButtons.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    getAlignmentLeft: function(str, btn_action) {
        var wid = str.length * 5 + 27;
        var marg = 120 - wid +'px';
        return {
            items: [
                new Ext.Button(btn_action)
            ],
            width: wid,
            style: 'margin-left: '+marg
        }
    },
    
    onRender: function(){
        // action for the button in the button panel
        var btn_action = null;
        var col_no = 1;
        for (var i = 0;i<this.element_list.length;i++) {
            if (this.element_list[i].type == 'handler') {
                btn_action = new Ext.Action({
                    text: this.element_list[i+1].elem,
                    handler: this.element_list[i].elem
                 });
                if ((this.element_list[i+2]) && (this.element_list[i+2].type == 'handler') && (col_no % 2 == 1)) {
                    var align_obj = this.getAlignmentLeft(this.element_list[i+1].elem, btn_action);
                    this.add(align_obj);
                } else {
                    this.add({
                        items: [
                            new Ext.Button(btn_action)
                        ],
                        style: 'margin-left: 0px'
                    });
                }
                i++;
            } else if (this.element_list[i].type == 'text') {
                this.add({ html: this.element_list[i].elem })
            }
                // col_no % 2 = 1 for column 1, 0 for column two
            col_no++;            
        };
    
        // Call parent (required)
        gwst.widgets.CustomButtons.superclass.onRender.apply(this, arguments); 
    }
});

// register xtype to allow for lazy initialization
Ext.reg('gwst-custom-buttons-panel', gwst.widgets.CustomButtons);