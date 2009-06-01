Ext.namespace(
    'gwst',
    'gwst.testing',
    'gwst.testing.proxies'
);

gwst.testing.proxies.Arrays = new Ext.data.MemoryProxy({
    results: [
        {
            id: 1,
            title: 'First Array',
            author: gwst.testing.proxies.shared.user,
            lastModified: '04/05/2008',
            mpaIds: [1, 2, 3]
        }
    ]
});
