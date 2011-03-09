Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.GroupQuestionsPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.GroupQuestionsPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    instructions: 'unknown',
    group_name: 'unknown',
    form_url: 'unknown',
    resource_id: '',
    
    getHeaderText: function() {
        return '<h3>' + this.group_name + ' Questions</h3>';
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'basic_qs_header_html'+this.group_name, html:this.getHeaderText()},
			style: 'padding:5px',
            id: 'basic_qs_header_panel'+this.resource_id,
            autoDestroy: false,
			border: false   
        });

        this.instruction_panel = new Ext.Panel({
            id: 'basic_qs_instruciton_panel_'+this.group_name+this.resource_id,
            style: 'margin: 10px 10px 0 10px',
            html: this.instructions,
            border: false
        });

        this.question_panel = this.fill_question_panel();

        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            cont_enabled: false,
            back_handler: this.backBtnClicked.createDelegate(this)
        });

        this.add(this.header_panel);
        if (this.instructions != 'unknown'){
            this.add(this.instruction_panel);
        }
		this.add(this.question_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.GroupQuestionsPanel.superclass.onRender.apply(this, arguments); 
    },
    
    loadQuestionPanel: function(form){
        this.add(form);
        this.button_panel.enableCont();
    },
    
    fill_question_panel: function() {
        var a = new Ext.ux.DjangoForm({
            url:this.form_url, 
            callback:this.loadQuestionPanel.createDelegate(this),
            showButtons: false,
            style: 'margin-left: 16px; padding-bottom: 3px'
        });
        return a;
    },
    
    backBtnClicked: function() {
        this.fireEvent('grp-qstn-back',this);
    },
    
    contBtnClicked: function() {
        if (this.question_panel.getForm().isValid()) {
            this.question_panel.getForm().submit({
                scope:this.question_panel,
                source: 'Draw Manager'
            });
        } else {
            this.invalid()
        }
        this.fireEvent('grp-qstn-cont', this.result, this);
    },
    
    update: function(context) {
        Ext.apply(this, context);
        Ext.get('basic_qs_header_html'+this.group_name).update(this.getHeaderText());
        this.instruction_panel.applyState({
            id: 'basic_qs_instruciton_panel_'+this.group_name+this.resource_id
        });
        this.remove(this.button_panel);
        this.remove(this.question_panel);
        this.question_panel.destroy();
        this.question_panel = this.fill_question_panel();
        this.add(this.question_panel);
        this.add(this.button_panel);
        this.doLayout();
    }
	
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-group-questions-panel', gwst.widgets.GroupQuestionsPanel);