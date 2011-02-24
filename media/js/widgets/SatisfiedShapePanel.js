Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SatisfiedShapePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'satisfied-shape-panel',
	resource: 'unknown',
    shape_name: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('satisfied');
		this.addEvents('edit-shape');
		
        // Call parent (required)
        gwst.widgets.SatisfiedShapePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<p class="top_instruct"><b>Are you satisfied with this '+ this.shape_name +'?</b></p>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'satisfied_shape_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.CustomButtons ({
            element_list: [
                {
                    elem: this.yesClicked.createDelegate(this),
                    type: 'handler'
                },{
                    elem: 'Yes',
                    type: 'text',
                    style: 'width: 100px'
                },{
                    elem: this.noClicked.createDelegate(this),
                    type: 'handler'
                },{
                    elem: 'No',
                    type: 'text',
                    style: 'width: 100'
                },{
                    elem: this.editClicked.createDelegate(this),
                    type: 'handler'
                },{
                    elem: 'Edit shape',
                    type: 'text',
                    style: 'width: 100px; float: right'
                }
            ],
            style: 'margin: auto'
        });
        
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.SatisfiedShapePanel.superclass.onRender.apply(this, arguments); 
	},
    
    editClicked: function() {
        this.fireEvent('edit-shape',this);
    },
    
    yesClicked: function() {
        this.fireEvent('satisfied',{satisfied:true});
    },
    
	noClicked: function() {
		this.fireEvent('satisfied',{satisfied:false});
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-satisfied-shape-panel', gwst.widgets.SatisfiedShapePanel);