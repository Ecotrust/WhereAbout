if(window.gwst == undefined){
    gwst = {};
}

if(gwst.data == undefined){
    gwst.data = {};
}

gwst.data.extend = function(self, data, required){
    jQuery.extend(self, data);
    if(self['display_properties']){
        delete self['display_properties']['child_nodes'];
    }
    for(var i=0; i<required.length; i++){
        if(data[required[i]] == undefined){
            throw(required[i] + ' was undefined');
        }
    }
};

gwst.data.mlpaFeatures = {
    MPA: function(data){
        gwst.data.extend(this, data, ['model', 'pk', 'user']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    Array: function(data){
        gwst.data.extend(this, data, ['model', 'pk', 'mpa_ids', 'user']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    User: function(data){
        gwst.data.extend(this, data, ['model', 'pk', 'name']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    Group: function(data){
        gwst.data.extend(this, data, ['model', 'pk', 'users']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    Designation: function(data){
        gwst.data.extend(this, data, ['model', 'pk']);
        this.client_id = this.model + '_' + this.pk;
        return this;
    },
    
    parser: new OpenLayers.Format.GeoJSON({})
};

jQuery.extend(gwst.data.mlpaFeatures.MPA.prototype, {
    
    editUrl: function(){
        return '/gwst/mpa/edit/' + this.pk;
    },
    
    get_array: function(){
        if(!this.array){
            return null;
        }else{
            if(this.store){
                return this.store.get('array', this.array);
            }else{
                throw('Cannot find Array, this MPA does not belong to a store.');
            }
        }
    },
    
    callWithFeature: function(func){
        if(!this._listeners){
            this._listeners = [];
        }
        this._listeners.push(func);
        if(this.feature){
            this._featureLoadedCallback();
        }else{
            if(this._loadingFeatures != true){
                this._requestFeature();
            }
        }
    },
    
    _requestFeature: function(){
        return this.array && this.store.get('array', this.array) ? this.get_array().loadFeatures() : this.loadFeature()
    },
    
    loadFeature: function(){
        var mpa = this;
        mpa._loadingFeatures = true;
        jQuery.ajax({
            // dataType: 'json',
            error: function (XMLHttpRequest, textStatus, errorThrown){
                mpa._loadingFeatures = false;
                mpa._listeners = [];
                gwst.ui.error.show({errorText: 'Could not load MPA geometry. Please try turning the MPA on/off again. If the error persists, please contact <a href="mailto:help@lists.gwst.org?subject=mpa_geometry_broken">email help</a>'});
            },
            success: function(data, textStatus){
                mpa._loadingFeatures = false;
                var parser = gwst.data.mlpaFeatures.parser;
                mpa.feature = parser.read(data, 'Feature');
                mpa._featureLoadedCallback();
            },
            type: 'GET',
            url: '/geojson/shape/'+this.pk
        });
    },
    
    _featureLoadedCallback: function(){
        this.feature.attributes.mpa = this;
        if(this._listeners){
            while(this._listeners.length){
                var callback = this._listeners.shift();
                callback(this, this.feature);
            }        
        }
    },
    
    setFeature: function(f){
        this.feature = f;
        this._featureLoadedCallback();
    },
    
    get_user: function(){
        if(this.store){
            return this.store.get('user', this.user);
        }else{
            throw('Cannot find User, this MPA does not belong to a store.');
        }
    },
    
    get_sharing_groups: function(){
        if(this.sharing_groups == undefined){
            return [];
        }
        if(this.store){
            var sharing_groups = [];
            for(var i=0; i<this.sharing_groups.length;i++){
                var sg = this.store.get('group', this.sharing_groups[i]);
                if(sg){
                    sharing_groups.push(sg);
                }
            }
            return sharing_groups;
        }else{
            throw('Cannot find sharing_groups, this MPA does not belong to a store.');
        }
    },
    
    get_designation: function(){
        if(!this.store){
            throw('Cannot find Designation. This MPA does not belong to a store.');
        }else{
            if(this.designation){
                return this.store.get('designation', this.designation);
            }else{
                return null;
            }
        }
    },
    
    // returns a new mpa
    saveGeometryChanges: function(geometry, geometry_clipped, opts){
        $.ajax({
            data: {geometry: geometry, geometry_clipped: geometry_clipped},
            url: '/gwst/mpa/editgeom/'+this.pk,
            success: function(data, textStatus){
                var mpa = gwst.data.mlpaFeatures.mpa_from_geojson(data);
                if(typeof opts['success'] == 'function'){
                    opts['success'](mpa);  
                }
            },
            error: opts['error'],
            dataType: 'json',
            type: 'POST' 
        });
    }
});

gwst.data.mlpaFeatures.mpa_from_geojson = function(data){
    var mpa = new gwst.data.mlpaFeatures.MPA(data.properties);
    var parser = gwst.data.mlpaFeatures.parser;
    mpa.setFeature(parser.read(data, 'Feature'));
    return mpa;
}

gwst.data.mlpaFeatures.array_and_mpas_from_geojson = function(data){
    var array = new gwst.data.mlpaFeatures.Array(data['properties']);
    array.feature = true;
    var mpas = [];
    var features = gwst.data.mlpaFeatures.parser.read(data);
    for(var i=0; i<features.length; i++){
        var mpa = new gwst.data.mlpaFeatures.MPA(features[i].attributes);
        mpa.setFeature(features[i]);
        mpas.push(mpa);
    }
    return [array, mpas];
}

jQuery.extend(gwst.data.mlpaFeatures.Array.prototype, {
    
    get_user: function(){
        if(this.store){
            return this.store.get('user', this.user);
        }else{
            throw('Cannot find User, this Array does not belong to a store.');
        }
    },
    
    get_sharing_groups: function(){
        if(this.sharing_groups == undefined){
            return [];
        }
        if(this.store){
            var sharing_groups = [];
            for(var i=0; i<this.sharing_groups.length;i++){
                var sg = this.store.get('group', this.sharing_groups[i]);
                if(sg){
                    sharing_groups.push(sg);
                }
            }
            return sharing_groups;
        }else{
            throw('Cannot find sharing_groups, this Array does not belong to a store.');
        }
    },
    
    get_mpas: function(){
        var pk = this.pk;
        if(this.store){
            var mpas = [];
            this.store.each('mpa', function(mpa){
                if(mpa.array == pk){
                    mpas.push(mpa);
                }
            });
            return mpas;
        }else{
            throw('Cannot find MPAs, this Array does not belong to a store.');
        }
    },
    
    callWithFeature: function(func){
        if(!this._listeners){
            this._listeners = [];
        }
        this._listeners.push(func);
        if(this.feature){
            this._featureLoadedCallback();
        }else{
            if(this._loadingFeatures != true){
                this.loadFeatures();
            }
        }
    },
    
    loadFeatures: function(){
        if(this._loadingFeatures != true){    
            this._loadingFeatures = true;
            var array = this;
            jQuery.ajax({
                // dataType: 'json',
                error: function (XMLHttpRequest, textStatus, errorThrown){
                    array._loadingFeatures = false;
                    array._listeners = [];
                    gwst.ui.error.show({errorText: 'Could not load Array FeatureCollection. Please try turning the Array on/off again. If the error persists, please contact <a href="mailto:help@lists.gwst.org?subject=mpa_geometry_broken">email help</a>'});
                },
                success: function(data, textStatus){
                    var parser = gwst.data.mlpaFeatures.parser;
                    array.feature = true;
                    var features = parser.read(data);
                    array.each_mpa(function(mpa){
                        for(var i=0; i<features.length;i++){
                            if(features[i].fid == 'mpa_' + mpa.pk){
                                var f= features[i];
                            }
                        }
                        if(f){
                            mpa.setFeature(f);
                        }else{
                            alert('could not find mpa', f.fid);
                        }
                    });
                    array._loadingFeatures = false;
                    array._featureLoadedCallback();
                },
                type: 'GET',
                url: '/gwst/geojson/array/'+this.pk
            });
        }
    },
    
    _featureLoadedCallback: function(){
        if(this._listeners){
            while(this._listeners.length){
                var callback = this._listeners.shift();
                callback(this);
            }
        }
    },
    
    each_mpa: function(func){
        var pk = this.pk;
        if(this.store){
            this.store.each('mpa', function(mpa){
                if(mpa.array == pk){
                    func(mpa);
                }
            });
        }else{
            throw('Cannot find MPAs, this Array does not belong to a store.');
        }
    },
    
    get_users: function(){
        if(!this.store){
            throw('Object not in store.');
        }else{
            var users = [];
            for(var i=0; i<this.users.length;i++){
                users.push(this.store.get('user', this.users[i]));
            }
            return users;
        }
    }
});


gwst.data.mlpaFeatures.lookup = {
    'user': gwst.data.mlpaFeatures.User,
    'group': gwst.data.mlpaFeatures.Group,
    'mpa': gwst.data.mlpaFeatures.MPA,
    'array': gwst.data.mlpaFeatures.Array,
    'designation': gwst.data.mlpaFeatures.Designation   
};
