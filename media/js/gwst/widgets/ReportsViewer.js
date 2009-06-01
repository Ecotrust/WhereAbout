// create namespace
Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ReportsViewer = function(selectionManager, userManager, clientStore){
    var sm = selectionManager;
    var div = $('#ReportsViewer');
    var store = clientStore;
    var header = $(div).find('.header');
    var instance = this;
    var userManager = userManager;
    
    $(userManager).bind('change', function(e, user, oldUser){
        instance.update();
        // if(flashInitialized){
        //     FABridge.flash.root().toggleEconButton(!!(user && user.permission_ecotrust_data));
        // }
    });
    
    function storeEventHandler(e, items){
        if((items['mpa'] && items['mpa'].length) || (items['array'] && items['array'].length)){
            refreshSwfLists();
        }
    }
    
    $(store).bind('added', storeEventHandler);
    $(store).bind('updated', storeEventHandler);
    
    var contentHeight = $('#reports_content').height;
    
    // Tracks if an animation is playing
    var animationPlaying = false;
    
    // Private callback for when an animation is done playing
    function animationCallback(){
        animationPlaying = false;
    };
    
    var requiredFlashVersion = "9.0.124";
    var flashInitialized = false;
    
    // Whether the use has flash and the required version
    function flashCapable(){
        return swfobject.hasFlashPlayerVersion(requiredFlashVersion);
    };
    
    function initFlash(){
        FABridge.addInitializationCallback("flash", onFlashInitialization);
        swfobject.embedSWF("media/flash/gwstClient.swf", "reports_content", "100%", "320", requiredFlashVersion, false, false, { wmode: "opaque", play: "true"});
        $(div).css('bottom', -319);
        flashInitialized = true;
    };
    
    function onFlashInitialization(){
        // FABridge.flash.root().toggleEconButton(!!(userManager.user && userManager.user.permission_ecotrust_data));
        FABridge.flash.root().getEconButton().addEventListener('click', function(){
            gwst.actions.openEconomicAnalysis(sm.selectedFeature);
        });
    };
    
    function setSwfSelection(feature){
        if(feature && feature.model == 'mpa'){
            if(typeof FABridge.flash != 'undefined' && typeof FABridge.flash.root != 'undefined'){
                FABridge.flash.root().setSelectedFeature('MPA', feature.pk);
            }
        }else{
            clearSwfSelection();
        }
    };
    
    function clearSwfSelection(){
        if(typeof FABridge.flash != 'undefined' && typeof FABridge.flash.root != 'undefined'){
            FABridge.flash.root().setSelectedFeature('MPA', null);
        }
    };
    
    function refreshSwfLists(){
        if(typeof FABridge.flash != 'undefined' && typeof FABridge.flash.root != 'undefined'){
            FABridge.flash.root().refresh();
        }
    };
    
    // Should be called whenever the list of MPAs(and in the future clusters, Arrays)
    // has been modified and should be reloaded.
    this.update = function(){
        if(flashInitialized){
            refreshSwfLists();
        }
    };
    
    // Whether or not the Report is fully extended
    this.isDisplayed = function(){
        return $(div).css('bottom') == '0px';
    };
    
    this.isActive = function(){
        return !$(div).hasClass('inactive');
    };
    
    // Extend the viewer by setting to true, hide by setting false
    this.setDisplayState = function(state){
        if(animationPlaying){return;}
        if(this.isDisplayed == state){return;}
        animationPlaying = true;
        setSwfSelection(sm.selectedFeature);
        // if(FABridge && FABridge.flash && FABridge.flash.root() && flashInitialized){
        //     FABridge.flash.root().toggleEconButton(!!(userManager.user && userManager.user.permission_ecotrust_data));
        // }
        if(state){
            //show
            if(!this.isActive()){animationPlaying = false;return;}
            $(div).animate({bottom: 0}, 300, 'swing', animationCallback);
        }else{
            //hide
            $(div).animate({bottom: -320}, 300, 'swing', animationCallback);
        }
    };
    
    this.activate = function(){
        $('#selection-breadcrumbs').selectioncrumbs('enable');
        $(div).removeClass('inactive');
        $(header).css('cursor', 'pointer');
        if(flashCapable() && !flashInitialized){
            initFlash();
        }
        if(flashInitialized && sm.selectedFeature != null){
            setSwfSelection(sm.selectedFeature);
        }
    };
    
    this.deactivate = function(){
        $('#selection-breadcrumbs').selectioncrumbs('disable');
        $(div).addClass('inactive');
        $(header).css('cursor', 'default');
        instance.setDisplayState(false);
    };
    
    this.toggle = function(){
        instance.setDisplayState(!instance.isDisplayed());
    };
        
    $(header).click(function(){
        instance.toggle();
    });
    
    $(header).mouseover(function(){
        if(instance.isActive()){
            $(div).css('border-top', '2px solid white');
        }
    });
    
    $(header).mouseout(function(){
        if(instance.isActive()){
            $(div).css('border-top', 'none');
        }
    });    
    
    $(sm).bind('selectionChange', function(e, manager, selectedFeature, old){
        if(instance.isDisplayed()){
            if(selectedFeature == null){
                if(flashInitialized){
                    clearSwfSelection();
                }
            }else{
                if(selectedFeature.model == 'mpa'){
                    if(flashInitialized){
                        setSwfSelection(selectedFeature);                    
                    }
                }else if(selectedFeature.model == 'array'){
                    if(flashInitialized){
                        clearSwfSelection();
                    }
                }else{
                    //could it be a cluster?
                }
            }
        }
    });

    $('#selection-breadcrumbs').selectioncrumbs({
        selectionManager: sm
    });
};
