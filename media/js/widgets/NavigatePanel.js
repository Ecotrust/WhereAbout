Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.NavigatePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'navigate-panel',
	resource: 'unknown',
    shape_name: 'unknown',
    user_group: 'unknown',
    help_url: gwst.settings.urls.nav_help,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('nav-cont');
        this.addEvents('nav-back');
		
        // Call parent (required)
        gwst.widgets.NavigatePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2><p>First, navigate the map to the general area of your primary <i>'+ this.resource +'</i> '+ this.shape_name +' as a <i>'+ this.user_group +'</i>.</p>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
			html: '<img src="/site-media/images/2_Navigate_header.png">',
            id: 'nav_header_panel',
			border: 'north',
            bodyCfg: {
                cls: 'action-panel-header'
            }
        });

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'nav_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.table_panel = new Ext.Panel({
            layout: 'table',
            border: false,
            style: 'margin: 5px; padding: 5px',
            defaults: {
                bodyStyle: 'border: none; padding: 5px'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'nav_table_panel',
            items: [{
                html: '<p>a. To move the map, use the blue arrow buttons. To zoom the map in and out, use the blue \'+\' and \'-\' buttons. You may also use your keyboard\'s arrow keys and \'+\' and \'-\' keys.</p>'
            },{
                html: '<img src="/site-media/images/nav_2.png">'
            },{
                html: '<p>b. To turn on \'Nautical Charts\' use the selection window on the top right. Click the checkbox to turn them on or off.</p>'
            },{
                html: '<img src="/site-media/images/nav_1.png">'
            },{
                html: '<p>c. Get as close as you can to your '+ this.shape_name +', then press the continue button.</p>'
            }, {
                html: ''
            // },{
                // html: '<p class="video-link"><img class="video-img" src="/site-media/images/film_go.png"/> <a href="'+ this.help_url +'" target="_blank">View Video Demonstration</a>'
            }]
        });
        
        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            back_handler: this.backBtnClicked.createDelegate(this)
        });

        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.table_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.NavigatePanel.superclass.onRender.apply(this, arguments); 
	},
    
    backBtnClicked: function() {
        this.fireEvent('nav-back',this);
    },
    
	contBtnClicked: function() {
		this.fireEvent('nav-cont',this,this.resource);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-navigate-panel', gwst.widgets.NavigatePanel);