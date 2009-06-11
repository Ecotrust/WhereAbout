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
        
        var text = this.addText('Generalized Web Survey Tool');
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
        //this.loginButton = new Ext.Button(gwst.actions.login);
        //this.addItem(this.loginButton);
        
        
        //User pref dropdown
        /*var config = gwst.actions.userPrefsDropdown.initialConfig;
        //config['text'] = this.user.get('name');
        config['menu'] = [gwst.actions.logout, gwst.actions.changePassword];
        config['restore'] = true;
        this.userPrefDropDown = new Ext.SplitButton(config);
        this.userPrefDropDown.hide();
        this.addItem(this.userPrefDropDown);        
         */
        
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
        this.featuresMenu.getExtButton().toggle(true);
        var self = this;
        /*$(this.userManager).bind('change', function(e, user, olduser){
            if(user == null && olduser != null){
                self.logout()
            }else if(user != null){
                self.login(user.name, user.permission_ecotrust_data);
            }
        });*/
    },
        
    // Called by gwst.app when focus on this component is taken away
    collapseMenus: function(skip){
        for(var i=0; i<this.dropdowns.length; i++){
            if(this.dropdowns[i] != skip){
                this.dropdowns[i].toggle(false);
            }
        }
        this.featuresMenu.getExtButton().toggle(false);
    }
    
    /*setState: function(state, userName, permissionEcotrustData ){
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
    }*/
    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-widgets-maptoolbar', gwst.widgets.MapToolbar);