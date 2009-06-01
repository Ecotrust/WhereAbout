Ext.namespace('gwst.testing');

gwst.testing.StudyRegionSuite = new gwst.testing.TestSuite('StudyRegionSuite', {
    testExtent: function(test){
        var studyRegion = gwst.testing.fixtures.StudyRegions.southCoast;
        
        test.assert(studyRegion instanceof gwst.data.StudyRegion, 
            'should be of type gwst.data.StudyRegion');

        test.assert(studyRegion.extent() instanceof OpenLayers.Bounds,
            'should be of type OpenLayers.Bounds');
    }
});