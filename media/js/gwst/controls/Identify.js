/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Handler/Click.js
 */

/**
 * Class: OpenLayers.Control.Identify
 * The identify control handles clicks on the map to perform queries on 
 * map layers.  This control really does nothing except capture single
 * clicks and passes them on to perform queries.
 * 
 * Inherits:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.Identify = OpenLayers.Class(OpenLayers.Control, {

    EVENT_TYPES: ['identify'],

    /**
     * APIProperty: handleRightClicks
     * {Boolean} Whether or not to handle right clicks. Default is false.
     */
    handleRightClicks: false,
    
    /**
     * Constructor: OpenLayers.Control.Navigation
     * Create a new navigation control
     * 
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *                    the control
     */
    initialize: function(options) {
        // concatenate identify events with those from the base
        this.EVENT_TYPES = OpenLayers.Control.Identify.prototype.EVENT_TYPES.concat(OpenLayers.Control.prototype.EVENT_TYPES);  	
        
        this.handlers = {};
        var clickCallbacks = {
        	'click':this.defaultSingleClick,
        	'dblclick':this.defaultSingleClick
        };
        var clickOptions = {
        	'single': true,
            'double': true,
            'stopSingle': true,
            'stopDouble': true
        };
        this.handlers.click = new OpenLayers.Handler.Click(
            this, clickCallbacks, clickOptions);
        this.handlers.click.setMap(Ext.getCmp('map').map);                
        OpenLayers.Control.prototype.initialize.apply(this, arguments);        
    },

    /**
     * Method: destroy
     * The destroy method is used to perform any clean up before the control
     * is dereferenced.  Typically this is where event listeners are removed
     * to prevent memory leaks.
     */
    destroy: function() {
        this.deactivate();
    },
    
    /**
     * Method: activate
     */
    activate: function() {    	
        this.handlers.click.activate();
        return OpenLayers.Control.prototype.activate.apply(this,arguments);
    },

    /**
     * Method: deactivate
     */
    deactivate: function() {
        this.handlers.click.deactivate();             
        return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
    },

    defaultSingleClick: function(evt) {
        this.events.triggerEvent('identify', {
        	xy: this.map.getLonLatFromViewPortPx(evt.xy)
        });    	
    },

    CLASS_NAME: "OpenLayers.Control.Identify"
});
