/*
 * ControlToolbar
 * 
 * Toolbar providing access to various openlayers map controls.
 * 
 * Author - Tim Welch 
*/
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ControlToolbar = Ext.extend(mapfish.widgets.toolbar.Toolbar, {
    // Constructor Defaults, can be overridden by user's config object

    // Override other inherited methods 
    onRender: function(){
        // Before parent code

        // Call parent (required)
        gwst.widgets.ControlToolbar.superclass.onRender.apply(this, arguments);
        this.addControl(
            new OpenLayers.Control.Navigation({
                isDefault: true
            }), {
                iconCls: 'pan-icon', 
                toggleGroup: 'map1',
                tooltip:'Pan'
            }
        );  
        this.add(new Ext.Toolbar.Spacer());        
        this.addControl(
            new OpenLayers.Control.ZoomBox({
            	out:false
            }), {
                iconCls: 'zoom-icon', 
                toggleGroup: 'map1',
                tooltip:'Zoom In'
            }
        );              
        this.add(new Ext.Toolbar.Spacer());  


        /************ Measure Controls ************/

        // measurement controls
        var options = {
            handlerOptions: {
                persist: true
            },
            displaySystem: 'english'
        };
        
        // measure distance control
        var measureDistControl = new OpenLayers.Control.Measure(
              OpenLayers.Handler.Path, options
            );
            
        measureDistControl.events.on({
            "measure":this.handleMeasurements,
            "measurepartial":this.handleMeasurements,
            "activate": this.activateMeasurements,
            "deactivate": this.deactivateMeasurements,
            scope: this
            });
       
        this.add(new Ext.Toolbar.Spacer());        
        this.addControl(
            measureDistControl, 
            {
                iconCls: 'chart-line-icon', 
                toggleGroup: 'map1',
                tooltip:'Measure Distance'
            }
        );  

        // measure area control
        var measureAreaControl = new OpenLayers.Control.Measure(
                OpenLayers.Handler.Polygon, options
            );
            
        measureAreaControl.events.on({
            "measure":this.handleMeasurements,
            "measurepartial":this.handleMeasurements,
            "activate": this.activateMeasurements,
            "deactivate": this.deactivateMeasurements,
            scope: this
            });
            
        this.add(new Ext.Toolbar.Spacer());        
        this.addControl(
            measureAreaControl, 
            {
                iconCls: 'chart-bar-icon', 
                toggleGroup: 'map1',
                tooltip:'Measure Area'
            }
        );  
    },
    
    /**************** Measurement handlers ****************/
    
    handleMeasurements: function(event) {
        var geometry = event.geometry;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        var out = "";
        if(order == 1) {
            out += "Distance: " + measure.toFixed(3) + " " + units;     
        } else {
            out += "Area: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
        }
        
        this.measure_win.body.update( out );
    },
    
    activateMeasurements: function() {
        if (!this.measure_win) {
    		//Create new measurement window
            var button_english = new Ext.Button(gwst.actions.englishMeasurements);
            var button_metric = new Ext.Button(gwst.actions.metricMeasurements);
            var button_nautical = new Ext.Button(gwst.actions.nauticalMeasurements);
            
    		this.measure_win = new Ext.Window({
                title: 'Measurement Tool',
                html: 'Click the map to begin measuring.',
                height: 80,
                width: 200,
                resizable: false,
                closable: true,
                closeAction: 'hide',
                x: 139,
                y: 30,
                bbar: [ button_english, button_metric, button_nautical ]
            });
            this.measure_win.addListener("hide", this.cleanupMeasureWin, this);
            this.activate_count = 0;
    	}
        else
        {
            this.measure_win.body.update( 'Click the map to begin measuring.' );
        }
        this.activate_count++;
        this.measure_win.show();
    },
    
    deactivateMeasurements: function() {        
        if (this.measure_win) {
            this.activate_count--;
            if (this.activate_count == 0) {
                this.measure_win.hide();
            }
    	} else {
            this.activate_count = 0;
        }
    },
    
    cleanupMeasureWin: function() {
        if (this.activate_count > 0) {
            this._buttons[0].toggle();
        }
    }
    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-widgets-controltoolbar', gwst.widgets.ControlToolbar);