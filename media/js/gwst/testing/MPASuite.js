Ext.namespace(
    'gwst.testing', 
    'gwst.testing.fixtures', 
    'gwst.data'
);

gwst.testing.MPASuite = new gwst.testing.TestSuite('MPASuite', {
    testUser: function(test){
        var MPA = gwst.testing.fixtures.MPAs[0];
        var user = MPA.get('user');
        test.assert(user instanceof gwst.data.User, 
            'should be of type gwst.data.User');
    }
});