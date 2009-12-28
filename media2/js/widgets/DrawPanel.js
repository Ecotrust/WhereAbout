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
        
		Ext.apply(this, {
			title: '3. Draw',
			bbar: [
				{xtype:'tbfill'},
				{
                    text: '<< Go Back',
                    handler: this.backBtnClicked.createDelegate(this)
                },
				{xtype:'tbseparator'},
				{
                    text: 'Continue >>',
                    handler: this.continueBtnClicked.createDelegate(this)
                }
			]
		});
		
        // Call parent (required)
        gwst.widgets.DrawPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    onRender: function(){
        // Call parent (required)
        gwst.widgets.DrawPanel.superclass.onRender.apply(this, arguments); 
        var html_text = '<p><b>Instructions:</b> \
			Draw your <i>'+ this.resource +'</i> '+ this.shape_name +'s on the map one at a time.  \
			<i>Draw only the areas you '+ this.action +' as a '+ this.user_group +'!</i></p><br />\
			\
			<p><b> How?</b></p> \
			<p> \
			a. Click once on the map to start a new boundary.  This creates the first point.\
			</p><br />\
			<p> \
			b. Move your mouse along your '+ this.shape_name +' boundary and click again creating a second point.\
			</p><br />\
			<p> \
			c. Continue clicking and tracing out your boundary one point at a time.  Just be as accurate as you can.\
			</p><br />\
			<p> \
			d. Double-click the last point to complete your boundary\
			</p><br />\
			<p> \
			e. If you make a mistake, click \'Cancel\' in the upper right and start over.\
			</p><br />\
			<p> <a href=http://www.google.com>Watch Demonstration Video</a></p><br />\
			<p><b>Example:</b></p><br />\
			<img src="/site-media/images/tux.png" style="width: 50px; height: 50px"><br />\
			<p><b>Note:</b> You can still use the arrow and zoom button while you\'re in the middle of drawing.</p>';
		var inner_panel = {
			html: html_text,
			style: 'margin: 10px',
			border: false
		};
		this.add(inner_panel);
	},
    
    backBtnClicked: function() {
        this.fireEvent('draw-back',this);
    },
    
    continueBtnClicked: function() {
        this.fireEvent('draw-cont',this);
    }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-panel', gwst.widgets.DrawPanel);