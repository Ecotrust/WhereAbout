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

gwst.ui.data = {
    from_json: function(json, lookup){
        var hash = {}
        for(var key in json){
            var klass = lookup[key];
            hash[key] = [];
            for(var i=0; i<json[key].length; i++){
                hash[key].push(new klass(json[key][i]));
            }
        }
        return hash;
    }
};