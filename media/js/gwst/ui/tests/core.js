module("core");


module("core.ContextMenu");
test("show", function(){
    var threw = false;
    try{
        gwst.ui.ContextMenu.show();
    }catch(err){
        threw = true;
    }
    ok(threw, 'Should throw error when show is called without options');
    
    var handlerData;
    gwst.ui.ContextMenu.show({
        x: 10,
        y: 20,
        actions: [
            {name: 'test', handler: function(e){handlerData = e.data}, iconcls: 'mm-context-edit'},
            {name: 'test2', handler: function(e){handlerData = true}}
        ]
    }, {mydata: true});
    equals($('.gwst-contextmenu').length, 1, 'Context menu shows up');
    var c = $('.gwst-contextmenu')[0];
    equals($(c).css('top'), '20px', 'Correct Vertical Position');
    equals($(c).css('left'), '10px', 'Correct Horizontal Position');
    equals($(c).find('ul li').length, 2, "has correct number of actions");
    equals($(c).find('.mm-context-edit').length, 1, 'Icon set on first action');
    
    $(c).find('ul li.mm-context-edit').click();
    equals(handlerData['mydata'], true, 'test handler executes on click');
    equals($('.gwst-contextmenu').length, 0, 'Context menu hides after function is called');
    // check that first instance is cleared before the next
    gwst.ui.ContextMenu.show({
        x: 10,
        y: 20,
        actions: [
            {name: 'test', handler: function(e){handlerData = e.data}, iconcls: 'mm-context-edit'},
            {name: 'test2', handler: function(e){handlerData = true}}
        ]
    }, {mydata: true});
    gwst.ui.ContextMenu.show({
        x: 10,
        y: 20,
        actions: [
            {name: 'test', handler: function(e){handlerData = e.data}, iconcls: 'mm-context-edit'},
            {name: 'test2', handler: function(e){handlerData = true}}
        ]
    }, {mydata: true});
    equals($('.gwst-contextmenu').length, 1, 'Calling show twice should show only the last context menu');
    $('body').click()
    equals($('.gwst-contextmenu').length, 0, 'Context menu hides on click away');    
});

test("clear", function(){
    gwst.ui.ContextMenu.show({
        x: 10,
        y: 20,
        actions: [
            {name: 'test', handler: function(e){handlerData = e.data}, iconcls: 'mm-context-edit'},
            {name: 'test2', handler: function(e){handlerData = true}}
        ]
    }, {mydata: true});
    equals($('.gwst-contextmenu').length, 1, 'Context menu shows up');
    gwst.ui.ContextMenu.clear();
    equals($('.gwst-contextmenu').length, 0, 'cleared');
    
});