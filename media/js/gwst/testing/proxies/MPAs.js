Ext.namespace(
    'gwst',
    'gwst.testing',
    'gwst.testing.proxies'
);

gwst.testing.proxies.MPAs = new Ext.data.MemoryProxy({
    results: [
        {
            id: 1,
            name: 'La Jolla Cove',
            author: gwst.testing.proxies.shared.user,
            displayGeometry: '',
            originalGeometry: '',
            designationId: 1,
            lastModified: '04/05/2008',
            array_id: 1
        },
        {
            id: 3,
            name: 'Carlsbad State Park',
            author: gwst.testing.proxies.shared.user,
            displayGeometry: '',
            originalGeometry: '',
            designationId: 2,
            lastModified: '04/06/2008',
            array_id: 1
        },
        {
            id: 2,
            name: 'Point Loma',
            author: gwst.testing.proxies.shared.user,
            displayGeometry: '',
            originalGeometry: '',
            designationId: 1,
            lastModified: '04/04/2008',
            array_id: 1
        }
    ]
});