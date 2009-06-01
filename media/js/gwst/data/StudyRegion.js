Ext.namespace('gwst', 'gwst.data');

gwst.data.StudyRegion = Ext.data.Record.create([
    {name: 'name'},
    {name: 'bounds'}
]);

gwst.data.StudyRegion.prototype.extent = function(){
    return OpenLayers.Bounds.fromString(this.data.bounds);
};