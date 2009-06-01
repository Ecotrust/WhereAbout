/*
 * jQuery UI 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI
 */
jQuery.ui||(function(c){var i=c.fn.remove,d=c.browser.mozilla&&(parseFloat(c.browser.version)<1.9);c.ui={version:"1.7.1",plugin:{add:function(k,l,n){var m=c.ui[k].prototype;for(var j in n){m.plugins[j]=m.plugins[j]||[];m.plugins[j].push([l,n[j]])}},call:function(j,l,k){var n=j.plugins[l];if(!n||!j.element[0].parentNode){return}for(var m=0;m<n.length;m++){if(j.options[n[m][0]]){n[m][1].apply(j.element,k)}}}},contains:function(k,j){return document.compareDocumentPosition?k.compareDocumentPosition(j)&16:k!==j&&k.contains(j)},hasScroll:function(m,k){if(c(m).css("overflow")=="hidden"){return false}var j=(k&&k=="left")?"scrollLeft":"scrollTop",l=false;if(m[j]>0){return true}m[j]=1;l=(m[j]>0);m[j]=0;return l},isOverAxis:function(k,j,l){return(k>j)&&(k<(j+l))},isOver:function(o,k,n,m,j,l){return c.ui.isOverAxis(o,n,j)&&c.ui.isOverAxis(k,m,l)},keyCode:{BACKSPACE:8,CAPS_LOCK:20,COMMA:188,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38}};if(d){var f=c.attr,e=c.fn.removeAttr,h="http://www.w3.org/2005/07/aaa",a=/^aria-/,b=/^wairole:/;c.attr=function(k,j,l){var m=l!==undefined;return(j=="role"?(m?f.call(this,k,j,"wairole:"+l):(f.apply(this,arguments)||"").replace(b,"")):(a.test(j)?(m?k.setAttributeNS(h,j.replace(a,"aaa:"),l):f.call(this,k,j.replace(a,"aaa:"))):f.apply(this,arguments)))};c.fn.removeAttr=function(j){return(a.test(j)?this.each(function(){this.removeAttributeNS(h,j.replace(a,""))}):e.call(this,j))}}c.fn.extend({remove:function(){c("*",this).add(this).each(function(){c(this).triggerHandler("remove")});return i.apply(this,arguments)},enableSelection:function(){return this.attr("unselectable","off").css("MozUserSelect","").unbind("selectstart.ui")},disableSelection:function(){return this.attr("unselectable","on").css("MozUserSelect","none").bind("selectstart.ui",function(){return false})},scrollParent:function(){var j;if((c.browser.msie&&(/(static|relative)/).test(this.css("position")))||(/absolute/).test(this.css("position"))){j=this.parents().filter(function(){return(/(relative|absolute|fixed)/).test(c.curCSS(this,"position",1))&&(/(auto|scroll)/).test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0)}else{j=this.parents().filter(function(){return(/(auto|scroll)/).test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0)}return(/fixed/).test(this.css("position"))||!j.length?c(document):j}});c.extend(c.expr[":"],{data:function(l,k,j){return !!c.data(l,j[3])},focusable:function(k){var l=k.nodeName.toLowerCase(),j=c.attr(k,"tabindex");return(/input|select|textarea|button|object/.test(l)?!k.disabled:"a"==l||"area"==l?k.href||!isNaN(j):!isNaN(j))&&!c(k)["area"==l?"parents":"closest"](":hidden").length},tabbable:function(k){var j=c.attr(k,"tabindex");return(isNaN(j)||j>=0)&&c(k).is(":focusable")}});function g(m,n,o,l){function k(q){var p=c[m][n][q]||[];return(typeof p=="string"?p.split(/,?\s+/):p)}var j=k("getter");if(l.length==1&&typeof l[0]=="string"){j=j.concat(k("getterSetter"))}return(c.inArray(o,j)!=-1)}c.widget=function(k,j){var l=k.split(".")[0];k=k.split(".")[1];c.fn[k]=function(p){var n=(typeof p=="string"),o=Array.prototype.slice.call(arguments,1);if(n&&p.substring(0,1)=="_"){return this}if(n&&g(l,k,p,o)){var m=c.data(this[0],k);return(m?m[p].apply(m,o):undefined)}return this.each(function(){var q=c.data(this,k);(!q&&!n&&c.data(this,k,new c[l][k](this,p))._init());(q&&n&&c.isFunction(q[p])&&q[p].apply(q,o))})};c[l]=c[l]||{};c[l][k]=function(o,n){var m=this;this.namespace=l;this.widgetName=k;this.widgetEventPrefix=c[l][k].eventPrefix||k;this.widgetBaseClass=l+"-"+k;this.options=c.extend({},c.widget.defaults,c[l][k].defaults,c.metadata&&c.metadata.get(o)[k],n);this.element=c(o).bind("setData."+k,function(q,p,r){if(q.target==o){return m._setData(p,r)}}).bind("getData."+k,function(q,p){if(q.target==o){return m._getData(p)}}).bind("remove",function(){return m.destroy()})};c[l][k].prototype=c.extend({},c.widget.prototype,j);c[l][k].getterSetter="option"};c.widget.prototype={_init:function(){},destroy:function(){this.element.removeData(this.widgetName).removeClass(this.widgetBaseClass+"-disabled "+this.namespace+"-state-disabled").removeAttr("aria-disabled")},option:function(l,m){var k=l,j=this;if(typeof l=="string"){if(m===undefined){return this._getData(l)}k={};k[l]=m}c.each(k,function(n,o){j._setData(n,o)})},_getData:function(j){return this.options[j]},_setData:function(j,k){this.options[j]=k;if(j=="disabled"){this.element[k?"addClass":"removeClass"](this.widgetBaseClass+"-disabled "+this.namespace+"-state-disabled").attr("aria-disabled",k)}},enable:function(){this._setData("disabled",false)},disable:function(){this._setData("disabled",true)},_trigger:function(l,m,n){var p=this.options[l],j=(l==this.widgetEventPrefix?l:this.widgetEventPrefix+l);m=c.Event(m);m.type=j;if(m.originalEvent){for(var k=c.event.props.length,o;k;){o=c.event.props[--k];m[o]=m.originalEvent[o]}}this.element.trigger(m,n);return !(c.isFunction(p)&&p.call(this.element[0],m,n)===false||m.isDefaultPrevented())}};c.widget.defaults={disabled:false};c.ui.mouse={_mouseInit:function(){var j=this;this.element.bind("mousedown."+this.widgetName,function(k){return j._mouseDown(k)}).bind("click."+this.widgetName,function(k){if(j._preventClickEvent){j._preventClickEvent=false;k.stopImmediatePropagation();return false}});if(c.browser.msie){this._mouseUnselectable=this.element.attr("unselectable");this.element.attr("unselectable","on")}this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName);(c.browser.msie&&this.element.attr("unselectable",this._mouseUnselectable))},_mouseDown:function(l){l.originalEvent=l.originalEvent||{};if(l.originalEvent.mouseHandled){return}(this._mouseStarted&&this._mouseUp(l));this._mouseDownEvent=l;var k=this,m=(l.which==1),j=(typeof this.options.cancel=="string"?c(l.target).parents().add(l.target).filter(this.options.cancel).length:false);if(!m||j||!this._mouseCapture(l)){return true}this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet){this._mouseDelayTimer=setTimeout(function(){k.mouseDelayMet=true},this.options.delay)}if(this._mouseDistanceMet(l)&&this._mouseDelayMet(l)){this._mouseStarted=(this._mouseStart(l)!==false);if(!this._mouseStarted){l.preventDefault();return true}}this._mouseMoveDelegate=function(n){return k._mouseMove(n)};this._mouseUpDelegate=function(n){return k._mouseUp(n)};c(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);(c.browser.safari||l.preventDefault());l.originalEvent.mouseHandled=true;return true},_mouseMove:function(j){if(c.browser.msie&&!j.button){return this._mouseUp(j)}if(this._mouseStarted){this._mouseDrag(j);return j.preventDefault()}if(this._mouseDistanceMet(j)&&this._mouseDelayMet(j)){this._mouseStarted=(this._mouseStart(this._mouseDownEvent,j)!==false);(this._mouseStarted?this._mouseDrag(j):this._mouseUp(j))}return !this._mouseStarted},_mouseUp:function(j){c(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;this._preventClickEvent=(j.target==this._mouseDownEvent.target);this._mouseStop(j)}return false},_mouseDistanceMet:function(j){return(Math.max(Math.abs(this._mouseDownEvent.pageX-j.pageX),Math.abs(this._mouseDownEvent.pageY-j.pageY))>=this.options.distance)},_mouseDelayMet:function(j){return this.mouseDelayMet},_mouseStart:function(j){},_mouseDrag:function(j){},_mouseStop:function(j){},_mouseCapture:function(j){return true}};c.ui.mouse.defaults={cancel:null,distance:1,delay:0}})(jQuery);;
/*
 * Copyright (C) 2007-2008  Camptocamp
 *
 * This file is part of MapFish
 *
 * MapFish is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MapFish is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with MapFish.  If not, see <http://www.gnu.org/licenses/>.
 */

Ext.namespace('mapfish.widgets');

/**
 * Class: mapfish.widgets.MapComponent
 *
 * A map container in order to be able to insert a map into a complex layout
 * Its main interest is to update the map size when the container is resized
 *
 * Simple example usage:
 * > var mapcomponent = new mapfish.widgets.MapComponent({map: map});
 *
 * Inherits from:
 * - {Ext.Panel}
 */

/*
 * Constructor: mapfish.widgets.MapComponent
 * Create a new MapComponent.
 *
 * Parameters:
 * config - {Object} The config object
 */
mapfish.widgets.MapComponent = function(config) {
    Ext.apply(this, config);
    this.contentEl = this.map.div;

    // Set the map container height and width to avoid css 
    // bug in standard mode. 
    // See https://trac.mapfish.org/trac/mapfish/ticket/85
    var content = Ext.get(this.contentEl);
    content.setStyle('width', '100%');
    content.setStyle('height', '100%');
    
    mapfish.widgets.MapComponent.superclass.constructor.call(this);
};

Ext.extend(mapfish.widgets.MapComponent, Ext.Panel, {
    /**
     * Property: map
     * {OpenLayers.Map}  
     */
    map: null,

    initComponent: function() {
        mapfish.widgets.MapComponent.superclass.initComponent.apply(this, arguments);
        this.on("bodyresize", this.map.updateSize, this.map);
    }
});
Ext.reg('mapcomponent', mapfish.widgets.MapComponent);
 
/*
 * Copyright (C) 2007-2008  Camptocamp
 *
 * This file is part of MapFish Client
 *
 * MapFish Client is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MapFish Client is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MapFish Client.  If not, see <http://www.gnu.org/licenses/>.
 */

Ext.namespace('mapfish.widgets.toolbar');

/**
 * Class: mapfish.widgets.toolbar.Toolbar
 * A toolbar shows a set of OpenLayers Controls and handle activating them.
 *
 * Simple example usage:
 * (start code)
 * var toolbar = new mapfish.widgets.toolbar.Toolbar({map: map});
 * toolbar.render('buttonbar');
 * toolbar.addControl(
 *     new OpenLayers.Control.ZoomBox({title: 'Zoom in'}), 
 *     {iconCls: 'zoomin', toggleGroup: 'navigation'});
 * toolbar.addControl(
 *     new OpenLayers.Control.DragPan({title: 'Drag or pan', isDefault: true}), 
 *     {iconCls: 'pan', toggleGroup: 'navigation'});
 * toolbar.activate();
 * (end)
 *
 * Some attributes from the control are used by the toolbar:
 *  - isDefault: true for the default button of the given group.
 *  - title: will be used for the tooltip.
 *
 * On the Ext button side (second parameter of addControl), some options are of
 * interest:
 *  - toggleGroup: Name of the toggle group the button is member of.
 *  - iconCls: The CSS class for displaying the button.
 *
 * Inherits from:
 * - {Ext.Toolbar}
 */

/**
 * Constructor: mapfish.widgets.toolbar.Toolbar
 * Create a new Toolbar
 *
 * Parameters:
 * config - {Object} Config object
 */

mapfish.widgets.toolbar.Toolbar = function(config) {
    Ext.apply(this, config);
    mapfish.widgets.toolbar.Toolbar.superclass.constructor.call(this);
};

Ext.extend(mapfish.widgets.toolbar.Toolbar, Ext.Toolbar, {

    /**
     * Property: controls
     * Array({<OpenLayers.Control>})
     */
    controls: null,

    /**
     * Property: state
     * Object
     */
    state: null,

    /**
     * Property: configurable
     * Boolean
     */
    configurable: false,
    
    /** 
     * Property: _buttons 
     * Array({<Ext.Toolbar.Button>}) 
     * "buttons" is not available (already used in Ext.Toolbar)
     */ 
    _buttons: null,

    // private
    initComponent: function() {
        mapfish.widgets.toolbar.Toolbar.superclass.initComponent.call(this);
        this.controls = [];
        this._buttons = [];
        this.autoWidth = true;
        this.autoHeight = true;
        Ext.QuickTips.init();
    },

    /**
     * Method: addControl
     * Add a control to the toolbar, the control will be represented by a button
     *
     * Parameters:
     * control - {<OpenLayers.Control>}
     * options - the config object for the newly created Ext.Toolbar.Button
     *
     * Returns:
     * {<Ext.Toolbar.Button>} The added button instance
     */
    addControl: function (control, options) {
        control.visible = true;
        this.controls.push(control);
        this.map.addControl(control);
        var button = new Ext.Toolbar.Button(options);
        if (!button.tooltip) {
            button.tooltip = control.title;
        }
        button.enableToggle = (control.type != OpenLayers.Control.TYPE_BUTTON);
        if (control.isDefault) {
            button.pressed = true;
        }
        if (control.type == OpenLayers.Control.TYPE_BUTTON) {
            button.on("click", control.trigger, control);
        } else {
            button.on("toggle", function(button, pressed) {
                this.toggleHandler(control, pressed);
            }, this);

            //make sure the state of the control and the state of the button match
            var self = this;
            control.events.on({
                "activate": function() {
                    button.toggle(true);
                },
                "deactivate": function() {
                    button.toggle(false);
                    self.checkDefaultControl(button, control);
                }
            });
        }
        this.add(button);
        this._buttons.push(button);
        return button;
    },

    /**
     * Method: getControlByClassName
     * Pass in the CLASS_NAME of a control as a string and return the control itself
     *
     * Parameters: 
     * className - string
     *
     * Returns:
     * {<OpenLayers.Control>} The requested control.
     */
    getControlByClassName: function(className) {
        if (this.controls) {
            for (var i = 0;  i < this.controls.length; i++) {
                if (this.controls[i].CLASS_NAME == className) {
                    return this.controls[i];
                }
            }
        }
        return null;
    },

    /**
     * Method: getButtonForControl
     * Pass in a control and return the button attached to this control
     *
     * Parameters:
     * control - {<OpenLayers.Control>} A control which was previously added to the toolbar
     *
     * Returns:
     * {<Ext.Toolbar.Button>} The requested button.
     */
    getButtonForControl: function(control) { 
        if (this.controls) { 
            for (var i = 0;  i < this.controls.length; i++) { 
                if (this.controls[i] == control) { 
                    return this._buttons[i];
                } 
            } 
        } 
        return null;
    },

    /**
     * Method: activate
     * Activates the toolbar, either by restoring a given state (if configurable) or the default one.
     */
    activate: function() {
        if (this.configurable) {
            this.applyState(this.state);
            var mb = new Ext.Toolbar.Button({'text': '+'});
            mb.menu = new Ext.menu.Menu();
            for(var i = 0; i < this.controls.length; i++) {
                mb.menu.add({
                    'style': 'height:25px',
                    'text': '<div style="position: relative; left: 25px; top: -15px;" class="' + this._buttons[i].iconCls + '"/>',
                    checked: this.controls[i].visible,
                    scope: {
                        toolbar: this, 
                        button: this._buttons[i], 
                        control: this.controls[i]
                    },
                    checkHandler: function(item, checked) {
                        if (checked) {
                            this.control.visible = true;
                            if (this.control.isDefault) {
                                this.control.activate();
                            } 
                            this.button.show();
                        } else {
                            this.control.visible = false;
                            this.control.deactivate();
                            this.button.hide();
                        }
                        this.toolbar.saveState();
                    }
                });
            }
            this.add(mb);
        } else {
            for (var j = 0, c; j < this.controls.length; j++) {
                c = this.controls[j];
                if(c.isDefault) {
                    c.activate();
                }
            }
        }
    },

    /**
     * Method: deactivate
     * Deactivates all controls in this toolbar.
     */
    deactivate: function() {
        for(var i = 0; i < this.controls.length; i++) {
            this.controls[i].deactivate();
        }
    },

    /**
     * Method: applyState
     * Apply the state to the toolbar upon loading
     *
     * Parameters:
     * state - {<Object>}
     */
    applyState: function(state){
        if (!state) {
            return false;
        }
        this.state = state;
        var cs = state.controls;
        if (cs) {
            for(var i = 0, len = cs.length; i < len; i++) {
                var s = cs[i];
                var c = this.getControlByClassName(s.id);
                if (c) {
                    c.visible = s.visible;
                    if (!c.visible) {
                        this._buttons[i].hide();
                    }
                }
            }
        }
    },

    /**
     * Method: getState
     * Function that builds op the state of the toolbar and returns it
     */
    getState: function() {
        var o = {controls: []};
        for (var i = 0, c; i < this.controls.length; i++) {
            c = this.controls[i];
            o.controls[i] = {
                id: c.CLASS_NAME,
                visible: c.visible
            };
        }
        return o;
    },

    /**
     * Method: toggleHandler
     * Called when a button is toggled.
     *
     * Parameters:
     * button - {<Ext.Toolbar.Button>}
     * control - {<OpenLayers.Control>}
     */
    toggleHandler: function(control, pressed) {
        if(pressed != control.active) {
            if (pressed) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
    },

    /**
     * Method: checkDefaultControl
     * Check if there is a control active in the button's group. If not,
     * activate the default one (if any).
     *
     * Parameters:
     * button - {<Ext.Toolbar.Button>}
     * control - {<OpenLayers.Control>}
     */
    checkDefaultControl: function(button, control) {
        var group = button.toggleGroup;
        if(group) {
            var defaultControl = null;
            for (var j = 0; j < this.controls.length; j++) {
                var curButton = this._buttons[j];
                if(curButton.toggleGroup == group) {
                    var control = this.controls[j];
                    if(control.active) {
                        //found one button active in the group => OK
                        return;
                    } else if(control.isDefault) {
                        defaultControl = control;
                    }
                }
            }

            if(defaultControl) {
                //no active control found, activate the group's default one
                defaultControl.activate();
            }
        }        
    }
});
Ext.reg('toolbar', mapfish.widgets.toolbar.Toolbar);

Ext.namespace('gwst');

gwst.config = {
    adminEmail: 'admin@gwst.org',
    identifyBboxRadius: 500,
    projection: new OpenLayers.Projection("EPSG:900913"),
    displayProjection: new OpenLayers.Projection("EPSG:4326"),
    equalAreaProjection: new OpenLayers.Projection("EPSG:3310")
};

Ext.Ajax.timeout = 120000;
/**
 * @class Ext.grid.SmartCheckboxSelectionModel
 * @extends Ext.grid.RowSelectionModel
 *
 * A custom selection model that renders a column of checkboxes that can be toggled to select or deselect rows.
 * By passing in a dataIndex and a store, it can pre-check (and select) rows after it renders.
 * Included are all the standard navigation options of a RowSelectionModel, including Up/Down arrow keyMaps and Ctrl/Shift selections.
 *
 * @param         (object)         config         The configuration options, as highlighted below
 * @param        (string)        dataIndex    The field that contains the boolen true/false value for checked/selected rows        
 *
 * @copyright    June 4, 2008    <last updated: July 1, 2008>
 * @author        Noah Kronemeyer    <nkronemeyer@therubicongroup.com>
 * @version        1.7
 */
Ext.grid.SmartCheckboxSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {
    /**
     * @header (string)        Any valid text or HTML fragment to display in the header cell for the checkbox column
     *                         (defaults to '<div id="x-grid3-hd-checker" class="x-grid3-hd-checker"> </div>').  The default CSS
     *                        class of 'x-grid3-hd-checker' displays a checkbox in the header and provides support
     *                        for automatic check all/none behavior on header click. This string can be replaced by
     *                        any valid HTML fragment, but if you use a simple text string (e.g., 'Select Rows'), you must include it
     *                        in the following format: <div id="x-grid3-hd-checker">&nbsp;Simple String</div>, in addition
     *                         the automatic check all/none behavior will only work if the 'x-grid3-hd-checker' class is supplied.
     */
    header: '<div id="x-grid3-hd-checker" class="x-grid3-hd-checker"> </div>',
    /**
     * @width        (int)    The default width in pixels of the checkbox column (defaults to 20).
     */
    width: 20,
    /**
     * @sortable    (bool)    Set to true if you want the checkbox column to be sortable.
     */
    sortable: false,
    /**
     * @email        (bool)    Will mimic email client functionality by separating out the selection of rows
     *                        with the checking of rows, similar to how Yahoo! or Gmail works. One could then
     *                        apply different actions on checked rows vs. selected rows.
     *                        Defaults to false. 
     */
    email: false,
    /**
     * @excel        (bool)    Mimics excel functionality when clicking on rows or checkboxes. If set to true,
     *                        all other rows will be deselected and unchecked except the row you most recently
     *                        clicked. If set to false, all previous selections will remain selected and/or checked
     *                        as you click around the grid (as if you were holding down CTRL and clicking).
     *                        Defaults to false. 
     */
    excel: true,
    
    /**
     * @alwaysSelectOnCheck        
     *                (bool)    If set to true, clicking a checkbox will always select the row, working in conjunction
     *                        with the email option.
     *                        Defaults to false.
     *
     */
    alwaysSelectOnCheck: false,
    
    // private
    menuDisabled:true,
    fixed:true,
    id: 'checker',
    dataIndex: '', // Define the dataIndex when you construct the selectionModel, not here

    // private
    initEvents : function(){
        // Call the parent
        Ext.grid.SmartCheckboxSelectionModel.superclass.initEvents.call(this);
        // Assign the handlers for the mousedown events
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.on('columnmove', this.onColumnMove, this);
            view.mainBody.on('mousedown', this.onMouseDown, this);
            Ext.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);
        }, this);        
           // Disable the rowNav created in our parent object, otherwise pressing DOWN will go down two rows!
        this.rowNav.disable();
        // Create our new rowNav that controls checkboxes as well
        this.rowNav2 = new Ext.KeyNav(this.grid.getGridEl(), {
            "up" : function(e){
                if(!e.shiftKey){
                    if(!this.email){ this.selectPreviousChecked(e.shiftKey); }
                    if(this.email){ this.selectPrevious(e.shiftKey); }
                }
                else if(this.last !== false && this.lastActive !== false){
                    var last = this.last;
                    if(!this.email){ this.selectRangeChecked(this.last, this.lastActive-1); }
                    if(this.email){ this.selectRange(this.last,  this.lastActive-1); }
                    this.grid.getView().focusRow(this.lastActive);
                    if(last !== false){
                        this.last = last;
                    }
                }
                else{
                    this.selectFirstRow();
                    if(!this.email){ this.toggleChecked(0, true); }
                }
            },
            "down" : function(e){
                if(!e.shiftKey){
                    if(!this.email){ this.selectNextChecked(e.shiftKey); }
                    if(this.email){ this.selectNext(e.shiftKey); }
                }
                else if(this.last !== false && this.lastActive !== false){
                    var last = this.last;
                    if(!this.email){ this.selectRangeChecked(this.last, this.lastActive+1); }
                    if(this.email){ this.selectRange(this.last,  this.lastActive+1); }
                    this.grid.getView().focusRow(this.lastActive,true);
                    if(last !== false){
                        this.last = last;
                    }
                }
                else{
                    this.selectFirstRow();
                    if(!this.email){ this.toggleChecked(0, true); }
                }
            },
            scope: this
        });
        // Listen for the movement of the columns  
        this.grid.on('columnmove', function(p){
            var t = Ext.get('x-grid3-hd-checker');
            if(t != null){
                if(t.dom.className != 'x-grid3-hd-checker'){
                       Ext.fly(t.dom.parentNode).removeClass('x-grid3-hd-checker');
                }
            }
        });
        // If we sent a store to the selModel, auto-select rows based on dataIndex
        if (this.grid.store){
            this.grid.store.on('load', function(p){
                // This block of code checks the status of the checkbox header, 
                // and if checked, will check all other checkboxes (but not on the initial load)
                var t = Ext.get('x-grid3-hd-checker');
                if(t != null){
                    if(t.dom.className == 'x-grid3-hd-checker' && Ext.state.Manager.loaded){
                        var hd = Ext.fly(t.dom.parentNode);
                        var isChecked = hd.hasClass('x-grid3-hd-checker-on');
                        if(isChecked){
                            hd.addClass('x-grid3-hd-checker-on');
                            if(!this.email){ this.selectAll(); }
                            this.selectAllChecked(true);
                        }
                    }
                    else{
                           Ext.fly(t.dom.parentNode).removeClass('x-grid3-hd-checker');
                    }
                }
            
                // This block of code will pre-select checkboxes based on the dataIndex supplied,
                // but only on the initial load.
                  var dataIndex = this.grid.getSelectionModel().dataIndex; // the dataIndex for the selectionModel
                  var count = this.grid.store.getCount();
                for(var i = 0, len = count; i < len; i++){
                    var dataIndexValue = p.data.items[i].data[dataIndex]; // the value of the dataIndex for each row
                    var isSelected = this.isSelected(i);
                    if((dataIndexValue == true || isSelected) && !Ext.state.Manager.loaded){
                        // This code will only run the first time a grid is loaded 
                        // Make sure that any "checked" rows are also selected
                        if(!this.email || this.alwaysSelectOnCheck){ this.grid.getSelectionModel().selectRow(i, true); }
                    }
                    else if(isSelected){
                        // Let the state.Manager check the correct rows now
                        if(!this.email){ this.toggleChecked(i, true); }
                    }
                    else{
                        // Uncheck everything else
                        if(!this.email){ this.toggleChecked(i, false); }
                    }
                }
            }, this);
        }
    },

    /**
     * private function that controls the checkboxes
     *
     * @param    (int)    rowIndex    the row you want to toggle
     * @param    (bool)    c            optional flag set to either true (to check) or false (to uncheck)
     *                                if no second param, the checkbox will toggle itself 
     */
    toggleChecked : function(rowIndex, c){
        if(this.locked) return;
           var record = this.grid.store.getAt(rowIndex);
        if(c === true){
                // Check
                record.set(this.dataIndex, true);
                
                //hack added by ANP to remove extraneous row when using a grouping view
//                var arow = this.grid.getView().getRow(rowIndex + this.grid.view.emptyArrays.length)
//                arow.parentNode.removeChild(arow)
           }
           else if(c === false){
               // Uncheck
               record.set(this.dataIndex, false);

               //hack added by ANP to remove extraneous row when using a grouping view
//               var arow = this.grid.getView().getRow(rowIndex + this.grid.view.emptyArrays.length)
//               arow.parentNode.removeChild(arow)
           }
           else{
               // Toggle checked / unchecked
               record.set(this.dataIndex, !record.data[this.dataIndex]);
           }
        if(this.onToggle){
            this.onToggle(this, rowIndex, c);
        }
    },

    /**
     * private functions that toggles all checkboxes on or off depending on param
     *
     * @param    (bool)    c        true to check all checkboxes, false to uncheck all checkboxes        
     * @param    (int)    e        (optional) if an exception is given, all rows will be checked/unchecked except this row        
     */
    selectAllChecked : function(c, e){
        if(this.locked) return;
         var count = this.grid.store.getCount();
        for(var i = 0, len = count; i < len; i++){
            if(c){
                if(i !== e){
                    this.toggleChecked(i, true);
                }
            }
            else{
                if(i !== e){
                    this.toggleChecked(i, false);
                }
            }
        }            
    },
    
    /**
     * private function that clears all checkboxes
     * specifically used to deal with shift+arrow keys,
     * but can also be called with fast param to quickly uncheck everything
     *
     * @param    (bool)    fast    true to quickly deselect everything with no exceptions
     */
    clearChecked : function(fast){
        if(this.locked) return;
        if(fast !== true){
            var count = this.grid.store.getCount();
            for(var i = 0, len = count; i < len; i++){
                var isSelected = this.isSelected(i);
                if(!isSelected){
                    this.toggleChecked(i, false);
                }
            }
        }
        else{
            // Quick and dirty method to uncheck everything
            this.selectAllChecked(false);
        }
        this.last = false;
    },    
    
    /**
     * private function used in conjuction with the shift key for checking multiple rows at once
     */
    selectRangeChecked : function(startRow, endRow, keepExisting){
        if(this.locked) return;
        if(!keepExisting){
            if(!this.email || this.alwaysSelectOnCheck){ this.clearSelections(); }
            this.clearChecked();
        }    
        if(startRow <= endRow){
            for(var i = startRow; i <= endRow; i++){
                if(this.grid.store.getAt(i)){
                    this.toggleChecked(i, true);
                    if(!this.email || this.alwaysSelectOnCheck){ this.selectRow(i, true); }
                }
            }
        }
        else{
            for(var i = startRow; i >= endRow; i--){
                if(this.grid.store.getAt(i)){
                    this.toggleChecked(i, true);
                    if(!this.email || this.alwaysSelectOnCheck){ this.selectRow(i, true); }
                }
            }
        }    
    },
    /**
     * private function that is used with the UP arrow keyMap
     */
    selectPreviousChecked : function(keepExisting){
        if(this.hasPrevious()){
            // Select the next row
            this.selectRow(this.last-1, keepExisting);
            // Set the focus
            this.grid.getView().focusRow(this.last);
            if(!this.email){         
                // Check the current (selected) row
                this.toggleChecked(this.last, true);
                // Uncheck all other rows
                this.selectAllChecked(false, this.last);
            }
            return true;
        }
        return false;
    },
    /**
     * private function that is used with the DOWN arrow keyMap
     */      
    selectNextChecked : function(keepExisting){
        if(this.hasNext()){
            // Select the next row
            if(!this.email){ this.selectRow(this.last+1, keepExisting); }
            // Set the focus
            this.grid.getView().focusRow(this.last);
            if(!this.email){      
                // Check the current (selected) row
                this.toggleChecked(this.last, true);
                // Uncheck all other rows
                this.selectAllChecked(false, this.last);
            }
            return true;
        }
        return false;
    },    
   
    /**
     * private function that executes when you click on any row
     * will keep other row selections active as you click around
     */
    handleMouseDown : function(g, rowIndex, e){
        var t = e.getTarget('.ux-row-action-item');
        if(!t) {
            if(e.button !== 0 || this.isLocked()){
                return;
            };
            var view = this.grid.getView();
            var record = this.grid.store.getAt(rowIndex);
            if(e.shiftKey && this.last !== false){
                var last = this.last;
                this.selectRange(last, rowIndex, e.ctrlKey);
                if(!this.email){ this.selectRangeChecked(last, rowIndex, e.ctrlKey); }
                this.last = last; // reset the last
                view.focusRow(rowIndex);
            }else{
                var isChecked = record.data[this.dataIndex];
                var isSelected = this.isSelected(rowIndex);
                
                if (isSelected){
                    this.deselectRow(rowIndex);
                    if(!this.email){ this.toggleChecked(rowIndex, false); }
                }else{
                    if(!this.excel){
                        this.selectRow(rowIndex, true);
                        if(!this.email){ 
                            this.toggleChecked(rowIndex, true);
                        }
                    }
                    else{
                        this.selectRow(rowIndex, e.ctrlKey);
                        if(!this.email){
                            this.selectRangeChecked(rowIndex, rowIndex, e.ctrlKey);
                        }
                    }
                    view.focusRow(rowIndex);
                }
            }
        }
    },
    /**
     * private function restricted to execute when you click a checkbox itself
     */
    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            // Define variables
            var view = this.grid.getView();
            var rowIndex = view.findRowIndex(t);
            var record = this.grid.store.getAt(rowIndex);            
            var isSelected = this.isSelected(rowIndex);
            var isChecked = record.data[this.dataIndex];
            // Logic to select/de-select rows and the checkboxes
            if(!this.email || this.alwaysSelectOnCheck){
                if (isSelected){
                    if(!isChecked && this.alwaysSelectOnCheck){
                        this.toggleChecked(rowIndex, true);
                    }
                    else{
                        this.deselectRow(rowIndex);
                        this.toggleChecked(rowIndex, false);
                    }
                }
                else{
                    this.selectRow(rowIndex, true);
                    this.toggleChecked(rowIndex, true);
                    view.focusRow(rowIndex);
                }
            }
            else{
                if (isChecked){
                    this.toggleChecked(rowIndex, false);
                }
                else{
                    this.toggleChecked(rowIndex, true);
                }
            }
            view.focusRow(rowIndex);
        }
        // Load the state manager
           Ext.state.Manager.setProvider(new Ext.state.CookieProvider());            
           Ext.state.Manager.loaded = true;            
    },
    

    /**
     * private function that executes when you click the checkbox header
     */
    onHdMouseDown : function(e, t){
        if(t.className == 'x-grid3-hd-checker'){
            e.stopEvent();
            var hd = Ext.fly(t.parentNode);
            var isChecked = hd.hasClass('x-grid3-hd-checker-on');
            if(isChecked){
                hd.removeClass('x-grid3-hd-checker-on');
                if(!this.email || this.alwaysSelectOnCheck){ this.clearSelections(); }
                this.clearChecked(true); // the true param enables fast mode
            }else{
                hd.addClass('x-grid3-hd-checker-on');
                if(!this.email || this.alwaysSelectOnCheck){ this.selectAll(); }
                this.selectAllChecked(true);
            }
        }
        // Load the state manager
           Ext.state.Manager.setProvider(new Ext.state.CookieProvider());            
           Ext.state.Manager.loaded = true;            
    },
    
    /**
     * private function that renders the proper checkbox based on your dataIndex variable
     *
     * @param    (varchar)    v        the dataIndex passed into the selectionModel that contains whether a row is checked by default or not
     */
    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'"> </div>';
    }
});
Ext.namespace('gwst', 'gwst.data');

gwst.data.StudyRegion = Ext.data.Record.create([
    {name: 'name'},
    {name: 'bounds'}
]);

gwst.data.StudyRegion.prototype.extent = function(){
    return OpenLayers.Bounds.fromString(this.data.bounds);
};
Ext.namespace('gwst', 'gwst.data');

/*
 * Unique layer_id's are assigned to each OL layer object so they can be tracked throughout gwst 
 */

//Layer index constants
var NAME = 0;
var GROUP = 1;
var LAYER = 2;
var LEGEND = 3;
var DESC = 4;
var META = 5;
var DEFAULT_ON = 6;

/*Constraining the zoom levels on a google layer affects the zoom indexes.  
 * if google min zoom level is 7 then google zoom level 7 will now be 
 * referenced in OL at zoom index 0. The problem is the TMS tilecaches are 
 * setup to expect 0-18 so they're URL's need to be offset using MIN_ZOOM_LEVEL
 * in their getURL functions.
*/ 
gwst.data.MIN_ZOOM_LEVEL = 7;
gwst.data.MAX_ZOOM_LEVEL = 18;
gwst.data.TERRAIN_MAX_ZOOM_LEVEL = 15;

var getLegendParams = {
    service: "WMS",
    version: "1.1.1",
    request: "GetLegendGraphic",
    exceptions: "application/vnd.ogc.se_inimage",
    format: "image/png"
};

gwst.data.GoogleTerrain = new OpenLayers.Layer.Google(
    "Google Terrain" , 
    {
        type: G_PHYSICAL_MAP,
        'sphericalMercator': true,
        MIN_ZOOM_LEVEL: gwst.data.MIN_ZOOM_LEVEL,
        MAX_ZOOM_LEVEL: gwst.data.MAX_ZOOM_LEVEL,
        projection: new OpenLayers.Projection("EPSG:900913") 
    }
);

gwst.data.GoogleSat = new OpenLayers.Layer.Google(
    "Satellite/Aerial Imagery" , 
    {
        type: G_SATELLITE_MAP,
        'sphericalMercator': true,
        MIN_ZOOM_LEVEL: gwst.data.MIN_ZOOM_LEVEL,
        MAX_ZOOM_LEVEL: gwst.data.MAX_ZOOM_LEVEL,
        projection: new OpenLayers.Projection("EPSG:900913")
    }
);

