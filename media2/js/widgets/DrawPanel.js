Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-panel',
	resource: 'unknown',
	user_group: 'unknown',
    shape_name: 'unknown',
    action: 'unknown',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('draw-cont');        
        this.addEvents('draw-back');        
        this.addEvents('draw-grid');
        
        // this.updateBbar(this.getBottomToolbar());
        // Call parent (required)
        gwst.widgets.DrawPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
       
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p><b>Instructions:</b> \
			Draw your '+ this.user_group +' <i>'+ this.resource +'</i> '+ this.shape_name +'s\
            on the map one at a time.\
            </p>';
        return html_text;
    },
    
    getText2: function() {
        var html_text_2 = '<p>\
            <a href=http://www.google.com>Watch Demonstration Video</a>\
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
			html: this.getText(),
            id: 'draw_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.table_panel = new Ext.Panel({
            layout: 'table',
            border: false,
            style: 'margin: 10px; padding: 5px',
            defaults: {
                bodyStyle: 'border: none; padding: 5px'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'draw_table_panel',
            items: [{
                html: '<p> \
                    a. Click once on the map to create the first point.\
                    </p>',
            },{
                html: '<img src="/site-media/images/draw_1.png">',
            },{
                html: '<p> \
                    b. Move mouse and click to create a second point.\
                    </p>',
            },{
                html: '<img src="/site-media/images/draw_2.png">',
            },{
                html: '<p>\
                    c. Continue tracing being as accurate as you can.\
                    </p>',
            }, {
                html: '<img src="/site-media/images/draw_3.png">',
            },{
                html: '<p> \
                    d. Double-click the last point to complete your '+this.shape_name+'.\
                    </p>',
            },{
                html: '<img src="/site-media/images/draw_4.png">',
            },{
                html: '<p>\
                    e. If you make a mistake, click the \'Cancel\' button\
                    </p>',
            },{
                html: '<img src="/site-media/images/draw_5.png">',
            },{
                html: '<p>\
                    f. You can control the map while you\'re drawing.\
                    </p>',
            },{
                html: '<img src="/site-media/images/draw_6.png">',
            }]
        });
        
        this.lower_panel = new Ext.Panel({
			html: this.getText2(),
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