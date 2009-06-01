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
