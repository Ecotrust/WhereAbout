Ext.namespace('gwst');

/*
gwst.ResDrawManager- manages resource drawing process including user information, user groups,
shapes and pennies.  Extends Ext.Observable providing event handling
*/
gwst.ResDrawManager = Ext.extend(Ext.util.Observable, {
    //The current user object
    user:null,

    constructor: function(){
        gwst.ResDrawManager.superclass.constructor.call(this);
        this.addEvents('user-loaded');
        this.addEvents('resources-loaded');
        this.addEvents('res-shapes-loaded');
    },

    /* Initialize draw manager, fetching survey data from server */
    init: function(){   
        this.fetchUser();
        this.fetchResources();
    },

    /* Fetch user object from server */
    fetchUser: function() {
        Ext.Ajax.request({
           url: gwst.settings.urls.user,
           scope: this,
           success: this.intUser,
           failure: function(response, opts) {
              console.log('User request failed: ' + response.status);
           }
        });		
    },
    
    /* Process user fetched from server */
    initUser: function(response, opts) {
        var user_obj = Ext.decode(response.responseText);
        if (user_obj) {
            this.fireEvent('res-groups-loaded', user_obj);
        }
    },
    
    /* Fetch resources from the server */
    fetchResources: function() {
        Ext.Ajax.request({
           url: gwst.settings.urls.group_resources+gwst.settings.survey_group_id,
           scope: this,
           success: this.initResources,
           failure: function(response, opts) {
              console.log('Res group request failed: ' + response.status);
           }
        });		
    },
    
    /* Process resources fetched from server */
    initResources: function(response, opts) {
        var resources_obj = Ext.decode(response.responseText);
        if (resources_obj) {
            this.fireEvent('resources-loaded', resources_obj);
        }
    },

    /* Load the initial splash screen for the user */
    startSplash: function() {
    
    },    

    /* Load the resource group selection panel */
    startResGrpSelect: function() {
        x = 
        {
            xtype: 'gwst-select-res-grp-panel',
            region: "west",
            res_group_name: 'Species',
            split: true
        };
    },
    
    /* Process the resource group selection */
    finishResGrpSelect: function() {
    
    },
    
    startDrawInstruct: function() {
    
    },
    
    finishDrawInstruct: function() {
    
    },
    
    startDraw: function() {
    
    },
    
    finishDraw: function() {
    
    },
    
    startPennyAlloc: function() {
    
    },
    
    finishPennyAlloc: function() {
    
    },
    
    finishDrawingProcess: function() {
    
    }
});