gwst.data.DataLayers = [
    [
        'Satellite/Aerial Imagery',
        'Base',
         gwst.data.GoogleSat,
        '/site-media/js/openlayers/img/blank.gif',
        'Google satellite/aerial imagery',
        'Insert link here'        
    ],[
        'Bathymetry',
        'Base',
        new OpenLayers.Layer.TMS( 
            "Bathymetry", 
            ["http://gwst.org/tiles/Bathymetry/"], 
            {
                layer_id: 1,
                layername: 'Bathymetry',                 
                buffer: 1,                
                'isBaseLayer': false,
                'opacity': 0.75,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/Bathymetry/Legend.png',
        'Bathymetric Shaded Relief',
        'Resolution is 200 meters. The original grid file was made from 75 original tiled DEMs that were mosaicked into one grid and resampled to 200 meters.  These mosaicked DEMs were produced by Teale Data Center from a contract with the Department of Fish and Game, funded by the Resources Agency.'        
    ],[
        'Nautical Charts',
        'Base',
        new OpenLayers.Layer.TMS( 
            "Nautical Charts", 
            ["http://gwst.org/tiles/Charts/"], 
            {
                layer_id: 2,
                layername: 'Charts', 
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/Charts/Legend.png',        
        'NOAA Nautical Charts',
        'Scanned and georeferenced NOAA nautical charts at varying resolutions.'
  ],[
        'Study Region',
        'Base',
        new OpenLayers.Layer.TMS(
            "Study Region",
            ["http://gwst.org/tiles/StudyRegion/"],
            {
                layer_id: 3,
                layername: 'StudyRegion',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 7 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/StudyRegion/Legend.png',
        'MLPA Initiative South Coast Study Region',
        'Study region boundary for the Marine Life Protection Act (MLPA) South Coast Study Region. The South Coast Study Region is broken into 7 subregions which are intended to represent logical biogeographic subunits.',
        true
    ],[
        'Graticules',
        'Base',
        new OpenLayers.Layer.TMS(
            "Graticules",
            ["http://gwst.org/tiles/Graticules/"],
            {
                layer_id: 4,
                layername: 'Graticules',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 7 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/Graticules/Legend.png',
        'Graticules at 10, 5 and 1 minute',
        'No Metadata'
    ],[
        'Coastal Energy',
        'Management',
        new OpenLayers.Layer.TMS(
            "Coastal Energy",
            ["http://gwst.org/tiles/CoastalEnergy/"],
            {
                layer_id: 5,
                layername: 'CoastalEnergy',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/CoastalEnergy/Legend.png',
        'Coastal Energy',
        'Active desalination facilities on the California coast as of 2008. Locations were provided by  California Department of Fish and Game.The power plant data layer for the power plants located in the south coast study region. The information provided by the California Energy Commission under strict usage guidelines. For cartographic display only. The oil platforms data layer represents locations of oil platforms offshore of California. Developed for Department of Fish and Game, Office of Spill Prevention and Response. November 20, 2002.'
    ],[
        'Recreational Fishing',
        'Consumptive',
        new OpenLayers.Layer.TMS(
            "Recreational Fishing",
            ["http://gwst.org/tiles/RecreationalFishing/"],
            {   
                layer_id: 6,
                layername: 'RecreationalFishing',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/RecreationalFishing/Legend.png',
        'Recreational Fishing',
        'The kayak launch sites data layer depicts point locations as identified by Kayak Fishing Association of California based on survey results.  The information was collected in 2008. The spearfishing competition sites data layer depicts specific dive sites along the California coast as used by the Central California Diving Council (CenCal) for freedive spearfishing competitions. These data are a subset of fishing locations compiled by David VenTresca, California Department of Fish and Game.The fishing piers and jetties data layer is all public piers and jetties used by California Recreational Fisheries Survey (CRFS), as identified by Pacific States Marine Fisheries Commission between 2007 to 2008. The kayak fishing areas data layer demarcates areas identified by Kayak Fishing Association of California based on survey results.  The information was collected in 2008.'
    ],[
        'Coastal Access and Recreation',
        'Non-Consumptive Use',
        new OpenLayers.Layer.TMS(
            "Coastal Access and Recreation",
            ["http://gwst.org/tiles/CoastalAccessRecreation/"],
            {
                layer_id: 7,
                layername: 'CoastalAccessRecreation',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/CoastalAccessRecreation/Legend.png',
        'Coastal Access and Recreation',
        'The boat launch sites dataset represents Table 5.9-9 in the MLPA South Coast Study Region Regional Profile.  Locations were researched on the Internet and placed accordingly by DFGs Marine Region GIS Lab.  The shore dive sites data layer depicts shore diving locations for Southern California from <a href="http://www.shorediving.com/Earth/USA_West/CalS/index.htm" target="_blank">here</a>. The kayak launch sites data layer depicts point locations as identified by Kayak Fishing Association of California based on survey results.  The information was collected in 2008.  The coastal access points data layer shows the locations and facilities of the beach access points and coastal features of interest documented by the California Coastal Access Guide, which was published in 2002. The harbors data layer  is a subset of place names from a California statewide extract features from the USGS Geographic Names Information System (GNIS), provided by USGS GNIS staff, dated January 2006 The ports data layer identifies 194 marine and inland port locations used by marine fisheries for the landing and sale of fish and invertebrates. The data layer was created by the California Department of Fish and Game in 2001.'
    ],[
        'Research and Monitoring',
        'Management',
        new OpenLayers.Layer.TMS(
            "Coastal Access and Recreation",
            ["http://gwst.org/tiles/ResearchMonitoring/"],
            {
                layer_id: 8,
                layername: 'ResearchMonitoring',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/ResearchMonitoring/Legend.png',
        'Research Institutions and Monitoring Locations',
        'The research institutions data layer provides location information (address and lat/long) for the marine research and education institutions in and around the MLPA study region from Point Conception to Pigeon Point. The data was developed by the University of California Santa Barbara in 2006. The marine monitoring sites data layer provides location information for marine monitoring sites in and around the MLPA study region. The data was developed by the University of California Santa Barbara in 2006.Monitoring sites for the Cooperative Research and Assessment of Nearshore Ecosystems (CRANE) survey.  Diver surveys are conducted using PISCO protocols to characterize fish, invertebrate and macroalgal assemblages.'
    ],[
        'Estuaries',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Estuaries",
            ["http://gwst.org/tiles/Estuaries/"],
            {
                layer_id: 9,
                layername: 'Estuaries',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/Estuaries/Legend.png',
        'Estuaries',
        'The estuaries data layer is from the U.S. Fish and Wildlife Service, National Wetlands Survey, NOAA ESI (2004).'
    ],[
        'Agricultural Impacts to Watersheds',
        'Physical',
        new OpenLayers.Layer.TMS(
            "Agricultural Impacts to Watersheds",
            ["http://gwst.org/tiles/CoastalWatershedsImpactAgriculture/"],
            {
                layer_id: 10,
                layername: 'CoastalWatershedsImpactAgriculture',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.9,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/CoastalWatershedsImpactAgriculture/Legend.png',
        'Agricultural Impacts to Coastal Watersheds',
        'Shows the presence of Agricultural Areas provided by National Oceanic and Atmospheric Administration (NOAA). The Agricultural Impact on Coastal Watersheds layer shows the percentage of urban areas within major watersheds. It has been created by performing a spatial intersection between major watershed (Watershed Map of 1999, Calwater 2.2.1)  and agricultural areas provided by NOAA.'
    ],[
/*        'Substrate Proxy (0-30m)',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Substrate Proxy (0-30m)",
            ["http://gwst.org/tiles/LinearSubstrate/"],
            {
                layer_id: 11,
                layername: 'LinearSubstrate',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/LinearSubstrate/Legend.png',
        'Substrate Proxy (0-30m)',
        'The Substrate Proxy (0-30m) data layer was developed by PISCO to conduct an initial evaluation of MPAs in the south coast study region of the MLPA process. This line was developed using course scale area substrate data and will be replaced by a line developed from higher resolution data as soon as it becomes available. These data should be replaced by approximately November 2008.'
    ],[
*/        'Urban Impacts to Watersheds',
        'Physical',
        new OpenLayers.Layer.TMS(
            "Urban Impacts to Watersheds",
            ["http://gwst.org/tiles/CoastalWatershedsImpactUrban/"],
            {
                layer_id: 12,
                layername: 'CoastalWatershedsImpactUrban',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.9,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/CoastalWatershedsImpactUrban/Legend.png',
        'Urban Impacts to Coastal Watersheds',
        'The Urban Impact on Coastal Watersheds layer shows the percentage of urban areas within major watersheds. It has been created by performing a spatial intersection between major watershed (Watershed Map of 1999, Calwater 2.2.1) and urban areas provided by National Oceanic and Atmospheric Administration (NOAA). Shows the presence of Urban Areas provided by NOAA.'
    ],[
        'Cowcod Conservation Area',
        'Management',
        new OpenLayers.Layer.TMS(
            "Cowcod Conservation Area",
            ["http://gwst.org/tiles/CowcodConservationArea/"],
            {    
                layer_id: 13,
                layername: 'CowcodConservationArea',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/CowcodConservationArea/Legend.png',
        'Cowcod Conservation Area',
        'The cowcod conservation area data layer depicts the Cowcod management boundaries based on California Code Title 14, section 150.06.  California Department of Fish and Game, Marine Region January 2003.'
    ],[
        'Managed Areas',
        'Management',
        new OpenLayers.Layer.TMS(
            "Managed Areas",
            ["http://gwst.org/tiles/ExistingMarineandCoastalManagedAreas/"],
            {    
                layer_id: 14,
                layername: 'ExistingMarineandCoastalManagedAreas',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/ExistingMarineandCoastalManagedAreas/Legend.png',
        'Existing Marine and Coastal Managed Areas',
        'The aquaculture layer outlines aquaculture seabed lease locations in California.  The layer does not include any aquaculture activities that take place on land.   Data provided by Tom Moore, California Department of Fish and Game. The kelp bed leases data layer identifies areas of kelp management in the south coast study region. Digitized from existing kelp maps, these maps were produced by the California Department of Fish and Game in 1989. The terrestrial managed areas data layer was developed by the California Resources Agency Legacy Project in 2004 and updated by the Nature Conservancy in March 2005. The Channel Islands National Marine Sanctuary  layer shows the legal boundaries of  this National Marine Sanctuary as defined within the Code of Federal Regulations, at 15 C.F.R. Part 922 and the subparts for each national marine sanctuary.  This data was provided by NOAA / National Marine Sanctuaries Program and published in 2004. These data include all of Californias marine protected areas that do not have associated Department of Fish and Game fishing regulations of 2004. Data was provided b California Department of Fish and Game, Marine Region GIS Lab. Published in 2004.'
    ],[
        'MPAs: Existing State',
        'Management',
        new OpenLayers.Layer.TMS(
            "MPAs: Existing State",
            ["http://gwst.org/tiles/ExistingStateMarineProtectedAreas/"],
            {    
                layer_id: 15,
                layername: 'ExistingStateMarineProtectedAreas',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/ExistingStateMarineProtectedAreas/Legend.png',
        'Existing State Marine Protected Areas',
        'Marine Protected Areas in California as of October 31, 2008. Data provided by the California Department of Fish and Game'
    ],[
        'Marine Mammals',
        'Biological',
        new OpenLayers.Layer.TMS(
            "Marine Mammals",
            ["http://gwst.org/tiles/MarineMammalHauloutsandRookeries/"],
            {
                layer_id: 16,
                layername: 'MarineMammalHauloutsandRookeries',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/MarineMammalHauloutsandRookeries/Legend.png',
        'Marine Mammal Haulouts and Rookeries',
        'The Pinniped Rookeries layer  describes the location of rookeries (areas in which the pinnipeds repeatedly haul out and breed), the species found there and the months that species breeds at that rookery. Data is provided by U.S. Department of Commerce NOAA/National Marine Fisheries Service - Southwest Region and published on March 30, 2007.The Pinniped Haulouts layer shows Seal and sea lion haul-out sites in California, including the offshore islands. Data is provided by U.S. Department of Commerce NOAA/National Marine Fisheries Service - Southwest Region and published on March 30, 2007.'
    ],[
        'RCA: Commercial, Non-Trawl',
        'Management',
        new OpenLayers.Layer.TMS(
            "RCA: Commercial, Non-Trawl",
            ["http://gwst.org/tiles/RCACommercialNonTrawl/"],
            {
                layer_id: 17,
                layername: 'RCACommercialNonTrawl',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/RCACommercialNonTrawl/Legend.png',
        'Rockfish Conservation Area: Commercial, Non-Trawl',
        'This layer depicts the non-trawl fishing closures off the California coast as described <a href="http://www.nwr.noaa.gov/Groundfish-Halibut/Groundfish-Fishery-Management/Groundfish-Closed-Areas/Index.cfm" target="_blank">here</a> '
    ],[
        'RCA: Commercial, Trawl',
        'Management',
        new OpenLayers.Layer.TMS(
            "RCA: Commercial, Trawl",
            ["http://gwst.org/tiles/RCACommercialTrawl/"],
            {
                layer_id: 18,
                layername: 'RCACommercialTrawl',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/RCACommercialTrawl/Legend.png',
        'Rockfish Conservation Area: Commercial, Trawl',
        'This layer dipicts year round trawl fishing closures off the California coast as described <a href="http://www.nwr.noaa.gov/Groundfish-Halibut/Groundfish-Fishery-Management/Groundfish-Closed-Areas/Index.cfm" target="_blank">here</a>'
    ],[
        'RCA: Recreational',
        'Management',
        new OpenLayers.Layer.TMS(
            "RCA: Recreational",
            ["http://gwst.org/tiles/RCARecreational/"],
            {
                layer_id: 19,
                layername: 'RCARecreational',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/RCARecreational/Legend.png',
        'Rockfish Conservation Area: Recreational',
        'This layer dipicts the year round recreational fishing closures off the California coast as described <a href="http://www.nwr.noaa.gov/Groundfish-Halibut/Groundfish-Fishery-Management/Groundfish-Closed-Areas/Index.cfm" target="_blank">here</a>'
    ],[
        'Nearshore Habitats',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Recreational Fishing",
            ["http://gwst.org/tiles/Nearshorehabitats/"],
            {
                layer_id: 20,   
                layername: 'Nearshorehabitats',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/Nearshorehabitats/Legend.png',
        'Nearshore Habitats',
        'The surfgrass data layer shows the distribution of surfgrass along the California coast.  It was derived from aerial surveys that were done by the Mineral Management Service during years 1980 to 1982. The eelgrass data layer shows the eelgrass distribution for the California coast and the data is provided by the Nature Conservancy, Humboldt Atlas, California Department of Fish and Game, and NOAA (2004).'
    ],[
        'Hard and Soft Substrata',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Hard and Soft Substrata",
            ["http://gwst.org/tiles/HardSoftSubstrata/"],
            {
                layer_id: 21,
                layername: 'HardSoftSubstrata',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.8,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png';
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/HardSoftSubstrata/Legend.png',
        'Hard and Soft Substrata',
        'The shipwrecks layer shows the locations of shipwrecks along the coast of California, including offshore islands.  The data are provided by National Oceanic and Atmospheric Administration (NOAA) as Electronic Navigational Chart (ENC) data.  <a href="http://www.nauticalcharts.noaa.gov/csdl/encdirect_met.html" target="_blank">The full metadata can be downloaded here</a>. The artificial reefs layer shows the locations of artificial reefs along the California coast.  The data were provided by the California Department of Fish and Game. The seafloor substrate data layer depicts benthic substrate types in the form of either hard or soft substrate. These data were developed in 2006 by the Moss Landing Marine Laboratory, but have been revised to include additional areas of hard bottom added by researchers at the University of California-Santa Barbara. The submarine canyon data layer delineates geological seafloor characteristics of the contenental margin of the Unites States West Coast. It is a synthesis of various data sources including side-scan sonar, bottom samples, seismic data, and multibeam bathymetry.  The data was created in 2004 by TerraLogic GIS, Inc., Active Tectonics and Seafloor Mapping Lab, College of Oceanic and Atmospheric Sciences (Oregon State University), Center for Habitat Studies, Moss Landing Marine Laboratories.'
    ],[
        'Predicted Substrate',
        'Habitat',
        new OpenLayers.Layer.TMS(
            "Predicted Substrate",
            ["http://gwst.org/tiles/PredictedSubstrate/"],
            {
                layer_id: 21,
                layername: 'Predicted Substrate',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.8,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png';
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/PredictedSubstrate/Legend.png',
        'Predicted Substrate',
        'Fine-scale substrate data displayed on this map represent a union of data collected by, Seafloor Mapping Lab at California State University Monterey Bay, United States Geological Survey (USGS), Ocean Imaging, and the San Diego Association of Governments (SANDAG). Most datasets included in the fine scale substrate layer are derived from multibeam sonar. Gaps in the fine-scale data exist in the vicinity of all islands as well as along the mainland nearshore area, shallower than approximately 20 meters. Where fine scale data were unavailable at San Nicolas Island, coarse scale data are displayed. Coarse-scale data tends to overestimate abundance of rocky substrate. Where nearshore fine-scale data were unavailable, a linear proxy was created by drawing a line roughly parallel to shore, through nearshore areas where fine-scale data exist. Sections of the line were divided into either "hard" or "soft" categories in each area, depending on the dominant habitat type in that portion of the coast between 0 and 30 meters depth. Additional datasets were referenced where possible, including areas of kelp growth, shoreline habitat types, and Bight 08 reef characterizations. '
    ],[
        'Military Areas',
        'Management',
        new OpenLayers.Layer.TMS(
            "Military Areas",
            ["http://gwst.org/tiles/MilitaryAreas/"],
            {
                layer_id: 22,
                layername: 'Military Areas',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 1.0,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/MilitaryAreas/Legend.png',
        'Military Areas',
        'Data regarding military use areas displayed on this map have been developed in conjuction with representatives from the United States Department of Defense. This information is not comprehensive and does not include all activities occuring in the MLPA South Coast Study Region. This information represents current uses, which may change in the future. Pending military closures displayed on this map are under consideration by the MLPA Blue Ribbon Task Force. Additional information regarding military use areas and pending military closures at San Clemente Island and San Nicolas Island can be found <a href="http://www.dfg.ca.gov/mlpa/pdfs/agenda_040109c3.pdf" target="_blank">here</a>'
    ],[
        'Watersheds',
        'Physical',
        new OpenLayers.Layer.TMS(
            "Watersheds",
            ["http://gwst.org/tiles/Watersheds/"],
            {
                layer_id: 23,
                layername: 'Watersheds',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.7,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/Watersheds/Legend.png',
        'Watersheds',
        'This hydrography layer shows flowing streams and rivers of California as assembled from data originally published by the U.S. Geological Survey (USGS) in Digital Line Graph (DLG-3) format.  These data were last updated in 1998. The major watersheds data layer depicts the major hydrologic units in the south coast study region.  The information comes from the Calwater data layer and may vary slightly from the major hydrologic units described in the Regional Water Quality Control Boards Basin Plans. Differences exist because the GIS data layer, in some places, used smaller units to provide more detail than the major hydrologic units. This data is an extract from the California Interagency Watershed Map of 1999 (Calwater 2.2.1) for more information visit <a href="http://gis.ca.gov/casil/gis.ca.gov/calwater" target="_blank">here</a>. The impaired rivers data layer depicts coastal rivers of water quality concern in the study region.  The information was developed in 2003 by the State Water Resources Control Board (SWRCB) and Regional Water Quality Control Boards (RWQCB). The impaired water bodies data layer depicts water bodies of water quality concern in coastal watersheds and nearshore areas in the study region.  The information was developed in 2003 by the State Water Resources Control Board (SWRCB) and Regional Water Quality Control Boards (RWQCB).'
    ],[
        'Sea Bird Diversity',
        'Biological',
        new OpenLayers.Layer.TMS(
            "Sea Bird Diversity",
            ["http://gwst.org/tiles/AtSeaBirdDiversity/"],
            {
                layer_id: 24,
                layername: 'AtSeaBirdDiversity',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/AtSeaBirdDiversity/Legend.png',
        'Sea Bird Diversity',
        'This layer is derived from the NOAA/USF&WS seabird colony data base.  The layer shows  approximate location of seabird nesting colonies along the central and northern coast of California, including the SF Bay Area.  Original data is from Carter 1980 and Sowles 2000.  These data were then updated in 2004 with information mostly in Baja California from Wolfe SG 2002 using the same format.'
    ],[
        'Isobaths',
        'Base',
        new OpenLayers.Layer.TMS(
            "Isobaths",
            ["http://gwst.org/tiles/Isobaths/"],
            {
                layer_id: 25,
                layername: 'Isobaths',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/Isobaths/Legend.png',
        'Isobaths (contours)',
        'No Metadata'
    ],[
        'Shore Types',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Shore Types",
            ["http://gwst.org/tiles/ShoreTypes/"],
            {
                layer_id: 26,
                layername: 'ShoreTypes',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/ShoreTypes/Legend.png',
        'Shore Types',
        'The Shore Types layer is comprised of  the Environmental Sensitivity Index (ESI) maps for the shoreline of northern California. ESI data characterize coastal environments and wildlife by their sensitivity to spilled oil. The ESI data were collected, mapped, and digitized to provide environmental data for oil spill planning and response. The Clean Water Act with amendments by the Oil Pollution Act of 1990 requires response plans for immediate and effective protection of sensitive resources. The data has been provided by the  National Oceanic and Atmospheric Administration (NOAA), National Ocean Service, Office of Response and Restoration (2004).'
    ],[
        'Water Quality',
        'Physical',
        new OpenLayers.Layer.TMS(
            "Water Quality",
            ["http://gwst.org/tiles/WaterQuality/"],
            {
                layer_id: 27,
                layername: 'WaterQuality',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/WaterQuality/Legend.png',
        'Water Quality',
        "The power plant entrainment layer was developed by using entrainment estimates and intake volume estimates as outlined in the Clean Water Act Section 316 (b) reports. This area does not define a zone of impact, but rather provides a visual sense of the scale over which larval mortality due to entrainment may be of concern, and the relative sizes of this area due to different pumping rates for different plants. The stormwater data layer provides a rough scale of the possible extent of stormwater impact for each of these major stormwater sites. The estimates of the relative extent of possible toxic impacts are based on a Ballona Creek stormwater toxicity zone study. Developed by the California State Water Resources Control Board in 2004, the municipal wastewater and industrial discharge layer depicts the discharge sites into California�s near-coastal marine waters, but does not include discharges into enclosed bays and estuaries. The SAT determined that the Major dischargers should receive a 0.5 mile buffer zone to act as a typical or average extent of impacted area from the discharger�s effluent. The intermediate and minor dischargers do not have such a buffer and only represent the end point of that outfall. The outfall pipelines and diffusers layers were derived from a variety of sources including; Clean Water Act Section 316 (b) reports, monitoring reports from the sanitation districts, facility maps or construction plans from the sanitation districts, existing shapefiles from the Southern California Coastal Water Resources Project, and a few were created by using a best guess estimate by connecting the offshore outfall point to the land based facility. All offshore outfall points came from National Pollutant Discharge Elimination System permits via the California State Water Resources Control Board in 2004."
    ],[
        'Bioregions',
        'Base',
        new OpenLayers.Layer.TMS(
            "Bioregions",
            ["http://gwst.org/tiles/Bioregions/"],
            {
                layer_id: 29,
                layername: 'Bioregions',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/Bioregions/Legend.png',
        'Bioregions',
        "Metadata: "
    ],[
        'Place Names',
        'Cultural',
        new OpenLayers.Layer.TMS(
            "Place Names",
            ["http://gwst.org/tiles/Placenames/"],
            {
                layer_id: 30,
                layername: 'Placenames',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/Placenames/Legend.png',
        'Placenames',
        "Metadata: "
    ],[
        'Surfing Locations',
        'Cultural',
        new OpenLayers.Layer.TMS(
            "Surfing Locations",
            ["http://gwst.org/tiles/SurfingLocations/"],
            {
                layer_id: 31,
                layername: 'Surfing Locations',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/SurfingLocations/Legend.png',
        'Surfing Locations',
        "Metadata: "
    ],[
        'Halibut Trawl Grounds',
        'Consumptive',
        new OpenLayers.Layer.TMS(
            "Halibut Trawl Grounds",
            ["http://gwst.org/tiles/HalibutTrawlGrounds/"],
            {
                layer_id: 32,
                layername: 'Halibut Trawl Grounds',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/HalibutTrawlGrounds/Legend.png',
        'Halibut Trawl Grounds',
        "Metadata: "
    ],[
        'Kelp Persistence',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Kelp Persistence",
            ["http://gwst.org/tiles/PersistentKelp/"],
            {
                layer_id: 33,
                layername: 'Kelp Persistence',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/PersistentKelp/Legend.png',
        'Kelp Persistence',
        "The linear kelp layer represents the alongshore length of sustainable kelp beds. CDFG aerial kelp surveys from the years 1989, 1999, and 2002 through 2006 were used to assess kelp persistence--areas with kelp present at least 3 out of the 7 survey years were considered sustainable. The alongshore length of these kelp beds is measured using a line drawn along the outside edge of the kelp bed and roughly parallel to shore."
    ],[
        'Grunion Spawning Locations',
        'Biological',
        new OpenLayers.Layer.TMS(
            "Grunion Spawning Locations",
            ["http://gwst.org/tiles/GrunionSpawningLocations/"],
            {
                layer_id: 34,
                layername: 'Grunion Spawning Locations',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/GrunionSpawningLocations/Legend.png',
        'Grunion Spawning Locations',
        "Metadata:"
    ],[
        'Beach Nourishment',
        'Management',
        new OpenLayers.Layer.TMS(
            "Beach Nourishment",
            ["http://gwst.org/tiles/BeachNourishment/"],
            {
                layer_id: 35,
                layername: 'Beach Nourhishment',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/BeachNourishment/Legend.png',
        'Beach Nourishment',
        "Metadata:"
    ],[
        'Substrate Proxy (0-30m)',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Substrate Proxy (0-30m)",
            ["http://gwst.org/tiles/LinearSubstrate/"],
            {
                layer_id: 36,
                layername: 'Substrate Proxy (0-30m)',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/LinearSubstrate/Legend.png',
        'Substrate Proxy (0-30m)',
        "The shallow substrate proxy line integrates multiple sources of information to estimate the alongshore length of nearshore habitat that is dominated by rocky and soft-bottom respectively.  Information sources used to create this proxy include: finescale substrate data collected by Fugro Pelagos, Kvitek, USGS and others; maximum extent of kelp from CDFG aerial kelp surveys in years 1989, 1999, and 2002 through 2006; reef classifications from the Southern California Coastal Water Research Project (SCCWRP) Southern California Bight 2008 Regional Marine Monitoring Survey (Bight �08) project; and shoreline type classification from National Oceanic and Atmospheric Administration (NOAA) Environmental Sensitivity Index (ESI) maps. It is important to recognize that this nearshore substrate proxy represents a generalized representation of the entire area from 0-30 meters depth, and not simply the habitat type present where the line is drawn."
    ],[
        'Maximum Extent of Kelp',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Maximum Extent of Kelp",
            ["http://gwst.org/tiles/MaxKelp/"],
            {
                layer_id: 37,
                layername: 'Maximum Extent of Kelp',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.80,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/MaxKelp/Legend.png',
        'Maximum Extent of Kelp',
        "The maximum kelp layer represents the alongshore length of all kelp beds captured by CDFG aerial kelp surveys from the years 1989, 1999, and 2002 through 2006. The alongshore length of these kelp beds is measured using a line drawn along the outside edge of the kelp and roughly parallel to shore. Areas with multiple small patches of kelp canopy are represented with a solid linear feature around the outer edge of the broader area where the small patches occur."
    ]
	,[
        'Substrate SAT',
        'SAT Analyses',
        new OpenLayers.Layer.TMS(
            "Substrate SAT",
            ["http://gwst.org/tiles/SubstrateSAT/"],
            {
                layer_id: 38,
                layername: 'Substrate SAT',
                buffer: 1,
                'isBaseLayer': false,
                'opacity': 0.90,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 18 && z >= 6 ) {
                        var res = this.map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    if (url instanceof Array) {
                        url = this.selectUrl(path, url);
                    }
                    tilepath = url + path;
                    return url + path;
                }
            }
        ),
        'http://gwst.org/tiles/SubstrateSAT/Legend.png',
        'Substrate SAT',
        "This layer is a combination predicted substrate and linear 0 - 30m substrate proxy layers and aims to illustrate the use of data by the Science Advisory Team (SAT) when evaluating habitats influenced by substrate."
    ]
];

for (var i=0; i<gwst.data.DataLayers.length; i++) {
    var l = gwst.data.DataLayers[i];
    if (l[LAYER] instanceof OpenLayers.Layer.WMS) {
        var params = OpenLayers.Util.extend({LAYER: l[LAYER].params.LAYERS}, getLegendParams);
        var paramsString = OpenLayers.Util.getParameterString(params);
        l[LEGEND] = l[LAYER].url + '?' + paramsString;
    }
}

gwst.data.EcotrustFishingImpactLayers = [[
        'Ecotrust Fishing Ground Maps',
        'Consumptive',
        new OpenLayers.Layer.WMS(
            "Ecotrust Fishing Ground Maps",
            "/gwst/mapserver/wms/",
            {
                layer_id: 28,
                layers: "SocioEconomicFishing",
                transparent: "true", 
                format: "image/png"
            },
            {
                'opacity': 0.9
            }
        ),
        'media/images/socioecon-legend.png',
        'Ecotrust Fishing Ground Maps',
        'Ecotrust has generated these maps through a series of interviews with commercial and recreational fisherman throughout the South Coast region of California. <br/><br/>To view a map, first turn this layer on.  You will be presented with a menu allowing you to select a user group, species, and port/county.  <br/><br/>A number of other aggregations are also available for selection, which are simply combinations of the individual maps.  Please ask for assistance if you need help understanding what they represent.<br/><br/>Finally click the button to load the map, you will see it come into view on the map display.  If you don\'t see anything make sure you are zoomed into the right area for what you selected.  Be aware that some maps are hard to see zoomed all the way out as well.  Look for red and yellow colors.<br/><br/>To load a different map, simply turn this layer off (checkbox) and then back on again to reload the selection menu.'
]];


/* SubDataLayers are used for querying using WFS.  they are basically individual 
 * layers from the grouped tilecache layers.  so 1 or more sublayers are smashed 
 * together into single tilecache layers.  the subdatalayers are linked to their 
 * parent data layer only in name so make sure the subdatalayer node_name 
 * matches the NAME in the layers above.  That is what's used for linking the 
 * data layers menu with the infoquery window so that only the sublayers of 
 * enabled data layers are queryable.
 * 
 * Ultimately the SubDataLayers structure should probably be integrated into 
 * the DataLayers structure above.  Of course the whole thing should probably 
 * be server side or database driven.
 */

gwst.data.SubDataLayers = [
{
    node_name:'Satellite/Aerial Imagery',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Bathymetry',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Nautical Charts',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Study Region',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Graticules',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Isobaths',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Marine Mammals',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Pinniped Rookeries',
        sde: 'BIO_MAMMAL_PINNIPED_ROOKERIES_2008', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'Sp_Com_Nam',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Pinniped Haulouts',
        sde: 'BIO_MAMMAL_PINNIPEDS_2008', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'Com_Name',
            node_name: 'Name',
            value: ''           
        },{
            field: 'Num_Pups',
            node_name: 'Number of pups',
            value: ''           
        },{
            field: 'Total_Pinn',
            node_name: 'Total number',
            value: ''           
        },{
            field: 'Month',
            node_name: 'Month',
            value: ''           
        },{
            field: 'Year',
            node_name: 'Year',
            value: ''           
        }]
    }]
},{
    node_name:'Sea Bird Diversity',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Colony size and # of species',
        sde: 'BIO_SRSC_BIRD_COLONIES_SEABIRD', 
        shape_field: 'SHAPE',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NumSpecies',
            node_name: 'Total # of species',
            value: ''           
        },{
            field: 'NumBirds',
            node_name: 'Total # of birds',
            value: ''           
        }]
    }]
},{
    node_name:'Recreational Fishing',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Fishing Piers and Jetties',
        sde: 'CUL_SRSC_FISHINGPIERSANDJETTIES', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'MM_BDRY',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Kayak Launch Sites',
        sde: 'CUL_KFACA_KAYAKLAUNCHSITES', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'pmName',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Kayak Fishing Areas',
        sde: 'CON_KFACA_KAYAKFISHINGAREAS', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'pmName',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Spearfish Competition Sites',
        sde: 'CON_CENCALSPEARFISHSITES', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'DESCRIPT',
            node_name: 'Name',
            value: ''           
        }]
    }]
},{
    node_name:'Estuaries',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Nearshore Habitats',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Oil Seeps',
        sde: 'PHY_OILSEEPS', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'DESCRIPTIO',
            node_name: 'Description',
            value: ''           
        }]
    }]
},{
    node_name:'Hard and Soft Substrata',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Hard Substrate',
        sde: 'HAB_SRSC_SUBSTRATE', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'DESCRIPT',
            node_name: 'Description',
            value: ''           
        },{
            field: 'Sub_Depth',
            node_name: 'Depth',
            value: ''           
        }]
    },{
        node_name: 'Artificial Reefs',
        sde: 'HAB_ARTIFICIALREEFS_CENTROIDS', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NAME',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Shipwrecks',
        sde: 'CUL_SHIPWRECKSNOAAENC', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'COASTAL__1',
            node_name: 'Description',
            value: ''           
        }]
    },{
        node_name: 'Submarine Canyons',
        sde: 'PHY_CANYONS', 
        shape_field: 'SHAPE',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'HAB_TYPE',
            node_name: 'Habitat Type',
            value: ''           
        }]
    }]
},{
    node_name:'Coastal Energy',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Power Plants',
        sde: 'CUL_POWERPLANTS',
        shape_field: 'Shape', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'PLANTNAME',
            value: ''
        },{
            node_name: 'Technology',
            field: 'TECHNOLOGY',
            value: ''
        }]
    },{
        node_name: 'Oil Platforms',
        sde: 'CUL_OILPLATFORMS',
        shape_field: 'Shape', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'NAME',
            value: ''
        }]
    }]
},{
    node_name:'Research and Monitoring',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Research Institutions',
        sde: 'CUL_RESEARCH_INSTITUTIONS',
        shape_field: 'Shape', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'INSTITUTE',
            value: ''
        }]
    },{
        node_name: 'Marine Monitoring Sites',
        sde: 'MAN_MONITORINGSITES',
        shape_field: 'SHAPE', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'NAME',
            value: ''
        },{
            node_name: 'Institution',
            field: 'INSTITUTIO',
            value: ''
        }]
    },{
        node_name: 'Crane Monitoring Sites',
        sde: 'MAN_MONITORING_CRANE',
        shape_field: 'SHAPE', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'SITE_NAME',
            value: ''
        }]
    }]
},{
    node_name:'Cowcod Conservation Area',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Managed Areas',
    uiProvider:Ext.tree.ColumnNodeUI,
    iconCls:'',
    children:[{
        node_name: 'Terrestrial Managed Areas',
        sde: 'MAN_MANAGEDAREAS_TERRESTRIAL',
        shape_field: 'SHAPE', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Managing Agency',
            field: 'OWNERCODE',
            value: ''
        }]
    },{
        node_name: 'Marine Managed Areas',
        sde: 'MAN_FEDMPA',                
        shape_field: 'Shape', 
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            node_name: 'Name',
            field: 'AREANAME1',
            value: ''   
        }]
    }]
},{
    node_name:'MPAs: Existing State',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'State Marine Protected Areas',
        sde: 'MPA_STATE', 
        shape_field: 'Shape',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NAME',
            node_name: 'Name',
            value: ''           
        },{
            field: 'Type',
            node_name: 'Type',
            value: ''           
        }]
    }]
},{
    node_name:'RCA: Commercial, Non-Trawl',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'RCA: Commercial, Trawl',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'RCA: Recreational',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Restricted Areas',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Restricted Areas',
        sde: 'MAN_RESTRICTEDAREAS',
        shape_field: 'SHAPE',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'TYPE',
            node_name: 'Type',
            value: ''           
        }]
    }]
},{
    node_name:'Coastal Access and Recreation',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Ports',
        sde: 'CUL_PORTS',
        shape_field: 'SHAPE',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'FEAT_NAME',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Harbors',
        sde: 'CUL_HARBORS',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'PROPERNAME',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Coastal Access Points',
        sde: 'CUL_COAST_ACCESSPOINT',
        shape_field: 'SHAPE',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NAME',
            node_name: 'Name',
            value: ''           
        },{
            field: 'FEATURETYP',
            node_name: 'Type',
            value: ''           
        }]
    },{
        node_name: 'Kayak Launch Sites',
        sde: 'CUL_KFACA_KAYAKLAUNCHSITES',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'pmName',
            node_name: 'Name',
            value: ''           
        }]
    },{
        node_name: 'Shore Dive Sites',
        sde: 'NON_SRSC_SHORE_DIVE_LOCATIONS',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'Site_Name',
            node_name: 'Name',
            value: ''           
        }]
    }]
},{
    node_name:'Agricultural Impacts to Watersheds',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Urban Impacts to Watersheds',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[]
},{
    node_name:'Watersheds',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Major Watersheds',
        sde: 'PHY_HUNAMECALWAT221',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'HUNAME',
            node_name: 'Hydrologic Unit Name',
            value: ''           
        }]
    },{
        node_name: 'Coastal Rivers',
        sde: 'PHY_COASTALRIVERS',
        shape_field: 'SHAPE',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'PNAME',
            node_name: 'Name',
            value: ''           
        }]
    }]
},{
    node_name:'Water Quality',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Impaired Rivers',
        sde: 'PHY_IMPAIRED_RIVERS_CART',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'WBNAME',
            node_name: 'Name',
            value: ''           
        },{
            field: 'WBTYPE_NAM',
            node_name: 'Type',
            value: ''           
        }]
    },{
        node_name: 'Impaired Water Bodies',
        sde: 'PHY_IMPAIRED_WATERBODIES',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'WBNAME',
            node_name: 'Name',
            value: ''           
        },{
            field: 'WBTYPE_NAM',
            node_name: 'Type',
            value: ''           
        }]
    },{
        node_name: 'Ocean Outfalls',
        sde: 'CUL_OCEANOUTFALLS',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'FACILITY',
            node_name: 'Facility Name',
            value: ''           
        },{
            field: 'PRIMARY_DI',
            node_name: 'Company/Organization',
            value: ''           
        },{
            field: 'PRIMARY_EF',
            node_name: 'Type',
            value: ''           
        }]
    }]
},{
    node_name:'Shore Types',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Shore Types',
        sde: 'HAB_SHORETYPES',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'MapClass',
            node_name: 'Shore Type',
            value: ''           
        }]
    }]
}];

//Removed non-point layers until bbox intersect is working
/*
{
    node_name:'Marine Mammal Haulouts and Rookeries',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Pinniped Rookeries',
        sde: 'BIO_MAMMAL_PINNIPED_ROOKERIES_2008 ',
        shape_field: 'Shape',          
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'Sp_Com_Nam',
            node_name: 'Pinniped Type',
            value: ''           
        }]
    }]
},{
    node_name:'Seabird Diversity',
    uiProvider:Ext.tree.ColumnNodeUI,
    children:[{
        node_name: 'Bird Colony Size & Number of Species in Colony',
        sde: 'BIO_SRSC_BIRD_COLONIES_SEABIRD', 
        shape_field: 'SHAPE',         
        uiProvider:Ext.tree.ColumnNodeUI,
        children:[{
            field: 'NumSpecies',
            node_name: 'Total Number of Species',
            value: ''           
        },{
            field: 'NumBirds',
            node_name: 'Total Number of Birds',
            value: ''           
        }]
    }]
}
*/

Ext.namespace('gwst', 'gwst.data');

gwst.data.FisheryImpactMapUserGroups = [
    [ 'cpfv', 'Comm. Passenger Fishing Vessel' ],
    [ 'com', 'Commercial' ],
    [ 'div', 'Recreational Dive'],
    [ 'kyk', 'Recreational Kayak'],
    [ 'pvt', 'Recreational Vessel'],
    [ 'cnty', 'Recreational All Sectors']
    //[ 'prs', 'Recreational Pier/Shore']
];

/*gwst.data.FisheryImpactMapFishAllSpecies = [
    [ 'abl', 'Abalone' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'clms', 'Clams' ],
    [ 'crkr', 'Croaker' ],
    [ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'hsqd', 'Humboldt Squid' ],
    [ 'jsmlt', 'Jacksmelt' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'mshrk', 'Mako Shark' ],
    [ 'msqd', 'Market Squid' ],
    [ 'mar', 'Marlin (Swordfish)' ],
    [ 'msls', 'Mussels' ],
    [ 'rask', 'Rays/Skates' ],
    [ 'rcrb', 'Rock Crab' ],
    [ 'rckf', 'Rockfish/Lingcod' ],
    [ 'sal', 'Salmon' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'sndcrb', 'Sand Crab' ],
    [ 'scps', 'Scallops' ],
    [ 'shrk', 'Sharks (other)' ],
    [ 'sprch', 'Surfperch' ],
    [ 'tshrk', 'Thresher Shark' ],
    [ 'tun', 'Tuna' ],
    [ 'urch', 'Urchin' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'whtf', 'Whitefish' ],
    [ 'ytail', 'Yellowtail' ]
];*/

gwst.data.FisheryImpactMapCpfvPorts = [
    [ 'al', 'Entire Study Region' ],
    [ 'sb', 'Santa Barbara' ],
    [ 'ph', 'Port Hueneme/Channel Islands Harbor' ],
    [ 'sm', 'Santa Monica' ],
    [ 'sp', 'San Pedro/Long Beach' ],
    [ 'nb', 'Newport Beach' ],
    [ 'dp', 'Dana Point' ],
    [ 'oc', 'Oceanside' ],
    [ 'sd', 'San Diego' ]
];

