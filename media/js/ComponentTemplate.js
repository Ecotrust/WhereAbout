/*
From http://extjs.com/learn/Manual:Component:Extending_Ext_Components
just a template for starting pre-configured components
*/

MyComponent = Ext.extend(Ext.some.component, {
    // Constructor Defaults, can be overridden by user's config object
    propA: 1,
 
    initComponent: function(){
        // Called during component initialization
 
        // Config object has already been applied to 'this' so properties can 
        // be overriden here or new properties (e.g. items, tools, buttons) 
        // can be added, eg:
        Ext.apply(this, {
            propA: 3
        });
 
        // Before parent code
 
        // Call parent (required)
        MyComponent.superclass.initComponent.apply(this, arguments);
 
        // After parent code
        // e.g. install event handlers on rendered component
    },
 
    // Override other inherited methods 
    onRender: function(){
 
        // Before parent code
 
        // Call parent (required)
        MyScope.superclass.onRender.apply(this, arguments);
 
        // After parent code
 
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('mycomponentxtype', MyComponent);