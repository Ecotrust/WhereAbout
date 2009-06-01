/*
gwst.DropdownMenu, base class for all dropdown buttons
*/
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DropdownMenu = Ext.extend(Ext.Button, {
    toggleHandler: function(target, enabled){
        if(enabled){
            // this.window.setPosition(this.el.getLeft(), this.el.getBottom());
            // console.log('showing');
            this.window.show(this.getEl());
        }else{
            this.window.hide();
        }        
    },
 
    initComponent: function(){
        
        Ext.apply(this, {
            enableToggle: true,
            scope: this
        });
        
        gwst.widgets.DropdownMenu.superclass.initComponent.apply(
            this, arguments);
        this.window = new gwst.widgets.DropdownWindow({
            minimizable: true,
            animateTarget: this.id,
            button: this
        });
        // this.window.setAnimateTarget(this);
        this.window.show();
        this.window.hide();
        // this.setText(this.text);
    },
 
    onRender: function(){
        gwst.widgets.DropdownMenu.superclass.onRender.apply(
            this, arguments);
        // this.window.setPosition(gwst.app.viewPort.getLeft(), this.el.getBottom());
        // this.window.on('minimize', function(){
        //     this.toggle();
        // }, this);
    }
    
});

// No x-type definition as this is just a base-class