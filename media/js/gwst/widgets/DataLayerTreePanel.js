Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DataLayerTreePanel = Ext.extend(Ext.tree.TreePanel, {
   loader: new Ext.tree.TreeLoader(),
   bodyBorder: false,
   border: false,   
   collapseFirst: false,
   rootVisible: false
});

gwst.widgets.DataLayerTreeRoot = new Ext.tree.AsyncTreeNode({
    draggable:false,
    id:'data_layer_root',
    children: gwst.data.DataLayers
});