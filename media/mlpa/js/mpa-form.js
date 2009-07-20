mlpa = {mpaForm: {}};

mlpa.mpaForm = {
    selector: '#mpaFormTabs',
    msieDisabledColor: '#cfcfcf',
    
    show: function(opts){
        this.options = opts;
        if(typeof this.options['editUrl'] == "string" && typeof this.options['geometries'] == "array" || (typeof this.options['geometries'] != "array" && typeof['mpa'] != "object")){
            gwst.ui.error.show({errorText:'mpaForm called with invalid arguments. specify either mpa or geometries, and not both.'});
            return;
        }else{
            var geometry = false;
            if(typeof this.options['editUrl'] == 'string'){
                url = this.options['editUrl'];
            }else{
                url = '/gwst/mpa/new';
                geometry = this.options['geometries'][0];
                geometryClipped = this.options['geometries'][1];
            }
            // Fixes a temporary bug in displaying one url-based modal after another
            this.options['width'] = 650,
            gwst.ui.modal.hide(false, true);
            gwst.ui.modal.show({
                width: this.options['width'],
                url: url, // + ' ' + mlpa.mpaForm.selector,
                closable: false,
                afterRender: function(){
                    if(geometry){
                        $('input[name="geometry"]').attr('value', geometry);
                        $('input[name="geometry_clipped"]').attr('value', geometryClipped);                    
                    }
                    mlpa.mpaForm.init();
                },
                errorCallback: function(){
                    gwst.ui.error.show({
                        errorText: 'Problem loading shape attributes form. Please try again in a few minutes and contact an administrator if the problem persists.'
                    })
                }
            });
        }
    },

    successHandler: function(mpa){
        // overridden by user options
    },
    
    submitHandler: function(e){
        e.preventDefault();
        form = $('form.gwst-form');
        var i = this;
        $.ajax({
           data: form.serializeArray(),
           dataType: 'json',
           success: function(data, textStatus){
               // gwst.ui.wait.hide(true);
               mlpa.mpaForm.successHandler(
                   gwst.data.mlpaFeatures.mpa_from_geojson(data)
                );
           },
           error: function(request, textStatus, errorThrown){
               i.options['html'] = jQuery("<div/>").append(request.responseText.replace(/<script(.|\s)*?\/script>/g, "")); //.find(mlpa.mpaForm.selector);
               // i.options['closable'] = false;
               i.options['url'] = false;
               i.options['closable'] = false;
               i.options['afterRender'] = function(){
                   i.init(i.options);
               }
               
               if(request.status == 400){
                    gwst.ui.modal.show(i.options);
               }else{
                    // gwst.ui.wait.hide();
                    if(typeof i.options['error'] == 'function'){
                        i.options['error'](request);
                    }else{
                        gwst.ui.error.show({errorText:'There was a problem saving this shape', debugText: request.responseText, logText:'Problem saving shape attributes'});
                    }
               }
           },
           type: 'POST',
           url: form.attr('action')
        });
        // mlpa.mpaForm.hide(false);
        gwst.ui.wait.show({msg: 'While we save your shape'});
        return false;
    },
   
    init: function(){
        this.successHandler = this.options['success']
        this.cancelHandler = this.options['cancel'];
        
        var inst = this;
        
        $('#content button.gwst_cancel').click(function(e){
            inst.hide();
            inst.cancelHandler();
        });
        
        $('#content input[type="submit"]').bind('click submit', function(e){
            inst.submitHandler(e);
        });
        
        // Setup event handlers for when the user tabs thru form elements
        $('#content').keydown(function(e){
            if(e.keyCode == 9){ //TAB
                e.preventDefault();
                return false;
            }else if(e.keyCode == 13){ //ENTER
                var type = $(e.target).attr('type');
                if(type == 'textarea' || type == 'select' || type=='select-one'){
                    return true;
                }else{
                    e.preventDefault();
                    $("#submit").click();
                    return false;
                }
            }
        });
    },
    
    hide: function(){
        gwst.ui.modal.hide();
    },
    
    transitioning: false

};