Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-panel',
	resource: 'unknown',
	user_group: 'unknown',
    shape_name: 'unknown',
    action: 'unknown',
    help_url: gwst.settings.urls.draw_help,
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('draw-cont');        
        this.addEvents('draw-back');        
        this.addEvents('draw-grid');
        
        // Call parent (required)
        gwst.widgets.DrawPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
       
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2> \
			<p>Draw your <u>first</u> '+ this.user_group +' <i>'+ this.resource +'</i> '+ this.shape_name +'\
            on the map. (You\'ll be able to draw more)\
            </p>';
        return html_text;
    },
    
    getHtmlText2: function() {
        var html_text_2 = '<p class="video-link">\
            <img class="video-img" src="/site-media/images/film_go.png"/> <a href="'+ this.help_url +'" target="_blank">View Video Demonstration</a>\
            </p>';
        return html_text_2;
    },
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
			html: '<img src="/site-media/images/3_DrawGrounds_header.png">',
            id: 'draw_header_panel',
			border: 'north',
            bodyCfg: {
                cls: 'action-panel-header'
            }
        });

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'draw_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        // this.table_panel = new Ext.Panel({
        this.table_panel = new gwst.widgets.DrawInstructionPanel({
            xtype: 'gwst-draw-instruction-panel',
            shape_name: this.shape_name,
            id: 'draw_table_panel'
        });
        
        this.lower_panel = new Ext.Panel({
			html: this.getHtmlText2(),
            id: 'draw_lower_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            back_handler: this.backBtnClicked.createDelegate(this)
        });

        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.table_panel);
        this.add(this.lower_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.DrawPanel.superclass.onRender.apply(this, arguments); 
	},
    
    backBtnClicked: function() {
        this.fireEvent('draw-back',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-panel', gwst.widgets.DrawPanel);