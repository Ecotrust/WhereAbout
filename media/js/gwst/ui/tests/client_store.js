module("ClientStore");

// Test data
var item1 = {
    model: 'item',
    pk: 1,
    name: 'Item 1'
}
var item5 = {
    model: 'item',
    pk: 5,
    name: 'Item 5'
}
var thing1 = {
    model: 'thing',
    pk: 1,
    name: 'Thing 1'
}
var thing2 = {
    model: 'thing',
    pk: 2,
    name: 'Thing 2'
}

test("initialize", function() {
    var store = new ClientStore();
    ok( store, "initialized" );
});

test("loading", function(){
    var store = new ClientStore();
    var loadedItems = []
    $(store).bind('loaded', function(e, items){
        loadedItems = items;
    });
    store.load({
        item: [item1, item5],
        thing: [thing1]
    });
    // Check that event handler was triggered with appropriate arguments
    equals(loadedItems['item'].length, 2);
    equals(store.get('item', 1), item1);
    equals(store.get('item', 5), item5);
    
    // Returns undefined where an object does not exist in the store
    equals(store.get('thing', 4), undefined);
    
    // Make sure the store can tell the difference between items
    equals(store.get('thing', 1), thing1);
    var exception = false;
    try{
        store.load({thing: [thing2]});
    }catch(error){
        exception = true;
    }
    ok(exception, "Calling load twice triggers exception");
});

test("adding and removing", function(){
    var store = new ClientStore();
    store.load({thing:[thing2]});
    equals(store.get('thing', 2), thing2);
    
    // Add an object to the store
    var added = false;
    $(store).bind('added', function(event, items){
        added = items;
    });
    store.add(thing1);
    ok(added, 'Should trigger add event.');
    $(store).unbind('added');
    equals(store.get('thing', 1), thing1);
    
    // Remove same
    var removed = false;
    $(store).bind('removed', function(event, items){
        removed = items;
    });
    store.remove(thing1);
    ok(removed, 'Should trigger removed event');
    $(store).unbind('removed');
    equals(store.get('thing', 1), undefined);
    
    var failed = false;
    try{
        store.add({pk: 5});
    }catch(error){
        failed = true;
    }
    ok(failed, "Should throw exception if an object without a model is passed")
    
    var failed = false;
    try{
        store.add({model: "yak"});
    }catch(error){
        failed = true;
    }
    ok(failed, "Should throw exception if an object without a pk is passed")
    
});

test("adding an array of items", function(){
    var store = new ClientStore();
    store.load([]);
    var addedItems = [];
    $(store).bind('added', function(event, items){
        addedItems = items;
    });
    store.add([item1, item5, thing1]);
    equals(addedItems['item'].length, 2);
    equals(addedItems['thing'].length, 1);
    equals(addedItems['thing'][0], thing1);
    ok(addedItems['item'][0] == item1 || addedItems['item'][0] == item5, 'correct items included in event');
    ok(addedItems['item'][1] == item1 || addedItems['item'][1] == item5, 'correct items included in event');
    equals(store.get('thing', 1), thing1);
});

test("removing an array of items", function(){
    var store = new ClientStore();
    store.load({item: [item1, item5], thing: [thing1]});
    var removedItems = [];
    $(store).bind('removed', function(event, removed){
        removedItems = removed;
    });
    store.remove([item1, item5]);
    equals(removedItems['item'].length, 2);
    ok(removedItems['item'][0] == item1 || removedItems['item'][0] == item5, 'Event handler passed removed items');
    ok(removedItems['item'][1] == item1 || removedItems['item'][1] == item5, 'Event handler passed removed items');
    equals(store.get('thing', 1), thing1);
});

test("updating items", function(){
    var store = new ClientStore();
    store.load({item: [item5]});
    var updated = [];
    var added = [];
    $(store).bind('updated', function(event, items){
       updated = items; 
    });
    $(store).bind('added', function(event, items){
       added = items; 
    });

    store.add([item5, thing1]);
    equals(added['thing'].length, 1);
    ok(added['thing'][0] == thing1, 'Should have added thing1 and updated item5');
    
    equals(updated['item'].length, 1);
    ok(updated['item'][0] == item5, 'Should have added thing1 and updated item5');
    
    equals(store.get('thing', 1), thing1);
    equals(store.get('item', 5), item5);
});

test("reloading", function(){
    var store = new ClientStore();
    store.load({item: [item1, item5], thing: [thing1]});
    equals(store.get('thing', 1), thing1);
    
    var updated = [];
    var added = [];
    var removed = [];
    $(store).bind('updated', function(event, items){
       updated = items; 
    });
    $(store).bind('added', function(event, items){
       added = items; 
    });
    $(store).bind('removed', function(event, items){
       removed = items; 
    });
    
    store.reload({
        'item': [item1],
        'thing': [thing1, thing2]
    });
    
    equals(updated['item'].length, 1);
    equals(updated['item'][0], item1);
    equals(updated['thing'].length, 1);
    equals(updated['thing'][0], thing1);
    
    equals(added['thing'].length, 1);
    equals(added['thing'][0], thing2);
    equals(added['item'], undefined);
    
    equals(removed['thing'], undefined);
    equals(removed['item'][0], item5);
});

test("respect dateModified attribute if available", function(){
    var date = new Date();
    var dateEnabled1 = {
        pk: 1,
        model: 'dateEnabled',
        dateModified: date
    }
    var store = new ClientStore();
    store.load({item: [item1, item5], thing: [thing1], dateEnabled: [dateEnabled1]});
    var updated = [];
    $(store).bind('updated', function(event, items){
       updated = items; 
    });

    var dateUnchanged = {
        pk: 1,
        model: 'dateEnabled',
        dateModified: date
    }
    store.add(dateEnabled1);
    equals(updated.length, 0);
    store.add(dateUnchanged);
    equals(updated.length, 0);
    var newdate = new Date();
    newdate.setDate(date.getDate()+1);
    dateChanged = {
        pk: 1,
        model: 'dateEnabled',
        dateModified: newdate
    };
    store.add(dateChanged);
    equals(updated['dateEnabled'].length, 1);
    updated = [];
    store.add(dateUnchanged);
    equals(updated['dateEnabled'], undefined);
});