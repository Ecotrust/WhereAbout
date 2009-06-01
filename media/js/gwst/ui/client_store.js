if(typeof gwst != 'object'){
    gwst = {};
}

if(typeof gwst.ui != 'object'){
    gwst.ui = {};
}

gwst.ui.ClientStore = function(){
    /**
        ClientStore holds data for the client application in a lookup table in
        order to support fast retrieval of objects by id. This is especially 
        usefull for optimally retrieving related objects.
        
        For example, Array objects may reference many MPA objects by an array 
        of ids in attribute Array#mpa_ids. Using the store, it is easy to loop
        thru and grab the related MPAs using the ClientStore#get('mpa', id) 
        method.
        
        For ClientStore to know how to store objects, they must have the 
        following attributes:
            
            model: A unique string identifier for the type
            
            pk: A key that is unique for that object given its model
            
            dateModified(optional): In order for updates to occur via the 
            reload method, there needs to be a dateModified field. Otherwise
            the update event will be triggered for all objects whether they
            have been modified or not.
        
        ClientStore also provides many events to allow widgets to sync their 
        display with the underlying  data model. These include:
        
        loaded(event, data)     fired when the load method on ClientStore is 
                                called. This will only be fired once when 
                                initial data is loaded.
                        
        updated(event, data)    fired when any object in the store have been 
                                replaced, due to the add method being called 
                                with object(s) that already exist in the store
                        
        removed(event, data)    fired when any object(s) have been removed.

        added(event, data)      fired when object(s) are added. NOT fired
                                on load.
        
        Note there is NO reload event. Calling reload() will trigger update,
        added, and removed events.
        
        Widgets should listen to events and respond appropriately, rather than 
        relying on the functions that call ClientStore methods to also call
        updates on the UI. If your gwst.actions are ending up verbose, or
        require frequent updates due to UI changes, chances are this 
        recommendation is not being followed.
                        
    */
    
    
    // Private variables and methods
    
    /**
    Object where data is stored. Will end up like this:
    stores =  {
        mpas: [<mpa 1>, <mpa 2>, ...],
        arrays: [<array 1>, <array 2>, ...],
        users: [<user 1>, <user 2>, ...],
    } */
    var stores = {};
    
    // To make sure load() is called once and only once
    var loadCount = 0;
    
    var self = this;
    
    function addToStore(item, updated, added){
        // need to add methods for determining whether to add or update
        if(!item.model){
            throw('No model specified');
        }
        if(!item.pk){
            throw('No pk specified');
        }
        if(!stores[item.model]){
            stores[item.model] = {}
        }
        if(stores[item.model][item.pk] == undefined){
            if(added[item.model] == undefined){
                added[item.model] = [];
            }
            added[item.model].push(item);
        }else{
            var olditem = stores[item.model][item.pk];
            if(item.dateModified != undefined && item.dateModified <= olditem.dateModified){
                // Doesn't need updating, already in store and not modified
            }else{
                if(updated[item.model] == undefined){
                    updated[item.model] = [];
                }
                updated[item.model].push([item, olditem]);
            }
        }
        stores[item.model][item.pk] = item;
    }
    
    function removeFromStore(item){
        if(stores[item.model]){
            delete stores[item.model][item.pk]
        }else{
            throwNoStore(item.model);
        }    
    }
    
    function throwNoStore(model){
        var msg = 'An entry for the store has not been created for model "';
        throw(msg+model+'"');
    }
    
    function keys(){
      var keys = [];
      for(var key in stores){
          keys.push(key);
      }
      return keys;
    }
    
    // Public API   
    return {
        /**
            get(model, pk)
            Retrieves a model of a given type from the store.
        */
        get: function(model, pk){
            if(stores[model]){
                return stores[model][pk];
            }else{
                throwNoStore(model)
            }
        },
        
        /**
            remove(item[])
            Removes the given item or items from the store.
        */
        remove: function(item){
            var items = {};
            if(jQuery.isArray(item)){
                for(var i=0; i<item.length; i++){
                    if(items[item[i].model] == undefined){
                        items[item[i].model] = [];
                    }
                    items[item[i].model].push(item[i])
                    removeFromStore(item[i]);
                }
            }else{
                items[item.model] = [item];
                removeFromStore(item)
            }
            $(this).trigger('removed', [items]);
        },
        
        /**
            add(item[])
            
            Can be called with one object or an array to add to the store.
        */
        add: function(item){
            var updated = {};
            var added = {};
            if(jQuery.isArray(item)){
                for(var i=0; i<item.length; i++){
                    addToStore(item[i], updated, added);
                    item[i].store = this;
                }
            }else{
                addToStore(item, updated, added);
                item.store = this;
            }
            var callAdded = false;
            for(var key in added){
                callAdded = true;
            }
            var callUpdated = false;
            for(var key in updated){
                callUpdated = true;
            }
            if(callAdded){
                $(this).trigger('added', [added]);
            }
            if(callUpdated){
                $(this).trigger('updated', [updated]);
            }
        },
        
        clear: function(){
            stores = {};
            loadCount = 0;
        },
        
        /**
            each(model, func)
            Will loop through all objects of the given model and call the
            function for each.
        */
        each: function(model, func){
            if(stores[model]){
                for(var key in stores[model]){
                    func(stores[model][key]);
                }
            }else{
                throwNoStore(model)
            }
        },
        
        /**
            load(items[])
            Load initial data into the store. Accepts an array of all objects.
            Can only be called once!
        */
        load: function(items){
            if(loadCount != 0){
                throw('Load called more than once!');
            }else{
                loadCount = 1;
                for(var key in items){
                    var data = items[key];
                    for(var i=0; i<data.length; i++){
                        addToStore(data[i], {}, {});
                        data[i].store = this;
                    }
                }
                $(this).trigger('loaded', [items]);
            }
        },
        
        /**
            reload({model1: [...], model2: [...]})
            Will look at items for each model type in the object hash and:
            *   Add completely new items,
            *   remove items currently in the store but missing in new data
            *   update items already in the store, optionally taking into
                consideration a dateModified field
            
            Events (add, remove, update) are called after all processing, and
            only once for each type with all relavent data. (ie one add event
            with multiple objects passed)
        */
        reload: function(items){
            var added = {};
            var updated = {};
            var forRemoval = [];
            for(var key in items){
                var keep = {};
                for(var i=0; i<items[key].length; i++){
                    var item = items[key][i];
                    addToStore(item, updated, added);
                    item.store = this;
                    keep[item.pk] = true;
                }
                this.each(key, function(data){
                    if(keep[data.pk] == undefined){
                        forRemoval.push(data);
                    }
                });
            }
            this.remove(forRemoval);
            $(this).trigger('updated', [updated]);
            $(this).trigger('added', [added]);
            // strategy
            //     loop thru store adn add tbDeleted=true
            //     do adds, setting tbDeleted=false on each
            //         addToStore must return copy in store now!!
            //     loop - delete those with tbDeleted                
        },
        
        getAll: function(type){
            return stores[type];
        }
    }
};