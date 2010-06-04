Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PointPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'point-panel',
    activity_num: null,
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
        // Call parent (required)
        gwst.widgets.PointPanel.superclass.initComponent.apply(this, arguments);
        
        this.addEvents('city-selected');
        this.addEvents('place-selected');
        this.addEvents('skip-activity');
        this.addEvents('next-activity');
    },

    onRender: function(){
        /* Displays the current activity */
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_html_point', html:this.getHeaderText()},
			style: 'padding:5px',
            id: 'intro_header_panel_point',
			border: false   
        });        

        var city_combo = new Ext.form.ComboBox({
            store: gwst.settings.cityStore,
            width: 240,
            displayField:'city',
            typeAhead: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: gwst.settings.cityComboText,
            selectOnFocus:true
        });        
        city_combo.on('select', this.citySelected, this);
        
        var rec_area_combo = new Ext.form.ComboBox({
            store: gwst.settings.placemarkStore,
            width: 240,
            displayField:'name',
            typeAhead: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: gwst.settings.placeComboText,
            selectOnFocus:true
        });        
        rec_area_combo.on('select', this.placemarkSelected, this);
        
        this.nav_panel = new Ext.Panel({
        	id:'zoom-panel',
        	border: false,
        	style: 'padding: 5px',
        	items: [{
        		html:gwst.settings.step1text,
        		border: false,
        		style:'padding: 6px 3px 3px 3px'
        	},{
        		border: false,
        		style: 'padding:5px 5px 5px 20px',
        		items: [
        		    city_combo
        		]
        	},{
            	html:'-or-',
            	border: false,
            	style: 'padding:0px 5px 0px 20px'
            },{
        		border: false,
        		style: 'padding:5px 5px 5px 20px',
        		items: [
        		    rec_area_combo
        		]
        	},{
    			html: gwst.settings.navText,
    		    border: false,
        		style:'padding: 15px 3px 3px 3px'    		     
		    },{
		    	html: gwst.settings.zoomImgText,  
		    	border: false,  
		    	width: 85,
		    	cls: 'zoom-image'
		    }]        	        
        });            
        
        this.marker_panel = new Ext.Panel({
        	id:'marker-panel',
        	border: false,
        	style: 'padding: 5px',
        	items: [{
        		html:gwst.settings.markerText,
        		border: false,
        		style:'padding: 10px 3px 3px 3px'
        	},{
        		border: false,
        		cls: 'marker-image',
        		html:gwst.settings.markerImgText        		
        	}]        	        
        });   

        this.repeat_panel = new Ext.Panel({
        	id:'repeat-panel',
        	border: false,
        	style: 'padding: 5px',
        	items: [{
        		html: gwst.settings.repeatPointText,
        		border: false,
        		style:'padding: 12px 3px 3px 3px'
        	}]        	        
        });        
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
            btn1_text: 'Skip Activity',
        	btn1_handler: this.skip_handler.createDelegate(this),
        	btn1_width: 100,
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.next_act_handler.createDelegate(this),
            btn2_width: 100,
            left_margin: 40
        });
        
        this.add(this.header_panel);
        this.add(this.nav_panel);
        this.add(this.marker_panel);
        this.add(this.repeat_panel);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.PointPanel.superclass.onRender.apply(this, arguments);     
	},

	citySelected: function(combo, rec, index) {
		this.fireEvent('city-selected', rec);
	},
	
	placemarkSelected: function(combo, rec, index) {
		this.fireEvent('place-selected', rec);
	},
	
    skip_handler: function() {
        this.fireEvent('skip-activity', 'foo');
    },
    
    next_act_handler: function() {
    	this.fireEvent('next-activity', 'bar');
    },
    
    update: function(config) {
        Ext.apply(this, config);
        Ext.get('header_html_point').update(this.getHeaderText());
    },
    
    getHeaderText: function() {
    	return 'Activity #'+this.activity_num+': <span class="activity-text">'+this.activity+'</span>';
    }    
    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-point-panel', gwst.widgets.PointPanel);