Ext.namespace('gwst', 'gwst.widgets');

/** Widgets for displaying fishing impact analysis results **/

gwst.widgets.FisheryImpactReportWindow = Ext.extend(Ext.Window, {    
    initComponent: function() {   
        var restartAction = {
            text: 'Load another report',
            scope: this,
            handler: function() {
                console.log('foo');
            }
        };

        var cancelAction = {
            text: 'Close',
            scope: this,
            handler: function() {
                this.hide();
            }
        };  
        
        this.reportPanel = new Ext.Panel({
            id: 'report-panel',
            style:'padding: 10px'
        });
        
        Ext.apply(this, {
            id: 'windowFisheryImpactReport',
            closeAction: 'hide',
            title: 'Fishery Impact Analysis Reports',
            closable: true,
            width: 380,
            height: 600,
            layout:'fit',
            items: [
                this.reportPanel
            ],
            buttons: [
                restartAction,
                cancelAction
            ]
        });  
        
        gwst.widgets.FisheryImpactReportWindow.superclass.initComponent.apply(this, arguments);
    },
    
    loadReport: function(result) {
        this.show();        
        Ext.get('report-panel').update(result);    
    }
}); 