Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.GroupQuestionsPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.GroupQuestionsPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    // form: 'unknown',
    group_name: 'unknown',
    group_num: 'unknown',
    form_url: 'unknown',

    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'basic_qs_header_panel',
            // html: '<img src="/media/img/9_ActivityQuestions2_header.png">',
            html: '<h3>' + this.group_name + '</h3>',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        });

        this.question_panel = this.fill_question_panel();

        this.button_panel = new gwst.widgets.BackContButtons ({
            cont_handler: this.contBtnClicked.createDelegate(this),
            back_handler: this.backBtnClicked.createDelegate(this)
        });

        this.add(this.header_panel);
		this.add(this.question_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.GroupQuestionsPanel.superclass.onRender.apply(this, arguments); 
    },
    
    loadQuestionPanel: function(form){
        this.add(form);
    },
    
    fill_question_panel: function(form) {
        var a = new Ext.ux.DjangoForm({
            url:this.form_url, 
            callback:this.loadQuestionPanel.createDelegate(this),
            showButtons: false
        });
        return a;
    },
    
    backBtnClicked: function() {
        this.fireEvent('grp-qstn-back',this);
    },
    
    contBtnClicked: function() {
        // this.items = this.question_panel.form.items.items;
        // this.result = {};
        // for(this.i = 0; this.i < this.items.length; this.i++) {
            // this.result[this.items[i].name] = this.items[i].value;
        // }
        
        if (this.question_panel.getForm().isValid()) {
            // this.params = {};
            // for(this.i = 0; this.i < this.question_panel.form.items.length; this.i++) {
                // this.question = this.question_panel.form.items.itemAt(this.i);
                // if (this.question.xtype == "checkboxgroup") {
                    // this.ans_list = []
                    // for (this.j = 0; this.j < this.question.items.length; this.j++) {
                        // if (this.question.items.itemAt(this.j).checked) {
                            // this.ans_list.push(this.question.items.itemAt(this.j).name);
                        // }
                    // }
                    // this.params[this.question.name] = this.ans_list;
                // } else {
                    // this.params[this.question.name] = this.question.value;
                // }
            // }
        
            this.question_panel.getForm().submit({
                scope:this.question_panel,
                source: 'Draw Manager'
            });
        } else {
            this.invalid()
        }
        
        this.fireEvent('grp-qstn-cont', this.result, this);
    }
	
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-group-questions-panel', gwst.widgets.GroupQuestionsPanel);