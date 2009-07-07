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
                        errorText: 'Problem loading MPA attributes form. Please try again in a few minutes and contact an administrator if the problem persists.'
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
               // opts['width'] = 650;
               if(request.status == 400){
                   gwst.ui.modal.show(i.options);
               }else{
                    // gwst.ui.wait.hide();
                    if(typeof i.options['error'] == 'function'){
                        i.options['error'](request);
                    }else{
                        gwst.ui.error.show({errorText:'There was a problem saving this shape', debugText: request.responseText, logText:'Problem saving MPA Attributes'});
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
    
    /*allowedUsesPropertyMousedown: function(e){
        var designation_id = $('select#id_designation option:selected').attr('value');
        if(this.purposesForDesignation(designation_id).length == 0){
            alert('The current MPA Designation does not allow any types of consumptive use. Please change the designation if you would like to add allowed uses.');
            return false;
            e.preventDefault();
        }
    },*/
    
    /*designationChange: function(e){
        var purposes = this.purposesForDesignation($('select#id_designation option:selected').attr('value'));
        if($('select#id_allowed_uses option:selected').length > 0){
            var msg = false;
            if(purposes.length == 0){
                msg = "This designation does not allow any consuptive uses. All of your currently selected allowed uses will be removed.\n Do you still wish to change the MPA Designation?";
            }else if(purposes.length < $('select.purpose option').length - 1){
                msg = "This Designation only allows " + $('select.purpose option[value="'+purposes[0]+'"]').html() + " uses. Any other types of allowed uses you have selected will be removed. \n Do you still wish to change the MPA Designation?";
            }
            var answer = true;
            if(msg){
                answer = confirm(msg);
            }
            if(answer){
                this.currentDesignation = e.target.selectedIndex;
                if(msg){
                    this.removeUsesNotMatchingDesignation();
                }
                this.updatePurposes(purposes);
            }else{
                e.target.selectedIndex = this.currentDesignation;
            }
        }else{
            this.currentDesignation = e.target.selectedIndex;
            this.updatePurposes(purposes);
        }
    },*/
    
    /*updatePurposes: function(purposes){
        var msg = 'Any type of allowed use can be added to an MPA of this designation.';
        var last_select = false;
        this.clearingAllowedUses = true;
        $('#allowed_uses_widget select.choose').each(function(){
            this.selectedIndex = 0;
            last_select = this;
        });
        this.clearingAllowedUses = false;
        $(last_select).trigger('change');
        
        if(purposes.length == 0){
            msg = 'Allowed uses cannot be added to an MPA of this designation type.';
            $('#allowed_uses_widget select.choose').attr('disabled', 'disabled');
        }else if(purposes.length < $('select.purpose option').length - 1){
            $('select.choose').attr('disabled', false);
            var option = $('select.purpose option[value="'+purposes[0]+'"]');
            option.attr('selected', true);
            $('select.purpose').attr('disabled', true);
            msg = 'MPAs with this designation can only have <em>'+option.html()+'</em> allowed uses.';
        }else{
            $('select.choose').attr('disabled', false);
        }
        $('p#designation_purposes_warning').html(msg);
        $('#allowed_uses_widget select.choose').triggerHandler('change');
    },*/
    
    /*removeUsesNotMatchingDesignation: function(){
        var purposes = this.purposesForDesignation($('select#id_designation option:selected').attr('value'));
        var inst = this;
        $('#allowed_uses_widget table tbody tr').each(function(){
            var tr = $(this);
            if(purposes.length == 0){
                inst.removeAllowedUse(tr);
            }else{
                var id = jQuery.trim(tr.find('td.pk').html());
                var remove = true;
                for(var i=0; i<purposes.length; i++){
                    if(inst.allowed_uses_by_id[id] && inst.allowed_uses_by_id[id]['purpose_id'] == purposes[i]){
                        remove = false;
                    }
                }
                if(remove){
                    inst.removeAllowedUse(tr);
                }
            }
        });
    },*/
    
    addToLookup: function(obj, use, item, a, b, c){
        var key = ' ' + a + b + c;
        key = jQuery.trim(key);
        if(!obj[key]){
            obj[key] = {};
        }
        obj[key][item] = use;
    },
    
    /*createLookups: function(){
        this.currentDesignation = $('select#id_designation')[0].selectedIndex;
        this.allowed_uses = eval('(' + $('#all_allowed_uses').html() + ')');
        this.x_designations_purposes = eval('('+$('#x_designations_purposes').html()+')');
        this.allowed_uses_by_id = {};

        // setup lookup for allowed_uses
        this.allowed_uses_choice_lookup = {};

        this.allowed_use_direct_lookup = {};
        var lookup = this.allowed_uses_choice_lookup;
        for(var i=0; i<this.allowed_uses.length; i++){
            var use = this.allowed_uses[i];
            if(typeof use != 'undefined'){
                this.allowed_uses_by_id[use['id']] = use;
                this.allowed_use_direct_lookup[' '+use['target_id']+use['method_id']+use['purpose_id']] = use;
                this.addToLookup(lookup, use, use['target_id'],  'o',                 'x',                'x');
                this.addToLookup(lookup, use, use['target_id'],  'o',                 use['method_id'],   use['purpose_id']);
                this.addToLookup(lookup, use, use['target_id'],  'o',                 use['method_id'],   'x');
                this.addToLookup(lookup, use, use['target_id'],  'o',                 'x',                use['purpose_id']);

                this.addToLookup(lookup, use, use['method_id'],  'x',                 'o',                'x');
                this.addToLookup(lookup, use, use['method_id'],  use['target_id'],    'o',                use['purpose_id']);
                this.addToLookup(lookup, use, use['method_id'],  'x',                 'o',                use['purpose_id']);
                this.addToLookup(lookup, use, use['method_id'],  use['target_id'],    'o',                'x');

                this.addToLookup(lookup, use, use['purpose_id'], 'x',                 'x',                'o');   
                this.addToLookup(lookup, use, use['purpose_id'], use['target_id'],    use['method_id'],   'o');
                this.addToLookup(lookup, use, use['purpose_id'], use['target_id'],    'x',                'o');
                this.addToLookup(lookup, use, use['purpose_id'], 'x',                 use['method_id'],   'o');
            }
        }
    },*/
    
    /*makeSureIEDoesntLetUsersSelectDisabledOptions: function(e){
        var select = e.target;
        if(select.selectedIndex != 0){
            var option = select.options[select.selectedIndex];
            if($(option).css('color') == this.msieDisabledColor){
                var msg = 'This option cannot be selected in combination with your other selections';
                if($(select).hasClass('purpose')){
                    msg = msg + ', or the current MPA Designation. ';
                }else{
                    msg = msg + '. ';
                }
                msg = msg + 'For example, you cannot choose method "By Hand" in combination with a target of "Salmon".';
                alert(msg);
                select.selectedIndex = 0;
                e.preventDefault();
                return false;
            }                
        }
    },*/
    
    init: function(){
        this.successHandler = this.options['success']
        this.cancelHandler = this.options['cancel'];
        
        var inst = this;
        
        // Remove blank options from designation field
        // This should really be handled via modelforms, but I have no idea how
        // if($('select#id_designation')[0].selectedIndex == 0){
        //     $('select[name="designation"] option[value=""]').remove();
        //     $('select#id_designation')[0].selectedIndex = 0;            
        // }else{
        //     $('select[name="designation"] option[value=""]').remove();
        // }
        
        $('#content button.gwst_cancel').click(function(e){
            inst.hide();
            inst.cancelHandler();
        });
        
        /*$('#allowed_uses_widget select.choose').bind('mousedown', function(e){
            inst.allowedUsesPropertyMousedown(e);
        });
        
        $('select#id_designation').bind('change', function(e){
            inst.designationChange(e);
        });

        if($.browser.msie){
            $('#allowed_uses_widget select.choose').bind('change', function(e){
                inst.makeSureIEDoesntLetUsersSelectDisabledOptions(e);
            });
        }

        $('td.remove-allowed-use').each(function(){
           $(this).show();
           $(this).find('a').bind('click', function(e){
               inst.removeAllowedUse($(this).parent().parent());
               e.preventDefault();
               return false;
           });
        });

        $('a#add-use').click(function(e){
            var target = $('select.target option:selected').attr('value');
            var method = $('select.method option:selected').attr('value');
            var purpose = $('select.purpose option:selected').attr('value');
            if(target != 'x' && method != 'x' && purpose != 'x'){
                var use = inst.allowed_use_direct_lookup[' '+target+method+purpose];
                inst.addAllowedUse(use);
            }else{
                alert('You must choose a Target, Method, and Use Type in order to add an Allowed Use');
            }
            e.preventDefault();
            return false;
        });
        
        $('#allowed_uses_widget select.choose').bind('change', function(e){
            inst.allowedUsePropertySelectionChange(e);
        });*/

        $('#content input[type="submit"]').bind('click submit', function(e){
            inst.submitHandler(e);
        });
        

        // Event handlers for the buttons
        /*$('#forward').click(function(){
            if($('#forward').css('display') == 'block'){
                var link = $('ul#form_shortcuts li.active').next().children('a');
                link.click();
            }
            return false;
        });
        $('#backward').click(function(){
            if($(this).css('display') == 'block'){
                var li = $('ul#form_shortcuts li.active').prev();
                $(li).children('a').click();
            }
            return false;
        });*/

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

        // Clicking on these links starts all the functionality
        // If you feel like you need to call something akin to Form.openTabIndex(2),
        // instead find the appropriate link and fire its click event
        //$('ul#form_shortcuts li a').click(function(e){
        //    if(mlpa.mpaForm.transitioning == true){
        //        return false;
        //    }else{            
        //        // Figure out what panel is active, and keep the href for a callback
        //        old_target = $('li.active a').attr('href');
        //        var old_href = old_target.replace(/[^#]*/, "");

        //        // Find what panel should be shown
        //        var href = $(this).attr('href');
        //        var href = href.replace(/[^#]*/, "");

        /*        if(href == old_href){
                    e.preventDefault();
                    return false;
                }
                mlpa.mpaForm.transitioning = true;


                $('ul#form_shortcuts li.active').removeClass('active');
                $(this).parent().addClass('active');


                var pos = $(href).prevAll().length
                // Determine which buttons need to be displayed
                if(!inst.options['editUrl']){
                    if(pos == 0){
                        $('#backward').css('display', 'none');
                    }else{
                        $('#backward').css('display', 'block');
                    }
                    if(pos == $('div.formpane').length - 1){
                        $('#forward').css('display', 'none');
                        $('#mpaFormTabs input[type="submit"]').css('display', 'block');
                    }else{
                        $('#forward').css('display', 'block');
                        $('#mpaFormTabs input[type="submit"]').css('display', 'none');
                    }                
                }

                // Calculate scroll position
                var width = $('div.formpane').innerWidth();
                var offset = pos * width;

                // Fire first callback
                mlpa.mpaForm.exitPanel($(old_href));

                // Start animation and set callback
                $('div.form_content').animate({
                   scrollLeft: offset
                }, 350, 'linear', function(){
                   mlpa.mpaForm.enterPanel($(href));
                });
                // Prevent default link behavior
                e.preventDefault();
                return false
            }
        });*/

        var errors = $('ul.errorlist');
        if(errors.length > 0){
            var id = "#" + $(errors[0]).parent().parent()[0].id;
            $('a[href*="'+id+'"]').click();
        }else{
            // go directly to the begining without animation
            //$('div.form_content').scrollLeft(0);
            //mlpa.mpaForm.enterPanel($("#first_page"));
            //$('#backward').css('display', 'none');
            // link.click();
        }
        
        //this.createLookups();
        //this.updatePurposes(this.purposesForDesignation($('select#id_designation option:selected').attr('value')));
    },
    
    //purposesLookup: {},
    
    /*purposesForDesignation: function(des_id){
        if(des_id == ''){
            des_id = 'null';
        }
        if(this.purposesLookup[des_id]){
            return this.purposesLookup[des_id];
        }else{
            var purposes = [];
            for(var i = 0; i< this.x_designations_purposes.length; i++){
                if(typeof this.x_designations_purposes[i] == 'object'){
                    if(des_id == 'null' || this.x_designations_purposes[i]['designation_id'] == des_id){
                        purposes.push(this.x_designations_purposes[i]['purpose_id']);
                    }
                }
            }
            this.purposesLookup[des_id] = purposes;
            return this.purposesLookup[des_id];
        }
    },

    clearingAllowedUses: false,
    
    allowedUsePropertySelectionChange: function(e){
        if(this.clearingAllowedUses){
            return;
        }
        var key = false;
        var target = e.currentTarget;
        var inst = this;
        $('select.choose').each(function(){
            if(this == target){
                return;
            }
            var select = $(this);
            if($(select).hasClass('target')){
                var key = 'o' + $('select.method option:selected').attr('value') + $('select.purpose option:selected').attr('value');
            }else if($(this).hasClass('method')){
                var key = $('select.target option:selected').attr('value') + 'o' + $('select.purpose option:selected').attr('value');
            }else{
                var key = $('select.target option:selected').attr('value') + $('select.method option:selected').attr('value') + 'o';
            }
            var choices = inst.allowed_uses_choice_lookup[key];
            if($(this).hasClass('purpose')){
                var purposes = inst.purposesForDesignation(inst.currentDesignation);
            }
            select.find('option').each(function(){
                var value = $(this).attr('value');            
                var hide = true;
                if(value == 'x'){
                    hide = false;
                }
                if(!(choices && !(typeof choices[value] === 'object'))){
                    hide = false;
                }
                if(purposes){
                    for(var j = 0; j < purposes.length; j++){
                        if(!hide && purposes[j] == value){
                            hide = false;
                        }
                    }
                }
                if($.browser.msie){
                    $(this).css('color', (hide ? inst.msieDisabledColor : ''));
                }else{
                    $(this).attr('disabled', (hide ? 'disabled' : ''));
                }
            });
        });
    },
    
    addAllowedUse: function(use){
        if($('select#id_allowed_uses option[value="'+use['id']+'"]').attr('selected')){
            alert('You have already added this allowed use.');
        }else{
            $('tr.none').hide();
            $('select#id_allowed_uses option[value="'+use['id']+'"]').attr('selected', true);
            // add to table
            var row = [
                '<tr style="background-color:#CBF1BE; display:none;">',
                    '<td class="pk" style="display:none;">',
                        use['id'],
                    '</td>',
                    '<td class="target">',
                        $('select.target option:selected').html(),
                    '</td>',
                    '<td class="method">',
                        $('select.method option:selected').html(),
                    '</td>',
                    '<td class="purpose">',
                        $('select.purpose option:selected').html(),
                    '</td>',
                    '<td class="remove-allowed-use">',
                        '<a title="remove" href="#"><img src="/site-media/images/silk/icons/delete.png" /></a>',
                    '</td>',
                '</tr>'
            ];
            $('#allowed_uses_widget table tbody').prepend(row.join(''));
            var row = $('#allowed_uses_widget table tbody tr:first');
            var inst = this;
            row.find('td.remove-allowed-use a').bind('click', function(e){
                inst.removeAllowedUse($(this).parent().parent());
            });
            
            row.fadeIn(500, function(){
                row.css('background-color', 'transparent');
            });
            
            var last_select = false;
            this.clearingAllowedUses = true;
            $('#allowed_uses_widget select.choose').each(function(){
                if(!$(this).attr('disabled')){
                    this.selectedIndex = 0;
                    last_select = this;
                }
            });
            this.clearingAllowedUses = false;
            $(last_select).trigger('change');
        } 
    },
    
    removeAllowedUse: function(tr){
        tr = $(tr);
        var pk = jQuery.trim(tr.find('td.pk').html());
        var option = $('select#id_allowed_uses option[value="'+pk+'"]').attr('selected', false);
        tr.css('background-color', '#ED979A');
        tr.fadeOut(300, function(){
           tr.remove(); 
        });
    },
    
    enterPanel: function(target){
        // Fix for tearing in Firefox Windows
        target.css('overflow-y', 'auto');
        form_elements = $(target).find(':input');
        if(form_elements.length > 0){
            form_elements[0].focus();
        }
        $(target).scrollTop(0);
        mlpa.mpaForm.transitioning = false;
    },*/
    
    hide: function(){
        gwst.ui.modal.hide();
    },
    
    transitioning: false
    
    /*exitPanel: function(target){
        target.css('overflow-y', 'visible');
    }*/
};