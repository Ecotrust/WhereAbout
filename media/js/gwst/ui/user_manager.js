if(typeof Ext != 'undefined'){
    Ext.namespace('gwst', 'gwst.ui');
}else{
    // Alternative setup for testing sans-ext
    if(typeof gwst != 'object'){
        gwst = {};
    }

    if(typeof gwst.ui != 'object'){
        gwst.ui = {};
    }
}

gwst.ui.UserManager = function(){
    return {
        user: null,
        setUser: function(user, caller){
            var oldUser = this.user;
            this.user = user;
            $(this).trigger('change', [user, oldUser, this, caller]);
        }
    }
}