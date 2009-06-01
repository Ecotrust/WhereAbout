Ext.namespace('gwst', 'gwst.data');

gwst.data.MLPARecordCache = function(){
   var _instance = null;
   return {
      getInstance : function(){
         if(_instance === null){
            _instance = {
                
                lookups: {
                },
                                
                add: function(record){
                    if(record instanceof Array){
                        batchAdd(record);
                    }else{
                        if(!record.get('pk')){
                            // console.error('this record has no pk assigned. If it has been created on the client-side it needs to be saved to the server to get a proper primary key before it can be saved.');
                        }
                        var lookup = lookupForRecord(record);
                        if(lookup){
                            lookup[record.get('pk')] = record;
                        }                    
                    }
                },
                
                remove: function(record){
                    var lookup = lookupForRecord(record);
                    delete lookup[record.get('pk')]
                },
                
                batchAdd: function(records){
                    for(var i=0; i<records.length; i++){
                        this.add(records[i]);
                    }
                },
                
                get: function(type, pk){
                    var lookup = lookups[type];
                    if(!lookup){
                        throw('lookup for type '+type+' does not exist!');
                    }else{
                        var record = lookup[pk];
                        if(record){
                            return record;
                        }else{
                            throw('record could not be found. type: '+
                                type + ', pk: ' + pk);
                        }
                    }
                    
                },
                
                each: function(type, callback){
                    for(var key in lookups[type]){
                        callback.call(lookups[type][key]);
                    }
                },
                
                //private
                
                lookupForRecord: function(record){
                    var lookup = false;
                    for(var type in lookups){
                        if(record instanceof type){
                            lookup = lookups[type];
                        }
                    }
                    if(lookup){
                        return lookup;
                    }else{
                        throw('Record "' + record.get('title') + 
                            '" is not a supported data type for caching');
                    }
                }
                
            };
            // Must be defined down here as constructors don't work as keys in
            // the object-literal notation.
            _instance.lookups[gwst.data.MPA] = {};
            _instance.lookups[gwst.data.Array] = {};
         }
         return _instance;
      }
   };
}();