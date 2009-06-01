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