Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.FinishPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'finish-panel',
	res_group_name: 'unknown',
    shape_name: 'unknown',
    user_group: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('select-another');
        this.addEvents('finish-map');
		
        // Call parent (required)
        gwst.widgets.FinishPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<p>Current status for '+this.user_group+':</p><p>'+this.getCompletedResources()+this.getIncompleteResources()+'<p>';
        return html_text;
    },
    
    getCompletedResources: function() {
        var empty = true;
        var comp_res = '\
            <table class="resource-list">\
            <tr><th><b>Completed '+capFirst(this.res_group_name)+':</b></th></tr>';
        for (var res = 0; res < gwst.settings.resourceStore.getCount(); res++) {
            if (gwst.settings.resourceStore.getAt(res).get('finished')) {
                empty = false;
                comp_res = comp_res+'<tr><td>'+gwst.settings.resourceStore.getAt(res).get('name')+'</td></tr>';
            }
        }
        if (empty == true) {
            comp_res = comp_res+'<tr><td>none</td></tr>';
        }
        return comp_res+'</table>';
    },
    
     getIncompleteResources: function() {
        var empty = true;
        var incomp_res = '\
            <table class="resource-list">\
            <tr><th><b>Incomplete '+capFirst(this.res_group_name)+':</b></th></tr>';
        for (var res = 0; res < gwst.settings.resourceStore.getCount(); res++) {
            if (!gwst.settings.resourceStore.getAt(res).get('finished')) {
                empty = false;
                incomp_res = incomp_res+'<tr><td>'+gwst.settings.resourceStore.getAt(res).get('name')+'</td></tr>';
            }
        }
        if (empty == true) {
            incomp_res = incomp_res+'<tr><td>none</td></tr>';
        }
            return incomp_res+'</table>';
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'finish_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.CustomButtons ({
            element_list: [{
                elem: this.selectBtnClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Select '+this.res_group_name+'',
                type: 'text'
            },{
            	elem: 'Start your next '+ this.res_group_name +' or change one you already completed',
            	type: 'text'            	
            },{
                elem: this.finishBtnClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Finish',
                type: 'text'
            },{
                elem: 'Finish the drawing section of the survey',
                type: 'text'
            }]
        });
        
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.FinishPanel.superclass.onRender.apply(this, arguments); 
	},
    
    selectBtnClicked: function() {
        this.fireEvent('select-another',this);
    },
    
	finishBtnClicked: function() {
		this.fireEvent('finish-map',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-finish-panel', gwst.widgets.FinishPanel);