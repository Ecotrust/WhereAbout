Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.URLViewer = Ext.extend(Ext.Panel, {
    // Constructor Defaults, can be overridden by user's config object
    //id: 'urlViewer',
    html: '',
    title: '',
    url: '',
    load: function(url) {
        Ext.Ajax.request({
            url: this.url,
	    disableCachingParam: true,
            scope:this,
            success: function(response) {
                this.body.update(response.responseText);
            },
            failure: function() { 
                this.body.update('Sorry, there was an error requesting this content.');
            }
        });
    },

    initComponent: function() {

        Ext.apply(this, {
            frame: true,
            bodyStyle: 'padding:10px;overflow:auto'
        });

        gwst.widgets.URLViewer.superclass.initComponent.apply(this, arguments);

        this.load(this.url);
    }

});