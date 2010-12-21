Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.GroupQuestionsPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.GroupQuestionsPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    form: 'unknown',
    group_name: 'unknown',

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
        
        this.question_panel = new Ext.form.FormPanel(this.form);
        // this.question_panel = new Ext.form.FormPanel({
            // "items":[
                // {
                    // "checked":false,
                    // "xtype":"checkbox",
                    // "value":"",
                    // "allowBlank":true,
                    // "fieldLabel":'I was aware of the MPA closures',
                    // "name":"question_89"
                // },{
                    // "displayField":"display",
                    // "fieldLabel":"How you were informed about the closures",
                    // "xtype":"checkboxgroup",
                    // "columns": 1,
                    // "items":[
                        // {"boxLabel":"News source","name":"1003e611-03c0-11e0-9ef0-0016760580f0"},
                        // {"boxLabel":"Television","name":"1694ce91-03c0-11e0-bedd-0016760580f0"},
                        // {"boxLabel":"Newsletter/magazine","name":"1e299280-03c0-11e0-b8cf-0016760580f0" },
                        // {"boxLabel":"Online social site","name":"28496e21-03c0-11e0-850b-0016760580f0"},
                        // {"boxLabel":"Dive or fishing organization","name":"34117b80-03c0-11e0-8636-0016760580f0"},
                        // {"boxLabel":"Word of mouth/friends", "name":"4aa757c0-03c0-11e0-aab9-0016760580f0"},
                        // {"boxLabel":"Signage","name":"5080b00f-03c0-11e0-9b66-0016760580f0"},
                        // {"boxLabel":"Department of Fish and Game","name":"576759b0-03c0-11e0-892e-0016760580f0"},
                        // {"boxLabel":"Information booth/kiosk","name":"61eb4e4f-03c0-11e0-a2b1-0016760580f0"},
                        // {"boxLabel":"Local store","name":"698e6a1e-03c0-11e0-9493-0016760580f0"},
                        // {"boxLabel":"Campground","name":"763b804f-03c0-11e0-9b06-0016760580f0"},
                        // {"boxLabel":"Other","name":"7b644d51-03c0-11e0-8b95-0016760580f0"}
                    // ],
                    // "triggerAction":"all",
                    // "blankText":"question_90 :",
                    // "hiddenName":"question_90",
                    // "allowBlank":true,
                    // "value":"",
                    // "valueField":"id",
                    // "mode":"local",
                    // "store":new Ext.data.SimpleStore({
                        // fields: ['id','display'],
                        // data : [
                            // ["1003e611-03c0-11e0-9ef0-0016760580f0","News source"],
                            // ["1694ce91-03c0-11e0-bedd-0016760580f0","Television"],
                            // ["1e299280-03c0-11e0-b8cf-0016760580f0","Newsletter/magazine"],
                            // ["28496e21-03c0-11e0-850b-0016760580f0","Online social site"],
                            // ["34117b80-03c0-11e0-8636-0016760580f0","Dive or fishing organization"],
                            // ["4aa757c0-03c0-11e0-aab9-0016760580f0","Word of mouth/friends"],
                            // ["5080b00f-03c0-11e0-9b66-0016760580f0","Signage"],
                            // ["576759b0-03c0-11e0-892e-0016760580f0","Department of Fish and Game"],
                            // ["61eb4e4f-03c0-11e0-a2b1-0016760580f0","Information booth/kiosk"],
                            // ["698e6a1e-03c0-11e0-9493-0016760580f0","Local store"],
                            // ["763b804f-03c0-11e0-9b06-0016760580f0","Campground"],
                            // ["7b644d51-03c0-11e0-8b95-0016760580f0","Other"]
                        // ] 
                    // }),
                    // "name":"question_90"
                // },{
                    // "checked":false,
                    // "xtype":"checkbox",
                    // "value":"",
                    // "allowBlank":true,
                    // "fieldLabel":"I am aware of specific MPAs",
                    // "name":"question_91"
                // },{
                    // "displayField":"display",
                    // "fieldLabel":"I am aware of the following MPAs",
                    // "boxLabel":"I am aware of the following MPAs",
                    // "columns": 1,
                    // "xtype":"checkboxgroup",
                    // "items":[
                        // {"boxLabel":"Montara State Marine Reserve","name":"08db55ae-02f5-11e0-a724-0016760580f0"},
                        // {"boxLabel":"Pillar Point State Marine Conservation Area","name":"0ed136ae-02f5-11e0-b38a-0016760580f0"},
                        // {"boxLabel":"North Farallon Islands State Marine Reserve","name":"17e0dacf-02f5-11e0-a471-0016760580f0"},
                        // {"boxLabel":"North Farallon Islands Special Closure","name":"224a90b0-02f5-11e0-ac67-0016760580f0"},
                        // {"boxLabel":"Point Arena State Marine Reserve","name":"2357b061-02f4-11e0-8de6-0016760580f0"},
                        // {"boxLabel":"Southeast Farallon Island State Marine Reserve","name":"2d327740-02f5-11e0-98dc-0016760580f0"},
                        // {"boxLabel":"Point Arena State Marine Conservation Area","name":"2d39718f-02f4-11e0-9eef-0016760580f0"},
                        // {"boxLabel":"Southeast Farallon Island Special Closure","name":"32e338ee-02f5-11e0-8406-0016760580f0"},
                        // {"boxLabel":"Sea Lion Cove State Marine Conservation Area","name":"3644a8e1-02f4-11e0-8ea5-0016760580f0"},
                        // {"boxLabel":"Southeast Farallon island State Marine Conservation Area","name":"38d45f00-02f5-11e0-8514-0016760580f0"},
                        // {"boxLabel":"Saunders Reef State Marine Conservation Area","name":"3f24ffa1-02f4-11e0-8e3c-0016760580f0"},
                        // {"boxLabel":"Del Mar Landing State Marine Reserve","name":"47fe035e-02f4-11e0-a18b-0016760580f0"},
                        // {"boxLabel":"Stewarts Point State Marine Conservation Area","name":"52192411-02f4-11e0-99e6-0016760580f0"},
                        // {"boxLabel":"Stewarts Point State Marine Reserve","name":"5c40048f-02f4-11e0-9294-0016760580f0"},
                        // {"boxLabel":"Salt Point State Marine Conservation Area","name":"61b543de-02f4-11e0-9663-0016760580f0"},
                        // {"boxLabel":"Gerstle Cove State Marine Reserve","name":"68606b1e-02f4-11e0-989a-0016760580f0"},
                        // {"boxLabel":"Russian River State Marine Recreational Management Area","name":"701401b0-02f4-11e0-8676-0016760580f0"},
                        // {"boxLabel":"Russian River State Marine Conservation Area","name":"76ba46f0-02f4-11e0-9764-0016760580f0"},
                        // {"boxLabel":"Bodega Head State Marine Reserve","name":"7e53c5d1-02f4-11e0-a40f-0016760580f0"},
                        // {"boxLabel":"Bodega Head State Marine Conservation Area","name":"8feb4070-02f4-11e0-af72-0016760580f0"},
                        // {"boxLabel":"Estero Americano State Marine Recreational Management Area","name":"97bdf7c0-02f4-11e0-a7bf-0016760580f0"},
                        // {"boxLabel":"Estero de San Antonio State Marine Recreational Management Area","name":"9f360bee-02f4-11e0-8843-0016760580f0"},
                        // {"boxLabel":"Point Reyes State Marine Reserve","name":"a6289c70-02f4-11e0-91ab-0016760580f0"},
                        // {"boxLabel":"Point Reyes State Marine Conservation Area","name":"b4362d00-02f4-11e0-8bd8-0016760580f0"},
                        // {"boxLabel":"Point Reyes Headlands Special Closure","name":"ba785940-02f4-11e0-8f0a-0016760580f0"},
                        // {"boxLabel":"Estero de Limantour State Marine Reserve","name":"c0078930-02f4-11e0-91ef-0016760580f0"},
                        // {"boxLabel":"Drake's Estero State Marine Conservation Area","name":"d393cef0-02f4-11e0-8eb1-0016760580f0"},
                        // {"boxLabel":"Point Resistance Rock Special Closure","name":"db9892c0-02f4-11e0-9dd5-0016760580f0"},
                        // {"boxLabel":"Double Point/Stormy Stack Special Closure","name":"e6877e30-02f4-11e0-acf4-0016760580f0"},
                        // {"boxLabel":"Duxbury Reef State Marine Conservation Area","name":"ede7c4a1-02f4-11e0-bcec-0016760580f0"},
                        // {"boxLabel":"Egg (Devil's Slide) Rock to Devil's Slide Special Closure","name":"fe1c05c0-02f4-11e0-b00e-0016760580f0"}
                    // ],
                    // "triggerAction":"all",
                    // "blankText":"question_92 :",
                    // "hiddenName":"question_92",
                    // "allowBlank":true,
                    // "value":"",
                    // "valueField":"id",
                    // "mode":"local",
                    // "store":new Ext.data.SimpleStore({
                        // fields: ['id','display'], 
                        // data : [
                            // ["08db55ae-02f5-11e0-a724-0016760580f0","Montara State Marine Reserve"],
                            // ["0ed136ae-02f5-11e0-b38a-0016760580f0","Pillar Point State Marine Conservation Area"],
                            // ["17e0dacf-02f5-11e0-a471-0016760580f0","North Farallon Islands State Marine Reserve"],
                            // ["224a90b0-02f5-11e0-ac67-0016760580f0","North Farallon Islands Special Closure"],
                            // ["2357b061-02f4-11e0-8de6-0016760580f0","Point Arena State Marine Reserve"],
                            // ["2d327740-02f5-11e0-98dc-0016760580f0","Southeast Farallon Island State Marine Reserve"],
                            // ["2d39718f-02f4-11e0-9eef-0016760580f0","Point Arena State Marine Conservation Area"],
                            // ["32e338ee-02f5-11e0-8406-0016760580f0","Southeast Farallon Island Special Closure"],
                            // ["3644a8e1-02f4-11e0-8ea5-0016760580f0","Sea Lion Cove State Marine Conservation Area"],
                            // ["38d45f00-02f5-11e0-8514-0016760580f0","Southeast Farallon island State Marine Conservation Area"],
                            // ["3f24ffa1-02f4-11e0-8e3c-0016760580f0","Saunders Reef State Marine Conservation Area"],
                            // ["47fe035e-02f4-11e0-a18b-0016760580f0","Del Mar Landing State Marine Reserve"],
                            // ["52192411-02f4-11e0-99e6-0016760580f0","Stewarts Point State Marine Conservation Area"],
                            // ["5c40048f-02f4-11e0-9294-0016760580f0","Stewarts Point State Marine Reserve"],
                            // ["61b543de-02f4-11e0-9663-0016760580f0","Salt Point State Marine Conservation Area"],
                            // ["68606b1e-02f4-11e0-989a-0016760580f0","Gerstle Cove State Marine Reserve"],
                            // ["701401b0-02f4-11e0-8676-0016760580f0","Russian River State Marine Recreational Management Area"],
                            // ["76ba46f0-02f4-11e0-9764-0016760580f0","Russian River State Marine Conservation Area"],
                            // ["7e53c5d1-02f4-11e0-a40f-0016760580f0","Bodega Head State Marine Reserve"],
                            // ["8feb4070-02f4-11e0-af72-0016760580f0","Bodega Head State Marine Conservation Area"],
                            // ["97bdf7c0-02f4-11e0-a7bf-0016760580f0","Estero Americano State Marine Recreational Management Area"],
                            // ["9f360bee-02f4-11e0-8843-0016760580f0","Estero de San Antonio State Marine Recreational Management Area"],
                            // ["a6289c70-02f4-11e0-91ab-0016760580f0","Point Reyes State Marine Reserve"],
                            // ["b4362d00-02f4-11e0-8bd8-0016760580f0","Point Reyes State Marine Conservation Area"],
                            // ["ba785940-02f4-11e0-8f0a-0016760580f0","Point Reyes Headlands Special Closure"],
                            // ["c0078930-02f4-11e0-91ef-0016760580f0","Estero de Limantour State Marine Reserve"],
                            // ["d393cef0-02f4-11e0-8eb1-0016760580f0","Drake's Estero State Marine Conservation Area"],
                            // ["db9892c0-02f4-11e0-9dd5-0016760580f0","Point Resistance Rock Special Closure"],
                            // ["e6877e30-02f4-11e0-acf4-0016760580f0","Double Point/Stormy Stack Special Closure"],
                            // ["ede7c4a1-02f4-11e0-bcec-0016760580f0","Duxbury Reef State Marine Conservation Area"],
                            // ["fe1c05c0-02f4-11e0-b00e-0016760580f0","Egg (Devil's Slide) Rock to Devil's Slide Special Closure"]
                        // ] 
                    // }),
                    // "name":"question_92"
                // }
            // ]
        // });
        
        this.add(this.header_panel);
		this.add(this.question_panel);
        
        // Call parent (required)
        gwst.widgets.GroupQuestionsPanel.superclass.onRender.apply(this, arguments); 
    }
	
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-group-questions-panel', gwst.widgets.GroupQuestionsPanel);