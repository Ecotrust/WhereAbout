Ext.namespace('gwst.testing');

gwst.testing.UserSuite = new gwst.testing.TestSuite('UserSuite', {
    testStudyRegion: function(test){
        var user = gwst.testing.fixtures.Users.cburt;
        var studyRegion = user.get('studyRegion');
        test.assert(studyRegion instanceof gwst.data.StudyRegion, 
            'should be of type gwst.data.StudyRegion');
    }
});