Ext.namespace('gwst', 'gwst.urls');

/*
    Class: gwst.urls
    
    Source for all URLs used within the gwst javascript client.

    Rather than sprinkling urls throughout the source code, they should be 
    placed here and then referenced. They will not only be easier to change if 
    in one place, but we can also do things like load gwst.testing.urls 
    in its place to easily switch to test data.
*/
//gwst.urls = {
//    newMPAForm: '/gwst/forms/create/mpa',
//    designationsService: '/gwst/domains/designations',
//    submitNewMPA: '/gwst/mpa/create/',
//    validateGeometry: '/gwst/mpa/validate/',
//    mpas: '/gwst/mpas/public?srid=900913',
//    editMPA: '/gwst/mpas/edit/',
//    // mpas: '/gwst/mpas/public'
//}

gwst.urls = {
    splash: '/gwst/splash/',
    tutorials: '/gwst/tutorials/',
    faq: '/gwst/faq/',
    sendPassword: '/gwst/user/sendpassword/',
    changePassword: '/gwst/user/changepassword/',
    newMPAForm: '/gwst/forms/create/mpa',
    // designationsService: '/gwst/domains/designations',
    submitNewMPA: '/gwst/mpa/create/',
    validateGeometry: '/validate_shape/',
    mpas: '/gwst/mpas/public/?srid=900913',
    editMPA: '/gwst/shape/edit/',
    // mpas: '/gwst/mpas/public'
    deleteMPA: '/gwst/shape/delete/',
    MPAKml: '/gwst/mpa/kml/',
    login: '/gwst/login/',
    logout: '/gwst/logout/',
    user: '/user/',
    index: '/gwst/',
    geoserver: '/gwst/geoserver/wfs/',
    mpaAttributes: '/gwst/shape/edit/',
    createArray: '/gwst/array/create/',
    // arrays : '/gwst/domains/arrays',
    addtoarray: '/gwst/mpa/addtoarray/',
    emptyarrays: '/gwst/arrays/getempty/',
    deleteArray: '/gwst/array/delete/',
    mpaImpactAnalysis: '/gwst/econ_analysis/mpa/'
};
