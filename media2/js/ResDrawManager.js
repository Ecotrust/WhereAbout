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

    init: function(){   
		this.fetchUser();
		this.fetchResources();
    },

	//Fetch user object from server
	fetchUser: function() {
        Ext.Ajax.request({
           url: gwst.settings.urls.user,
           scope: this,
           success: this.loadUser,
           failure: function(response, opts) {
              console.log('User request failed: ' + response.status);
           }
        });		
	},
	
	//Load user fetched from server
	loadUser: function(response, opts) {
		var user_obj = Ext.decode(response.responseText);
		if (user_obj) {
			this.fireEvent('res-groups-loaded', user_obj);
		}
	},
	
	//Load resource from the server
	fetchResources: function() {
        Ext.Ajax.request({
           url: gwst.settings.urls.resources,
           scope: this,
           success: this.loadResources,
           failure: function(response, opts) {
              console.log('Res group request failed: ' + response.status);
           }
        });		
	},
	
	loadResources: function(response, opts) {
		var resources_obj = Ext.decode(response.responseText);
		if (resources_obj) {
			this.fireEvent('resources-loaded', user_obj);
		}
	}
});