Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SelResPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'select-res-grp-panel',
    
    /* ``Ext.ux.Multiselect``
     * For species selection
     */
    res_grp_select: null,
    user_group: 'unknown',
    res_group_name: 'unknown',
    plural_res_group_name: 'unknown',
    contact_address: 'unknown',
    action: 'unknown',
    shape_name: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('res-sel-cont');
        this.addEvents('res-sel-back');
		        
		this.res_grp_select = new gwst.widgets.SpeciesSelect({
			store: gwst.settings.resourceStore
		});
		
        // Call parent (required)
        gwst.widgets.SelResPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
			<b>Instructions:</b> Select 1 of the '+ this.res_group_name +' \
			you '+ this.action +' as a <i>'+ this.user_group +'</i> from the list below \
			and then click the \'Continue\' button.\
			</p><br />\
			<p>\
			<b>Note:</b> Next, you are going to draw your '+ this.shape_name +'s for that '+ this.res_group_name +'. \
			You will have a chance to do this for all of the '+ this.plural_res_group_name +' below, \
			but you don\'t have to do all of them.\
			</p><br />\
			<p> \
			If you think an important '+ this.res_group_name +' is missing from the list, \
			notify us at '+ this.contact_address +'.\
			</p><br />'
		;
        return html_text;
    },
    
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
			html: '<img src="/site-media/images/1_PickFishery_header.png">',
            id: 'sel_res_header_panel',
			border: false,
            bodyCfg: {
                cls: 'action-panel-header'
            }
        });

		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'sel_res_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            back_handler: this.backBtnClicked.createDelegate(this)
        });
        
        this.content_panel = new Ext.Panel({
            id: 'sel-rec-content-panel',
            items: [
                this.inner_panel,
                this.res_grp_select,
                this.button_panel
            ],
            autoScroll: true,
            border: false
        });
        
        this.add(this.header_panel);
		this.add(this.content_panel);
        
        // Call parent (required)
        gwst.widgets.SelResPanel.superclass.onRender.apply(this, arguments); 
	},
    
    backBtnClicked: function() {
        this.fireEvent('res-sel-back',this);
    },
    
    contBtnClicked: function() {
		var species_id = this.res_grp_select.getValue();
		if (species_id == '') {
            gwst.error.load('You must select a species before continuing.');
		} else {
			this.res_grp_select.reset();
			this.fireEvent('res-sel-cont',this,species_id);
		}
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-sel-res-panel', gwst.widgets.SelResPanel);