Ext.namespace('gwst', 'gwst.widgets');



gwst.widgets.NavigatePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'navigate-panel',
	
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		Ext.apply(this, {
			title: '2. Navigate The Map',
			bbar: [
				{xtype:'tbfill'},
				{text: '<< Go Back'},
				{xtype:'tbseparator'},
				{text: 'Continue >>'}
			]
		});
		
				
        // Call parent (required)
        gwst.widgets.NavigatePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
	
    onRender: function(){
        // Call parent (required)
        gwst.widgets.NavigatePanel.superclass.onRender.apply(this, arguments); 
		var html_text = '<p>\
			<b>Instructions:</b> Navigate the map to your primary <i>'+ this.resource +'</i> grounds.</p><br />\
			\
			<b> How?</b>\n \
			\
			<p> \
			a. First, turn on any maps you want from the \'Maps\' section on the top right. \
			Nautical charts are sufficient for most.  Click the checkbox \
			<img src="/site-media/third-party/extjs2/resources/images/default"> \
			to turn them on or off.\
			</p><br />\
			\
			<p> \
			b. Navigate the map to your first fishing area.  You can zoom in with the \
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

		var inner_panel = {
			html: html_text,
			style: 'margin: 10px',
			border: false
		};
		this.add(inner_panel);
	}
});
 
// register xtype to allow for lazy initialization
Ext.reg('navigate-panel', gwst.widgets.NavigatePanel);