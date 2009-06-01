module("Tree");

test("initialize", function() {
    $('#main').append('<ul id="treetest" />');
    equals($("#treetest").length, 1);
    $("#treetest").tree();
    ok($('#treetest').hasClass('gwst-tree'), 'Should have class');
});

test("add", function(){
    $('#main').append('<ul id="treetest" />');
    $("#treetest").tree();
    
    $('#treetest').tree('add', {
        id: 'noIcon',
        name: 'Default Icon Category'
    });
    equals($('li.noIcon').length, 1);
    equals($('li.noIcon img.icon').length, 0);

    // test that category was created
    var myCategory = $('#treetest').tree('add', {
        id: 'myCategory',
        icon: 'http://null.net/icon.png',
        name: 'My Category',
        collapsible: true
    });
    equals($('li.myCategory').length, 1);
    equals($('li.myCategory ul').length, 1);
    equals($('li.myCategory img.icon').length, 1);
    
    equals($('li.myCategory > ul > li').length, 0);
    $('#treetest').tree('add', {
        name: 'subelement',
        collapsible: false,
        parent: myCategory,
        metadata: '{mydata: true}'
    });
    equals($('li.myCategory > ul > li').length, 1);
    equals($($('li.myCategory > ul > li')[0]).metadata()['mydata'], true)
});