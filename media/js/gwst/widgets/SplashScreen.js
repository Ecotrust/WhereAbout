Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SplashScreen = Ext.extend(Ext.Panel, {
    // Constructor Defaults, can be overridden by user's config object
    id: 'panelSplashScreen',
    html:'',
    initComponent: function() {

        Ext.apply(this, {
            frame: true,
            title: 'Welcome to gwst',
            bodyStyle: 'padding:10px'
        });

        gwst.widgets.SplashScreen.superclass.initComponent.apply(this, arguments);
    }
    
});