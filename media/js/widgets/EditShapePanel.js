Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.EditShapePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'edit-shape-panel',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('redraw-edit-act');
        this.addEvents('save-edit-act');
		
        // Call parent (required)
        gwst.widgets.EditShapePanel.superclass.initComponent.apply(this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions:</h2> <p>Edit your area by adding, moving, or removing points along its path.</p><h2>How?</h2>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
            id: 'edit_activity_header_panel',
            // html: '<img src="/media/img/7a_EditArea_header.png">',
            html: '<h3>Edit</h3>',
            border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        });

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'edit_shape_inner_panel',
			style: 'margin: 10px 10px 0px 10px',
			border: false
		});
        
        this.table_panel = new Ext.Panel({
            layout: 'table',
            border: false,
            style: 'margin: 0px 10px 10px 10px',
            defaults: {
                bodyStyle: 'border: none; padding: 0px 5px 5px 5px'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'edit_activity_table_panel',
            items: [{
                html: '<p>The <i>dark orange</i> circles you see on your area are the points you added.</p>'
            },{
                html: '<img src="/site-media/images/edit_area_1.png" />'
            },{
                html: '<p>The <i>light orange</i> circles between your points are \'ghost\' points and are used to create new points.</p>'
            },{
                html: '<img src="/site-media/images/edit_area_2.png" />'
            },{
                html: '<p><b>Moving.</b> To move a point, click the mouse and drag it where you want, then release.</p>'
            }, {
                html: '<img src="/site-media/images/edit_area_3.png" />'
            },{
                html: '<p><b>Adding.</b> To add a point, click a \'ghost\' point and drag it where you want, then release.</p>'
            },{
                html: '<img src="/site-media/images/edit_area_4.png" />'
            },{
                html: '<p><b>Removing.</b> To remove a point, hover your mouse over it and press the \'Delete\' key on your keyboard.</p>'
            },{
                html: '<img src="/site-media/images/edit_area_5.png" />'
            // },{
                // html: '<p class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ gwst.settings.urls.demo +'" target="_blank">Watch Demonstration</a>'
            }]
        });       

        this.button_panel = new gwst.widgets.CustomButtons ({
            element_list: [
                {
                    elem: this.redrawClicked.createDelegate(this),
                    type: 'handler'
                },{
                    elem: 'Redraw instead',
                    type: 'text'
                },{
                    elem: this.saveEditActivityClicked.createDelegate(this),
                    type: 'handler'
                },{
                    elem: 'Done editing',
                    type: 'text'
                }
            ]
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.table_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.EditShapePanel.superclass.onRender.apply(this, arguments); 
	},
    
	redrawClicked: function() {
		this.fireEvent('redraw-edit-act',this);
    },
    
    saveEditActivityClicked: function() {
        this.fireEvent('save-edit-act',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-edit-shape-panel', gwst.widgets.EditShapePanel);