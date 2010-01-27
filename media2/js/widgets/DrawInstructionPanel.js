Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawInstructionPanel = Ext.extend(Ext.Panel, {
    // Constructor Defaults, can be overridden by user's config object
    shape_name: 'unknown',
    

    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
        Ext.apply(this, {
            style: 'margin: 5px; padding: 5px',
            width: 270,
            layout: 'table',
            cls: 'secondary-panel',
            border: 'none',
            defaults: {
                bodyStyle: 'border: none; padding: 5px'
            },
            layoutConfig: {
                columns: 2
            },    
            items: [{
                html: '<p> \
                    a. Click once on the map to create the first point.\
                    </p>'
            },{
                html: '<img src="/site-media/images/draw_1.png">'
            },{
                html: '<p> \
                    b. Move mouse and click to create a second point.\
                    </p>'
            },{
                html: '<img src="/site-media/images/draw_2.png">'
            },{
                html: '<p>\
                    c. Continue tracing being as accurate as you can.\
                    </p>'
            }, {
                html: '<img src="/site-media/images/draw_3.png">'
            },{
                html: '<p> \
                    d. Double-click the last point to complete your '+this.shape_name+'.\
                    </p>'
            },{
                html: '<img src="/site-media/images/draw_4.png">'
            },{
                html: '<p>\
                    e. If you make a mistake, click the \'Cancel\' button at the top.\
                    </p>'
            },{
                html: '<img src="/site-media/images/draw_5.png">'
            },{
                html: '<p>\
                    f. You can control the map while you\'re drawing.\
                    </p>'
            },{
                html: '<img src="/site-media/images/draw_6.png">'
            }]
        });
            

        // Call parent (required)
        gwst.widgets.DrawInstructionPanel.superclass.initComponent.apply(
          this, arguments);                     
    }
});
     
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-instruction-panel', gwst.widgets.DrawInstructionPanel);