gwst.data.FisheryImpactMapRecPorts = [
    [ 'cmp', 'Entire Study Region' ],
    [ 'sbk', 'Santa Barbara County' ],
    [ 'vtk', 'Ventura County' ],
    [ 'lak', 'Los Angeles County' ],
    [ 'ock', 'Orange County' ],
    [ 'sdk', 'San Diego County' ]
];

gwst.data.FisheryImpactMapPvtPorts = [
    [ 'cmp', 'Entire Study Region' ],
    [ 'sbk', 'Santa Barbara County' ],
    [ 'vtk', 'Ventura County' ],
    [ 'lak', 'Los Angeles County' ],
    [ 'ock', 'Orange County' ],
    [ 'osk', 'Oceanside' ],
    [ 'sdk', 'San Diego County' ]
];

gwst.data.FisheryImpactMapComPorts = [
    [ 'allk', 'Entire study region' ],
    [ 'sbk', 'Santa Barbara' ],
    [ 'vtk', 'Ventura' ],
    [ 'phk', 'Port Hueneme/Channel Islands Harbor' ],
    [ 'spk', 'San Pedro' ],
    [ 'dpk', 'Dana Point' ],
    [ 'ock', 'Oceanside' ],
    [ 'sdk', 'San Diego' ] 
];

gwst.data.FisheryImpactMapCntyPorts = [
    [ 'sb', 'Santa Barbara County' ],
    [ 'vt', 'Ventura County' ],
    [ 'la', 'Los Angeles County' ],
    [ 'oc', 'Orange County' ],
    [ 'sd', 'San Diego County' ]
];


// data organized by group, then port, then species

gwst.data.FisheryImpactMapAllCntySpecies = [
    [ 'comp', 'Target Species Aggregated' ]
];

gwst.data.FisheryImpactMapAllCpfvSpecies = [
    [ 'comp', 'All Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'sclp', 'California Scorpionfish (Sculpin)' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'ling', 'Lingcod' ],
    [ 'rock', 'Rockfish' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'whtf', 'Whitefish' ]
];

gwst.data.FisheryImpactMapAllCpfvSpeciesSansComp = [
    [ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'sclp', 'California Scorpionfish (Sculpin)' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'ling', 'Lingcod' ],
    [ 'rock', 'Rockfish' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'whtf', 'Whitefish' ]
];

gwst.data.FisheryImpactMapStudyRegionComSpecies = [
    [ 'chalh', 'California Halibut - hook and line' ],
    [ 'cpss', 'Coastal Pelagics - seine' ],
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'pbns', 'Pacific Bonito - seine' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'salt', 'Salmon - troll' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'sqdb', 'Squid - braile' ],
    [ 'sqds', 'Squid - seine' ],
    [ 'swdh', 'Swordfish - harpoon' ],
    [ 'urcd', 'Urchin - dive' ],
    [ 'wsbg', 'White Seabass - gilnet' ]
];

gwst.data.FisheryImpactMapSbkComSpecies = [
    [ 'chalh', 'California Halibut - hook and line' ],
    [ 'chalt', 'California Halibut - trawl' ],
    [ 'dnsrh', 'Deep Nearshore Rockfish - hook and line' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'salt', 'Salmon - troll' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'scuct', 'Sea Cucumber - trawl' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'urcd', 'Urchin - dive' ],
    [ 'wsbg', 'White Seabass - gilnet' ]
];

gwst.data.FisheryImpactMapVtkComSpecies = [
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'sqds', 'Squid - seine' ]
];

gwst.data.FisheryImpactMapPhkComSpecies = [
    [ 'chalh', 'California Halibut - hook and line' ],
    [ 'cpss', 'Coastal Pelagics - seine' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'sqds', 'Squid - seine' ],
    [ 'urcd', 'Urchin - dive' ]
];

gwst.data.FisheryImpactMapSpkComSpecies = [
    [ 'cpss', 'Coastal Pelagics - seine' ],
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'pbns', 'Pacific Bonito - seine' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'sqdb', 'Squid - braile' ],
    [ 'sqds', 'Squid - seine' ],
    [ 'swdh', 'Swordfish - harpoon' ],
    [ 'urcd', 'Urchin - dive' ],
    [ 'wsbg', 'White Seabass - gilnet' ]
];

gwst.data.FisheryImpactMapDpkComSpecies = [
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'urcd', 'Urchin - dive' ]
];

gwst.data.FisheryImpactMapOckComSpecies = [
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'urcd', 'Urchin - dive' ]
];

gwst.data.FisheryImpactMapSdkComSpecies = [
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'urcd', 'Urchin - dive' ]
];

gwst.data.FisheryImpactMapAllDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'crkr', 'Croaker' ],
    //[ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapCmpDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'chal', 'California Halibut' ],
    [ 'lobs', 'Lobster' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];


gwst.data.FisheryImpactMapSbkDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'crkr', 'Croaker' ],
    //[ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    //[ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapVtkDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    //[ 'snbas', 'Sand Bass' ],
    [ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapLakDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'barc', 'Barracuda' ],
    //[ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    //[ 'crkr', 'Croaker' ],
    //[ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'lobs', 'Lobster' ],
    //[ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapOckDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'crkr', 'Croaker' ],
    //[ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapAllKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rcrb', 'Rock Crab' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'sqd', 'Squid' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapCmpKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapLakKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    //[ 'mckl', 'Mackerels' ],
    //[ 'rcrb', 'Rock Crab' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'sqd', 'Squid' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapOckKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'sqd', 'Squid' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapSbkKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ]
    //[ 'lobs', 'Lobster' ],
    //[ 'snbas', 'Sand Bass' ],
    //[ 'tshk', 'Thresher Shark' ]
];

gwst.data.FisheryImpactMapVtkKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    //[ 'rcrb', 'Rock Crab' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'sqd', 'Squid' ],
    //[ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ]
    //[ 'ytail', 'Yellowtail' ]
];


gwst.data.FisheryImpactMapAllPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'crkr', 'Croaker' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'srfp', 'Surfperch' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapCmpPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'wsbas', 'White Seabass' ]
];

