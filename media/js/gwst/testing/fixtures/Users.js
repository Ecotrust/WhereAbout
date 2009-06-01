Ext.namespace('gwst', 'gwst.testing', 'gwst.data', 'gwst.testing.fixtures');

gwst.testing.fixtures.Users = {
    cburt: new gwst.data.User({
        name: 'Chad Burt',
        email: 'chad@underbluewaters.net',
        studyRegion: gwst.testing.fixtures.StudyRegions.southCoast
    })
}