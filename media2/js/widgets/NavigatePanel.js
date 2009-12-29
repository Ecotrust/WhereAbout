Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.NavigatePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'navigate-panel',
	resource: 'unknown',
    shape_name: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('nav-cont');
        this.addEvents('nav-back');
		
		Ext.apply(this, {
			title: '2. Navigate The Map',
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
        gwst.widgets.NavigatePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getText());
    },
    
    getText: function() {
        var html_text = '<p class="top_instruct">\
			<b>Instructions:</b> Navigate the map to your primary <i>'+ this.resource +'</i> '+ this.shape_name +'.</p><br />\
			\
			<b> How?</b> \
			\
			<p> \
			a. First, turn on any maps you want from the \'Maps\' section on the top right. \
			Nautical charts are sufficient for most.  Click the checkbox \
			( <input type="checkbox"> ) \
			to turn them on or off.\
			</p><br />\
			\
			<p> \
			b. Navigate the map to your first '+ this.shape_name +'.  You can zoom in with the \
			<img style="width: 15px; height: 15px;" src="/site-media/third-party/OpenLayers-2.8/img/zoom-plus-mini.png"/> \
			button, zoom out with the \
			<img style="width: 15px; height: 15px;" src="/site-media/third-party/OpenLayers-2.8/img/zoom-minus-mini.png"/> \
			button or move the map around with the arrow buttons (\
			<img style="width: 15px; height: 15px;" src="/site-media/third-party/OpenLayers-2.8/img/west-mini.png"/> \
			<img style="width: 15px; height: 15px;" src="/site-media/third-party/OpenLayers-2.8/img/north-mini.png"/> \
			<img style="width: 15px; height: 15px;" src="/site-media/third-party/OpenLayers-2.8/img/east-mini.png"/> \
			<img style="width: 15px; height: 15px;" src="/site-media/third-party/OpenLayers-2.8/img/south-mini.png"/>).\
			</p><br />\
			\
			<p> \
			c. Once you\'re close, press the continue button.\
			</p><br />\
			\
			<p> <a href=http://www.google.com>Watch Demonstration</a></p>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getText(),
            id: 'nav_inner_panel',
			style: 'margin: 10px',
			border: false
		});
		this.add(this.inner_panel);
        
        // Call parent (required)
        gwst.widgets.NavigatePanel.superclass.onRender.apply(this, arguments); 
	},
    
    backBtnClicked: function() {
        this.fireEvent('nav-back',this);
    },
    
	continueBtnClicked: function() {
		this.fireEvent('nav-cont',this,this.resource);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-navigate-panel', gwst.widgets.NavigatePanel);