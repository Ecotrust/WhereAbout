Ext.namespace('gwst', 'gwst.urls');

gwst.copy = {
    
    /** MPA Creation and Attribute Editing Form **/
    // General Tab
    designationForm: 'You must choose a protection category for this marine reserve. To learn about the different choices, see the <a href="http://www.dfg.ca.gov/mlpa/defs.asp#system" target="_blank">full description</a>',
    
    // Goals Tab
    
    // Regulations Tab
    
    // Guidance Tab
    
    dfgFeasabilityGuidanceLabel: 'DFG Feasability Guidance',
    
    emptyDfgFeasabilityGuidanceText: 'The Department of Fish and Game will fill in this information later in the process to inform you whether this MPA meets feasability guidelines.',
                                    
    lopLabel: 'Level of Protection',
    
    lopDescription: 'Level of Protection will be assigned by the Science Advisory Team later in the process.',
    
    satExplanationLabel: 'SAT Guidance',
    
    emptySatExplanationText: 'The Science Advisory Team will fill in this area to explain their rational for the assigned Level of Protection',
    
    // Comments Tab
    
    // END MPA Creation and Attribute Editing Form
    
    // Geometry Confirmation Dialog Box Text
    geometryConfirmTitle: 'Confirm your geometry',
    geometryConfirmText: 'The server has validated and clipped your geometry according to [these rules]. Do you want to continue with this geometry?'
};

gwst.copy.confirmStudyRegionClippingTitle = 'Please confirm modifications to your geometry';
gwst.copy.confirmStudyRegionClipping = '<h3>Geometry Clipping</h3><img src="/site-media/figures/clipping.gif" width="369" height="88" /><p>Your geometry has been clipped to match the study region boundaries. Portions not overlapping the study region, or overlapping land, have been removed.</p><br /><p>This operation occurs each time you create a geometry. We also keep a copy of the lines you draw, so you will always have the un-clipped version for editing.</p>';

gwst.copy.overlapsEstuaryTitle = 'Please confirm modifications to your geometry';
gwst.copy.overlapsEstuaryText = '<h3>Your Geometry Overlaped an Estuary</h3><img src="/site-media/figures/estuary.gif" width="368" height="88" /><p>An MPA geometry can either be entirely estuary, or none. In cases like this where a geometry overlaps but is not entirely estuarine, the system creates two polygons. Whichever is larger is the one it assumes you would like to create.</p><br />';
gwst.copy.overlapsEstuary = [];
gwst.copy.overlapsEstuaryEndText = "<p>If this is not the outcome you wanted, try to refine your selection to better fit the habitat you are trying to capture. Turning on the Estuary layer from the Data Layers menu can help you in this process.</p>";

// status code 1 : Overlaps an estuary, and the system chose the non-estuary part
gwst.copy.overlapsEstuary[1] = gwst.copy.overlapsEstuaryText + '<p>In this case, the system chose the <b>Non-Estuary Part</b></p><br />' + gwst.copy.overlapsEstuaryEndText;
// status code 5 : Overlaps an estuary, and the system chose the estuary part
gwst.copy.overlapsEstuary[5] = gwst.copy.overlapsEstuaryText + '<p>In this case, the system chose the <b>Estuary Part</b></p><br />' + gwst.copy.overlapsEstuaryEndText;

gwst.copy.errors = {
    mpaValidationService: 'There was an error trying to validate this geometry.'
};


gwst.copy.clippedGeometryStatus = [];

gwst.copy.clippedGeometryStatus[0] = 'Successful geometry creation';
gwst.copy.clippedGeometryStatus[1] = 'System has chosen an MPA';
gwst.copy.clippedGeometryStatus[2] = '<h3>Outside the Study Region</h3><img src="/site-media/figures/outsidestudyregion.gif" width="115" height="84" /><p>The geometry you defined was outside the study region. The study region for Southern California is limited to 3 miles offshore. If you are having trouble, you can turn on the study region layer in the Data Layers menu.</p>';
gwst.copy.clippedGeometryStatus[3] = '<h3>Invalid Geometry</h3><img src="/site-media/figures/invalidgeo.gif" width="121" height="87" /><p>Please avoid drawing irregular shapes that intersect themselves like bowties.<br /> To delete a vertex from a geometry, click on it and press "d" on your keyboard.</p>';
gwst.copy.clippedGeometryStatus[4] = 'System Error';
gwst.copy.clippedGeometryStatus[6] = '<h3>Overlapping Shapes</h3><img src="/site-media/figures/invalidgeo.gif" width="121" height="87" /><p>Please do not draw a new shape on top of other shapes of the same resource.<br /> To delete a vertex from a geometry, click on it and press "d" on your keyboard.</p>';
gwst.copy.clippedGeometryErrorText = 'You have the option of either cancelling this operation or going back to your geometry to fix this error.';



gwst.copy.createNewGeometry = 'Draw your shape by clicking on the map. Double-click to finish.';
gwst.copy.editGeometry = 'Edit this geometry by dragging the handles on its vertices.  To delete a vertex, press the D-key <img class="dkey" src="/site-media/images/D.png" />. <br />When you are done, click the finished button.';
