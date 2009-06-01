Ext.namespace('gwst', 'gwst.testing', 'gwst.data', 'gwst.testing.fixtures');

gwst.testing.fixtures.MPAs = [];

for(var i=0; i<10; i++){
    gwst.testing.fixtures.MPAs.push(new gwst.data.MPA({
        title: 'Marine Protected Area '+i,
        user: gwst.testing.fixtures.Users.cburt,
        displayGeometry: null,
        originalGeometry: null,
        designationId: 0,
        lastModified: new Date().getTime()
    }));
}