gwst.data.FisheryImpactMapLakPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    //[ 'crkr', 'Croaker' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'srfp', 'Surfperch' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapOckPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'shphd', 'California Sheephead' ],
    [ 'crkr', 'Croaker' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'srfp', 'Surfperch' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapOskPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    //[ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    //[ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapSbkPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    //[ 'snbas', 'Sand Bass' ],
    //[ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ]
    //[ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapVtkPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    //[ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'crkr', 'Croaker' ],
    //[ 'lobs', 'Lobster' ],
    //[ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    //[ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];



gwst.data.FisheryImpactMapSpeciesByGroup = [
    [ 'cpfv', [[ 'al', gwst.data.FisheryImpactMapAllCpfvSpeciesSansComp ],
	       [ 'sb', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'ph', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'sm', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'sp', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'nb', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'dp', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'oc', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'sd', gwst.data.FisheryImpactMapAllCpfvSpecies ]
	       ]],
    [ 'com',  [
                [ 'allk', gwst.data.FisheryImpactMapStudyRegionComSpecies ],
                [ 'sbk', gwst.data.FisheryImpactMapSbkComSpecies ],
                [ 'vtk', gwst.data.FisheryImpactMapVtkComSpecies ],
                [ 'phk', gwst.data.FisheryImpactMapPhkComSpecies ],
                [ 'spk', gwst.data.FisheryImpactMapSpkComSpecies ],
                [ 'dpk', gwst.data.FisheryImpactMapDpkComSpecies ],
                [ 'ock', gwst.data.FisheryImpactMapOckComSpecies ],
                [ 'sdk', gwst.data.FisheryImpactMapSdkComSpecies ] 
              ]],
    [ 'div', [[ 'cmp', gwst.data.FisheryImpactMapCmpDivSpecies ],
	      [ 'sbk', gwst.data.FisheryImpactMapSbkDivSpecies ],
	      [ 'vtk', gwst.data.FisheryImpactMapVtkDivSpecies ],
	      [ 'lak', gwst.data.FisheryImpactMapLakDivSpecies ],
	      [ 'ock', gwst.data.FisheryImpactMapOckDivSpecies ],
	      [ 'sdk', gwst.data.FisheryImpactMapAllDivSpecies ]
	      ]],
    [ 'kyk', [[ 'cmp', gwst.data.FisheryImpactMapCmpKykSpecies ],
	      [ 'sbk', gwst.data.FisheryImpactMapSbkKykSpecies ],
	      [ 'vtk', gwst.data.FisheryImpactMapVtkKykSpecies ],
	      [ 'lak', gwst.data.FisheryImpactMapLakKykSpecies ],
	      [ 'ock', gwst.data.FisheryImpactMapOckKykSpecies ],
	      [ 'sdk', gwst.data.FisheryImpactMapAllKykSpecies ]
	      ]],
    [ 'pvt', [[ 'cmp', gwst.data.FisheryImpactMapCmpPvtSpecies ],
	      [ 'sbk', gwst.data.FisheryImpactMapSbkPvtSpecies ],
	      [ 'vtk', gwst.data.FisheryImpactMapVtkPvtSpecies ],
	      [ 'lak', gwst.data.FisheryImpactMapLakPvtSpecies ],
	      [ 'ock', gwst.data.FisheryImpactMapOckPvtSpecies ],
	      [ 'osk', gwst.data.FisheryImpactMapOskPvtSpecies ],
	      [ 'sdk', gwst.data.FisheryImpactMapAllPvtSpecies ]
	      ]],
    [ 'cnty', [[ 'all', gwst.data.FisheryImpactMapAllCntySpecies ]
	      ]]
];

gwst.data.FisheryImpactMapPortsByGroup = [
    [ 'cpfv', gwst.data.FisheryImpactMapCpfvPorts ],
    [ 'com',  gwst.data.FisheryImpactMapComPorts ],
    [ 'div', gwst.data.FisheryImpactMapRecPorts ],
    [ 'kyk', gwst.data.FisheryImpactMapRecPorts ],
    [ 'pvt', gwst.data.FisheryImpactMapPvtPorts ],
    [ 'cnty', gwst.data.FisheryImpactMapCntyPorts ]
];
Ext.namespace('gwst', 'gwst.urls');

/*
    Class: gwst.urls
    
    Source for all URLs used within the gwst javascript client.

    Rather than sprinkling urls throughout the source code, they should be 
    placed here and then referenced. They will not only be easier to change if 
    in one place, but we can also do things like load gwst.testing.urls 
    in its place to easily switch to test data.
*/
//gwst.urls = {
//    newMPAForm: '/gwst/forms/create/mpa',
//    designationsService: '/gwst/domains/designations',
//    submitNewMPA: '/gwst/mpa/create/',
//    validateGeometry: '/gwst/mpa/validate/',
//    mpas: '/gwst/mpas/public?srid=900913',
//    editMPA: '/gwst/mpas/edit/',
//    // mpas: '/gwst/mpas/public'
//}

gwst.urls = {
    splash: '/gwst/splash/',
    tutorials: '/gwst/tutorials/',
    faq: '/gwst/faq/',
    sendPassword: '/gwst/user/sendpassword/',
    changePassword: '/gwst/user/changepassword/',
    newMPAForm: '/gwst/forms/create/mpa',
    // designationsService: '/gwst/domains/designations',
    submitNewMPA: '/gwst/mpa/create/',
    validateGeometry: '/gwst/mpa/validate/',
    mpas: '/gwst/mpas/public/?srid=900913',
    editMPA: '/gwst/mpa/edit/',
    // mpas: '/gwst/mpas/public'
    deleteMPA: '/gwst/mpa/delete/',
    MPAKml: '/gwst/mpa/kml/',
    login: '/gwst/login/',
    logout: '/gwst/logout/',
    user: '/gwst/user/',
    index: '/gwst/',
    geoserver: '/gwst/geoserver/wfs/',
    mpaAttributes: '/gwst/mpa/',
    createArray: '/gwst/array/create/',
    // arrays : '/gwst/domains/arrays',
    addtoarray: '/gwst/mpa/addtoarray/',
    emptyarrays: '/gwst/arrays/getempty/',
    deleteArray: '/gwst/array/delete/',
    mpaImpactAnalysis: '/gwst/econ_analysis/mpa/'
};

Ext.namespace('gwst');

gwst.actions = {};

gwst.actions.utils = {};

jQuery.fn.bindButton = function(action, data){
    $(this).bind('click', data, function(e){action(e); return false});
};

gwst.actions.utils.showGeometryChangeInfo = function(html){
    gwst.app.statusPanel.body.update(html);
    gwst.app.statusPanel.show();
};

gwst.actions.utils.clearGeometryChangeInfo = function(){
    gwst.app.statusPanel.hide();
};

gwst.actions.utils.clearMenus = function(e){
    if(e){
        e.stopPropagation();
    }
    Ext.getCmp('maptoolbar').collapseMenus();
};

gwst.actions.utils.restoreComponents = [];

gwst.actions.utils.disableComponents = function(){
    // gwst.app.legend.collapse();
    // gwst.app.legend.hide();
    if(gwst.app.mapToolbar.dataLayersMenu.window.isVisible()){
        gwst.actions.utils.restoreComponents.push(
            gwst.app.mapToolbar.dataLayersMenu
        );
    }
    if(gwst.app.FeaturesMenu.extWindow.isVisible()){
        gwst.actions.utils.restoreComponents.push(
            gwst.app.FeaturesMenu.getExtButton()
        );
    }
    gwst.actions.utils.clearMenus();
    gwst.app.mapToolbar.dataLayersMenu.window.isVisible()
    gwst.app.mapToolWindow.hide();    
    gwst.app.reportsVisor.deactivate();
    gwst.ui.modal.hide();
    // gwst.app.mapToolbar.setDisabled(true);
};

gwst.actions.utils.enableComponents = function(){
    gwst.app.mapToolWindow.show();
    for(var i=0; i<gwst.actions.utils.restoreComponents.length; i++){
        gwst.actions.utils.restoreComponents[i].toggle();
    }
    gwst.actions.utils.restoreComponents = [];
    gwst.app.reportsVisor.activate();
};

gwst.actions.utils.mapToolbarItems = [];

gwst.actions.utils.changeMapToolbarMode = function(buttonConfig){
    var tbar = gwst.app.mapToolbar;
    tbar.addClass('editmodetoolbar');
    // gwst.actions.utils.mapToolbarItems = [];
    var removeList = [];
    for(var i=0; i< tbar.items.length; i++){
        var item = tbar.items.itemAt(i);
        if(item.restore){
            item.hide();
        }else{
            removeList.push(i);
            item.destroy();
        }
    }
    for(var p=0;p<removeList.length;p++){
        tbar.items.removeAt(removeList[p]);
    }

    for(var j = 0; j<buttonConfig.length; j++){
        buttonConfig[j]['restore'] = false;
        tbar.add(buttonConfig[j]);
    }
};

gwst.actions.utils.restoreMapToolbar = function(){
    var tbar = gwst.app.mapToolbar;
    tbar.removeClass('editmodetoolbar');
    var removeList = [];
    
    for(var i = 0; i<tbar.items.length; i++){
        var item = tbar.items.item(i);
        if(item.restore){
            // tbar.add(item);
            item.show();
        }else{
            removeList.push(i);
            item.destroy();
        }
    }
    for(var p=0;p<removeList.length;p++){
        tbar.items.removeAt(removeList[p]);
    }
};

gwst.actions.utils.askUserToDefineGeometry = function(config){
    if(!config['finish'] || !config['cancel']){
    }else{
        gwst.actions.utils.disableComponents();        
        var clipSuccess = function(status_code, original, clipped){
            gwst.app.map.addClippedGeometryPreview(clipped);
            var title;
            var text;
            if(status_code == 0){
                title = gwst.copy.confirmStudyRegionClippingTitle;
                text = gwst.copy.confirmStudyRegionClipping;
            }else{
                title = gwst.copy.overlapsEstuaryTitle;
                text = gwst.copy.confirmStudyRegionClipping + "<br />" + gwst.copy.overlapsEstuary[status_code];
            }
            
            gwst.actions.utils.changeMapToolbarMode([
                {
                    xtype: 'tbtext',
                    text: title
                },
                {
                    xtype: 'tbfill'
                },
                {
                    text: 'Go Back and Modify Geometry',
                    geometry: original,
                    config: config,
                    handler: function(){
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.clearGeometryChangeInfo();
                        this.config['geometry'] = this.geometry;
                        gwst.app.map.clearClippedGeometryPreview();
                        gwst.actions.utils.askUserToDefineGeometry(this.config);
                    }
                },
                {
                    text: 'Cancel',
                    iconCls: 'remove-icon',
                    handler: function(){
                        gwst.app.map.clearClippedGeometryPreview();
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.clearGeometryChangeInfo();
                        config['cancel']();
                    }
                },
                {
                    text: 'Continue',
                    iconCls: 'yes-icon',
                    geometry: original,
                    clipped: clipped,
                    handler: function(){
                        gwst.app.map.clearClippedGeometryPreview();
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.clearGeometryChangeInfo();
                        gwst.app.map.selectControl.deactivate();
                        gwst.app.map.selectControl.activate();
                        config['finish'](this.geometry, this.clipped);
                    }
                }
            ]);
            gwst.actions.utils.showGeometryChangeInfo(text);
        };
        
        var clipError = function(status_code, original){
            gwst.actions.utils.changeMapToolbarMode([
                {
                    xtype: 'tbtext',
                    text: 'The geometry you defined cannot be accepted'
                },
                {xtype: 'tbfill'},
                {
                    text: 'Go Back and Modify Geometry',
                    geometry: original,
                    config: config,
                    handler: function(){
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.clearGeometryChangeInfo();
                        this.config['geometry'] = this.geometry;
                        gwst.actions.utils.askUserToDefineGeometry(this.config);
                    }
                },
                {
                    text: 'Cancel',
                    iconCls: 'remove-icon',
                    handler: function(){
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.clearGeometryChangeInfo();
                        gwst.actions.utils.enableComponents();
                        config['cancel']();
                    }
                }
            ]);
            gwst.actions.utils.showGeometryChangeInfo(gwst.copy.clippedGeometryStatus[status_code]);
        };
        var clipFail = function(response, opts){
            gwst.ui.error.show({
                errorText: 'An unknown Server Error has Occurred while trying to clip your MPA. If you were editing a geometry, that geometry will remain intact as it was before editing. If you were creating a new MPA, you will have to start over. We have been notified of this problem.',
                logText: 'Error clipping MPA'
            });
            gwst.actions.utils.enableComponents();
        };
        if(config['geometry']){
            gwst.app.map.addEditableGeometry(config['geometry']);
            gwst.actions.utils.changeMapToolbarMode([
                {
                    xtype: 'tbtext',
                    text: gwst.copy.editGeometry
                },
                {xtype: 'tbfill'},
                {
                    text: 'Finished',
                    iconCls: 'yes-icon',
                    handler: function(){
                        var new_geo = gwst.app.map.finishGeometryEditing();
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.async.clipGeometry({
                           geometry: new_geo,
                           success: clipSuccess,
                           error: clipError,
                           fail: clipFail
                        });
                    }
                },
                {
                    text: 'cancel',
                    iconCls: 'remove-icon',
                    handler: function(){
                        gwst.app.map.finishGeometryEditing();
                        gwst.actions.utils.restoreMapToolbar();
                        gwst.actions.utils.enableComponents();
                        config['cancel']();
                    }
                }
            ]);
        }else{
            gwst.app.map.startDrawMPA();
            
            gwst.actions.utils.changeMapToolbarMode([
                {
                    xtype: 'tbtext',
                    text: gwst.copy.createNewGeometry
                },
                {xtype: 'tbfill'},
                {
                    text: 'cancel',
                    iconCls: 'remove-icon',
                    handler: function(){
                        gwst.app.map.cancelDrawMPA();
                        gwst.actions.utils.enableComponents();
                        config['cancel']();
                        gwst.actions.utils.restoreMapToolbar();
                    }
                }
            ]);
            // Cause of bug drawing MPAs where verticies are offset from mouse clicks.
            // Call to map.events.clearMouseCache needed because changes to the maptoolbar effect the size
            //  of the map div. openlayers needs to re-calculate cursor offsets when this div is resized 
            gwst.app.map.map.events.clearMouseCache();
            gwst.app.map.addListener('GeometryCreated', gwst.actions.utils.geometryCreatedCallback, {
                // doneHandler: doneHandler, 
                remove: gwst.actions.utils.geometryCreatedCallback, 
                clipSuccess: clipSuccess,
                clipError: clipError,
                clipFail: clipFail
            });
        }
    }
};

gwst.actions.utils.geometryCreatedCallback = function(geometry){
    gwst.actions.utils.restoreMapToolbar();
    gwst.app.map.removeListener('GeometryCreated', this.remove, this);
    gwst.actions.async.clipGeometry({
       geometry: geometry,
       success: this.clipSuccess,
       error: this.clipError,
       fail: this.clipFail
    });
    // this.doneHandler(geometry);
};

gwst.actions.createArray = new Ext.Action({
    text: 'Create Array',
    iconCls: 'add-icon',
    handler: function(target, e) {
        gwst.actions.nonExt.createOrModifyArray();
        // if (!gwst.app.createArrayWindow) {
        //     gwst.app.createArrayWindow = new gwst.widgets.createArrayWindow({});
        //     //gwst.app.createArrayWindow.on('beforehide', function(c) { gwst.app.CreateArrayForm.reset(); });
        //     //gwst.app.createArrayWindow.on('beforeshow', function(c) { gwst.app.CreateArrayForm.reset(); });
        // }
        // 
        // gwst.app.createArrayWindow.show();
        //Ext.getCmp('login_name').focus(false, true);
    },
    tooltip: 'Create a new Array of Marine Protected Areas.'
    // tooltip: '<img src=\"media/images/silk/icons/error.png\" align=\"left\"/><div style=\"padding-bottom:2px;margin-left:25px;\">Newly created arrays will not appear in the MPA\'s window above until an MPA is added to an Array.<br>To do this, edit an MPA and select an Array from the dropdown list.</div>'

});

gwst.actions.utils.setUser = function(json){
    gwst.app.userManager.setUser(new gwst.data.mlpaFeatures.User(json));
}


gwst.actions.help = new Ext.Action({
    text: 'Help',
    handler: function(target, e) {
        if (!gwst.app.helpWindow) {
            gwst.app.helpWindow = new Ext.Window({
                id: 'windowSplash',
                closeAction: 'hide',
                //modal: true,
                width: 600,
                items: [
                    new Ext.TabPanel({
                        deferredRender: false,
                        labelWidth: 75,
                        height: 465,
                        activeTab: 0,
                        border: false,
                        items: [
                            gwst.app.splashScreen = new gwst.widgets.URLViewer({
                                url: gwst.urls.splash,
                                title: 'News'
                            }),
                            gwst.app.tutorialScreen = new gwst.widgets.URLViewer({
                                url: gwst.urls.tutorials,
                                title: 'Screencasts'
                            }),
                            gwst.app.faq = new gwst.widgets.URLViewer({
                                url: gwst.urls.faq,
                                title: 'FAQ',
                                autoScroll: true
                            })
                        ]
                    })

                ]
            });
        }
        gwst.app.helpWindow.show();
    },
    iconCls: 'blist',
    tooltip: 'Show Help Window'
});


gwst.actions.login = new Ext.Action({
    text: 'Login',
    handler: function(target, e) {
        var w = new Ext.Window({
            closable: false,
            modal: true,
            width: 380,
            items: [
			    new gwst.widgets.LoginForm()
		    ]
        });
        gwst.actions.currentLoginWindow = w;
        w.show();
    },
    tooltip: 'Log in to gwst'
});


gwst.actions.logout = new Ext.Action({
    text: 'Logout',
    handler: function(target, e){
		// Basic request
		Ext.Ajax.request({
		   url: gwst.urls.logout,
		   success: function(){
				//window.location = gwst.urls.index
				gwst.app.userManager.setUser(null);
                // gwst.actions.utils.logoutUser();
			},
		   failure: function(){}
		});
    },
    tooltip: 'Log out of gwst'
});


gwst.actions.resetPassword = new Ext.Action({
    text: 'Reset Password',
    handler: function(target, e){
        var w = new Ext.Window({
            closable: false,
		    modal: true,
            width: 380,
		    items:[
			    new gwst.widgets.PasswordResetForm()
		    ]
	    });
		w.show();
    },
    tooltip: 'Email me my password'
});


gwst.actions.changePassword = new Ext.Action({
    text: 'Change Password',
    handler: function(target, e) {
        var w = new Ext.Window({
            closable: false,
            modal: true,
            width: 380,
            items: [
    		    new gwst.widgets.PasswordChangeForm()
    	    ]
        });
		w.show();
    },
    tooltip: 'Change my password'
});


gwst.actions.userPrefsDropdown = new Ext.Action({
    text: 'UserPrefs',
    // handler: function(target, e){
    //     gwst.actions.utils.clearMenus(e);
    //     Ext.Msg.show({
    //         title: 'Not Implemented',
    //         msg: 'Would open a modal dialog for modifying prefs.',
    //         animEl: target.id
    //     });
    // },
    tooltip: 'Modify user preferences',
    user: null
});

gwst.actions.drawMPA = new Ext.Action({
    text: 'Create MPA',
    iconCls: 'add-icon',
    handler: function(target, e){
        gwst.actions.utils.askUserToDefineGeometry({
            finish: function(geometry, clipped){ 
                mlpa.mpaForm.show({
                    geometries: [geometry, clipped],
                    success: function(mpa){
                        gwst.app.reportsVisor.update();
                        gwst.actions.utils.enableComponents();
                        gwst.app.clientStore.add(mpa);
                        gwst.app.selectionManager.setSelectedFeature(mpa);
                        gwst.ui.modal.hide(false, true);
                        gwst.actions.openMpaAttributes.execute({mpa: mpa});
                    },
                    cancel: function(){
                        gwst.actions.utils.enableComponents();
                    },
                    error: function(response){
                        // Ext.Msg.alert('error saving MPA');
                        gwst.ui.error.show({errorText: 'There was a problem saving your new MPA. This error will show up in our logs, but if the problem persists please follow up with an administrator.', logText: 'Error saving new MPA'});
                        gwst.actions.utils.enableComponents();
                    }
                });
            },
            cancel: function(){
                gwst.actions.utils.enableComponents();
            }
        });
    }
});

gwst.actions.handlers = {};

/********************* MPA Geometry Editing Actions *************************/

gwst.actions.enterMPAGeometryEditMode = new Ext.Action({
    text: 'Edit Geometry',
    iconCls: 'editGeo',
    handler: function(target, e){
        var mpa = target.mpa;
        if(mpa.editable != true){
            alert('This is a read-only MPA that cannot be edited or deleted.');
            return;
        }
        if(mpa.user != gwst.app.userManager.user.pk){
            alert('You cannot edit the geometry of an MPA that does not belong to you.');
            return;
        }
        // gwst.actions.nonExt.removeMPAFromInterface(mpa);
        gwst.app.map.removeMPAs([mpa]);
        gwst.actions.utils.askUserToDefineGeometry({
            geometry: mpa.feature.attributes.original_geometry,
            finish: function(geometry, clipped){
                gwst.ui.wait.show({msg:'While we save your geometry changes'});
                mpa.saveGeometryChanges(geometry, clipped, {
                    success: function(mpa){
                        gwst.ui.wait.hide();
                        gwst.actions.utils.enableComponents();
                        gwst.app.clientStore.add(mpa);
                        gwst.app.selectionManager.setSelectedFeature(mpa);
                    },
                    error: function(request, textStatus, errorThrown){
                        gwst.ui.error.show({errorText: 'Problem saving your geometry', debugText: request.responseText, logText: 'Problem saving geometry changes.'});
                        gwst.actions.utils.enableComponents();
                    }
                });
            },
            cancel: function(){
                gwst.actions.utils.enableComponents();
                
                gwst.app.map.addMPAs([mpa]);
                // gwst.app.selectionManager.setSelectedFeature(mpa, {});
            }
        });
    }
});

gwst.actions.englishMeasurements = new Ext.Action({
    text: 'miles',
    enableToggle: true,
    pressed: true,
    toggleGroup: 'measurements',
    tooltip: 'Measure in feet / miles (English/imperial units)',
    toggleHandler: function(target, enabled){
        if (enabled) {
            var controlToolbar = Ext.getCmp('mt1');
            for ( i = 0; i < controlToolbar.controls.length; i++ ) {
                if ( controlToolbar.controls[i].CLASS_NAME = "OpenLayers.Control.Measure" ) {
                    controlToolbar.controls[i].displaySystem = "english";
                }
            }
        }
    }
});

gwst.actions.metricMeasurements = new Ext.Action({
    text: 'kilometers',
    enableToggle: true,
    toggleGroup: 'measurements',
    tooltip: 'Measure in meters / kilometers (metric units)',
    toggleHandler: function(target, enabled){
        if (enabled) {
            var controlToolbar = Ext.getCmp('mt1');
            for ( i = 0; i < controlToolbar.controls.length; i++ ) {
                if ( controlToolbar.controls[i].CLASS_NAME = "OpenLayers.Control.Measure" ) {
                    controlToolbar.controls[i].displaySystem = "metric";
                }
            }
        }
    }
});

gwst.actions.openMpaAttributes = new Ext.Action({
    text: 'Full Info',
    // tooltip: 'View attributes and editing options',
    iconCls: 'attributes',
    handler: function(target, e){
        var pk = target.mpa.pk;
        var url = gwst.urls.mpaAttributes + pk;
        if(target['saved']){
            url = url + "?saved=True";
        }
        gwst.ui.modal.show({width: 500, url: url, waitMsg: 'while we retrieve information for this MPA.', afterRender: function(){
            $('li.editmpa a').bindButton(function(e){gwst.actions.nonExt.editMpaAttributes(e);}, {mpa: target.mpa});
            $('li.deletempa a').bindButton(gwst.actions.nonExt.deleteMPA, {mpa: target.mpa});
        }});
    }
});


gwst.actions.nauticalMeasurements = new Ext.Action({
    text: 'nautical miles',
    enableToggle: true,
    toggleGroup: 'measurements',
    tooltip: 'Measure in nautical miles',
    toggleHandler: function(target, enabled){
        if (enabled) {
            var controlToolbar = Ext.getCmp('mt1');
            for ( i = 0; i < controlToolbar.controls.length; i++ ) {
                if ( controlToolbar.controls[i].CLASS_NAME = "OpenLayers.Control.Measure" ) {
                    controlToolbar.controls[i].displaySystem = "nautical";
                }
            }
        }
    }
});

/********************** Start of non-Ext.Action actions *********************/

gwst.actions.nonExt = {};

gwst.actions.nonExt.editMpaAttributes = function(e){
    $(this).unbind('click');
    // gwst.ui.modal.hide(false);
    var mpa = e.data.mpa;
    if(mpa.editable != true){
        alert('This is a read-only MPA that cannot be edited or deleted.');
        return;
    }
    mlpa.mpaForm.show({
       editUrl: mpa.editUrl(),
       success: function(new_mpa){
           gwst.ui.modal.hide(false, true);
           gwst.app.clientStore.add(new_mpa);
           gwst.app.selectionManager.setSelectedFeature(new_mpa);
       },
       error: function(response){
           gwst.ui.error.show({errorText:'There was a problem saving your MPA attributes. Please try again.', logText: 'Problem saving mpa attributes.'});
       },
       cancel: function(){
       }
    });
}

gwst.actions.nonExt.deleteMPA = function(e){
    var mpa = e.data.mpa;
    if(mpa.editable != true){
        alert('This is a read-only MPA that cannot be edited or deleted.');
        return;
    }
    var answer = confirm('Are you sure you want to delete this MPA?');
    // gwst.ui.modal.show({msg: 'while the mpa is deleted'});
    if(answer){
        gwst.ui.modal.hide(false, true);
        $(this).unbind('click');
        $.ajax({
            url: gwst.urls.deleteMPA + mpa.pk,
            type: 'POST',
            success: function(){
                // gwst.ui.modal.hide();
                // gwst.actions.nonExt.removeMPAFromInterface(mpa);
                gwst.app.clientStore.remove(mpa);
            },
            error: gwst.actions.defaultErrorHandler
        });
    }else{
        // do nothing
    }
}

gwst.actions.nonExt.deleteArray = function(array){
    var answer = confirm('Are you sure you want to delete this Array? MPAs that you have created will be retained and put back into your MPA list.');
    if(answer){
        $(this).unbind('click');
        // gwst.ui.wait.show({msg: 'while the array is deleted.'});
        $.ajax({
            data: {pk: array.pk},
            url: gwst.urls.deleteArray,
            type: 'POST',
            dataType: 'json',
            success: function(data){
                gwst.ui.modal.hide(false, true);
                gwst.app.selectionManager.clearSelection();
                // gwst.ui.wait.hide();
                var remove = array.get_mpas();
                remove.push(array);
                gwst.app.clientStore.remove(remove);
                if(data && data.length){
                    var mpas = [];
                    for(var i=0; i<data.length;i++){
                        var mpa = gwst.data.mlpaFeatures.mpa_from_geojson(data[i]);
                        mpas.push(mpa);
                    }
                    gwst.app.clientStore.add(mpas);
                }else{
                }
            },
            error: gwst.actions.defaultErrorHandler
        });
    }else{
        // do nothing
    }
};

gwst.actions.nonExt.deleteArrayAndMpas = function(array){
    var answer = confirm('Are you sure you want to delete this Array? THIS ACTION WILL DELETE ALL MPAs IN THIS ARRAY!');
    if(answer){
        var answer = confirm('Are you still sure? (Sorry for the redundancy, we just want to prevent any mistakes.)');
        if(answer){
            $(this).unbind('click');
            // gwst.ui.wait.show({msg: 'while the array is deleted.'});
            gwst.ui.modal.hide(false, true);
            $.ajax({
                data: {pk: array.pk},
                url: '/gwst/array/delete-all/',
                type: 'POST',
                dataType: 'json',
                success: function(data){
                    gwst.app.selectionManager.clearSelection();
                    var mpas = array.get_mpas();
                    mpas.push(array);
                    // gwst.ui.wait.hide();
                    gwst.app.clientStore.remove(mpas);
                },
                error: gwst.actions.defaultErrorHandler
            });
        }
    }
};

gwst.actions.nonExt.addMpasToInterface = function(mpas){
    gwst.app.reportsVisor.update();
    var store = Ext.getCmp('maptoolbar').mlpaFeaturesMenu.MPAStore;
    for(var i = 0; i<mpas.length; i++){
        store.add(mpas[i]);
    }
    store.sort('name');
}

gwst.actions.nonExt.addArrayMpasToMap = function(array){
    return gwst.app.mapToolbar.mlpaFeaturesMenu.addArrayMpas(array);
}

gwst.actions.async = {};


gwst.actions.async.clipGeometry = function(config){
    gwst.ui.wait.show({msg: 'while we validate your geometry'});
    if(config['geometry'] && config['error'] && config['fail'] && config['success']){
        Ext.Ajax.request({
            url: gwst.urls.validateGeometry,
            method: 'POST',
            disableCachingParam: true,
            params: 'geometry='+config['geometry'].toString(),
            success: function(response, opts){
                gwst.ui.wait.hide();
                var text = response.responseText;
                var json = eval('(' + text + ')');
                var status_code = parseFloat(json['status_code']);
                if(status_code == 1 || status_code == 0 || status_code == 5){
                    var geometry = json['original_geom'];
                    var clipped_geometry = json['clipped_mpa_geom'];
                    config['success'](status_code, geometry, clipped_geometry);
                }else if(status_code != 4){
                    config['error'](status_code, config['geometry']);
                }else{
                    config['fail'](response, opts);
                }
            },
            failure: function(response, opts){
                gwst.ui.wait.hide();
                config['fail'](response, opts);
            }
        });
    }else{
        gwst.ui.error.show({errorText: 'gwst client is improperly configured to handle this action. Please contact an administrator.', logText: 'gwst.actions.async.clipGeometry was called with improper attributes'});
    }
};

gwst.actions.nonExt.createOrModifyArray = function(pk){
    gwst.app.selectionManager.clearSelection();
    var url = '/gwst/arrays/';
    if(pk){
        url = url + pk + '/edit/';
    }else{
        url = url + 'create/';
    }
    gwst.ui.form.show(url, function(json){
        // succes handler
        // errors and cancel handlers are default
        var data = gwst.data.mlpaFeatures.array_and_mpas_from_geojson(json);
        var array = data[0];
        var mpas = data[1];
        mpas.push(array);
        gwst.app.clientStore.add(mpas);
        gwst.ui.wait.hide();
        gwst.app.selectionManager.setSelectedFeature(array);
    });
};

gwst.actions.nonExt.openUserInfo = function(user){
    gwst.ui.modal.show({width: 300, url: '/gwst/user/'+user.pk, waitMsg: 'while we retrieve information for this user.'});
};

gwst.actions.nonExt.openArrayBasicInfo = function(pk){
    gwst.ui.modal.show({width: 500, url: '/gwst/array/'+pk, waitMsg: 'while we retrieve information for this Array.'});
};

gwst.actions.nonExt.openTreeTutorial = function(pk){
    gwst.ui.modal.show({width: 500, url: '/gwst/tree_tutorial'});
};

gwst.actions.nonExt.copyMpa = function(pk){
    gwst.ui.wait.show({
        waitMsg: 'While we copy this Marine Protected Area'
    });
    $.ajax({
        url: '/gwst/mpa/copy/', 
        type: 'POST', 
        data: {pk: pk}, 
        success: function(data){
            var mpa = gwst.data.mlpaFeatures.mpa_from_geojson(data);
            // var reader = new gwst.data.MLPAFeatureReader({root: 'mpa'}, gwst.data.MPA);
            // mpa_record = reader.readRecords({mpa: [mpa]}).records[0];
            gwst.ui.wait.hide();
            // gwst.actions.nonExt.addMPAToInterface(mpa_record, true);
            gwst.app.clientStore.add(mpa);
            gwst.app.selectionManager.setSelectedFeature(mpa);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if(XMLHttpRequest.status == 401){
                gwst.ui.error.show({
                    errorText: 'You must be logged in to perform this operation.'
                });                        
            }else if(XMLHttpRequest.status == 403){
                gwst.ui.error.show({
                    errorText: 'You do not have permission to copy this object.'
                });
            }else if(XMLHttpRequest.status == 404){
                gwst.ui.error.show({
                    errorText: 'The object you are trying to copy does not exist.'
                });
            }else{
                gwst.ui.error.show({
                    errorText: 'An unknown server error occured. Please try again later.'
                });
            }
        },
        dataType: 'json'
    });
};

gwst.actions.nonExt.copyArray = function(pk){
    var answer = confirm('By copying an Array, all member MPAs will also be copied and assigned to you so that you can edit them. The Array will recieve the same name + "_copy" added to the end, and will be added to your Marine Protected Areas listing. This may take a moment, please be patient and give your computer a minute to load the new MPAs.');
    if(answer){
        gwst.ui.wait.show({
            waitMsg: 'While we copy this Marine Protected Area'
        });
        $.ajax({
            url: '/gwst/array/copy/', 
            type: 'POST', 
            data: {pk: pk}, 
            success: function(json){
                var data = gwst.data.mlpaFeatures.array_and_mpas_from_geojson(json);
                var array = data[0];
                var mpas = data[1];
                mpas.push(array);
                gwst.app.clientStore.add(mpas);
                gwst.ui.wait.hide();
                gwst.app.selectionManager.setSelectedFeature(array);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                if(XMLHttpRequest.status == 401){
                    gwst.ui.error.show({
                        errorText: 'You must be logged in to perform this operation.'
                    });                        
                }else if(XMLHttpRequest.status == 403){
                    gwst.ui.error.show({
                        errorText: 'You do not have permission to copy this object.'
                    });
                }else if(XMLHttpRequest.status == 404){
                    gwst.ui.error.show({
                        errorText: 'The object you are trying to copy does not exist.'
                    });
                }else{
                    gwst.ui.error.show({
                        errorText: 'An unknown server error occured. Please try again later.'
                    });
                }
            },
            dataType: 'json'
        });        
    }
};

gwst.actions.setupEconomicAnalysis = function(){
    //Request the available fishery impact analysis parameters
    $.ajax({
        url: '/gwst/econ_analysis/available/', 
        type: 'GET',  
        success: function(user_groups){
            //Load the available parameters and display the selector
            gwst.data.FisheryImpactAnalysisUserGroups = user_groups;
            gwst.app.FisheryImpactAnalysisSelector = new gwst.widgets.FisheryImpactAnalysisSelectorWindow();                      
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            if(XMLHttpRequest.status == 400){
                gwst.ui.error.show({
                    errorText: 'You must use a GET request.'
                });
            }else if(XMLHttpRequest.status == 401){
                gwst.ui.error.show({
                    errorText: 'You must be logged in to perform this operation.'
                });                        
            }else if(XMLHttpRequest.status == 403){
                gwst.ui.error.show({
                    errorText: 'You do not have permission to analyze this mpa'
                });
            }else if(XMLHttpRequest.status == 404){
                gwst.ui.error.show({
                    errorText: 'That mpa does not exist'
                });
            }else{
                gwst.ui.error.show({
                    errorText: 'An unknown server error occured. Please try again later.'
                });
            }
        },
        dataType: 'json'
    });
};

gwst.actions.openEconomicAnalysis = function(selectedFeature){
    gwst.app.FisheryImpactAnalysisSelector.setMPA(selectedFeature.pk);
    gwst.app.FisheryImpactAnalysisSelector.show();
};

gwst.actions.openStaffSummary = function(arrayId){
    gwst.actions.openUrl('/gwst/array/staffsummary/'+arrayId);
}

gwst.actions.openArrayReplication = function(arrayId){
    gwst.actions.openUrl('/gwst/report/array/replication/'+arrayId);
}

gwst.actions.openHabitatPauloFormat = function(arrayId){
    gwst.actions.openUrl('/gwst/report/array/habitat/antiquated/'+arrayId);
}

gwst.actions.openUrl = function(url){
    window.onbeforeunload = null;
    window.open(url);
    window.onbeforeunload = gwst.backWarn;
    return false;
}

gwst.actions.defaultErrorHandler = function(XMLHttpRequest, textStatus, errorThrown){
    if(XMLHttpRequest.status == 401){
        gwst.ui.error.show({
            errorText: 'You must be logged in to perform this operation.'
        });                        
    }else if(XMLHttpRequest.status == 403){
        gwst.ui.error.show({
            errorText: 'You do not have permission to modify this object.'
        });
    }else if(XMLHttpRequest.status == 404){
        gwst.ui.error.show({
            errorText: 'This object cannot be found in the database.'
        });
    }else{
        gwst.ui.error.show({
            errorText: 'An unknown server error occured. Please try again later.'
        });
    }
}

gwst.actions.openAttributesCSV = function(arrayId){
    // console.log(arrayId);
    window.onbeforeunload = null;
    window.open('/gwst/array/csv/'+arrayId);
    window.onbeforeunload = gwst.backWarn;
}
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

OpenLayers.Geometry.Point.prototype.distanceTo = function(point) {
    var distance = 0.0;
    
    // transform the point to an area-preserving projection
    var transformedThis = this.clone();
    var transformedPoint = point.clone();
    var sourceProj = gwst.config.projection; // EPSG:900913
    var destProj = gwst.config.equalAreaProjection; // EPSG:3310
    transformedThis.transform( sourceProj, destProj );
    transformedPoint.transform( sourceProj, destProj );
    
    if ( (transformedThis.x != null) && (transformedThis.y != null) && 
         (transformedPoint != null) && (transformedPoint.x != null) && (transformedPoint.y != null) ) {
         
         var dx2 = Math.pow(transformedThis.x - transformedPoint.x, 2);
         var dy2 = Math.pow(transformedThis.y - transformedPoint.y, 2);
         distance = Math.sqrt( dx2 + dy2 );
    }
    return distance;
};


OpenLayers.Geometry.LinearRing.prototype.getArea = function() {
    var area = 0.0;
    if ( this.components && (this.components.length > 2)) {
        var sourceProj = gwst.config.projection; // EPSG:900913
        var destProj = gwst.config.equalAreaProjection; // EPSG:3310
        var sum = 0.0;
        for (var i=0, len=this.components.length; i<len - 1; i++) {
            var b = this.components[i].clone();
            b.transform( sourceProj, destProj );
            var c = this.components[i+1].clone();
            c.transform( sourceProj, destProj );
            sum += (b.x + c.x) * (c.y - b.y);
        }
        area = - sum / 2.0;
    }
    return area;
};


OpenLayers.Control.Measure.prototype.displaySystemUnits = {
        geographic: ['dd'],
        english: ['mi', 'ft', 'in'],
        metric: ['km', 'm'],
        nautical: ['nmi']
};

OpenLayers.Control.MousePosition.prototype.formatCoords = function (base) {
    //var digits = parseInt(this.numDigits);
    var sign = '';
    if ( base < 0 )
        sign = '-';
        
    var abs_base = Math.abs(base);
    
    var t, t2;
    var minute_pad = '';
    var degrees = Math.floor(abs_base);
    t = ( abs_base - degrees ) * 60;
    var minutes = t;
    
    //var minutes = Math.floor(t);
    //var seconds = Math.floor(t2 = ( t - minutes ) * 6000);
    //seconds = seconds / 100.00;
    
    if ( minutes < 10 )
        minute_pad = '0';
    return (sign + degrees + "\u00B0 " + minute_pad + minutes.toFixed(3) + "\u0027 " ); //+ seconds + "\u0022" );
};


OpenLayers.Control.MousePosition.prototype.formatOutput = function(lonLat) {
    var newHtml = this.formatCoords(lonLat.lat) + this.separator + this.formatCoords(lonLat.lon);
    return newHtml;
};
/*
Map
* 
* Google base layer switching happens 2 different ways.  using the zoomend map event
* it will switch to satellite base when zoomed far in.  Switching on the sat 
* layer via the data layers menu will also trigger a base layer switch and use
* a flag 'baseToggled' to make sure that it stays on regardless of any zoom level
* changes. 
*/

Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.Map = Ext.extend(mapfish.widgets.MapComponent, {
    // Constructor Defaults, can be overridden by user's config object
    id: 'map',
    layout: 'fit',
    region: 'center',
    border: false,
    buttonAlign: 'right',
    baseToggled: false,
    initComponent: function(){

        // avoid pink tiles
        OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
        //OpenLayers.Util.onImageLoadErrorColor = "transparent";
        OpenLayers.Tile.Image.useBlankTile = true;
        
        OpenLayers.Util.onImageLoadError = function() {
            /**
             * For images that don't exist in the cache, you can display
             * a default image - one that looks like water for example.
             * To show nothing at all, leave the following lines commented out.
             */
            //this.src = OpenLayers.Util.getImagesLocation() + "blank.gif";
            //this.style.display = "";
        };
        
        this.balloonTemplate = tmpl([
            '<div class="mpaPopup" style="width:225px;height:6em;">',
                '<a class="closePopup" href="#" onclick="gwst.app.selectionManager.clearSelection();"><img src="/site-media/images/silk/icons/cancel.png" /></a>',
                '<h3><%= mpa.name.length > 23 ? mpa.name.substr(0, 23) + "..." : mpa.name %></h3>',
                '<p class="creator">created by <%= mpa.get_user().name %> on <%= new Date(mpa.date_created).format("m/d/y") %></p>',
                '<p class="designation"><img style="background-color:<%= mpa.feature.attributes.fillColor %>;" width="15" height="10" src="/site-media/js/extjs/resources/images/default/s.gif" /> <%= mpa.get_designation() != null ? mpa.get_designation().name : "No designation" %></p>',
                '<div id="popupToolbarSpace">&nbsp;</div>',
            '</div>'
        ].join(''));
        
        this.wktParser = new OpenLayers.Format.WKT();
        
        var self = this;
        $(this.userManager).bind('change', function(e, user, oldUser){
            self.clearFeatures();
        });
        
        $(this.store).bind('removed', function(e, items){
            if(items['mpa'] && items['mpa'].length){
                for(var i=0; i<items['mpa'].length; i++){
                    var mpa = items['mpa'][i];
                    if(mpa.feature && self.vectorLayer.getFeatureById(mpa.feature.id)){
                        self.destroyMPAs([mpa]);
                    }
                }
            }
        });
        
        $(this.store).bind('updated', function(e, items){
            self.deselectAllMPAs();
            self.hideMPAPopup();
            if(items['mpa'] && items['mpa'].length){
                var add = [];
                for(var i=0; i<items['mpa'].length; i++){
                    var mpa = items['mpa'][i][0];
                    var old_mpa = items['mpa'][i][1];
                    add.push(mpa);
                    // old_mpa feature should be destroyed already
                }
                // if(remove.length){
                //     self.destroyMPAs(remove);
                // }
                self.addMPAs(add);
            }
        });
        
        this.on("bodyresize", function(){
            var x = (Ext.Element(this.contentEl).getWidth() / 2) - 30;
            this.panzoom.position = new OpenLayers.Pixel(x, 15);
            this.panzoom.redraw();
        }, this);

        var styleMap = new OpenLayers.StyleMap({
            'default': new OpenLayers.Style({
                fillColor: '${fillColor}',
                fillOpacity: 0.4,
                strokeColor: '${strokeColor}',
                strokeOpacity: 1,
                strokeWidth: 1,
                cursor: 'pointer'
            }),
            'select': new OpenLayers.Style({
               strokeWidth: 3,
               fillColor: '${fillColor}',
               strokeColor: 'yellow',
               strokeOpacity: 1,
               fillOpacity: 0.4,
               cursor: 'default'
            }),
            'temporary': new OpenLayers.Style({
                fillColor: 'red'
            })
        });
        
        this.vectorLayer = new OpenLayers.Layer.Vector('mlpaFeatures',{
            styleMap: styleMap
        });
  
        this.map.addLayers([
            gwst.data.GoogleTerrain, 
            gwst.data.GoogleSat, 
            this.vectorLayer
        ]);

        this.clippedGeometryPreview = null;
        
        //Panzoom
        this.panzoom = new OpenLayers.Control.PanZoomBar();
        var x = (Ext.Element(this.contentEl).getWidth() / 2) - 30;
        this.panzoom.position = new OpenLayers.Pixel(x, 15);
        this.map.addControl(this.panzoom);       
        
        this.map.events.register("zoomend", this, this.toggleBase);
        
        // Might be needed
        this.map.events.register("click", this, function(){
            this.selectionManager.clearSelection();
        });
        
        this.drawMPAControl = new OpenLayers.Control.DrawFeature(
            this.vectorLayer, 
            OpenLayers.Handler.Polygon, 
            {
                featureAdded: this.handleDrawMPA,
                handlerOptions: {
                    options: {
                        scope: this
                    }
                }
            }
        );
        this.map.addControl(this.drawMPAControl);
        
        this.map.addControl(new OpenLayers.Control.MousePosition());
        //Wheel zoom and double click zoom
        this.map.addControl(new OpenLayers.Control.MouseDefaults());
        this.map.addControl(new OpenLayers.Control.ZoomBox());             
        
        //this.map.addControl(new OpenLayers.Control.Measure(null, {}));
        
        this.map.zoomToExtent(this.studyRegion.extent());
        // Call parent (required)
        gwst.widgets.Map.superclass.initComponent.apply(this, arguments);
        
        var self = this;
        
        this.over = null;
        this.selectControl = new OpenLayers.Control.SelectFeature(
            this.vectorLayer,
            {
                multiple: true,
                clickout: true,
                callbacks: {
                    'click': function(feature){
                        self.selectionManager.setSelectedFeature(feature.attributes.mpa, self);
                        feature.attributes.mpa.selectedOnMap = true;
                    },
                    'clickout': function(feature){
                        if(self.over == null){
                            // self.deselectAllMPAs()
                            self.selectionManager.clearSelection(self);
                        }else{
                            // do nothing, changing
                        }
                        feature.attributes.mpa.selectedOnMap = false;
                    },
                    'over': function(feature){
                        self.over = feature;
                    },
                    'out': function(feature){
                        self.over = null;
                    }
                }
            }
        );
        
        $(this.selectionManager).bind('selectionChange', function(e, sm, selected, old, caller){
            self.selectItem(selected, caller);
        });
        
        this.map.addControl(this.selectControl);
        this.selectControl.activate();
        
        this.editVectorLayer = new OpenLayers.Layer.Vector('editFeature');
        this.editSelectControl = new OpenLayers.Control.SelectFeature(
            this.editVectorLayer,
            {
                clickout: false,
                multiple: false,
                toggle: false
            }
        );
        this.modifyControl = new OpenLayers.Control.ModifyFeature(this.editVectorLayer, {selectControl: this.editSelectControl});
        this.map.addLayer(this.editVectorLayer);
        this.map.addControl(this.modifyControl);
        this.map.addControl(this.editSelectControl);
        this.map.extCmp = this;
        
        // this.selectionManager.addListener('change', this.onSelectionManagerChange, this);
        
        // this.addEvents({
        //     // Fires whenever a polygon is drawn successfully.
        //     // func(mapComponent, geometry)
        //     'MPAGeometryDrawn': true,
        //     // Fires whenever an MPA or Array is added to the Map
        //     'MLPAFeaturseAdded': true,
        //     // Fires whenever an MPA or Array is removed from the map
        //     'MLPAFeaturesRemoved': true,
        //     // Data Layer Added
        //     'DataLayersAdded': true,
        //     // Data Layer Removed
        //     'DataLayersRemoved': true
        // });
        // After parent code
        // e.g. install event handlers on rendered component
    },
    
    selectItem: function(selected, caller){
        var self = this;
        if(selected != null && selected.model == 'mpa'){
            selected.callWithFeature(function(){self.showMPAPopup(selected)});
        }else{
            this.hideMPAPopup();
        }
        if(caller != this){
            if(selected){
                if(selected.model == 'mpa'){
                    this.deselectAllMPAs();
                    selected.callWithFeature(function(mpa, feature){
                        self.selectMPA(mpa);
                    });
                }else{
                    this.deselectAllMPAs();
                    selected.callWithFeature(function(array){
                        array.each_mpa(function(mpa){
                            if(self.vectorLayer.getFeatureById(mpa.feature.id)){
                                self.selectMPA(mpa);
                            }else{
                                // console.log('mpa not on the map yet!: '+mpa.pk);
                            }
                        });
                    });
                }
            }else{
                this.deselectAllMPAs();
            }
        }
    },
    
    deselectAllMPAs: function(){
        var remove = [];
        for(var i=0; i<this.vectorLayer.selectedFeatures.length; i++){
            remove.push(this.vectorLayer.selectedFeatures[i].attributes.mpa);
        }
        for(var i=0; i<remove.length;i++){
            this.deselectMPA(remove[i]);
        }
    },
    
    selectMPA: function(mpa){
        if(!mpa.selectedOnMap){
            this.selectControl.select(mpa.feature);
            mpa.selectedOnMap = true;
        }
    },
    
    deselectMPA: function(mpa){
        if(mpa.selectedOnMap){
            this.selectControl.unselect(mpa.feature);
            mpa.selectedOnMap = false;
        }
    },
        
    toggleBase: function() {    	            
    	var new_zoom_level = this.map.getZoom()+gwst.data.MIN_ZOOM_LEVEL;
    	//Check if sat is on and should remain on
    	if (this.baseSatOn) {
    		return;
    	}    	    	
        if (new_zoom_level > gwst.data.TERRAIN_MAX_ZOOM_LEVEL) {
            this.map.setBaseLayer(gwst.data.GoogleSat);
        } else {
        	this.map.setBaseLayer(gwst.data.GoogleTerrain);
        }
    },
    
    // onSelectionManagerChange: function(mngr, selection, oldSelection){
    //     if(selection && selection instanceof gwst.data.MPA){
    //         this.selectControl.unselectAll();
    //         var loaded = this.loadedMPA[selection.get('pk')];
    //         if(loaded == null && selection instanceof gwst.data.MPA){
    //             this.addMLPAFeatures([selection]);
    //             loaded = this.loadedMPA[selection.get('pk')];
    //         }
    //         this.selectControl.select(loaded[1]);
    //         if(!this.changeFromClick){
    //             var bounds = loaded[1].geometry.getBounds();
    //             var center = bounds.getCenterLonLat();
    //             if(this.map.getExtent().containsBounds(bounds)){
    //                 this.map.panTo(center);
    //             }else{
    //                 this.map.setCenter(center);
    //             }
    //         }
    //         this.showMPAPopup(loaded[1]);
    //     }else{
    //         this.selectControl.unselectAll();
    //         if(selection && selection instanceof gwst.data.Array){
    //             var mpas = gwst.actions.nonExt.addArrayMpasToMap(selection);
    //             this.selectControl.multiple = true;
    //             for(var i = 0; i <= mpas.length; i++){
    //                 var mpa = mpas[i];
    //                 if(mpa){
    //                     var loaded = this.loadedMPA[mpa.get('pk')];
    //                     this.selectControl.select(loaded[1]);
    //                 }
    //             }
    //             this.selectControl.multiple = false;                
    //         }
    //     }
    // },

    showMPAPopup: function(mpa){
        // var user = mpa.get_user();
        // //
        // if(!user){
        //     throw('mpa.get_user not working!'+ mpa.client_id);
        // }
        if(mpa.model != 'mpa'){
            throw('oh crap not an mpa', mpa);
        }
        html = this.balloonTemplate({mpa: mpa});
        ll = mpa.feature.geometry.getBounds().getCenterLonLat();
        var callback = function(feature){this.map.extCmp.selectControl.unselectAll();};
        this.popup = new OpenLayers.Popup.Anchored("mpaPopup",ll,null,html, null, false);
        this.popup.panMapIfOutOfView = false;
        this.popup.autoSize = true;
        this.popup.padding = 0;
        if(!mpa.feature.onScreen(true)){
            this.map.setCenter(mpa.feature.geometry.getBounds().getCenterLonLat());
        }
        this.map.addPopup(this.popup, true);

        var full = new Ext.Button(gwst.actions.openMpaAttributes);
        full.mpa = mpa;
        var geoedit = new Ext.Button(gwst.actions.enterMPAGeometryEditMode);
        geoedit.mpa = mpa;
        // var addToArray = new Ext.Button(gwst.actions.addMpaToArray);
        // addToArray.mpa = mpa;
        items = [full];
        if(this.userManager.user && mpa.user == this.userManager.user.pk){
            items.push(geoedit);
        }
        items.push({xtype: 'tbtext', text: '<a onmouseover="window.onbeforeunload = null;" onmouseout="window.onbeforeunload = gwst.backWarn;" class="gwst-button kml" href="/gwst/kml/mpa/'+mpa.pk+'">kml</a>'});
        
        var bbar = new Ext.Toolbar({
            id: 'popupTbar',
            items: items,
            renderTo: 'mpaPopup'
        });
        bbar.show();        
    },
    
    hideMPAPopup: function(feature){
        if(this.popup){
            this.map.removePopup(this.popup);
            this.popup = null;
        }
    },
    
    zoomIn: function(){
        this.map.zoomIn();
    },

    zoomOut: function(){
        this.map.zoomOut();
    },

    handleDrawMPA: function(feature, opts){
        gwst.app.map.newFeature = feature;
        this.deactivate();
        feature.layer.removeFeatures([feature]);
        gwst.app.map.fireEvent('GeometryCreated', feature.geometry);
    },

    startDrawMPA: function(){
        this.deselectAllMPAs();
        this.drawMPAControl.activate();
    },

    cancelDrawMPA: function(){
        this.drawMPAControl.deactivate();
    },
    
    addDataLayer: function(layer) {
        if (layer instanceof OpenLayers.Layer.Google) {
        	//Says sat should stay on all the time regardless of zoom level, because its on in the menu
            this.baseSatOn = true;       	
            this.map.setBaseLayer(gwst.data.GoogleSat);
            // Dirty, ugly, shamefull hack to get tiles in the lower half of 
            // the screen to load
            this.setWidth(this.getSize().width + 1);
            this.setWidth(this.getSize().width - 1);
        } else {
            this.map.addLayer(layer);
        }
    },
    
    removeDataLayer: function(layer) {
        if (layer instanceof OpenLayers.Layer.Google) {
        	//Allow google base layer switching based on zoom level to happen again
            this.baseSatOn = false;        	
            this.map.setBaseLayer(gwst.data.GoogleTerrain);
        } else {
            this.map.removeLayer(layer);
        }
    },

    addMPAs: function(mpas){
        var self = this;
        for(var i=0; i<mpas.length;i++){
            mpas[i].callWithFeature(function(mpa, feature){
                self.vectorLayer.addFeatures([feature]);
                if(gwst.app.selectionManager.selectedFeature && (mpa.pk == gwst.app.selectionManager.selectedFeature.pk || mpa.array == gwst.app.selectionManager.selectedFeature.pk)){
                    self.selectMPA(mpa);
                    if(gwst.app.selectionManager.selectedFeature.client_id == mpa.client_id){
                        self.showMPAPopup(mpa);
                    }
                }
            });
        }
    },
    
    removeMPAs: function(mpas){
        var self = this;
        this.hideMPAPopup();
        for(var i=0; i<mpas.length;i++){
            mpas[i].callWithFeature(function(mpa, feature){
                self.deselectMPA(mpa);
                self.vectorLayer.removeFeatures([feature]);
            });
        }
    },
    
    destroyMPAs: function(mpas){
        var self = this;
        this.hideMPAPopup();
        for(var i=0; i<mpas.length;i++){
            mpas[i].callWithFeature(function(mpa, feature){
                self.selectControl.unselect(mpa.feature);
                self.vectorLayer.destroyFeatures([feature]);
            });
        }        
    },
    
    addClippedGeometryPreview: function(wkt){
        this.clearClippedGeometryPreview();
        this.clippedGeometryPreview = this.wktParser.read(wkt);
        this.clippedGeometryPreview.attributes = {fillColor: 'purple', strokeColor: 'orange'};
        this.vectorLayer.addFeatures([this.clippedGeometryPreview]);
        // this.editVectorLayer.addFeatures([this.clippedGeometryPreview]);
        this.selectControl.select(this.clippedGeometryPreview);
        bounds = this.clippedGeometryPreview.geometry.getBounds();
        this.map.panTo(bounds.getCenterLonLat());
        
        // KJV 11/21/08: deactivate zoom to newly created MPA
        //zoom = this.map.getZoomForExtent(bounds, true);
        //this.map.zoomTo(zoom - 1);
    },
    
    clearClippedGeometryPreview: function(){
        if(this.clippedGeometryPreview){
            this.vectorLayer.removeFeatures(this.clippedGeometryPreview);            
            this.clippedGeometryPreview = null;
        }else{
        }
    },

    addEditableGeometry: function(geometry){
        this.selectControl.deactivate();
        var feature;
        if(geometry instanceof OpenLayers.Feature.Vector){
            feature = geometry;
        }else{
            feature = this.wktParser.read(geometry);
        }
        feature.id = 'featureforedit';
        this.editVectorLayer.addFeatures([feature]);

        this.editSelectControl.activate();

        
        this.modifyControl.activate();
        
        this.editSelectControl.select(feature);
    },
    
    finishGeometryEditing: function(){
        this.editSelectControl.unselectAll();

        // IF YOU DONT CALL THIS NEXT LiNE YOU WONT GET MPA CLICK SELECTIONS BACK!!!
        this.modifyControl.deactivate();
        
        this.editSelectControl.deactivate();
        
        var feature = this.editVectorLayer.getFeatureById('featureforedit');
        var geo = feature.geometry;
        feature.layer.removeFeatures([feature]);
        
        this.selectControl.activate();
        return geo;
    },
    
    zoomToFeature: function(feature){
        if(feature['model'] != 'mpa' && feature['model'] != 'array'){
            throw('zoomToFeature must be called with feature of type mpa or array');
        }
        var self = this;
        feature.callWithFeature(function(){
            self._zoomToFeatureCallback(feature);
        });
    },
    
    _zoomToFeatureCallback: function(feature){
        var bounds = new OpenLayers.Bounds();
        if(feature['model'] == 'mpa'){
            bounds = feature.feature.geometry.getBounds();
        }else if(feature['model'] == 'array'){
            feature.each_mpa(function(mpa){
                if(!bounds){
                    bounds = mpa.feature.geometry.getBounds();
                }else{
                    bounds.extend(mpa.feature.geometry.getBounds());
                }
            });
        }
        var center = bounds.getCenterLonLat();
        var zoom = this.map.getZoomForExtent(bounds);
        if(zoom > 8){
            zoom = 8;
        }
        if(zoom > 5){
            zoom = zoom - 1;
        }
        this.map.setCenter(center, zoom);
    },
    
    clearFeatures: function(feature){
        this.vectorLayer.removeFeatures(this.vectorLayer.features);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-widgets-map', gwst.widgets.Map);
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

        /************ Identify Control ************/
        
        var ident_control = new OpenLayers.Control.Identify({});
        ident_control.events.on({
            "activate": this.loadIdentify,
            "deactivate": this.unloadIdentify,
            "identify": this.startIdentify,
            scope: this
        });
                      
        this.addControl(
            ident_control, {
                iconCls: 'identify-icon', 
                toggleGroup: 'map1',
                tooltip:'Identify Features'
            }
        );    

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
    },
    
    /**************** Identify Handlers ****************/
    
    loadIdentify: function() {
        //query tree is destroyed each time
        if (this.tree) {
           this.ident_win.remove(this.tree);
           this.tree.destroy();
           this.tree = null;
        }
        
    	if (!this.ident_win) {
    		//Create new identify window
    		this.ident_win = new gwst.widgets.IdentifyWindow();
    		this.ident_win.addListener("hide", this.cleanupIdentWin, this);
    	}
        this.ident_win.show();
    },
    
    startIdentify: function(evt) {
    	//Get location clicked and reproject
    	this.xy = evt.xy;
        
        // place a marker on the map
        var size = new OpenLayers.Size(20,34);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var icon = new OpenLayers.Icon('http://boston.openguides.org/markers/AQUA.png',size,offset);
        var marker = new OpenLayers.Marker( this.xy, icon );
        
        var map_widget = gwst.app.map;
        if ( map_widget.markerLayer ) {
            gwst.app.map.markerLayer.destroy();
        }
        map_widget.markerLayer = new OpenLayers.Layer.Markers( 'identifyMarker' );
        map_widget.map.addLayer(map_widget.markerLayer);
        map_widget.markerLayer.addMarker(marker);
    	
        // now get the real identify work started
    	this.xy.transform(gwst.config.projection, gwst.config.equalAreaProjection);
    	
    	var x_top = this.xy.lat + gwst.config.identifyBboxRadius;
    	var y_left = this.xy.lon - gwst.config.identifyBboxRadius;
    	var x_bottom = this.xy.lat - gwst.config.identifyBboxRadius;
    	var y_right = this.xy.lon + gwst.config.identifyBboxRadius;

        /*
        //Create bbox points
        var point_list = [];
        point_list.push(new OpenLayers.Geometry.Point(x_top, y_left));      
        point_list.push(new OpenLayers.Geometry.Point(x_top, y_right));
        point_list.push(new OpenLayers.Geometry.Point(x_bottom, y_right));
        point_list.push(new OpenLayers.Geometry.Point(x_bottom, y_left));

        //Create polygon from points
        var linearRing = new OpenLayers.Geometry.LinearRing(point_list);
        var geom = new OpenLayers.Geometry.Polygon([linearRing]);
        //geom = geom.transform(gwst.config.projection, gwst.conig.equalAreaProjection);
        var polygonFeature = new OpenLayers.Feature.Vector(geom);       

        var gml = new OpenLayers.Format.GML();
        var geom_node = gml.buildGeometryNode(polygonFeature.geometry);
        this.geom_wfs = OpenLayers.Format.XML.prototype.write.apply(gml, [geom_node]);
        */
        
        //var gf = gml.write(polygonFeature);
    	
    	if (this.tree) {
    	   this.ident_win.remove(this.tree);
    	   this.tree.destroy();
    	   this.tree = null;
    	}
    	
	    this.tree = new Ext.tree.ColumnTree({
            rootVisible:false,
            autoScroll:true,                
            columns:[{
                header:'',
                width:260,
                dataIndex:'node_name'
            },{
                header:'Value',
                width:200,
                dataIndex:'value'
            }]       
        });           

        var the_root = new Ext.tree.TreeNode({
            text:'',
            dataUrl: gwst.data.SubDataLayers
        });    

        this.tree.setRootNode(the_root);            
        
        var data = gwst.data.SubDataLayers;
        //Layer groups
        var group_data = null;
        var group_node = null;
        var layer_data = null;
        var layer_node = null;
        var dm_store = Ext.getCmp('dataLayersMenu').store;
        var curr_group_name = null;

        var name_query = function(rec) {
            return (rec.layerOn && rec.get('name') == curr_group_name);
        };
        
        //for each sub-data layer object
        for (var i=0; i<data.length; i++) {
        	group_data = data[i];
        	curr_group_name = group_data.node_name;
        	
        	var layer_recs = dm_store.queryBy(name_query, this);
	        if ( layer_recs.items.length > 0 ) {	
	            if (group_data.children.length == 0) {
	                group_data.value = "No queryable layers";
	            } else {
	                group_data.value = "";
	            }
	            group_node = new Ext.tree.TreeNode({
	                node_name:group_data.node_name,
	                uiProvider:Ext.tree.ColumnNodeUI,
	                leaf:false,
	                expanded: true,
	                value: group_data.value
	            });
	            the_root.appendChild(group_node);
	            
	            for (var k=0; k<group_data.children.length; k++) {
	                layer_data = group_data.children[k];
	                layer_node = new Ext.tree.TreeNode({
	                    node_name: layer_data.node_name,
	                    sde: layer_data.sde,
	                    shape_field: layer_data.shape_field,
	                    fields: layer_data.children,
	                    uiProvider:Ext.tree.ColumnNodeUI,
	                    leaf:false,
	                    expandable: true,
	                    top: x_top,
	                    left: y_left,
	                    bottom: x_bottom,
	                    right: y_right
	                });
	                layer_node.on("expand", this.doIdentify, this);
	                group_node.appendChild(layer_node);
	            }     	                   
	        }  	        	                   
        }      
        
        //this.ident_win.remove(Ext.getCmp('start-panel'));
        this.ident_win.add(this.tree);
        this.ident_win.doLayout();
    },
    
    doIdentify: function(node) {
        this.ident_win.show_load();
        var fields = '';
        for (i=0; i<node.attributes.fields.length; i++) {
        	if (i != 0) {
        		fields += ',';
        	}        	
        	fields += node.attributes.fields[i].field;
        }
        //
        ////var wfs_params = 'request=GetFeature&version=1.0.0&typeName=sde:'+node.attributes.sde+'&outputFormat=JSON&propertyName='+fields+'&FILTER=<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Intersects><PropertyName>'+node.attributes.shape_field+'</PropertyName><gml:Point srsName="EPSG:900913"><gml:coordinates>'+this.xy.lon+','+this.xy.lat+'</gml:coordinates></gml:Point></Intersects></Filter>';
        //var wfs_params = 'request=GetFeature&version=1.0.0&typeName=sde:'+node.attributes.sde+'&outputFormat=JSON&propertyName='+fields+'&FILTER=<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Intersects><PropertyName>'+node.attributes.shape_field+'</PropertyName>'+this.geom_wfs+'</Intersects></Filter>';
    	//var wfs_params = "request=GetFeature&version=1.1.0&typeName=sde:"+node.attributes.sde+"&BBOX="+this.i_bottom+","+this.i_left+","+this.i_top+","+this.i_right+",EPSG:3310&OutputFormat=JSON&&propertyName="+fields;
        //var wfs_params = "request=GetFeature&version=1.1.0&typeName=sde:"+node.attributes.sde+"&BBOX=10433,-547883,70544,-505173,EPSG:3310&OutputFormat=JSON&&propertyName="+fields;;
        var wfs_params = 'request=GetFeature&version=1.0.0&typeName=sde:'+node.attributes.sde+'&outputFormat=JSON&propertyName='+fields+'&FILTER=<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Intersects><PropertyName>'+node.attributes.shape_field+'</PropertyName><gml:Box srsName="EPSG:3310"><gml:coordinates>'+node.attributes.left+','+node.attributes.bottom+' '+node.attributes.right+','+node.attributes.top+'</gml:coordinates></gml:Box></Intersects></Filter>';
        
        Ext.Ajax.request({
           url: gwst.urls.geoserver+'?'+wfs_params,
           success: this.finishIdentify,
           failure: this.failIdentify,
           params: { self: this },
           scope: node
        });
    },
    
    //Scope: the node to append to
    finishIdentify: function(response) {
    	var res = Ext.util.JSON.decode(response.responseText);
    	
    	//If no features then append a node saying no features found
    	if (!res.features || res.features.length == 0) {
	        var empty_node = new Ext.tree.TreeNode({
	            node_name: 'No Features Found',
	            uiProvider:Ext.tree.ColumnNodeUI,
	            leaf:true
	        });
	        this.appendChild(empty_node);
	        Ext.getCmp('identify_win').hide_load();
	        return;
    	}
    	
    	//Append feature nodes, 1 or more
    	for (var i=0; i<res.features.length; i++) {    		
    		
    		var feature = res.features[i];
            var feature_node = new Ext.tree.TreeNode({
                node_name: 'Feature '+(i+1),
                uiProvider:Ext.tree.ColumnNodeUI,
                leaf:false,
                expandable: true
            });
            this.appendChild(feature_node);          
            
            //Append leaf nodes (field name and value) from query, 1 of more            
	        for (var j=0;j<this.attributes.fields.length; j++) {
	            var field = this.attributes.fields[j];
	            feature_node.appendChild(new Ext.tree.TreeNode({
                    node_name: field.node_name,
                    value: feature.properties[field.field],
                    uiProvider:Ext.tree.ColumnNodeUI,
                    leaf:true
                }));                                     
	        }    
            //Ext.getCmp('identify_win').doLayout();                             		
    	}
    	Ext.getCmp('identify_win').hide_load();
    },
    
    failIdentify: function() {
    	Ext.Msg.alert("Identify query failed, please try again or notify an administrator");
    },
    
    unloadIdentify: function(evt) {
    	if (this.ident_win) {
    		this.ident_win.hide();
    	}
        if ( gwst.app.map.markerLayer ) {
            gwst.app.map.markerLayer.destroy();
        }
    },
    
    cleanupIdentWin: function() {
        this._buttons[0].toggle();
    } 
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-widgets-controltoolbar', gwst.widgets.ControlToolbar);
gwst.widgets.IdentifyWindow = Ext.extend(Ext.Window, {
    // Constructor Defaults, can be overridden by user's config object
    id: 'identify_win',
    title: 'Identify Map Features',
    height: 240,
    width: 600,
    closable: true,
    closeAction: 'hide',
    resizable: true,
    collapsible: false,
    initComponent: function(){
        // Called during component initialization
 
        // Config object has already been applied to 'this' so properties can 
        // be overriden here or new properties (e.g. items, tools, buttons) 
        // can be added, eg:
        
        Ext.apply(this, {
            x: 60,
            y: 100,
            layout:'fit',
            tbar: new Ext.StatusBar({
                id: 'win-statusbar',
                defaultText: 'To use, turn on data layers you want to query, click a location on the map, expand available sublayers',
                busyText: 'Querying features...',
                hidden: false
            })            
        });
 
        // Before parent code
 
        // Call parent (required)
        gwst.widgets.IdentifyWindow.superclass.initComponent.apply(this, arguments);
 
        // After parent code
        // e.g. install event handlers on rendered component
    },
    
    show_load: function() {
        var statusBar = Ext.getCmp('win-statusbar');        
        statusBar.showBusy(); 
    },
    
    hide_load: function() {
        var statusBar = Ext.getCmp('win-statusbar');  
        statusBar.clearStatus({
            anim: true,
            useDefaults:true
        });           	
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst.widgets.IdentifyWindow', gwst.widgets.IdentifyWindow);
gwst.widgets.MapToolWindow = Ext.extend(Ext.Window, {
    // Constructor Defaults, can be overridden by user's config object
    id: 'map_tool_win',
    title: '',
    height: 40,
    width: 136,
    closable: false,
    resizable: false,
    initComponent: function(){
        // Called during component initialization
 
        // Config object has already been applied to 'this' so properties can 
        // be overriden here or new properties (e.g. items, tools, buttons) 
        // can be added, eg:

        var toolbar = new gwst.widgets.ControlToolbar({
            map:Ext.getCmp('map').map,
            configurable: false,
            id: 'mt1'
        }); 
        
        Ext.apply(this, {
            x: 0,
            y: 30,
            layout:'fit',
            html:'some stuff goes here',
            tbar: toolbar
        });
 
        // Before parent code
 
        // Call parent (required)
        gwst.widgets.MapToolWindow.superclass.initComponent.apply(this, arguments);
 
        // After parent code
        // e.g. install event handlers on rendered component
    },
    
    onRender: function(){
        // Before parent code 
        // Call parent (required)
        gwst.widgets.MapToolWindow.superclass.onRender.apply(this, arguments); 
        // After parent code    
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst.widgets.MapToolWindow', gwst.widgets.MapToolWindow);
/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.tree.ColumnTree = Ext.extend(Ext.tree.TreePanel, {
    lines:false,
    borderWidth: Ext.isBorderBox ? 0 : 2, // the combined left/right border for each cell
    cls:'x-column-tree',
    
    onRender : function(){
        Ext.tree.ColumnTree.superclass.onRender.apply(this, arguments);
        this.headers = this.body.createChild(
            {cls:'x-tree-headers'},this.innerCt.dom);

        var cols = this.columns, c;
        var totalWidth = 0;

        for(var i = 0, len = cols.length; i < len; i++){
             c = cols[i];
             totalWidth += c.width;
             this.headers.createChild({
                 cls:'x-tree-hd ' + (c.cls?c.cls+'-hd':''),
                 cn: {
                     cls:'x-tree-hd-text',
                     html: c.header
                 },
                 style:'width:'+(c.width-this.borderWidth)+'px;'
             });
        }
        this.headers.createChild({cls:'x-clear'});
        // prevent floats from wrapping when clipped
        this.headers.setWidth(totalWidth);
        this.innerCt.setWidth(totalWidth);
    }
});

Ext.tree.ColumnNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    focus: Ext.emptyFn, // prevent odd scrolling behavior

    renderElements : function(n, a, targetNode, bulkRender){
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var t = n.getOwnerTree();
        var cols = t.columns;
        var bw = t.borderWidth;
        var c = cols[0];

        var buf = [
             '<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf ', a.cls,'">',
                '<div class="x-tree-col" style="width:',c.width-bw,'px;">',
                    '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
                    '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow">',
                    '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on">',
                    '<a hidefocus="on" class="x-tree-node-anchor" href="',a.href ? a.href : "#",'" tabIndex="1" ',
                    a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '>',
                    '<span unselectable="on">', n.text || (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]),"</span></a>",
                "</div>"];
         for(var i = 1, len = cols.length; i < len; i++){
             c = cols[i];

             buf.push('<div class="x-tree-col ',(c.cls?c.cls:''),'" style="width:',c.width-bw,'px;">',
                        '<div class="x-tree-col-text">',(c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]),"</div>",
                      "</div>");
         }
         buf.push(
            '<div class="x-clear"></div></div>',
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>");

        if(bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()){
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin",
                                n.nextSibling.ui.getEl(), buf.join(""));
        }else{
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.firstChild.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        this.anchor = cs[3];
        this.textNode = cs[3].firstChild;
    }
});
/*
MapToolbar
*/
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.MapToolbar = Ext.extend(Ext.Toolbar, {
    // Constructor Defaults, can be overridden by user's config object
    dropdowns: [],
    // mlpaFeaturesMenuToggleHandler: function(target, enabled){
    //     if(enabled){
    //             this.mlpaFeaturesMenu.show();
    //     }else{
    //             this.mlpaFeaturesMenu.hide();
    //     }
    // },

    // Override other inherited methods 
    onRender: function(){
        // Before parent code

        // Call parent (required)
        gwst.widgets.MapToolbar.superclass.onRender.apply(
            this, arguments);
        
        var text = this.addText('<span class="mmlogo"><a target="_blank" href="http://gwst.org" class="mmlogo"><img src="'+Ext.BLANK_IMAGE_URL+'" width="50" height="50" /></a></span><span class="mmlogotext"><a target="_blank" href="http://gwst.org" class="mmlogo">Marine<span class="map">MAP</span> Decision Support Tool</a></span>');
        text.restore = true;
        var fill = this.addFill();
        fill.restore = true;
        
        var self = this;
        
        var b = this.featuresMenu.getExtButton();
        // so the geometry editing actions know to put it back
        b.restore = true;
        this.addItem(this.featuresMenu.getExtButton());
        
        this.dataLayersMenu = new gwst.widgets.DataLayersMenu({
            onAddMapLayer: this.onAddMapLayer,
            onRemoveMapLayer: this.onRemoveMapLayer
        });
        this.dataLayersMenu.restore = true;
        this.dropdowns.push(this.addItem(this.dataLayersMenu));
                
        var sep = this.addSeparator();
        sep.restore = true;
        
        
        //Login button
        this.loginButton = new Ext.Button(gwst.actions.login);
        this.addItem(this.loginButton);
        
        
        //User pref dropdown
        var config = gwst.actions.userPrefsDropdown.initialConfig;
        //config['text'] = this.user.get('name');
        config['menu'] = [gwst.actions.logout, gwst.actions.changePassword];
        config['restore'] = true;
        this.userPrefDropDown = new Ext.SplitButton(config);
        this.userPrefDropDown.hide();
        this.addItem(this.userPrefDropDown);        
         
        
        //Help Button
        var h = this.addButton(gwst.actions.help);
        h.restore = true;
        var sp = this.addSeparator();
        sp.restore = true;
        
        // for(var i=0; i<this.dropdowns.length; i++){
        //     var dropdown = this.dropdowns[i];
        //     dropdown.on('click', function(target, e){
        //         this.collapseMenus(target);
        //         e.stopPropagation();
        //     }, this);
        // }
        // this.dataLayersMenu.window.setPosition({x: 0, y:10});
        this.dataLayersMenu.toggle(true);
        var self = this;
        $(this.userManager).bind('change', function(e, user, olduser){
            if(user == null && olduser != null){
                self.logout()
            }else if(user != null){
                self.login(user.name, user.permission_ecotrust_data);
            }
        });
    },
        
    // Called by gwst.app when focus on this component is taken away
    collapseMenus: function(skip){
        for(var i=0; i<this.dropdowns.length; i++){
            if(this.dropdowns[i] != skip){
                this.dropdowns[i].toggle(false);
            }
        }
        this.featuresMenu.getExtButton().toggle(false);
    },
    
    setState: function(state, userName, permissionEcotrustData ){
		if(state == 'logged in'){
			this.login(userName,permissionEcotrustData);
		}else{
			this.logout();
		}
    },
    
    
    login: function(userName,permissionEcotrustData){
		this.loginButton.hide();
		this.userPrefDropDown.setText(userName);
        this.userPrefDropDown.show();
        // this.mlpaFeaturesMenu.show();    
        // this.mlpaFeaturesMenu.reloadStore(); 
        
        if ( permissionEcotrustData ) {
            this.dataLayersMenu.store.loadData( gwst.data.EcotrustFishingImpactLayers, true );
            this.dataLayersMenu.store.sort( 'group', 'ASC' );
        }
    },
    
    logout: function(){
		this.loginButton.show();
        this.userPrefDropDown.hide();
        // this.mlpaFeaturesMenu.hide();
        // this.mlpaFeaturesMenu.window.hide();
        // this.mlpaFeaturesMenu.reloadStore();  
        
        // make sure ecotrust layer is removed
        this.dataLayersMenu.reinitLayers();
    }
    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-widgets-maptoolbar', gwst.widgets.MapToolbar);
/*
gwst.DropdownMenu, base class for all dropdown buttons
*/
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DropdownMenu = Ext.extend(Ext.Button, {
    toggleHandler: function(target, enabled){
        if(enabled){
            // this.window.setPosition(this.el.getLeft(), this.el.getBottom());
            // console.log('showing');
            this.window.show(this.getEl());
        }else{
            this.window.hide();
        }        
    },
 
    initComponent: function(){
        
        Ext.apply(this, {
            enableToggle: true,
            scope: this
        });
        
        gwst.widgets.DropdownMenu.superclass.initComponent.apply(
            this, arguments);
        this.window = new gwst.widgets.DropdownWindow({
            minimizable: true,
            animateTarget: this.id,
            button: this
        });
        // this.window.setAnimateTarget(this);
        this.window.show();
        this.window.hide();
        // this.setText(this.text);
    },
 
    onRender: function(){
        gwst.widgets.DropdownMenu.superclass.onRender.apply(
            this, arguments);
        // this.window.setPosition(gwst.app.viewPort.getLeft(), this.el.getBottom());
        // this.window.on('minimize', function(){
        //     this.toggle();
        // }, this);
    }
    
});

// No x-type definition as this is just a base-class
/*
Base class for windows that drop down from the map toolbar
*/
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DropdownWindow = Ext.extend(Ext.Window, {
    // Constructor Defaults, can be overridden by user's config object
    layout: 'fit',
    closable: false,
    draggable: true,
    // minimizable: true,
    // resizable: true,
    // resizeHandles: 's e',
    hideCollapseTool: true,
    layoutConfig: {
        titleCollapse: true,
        animate: true,
        hideCollapseTool: true
    },
    width: 300,
    constrain: true,
    height: 400,
    listeners: {
        'minimize': function(w){
            w.button.toggle(false);
        }
    }
});
 
// Base class, no need for xtype declaration
/*
DataLayersMenu
*/
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DataLayersMenu = Ext.extend(gwst.widgets.DropdownMenu, {
    id: 'dataLayersMenu',
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Called during component initialization
        // Config object has already been applied to 'this' so properties can 
        // be overriden here or new properties (e.g. items, tools, buttons) 
        // can be added, eg:
        Ext.apply(this, {
            text: 'Data Layers'
        });
 
        // Before parent code
 
        // Call parent (required)
        gwst.widgets.DataLayersMenu.superclass.initComponent.apply(
          this, arguments);
        // After parent code                      
    },
          
    // redraw layers: a brute-force way of rendering the map layers in their current list order
    redrawLayers: function(){
        var num_recs = this.store.getCount();
        var curr_rec;
 
        new_index = 0;
        
        // arrange the OpenLayers layers in the order they appear in the store
        for ( i = num_recs-1; i >= 0; i-- )
        {
            curr_rec = this.store.getAt(i); 
            if ( curr_rec.layerOn )
            {
                layer = curr_rec.get('layer');
                gwst.app.map.map.setLayerIndex( layer, new_index );
                new_index = new_index + 1;
            }
        }
    },
    
    turnOnDefaultLayers: function() {
        //TODO: NEED NEW GRID SUBCLASS WITH OWN ONRENDER
        //AND ALL OF THIS PUSHED INTO THAT METHOD.  selection model
        //simply isn't hooked up to the grid yet at this point
        var default_on_query = function(rec) {
        	var on_default = rec.get('on_default'); 
            return (on_default === true);
        };       
        //Look for layers to turn on by default
        var layer_recs = this.store.queryBy(default_on_query, this);
        
        //sm.selectRecords(layer_recs).createDelegate(sm);        
        var map = Ext.getCmp('map');
        for (var i=0; i<layer_recs.items.length; i++) {
            map.addDataLayer(layer_recs.items[i].get('layer'));
            layer_recs.items[i].layerOn = true; // draw check this row by default
        }
    },
    
    reinitLayers: function() {
        var map = Ext.getCmp('map');
        var num_recs = this.store.getCount();
        var curr_rec;

        // turn off any active layers
        for ( i = num_recs-1; i >= 0; i-- )
        {
            curr_rec = this.store.getAt(i); 
            if ( curr_rec.layerOn )
            {
                layer = curr_rec.get('layer');
                map.removeDataLayer( layer );            
                curr_rec.layerOn = false;
            }
        }
        
        this.store.removeAll();
        this.store.loadData( gwst.data.DataLayers );
        this.turnOnDefaultLayers();
        this.store.sort( 'group', 'ASC' );
        
        if ( this.FisheryImpactMapSelector.rendered ) {
            this.FisheryImpactMapSelector.hide();
        }
    },
    
    toggleLayerHandler: function(sm, rowIndex, rec) {
        var layer = rec.get('layer');
        if ( !rec.layerOn )
        {
            rec.layerOn = true;
            this.onAddMapLayer(rec.get('layer'));
            
            // show the Fishery impact sublayer selector, if that layer is being turned on
            if ( rec.get('name') == 'Ecotrust Fishing Ground Maps' )
            {
                this.FisheryImpactMapSelector.show();
            }
        } else {
            rec.layerOn = false;
            this.onRemoveMapLayer(rec.get('layer'));
            
            // hide the Fishery impact sublayer selector, if that layer is being turned off
            if ( rec.get('name') == 'Ecotrust Fishing Ground Maps' )
            {
                this.FisheryImpactMapSelector.hide();
            }
        }
        this.redrawLayers();
    },
    
    mergeFisheryImpactMapParams: function( newParams ) {
        var num_recs = this.store.getCount();
        var curr_rec;
        
        // find the fishery impact layer
        for ( i = 0; i < num_recs; i++ )
        {
            curr_rec = this.store.getAt(i); 
            if ( curr_rec.get('name') == 'Ecotrust Fishing Ground Maps' )
            {
                curr_rec.get('layer').mergeNewParams( newParams );
                break;
            }
        }
    },
 
    // Override other inherited methods 
    onRender: function(){
        // Before parent code 
        // Call parent (required)
        gwst.widgets.DataLayersMenu.superclass.onRender.apply(this, arguments); 
        // After parent code
        
        var expander = new Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<p><i>Description: {desc}</i></p>',
                '<p><img src=\'{legend_url}\'></p>',
                '<p><i>Metadata: {metadata}</i></p>'
            )
        });
        
        var reader = new Ext.data.ArrayReader({}, [
           {name: 'name'},
           {name: 'group'},
           {name: 'layer'},
           {name: 'legend_url'},
           {name: 'desc'},
           {name: 'metadata'},
           {name: 'on_default'}
        ]);
    
        var sm = new Ext.grid.MmappSelectionModel({
            singleSelect:true,
            header: '<div id="fool-ext-into-hiding-header2" class="eh"></div>'
        });
        
        // e.g. install event handlers on rendered component        
        sm.addListener('toggleLayer', this.toggleLayerHandler, this);
        
        var toolbar = new gwst.widgets.ControlToolbar({
            map:Ext.getCmp('map').map,
            configurable: false,
            id: 'mt1'
        });  
        
        
        this.FisheryImpactMapSelector = new gwst.widgets.FisheryImpactMapSelectorWindow();
        
        this.store = new Ext.data.Store({
            reader: reader,
            data: gwst.data.DataLayers
        });
        this.store.sort( 'group' );
        
        this.grid = new Ext.grid.GridPanel({        	
            id:'the-grid',
            store: this.store,
            cm: new Ext.grid.ColumnModel([
                sm,
                expander,
                {id:'name',header: "Name", width: 210, sortable: true, dataIndex: 'name'},
                {header: "Category", width: 140, sortable: true, dataIndex: 'group'}
            ]),
            sm:sm,
            width:500,
            height:300,
            viewConfig: {
                forceFit:true
            },        
            plugins: expander,        
            frame:false,
            enableDragDrop:true,
            ddGroup: 'mmDDGroup',
            listeners: {
                sortchange: function() {
                    Ext.getCmp('dataLayersMenu').redrawLayers();
                },
                render: function(g) {
                    // Best to create the drop target after render, so we don't need to worry about whether grid.el is null

                    // constructor parameters:
                    //    grid (required): GridPanel or EditorGridPanel (with enableDragDrop set to true and optionally a value specified for ddGroup, which defaults to 'GridDD')
                    //    config (optional): config object
                    // valid config params:
                    //    anything accepted by DropTarget
                    //    listeners: listeners object. There are 4 valid listeners, all listed in the example below
                    //    copy: boolean. Determines whether to move (false) or copy (true) the row(s) (defaults to false for move)
                    var ddrow = new Ext.ux.dd.GridReorderDropTarget(g, {
                        copy: false,
                        listeners: {
                            beforerowmove: function(objThis, oldIndex, newIndex, records) {
                                // return false to cancel the move
                            }
                            ,afterrowmove: function(objThis, oldIndex, newIndex, records) {
                                Ext.getCmp('dataLayersMenu').redrawLayers();
                            }
                            ,beforerowcopy: function(objThis, oldIndex, newIndex, records) {
                                // return false to cancel the copy
                            }
                            ,afterrowcopy: function(objThis, oldIndex, newIndex, records) {
                            }
                        }
                    });
                    
                    // if you need scrolling, register the grid view's scroller with the scroll manager
                    Ext.dd.ScrollManager.register(g.getView().getEditorParent());
                }
                ,beforedestroy: function(g) {
                    // if you previously registered with the scroll manager, unregister it (if you don't it will lead to problems in IE)
                    Ext.dd.ScrollManager.unregister(g.getView().getEditorParent());
                }
            },
            iconCls:'icon-grid'        
        });
        sm.addListener({
            'beforerowselect': function(sm, rowIndex, keepExisting, record){
                // console.log(sm, rowIndex, keepExisting, record);
                // console.log(e);
                // sm.selectRow(rowIndex);
                if(keepExisting === false){
                    return false;
                }
            }
        });
        
        this.turnOnDefaultLayers();
        
        this.window.add(this.grid);
        this.window.x = 0;
        this.window.y = 76;
        this.window.setTitle('Data Layers');          
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-widgets-datalayersmenu', gwst.widgets.DataLayersMenu);
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DataLayerTreePanel = Ext.extend(Ext.tree.TreePanel, {
   loader: new Ext.tree.TreeLoader(),
   bodyBorder: false,
   border: false,   
   collapseFirst: false,
   rootVisible: false
});

gwst.widgets.DataLayerTreeRoot = new Ext.tree.AsyncTreeNode({
    draggable:false,
    id:'data_layer_root',
    children: gwst.data.DataLayers
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.grid.RowExpander = function(config){
    Ext.apply(this, config);

    this.addEvents({
        beforeexpand : true,
        expand: true,
        beforecollapse: true,
        collapse: true
    });

    Ext.grid.RowExpander.superclass.constructor.call(this);

    if(this.tpl){
        if(typeof this.tpl == 'string'){
            this.tpl = new Ext.Template(this.tpl);
        }
        this.tpl.compile();
    }

    this.state = {};
    this.bodyContent = {};
};

Ext.extend(Ext.grid.RowExpander, Ext.util.Observable, {
    header: "",
    width: 20,
    sortable: false,
    fixed:true,
    menuDisabled:true,
    dataIndex: '',
    id: 'expander',
    lazyRender : true,
    enableCaching: true,

    getRowClass : function(record, rowIndex, p, ds){
        p.cols = p.cols-1;
        var content = this.bodyContent[record.id];
        if(!content && !this.lazyRender){
            content = this.getBodyContent(record, rowIndex);
        }
        if(content){
            p.body = content;
        }
        return this.state[record.id] ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed';
    },

    init : function(grid){
        this.grid = grid;

        var view = grid.getView();
        view.getRowClass = this.getRowClass.createDelegate(this);

        view.enableRowBody = true;

        grid.on('render', function(){
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    getBodyContent : function(record, index){
        if(!this.enableCaching){
            return this.tpl.apply(record.data);
        }
        var content = this.bodyContent[record.id];
        if(!content){
            content = this.tpl.apply(record.data);
            this.bodyContent[record.id] = content;
        }
        return content;
    },

    onMouseDown : function(e, t){
        if(t.className == 'x-grid3-row-expander'){
            e.stopEvent();
            var row = e.getTarget('.x-grid3-row');
            this.toggleRow(row);
        }
    },

    renderer : function(v, p, record){
        p.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-expander">&#160;</div>';
    },

    beforeExpand : function(record, body, rowIndex){
        if(this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false){
            if(this.tpl && this.lazyRender){
                body.innerHTML = this.getBodyContent(record, rowIndex);
            }
            return true;
        }else{
            return false;
        }
    },

    toggleRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        this[Ext.fly(row).hasClass('x-grid3-row-collapsed') ? 'expandRow' : 'collapseRow'](row);
    },

    expandRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
        if(this.beforeExpand(record, body, row.rowIndex)){
            this.state[record.id] = true;
            Ext.fly(row).replaceClass('x-grid3-row-collapsed', 'x-grid3-row-expanded');
            this.fireEvent('expand', this, record, body, row.rowIndex);
        }
    },

    collapseRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
        if(this.fireEvent('beforecollapse', this, record, body, row.rowIndex) !== false){
            this.state[record.id] = false;
            Ext.fly(row).replaceClass('x-grid3-row-expanded', 'x-grid3-row-collapsed');
            this.fireEvent('collapse', this, record, body, row.rowIndex);
        }
    }
});

﻿Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.LoginForm = Ext.extend(Ext.form.FormPanel, {
    // Constructor Defaults, can be overridden by user's config object
    // id: 'frmLogin',
    
    closeWindow: function(){
        this.ownerCt.hide();
        this.hide();
    },
    
    initComponent: function() {

        var submitAction = {
            text: 'Login',
            scope: this,
            handler: function() {
                var mask = new Ext.LoadMask(this.ownerCt.getEl(), {msg: 'Logging you in...'});
                mask.show();
                
                this.buttons[0].disable();
                this.form.submit({
                    url: gwst.urls.login,
                    method: 'POST',
                    scope: this,
                    success: function(theForm, responseObj) {
                        mask.hide();
                        this.buttons[0].enable();
                        this.closeWindow();
                        gwst.actions.utils.setUser(responseObj.result.returnObj.user);
                    },
                    failure: function(theForm, responseObj) {
                        mask.hide();
                        if (responseObj.failureType == 'client') {
                            alert('You must specify both a username and password.');
                        } else {
                            alert(responseObj.result.message);
                        }
                        this.buttons[0].enable();
                    },
                    scope: this
                });
            }
        }

        var cancelAction = {
            text: 'Cancel',
            scope: this,
            handler: this.closeWindow
        }

        var keyAction = {
            key: Ext.EventObject.ENTER,
            fn: submitAction.handler,
            scope: this
        }


        Ext.apply(this, {
            frame: true,
            title: 'Log in to gwst',
            bodyStyle: 'padding:5px 5px 0',
            defaults: {
                msgTarget: 'side'
            },
            defaultType: 'textfield',
            buttons: [
				submitAction,
                cancelAction
			],
            keys: [
			    keyAction
			],
            items: [
                {
                    fieldLabel: 'Login',
                    name: 'name',
                    allowBlank: false
                }, {
                    fieldLabel: 'Password',
                    name: 'password',
                    allowBlank: false,
                    inputType: 'password'
                }, {
                    xtype: 'container',
                    autoEl: {
                        html: '<a onclick="gwst.actions.currentLoginWindow.hide(); gwst.actions.resetPassword.execute(); return false;" href="#">Help I forgot my password!</a>'
                    }
                }
			]
        });

        gwst.widgets.LoginForm.superclass.initComponent.apply(this, arguments);

        var form = this.getForm();
        setTimeout(function(){
            var field = form.findField('name');
            if(field){
                field.focus();
            }
        }, 200);
    }

});

﻿Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PasswordResetForm = Ext.extend(Ext.form.FormPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function() {

        var submitAction = {
            text: 'Reset my password',
            scope: this,
            handler: function() {
                //Display status text
                var mask = new Ext.LoadMask(this.getEl(), {msg: 'Resetting your password...'});
                mask.show();
                        
                this.buttons[0].disable();
                this.form.submit({
                    url: gwst.urls.sendPassword,
                    method: 'POST',
                    success: function(theForm, responseObj) {
                        mask.hide();
                        this.buttons[0].enable();
                        this.ownerCt.hide();
                        this.hide();
                        Ext.Msg.alert('Password Reset!', 'An email has been send with your new password.');
                    },
                    failure: function(theForm, responseObj) {
                        mask.hide();
                        if(responseObj.result){
                            Ext.Msg.alert('There was a problem resetting your password', responseObj.result.message);
                            this.ownerCt.hide();
                            this.hide();
                        }else{
                            // validation of the form failed
                            Ext.Msg.alert('', 'Please correct any errors in the form.');
                            this.buttons[0].enable();
                        }
                    },
                    scope: this
                });
            }
        }

        var cancelAction = {
            text: 'Cancel',
            scope: this,
            handler: function() {
                this.ownerCt.hide();
                this.hide();
            }
        }


        var keyAction = {
            key: Ext.EventObject.ENTER,
            fn: submitAction.handler,
            scope: this
        }


        Ext.apply(this, {
            url: gwst.urls.sendPassword,
            method: 'POST',
            frame: true,
            title: 'Reset Password',
            bodyStyle: 'padding:5px 5px 0',
            labelWidth: 150,
            defaults: {
                msgTarget: 'side'
            },
            defaultType: 'textfield',
            buttons: [
					submitAction,
                    cancelAction
				],
            keys: [
                keyAction
			],
            items: [
                {
                    xtype: 'container',
                    autoEl: {
                        html: '<h1>Did you forget your password?</h1><p style="margin-bottom:15px;">Enter your username below, and we\'ll email a NEW password to the email address we have on file.</p>'
                    }
                }
                , {
                    fieldLabel: 'Enter your username',
                    name: 'username',
                    allowBlank: false
                }
            ]

        });

        gwst.widgets.PasswordResetForm.superclass.initComponent.apply(this, arguments);
        var form = this.getForm();
        setTimeout(function(){
            var field = form.findField('username');
            if(field){
                field.focus();
            }
        }, 200);
    }

});
﻿Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PasswordChangeForm = Ext.extend(Ext.form.FormPanel, {
    // Constructor Defaults, can be overridden by user's config object
    // id: 'frmChangePassword',

    initComponent: function() {
        var submitAction = {
            text: 'Change my password',
            scope: this,
            handler: function() {
                var mask = new Ext.LoadMask(this.getEl(), {msg: 'Changing your password...'});
                mask.show();
                this.buttons[0].disable();
                this.form.submit({
                    url: gwst.urls.changePassword,
                    method: 'POST',
                    success: function(theForm, responseObj) {
                        mask.hide();
                        this.buttons[0].enable();
                        this.ownerCt.hide();
                        this.hide();
                        Ext.Msg.alert('Password Changed!', 'An email has been sent with your new password.');
                    },
                    failure: function(theForm, responseObj) {
                        mask.hide();
                        if(responseObj.result){
                            Ext.Msg.alert('There was a problem changing your password', responseObj.result.message);
                            this.ownerCt.hide();
                            this.hide();
                        }else{
                            // validation of the form failed
                            Ext.Msg.alert('', 'Please correct any errors in the form.');
                            this.buttons[0].enable();
                        }
                    },
                    scope: this
                });
            }
        }

        var cancelAction = {
            text: 'Cancel',
            scope: this,
            handler: function() {
                this.ownerCt.hide();
                this.hide();
            }
        }

        var keyAction = {
            key: Ext.EventObject.ENTER,
            fn: submitAction.handler,
            scope: this
        }


        Ext.apply(this, {
            url: gwst.urls.sendPassword,
            method: 'POST',
            frame: true,
            title: 'Change Your Password',
            bodyStyle: 'padding:5px 5px 0',
            labelWidth: 150,
            defaults: {
                msgTarget: 'side'
            },
            defaultType: 'textfield',
            buttons: [
					submitAction,
                    cancelAction
				],
            keys: [
                keyAction
			],
            items: [
                {
                    xtype: 'container',
                    autoEl: {
                        html: '<h1>Want to change your password?</h1><p style="margin-bottom:15px;">Enter your old and new passwords below, and we\'ll email your new password to the email address we have on file.</p>'
                    }
                }
                , {
                    fieldLabel: 'Enter your old password',
                    name: 'password_old',
                    allowBlank: false,
                    inputType: 'password'
                }
                , {
                    fieldLabel: 'Enter your new password',
                    name: 'password_new',
                    allowBlank: false,
                    inputType: 'password'
                }
                , {
                    fieldLabel: 'Confirm your new password',
                    name: 'password_confirm',
                    allowBlank: false,
                    inputType: 'password'
                }
            ]

        });

        gwst.widgets.PasswordChangeForm.superclass.initComponent.apply(this, arguments);
        //this.show();
        var form = this.getForm();
        setTimeout(function(){
            var field = form.findField('password_old');
            if(field){
                field.focus();
            }
        }, 200);
    }

});
﻿Ext.namespace('gwst', 'gwst.widgets');

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
Ext.namespace('Ext.ux.dd');

Ext.ux.dd.GridReorderDropTarget = function(grid, config)
{
    this.target = new Ext.dd.DropTarget(grid.getEl(),
    {
        ddGroup: grid.ddGroup || 'GridDD',
        grid: grid,
        gridDropTarget: this,
        notifyDrop: function(dd, e, data)
        {
            // Remove drag lines. The 'if' condition prevents null error when drop occurs without dragging out of the selection area
            if (this.currentRowEl)
            {
                this.currentRowEl.removeClass('grid-row-insert-below');
                this.currentRowEl.removeClass('grid-row-insert-above');
            }

            // determine the row
            var t = Ext.lib.Event.getTarget(e);
            var rindex = this.grid.getView().findRowIndex(t);
            
            // override the data that came in, it's old
            data.selections = this.grid.getSelectionModel().getSelections();
                        
            if (rindex === false || rindex == data.rowIndex)
            {
                return false;
            }
            // fire the before move/copy event
            //if (this.gridDropTarget.fireEvent(this.copy ? 'beforerowcopy' : 'beforerowmove', this.gridDropTarget, data.rowIndex, rindex, data.selections, 123) === false)
            if (this.gridDropTarget.fireEvent('beforerowmove', this.gridDropTarget, data.rowIndex, rindex, data.selections, 123) === false)
            {
                return false;
            }

            // update the store
            var ds = this.grid.getStore();

            // Changes for multiselction by Spirit
            var selections = new Array();
            var keys = ds.data.keys;
            for (var key in keys)
            {
                for (var i = 0; i < data.selections.length; i++)
                {
                    if (keys[key] == data.selections[i].id)
                    {
                        // Exit to prevent drop of selected records on itself.
                        if (rindex == key)
                        {
                            return false;
                        }
                        selections.push(data.selections[i]);
                    }
                }
            }

            // fix rowindex based on before/after move
            if (rindex > data.rowIndex && this.rowPosition < 0)
            {
                rindex--;
            }
            if (rindex < data.rowIndex && this.rowPosition > 0)
            {
                rindex++;
            }

            // fix rowindex for multiselection
            if (rindex > data.rowIndex && data.selections.length > 1)
            {
                rindex = rindex - (data.selections.length - 1);
            }

            // we tried to move this node before the next sibling, we stay in place
            if (rindex == data.rowIndex)
            {
                return false;
            }

            // fire the before move/copy event
            /* dupe - does it belong here or above???
            if (this.gridDropTarget.fireEvent(this.copy ? 'beforerowcopy' : 'beforerowmove', this.gridDropTarget, data.rowIndex, rindex, data.selections, 123) === false)
            {
                return false;
            }
            */

            // KJV: disable copying
            //if (!this.copy) 
            //{
                for (var i = 0; i < data.selections.length; i++) 
                {
                    ds.remove(ds.getById(data.selections[i].id));
                }
            //}

            for (var i = selections.length - 1; i >= 0; i--)
            {
                var insertIndex = rindex;
                ds.insert(insertIndex, selections[i]);
            }

            // re-select the row(s)
            var sm = this.grid.getSelectionModel();
            if (sm)
            {
                sm.selectRecords(data.selections);
            }

            // fire the after move/copy event
            //this.gridDropTarget.fireEvent(this.copy ? 'afterrowcopy' : 'afterrowmove', this.gridDropTarget, data.rowIndex, rindex, data.selections);
            this.gridDropTarget.fireEvent('afterrowmove', this.gridDropTarget, data.rowIndex, rindex, data.selections);
            return true;
        },
        notifyOver: function(dd, e, data) 
        {
            var t = Ext.lib.Event.getTarget(e);
            var rindex = this.grid.getView().findRowIndex(t);

            // Similar to the code in notifyDrop. Filters for selected rows and quits function if any one row matches the current selected row.
            var ds = this.grid.getStore();
            var keys = ds.data.keys;
            for (var key in keys) 
            {
                for (var i = 0; i < data.selections.length; i++) 
                {
                    if (keys[key] == data.selections[i].id) 
                    {
                        if (rindex == key) 
                        {
                            if (this.currentRowEl) 
                            {
                                this.currentRowEl.removeClass('grid-row-insert-below');
                                this.currentRowEl.removeClass('grid-row-insert-above');
                            }
                            return this.dropNotAllowed;
                        }
                    }
                }
            }

            // If on first row, remove upper line. Prevents negative index error as a result of rindex going negative.
            if (rindex < 0 || rindex === false) 
            {
                this.currentRowEl.removeClass('grid-row-insert-above');
                return this.dropNotAllowed;
            }

            try 
            {
                var currentRow = this.grid.getView().getRow(rindex);
                // Find position of row relative to page (adjusting for grid's scroll position)
                var resolvedRow = new Ext.Element(currentRow).getY() - this.grid.getView().scroller.dom.scrollTop;
                var rowHeight = currentRow.offsetHeight;

                // Cursor relative to a row. -ve value implies cursor is above the row's middle and +ve value implues cursor is below the row's middle.
                this.rowPosition = e.getPageY() - resolvedRow - (rowHeight/2);

                // Clear drag line.
                if (this.currentRowEl) 
                {
                    this.currentRowEl.removeClass('grid-row-insert-below');
                    this.currentRowEl.removeClass('grid-row-insert-above');
                }

                if (this.rowPosition > 0) 
                {
                    // If the pointer is on the bottom half of the row.
                    this.currentRowEl = new Ext.Element(currentRow);
                    this.currentRowEl.addClass('grid-row-insert-below');
                } 
                else 
                {
                    // If the pointer is on the top half of the row.
                    if (rindex - 1 >= 0) 
                    {
                        var previousRow = this.grid.getView().getRow(rindex - 1);
                        this.currentRowEl = new Ext.Element(previousRow);
                        this.currentRowEl.addClass('grid-row-insert-below');
                    } 
                    else 
                    {
                        // If the pointer is on the top half of the first row.
                        this.currentRowEl.addClass('grid-row-insert-above');
                    }
                }
            } 
            catch (err) 
            {
                console.warn(err);
                rindex = false;
            }
            return (rindex === false)? this.dropNotAllowed : this.dropAllowed;
        },
        notifyOut: function(dd, e, data) 
        {
            // Remove drag lines when pointer leaves the gridView.
            if (this.currentRowEl) 
            {
                this.currentRowEl.removeClass('grid-row-insert-above');
                this.currentRowEl.removeClass('grid-row-insert-below');
            }
        }
    });

    if (config) 
    {
        Ext.apply(this.target, config);
        if (config.listeners)
        {
            Ext.apply(this,
            {
              listeners: config.listeners
            });
        }
    }

    this.addEvents(
    {
        'beforerowmove': true,
        'afterrowmove': true,
        'beforerowcopy': true,
        'afterrowcopy': true
    });

    Ext.ux.dd.GridReorderDropTarget.superclass.constructor.call(this);
};    

Ext.extend(Ext.ux.dd.GridReorderDropTarget, Ext.util.Observable, 
{
    getTarget: function() 
    {
        return this.target;
    },
    getGrid: function() 
    {
        return this.target.grid;
    }
    /*getCopy: function() 
    {
        return this.target.copy ? true : false;
    },
    setCopy: function(b) 
    {
        this.target.copy = b ? true : false;
    }*/
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
 * @class Ext.grid.MmappSelectionModel
 * @extends Ext.grid.RowSelectionModel
 * A custom selection model that renders a column of checkboxes that can be toggled to select or deselect rows.
 * @constructor
 * @param {Object} config The configuration options
 */
Ext.grid.MmappSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {
    /**
     * @cfg {String} header Any valid text or HTML fragment to display in the header cell for the checkbox column
     * (defaults to '&lt;div class="x-grid3-hd-checker">&#160;&lt;/div>').  The default CSS class of 'x-grid3-hd-checker'
     * displays a checkbox in the header and provides support for automatic check all/none behavior on header click.
     * This string can be replaced by any valid HTML fragment, including a simple text string (e.g., 'Select Rows'), but
     * the automatic check all/none behavior will only work if the 'x-grid3-hd-checker' class is supplied.
     */
    header: '<div class="x-grid3-hd-checker">&#160;</div>',
    /**
     * @cfg {Number} width The default width in pixels of the checkbox column (defaults to 20).
     */
    width: 20,
    /**
     * @cfg {Boolean} sortable True if the checkbox column is sortable (defaults to false).
     */
    sortable: false,

    // private
    menuDisabled:true,
    fixed:true,
    dataIndex: '',
    id: 'checker',

    // private
    initEvents : function(){
        Ext.grid.MmappSelectionModel.superclass.initEvents.call(this);
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    
    // private
    onMouseDown : function(e, t){
        if(e.button === 0 ) // Only fire if left-click
        {
            e.stopEvent();
            var row = e.getTarget('.x-grid3-row');
            if(row){
                var index = row.rowIndex;
                var rec = this.grid.store.getAt(index);
                var checkbox;
                                               
                if (t.className.match('x-grid3-row-checker') != 'x-grid3-row-checker')
                {
                    if ( t.className != 'x-grid3-row-expander'){ // clicked on a non-checkbox part of row 
                        this.selectRow(index, true);  
                        checkbox = Ext.fly(t.parentNode.parentNode.firstChild.firstChild.firstChild);
                        if (!rec.layerOn)
                        {   
                            checkbox.removeClass('x-grid3-row-checker');
                            checkbox.removeClass('x-grid3-row-checker-on'); 
                            checkbox.addClass('x-grid3-row-checker-off');
                        }
                    }
                }
                else // user clicked a checkbox
                {
                    this.fireEvent("toggleLayer", this, index, rec); 
                    checkbox = Ext.fly(t);
                    
                    if (!rec.layerOn) {
                        //checkbox.addClass('x-grid3-row-checker');
                        checkbox.addClass('x-grid3-row-checker-off');
                        checkbox.removeClass('x-grid3-row-checker-on'); 
                    } else {
                        checkbox.addClass('x-grid3-row-checker-on');
                        checkbox.removeClass('x-grid3-row-checker');
                        checkbox.removeClass('x-grid3-row-checker-off');
                    }  
                }  
            }
        }
    },

    // private
    renderer : function(v, p, record){
        if ( record.layerOn ){
            return '<div class="x-grid3-row-checker-on">&#160;</div>';
        } else {
            return '<div class="x-grid3-row-checker-off">&#160;</div>';
        }
    }
});
Ext.namespace('gwst', 'gwst.widgets');

/*** Widgets for selecting a fishing impact map ***/

gwst.widgets.FisheryImpactMapSelectorForm = Ext.extend(Ext.form.FormPanel, {
    // Constructor Defaults, can be overridden by user's config object
    id: 'FisheryImpactMapSelectorPanel',

    successPanel: 'initialized below',
    statusPanel: 'initialized below',

    initComponent: function() {
    
        this.group_sel = new Ext.form.ComboBox({
                        store: new Ext.data.SimpleStore({
                            fields: ['abbr','group'],
                            data: gwst.data.FisheryImpactMapUserGroups
                            }),
                        displayField:'group',
                        valueField:'abbr',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        emptyText:'Select a user group',
                        selectOnFocus:true,
                        fieldLabel:'User Group',
                        hiddenName:'group',
                        width:235,
                        forceSelection:true
                    });
                    
        this.group_sel.on( 'select', this.selectGroup, this );
            
        this.speciesSelectStore = new Ext.data.SimpleStore({
                            fields: ['abbr','species'],
                            data: [] //gwst.data.FisheryImpactMapFishSpecies
                            });
                    
        this.species_sel = new Ext.form.ComboBox({
                        store: this.speciesSelectStore,
                        displayField:'species',
                        valueField:'abbr',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        emptyText:'Select a species',
                        selectOnFocus:true,
                        fieldLabel:'Species',
                        hiddenName:'species',
                        width:235,
                        forceSelection:true
                    });
                    
        this.portSelectStore = new Ext.data.SimpleStore({
                            fields: ['abbr','port'],
                            data: [] //gwst.data.FisheryImpactMapFishPorts
                            });
                    
        this.port_sel = new Ext.form.ComboBox({
                        store: this.portSelectStore,
                        displayField:'port',
                        valueField:'abbr',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        emptyText:'Select a port/county',
                        selectOnFocus:true,
                        fieldLabel:'Port/County',
                        hiddenName:'port',
                        width:235,
                        forceSelection:true
                    });
                    
        this.port_sel.on( 'select', this.selectPort, this );

        Ext.apply(this, {
            frame: true,
            border: false,
            bodyStyle: 'padding:5px 5px 0',
            formId: 'frmfimap',
            defaults: {
                msgTarget: 'side'
            },
            defaultType: 'textfield',
            items: [ this.group_sel, this.port_sel, this.species_sel ]
        });

        gwst.widgets.FisheryImpactMapSelectorForm.superclass.initComponent.apply(this, arguments);
    }, 
      
    selectGroup: function() {
        // get the selected element
        var sel_group = this.group_sel.getValue();
        
        // set the port store to the appropriate data
        this.port_sel.reset();
        this.portSelectStore.removeAll();

        for ( grp in gwst.data.FisheryImpactMapPortsByGroup ) {
            if ( gwst.data.FisheryImpactMapPortsByGroup[grp][0] == sel_group ) {
                this.portSelectStore.loadData( gwst.data.FisheryImpactMapPortsByGroup[grp][1] );
                break;
            }
        }
        
        // clear the species store as well -- group and port required to generate species selection list
        this.species_sel.reset();
        this.speciesSelectStore.removeAll();
    },
    
    selectPort: function() {
        // get the selected elements
        var prev_species = this.species_sel.getValue();
        var sel_group = this.group_sel.getValue();
        var sel_port = this.port_sel.getValue();
        
        // clear the species store -- group and port required to generate species selection list
        this.species_sel.reset();
        this.speciesSelectStore.removeAll();
        
        var key = 0;
        var val_list = 1;
        
        // mine out our desired array from the multi-dimensional array
        for ( grp in gwst.data.FisheryImpactMapSpeciesByGroup ) {
            if ( gwst.data.FisheryImpactMapSpeciesByGroup[grp][key] == sel_group ) {
                var this_group = gwst.data.FisheryImpactMapSpeciesByGroup[grp][val_list];
                
                // check if this group has all ports mapped to one array
                if ( this_group.length == 1 ) {
                    this.speciesSelectStore.loadData( this_group[0][val_list] );
                    break;
                } else {
                    for ( port in this_group ) {
                        if ( this_group[port][key] == sel_port ) {
                            this.speciesSelectStore.loadData( this_group[port][val_list] );
                            break;
                        }
                    }
                    break;
                }
            }
        }
        
        // see if we can replace the former port value
        if ( this.speciesSelectStore.find( 'abbr', prev_species ) >= 0 ) {
            this.species_sel.setValue( prev_species );
        }
    }
});



gwst.widgets.FisheryImpactMapSelectorWindow = Ext.extend(Ext.Window, {
    
    thisForm: undefined,

    initComponent: function() {

        this.thisForm = new gwst.widgets.FisheryImpactMapSelectorForm();

        var submitAction = {
            text: 'Load Fishery Impact Layer',
            scope: this,
            handler: function() {
                //this.scope applies when the user hits the enter key
                this.scope = !this.scope ? this : this.scope;
                Ext.getCmp('dataLayersMenu').mergeFisheryImpactMapParams( this.thisForm.form.getValues() );
            }
        };


        var cancelAction = {
            text: 'Close',
            scope: this,
            handler: function() {
                this.hide();
            }
        };
        
        var keyAction = {
            key: Ext.EventObject.ENTER,
            fn: function() { submitAction.handler(); }
        };

        Ext.apply(this, {
            id: 'windowFisheryImpactMapSelector',
            title: 'Select a fishing ground layer',            
            closeAction: 'hide',
            closable: true,
            width: 380,
            items: [
                this.thisForm
			],
            keys: [
				    this, keyAction
				],
            buttons: [
				submitAction,
                cancelAction
			]
        });

        gwst.widgets.FisheryImpactMapSelectorWindow.superclass.initComponent.apply(this, arguments);


    }
});

/*** Widgets for selecting fishery impact analysis ***/

gwst.widgets.FisheryImpactAnalysisSelectorForm = Ext.extend(Ext.form.FormPanel, {
    // Constructor Defaults, can be overridden by user's config object
    id: 'FisheryImpactAnalysisSelectorPanel',

    successPanel: 'initialized below',
    statusPanel: 'initialized below',

    initComponent: function() {    	
        this.group_sel = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['group'],
                data: this.getGroups()
                }),
            displayField:'group',
            valueField:'group',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText:'Select a user group',
            selectOnFocus:true,
            fieldLabel:'User Group',
            hiddenName:'group',
            width:235,
            forceSelection:true
        });
                    
        this.group_sel.on( 'select', this.selectGroup, this );
                    
        this.portSelectStore = new Ext.data.SimpleStore({
            fields: ['home'],
            data: []
        });
                    
        this.port_sel = new Ext.form.ComboBox({
            store: this.portSelectStore,
            displayField:'home',
            valueField:'home',
            typeAhead: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText:'Select a port/county',
            selectOnFocus:true,
            fieldLabel:'Port/County',
            hiddenName:'home',
            width:235,
            forceSelection:true
        });                   

        Ext.apply(this, {
            frame: true,
            border: false,
            bodyStyle: 'padding:5px 5px 0',
            formId: 'frmfianalysis',
            defaults: {
                msgTarget: 'side'
            },
            defaultType: 'textfield',
            items: [ this.group_sel, this.port_sel ]
        });

        gwst.widgets.FisheryImpactAnalysisSelectorForm.superclass.initComponent.apply(this, arguments);
    }, 
    
    getGroups: function() {
        var groups = gwst.data.FisheryImpactAnalysisUserGroups;
        var group_names = [];
        for(i=0;i<groups.length;i++) {
            group = groups[i];
            group_names.push([group.name]);
        }
        return group_names;
    },
    
    getPorts: function(group_name) {
        var groups = gwst.data.FisheryImpactAnalysisUserGroups;
        for(i=0;i<groups.length;i++) {
            group = groups[i];
            if (group.name == group_name) {
                port_names = [];
                for(j=0;j<group.homes.length;j++) {
                   home_name = group.homes[j];
                   port_names.push([home_name]);
                }
            }
        }
        return port_names;      
    },
      
    selectGroup: function() {
        // Get the current port
        var sel_group = this.group_sel.getValue();        
        // Set the port store to the appropriate data
        this.port_sel.reset();
        this.portSelectStore.removeAll();        
        // Load ports for the selected group
        this.portSelectStore.loadData(this.getPorts(sel_group));      
    }
});

gwst.widgets.FisheryImpactAnalysisSelectorWindow = Ext.extend(Ext.Window, {
    
    thisForm: undefined,

    initComponent: function() {
        this.thisForm = new gwst.widgets.FisheryImpactAnalysisSelectorForm();

        var submitAction = {
            text: 'Load Fishery Impact Report',
            scope: this,
            handler: function() {
                //this.scope applies when the user hits the enter key
                this.scope = !this.scope ? this : this.scope;
                var values = this.thisForm.form.getValues();
                if (values.group == '' || values.home == '' ) {
                	gwst.ui.error.show({
                        errorText: 'You must select both a user group and port/county'
                    });
                    return;
                }
                
                this.runAnalysis(values);
            }
        };

        var cancelAction = {
            text: 'Close',
            scope: this,
            handler: function() {
                this.hide();
            }
        };
        
        var keyAction = {
            key: Ext.EventObject.ENTER,
            fn: function() { submitAction.handler(); }
        };

        Ext.apply(this, {
            id: 'windowFisheryImpactAnalysisSelector',
            closeAction: 'hide',
            title: 'Choose report to load',
            closable: true,
            width: 380,
            items: [
                this.thisForm
            ],
            keys: [
                    this, keyAction
                ],
            buttons: [
                submitAction,
                cancelAction
            ]
        });

        gwst.widgets.FisheryImpactAnalysisSelectorWindow.superclass.initComponent.apply(this, arguments);
    },    
    
    setMPA: function(feature_id) {
        this.feature_id = feature_id;
    },    
    
    runAnalysis: function(values) {
    	values.output = 'html';
    	var url = gwst.urls.mpaImpactAnalysis+this.feature_id+'?'+Ext.urlEncode(values);
        gwst.ui.modal.show({
            width: 750, 
            url: url, 
            waitMsg: 'while the analysis runs<br/>(up to 15 sec.)', 
            afterRender: function(){}
        });    	
//	    $.ajax({
//	        url: url, 
//	        type: 'GET',
//	        dataType: 'html',
//	        data: values,  
//	        success: function(result){
//	            //Load the result into a report window
//	            gwst.app.FisheryImpactAnalysisSelector.hide();
//	            if (!gwst.app.FisheryImpactReportWindow) {
//	               //gwst.app.FisheryImpactReportWindow = new gwst.widgets.FisheryImpactReportWindow();
//                }
//                //gwst.app.FisheryImpactReportWindow.loadReport(result);                                
//	        },
//	        error: function(XMLHttpRequest, textStatus, errorThrown){
//	            if(XMLHttpRequest.status == 400){
//	                gwst.ui.error.show({
//	                    errorText: 'You must use a GET request.'
//	                });
//	            }else if(XMLHttpRequest.status == 401){
//	                gwst.ui.error.show({
//	                    errorText: 'You must be logged in to perform this operation.'
//	                });                        
//	            }else if(XMLHttpRequest.status == 403){
//	                gwst.ui.error.show({
//	                    errorText: 'You do not have permission to analyze this mpa'
//	                });
//	            }else if(XMLHttpRequest.status == 404){
//	                gwst.ui.error.show({
//	                    errorText: 'That mpa does not exist'
//	                });
//	            }else{
//	                gwst.ui.error.show({
//	                    errorText: 'An unknown server error occured. Please try again later.'
//	                });
//	            }
//	        }
//	    });    	
    }
});

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
// reference local blank image
Ext.BLANK_IMAGE_URL = '/site-media/js/extjs/resources/images/default/s.gif';

// create namespace
Ext.namespace('gwst');

gwst.backWarn = function () {
   return "Your gwst session will end if you continue.";
};

// create application
gwst.app = function() {
    // do NOT access DOM from here; elements don't exist yet
    // private variables
    /*********** Event handlers **************/
    function onViewportResize(target, adjWidth, adjHeight, width, height) {
        /** Update Legend Size **/
        var reportsHeight = 350;
        var tbar = Ext.getCmp('map').getTopToolbar();
        // alert(jQuery.browser.msie);
        // if(jQuery.browser.msie){
        //     reportsHeight = 370;
        // }
        var nheight = adjHeight - reportsHeight - tbar.getSize().height;
        // Ext.getCmp('legend').setHeightConstrained(nheight);
        /** Update Reports Size **/
        // var reportsVisor = Ext.getCmp('reportsvisor');
        // if (reportsVisor) {
        //     reportsVisor.setWidth(adjWidth);
        //     reportsVisor.setExpandedY(adjHeight - reportsVisor.height);
        // }
        var edit = Ext.getCmp('editmodetoolbar');
        if (edit) {
            edit.setWidth(gwst.app.viewport.getSize().width);
        }
        // if(Ext.getCmp('viewport')){
        //     
        // }
        // reportsVisor.initSwf();
    }

    // private functions

    // public space
    return {
        // public properties, e.g. strings to translate

        // public methods
        initUser: function(){
            jQuery.ajax({
                url: gwst.urls.user,
                dataType: 'json',
                success: function(data){
			        gwst.app.userManager.setUser(
			            new gwst.data.mlpaFeatures.User(data['user'])
			        );
			        gwst.app.reportsVisor.activate();                  
                },
                error: function(){
                    gwst.app.userManager.setUser(null);
                    gwst.app.reportsVisor.activate();
                }
            })
        },
        
        init: function(){
            
            this.userManager = new gwst.ui.UserManager();
            
            $('#jLoading').ajaxStart(function(){
                $(this).show();
            });
            $('#jLoading').ajaxStop(function(){
                $(this).hide();
            });
            
            /*********** First Browser Checks *******************************/
            //Kill application if these browsers are found
            if (jQuery.browser.msie && jQuery.browser.version.substr(0,1) == '8') {
                alert('You will need to enable "Compatibility View" to use gwst with Microsoft Internet Explorer 8. Press the broken-page button next to the url field to enable Compatibility View. We are hoping to fix this problem shortly.');
                // Ext.MessageBox.alert("Browser Check","Sorry gwst does not function correctly in Internet Explorer 6.  Supported browsers include Mozilla Firefox 2+, Apple Safari 3+, Opera 9.6+ and Internet Explorer 7+");
                // this.hide_load();
                return;
            }
            
            if (jQuery.browser.msie && jQuery.browser.version.substr(0,1) == '6') {
                Ext.MessageBox.alert("Browser Check","Sorry gwst does not function correctly in Internet Explorer 6.  Supported browsers include Mozilla Firefox 2+, Apple Safari 3+, Opera 9.6+ and Internet Explorer 7+");
                this.hide_load();
                return;
            }
            //Need google chrome check
            
            window.onbeforeunload = gwst.backWarn;
            
            /*********** Global Variables *******************************/
            
            this.selectionManager = new gwst.ui.SelectionManager();

            $(this.selectionManager).bind('selectionChange', function(e, m, f){
                if(e.caller && e.caller.id == "selection-breadcrumbs" && f['model'] == 'array'){
                    gwst.app.map.zoomToFeature(f);
                }
            });
            
            // $(this.selectionManager).bind('selectionChange', function(e, m, f, o){
            //     alert('selectionChange');
            // });

            /*********** Map and Viewport Setup *****************/

            var options = {
                projection: gwst.config.projection,
                displayProjection: gwst.config.displayProjection,
                units: "m",
                numZoomLevels: 18,
                maxResolution: 156543.0339,
                studyRegion: new gwst.data.StudyRegion({
                    name: "California South Coast",
                    bounds: "-13477376.825366,3752140.84394,-12930699.199147,4134937.481539"
                }),
                maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34),
                //             restrictedExtent: new OpenLayers.Bounds(-13877376.825366, 3552140.84394,-12430699.199147, 4334937.481539),
                controls: []
                // theme: null
            };
            
            this.clientStore = new gwst.ui.ClientStore();
            
            $(this.clientStore).bind('removed', function(e, items){
                gwst.app.selectionManager.clearSelection();
                if(items['mpa'] && items['mpa'].length){
                    for(var i=0; i<items['mpa'].length; i++){
                        // AVOID MEMORY LEAKS, DESTROY UNUSED FEATURES!!                    
                        var old_mpa = items['mpa'][i];
                        if(old_mpa.feature){
                            old_mpa.feature.destroy();
                        }
                    }
                }
            });
                        
            $(this.clientStore).bind('updated', function(e, items){
                var mpas_updated = (items['mpa'] && items['mpa'].length);
                var arrays_updated = (items['array'] && items['array'].length);
                if(mpas_updated || arrays_updated){
                    gwst.app.selectionManager.clearSelection();
                    if(mpas_updated){
                        for(var i=0; i<items['mpa'].length; i++){
                            var old_mpa = items['mpa'][i][1];
                            // AVOID MEMORY LEAKS, DESTROY UNUSED FEATURES!!
                            if(old_mpa.feature){
                                old_mpa.feature.destroy();
                            }
                        }
                    }
                }
            });
            
            gwst.app.FeaturesMenu = new gwst.widgets.FeaturesMenu({
                selectionManager: this.selectionManager,
                store: this.clientStore,
                extWindow: true,
                userManager: this.userManager
            });
            
            $(gwst.app.FeaturesMenu).bind('mpaToggle', function(event, mpas, state){
                state ? gwst.app.map.addMPAs(mpas) : gwst.app.map.removeMPAs(mpas)
            });
            
            $(gwst.app.FeaturesMenu).bind('featureDoubleClick', function(e, feature){
               gwst.app.map.zoomToFeature(feature); 
            });
            
            $(this.userManager).bind('change', function(e, user, oldUser){
                gwst.app.selectionManager.clearSelection();
                gwst.app.clientStore.clear();
                gwst.app.FeaturesMenu.clear();
                gwst.app.FeaturesMenu.showSpinner();
                var url;
                if(user){
                    url = '/gwst/features/';
                    gwst.app.FeaturesMenu.showTools();
                }else{
                url = '/gwst/public_features/';
                    gwst.app.FeaturesMenu.hideTools();
                }
                jQuery.ajax({
                    type: 'GET',
                    url: url,
                    success: function(data){
                        gwst.app.FeaturesMenu.hideSpinner();
                        var json = eval('('+data+')');
                        var features = gwst.app.FeaturesMenu.init(json);
                        delete json['features'];
                        delete json['me'];
                        delete json['mpa'];
                        delete json['array'];
                        var hash = gwst.ui.data.from_json(json, gwst.data.mlpaFeatures.lookup);
                        hash['mpa'] = features['mpa'];
                        hash['array'] = features['array'];
                        gwst.app.clientStore.load(hash);
                        if(!gwst.app.userManager.user){
                            gwst.app.FeaturesMenu.tree.append('<br /><div style="color:#6C7C90;"><h3>Public Account</h3><p>Please login to view your saved shapes or create new ones.</p></div>');
                        }
                    },
                    error: function(){
                        gwst.ui.error.show({errorText: 'There was a problem fetching the feature listing.'});
                    }
                });
            });
            
            this.mapToolbar = new gwst.widgets.MapToolbar({
                user: this.user,
                id: 'maptoolbar',
                featuresMenu: gwst.app.FeaturesMenu,
                userManager: this.userManager,
                onAddMapLayer: function(layer) {
                    gwst.app.map.addDataLayer(layer);
                },
                onRemoveMapLayer: function(layer) {
                    gwst.app.map.removeDataLayer(layer);                 
                },
                selectionManager: this.selectionManager
            });
            
            
            this.map = new gwst.widgets.Map({
                id: 'map',
                region: 'center',
                map: new OpenLayers.Map(document.getElementById('map'), options),
                studyRegion: options.studyRegion, //this.user.get('studyRegion'),
                selectionManager: gwst.app.selectionManager,
                listeners: {
                    'resize': onViewportResize
                },
                tbar: this.mapToolbar,
                userManager: this.userManager,
                store: this.clientStore
            });

            this.viewport = new Ext.Viewport({
                id: 'viewport',
                layout: 'border',
                minWidth: 1024,
                items: [
                    this.map,
                    {
                        region:'south',
                        height: 40
                    }
                ]
            });
            // 
            // this.layer = new Ext.Layer({
            //     id: 'testlayer',
            //     shadow: true,
            //     width: 1000,
            //     height: 10,
            //     html: 'blah',
            //     x: 0,
            //     y: 100,
            //     region: 'center',
            //     layout: 'absolute',
            //     shim: true,
            //     constrain: true
            // });
            // this.layer.update('<div><img src="" width="2000" height="5" /></div>');
            // this.layer.center();
            // this.layer.setLocation(0, gwst.app.mapToolbar.getEl().getSize().height - 5);
            // this.layer.setZIndex(100);
            // this.layer.show();
            // 
            // Ext.getCmp('map').el.on(
            //     'click',
            //     function(target){
            //         Ext.getCmp('maptoolbar').collapseMenus();
            //     }
            // );

            /*********** MapToolWindow setup ***********************/            
            
            this.mapToolWindow = new gwst.widgets.MapToolWindow();
            this.mapToolWindow.show();
            
            /*********** ReportsVisor setup ***********************/

            this.reportsVisor = new gwst.widgets.ReportsViewer(this.selectionManager, this.userManager, this.clientStore);
            //need to show then hide to have this render properly
            // this.reportsVisor.show();
            // this.reportsVisor.hide();

            this.statusPanel = new Ext.Window({
                // title: 'About Geometry Changes',
                html: '',
                width: 400,
                autoHeight: true,
                resizable: false,
                collapsible: true,
                draggable: false,
                closable: false,
                x: 2,
                y: 35
            });
            this.statusPanel.show();
            this.statusPanel.hide();

            /* Setup reportsVisor dimensions and position */
            var size = this.viewport.getSize();
            // this.reportsVisor.setWidth(size.width);
            // this.reportsVisor.setExpandedY(size.height - this.reportsVisor.height);
            // this.statusPanel.setPosition(size.width/2 - this.statusPanel.width/2, 30);

            // Enable tooltips. Tooltip text is set within gwst.actions
            Ext.QuickTips.init();
            this.initUser();
                        
            gwst.actions.help.execute();
            
            /********* Fishery Impact Analysis Setup **********/
            
            gwst.actions.setupEconomicAnalysis();                      

            /*********** Second Browser Checks *******************************/
            //Just warn the user if they have these browsers, still allow the tool to load
            //if (Ext.isOpera) {
            //    Ext.MessageBox.alert("Browser Check","You may experience problems using the Opera web browser.  Supported browsers include Mozilla Firefox 2+, Apple Safari 3+ and Internet Explorer 7+");                
            //} 
            
            this.hide_load();
            
            // Hotkeys
            var app = this;
            $(document).keypress(function(e){
                if(e.which == 181 || e.which==109 && e.altKey == true){ // alt+m
                    var ids = prompt("Type in an MPA ID, or multiple ID's seperated by a comma.");
                    ids = ids.split(',');
                    for(var i=0; i< ids.length; i++){
                        if(ids[i]){
                            var id = ids[i].replace(' ', '');
                            var feature = app.clientStore.get('mpa', id);
                            if(feature){
                                app.FeaturesMenu.toggleFeature(feature);                            
                            }                            
                        }
                    }
                    if(ids.length == 1){
                        var id = ids[0].replace(' ', '');
                        var feature = app.clientStore.get('mpa', ids[0]);
                        if(feature){
                            app.selectionManager.setSelectedFeature(feature);
                        }
                    }
                }
            });
        },
        
        hide_load: function(){
            //turn off loading mask
            Ext.get('loading-mask').fadeOut({remove: true});
            Ext.get('loading').fadeOut({remove: true});            
        }
    };
}(); // end of app

Ext.namespace('gwst', 'gwst.urls');

gwst.copy = {
    
    /** MPA Creation and Attribute Editing Form **/
    // General Tab
    designationForm: 'You must choose a protection category for this marine reserve. To learn about the different choices, see the <a href="http://www.dfg.ca.gov/mlpa/defs.asp#system" target="_blank">full description</a>',
    
    // Goals Tab
    
    // Regulations Tab
    
    // Guidance Tab
    
    dfgFeasabilityGuidanceLabel: 'DFG Feasability Guidance',
    
    emptyDfgFeasabilityGuidanceText: 'The Department of Fish and Game will fill in this information later in the process to inform you whether this MPA meets feasability guidelines.',
                                    
    lopLabel: 'Level of Protection',
    
    lopDescription: 'Level of Protection will be assigned by the Science Advisory Team later in the process.',
    
    satExplanationLabel: 'SAT Guidance',
    
    emptySatExplanationText: 'The Science Advisory Team will fill in this area to explain their rational for the assigned Level of Protection',
    
    // Comments Tab
    
    // END MPA Creation and Attribute Editing Form
    
    // Geometry Confirmation Dialog Box Text
    geometryConfirmTitle: 'Confirm your geometry',
    geometryConfirmText: 'The server has validated and clipped your geometry according to [these rules]. Do you want to continue with this geometry?'
};

gwst.copy.confirmStudyRegionClippingTitle = 'Please confirm modifications to your geometry';
gwst.copy.confirmStudyRegionClipping = '<h3>Geometry Clipping</h3><img src="/site-media/figures/clipping.gif" width="369" height="88" /><p>Your geometry has been clipped to match the study region boundaries. Portions not overlapping the study region, or overlapping land, have been removed.</p><br /><p>This operation occurs each time you create a geometry. We also keep a copy of the lines you draw, so you will always have the un-clipped version for editing.</p><p style="color:red;">[Known Bug] In some browsers you may not see a geometry at this stage. This is a known bug and we are working on a fix. Press continue, and your geometry will be saved and then rendered. Don\'t worry, you will be able to see your new geometry in a moment and it is easy to go back and change it by clicking "edit geometry" in the MPA popup.</p>';

gwst.copy.overlapsEstuaryTitle = 'Please confirm modifications to your geometry';
gwst.copy.overlapsEstuaryText = '<h3>Your Geometry Overlaped an Estuary</h3><img src="/site-media/figures/estuary.gif" width="368" height="88" /><p>An MPA geometry can either be entirely estuary, or none. In cases like this where a geometry overlaps but is not entirely estuarine, the system creates two polygons. Whichever is larger is the one it assumes you would like to create.</p><br />';
gwst.copy.overlapsEstuary = [];
gwst.copy.overlapsEstuaryEndText = "<p>If this is not the outcome you wanted, try to refine your selection to better fit the habitat you are trying to capture. Turning on the Estuary layer from the Data Layers menu can help you in this process.</p>";

// status code 1 : Overlaps an estuary, and the system chose the non-estuary part
gwst.copy.overlapsEstuary[1] = gwst.copy.overlapsEstuaryText + '<p>In this case, the system chose the <b>Non-Estuary Part</b></p><br />' + gwst.copy.overlapsEstuaryEndText;
// status code 5 : Overlaps an estuary, and the system chose the estuary part
gwst.copy.overlapsEstuary[5] = gwst.copy.overlapsEstuaryText + '<p>In this case, the system chose the <b>Estuary Part</b></p><br />' + gwst.copy.overlapsEstuaryEndText;

gwst.copy.errors = {
    mpaValidationService: 'There was an error trying to validate this geometry.'
};


gwst.copy.clippedGeometryStatus = [];

gwst.copy.clippedGeometryStatus[0] = 'Successful geometry creation';
gwst.copy.clippedGeometryStatus[1] = 'System has chosen an MPA';
gwst.copy.clippedGeometryStatus[2] = '<h3>Outside the Study Region</h3><img src="/site-media/figures/outsidestudyregion.gif" width="115" height="84" /><p>The geometry you defined was outside the study region. The study region for Southern California is limited to 3 miles offshore. If you are having trouble, you can turn on the study region layer in the Data Layers menu.</p>';
gwst.copy.clippedGeometryStatus[3] = '<h3>Invalid Geometry</h3><img src="/site-media/figures/invalidgeo.gif" width="121" height="87" /><p>Please try to avoid drawing irregular shapes that intersect themselves like bowties.<br /> To delete a vertex from a geometry, click on it and press "d" on your keyboard.</p>';
gwst.copy.clippedGeometryStatus[4] = 'System Error';
gwst.copy.clippedGeometryErrorText = 'You have the option of either cancelling this operation or going back to your geometry to fix this error.';



gwst.copy.createNewGeometry = 'Draw an MPA geometry by clicking on the map.<br /> When you are ready to create the last point in your geometry, double click.';
gwst.copy.editGeometry = 'Edit this geometry by dragging the handles on its vertices.  To delete a vertex, press the D-key <img class="dkey" src="/site-media/images/D.png" />. <br />When you are done, click the finished button.';

// create namespace
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ReportsViewer = function(selectionManager, userManager, clientStore){
    var sm = selectionManager;
    var div = $('#ReportsViewer');
    var store = clientStore;
    var header = $(div).find('.header');
    var instance = this;
    var userManager = userManager;
    
    $(userManager).bind('change', function(e, user, oldUser){
        instance.update();
        // if(flashInitialized){
        //     FABridge.flash.root().toggleEconButton(!!(user && user.permission_ecotrust_data));
        // }
    });
    
    function storeEventHandler(e, items){
        if((items['mpa'] && items['mpa'].length) || (items['array'] && items['array'].length)){
            refreshSwfLists();
        }
    }
    
    $(store).bind('added', storeEventHandler);
    $(store).bind('updated', storeEventHandler);
    
    var contentHeight = $('#reports_content').height;
    
    // Tracks if an animation is playing
    var animationPlaying = false;
    
    // Private callback for when an animation is done playing
    function animationCallback(){
        animationPlaying = false;
    };
    
    var requiredFlashVersion = "9.0.124";
    var flashInitialized = false;
    
    // Whether the use has flash and the required version
    function flashCapable(){
        return swfobject.hasFlashPlayerVersion(requiredFlashVersion);
    };
    
    function initFlash(){
        FABridge.addInitializationCallback("flash", onFlashInitialization);
        swfobject.embedSWF("media/flash/gwstClient.swf", "reports_content", "100%", "320", requiredFlashVersion, false, false, { wmode: "opaque", play: "true"});
        $(div).css('bottom', -319);
        flashInitialized = true;
    };
    
    function onFlashInitialization(){
        // FABridge.flash.root().toggleEconButton(!!(userManager.user && userManager.user.permission_ecotrust_data));
        FABridge.flash.root().getEconButton().addEventListener('click', function(){
            gwst.actions.openEconomicAnalysis(sm.selectedFeature);
        });
    };
    
    function setSwfSelection(feature){
        if(feature && feature.model == 'mpa'){
            if(typeof FABridge.flash != 'undefined' && typeof FABridge.flash.root != 'undefined'){
                FABridge.flash.root().setSelectedFeature('MPA', feature.pk);
            }
        }else{
            clearSwfSelection();
        }
    };
    
    function clearSwfSelection(){
        if(typeof FABridge.flash != 'undefined' && typeof FABridge.flash.root != 'undefined'){
            FABridge.flash.root().setSelectedFeature('MPA', null);
        }
    };
    
    function refreshSwfLists(){
        if(typeof FABridge.flash != 'undefined' && typeof FABridge.flash.root != 'undefined'){
            FABridge.flash.root().refresh();
        }
    };
    
    // Should be called whenever the list of MPAs(and in the future clusters, Arrays)
    // has been modified and should be reloaded.
    this.update = function(){
        if(flashInitialized){
            refreshSwfLists();
        }
    };
    
    // Whether or not the Report is fully extended
    this.isDisplayed = function(){
        return $(div).css('bottom') == '0px';
    };
    
    this.isActive = function(){
        return !$(div).hasClass('inactive');
    };
    
    // Extend the viewer by setting to true, hide by setting false
    this.setDisplayState = function(state){
        if(animationPlaying){return;}
        if(this.isDisplayed == state){return;}
        animationPlaying = true;
        setSwfSelection(sm.selectedFeature);
        // if(FABridge && FABridge.flash && FABridge.flash.root() && flashInitialized){
        //     FABridge.flash.root().toggleEconButton(!!(userManager.user && userManager.user.permission_ecotrust_data));
        // }
        if(state){
            //show
            if(!this.isActive()){animationPlaying = false;return;}
            $(div).animate({bottom: 0}, 300, 'swing', animationCallback);
        }else{
            //hide
            $(div).animate({bottom: -320}, 300, 'swing', animationCallback);
        }
    };
    
    this.activate = function(){
        $('#selection-breadcrumbs').selectioncrumbs('enable');
        $(div).removeClass('inactive');
        $(header).css('cursor', 'pointer');
        if(flashCapable() && !flashInitialized){
            initFlash();
        }
        if(flashInitialized && sm.selectedFeature != null){
            setSwfSelection(sm.selectedFeature);
        }
    };
    
    this.deactivate = function(){
        $('#selection-breadcrumbs').selectioncrumbs('disable');
        $(div).addClass('inactive');
        $(header).css('cursor', 'default');
        instance.setDisplayState(false);
    };
    
    this.toggle = function(){
        instance.setDisplayState(!instance.isDisplayed());
    };
        
    $(header).click(function(){
        instance.toggle();
    });
    
    $(header).mouseover(function(){
        if(instance.isActive()){
            $(div).css('border-top', '2px solid white');
        }
    });
    
    $(header).mouseout(function(){
        if(instance.isActive()){
            $(div).css('border-top', 'none');
        }
    });    
    
    $(sm).bind('selectionChange', function(e, manager, selectedFeature, old){
        if(instance.isDisplayed()){
            if(selectedFeature == null){
                if(flashInitialized){
                    clearSwfSelection();
                }
            }else{
                if(selectedFeature.model == 'mpa'){
                    if(flashInitialized){
                        setSwfSelection(selectedFeature);                    
                    }
                }else if(selectedFeature.model == 'array'){
                    if(flashInitialized){
                        clearSwfSelection();
                    }
                }else{
                    //could it be a cluster?
                }
            }
        }
    });

    $('#selection-breadcrumbs').selectioncrumbs({
        selectionManager: sm
    });
};

if(typeof Ext != 'undefined'){
    Ext.namespace('gwst', 'gwst.ui');
}else{
    // Alternative setup for testing sans-ext
    if(typeof gwst != 'object'){
        gwst = {};
    }

    if(typeof gwst.ui != 'object'){
        gwst.ui = {};
    }
}

gwst.ui.handlers = {};

gwst.ui.copy = {
    failedToLoadContent: 'We could not load content from this url. The server may be experiencing temporary downtime. Please try again later, and contact an administrator if the error persists.',
    unknownError: 'An unknown error occurred. Please try again and if the problem persists, contact an administrator.',
    errorTitle: 'An Error Occurred',
    fatalErrorTitle: 'A Fatal Error Occurred',
    fatalErrorMsg: 'Due to the nature of this error, the application needs to be restarted. Please press the refresh button on your browser. We have been notified of the problem, but if the error persists please follow up with an administrator.',
    htmlLoadMessage: 'While we load this content.'
};

gwst.ui.showMask = function(){
    $('#gwst-mask').css('display', 'block');
};

gwst.ui.hideMask = function(){
    $('#gwst-mask').css('display', 'none');
};

gwst.ui.accessObjectProperty = function(object, propstring){
    var trail = propstring.split('.');
    for(var i = 0; i < trail.length; i++){
        object = object[trail[i]];
    }
    return object;
}

gwst.ui.modalManager = {
    currentModal: null,
    nextModal: null,
    display: function(modal){
        if(modal.isAsync(modal.options)){
            modal.startAsync(modal.options);            
            $(modal).bind('asyncDone', {mngr: this}, this.asyncDone);
            gwst.ui.wait.show({msg: modal.options['waitMsg']});
            this.nextModal = modal;
        }else{
            if(this.currentModal){
                this.nextModal = modal;
                if(this.currentModal.open){
                    // is either opening or open
                    if(this.currentModal.animating){
                        // is opening, close immediately
                        this.currentModal.hide(true, true);
                    }else{
                        // has been full opened. Play closing animation
                        this.currentModal.hide(true, false);
                    }
                }else{
                    // already closing, just wait for "hidden" event
                }
            }else{
                this.currentModal = modal;
                modal.display();
            }
            $(this.currentModal).bind('hidden', {mngr: this}, this.afterHide);
        }
    },
    
    afterHide: function(event){
        var m = event.data['mngr'];
        if(m.nextModal){
            m.currentModal = m.nextModal;
            $(m.currentModal).bind('hidden', event.handler);
            m.currentModal.display();
        }else{
            m.currentModal = null;
        }
        m.nextModal = null;
    },
    
    asyncDone: function(e, success){
        if(success){
            // if opening, close wait modal immediately. If the wait modal
            // has had enough time to open fully, animate its closing.
            e.data['mngr'].currentModal.hide(true, gwst.ui.wait.animating);
        }else{
            e.data['mngr'].nextModal = null;
        }
    }
}

gwst.ui.Modal = function(){
    this.options = {}
    this.animating = false;
    this.open = false;
    // var instance = this;
    
    this.show = function(opts){
        this.parseOpts(opts);
        gwst.ui.modalManager.display(this);
    };
        
    this.display = function(opts){
        var opts = this.options;
        gwst.ui.showMask();
        showElements(this.elements);
        this.render(this.options);
        this.open = true;
        this.animating = true;
        // Make reference to avoid scoping issue
        var i = this;
        // Using animate rather than show as show animates margins in 1.3.1,
        // Our centering since it is based on margin-left/right:auto;
        
        if(/chrome/.test(navigator.userAgent.toLowerCase())){
            $(this.animatedElement).show();
            i.animating = false;
            i.afterRender(i.options);
            if(i.options['afterRender']){
                i.options['afterRender'](i.options);
            }
            $(i).trigger('shown');
        }else{
            $(this.animatedElement).animate({
                    // order here is important. Height MUST come first or it will
                    // end up taller than it should and have to "pop back" after
                    // animating
                    height: 'show',
                    width: 'show',
                    opacity: 'show'
                },
                'fast',
                function(){
                    i.animating = false;
                    i.afterRender(i.options);
                    if(i.options['afterRender']){
                        i.options['afterRender'](i.options);
                    }
                    $(i).trigger('shown');
                }
            );        
        }        
    };
    
    this.hide = function(keepMask, immediately){
        $(this.animatedElement).stop(true, true);
        var cleanup = this.cleanup;
        var opts = this.options;
        var i = this;
        this.animating = true;
        this.open = false;
        this.beforeHide(this.options);
        if(immediately || /chrome/.test(navigator.userAgent.toLowerCase())){
            $(this.animatedElement).hide();
            this.animating = false;
            hideElements(this.elements);
            if(!keepMask){
                gwst.ui.hideMask();
            }
            this.cleanup(this.options);
            $(this).trigger('hidden');
        }else{
            $(this.animatedElement).animate({
                    height: 'hide',
                    width: 'hide',
                    opacity: 'hide'
                },
                'fast', 
                function(){
                    i.animating = false;
                    hideElements(i.elements);
                    if(!keepMask){
                        gwst.ui.hideMask();
                    }
                    i.cleanup(i.options);
                    $(i).trigger('hidden');
                }
            );        
        }
    };
    
    // called before animatedElement is shown
    this.render = function(opts){
        // override
    };
    
    // called after animatedElement is shown
    this.afterRender = function(opts){
        // override
    };
    
    this.beforeHide = function(opts){
        //override
    };
    
    // Called after modal is hidden
    this.cleanup = function(opts){
        // override
    };
    
    this.parseOpts = function(opts){
        if(typeof opts != 'object'){
            opts = {}
        }
        $.extend(this.options, this.defaults, opts);
        return this.options;
    };
    
    this.isAsync = function(opts){
        return false;
    };
    
    function showElements(elements){
        for(var i = 0; i<elements.length; i++){
            $(elements[i]).show();
        }
    };
    
    function hideElements(elements){
        for(var i = 0; i<elements.length; i++){
            $(elements[i]).hide();
        }
    };
    
    function showContent(el, callback){
        $(el).show('fast', callback);
    };
    
    function hideContent(el, callback){
        $(el).hide('fast', callback);
    };
    
    return true;
}

gwst.ui.Wait = function(){
    this.elements = ['#gwst-small-modals'];
    this.animatedElement = '#gwst-wait';
    this.defaults = {
        // default message is an empty string. Set to something more useful
        msg: ''
    };
    this.render = function(opts){
        $('#gwst-wait').find('p').html(opts['msg']);       
    },
    this.cleanup = function(opts){
        $('#gwst-wait').find('p').html('');
    }
};

gwst.ui.Wait.prototype = new gwst.ui.Modal();
gwst.ui.wait = new gwst.ui.Wait();

gwst.ui.Error = function(){
    this.elements = ['#gwst-small-modals'];
    this.animatedElement = '#gwst-error';
    this.defaults = {
        // Error message to display to the user
        errorText: gwst.ui.copy.unknownError,
        // Additional debugging information that is only shown to users who 
        // request it
        debugText: false,
        // A message to log to the server for recording client errors
        // See gwst.ui.logToServer
        logText: false,
        // If fatal, an error message cannot be closed and a message is logged
        // to the server
        fatal: false
    };
    
    this.render = function(opts){
        var error = $('#gwst-error');
        var button = $('#gwst-error').find('button');
        var heading = gwst.ui.copy.errorTitle;
        if(opts['fatal']){
            heading = gwst.ui.copy.fatalErrorTitle;
            // Change the message when fatal if it has been unchanged from
            // the default for normal errors
            if(opts['errorText'] == gwst.ui.copy.unknownError){
                opts['errorText'] = gwst.ui.copy.fatalErrorMsg;
            }
            button.hide();
        }else{
            button.show();
        }
        error.find('h3').html(heading);
        error.find('p').html(opts['errorText']);
        
        if(opts['logText'] || opts['fatal']){
            gwst.ui.logToServer(opts['logText']);
        }
    },
    
    this.afterRender = function(opts){
        // Only allow users to close the error if not fatal
        if(!opts['fatal']){
            var button = $('#gwst-error').find('button');
            button.focus();
            button.click(function(){gwst.ui.error.hide()});
        }
    },
    
    this.cleanup = function(opts){
        $('#gwst-error').find('p').html('');
    }
}

gwst.ui.Error.prototype = new gwst.ui.Modal();
gwst.ui.error = new gwst.ui.Error();


gwst.ui.ModalWindow = function(){
    this.elements = ['#gwst-large-modals'];
    this.animatedElement = '#gwst-htmlmodal';
    
    this.defaults = {
        // Width of the window, height cannot be specified
        width: 500,
        // Shows a close icon
        closable: true,
        // is excecuted after the window is fully loaded
        afterRender: false,
        // Set the html attribute for a syncronous window
        html: false,
        // fetches content from the url. Only set html or url, not both
        // url can be set using the jquery load() method syntax, meaning
        // you can specify only a certain element of the resulting page to
        // be rendered.
        // see http://docs.jquery.com/Ajax/load#urldatacallback
        url: false,
        // If setting a url, you also have all of the following options
        // Displays using a gwst.ui.wait dialog
        waitMsg: gwst.ui.copy.htmlLoadMessage,
        // Callback to excecute if fetching of the content from *url fails
        // This overrides normal error handling, which displays via 
        // gwst.ui.error
        errorCallback: false,
        // number of times to retry the request if there are any server-side
        // errors
        retries: 4,
        // see gwst.ui.logToServer
        logText: 'Problem loading url',
        // see gwst.ui.error
        fatal: false,
        // see gwst.ui.error
        errorText: gwst.ui.copy.failedToLoadContent
    };
    
    this.isAsync = function(opts){
        if(opts['html']){
            return false;
        }else{
            return true;
        }
    };
    
    this.startAsync = function(opts){
        // oh lord! It's pretty easy to see from the test that msie is
        // cacheing pages where it shouldn't
        if($.browser.msie){
            $.ajaxSetup({
                cache: false
            });            
        }
        var i = this;
        $('#gwst-htmlmodal').load(opts['url'], null, function(response, status, request){
            i.asyncHandler(response, status, request);
        });
    };
    
    this.asyncHandler = function(response, status, request){
        modal = $('#gwst-htmlmodal');
        if(status == 'error'){
            if(this.options['retries'] > 0){
                this.options['retries'] = this.options['retries'] - 1;
                var i = this;
                modal.load(this.options['url'], false, function(response, status, request){
                    i.asyncHandler(response, status, request);
                });
            }else{
                $(this).trigger('asyncDone', false);
                // gwst.ui.wait.hide(false);
                if(this.options['errorCallback']){
                    gwst.ui.wait.hide(false);
                    this.options['errorCallback'](response, status, request);
                }else{
                    this.options['logText'] = this.options['logText'] + ': ' + this.options['url'];
                    gwst.ui.error.show(this.options);
                }
            }
        }else{
            $(this).trigger('asyncDone', true);
        }
    };
    
    this.render = function(opts){
        var modal = $('#gwst-htmlmodal');
        modal.width(opts['width']);
        var buttons = $('#gwst-htmlmodalbuttons');
        if(opts['closable']){
            buttons.width(opts['width']);
            // $('#gwst-mask').bind('click', gwst.ui.hideHTMLModal);
            // register this, otherwise clicking on the modal, which is contained
            // by the mask, will trigger hideHTMLModal
            // $('#gwst-htmlmodal').bind('click', function(){return false;});
            $(document).bind('keydown', this.keydownHandler);
            $('#gwst-htmlmodal-close')[0].onclick = function(){
                gwst.ui.modal.hide();
                return false;
            };
        }else{
            // Do nothing, they should be hidden by the beforeHide method
        }
        if(opts['html']){
            modal.html(opts['html']);
        }else{
            // will be handled by this.beforeAsyncShow
        }
    };
    
    this.afterRender = function(opts){
        if(opts['closable']){
            $('#gwst-htmlmodalbuttons').show();
            $('#gwst-htmlmodal-close').show();
        }
    };
    
    this.beforeHide = function(opts){
        $('#gwst-htmlmodalbuttons').hide();
        $('#gwst-htmlmodal-close').hide();
    };
    
    this.cleanup = function(opts){
        // $('#gwst-mask').unbind('click', gwst.ui.hideHTMLModal);
        $(document).unbind('keydown', this.keydownHandler);
        var modal = $('#gwst-htmlmodal');
        modal.html('');
    };
    
    this.keydownHandler = function(event){
        // 88 = x
        // 27 = Esc
        if(event.keyCode == 88 || event.keyCode == 27){
             $('#gwst-htmlmodal-close').click();
            return false;
        }else{
        
        }
    };
}

gwst.ui.ModalWindow.prototype = new gwst.ui.Modal();
gwst.ui.modal = new gwst.ui.ModalWindow();

gwst.ui.logToServer = function(msg, success, error){
    $.ajax({
        type: 'POST',
        url: '/gwst/client-logger',
        data: {msg: msg},
        success: success,
        error: error
    });
};

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
  
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

gwst.ui.ContextMenu = {}
gwst.ui.ContextMenu.show = function(opts, data, target){
    gwst.ui.ContextMenu.clear();
    if(target){
        $(target).addClass('contextified');
    }
    if(!(opts['x'] && opts['y'] && opts['actions'])){
        throw('gwst.ui.ContextMenu.show(opts): you must specify "x", "y", and "actions".');
    }
    if(!opts['icon']){
        opts['icon'] = '';
    }
    var div = $('<div />');
    div.addClass('gwst-contextmenu');
    div.attr('style', 'left:'+opts['x']+'px;top:'+opts['y']+'px;');
    var ul = $('<ul />');
    div.append(ul);
    for(var i=0; i<opts['actions'].length; i++){
        var li = $('<li class="'+opts['actions'][i]['iconcls']+'"><span>'+opts['actions'][i]['name']+'</span></li>');
        li.bind('click', data, opts['actions'][i]['handler']);
        ul.append(li);
    }
    $('body').append(div);
    var width = div.width();
    div.width(width + 15);
    var height = div.height();
    if(jQuery.browser.msie){
        div.addClass('ie');
    }
    div.height(height);
    $('body').bind('click', gwst.ui.ContextMenu.clear);
};

gwst.ui.ContextMenu.clear = function(){
    $('.contextified').removeClass('contextified');
    $('body').unbind('click', gwst.ui.ContextMenu.clear);
    $('.gwst-contextmenu').remove();
};

// needs unit tests
gwst.ui.SelectionManager = function(){
    this.selectedFeature = null;
    
    this.setSelectedFeature = function(feature, caller, force){
        if(force || feature != this.selectedFeature){
            var oldFeature = this.selectedFeature;
            this.selectedFeature = feature;
            var event = jQuery.Event('selectionChange');
            if(caller){
                event.caller = caller;
            }
            $(this).trigger(event, [this, this.selectedFeature, oldFeature]);
        }
    };
    
    this.clearSelection = function(caller){
        var oldFeature = this.selectedFeature;
        this.selectedFeature = null;
        var event = jQuery.Event('selectionChange');
        if(caller){
            event.caller = caller;
        }
        $(this).trigger(event, [this, this.selectedFeature, oldFeature]);
    };
};
(function($){
    var Breadcrumbs = {
        
        _init: function(){
            this.element.addClass('gwst-ui-breadcrumbs');
            this.element.after('<br style="clear:both;" />');
            // where objects assigned to list-items are cached
            this._li = [];
        },

        push: function(object){
            this.element.find('li:last').removeClass('selected');
            var label = gwst.ui.accessObjectProperty(object, this.options.labelProperty);
            var li = $(this.options.liTemplate.replace(/#\{label\}/, label));
            li.css('display', 'none');
            li.css('white-space', 'nowrap');
            li.addClass('selected');
            var self = this;
            li.bind('click', function(event){
                var index = $(event.target).prevAll().length;
                self.element.trigger('itemClick', [object, index], self.options.itemClick);
                event.stopPropagation();
                event.preventDefault();
                return false;
            });
            this.element.append(li);
            li.animate({width: 'show'}, 'fast', 'linear');
            this._li.push(object);
            this.element.trigger('push', [object, this._li.length - 1], this.options.push);
        },
        
        clear: function(dontAnimate){
            // bring all animations to end
            var lis = this.element.find('li');
            lis.stop(true, true);
            this._remove(lis, dontAnimate);
            this.element.trigger('clear', [this._li], this.options.clear);
            this._li = [];
        },
        
        pop: function(dontAnimate){
            this._remove($(this.element.find('li')[this._li.length - 1]), dontAnimate);
            var item = this._li.pop();
            this.element.trigger('pop', [item], this.options.pop);
        },
        
        length: function(){
            return this._li.length;
        },
        
        _remove: function(els, dontAnimate){
            if(dontAnimate){
                els.remove();
            }else{
                els.animate({width: 'hide'}, 'fast', 'linear', function(){
                    $(this).remove();
                });
            }
        },
        
        destroy: function(){
            this.clear(true);
            $.widget.prototype.destroy.apply(this, arguments);
        }
    }

    $.widget('gwst.breadcrumbs', Breadcrumbs);
    
    $.extend($.gwst.breadcrumbs, {
        getter: 'length',
        defaults: {
            labelProperty: 'label',
            liTemplate: '<li>#{label}</li>'
        }
    });
    
    var SelectionCrumbs = $.extend({}, $.gwst.breadcrumbs.prototype);
    
    SelectionCrumbs._init = function(){
        $.gwst.breadcrumbs.prototype._init.apply(this, arguments);
        $(this.options.selectionManager).bind('selectionChange', this, this._onSelectionChange);
        this.options.labelProperty = 'bcLabel';
        var self = this;
        $(this.element).bind('itemClick', function(event, object, index){
            if(index == self.length() - 1){
                gwst.app.reportsVisor.toggle();
            }else{
                if(object.model == 'array'){
                    self.options.selectionManager.setSelectedFeature(object, this);
                }else{
                    // is cluster, not supported
                }
            }
            return false;
        });        
    };
    
    SelectionCrumbs.disable = function(){
        $(this.options.selectionManager).unbind('selectionChange', this, this._onSelectionChange);
    };
    
    SelectionCrumbs.enable = function(){
        $(this.options.selectionManager).unbind('selectionChange', this, this._onSelectionChange);
        $(this.options.selectionManager).bind('selectionChange', this, this._onSelectionChange);
        // this.options.selectionManager.removeListener('change', this._onSelectionChange, this);
        // this.options.selectionManager.addListener('change', this._onSelectionChange, this);
    };
    
    SelectionCrumbs._onSelectionChange = function(event, mngr, selectedFeature, oldFeature){
        var self = event.data;
        if(selectedFeature == null){
            self.clear();
        }else{
            if(selectedFeature.model == 'mpa'){
                selectedFeature.bcLabel = selectedFeature.name;
                if(oldFeature && oldFeature.model == 'mpa'){
                    var oldArray = oldFeature.get_array();
                    var selArray = selectedFeature.get_array();
                    if(oldArray && selArray && oldArray.pk == selArray.pk){
                        self.pop(true);
                        self.push(selectedFeature);
                        return;
                    }else{
                        self.clear();
                    }
                }else{
                    if(oldFeature && oldFeature.model == 'array'){
                        if(selectedFeature.get_array() && oldFeature.pk == selectedFeature.get_array().pk){
                            self.push(selectedFeature);
                            return;
                        }else{
                            self.clear();
                        }
                    }else{
                        // was cluster
                        self.clear();
                    }
                }
                var selArray = selectedFeature.get_array();
                if(selArray){
                    var a = selArray;
                    a.bcLabel = a.name + '<span class="array-mpa-count"> (contains '+ a.get_mpas().length +' MPAs) </span>';
                    self.push(a);
                }
                self.push(selectedFeature);
            }else{
                if(selectedFeature.model == 'array'){
                    self.clear();
                    selectedFeature.bcLabel = selectedFeature.name + '<span class="array-mpa-count"> (contains '+ selectedFeature.get_mpas().length +' MPAs) </span>';
                    // Array must have label accessible using labelProperty
                    self.push(selectedFeature);
                }else{
                    // is cluster
                    // not currently supported so just clear
                    self.clear();
                }
            }
        }
    }
    
    $.widget('gwst.selectioncrumbs', SelectionCrumbs);
    
    $.extend($.gwst.selectioncrumbs, {
        getter: 'length',
        
        defaults: {
            // must be called with a selectionManager specified, ie
            // selectionManager: sm,
            labelProperty: 'label',
            liTemplate: '<li>#{label}</li>'
        }
    });
    
})(jQuery);
if(typeof Ext != 'undefined'){
    Ext.namespace('gwst', 'gwst.ui');
}else{
    // Alternative setup for testing sans-ext
    if(typeof gwst != 'object'){
        gwst = {};
    }

    if(typeof gwst.ui != 'object'){
        gwst.ui = {};
    }
}

gwst.ui.form = {};

gwst.ui.form.show = function(url, success, error, cancel, html){
    options = {
        closable: false,
        afterRender: function(){
            var w = $('#gwst-htmlmodal');
            w.find('input:first').focus();
            w.find('input[value="cancel"]').click(function(){
                gwst.ui.modal.hide();
                if(cancel){
                    cancel();
                }
            });
            w.find('form').submit(function(){
                gwst.ui.modal.hide(true, true);
                gwst.ui.wait.show({});
                $.ajax({
                    url: url,
                    dataType: 'json',
                    data: $(this).serialize(),
                    type: 'POST',
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        if(XMLHttpRequest.status == 400){
                            gwst.ui.modal.hide(true, true);
                            gwst.ui.form.show(url, success, error, cancel, XMLHttpRequest.responseText);
                        }else if(XMLHttpRequest.status == 401){
                            gwst.ui.error.show({
                                errorText: 'You must be logged in to perform this operation.'
                            });                        
                        }else if(XMLHttpRequest.status == 403){
                            gwst.ui.error.show({
                                errorText: 'You cannot modify objects owned by other users.'
                            });
                        }else if(XMLHttpRequest.status == 404){
                            gwst.ui.error.show({
                                errorText: 'The object you are trying to edit does not exist.'
                            });
                        }else{
                            gwst.ui.error.show({
                                errorText: 'An unknown server error occured. Please try again later.'
                            });
                        }
                    },
                    success: function(data, textStatus){
                        success(data);
                    }
                });
                return false;
            });
            
        },
        errorCallback: function(something, textStatus, XMLHttpRequest){
            if(XMLHttpRequest.status == 400){
                gwst.ui.modal.hide(true, true);
                gwst.ui.form.show(url, success, error, cancel, XMLHttpRequest.responseText);
            }else if(XMLHttpRequest.status == 401){
                gwst.ui.error.show({
                    errorText: 'You must be logged in to perform this operation.'
                });                        
            }else if(XMLHttpRequest.status == 403){
                gwst.ui.error.show({
                    errorText: 'You cannot modify objects owned by other users.'
                });
            }else if(XMLHttpRequest.status == 404){
                gwst.ui.error.show({
                    errorText: 'The object you are trying to edit does not exist.'
                });
            }else{
                gwst.ui.error.show({
                    errorText: 'An unknown server error occured. Please try again later.'
                });
            }
        }
    }
    if(html){
        options['html'] = html;
    }else{
        options['url'] = url;
    }
    gwst.ui.modal.show(options);
}

gwst.ui.form.hide = function(){
    gwst.ui.model.hide();
}
﻿Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.URLViewer = Ext.extend(Ext.Panel, {
    // Constructor Defaults, can be overridden by user's config object
    //id: 'urlViewer',
    html: '',
    title: '',
    url: '',
    load: function(url) {
        Ext.Ajax.request({
            url: this.url,
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
            bodyStyle: 'padding:10px'
        });

        gwst.widgets.URLViewer.superclass.initComponent.apply(this, arguments);

        this.load(this.url);
    }

});
mlpa = {mpaForm: {}}

mlpa.mpaForm = {
    selector: '#mpaFormTabs',
    msieDisabledColor: '#cfcfcf',
    
    show: function(opts){
        this.options = opts;
        if(typeof this.options['editUrl'] == "string" && typeof this.options['geometries'] == "array" || (typeof this.options['geometries'] != "array" && typeof['mpa'] != "object")){
            gwst.ui.error.show({errorText:'mpaForm called with invalid arguments. specify either mpa or geometries, and not both.'});
            return;
        }else{
            var geometry = false;
            if(typeof this.options['editUrl'] == 'string'){
                url = this.options['editUrl'];
            }else{
                url = '/gwst/mpa/new';
                geometry = this.options['geometries'][0];
                geometryClipped = this.options['geometries'][1];
            }
            // Fixes a temporary bug in displaying one url-based modal after another
            this.options['width'] = 650,
            gwst.ui.modal.hide(false, true);
            gwst.ui.modal.show({
                width: this.options['width'],
                url: url + ' ' + mlpa.mpaForm.selector,
                closable: false,
                afterRender: function(){
                    if(geometry){
                        $('input[name="geometry"]').attr('value', geometry);
                        $('input[name="geometry_clipped"]').attr('value', geometryClipped);                    
                    }
                    mlpa.mpaForm.init();
                },
                errorCallback: function(){
                    gwst.ui.error.show({
                        errorText: 'Problem loading MPA attributes form. Please try again in a few minutes and contact an administrator if the problem persists.'
                    })
                }
            });
        }
    },

    successHandler: function(mpa){
        // overridden by user options
    },
    
    submitHandler: function(e){
        e.preventDefault();
        form = $('form.mpa-form');
        var i = this;
        $.ajax({
           data: form.serializeArray(),
           dataType: 'json',
           success: function(data, textStatus){
               // gwst.ui.wait.hide(true);
               mlpa.mpaForm.successHandler(
                   gwst.data.mlpaFeatures.mpa_from_geojson(data)
                );
           },
           error: function(request, textStatus, errorThrown){
               i.options['html'] = jQuery("<div/>").append(request.responseText.replace(/<script(.|\s)*?\/script>/g, "")).find(mlpa.mpaForm.selector);
               // i.options['closable'] = false;
               i.options['url'] = false;
               i.options['afterRender'] = function(){
                   i.init(i.options);
               }
               // opts['width'] = 650;
               if(request.status == 400){
                   gwst.ui.modal.show(i.options);
               }else{
                    // gwst.ui.wait.hide();
                    if(typeof i.options['error'] == 'function'){
                        i.options['error'](request);
                    }else{
                        gwst.ui.error.show({errorText:'There was a problem saving this MPA', debugText: request.responseText, logText:'Problem saving MPA Attributes'});
                    }
               }
           },
           type: 'POST',
           url: form.attr('action')
        });
        // mlpa.mpaForm.hide(false);
        gwst.ui.wait.show({msg: 'While we save your MPA'});
        return false;
    },
    
    allowedUsesPropertyMousedown: function(e){
        var designation_id = $('select#id_designation option:selected').attr('value');
        if(this.purposesForDesignation(designation_id).length == 0){
            alert('The current MPA Designation does not allow any types of consumptive use. Please change the designation if you would like to add allowed uses.');
            return false;
            e.preventDefault();
        }
    },
    
    designationChange: function(e){
        var purposes = this.purposesForDesignation($('select#id_designation option:selected').attr('value'));
        if($('select#id_allowed_uses option:selected').length > 0){
            var msg = false;
            if(purposes.length == 0){
                msg = "This designation does not allow any consuptive uses. All of your currently selected allowed uses will be removed.\n Do you still wish to change the MPA Designation?";
            }else if(purposes.length < $('select.purpose option').length - 1){
                msg = "This Designation only allows " + $('select.purpose option[value="'+purposes[0]+'"]').html() + " uses. Any other types of allowed uses you have selected will be removed. \n Do you still wish to change the MPA Designation?";
            }
            var answer = true;
            if(msg){
                answer = confirm(msg);
            }
            if(answer){
                this.currentDesignation = e.target.selectedIndex;
                if(msg){
                    this.removeUsesNotMatchingDesignation();
                }
                this.updatePurposes(purposes);
            }else{
                e.target.selectedIndex = this.currentDesignation;
            }
        }else{
            this.currentDesignation = e.target.selectedIndex;
            this.updatePurposes(purposes);
        }
    },
    
    updatePurposes: function(purposes){
        var msg = 'Any type of allowed use can be added to an MPA of this designation.';
        var last_select = false;
        this.clearingAllowedUses = true;
        $('#allowed_uses_widget select.choose').each(function(){
            this.selectedIndex = 0;
            last_select = this;
        });
        this.clearingAllowedUses = false;
        $(last_select).trigger('change');
        
        if(purposes.length == 0){
            msg = 'Allowed uses cannot be added to an MPA of this designation type.';
            $('#allowed_uses_widget select.choose').attr('disabled', 'disabled');
        }else if(purposes.length < $('select.purpose option').length - 1){
            $('select.choose').attr('disabled', false);
            var option = $('select.purpose option[value="'+purposes[0]+'"]');
            option.attr('selected', true);
            $('select.purpose').attr('disabled', true);
            msg = 'MPAs with this designation can only have <em>'+option.html()+'</em> allowed uses.';
        }else{
            $('select.choose').attr('disabled', false);
        }
        $('p#designation_purposes_warning').html(msg);
        $('#allowed_uses_widget select.choose').triggerHandler('change');
    },
    
    removeUsesNotMatchingDesignation: function(){
        var purposes = this.purposesForDesignation($('select#id_designation option:selected').attr('value'));
        var inst = this;
        $('#allowed_uses_widget table tbody tr').each(function(){
            var tr = $(this);
            if(purposes.length == 0){
                inst.removeAllowedUse(tr);
            }else{
                var id = jQuery.trim(tr.find('td.pk').html());
                var remove = true;
                for(var i=0; i<purposes.length; i++){
                    if(inst.allowed_uses_by_id[id] && inst.allowed_uses_by_id[id]['purpose_id'] == purposes[i]){
                        remove = false;
                    }
                }
                if(remove){
                    inst.removeAllowedUse(tr);
                }
            }
        });
    },
    
    addToLookup: function(obj, use, item, a, b, c){
        var key = ' ' + a + b + c;
        key = jQuery.trim(key);
        if(!obj[key]){
            obj[key] = {};
        }
        obj[key][item] = use;
    },
    
    createLookups: function(){
        this.currentDesignation = $('select#id_designation')[0].selectedIndex;
        this.allowed_uses = eval('(' + $('#all_allowed_uses').html() + ')');
        this.x_designations_purposes = eval('('+$('#x_designations_purposes').html()+')');
        this.allowed_uses_by_id = {};

        // setup lookup for allowed_uses
        this.allowed_uses_choice_lookup = {};

        this.allowed_use_direct_lookup = {};
        var lookup = this.allowed_uses_choice_lookup;
        for(var i=0; i<this.allowed_uses.length; i++){
            var use = this.allowed_uses[i];
            if(typeof use != 'undefined'){
                this.allowed_uses_by_id[use['id']] = use;
                this.allowed_use_direct_lookup[' '+use['target_id']+use['method_id']+use['purpose_id']] = use;
                this.addToLookup(lookup, use, use['target_id'],  'o',                 'x',                'x');
                this.addToLookup(lookup, use, use['target_id'],  'o',                 use['method_id'],   use['purpose_id']);
                this.addToLookup(lookup, use, use['target_id'],  'o',                 use['method_id'],   'x');
                this.addToLookup(lookup, use, use['target_id'],  'o',                 'x',                use['purpose_id']);

                this.addToLookup(lookup, use, use['method_id'],  'x',                 'o',                'x');
                this.addToLookup(lookup, use, use['method_id'],  use['target_id'],    'o',                use['purpose_id']);
                this.addToLookup(lookup, use, use['method_id'],  'x',                 'o',                use['purpose_id']);
                this.addToLookup(lookup, use, use['method_id'],  use['target_id'],    'o',                'x');

                this.addToLookup(lookup, use, use['purpose_id'], 'x',                 'x',                'o');   
                this.addToLookup(lookup, use, use['purpose_id'], use['target_id'],    use['method_id'],   'o');
                this.addToLookup(lookup, use, use['purpose_id'], use['target_id'],    'x',                'o');
                this.addToLookup(lookup, use, use['purpose_id'], 'x',                 use['method_id'],   'o');
            }
        }
    },
    
    makeSureIEDoesntLetUsersSelectDisabledOptions: function(e){
        var select = e.target;
        if(select.selectedIndex != 0){
            var option = select.options[select.selectedIndex];
            if($(option).css('color') == this.msieDisabledColor){
                var msg = 'This option cannot be selected in combination with your other selections';
                if($(select).hasClass('purpose')){
                    msg = msg + ', or the current MPA Designation. ';
                }else{
                    msg = msg + '. ';
                }
                msg = msg + 'For example, you cannot choose method "By Hand" in combination with a target of "Salmon".';
                alert(msg);
                select.selectedIndex = 0;
                e.preventDefault();
                return false;
            }                
        }
    },
    
    init: function(){
        this.successHandler = this.options['success']
        this.cancelHandler = this.options['cancel'];
        
        var inst = this;
        
        // Remove blank options from designation field
        // This should really be handled via modelforms, but I have no idea how
        // if($('select#id_designation')[0].selectedIndex == 0){
        //     $('select[name="designation"] option[value=""]').remove();
        //     $('select#id_designation')[0].selectedIndex = 0;            
        // }else{
        //     $('select[name="designation"] option[value=""]').remove();
        // }
        
        $('#mpaFormTabs button.cancel').click(function(e){
            inst.hide();
            inst.cancelHandler();
        });
        
        $('#allowed_uses_widget select.choose').bind('mousedown', function(e){
            inst.allowedUsesPropertyMousedown(e);
        });
        
        $('select#id_designation').bind('change', function(e){
            inst.designationChange(e);
        });

        if($.browser.msie){
            $('#allowed_uses_widget select.choose').bind('change', function(e){
                inst.makeSureIEDoesntLetUsersSelectDisabledOptions(e);
            });
        }

        $('td.remove-allowed-use').each(function(){
           $(this).show();
           $(this).find('a').bind('click', function(e){
               inst.removeAllowedUse($(this).parent().parent());
               e.preventDefault();
               return false;
           });
        });

        $('a#add-use').click(function(e){
            var target = $('select.target option:selected').attr('value');
            var method = $('select.method option:selected').attr('value');
            var purpose = $('select.purpose option:selected').attr('value');
            if(target != 'x' && method != 'x' && purpose != 'x'){
                var use = inst.allowed_use_direct_lookup[' '+target+method+purpose];
                inst.addAllowedUse(use);
            }else{
                alert('You must choose a Target, Method, and Use Type in order to add an Allowed Use');
            }
            e.preventDefault();
            return false;
        });
        
        $('#allowed_uses_widget select.choose').bind('change', function(e){
            inst.allowedUsePropertySelectionChange(e);
        });

        $('#mpaFormTabs input[type="submit"]').bind('click submit', function(e){
            inst.submitHandler(e);
        });
        

        // Event handlers for the buttons
        $('#forward').click(function(){
            if($('#forward').css('display') == 'block'){
                var link = $('ul#form_shortcuts li.active').next().children('a');
                link.click();
            }
            return false;
        });
        $('#backward').click(function(){
            if($(this).css('display') == 'block'){
                var li = $('ul#form_shortcuts li.active').prev();
                $(li).children('a').click();
            }
            return false;
        });

        // Setup event handlers for when the user tabs thru form elements
        $('#mpaFormTabs').keydown(function(e){
            if(e.keyCode == 9){ //TAB
                e.preventDefault();
                return false;
            }else if(e.keyCode == 13){ //ENTER
                if($('#mpaFormTabs.create').length == 0){
                    var type = $(e.target).attr('type');
                    if(type == 'textarea' || type == 'select' || type=='select-one'){
                        return true;
                    }else{
                        e.preventDefault();
                        $("#mpa_attr_submit").click();
                        return false;
                    }
                }
            }
        });

        // Clicking on these links starts all the functionality
        // If you feel like you need to call something akin to Form.openTabIndex(2),
        // instead find the appropriate link and fire its click event
        $('ul#form_shortcuts li a').click(function(e){
            if(mlpa.mpaForm.transitioning == true){
                return false;
            }else{            
                // Figure out what panel is active, and keep the href for a callback
                old_target = $('li.active a').attr('href');
                var old_href = old_target.replace(/[^#]*/, "");

                // Find what panel should be shown
                var href = $(this).attr('href');
                var href = href.replace(/[^#]*/, "");

                if(href == old_href){
                    e.preventDefault();
                    return false;
                }
                mlpa.mpaForm.transitioning = true;


                $('ul#form_shortcuts li.active').removeClass('active');
                $(this).parent().addClass('active');


                var pos = $(href).prevAll().length
                // Determine which buttons need to be displayed
                if(!inst.options['editUrl']){
                    if(pos == 0){
                        $('#backward').css('display', 'none');
                    }else{
                        $('#backward').css('display', 'block');
                    }
                    if(pos == $('div.formpane').length - 1){
                        $('#forward').css('display', 'none');
                        $('#mpaFormTabs input[type="submit"]').css('display', 'block');
                    }else{
                        $('#forward').css('display', 'block');
                        $('#mpaFormTabs input[type="submit"]').css('display', 'none');
                    }                
                }

                // Calculate scroll position
                var width = $('div.formpane').innerWidth();
                var offset = pos * width;

                // Fire first callback
                mlpa.mpaForm.exitPanel($(old_href));

                // Start animation and set callback
                $('div.form_content').animate({
                   scrollLeft: offset
                }, 350, 'linear', function(){
                   mlpa.mpaForm.enterPanel($(href));
                });
                // Prevent default link behavior
                e.preventDefault();
                return false
            }
        });

        var errors = $('ul.errorlist');
        if(errors.length > 0){
            var id = "#" + $(errors[0]).parent().parent()[0].id;
            $('a[href*="'+id+'"]').click();
        }else{
            // go directly to the begining without animation
            $('div.form_content').scrollLeft(0);
            mlpa.mpaForm.enterPanel($("#first_page"));
            $('#backward').css('display', 'none');
            // link.click();
        }
        
        this.createLookups();
        this.updatePurposes(this.purposesForDesignation($('select#id_designation option:selected').attr('value')));
    },
    
    purposesLookup: {},
    
    purposesForDesignation: function(des_id){
        if(des_id == ''){
            des_id = 'null';
        }
        if(this.purposesLookup[des_id]){
            return this.purposesLookup[des_id];
        }else{
            var purposes = [];
            for(var i = 0; i< this.x_designations_purposes.length; i++){
                if(typeof this.x_designations_purposes[i] == 'object'){
                    if(des_id == 'null' || this.x_designations_purposes[i]['designation_id'] == des_id){
                        purposes.push(this.x_designations_purposes[i]['purpose_id']);
                    }
                }
            }
            this.purposesLookup[des_id] = purposes;
            return this.purposesLookup[des_id];
        }
    },

    clearingAllowedUses: false,
    
    allowedUsePropertySelectionChange: function(e){
        if(this.clearingAllowedUses){
            return;
        }
        var key = false;
        var target = e.currentTarget;
        var inst = this;
        $('select.choose').each(function(){
            if(this == target){
                return;
            }
            var select = $(this);
            if($(select).hasClass('target')){
                var key = 'o' + $('select.method option:selected').attr('value') + $('select.purpose option:selected').attr('value');
            }else if($(this).hasClass('method')){
                var key = $('select.target option:selected').attr('value') + 'o' + $('select.purpose option:selected').attr('value');
            }else{
                var key = $('select.target option:selected').attr('value') + $('select.method option:selected').attr('value') + 'o';
            }
            var choices = inst.allowed_uses_choice_lookup[key];
            if($(this).hasClass('purpose')){
                var purposes = inst.purposesForDesignation(inst.currentDesignation);
            }
            select.find('option').each(function(){
                var value = $(this).attr('value');            
                var hide = true;
                if(value == 'x'){
                    hide = false;
                }
                if(!(choices && !(typeof choices[value] === 'object'))){
                    hide = false;
                }
                if(purposes){
                    for(var j = 0; j < purposes.length; j++){
                        if(!hide && purposes[j] == value){
                            hide = false;
                        }
                    }
                }
                if($.browser.msie){
                    $(this).css('color', (hide ? inst.msieDisabledColor : ''));
                }else{
                    $(this).attr('disabled', (hide ? 'disabled' : ''));
                }
            });
        });
    },
    
    addAllowedUse: function(use){
        if($('select#id_allowed_uses option[value="'+use['id']+'"]').attr('selected')){
            alert('You have already added this allowed use.');
        }else{
            $('tr.none').hide();
            $('select#id_allowed_uses option[value="'+use['id']+'"]').attr('selected', true);
            // add to table
            var row = [
                '<tr style="background-color:#CBF1BE; display:none;">',
                    '<td class="pk" style="display:none;">',
                        use['id'],
                    '</td>',
                    '<td class="target">',
                        $('select.target option:selected').html(),
                    '</td>',
                    '<td class="method">',
                        $('select.method option:selected').html(),
                    '</td>',
                    '<td class="purpose">',
                        $('select.purpose option:selected').html(),
                    '</td>',
                    '<td class="remove-allowed-use">',
                        '<a title="remove" href="#"><img src="/site-media/images/silk/icons/delete.png" /></a>',
                    '</td>',
                '</tr>'
            ];
            $('#allowed_uses_widget table tbody').prepend(row.join(''));
            var row = $('#allowed_uses_widget table tbody tr:first');
            var inst = this;
            row.find('td.remove-allowed-use a').bind('click', function(e){
                inst.removeAllowedUse($(this).parent().parent());
            });
            
            row.fadeIn(500, function(){
                row.css('background-color', 'transparent');
            });
            
            var last_select = false;
            this.clearingAllowedUses = true;
            $('#allowed_uses_widget select.choose').each(function(){
                if(!$(this).attr('disabled')){
                    this.selectedIndex = 0;
                    last_select = this;
                }
            });
            this.clearingAllowedUses = false;
            $(last_select).trigger('change');
        } 
    },
    
    removeAllowedUse: function(tr){
        tr = $(tr);
        var pk = jQuery.trim(tr.find('td.pk').html());
        var option = $('select#id_allowed_uses option[value="'+pk+'"]').attr('selected', false);
        tr.css('background-color', '#ED979A');
        tr.fadeOut(300, function(){
           tr.remove(); 
        });
    },
    
    enterPanel: function(target){
        // Fix for tearing in Firefox Windows
        target.css('overflow-y', 'auto');
        form_elements = $(target).find(':input');
        if(form_elements.length > 0){
            form_elements[0].focus();
        }
        $(target).scrollTop(0);
        mlpa.mpaForm.transitioning = false;
    },
    
    hide: function(){
        gwst.ui.modal.hide();
    },
    
    transitioning: false,
    
    exitPanel: function(target){
        target.css('overflow-y', 'visible');
    }
};
if(typeof gwst != 'object'){
    gwst = {};
}

if(typeof gwst.ui != 'object'){
    gwst.ui = {};
}

gwst.ui.ClientStore = function(){
    /**
        ClientStore holds data for the client application in a lookup table in
        order to support fast retrieval of objects by id. This is especially 
        usefull for optimally retrieving related objects.
        
        For example, Array objects may reference many MPA objects by an array 
        of ids in attribute Array#mpa_ids. Using the store, it is easy to loop
        thru and grab the related MPAs using the ClientStore#get('mpa', id) 
        method.
        
        For ClientStore to know how to store objects, they must have the 
        following attributes:
            
            model: A unique string identifier for the type
            
            pk: A key that is unique for that object given its model
            
            dateModified(optional): In order for updates to occur via the 
            reload method, there needs to be a dateModified field. Otherwise
            the update event will be triggered for all objects whether they
            have been modified or not.
        
        ClientStore also provides many events to allow widgets to sync their 
        display with the underlying  data model. These include:
        
        loaded(event, data)     fired when the load method on ClientStore is 
                                called. This will only be fired once when 
                                initial data is loaded.
                        
        updated(event, data)    fired when any object in the store have been 
                                replaced, due to the add method being called 
                                with object(s) that already exist in the store
                        
        removed(event, data)    fired when any object(s) have been removed.

        added(event, data)      fired when object(s) are added. NOT fired
                                on load.
        
        Note there is NO reload event. Calling reload() will trigger update,
        added, and removed events.
        
        Widgets should listen to events and respond appropriately, rather than 
        relying on the functions that call ClientStore methods to also call
        updates on the UI. If your gwst.actions are ending up verbose, or
        require frequent updates due to UI changes, chances are this 
        recommendation is not being followed.
                        
    */
    
    
    // Private variables and methods
    
    /**
    Object where data is stored. Will end up like this:
    stores =  {
        mpas: [<mpa 1>, <mpa 2>, ...],
        arrays: [<array 1>, <array 2>, ...],
        users: [<user 1>, <user 2>, ...],
    } */
    var stores = {};
    
    // To make sure load() is called once and only once
    var loadCount = 0;
    
    var self = this;
    
    function addToStore(item, updated, added){
        // need to add methods for determining whether to add or update
        if(!item.model){
            throw('No model specified');
        }
        if(!item.pk){
            throw('No pk specified');
        }
        if(!stores[item.model]){
            stores[item.model] = {}
        }
        if(stores[item.model][item.pk] == undefined){
            if(added[item.model] == undefined){
                added[item.model] = [];
            }
            added[item.model].push(item);
        }else{
            var olditem = stores[item.model][item.pk];
            if(item.dateModified != undefined && item.dateModified <= olditem.dateModified){
                // Doesn't need updating, already in store and not modified
            }else{
                if(updated[item.model] == undefined){
                    updated[item.model] = [];
                }
                updated[item.model].push([item, olditem]);
            }
        }
        stores[item.model][item.pk] = item;
    }
    
    function removeFromStore(item){
        if(stores[item.model]){
            delete stores[item.model][item.pk]
        }else{
            throwNoStore(item.model);
        }    
    }
    
    function throwNoStore(model){
        var msg = 'An entry for the store has not been created for model "';
        throw(msg+model+'"');
    }
    
    function keys(){
      var keys = [];
      for(var key in stores){
          keys.push(key);
      }
      return keys;
    }
    
    // Public API   
    return {
        /**
            get(model, pk)
            Retrieves a model of a given type from the store.
        */
        get: function(model, pk){
            if(stores[model]){
                return stores[model][pk];
            }else{
                throwNoStore(model)
            }
        },
        
        /**
            remove(item[])
            Removes the given item or items from the store.
        */
        remove: function(item){
            var items = {};
            if(jQuery.isArray(item)){
                for(var i=0; i<item.length; i++){
                    if(items[item[i].model] == undefined){
                        items[item[i].model] = [];
                    }
                    items[item[i].model].push(item[i])
                    removeFromStore(item[i]);
                }
            }else{
                items[item.model] = [item];
                removeFromStore(item)
            }
            $(this).trigger('removed', [items]);
        },
        
        /**
            add(item[])
            
            Can be called with one object or an array to add to the store.
        */
        add: function(item){
            var updated = {};
            var added = {};
            if(jQuery.isArray(item)){
                for(var i=0; i<item.length; i++){
                    addToStore(item[i], updated, added);
                    item[i].store = this;
                }
            }else{
                addToStore(item, updated, added);
                item.store = this;
            }
            var callAdded = false;
            for(var key in added){
                callAdded = true;
            }
            var callUpdated = false;
            for(var key in updated){
                callUpdated = true;
            }
            if(callAdded){
                $(this).trigger('added', [added]);
            }
            if(callUpdated){
                $(this).trigger('updated', [updated]);
            }
        },
        
        clear: function(){
            stores = {};
            loadCount = 0;
        },
        
        /**
            each(model, func)
            Will loop through all objects of the given model and call the
            function for each.
        */
        each: function(model, func){
            if(stores[model]){
                for(var key in stores[model]){
                    func(stores[model][key]);
                }
            }else{
                throwNoStore(model)
            }
        },
        
        /**
            load(items[])
            Load initial data into the store. Accepts an array of all objects.
            Can only be called once!
        */
        load: function(items){
            if(loadCount != 0){
                throw('Load called more than once!');
            }else{
                loadCount = 1;
                for(var key in items){
                    var data = items[key];
                    for(var i=0; i<data.length; i++){
                        addToStore(data[i], {}, {});
                        data[i].store = this;
                    }
                }
                $(this).trigger('loaded', [items]);
            }
        },
        
        /**
            reload({model1: [...], model2: [...]})
            Will look at items for each model type in the object hash and:
            *   Add completely new items,
            *   remove items currently in the store but missing in new data
            *   update items already in the store, optionally taking into
                consideration a dateModified field
            
            Events (add, remove, update) are called after all processing, and
            only once for each type with all relavent data. (ie one add event
            with multiple objects passed)
        */
        reload: function(items){
            var added = {};
            var updated = {};
            var forRemoval = [];
            for(var key in items){
                var keep = {};
                for(var i=0; i<items[key].length; i++){
                    var item = items[key][i];
                    addToStore(item, updated, added);
                    item.store = this;
                    keep[item.pk] = true;
                }
                this.each(key, function(data){
                    if(keep[data.pk] == undefined){
                        forRemoval.push(data);
                    }
                });
            }
            this.remove(forRemoval);
            $(this).trigger('updated', [updated]);
            $(this).trigger('added', [added]);
            // strategy
            //     loop thru store adn add tbDeleted=true
            //     do adds, setting tbDeleted=false on each
            //         addToStore must return copy in store now!!
            //     loop - delete those with tbDeleted                
        },
        
        getAll: function(type){
            return stores[type];
        }
    }
};
(function($){
    var Tree = {
        
        _init: function(){
            var self = this;
            this.element.addClass('gwst-tree');
            this.defaults = {
                classname: '',
                id: '',
                context: false,
                select: false,
                doubleclick: false,
                hideByDefault: false,
                collapsible: false,
                toggle: false,
                icon: false,
                metadata: '',
                children: false,
                extra: '',
                description: false
            };
            
            this._template = tmpl([
                '<li class="',
                '<%= (context ? "context " : "") %>',
                '<%= (toggle ? "toggle " : "") %>',
                '<%= (select ? "select " : "unselectable ") %>',
                '<%= (doubleclick ? "doubleclick " : "") %>',
                '<%= (hideByDefault ? "hideByDefault " : "") %>',
                '<%= classname %> <%= id %> <%= metadata %> gwst-tree-item',
                '">',
                    '<% if(collapsible) { %>',
                        '<span class="collapsible"><img src="/site-media/images/core/arrow-right.png" width="9" height="9" /></span>',
                    '<% } %>',
                    '<% if(toggle) { %>',
                        '<input type="checkbox"></input>',
                    '<% } %>',
                    '<% if(icon) { %>',
                        '<img class="icon" src="<%= icon %>" width="16" height="16" />',
                    '<% } %>',
                    '<a href="#"><%= name %></a>',
                    '<span class="badges"><%= extra %></span>',
                    '<% if(description){ %>',
                        '<p class="description"><%= description %></p>',
                    '<% } %>',
                    '<% if(children) { %>',
                    '<% if(collapsible) { %>',
                    '<ul style="display:none;"><%= children %></ul>',
                    '<% }else{ %>',
                    '<ul><%= children %></ul>',
                    '<% } %>',
                    '<% } else if(collapsible) { %>',
                        '<ul style="display:none;"></ul>',
                    '<% } %>',
                '</li>'
            ].join(''))
            
            $(this).find('span.collapsible').live('click', function(event){
                event.preventDefault();
                // alert('collapsible click');
                var list = $(this).parent().find('>ul');
                if(list.find('li').length == 0){
                    list.html('<p class="no-items">No items.</p>');
                }else{
                    list.find('p.no-items').remove();
                }
                if(list.css('display') == 'none'){
                    $(this).toggleClass('expanded', true);
                }else{
                    $(this).toggleClass('expanded', false);
                }
                if(event && event.button != undefined){
                    list.slideToggle('fast');
                }else{
                    list.toggle();
                }
                var img = $(this).find('img');
                if($(this).find('img[src*=/site-media/images/core/arrow-right.png]').length != 0){
                    img.attr('src', "/site-media/images/core/arrow-down.png");
                }else{
                    img.attr('src', "/site-media/images/core/arrow-right.png");
                }
                return false;
            });
            
            $(this).find('li.gwst-tree-item a').live('dblclick', function(event){
                if($(event.target).parent().hasClass('doubleclick')){
                    $(self.element).trigger('itemDoubleClick', [$(event.target).parent().metadata(), event]);
                }
                event.preventDefault();
                return false;
            });
                        
            $(this).find('li a').live('contextmenu', function(event){
                var item = $(event.target).parent();
                if(item.hasClass('context')){
                    self.element.trigger('itemContext', [event, item.metadata(), item]);
                }
                event.preventDefault();
                return false;
            });
            
            $(this).find('li.gwst-tree-item a').live('click', function(event){
                if(event.button == 2){
                    
                }else{
                    var parent = $(event.target).parent();
                    if(parent.hasClass('select')){
                        var e = jQuery.Event("itemSelect");
                        self.element.trigger(e, [parent.metadata(), parent]);
                        if(!e.isDefaultPrevented()){
                            self.selectItem(parent);
                        }
                    }else{
                        var e = jQuery.Event("itemSelect");
                        self.element.trigger(e, [null, parent]);
                        if(!e.isDefaultPrevented()){
                            self.clearSelection();
                        }
                    }
                    event.preventDefault();
                    return false;
                }
            });

            $(this).find('li span.collapsible, li span.collapsible a').live('contextmenu', function(event){
                event.preventDefault();
                return false;
            });
            // $(this).find('li').live('click', function(event){
            //     // var sorted = jQuery.makeArray($(event.target).find('>ul>li').sort(function(a, b){
            //     //     return $(a).data('data') != undefined && $(b).data('data') != undefined && $(a).data('data').date_modified > $(b).data('data').date_modified;
            //     // }));
            //     // var ul = $(event.target).find('>ul');
            //     // ul.empty('');
            //     // for(var i=0; i<sorted.length; i++){
            //     //     ul.append(sorted[i]);
            //     // }
            // });
            
            $(this).find('li.gwst-tree-item input[type=checkbox]').live('click', function(e){
                var element = $(this);
                var checked = element.attr('checked');
                var parent = element.parent();
                if(parent.hasClass('selected')){
                    var e = jQuery.Event('itemSelect');
                    self.element.trigger(e, [null, null]);
                    if(!e.isDefaultPrevented()){
                        self.clearSelection();
                    }
                }
                var clickedData = [parent.metadata()];
                var list = parent.find('>ul');
                if(list.length > 0){
                    self._toggleCheckboxes(list, checked, clickedData);
                }
                // if(checked == true){
                parent.parents('li.toggle').each(function(){
                    var el = $(this);
                    if(checked == true){
                        el.find(' > input[type=checkbox]').attr('checked', true);
                    }else{
                        if(el.find('> ul input[type=checkbox][checked=true]').length == 0){
                            el.find('> input[type=checkbox]').attr('checked', false);
                        }
                        if(el.hasClass('selected')){
                            self.clearSelection();
                            self.element.trigger('itemSelect', [null, null]);
                        }
                    }
                });
                self.element.trigger('itemToggle', [clickedData, checked]);
                if(checked == false){
                    if(parent.find('li.selected').length > 0){
                        parent.find('li.selected').removeClass('selected');
                        var e = jQuery.Event("itemSelect");
                        self.element.trigger(e, [null, null]);
                    }
                }
            });
        },
        
        selectItem: function(item, scrollTo){
            var wasHidden = false;
            if(typeof item == 'string'){
                item = this.element.find(item);
                wasHidden = this._expandAndToggleRecursive(item);
            }else{
                item = $(item);
            }
            var input = item.find('>input');
            var wasChecked = input.attr('checked');
            if(!wasChecked){
                input.click();
            }
            
            var list = item.find('>ul');
            var checked = []
            if(list.length > 0){
                this._toggleCheckboxes(list, true, checked);
            }
            if(!wasChecked || checked.length){
                this.element.trigger('itemToggle', [checked, true]);
            }
            
            var data = [];
            this.clearSelection();
            this._toggleCheckboxes(item, true, data);
            item.addClass('selected');
            
            if(scrollTo){
                var s = (this.options.scrollEl) ? $(this.options.scrollEl) : $(this.element).parent();
                var parent = s.parent();
                var ph = parent.height();
                var st = s.scrollTop();
                var visibleBounds = [st, st + ph - 20];
                var position = $(item).position().top + st;
                if(position > visibleBounds[0] && position < visibleBounds[1]){
                    // already visible
                }else{
                    s.scrollTop(position - (ph / 2) + 20);
                }
            }
        },
        
        _expandAndToggleRecursive: function(item, wasHidden){
            if(!(wasHidden === true || wasHidden === false)){
                wasHidden = false;
            }
            var parent = item.parent().parent();
            if(parent.hasClass('gwst-tree-item')){
                if(parent.find('>ul:visible').length == 0){
                    wasHidden = true;
                    parent.find('>span.collapsible').click();
                }
                var input = parent.find('>input');
                if(input){
                    input.attr('checked', true);
                }
                return this._expandAndToggleRecursive(parent, wasHidden);
            }else{
                return wasHidden;
            }
        },
        
        clearSelection: function(){
            $(".gwst-tree li.selected").removeClass('selected');
        },
        
        _toggleCheckboxes: function(el, state, data){
            var self = this;
            el.find('>li.toggle').each(function(){
                var hideByDefault = $(this).hasClass('hideByDefault');
                if(hideByDefault && state){
                    // do nothing
                }else{
                    // dont uncheck hideByDefault nodes that are already unchecked
                    var input = $(this).find('>input');
                    // this code might not work for deeply nested trees, needs
                    // testing for use cases other than array->mpa
                    if(input.attr('checked') != state){
                        input.attr('checked', state);
                        data.push($(this).metadata());
                    }
                    var ul = $(this).find('>ul');
                    if(ul.length > 0){
                        self._toggleCheckboxes(ul, state, data);
                    }
                }
            });
        },

        add: function(options){
            var element = this._rTemplate(options);
            var parent;
            if(typeof options['parent'] == 'string'){
                parent = this.element.find(options['parent']);
            }else if(typeof options['parent'] == 'undefined'){
                parent = this.element;
            }else{
                parent = options['parent'];
            }
            if(parent == this.element){
                var ul = parent;
            }else{
                var ul = parent.find('>ul');
                if(ul.size() == 0){
                    parent.append('<ul></ul>');
                    var ul = parent.find('>ul');
                }
            }
            if(ul.find('li').length == 0){
                ul.html('');
            }
            ul.append(element);
            var element = ul.find('.'+options['id']);
            options = null;
            return element;
        },
        
        renderTemplate: function(options){
            if(jQuery.isArray(options)){
                var strings = [];
                for(var i=0;i<options.length;i++){
                    strings.push(this._rTemplate(options[i]));
                }
                return strings.join('');
            }else{
                var string = this._rTemplate(options);
                return string;
            }
        },
        
        _rTemplate: function(options){
            return this._template(
                jQuery.extend({}, this.defaults, options)
            );
        },
        
        nodeExists: function(selector){
            if(this.element.find(selector).length > 0){
                return true;
            }else{
                return false;
            }
        }
    }

    $.widget('gwst.tree', Tree);
    
    $.extend($.gwst.tree, {
        getter: ['add', 'nodeExists', 'renderTemplate'],
        defaults: {
            // uses micro-templating. 
            // See http://ejohn.org/blog/javascript-micro-templating/
            defaultItemTemplate: '<li><h3><%= name %></h3></li>',
            categoryTemplate: '<li><h2><img src="<%= ( obj.icon ? icon : "/site-media/images/silk/icons/folder.png") %>" width="9" height="9" /><%= label %></h2></li>',
            idProperty: 'id',
            modelProperty: 'model',
            modelTemplates: {},
            scrollEl: false,
            contextMenu: function(event, element, id){
                
            }
        }
    });
    
    // var CustomTree = $.extend({}, $.gwst.tree.prototype);
    
})(jQuery);
if(typeof Ext != 'undefined'){
    Ext.namespace('gwst', 'gwst.ui');
}else{
    // Alternative setup for testing sans-ext
    if(typeof gwst != 'object'){
        gwst = {};
    }

    if(typeof gwst.ui != 'object'){
        gwst.ui = {};
    }
}

gwst.ui.data = {
    from_json: function(json, lookup){
        var hash = {}
        for(var key in json){
            var klass = lookup[key];
            hash[key] = [];
            for(var i=0; i<json[key].length; i++){
                hash[key].push(new klass(json[key][i]));
            }
        }
        return hash;
    }
};
if(typeof Ext != 'undefined'){
    Ext.namespace('gwst', 'gwst.ui');
}else{
    // Alternative setup for testing sans-ext
    if(typeof gwst != 'object'){
        gwst = {};
    }

    if(typeof gwst.ui != 'object'){
        gwst.ui = {};
    }
}

gwst.ui.UserManager = function(){
    return {
        user: null,
        setUser: function(user, caller){
            var oldUser = this.user;
            this.user = user;
            $(this).trigger('change', [user, oldUser, this, caller]);
        }
    }
}
if(window.gwst == undefined){
    gwst = {};
}

if(gwst.data == undefined){
    gwst.data = {};
}

gwst.data.extend = function(self, data, required){
    jQuery.extend(self, data);
    if(self['display_properties']){
        delete self['display_properties']['child_nodes'];
    }
    for(var i=0; i<required.length; i++){
        if(data[required[i]] == undefined){
            throw(required[i] + ' was undefined');
        }
    }
};

gwst.data.mlpaFeatures = {
    MPA: function(data){
        gwst.data.extend(this, data, ['model', 'pk', 'user']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    Array: function(data){
        gwst.data.extend(this, data, ['model', 'pk', 'mpa_ids', 'user']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    User: function(data){
        gwst.data.extend(this, data, ['model', 'pk', 'name']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    Group: function(data){
        gwst.data.extend(this, data, ['model', 'pk', 'users']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    Designation: function(data){
        gwst.data.extend(this, data, ['model', 'pk']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    parser: new OpenLayers.Format.GeoJSON({})
};

jQuery.extend(gwst.data.mlpaFeatures.MPA.prototype, {
    
    editUrl: function(){
        return '/gwst/mpa/edit/' + this.pk;
    },
    
    get_array: function(){
        if(!this.array){
            return null;
        }else{
            if(this.store){
                return this.store.get('array', this.array);
            }else{
                throw('Cannot find Array, this MPA does not belong to a store.');
            }
        }
    },
    
    callWithFeature: function(func){
        if(!this._listeners){
            this._listeners = [];
        }
        this._listeners.push(func);
        if(this.feature){
            this._featureLoadedCallback();
        }else{
            if(this._loadingFeatures != true){
                this._requestFeature();
            }
        }
    },
    
    _requestFeature: function(){
        return this.array && this.store.get('array', this.array) ? this.get_array().loadFeatures() : this.loadFeature()
    },
    
    loadFeature: function(){
        var mpa = this;
        mpa._loadingFeatures = true;
        jQuery.ajax({
            // dataType: 'json',
            error: function (XMLHttpRequest, textStatus, errorThrown){
                mpa._loadingFeatures = false;
                mpa._listeners = [];
                gwst.ui.error.show({errorText: 'Could not load MPA geometry. Please try turning the MPA on/off again. If the error persists, please contact <a href="mailto:help@lists.gwst.org?subject=mpa_geometry_broken">email help</a>'});
            },
            success: function(data, textStatus){
                mpa._loadingFeatures = false;
                var parser = gwst.data.mlpaFeatures.parser;
                mpa.feature = parser.read(data, 'Feature');
                mpa._featureLoadedCallback();
            },
            type: 'GET',
            url: '/gwst/geojson/mpa/'+this.pk
        });
    },
    
    _featureLoadedCallback: function(){
        this.feature.attributes.mpa = this;
        if(this._listeners){
            while(this._listeners.length){
                var callback = this._listeners.shift();
                callback(this, this.feature);
            }        
        }
    },
    
    setFeature: function(f){
        this.feature = f;
        this._featureLoadedCallback();
    },
    
    get_user: function(){
        if(this.store){
            return this.store.get('user', this.user);
        }else{
            throw('Cannot find User, this MPA does not belong to a store.');
        }
    },
    
    get_sharing_groups: function(){
        if(this.sharing_groups == undefined){
            return [];
        }
        if(this.store){
            var sharing_groups = [];
            for(var i=0; i<this.sharing_groups.length;i++){
                var sg = this.store.get('group', this.sharing_groups[i]);
                if(sg){
                    sharing_groups.push(sg);
                }
            }
            return sharing_groups;
        }else{
            throw('Cannot find sharing_groups, this MPA does not belong to a store.');
        }
    },
    
    get_designation: function(){
        if(!this.store){
            throw('Cannot find Designation. This MPA does not belong to a store.');
        }else{
            if(this.designation){
                return this.store.get('designation', this.designation);
            }else{
                return null;
            }
        }
    },
    
    // returns a new mpa
    saveGeometryChanges: function(geometry, geometry_clipped, opts){
        $.ajax({
            data: {geometry: geometry, geometry_clipped: geometry_clipped},
            url: '/gwst/mpa/editgeom/'+this.pk,
            success: function(data, textStatus){
                var mpa = gwst.data.mlpaFeatures.mpa_from_geojson(data);
                if(typeof opts['success'] == 'function'){
                    opts['success'](mpa);  
                }
            },
            error: opts['error'],
            dataType: 'json',
            type: 'POST' 
        });
    }
});

gwst.data.mlpaFeatures.mpa_from_geojson = function(data){
    var mpa = new gwst.data.mlpaFeatures.MPA(data.properties);
    var parser = gwst.data.mlpaFeatures.parser;
    mpa.setFeature(parser.read(data, 'Feature'));
    return mpa;
}

gwst.data.mlpaFeatures.array_and_mpas_from_geojson = function(data){
    var array = new gwst.data.mlpaFeatures.Array(data['properties']);
    array.feature = true;
    var mpas = [];
    var features = gwst.data.mlpaFeatures.parser.read(data);
    for(var i=0; i<features.length; i++){
        var mpa = new gwst.data.mlpaFeatures.MPA(features[i].attributes);
        mpa.setFeature(features[i]);
        mpas.push(mpa);
    }
    return [array, mpas];
}

jQuery.extend(gwst.data.mlpaFeatures.Array.prototype, {
    
    get_user: function(){
        if(this.store){
            return this.store.get('user', this.user);
        }else{
            throw('Cannot find User, this Array does not belong to a store.');
        }
    },
    
    get_sharing_groups: function(){
        if(this.sharing_groups == undefined){
            return [];
        }
        if(this.store){
            var sharing_groups = [];
            for(var i=0; i<this.sharing_groups.length;i++){
                var sg = this.store.get('group', this.sharing_groups[i]);
                if(sg){
                    sharing_groups.push(sg);
                }
            }
            return sharing_groups;
        }else{
            throw('Cannot find sharing_groups, this Array does not belong to a store.');
        }
    },
    
    get_mpas: function(){
        var pk = this.pk;
        if(this.store){
            var mpas = [];
            this.store.each('mpa', function(mpa){
                if(mpa.array == pk){
                    mpas.push(mpa);
                }
            });
            return mpas;
        }else{
            throw('Cannot find MPAs, this Array does not belong to a store.');
        }
    },
    
    callWithFeature: function(func){
        if(!this._listeners){
            this._listeners = [];
        }
        this._listeners.push(func);
        if(this.feature){
            this._featureLoadedCallback();
        }else{
            if(this._loadingFeatures != true){
                this.loadFeatures();
            }
        }
    },
    
    loadFeatures: function(){
        if(this._loadingFeatures != true){    
            this._loadingFeatures = true;
            var array = this;
            jQuery.ajax({
                // dataType: 'json',
                error: function (XMLHttpRequest, textStatus, errorThrown){
                    array._loadingFeatures = false;
                    array._listeners = [];
                    gwst.ui.error.show({errorText: 'Could not load Array FeatureCollection. Please try turning the Array on/off again. If the error persists, please contact <a href="mailto:help@lists.gwst.org?subject=mpa_geometry_broken">email help</a>'});
                },
                success: function(data, textStatus){
                    var parser = gwst.data.mlpaFeatures.parser;
                    array.feature = true;
                    var features = parser.read(data);
                    array.each_mpa(function(mpa){
                        for(var i=0; i<features.length;i++){
                            if(features[i].fid == 'mpa_' + mpa.pk){
                                var f= features[i];
                            }
                        }
                        if(f){
                            mpa.setFeature(f);
                        }else{
                            alert('could not find mpa', f.fid);
                        }
                    });
                    array._loadingFeatures = false;
                    array._featureLoadedCallback();
                },
                type: 'GET',
                url: '/gwst/geojson/array/'+this.pk
            });
        }
    },
    
    _featureLoadedCallback: function(){
        if(this._listeners){
            while(this._listeners.length){
                var callback = this._listeners.shift();
                callback(this);
            }
        }
    },
    
    each_mpa: function(func){
        var pk = this.pk;
        if(this.store){
            this.store.each('mpa', function(mpa){
                if(mpa.array == pk){
                    func(mpa);
                }
            });
        }else{
            throw('Cannot find MPAs, this Array does not belong to a store.');
        }
    },
    
    get_users: function(){
        if(!this.store){
            throw('Object not in store.');
        }else{
            var users = [];
            for(var i=0; i<this.users.length;i++){
                users.push(this.store.get('user', this.users[i]));
            }
            return users;
        }
    }
});


gwst.data.mlpaFeatures.lookup = {
    'user': gwst.data.mlpaFeatures.User,
    'group': gwst.data.mlpaFeatures.Group,
    'mpa': gwst.data.mlpaFeatures.MPA,
    'array': gwst.data.mlpaFeatures.Array,
    'designation': gwst.data.mlpaFeatures.Designation   
};

/*
 * Metadata - jQuery plugin for parsing metadata from elements
 *
 * Copyright (c) 2006 John Resig, Yehuda Katz, J�örn Zaefferer, Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.metadata.js 3620 2007-10-10 20:55:38Z pmclanahan $
 *
 */
(function($){$.extend({metadata:{defaults:{type:'class',name:'metadata',cre:/({.*})/,single:'metadata'},setType:function(type,name){this.defaults.type=type;this.defaults.name=name;},get:function(elem,opts){var settings=$.extend({},this.defaults,opts);if(!settings.single.length)settings.single='metadata';var data=$.data(elem,settings.single);if(data)return data;data="{}";if(settings.type=="class"){var m=settings.cre.exec(elem.className);if(m)data=m[1];}else if(settings.type=="elem"){if(!elem.getElementsByTagName)return;var e=elem.getElementsByTagName(settings.name);if(e.length)data=$.trim(e[0].innerHTML);}else if(elem.getAttribute!=undefined){var attr=elem.getAttribute(settings.name);if(attr)data=attr;}if(data.indexOf('{')<0)data="{"+data+"}";data=eval("("+data+")");$.data(elem,settings.single,data);return data;}}});$.fn.metadata=function(opts){return $.metadata.get(this[0],opts);};})(jQuery);
if(window.gwst == undefined){
    gwst = {};
}

if(gwst.widgets == undefined){
    gwst.widgets = {};
}

gwst.widgets.FeaturesMenu = function(options){
    var self = this;
    if(!(options && options['selectionManager'] && options['store'] && (options['renderTo'] || options['extWindow']))){
        throw('gwst.widgets.FeaturesMenu created without appropriate options');
    }
    if(options['extWindow']){
        this.extWindow = new Ext.Window({
            x: 50,
            y: 50,
            width: 350,
            height: 420,
            html: '<div id="extTreeContainer" style="font-size:1.4em;"><ul id="extWindow"></ul></div>',
            autoScroll: true,
            closable: false,
            minimizable: true,
            listeners: {
                'minimize': function(w){
                    self.getExtButton().toggle(false);
                }
            },
            bbar: [
                gwst.actions.drawMPA,
                gwst.actions.createArray
            ],
            tbar: [{
                text: 'How to Use This',
                handler: function(){
                    gwst.actions.nonExt.openTreeTutorial();
                },
                iconCls: 'new-help'
            }]
        });
        this.extWindow.show();
        this.extWindow.hide();
        this.extWindow.getBottomToolbar().hide();
        options['renderTo'] = $('#extWindow');
        var _scrollEl = $(this.extWindow.element).find('.x-window-body');
    }else{
        var _scrollEl = $(options['renderTo'].parent());
    }
    
    if(!$(options['renderTo']).length){
        throw('gwst.widgets.FeaturesMenu: Could not find root object');
    }
    var _userManager = options['userManager'];
    var _sm = options['selectionManager'];
    var _store = options['store'];
    var _renderTo = options['renderTo'];
    this.tree = $(options['renderTo']).tree({scrollEl: _scrollEl});
    var self = this;
    
    $(_store).bind('added', function(e, data){
        if(data['array']){
            for(var i=0; i<data['array'].length; i++){
                var array = data['array'][0];
                self._addArray(array);
            }
        }
        if(data['mpa'] && data['mpa'].length){
            for(var i=0; i<data['mpa'].length; i++){
                var mpa = data['mpa'][i];
                self._addMpa(mpa);
            }
        }else{
            // nothing of interest added'
        }
    });
    
    $(_store).bind('removed', function(e, items){
        if(items['array'] && items['array'].length){
            for(var i=0; i<items['array'].length; i++){
                var array = items['array'][0];
                self.tree.find('li.'+items['array'][0].client_id).css('background-color', 'red').fadeOut('slow', function(){
                    $(this).remove();
                });
            }
        }else if(items['mpa'] && items['mpa'].length){
            for(var i = 0; i<items['mpa'].length; i++){
                self.tree.find('li.'+items['mpa'][0].client_id).css('background-color', 'red').fadeOut('slow', function(){
                    $(this).remove();
                });
            }
        }else{
            // nothing of importance removed
        }
    });
    
    $(_store).bind('updated', function(e, items){
        if(items['array'] && items['array'].length){
            for(var i=0; i<items['array'].length; i++){
                self._replaceArray(items['array'][i][0], items['array'][i][1]);
            }
        }
        if(items['mpa'] && items['mpa'].length){
            for(var i=0; i<items['mpa'].length; i++){
                self._replaceMpa(items['mpa'][i][0], items['mpa'][i][1]);
            }
        }
    });
    
    $(_sm).bind('selectionChange', function(event, oldFeature, newFeature){
        if(event.caller != self){
            if(newFeature){
                self.tree.tree('selectItem', '.'+newFeature.model + '_' + newFeature.pk, true);
            }else{
                self.tree.tree('clearSelection');
            }
        }
    });
    $(this.tree).bind('itemSelect', function(event, meta, element){
        if(meta && meta.model){
            _sm.setSelectedFeature(_store.get(meta.model, meta.pk), self);
        }else{
            _sm.clearSelection(self);
        }
    });
    this.tree.bind('itemToggle', function(event, items, state){
        var features = [];
        for(var i=0; i<items.length; i++){
            if(items[i]['model'] == 'mpa'){
                features.push(_store.get(items[i]['model'], items[i]['pk']));
            }
        }
        $(self).trigger('mpaToggle', [features, state]);
    });
    
    this.tree.find('a.sharedmsg img').live('click', function(e){
        var m = $(this).parent().parent().parent().metadata();
        var item = _store.get(m.model, m.pk);
        var groups = item.get_sharing_groups();
        var names = [];
        for(var i=0; i<groups.length; i++){
            names.push(groups[i].name);
        }
        alert('This item is shared with the following groups: '+names.join(', '));
        e.preventDefault();
        return false;
    });
    
    this.tree.bind('itemDoubleClick', function(e, data, originalEvent){
        if(data['model'] == 'array' || data['model'] == 'mpa'){
            var feature = _store.get(data['model'], data['pk']);
            $(self).trigger('featureDoubleClick', [feature]);
        }
    });

    
    this.tree.bind('itemContext', function(event, mouseEvent, data, target){
        var item = _store.get(data.model, data.pk);
        var actions = [];
        var data = {};
        if(item.model == 'mpa'){
            actions = [
                {
                    name: 'View Attributes',
                    handler: function(e){
                        gwst.actions.openMpaAttributes.execute(e.data, {});
                    },
                    iconcls: 'mm-context-view'
                },
                {
                    name: 'Download KML',
                    iconcls: 'mm-context-kml',
                    handler: function(e){
                        gwst.actions.openUrl('/gwst/kml/mpa/'+e.data.mpa.pk);
                    }
                }
            ];
            
            if(_userManager.user){
                actions.push({
                    name: 'Copy',
                    iconcls: 'mm-context-copy',
                    handler: function(e) {
                        gwst.actions.nonExt.copyMpa(e.data.mpa.pk);
                    }
                });
            }
            
            if(_userManager.user && item.user == _userManager.user.pk){
                actions.push({
                    name: 'Edit',
                    handler: gwst.actions.nonExt.editMpaAttributes,
                    iconcls: 'mm-context-edit'
                });
                actions.push({
                    name: 'Delete',
                    handler: gwst.actions.nonExt.deleteMPA,
                    iconcls: 'mm-context-delete'
                })
            }
            data = {mpa: item};
        }else if(item.model=='array'){
            data = {array: item};
            actions = [
                {
                    name: 'Basic Info',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.nonExt.openArrayBasicInfo(e.data.array.pk);
                    }
                },
                {
                    name: 'Download KML',
                    iconcls: 'mm-context-kml',
                    handler: function(e){
                        gwst.actions.openUrl('/gwst/kml/array/'+e.data.array.pk);
                    }
                },
                {
                    name: 'Download Shapefile',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.openUrl('/gwst/array/shapefile/'+e.data.array.pk);
                    }
                }
            ];
            
            if(_userManager.user){
                actions.push({
                    name: 'Copy',
                    iconcls: 'mm-context-copy',
                    handler: function(e) {
                        gwst.actions.nonExt.copyArray(e.data.array.pk);
                    }
                });				
                actions.push({
                    name: 'Replication Report',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.openArrayReplication(e.data.array.pk);
                    }
                });
            }
            
            if(_userManager.user && _userManager.user.pk == item.user){
                actions.push({
                    name: 'Edit',
                    iconcls: 'mm-context-edit',
                    handler: function(e) {
                        gwst.actions.nonExt.createOrModifyArray(e.data.array.pk);
                    }
                });
                actions.push({
                    name: 'Delete',
                    iconcls: 'mm-context-delete',
                    handler: function(e) {
                        gwst.actions.nonExt.deleteArray(e.data.array);
                    }
                });
                
                actions.push({
                    name: 'Delete Array and MPAs',
                    iconcls: 'mm-context-delete',
                    handler: function(e) {
                        gwst.actions.nonExt.deleteArrayAndMpas(e.data.array);
                    }
                });
            }
            
            actions.push({
                name: 'Array Summary',
                iconcls: 'mm-context-view',
                handler: function(e){
                    gwst.actions.openStaffSummary(e.data.array.pk);
                }
            });
            
            if(_userManager.user && _userManager.user.is_staff){
                actions.push({
                    name: 'habitat cross-tab',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.openHabitatPauloFormat(e.data.array.pk);
                    }
                });
                actions.push({
                    name: 'Attributes Spreadsheet',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.openAttributesCSV(e.data.array.pk);
                    }
                });
            }
        }else if(item.model=='user'){
            data = {user: item};
            actions = [
                {
                    name: 'About this User',
                    handler: function(e){
                        gwst.actions.nonExt.openUserInfo(e.data.user);
                    },
                    iconcls: 'mm-context-view'
                }
            ]
        
        }else{
            throw('cannot create contextmenu for item that is not an mpa or array.');
        }
        gwst.ui.ContextMenu.show({
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
            actions: actions
        }, data, target);
    });
    
    var features = [];
    var me;
        
    // Returns a hash containing all mpa and array objects so they don't have
    // to be marshalled from json twice
    this.init = function(data){
        features = [];
        // add features in store
        var hash = {'mpa': [], 'array': []}
        for(var i=0; i<data.features.length; i++){
            features.push(_renderNodeToString(data.features[i], hash, this.tree));
        }
        $(_store).bind('loaded', function(){
            $(self.tree).html(features.join(''));
        });
        for(var i=0; i<hash['mpa'].length; i++){
            delete hash['mpa'][i]['children'];
        }
        for(var i=0; i<hash['array'].length; i++){
            delete hash['array'][i]['children'];
        }
        var self = this;
        return hash;
    };
    
    this._addMpa = function(mpa){
        var opts = this._optionsForMpa(mpa);
        if(mpa.array){
            opts['parent'] = '.' + mpa.get_array().client_id;
        }else{
            opts['parent'] = '.' + mpa.folder;
        }
        var node = self.tree.tree('add', opts);
    };
    
    this._optionsForMpa = function(mpa){
        var opts = mpa.display_properties;
        opts['metadata'] = "{model: '"+mpa.model+"', pk: "+mpa.pk+"}";
        opts['name'] = mpa.name;
        opts['id'] = mpa.model + '_' + mpa.pk;
        if(_userManager.user && mpa.user == _userManager.user.pk && mpa.sharing_groups.length){
            opts['extra'] = '<a href="#" class="sharedmsg" title=""><img class="sharing" src="/site-media/images/silk/icons/star.png" width="16" height="16" /></a>';
        }
        return opts;
    };
    
    this._replaceMpa = function(mpa, old_mpa){
        var existing = this.tree.find('.'+mpa.client_id);
        if(mpa.array == old_mpa.array && existing.length){
            var html = this._renderMpaToHtml(mpa);
            existing.replaceWith(html);
        }else{
            existing.remove();
            this._addMpa(mpa);
        }
    };
    
    this._renderMpaToHtml = function(mpa){
        var options = this._optionsForMpa(mpa);
        return this.tree.tree('renderTemplate', options);
    };
    
    this._addArray = function(array){
        var opts = this._optionsForArray(array);
        if(array.public_proposal){
            opts['parent'] = '.folder_publicProposals';
        }else if(array.proposed){
            opts['parent'] = '.folder_draftProposals';
        }else{
            opts['parent'] = '.folder_user_arrays';
        }
        var node = self.tree.tree('add', opts);
    };
    
    this._replaceArray = function(array, old_array){
        if(array.proposed == old_array.proposed && array.public_proposal == old_array.public_proposal){
            var html = this._renderArrayToHtml(array);
            this.tree.find('.'+array.client_id).replaceWith(html);
        }else{
            this.tree.find('li.'+array.client_id).remove();
            this._addArray(array);
        }
    };
    
    this._renderArrayToHtml = function(array){
        var options = this._optionsForArray(array);
        return this.tree.tree('renderTemplate', options);        
    };
    
    this._optionsForArray = function(array){
        var opts = array.display_properties;
        opts['metadata'] = "{model: '"+array.model+"', pk: "+array.pk+"}";
        opts['name'] = array.name;
        opts['id'] = array.model + '_' + array.pk;
        if(_userManager.user && array.user == _userManager.user.pk && array.sharing_groups.length){
            opts['extra'] = '<a href="#" class="sharedmsg" title=""><img class="sharing" src="/site-media/images/silk/icons/star.png" width="16" height="16" /></a>';
        }
        return opts;
    };
    
    function _renderNodeToString(node, data, tree){
        var s;
        var children = false;
        if(node.display_properties.children){
            var rendered = []
            for(var i=0; i<node.display_properties.children.length; i++){
                rendered.push(_renderNodeToString(node.display_properties.children[i], data, tree));
            }
            children = rendered.join('');
        }
        var opts = node.display_properties;
        if(typeof node.pk == 'string'){
            opts['metadata'] = "{model: '"+node.model+"', pk: '"+node.pk+"'}";
        }else{
            opts['metadata'] = "{model: '"+node.model+"', pk: "+node.pk+"}";
        }
        opts['name'] = node.name;
        opts['id'] = node.model + '_' + node.pk
        // var opts = {
        //     metadata: ,
        //     name: node.name,
        //     id: node.model + '_' + node.pk,
        //     toggle: node.toggle,
        //     context: node.context,
        //     select: node.select,
        //     doubleclick: node.doubleclick,
        //     collapsible: node.collapsible,
        //     icon: node.icon,
        //     hideByDefault: node.hideByDefault
        // }
        if(node.model == 'mpa' || node.model == 'array'){
            data[node.model].push(new gwst.data.mlpaFeatures.lookup[node.model](node));
            if(_userManager.user && node.user == _userManager.user.pk && node.sharing_groups.length && !node.proposed && !node.public_proposal){
                opts['extra'] = '<a href="#" class="sharedmsg" title=""><img class="sharing" src="/site-media/images/silk/icons/star.png" width="16" height="16" /></a>';
            }
        }
        // if(node.model == 'array' || (node.model == 'folder' && !(node.collapsible === false))){
        //     opts['collapsible'] = true;
        // }else{
        //     opts['collapsible'] = false;
        // }
        if(children){
            opts['children'] = children;
        }
        s = tree.tree('renderTemplate', opts);
        return s;
    };
    
    this.disable = function(){
        
    };
    
    this.enable = function(){
        
    };
    
    this.showSpinner = function(){
        this.tree.append('<div class="gwst-text-right-spinner">Loading</div>');
    };
    
    this.hideSpinner = function(){
        this.tree.find('.gwst-text-right-spinner').remove();
    };
    
    this.toggleFeature = function(feature){
        this.tree.find('li.'+feature.model+'_'+feature.pk+' > input').click();
    };
    
    this.showTools = function(){
        this.extWindow.getBottomToolbar().show();
    },
    
    this.hideTools = function(){
        this.extWindow.getBottomToolbar().hide();
        this.extWindow.doLayout();
    },
    
    // might not be needed
    this.clear = function(){
        this.tree.html('');
    };
    
    this.getExtButton = function(){
        if(this._button){
            return this._button;
        }else{
            var self = this;
            this._button = new Ext.Button({
                text: 'Marine Protected Areas and Arrays',
                enableToggle: true,
                toggleHandler: function(button, state){
                    if(state){
                        self.extWindow.show(button.id);
                    }else{
                        self.extWindow.hide(button.id);
                    }
                }
            });
            return this._button;
        }
    };
}