Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.UnfinishedResourceStartPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'unfinished-resource-start-panel',
	user_group: 'unknown',
    shape_name_plural: 'unknown',
    res_group_name: 'unknown',
    cur_resource: 'unknown',
    user_group_desc: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        
		this.addEvents('unfin-res-start-skip');
        this.addEvents('unfin-res-start-cont');
        
        // Call parent (required)
        gwst.widgets.UnfinishedResourceStartPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
            <b>You did not finish drawing your '+ this.user_group_desc +' '+ this.cur_resource +' '+ this.shape_name_plural +' during your last session.\
            <br /><br />\
            Please take the time to finish with this '+ this.res_group_name +'.</b></p>\
            <br />\
            <p>If you do not want to finish this '+ this.res_group_name +' at this time, \
            please use the \'Skip\' button below.\
            </p>';
        return html_text;
    },

    onRender: function(){
        
        //panel of text
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'intro_inner_panel',
			style: 'margin: 10px',
			border: false
        });
        
       this.button_panel = new gwst.widgets.CustomButtons ({
            element_list: [{
                elem: this.skipBtnClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Skip',
                type: 'text'
            },{
                elem: this.contBtnClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Continue',
                type: 'text'
            }]
        });
        
        this.add(this.inner_panel);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.UnfinishedResourceStartPanel.superclass.onRender.apply(this, arguments);     
	},
    
    skipBtnClicked: function() {
        this.fireEvent('unfin-res-start-skip',this);
    },

    contBtnClicked: function() {
        this.fireEvent('unfin-res-start-cont',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-unfinished-resource-start-panel', gwst.widgets.UnfinishedResourceStartPanel);