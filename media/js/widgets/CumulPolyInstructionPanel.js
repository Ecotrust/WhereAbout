Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.CumulPolyInstructionPanel = Ext.extend(gwst.widgets.WestPanel, {
    activity: 'None',
	
	// Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.CumulPolyInstructionPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
		this.panel_one = new Ext.Panel({		
			html: gwst.settings.poly_panel_one_instructions,
			style: 'margin: 10px 0px 0px 10px',
			border: false
        });

    	this.activity_panel = new Ext.Container({  
			autoEl: {tag:'p', id:'poly_activity_panel_html', html:this.activity},
			style: 'font-size:12px;background-color:#E6F1FF;margin:0px 10px 0px 10px;padding:3px; border: 1px solid;color:#0066FF;font-weight:bold;font-style:italic',
			border: false   
        });
    	
		this.panel_two = new Ext.Panel({		
			html: gwst.settings.poly_panel_two_instructions,
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });    	
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn1_text: 'Skip Activity',
        	btn1_handler: this.skip_handler.createDelegate(this),
        	btn1_width: 100,
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 100,
            left_margin: 40
        });
        
        this.add(this.panel_one);
        this.add(this.activity_panel);
        this.add(this.panel_two);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.CumulPolyInstructionPanel.superclass.onRender.apply(this, arguments);     
	},

    skip_handler: function() {
        this.fireEvent('skip-activity');
    },	
	
    contBtnClicked: function() {
        this.fireEvent('poly-cont',this);
    },
    
    update: function(config) {
        Ext.apply(this, config);
        Ext.get('poly_activity_panel_html').update(this.activity);
    }           
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-cumul-poly-instr-panel', gwst.widgets.CumulPolyInstructionPanel);