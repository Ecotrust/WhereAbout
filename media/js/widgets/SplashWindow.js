Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SplashWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){			
        this.addEvents('splash-finished');
    
		Ext.apply(this, {          
            title: 'Introduction',
        	layout:'fit',
        	modal: true,
            width:350,
            height:130,
            closeAction:'hide',
            closable: false,
            plain: true,
            bodyStyle: 'padding: 10px',
            html: "\
            	<p>The drawing portion will now begin for the <u><i>"+gwst.settings.survey_group_name+"</i></u> user group.  You will have instructions every step of the way \
            	on the left hand side of the screen.  You will also be able to come back and finish later \
            	if you need more time. \
            	",
            bbar: [
               {xtype:'tbfill', width:20},
               {
            	   text: 'Begin', 
            	   handler: this.finishSplash,
            	   iconCls: 'begin-draw',
            	   iconAlign: 'top',
                   scope: this
               }
           ]
        });
		gwst.widgets.SplashWindow.superclass.initComponent.call(this);		
	},
    
    finishSplash: function() {
        this.fireEvent('splash-finished',this);
    }    
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-splash-window', gwst.widgets.SplashWindow);