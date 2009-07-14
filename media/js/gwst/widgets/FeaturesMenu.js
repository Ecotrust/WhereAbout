if(window.gwst == undefined){
    gwst = {};
}

if(gwst.widgets == undefined){
    gwst.widgets = {};
}

gwst.copyInProgress = false;
gwst.copySource = 'none';
gwst.copySourceType = 'none';

gwst.widgets.FeaturesMenu = function(options){
    var self = this;
    if(!(options && options['selectionManager'] && options['store'] && (options['renderTo'] || options['extWindow']))){
        throw('gwst.widgets.FeaturesMenu created without appropriate options');
    }
    if(options['extWindow']){
        this.extWindow = new Ext.Window({
            x: 0,
            y: 230,
            width: 300,
            height: 420,
            html: '<div id="extTreeContainer" style="font-size:1.4em;"><ul id="extWindow"></ul></div>',
            autoScroll: true,
            closable: false,
            minimizable: false,
            listeners: {
                'minimize': function(w){
                    self.getExtButton().toggle(false);
                }
            },
            bbar: [
                //gwst.actions.drawMPA,
                gwst.actions.finishGroup
                //gwst.actions.createArray
            ],
            title: 'My Shapes'
            /*tbar: [{
                text: 'How to Use This',
                handler: function(){
                    gwst.actions.nonExt.openTreeTutorial();
                },
                iconCls: 'new-help'
            }]*/
        });
        this.extWindow.show();
        this.extWindow.hide();
        //this.extWindow.getBottomToolbar().hide();
        options['renderTo'] = $('#extWindow');
        var _scrollEl = $(this.extWindow.element).find('.x-window-body');
    }else{
        var _scrollEl = $(options['renderTo'].parent());
    }
    
    if(!$(options['renderTo']).length){
        throw('gwst.widgets.FeaturesMenu: Could not find root object');
    }
    var _userManager = options['userManager'];
    var _sm = options['selectionManager'];
    var _store = options['store'];
    var _renderTo = options['renderTo'];
    this.tree = $(options['renderTo']).tree({scrollEl: _scrollEl});
    var self = this;
    
    $(_store).bind('added', function(e, data){
        if(data['array']){
            for(var i=0; i<data['array'].length; i++){
                var array = data['array'][0];
                self._addArray(array);
            }
        }
        if(data['mpa'] && data['mpa'].length){
            for(var i=0; i<data['mpa'].length; i++){
                var mpa = data['mpa'][i];
                self._addMpa(mpa);
                self.setFolderLabel(mpa.folderID, mpa.folderName);
            }
        }else{
            // nothing of interest added'
        }
    });
    
    $(_store).bind('removed', function(e, items){
        if(items['array'] && items['array'].length){
            for(var i=0; i<items['array'].length; i++){
                var array = items['array'][0];
                self.tree.find('li.'+items['array'][0].client_id).css('background-color', 'red').fadeOut('slow', function(){
                    $(this).remove();
                });
            }
        }else if(items['mpa'] && items['mpa'].length){
            for(var i = 0; i<items['mpa'].length; i++){
                self.tree.find('li.'+items['mpa'][0].client_id).css('background-color', 'red').fadeOut('slow', function(){
                    $(this).remove();
                });
            }
        }else{
            // nothing of importance removed
        }
    });
    
    $(_store).bind('updated', function(e, items){
        if(items['array'] && items['array'].length){
            for(var i=0; i<items['array'].length; i++){
                self._replaceArray(items['array'][i][0], items['array'][i][1]);
            }
        }
        if(items['mpa'] && items['mpa'].length){
            for(var i=0; i<items['mpa'].length; i++){
                self._replaceMpa(items['mpa'][i][0], items['mpa'][i][1]);
                self.setFolderLabel(items['mpa'][i][0].folderID, items['mpa'][i][0].folderName);
            }
        }
    });
    
    $(_sm).bind('selectionChange', function(event, oldFeature, newFeature){
        if(event.caller != self){
            if(newFeature){
                self.tree.tree('selectItem', '.'+newFeature.model + '_' + newFeature.pk, true);
            }else{
                self.tree.tree('clearSelection');
            }
        }
    });
    $(this.tree).bind('itemSelect', function(event, meta, element){
        if(meta && meta.model){
            if ( meta.model == 'folder' )
            {
                _sm.clearSelection(self);
                self.toggleFolder(meta.model,meta.pk);
            }
            else
            {
                _sm.setSelectedFeature(_store.get(meta.model, meta.pk), self);
            }
        }else{
            _sm.clearSelection(self);
        }
    });
    this.tree.bind('itemToggle', function(event, items, state){
        var features = [];
        for(var i=0; i<items.length; i++){
            if(items[i]['model'] == 'mpa'){
                features.push(_store.get(items[i]['model'], items[i]['pk']));
            }
        }
        $(self).trigger('mpaToggle', [features, state]);
    });
    
    /*this.tree.find('a.sharedmsg img').live('click', function(e){
        var m = $(this).parent().parent().parent().metadata();
        var item = _store.get(m.model, m.pk);
        var groups = item.get_sharing_groups();
        var names = [];
        for(var i=0; i<groups.length; i++){
            names.push(groups[i].name);
        }
        alert('This item is shared with the following groups: '+names.join(', '));
        e.preventDefault();
        return false;
    });*/
    
    this.tree.bind('itemDoubleClick', function(e, data, originalEvent){
        if(data['model'] == 'array' || data['model'] == 'mpa'){
            var feature = _store.get(data['model'], data['pk']);
            $(self).trigger('featureDoubleClick', [feature]);
        }
        else if(data['model'] == 'folder'){
            $(self).trigger('folderDoubleClick', data['pk']);
        }
    });

    
    this.tree.bind('itemContext', function(event, mouseEvent, data, target){
    
        // handle folders first because they aren't actually in the store
        if(data['model'] == 'folder') { 
            if (data['pk'].toString().indexOf("-") > -1) // look for separator character indicating this is a specific resource folder
            {
                actions = [
                    {
                        name: 'Add new shape',
                        handler: function(e){
                            self.tree.tree('checkItem', '.'+data['model'] + '_' + data['pk']);
                            gwst.actions.drawMPA.execute(data['pk'], e);
                        },
                        iconcls: 'mm-context-add'
                    },
                    {
                        name: 'Expand/collapse list',
                        handler: function(e){ 
                            self.toggleFolder(data['model'],data['pk']);
                        },
                        iconcls: 'mm-context-view'
                    },
                    {
                        name: 'Show/hide all shapes',
                        handler: function(e){
                            self.toggleFeature(data['model'],data['pk']);
                        },
                        iconcls: 'mm-context-view'
                    },
                    {
                        name: 'Copy all resource shapes',
                        handler: gwst.actions.nonExt.copyAllShapes,                    
                        iconcls: 'mm-context-copy'
                    }
                ];
                
                if (gwst.copyInProgress){
                    actions.push({
                        name: 'Paste copied shapes here',
                        handler: gwst.actions.nonExt.copyToTarget,
                        iconcls: 'mm-context-paste'
                    });
                }
            }
            else
            {
                actions = [
                    {
                        name: 'Expand/collapse list',
                        handler: function(e){ 
                            self.toggleFolder(data['model'],data['pk']);
                        },
                        iconcls: 'mm-context-view'
                    },
                    {
                        name: 'Show/hide all shapes',
                        handler: function(e){ 
                            self.toggleFeature(data['model'],data['pk']);
                        },
                        iconcls: 'mm-context-view'
                    }
                ];
            }
            
            gwst.ui.ContextMenu.show({
                x: mouseEvent.pageX,
                y: mouseEvent.pageY,
                actions: actions
                }, data, target);
            return;
        }
        
        var item = _store.get(data.model, data.pk);
        var actions = [];
        var data = {};
        if(item.model == 'mpa'){
            
            _sm.setSelectedFeature(_store.get(item.model, item.pk), self);
            self.tree.tree('selectItem', '.'+item.model + '_' + item.pk, true);
            
            actions = [              
            ];
  
            if(_userManager.user && item.user == _userManager.user.pk){
                actions.push({
                    name: 'Edit Attributes',
                    handler: gwst.actions.nonExt.editMpaAttributes,
                    iconcls: 'mm-context-edit'
                });
                actions.push({
                    name: 'Edit Geometry',
                    handler: gwst.actions.nonExt.enterMPAGeometryEditMode,
                    iconcls: 'mm-context-view'
                });
                actions.push({
                    name: 'Zoom to Shape',
                    handler: function(e){
                        var input = self.tree.find('li.'+item.model+'_'+item.pk+' > input')
                        var wasChecked = input.attr('checked');
                        if(!wasChecked){
                            self.toggleFeature(item.model,item.pk);
                        }
                        gwst.app.map.zoomToFeature(item);
                    },
                    iconcls: 'mm-context-view'
                });
                actions.push({
                    name: 'Copy',
                    handler: gwst.actions.nonExt.copyShape,
                    iconcls: 'mm-context-copy'
                });
                actions.push({
                    name: 'Delete',
                    handler: gwst.actions.nonExt.deleteMPA,
                    iconcls: 'mm-context-delete'
                });
            }
            data = {mpa: item};
        }else if(item.model=='array'){
            data = {array: item};
            actions = [
                {
                    name: 'Basic Info',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.nonExt.openArrayBasicInfo(e.data.array.pk);
                    }
                },
                {
                    name: 'Download KML',
                    iconcls: 'mm-context-kml',
                    handler: function(e){
                        gwst.actions.openUrl('/gwst/kml/array/'+e.data.array.pk);
                    }
                },
                {
                    name: 'Download Shapefile',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.openUrl('/gwst/array/shapefile/'+e.data.array.pk);
                    }
                }
            ];
            
            if(_userManager.user){
                actions.push({
                    name: 'Copy',
                    iconcls: 'mm-context-copy',
                    handler: function(e) {
                        gwst.actions.nonExt.copyArray(e.data.array.pk);
                    }
                });				
                actions.push({
                    name: 'Replication Report',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.openArrayReplication(e.data.array.pk);
                    }
                });
            }
            
            if(_userManager.user && _userManager.user.pk == item.user){
                actions.push({
                    name: 'Edit',
                    iconcls: 'mm-context-edit',
                    handler: function(e) {
                        gwst.actions.nonExt.createOrModifyArray(e.data.array.pk);
                    }
                });
                actions.push({
                    name: 'Delete',
                    iconcls: 'mm-context-delete',
                    handler: function(e) {
                        gwst.actions.nonExt.deleteArray(e.data.array);
                    }
                });
                
                actions.push({
                    name: 'Delete Array and MPAs',
                    iconcls: 'mm-context-delete',
                    handler: function(e) {
                        gwst.actions.nonExt.deleteArrayAndMpas(e.data.array);
                    }
                });
            }
            
            actions.push({
                name: 'Array Summary',
                iconcls: 'mm-context-view',
                handler: function(e){
                    gwst.actions.openStaffSummary(e.data.array.pk);
                }
            });
            
            if(_userManager.user && _userManager.user.is_staff){
                actions.push({
                    name: 'habitat cross-tab',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.openHabitatPauloFormat(e.data.array.pk);
                    }
                });
                actions.push({
                    name: 'Attributes Spreadsheet',
                    iconcls: 'mm-context-view',
                    handler: function(e){
                        gwst.actions.openAttributesCSV(e.data.array.pk);
                    }
                });
            }
        }else if(item.model=='user'){
            data = {user: item};
            actions = [
                {
                    name: 'About this User',
                    handler: function(e){
                        gwst.actions.nonExt.openUserInfo(e.data.user);
                    },
                    iconcls: 'mm-context-view'
                }
            ]
        }else{
            throw('cannot create contextmenu for item that is not an mpa or array.');
        }
        gwst.ui.ContextMenu.show({
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
            actions: actions
        }, data, target);
    });
    
    var features = [];
    var me;
        
    // Returns a hash containing all mpa and array objects so they don't have
    // to be marshalled from json twice
    this.init = function(data){
        features = [];
        // add features in store
        var hash = {'mpa': [], 'array': []}
        for(var i=0; i<data.features.length; i++){
            features.push(_renderNodeToString(data.features[i], hash, this.tree));
        }
        $(_store).bind('loaded', function(){
            $(self.tree).html(features.join(''));
            var url_str = window.location.href;
            var url_parts = url_str.split('/');
            self.toggleFolder('folder',url_parts[url_parts.length-2]);
        });
        for(var i=0; i<hash['mpa'].length; i++){
            delete hash['mpa'][i]['children'];
        }
        for(var i=0; i<hash['array'].length; i++){
            delete hash['array'][i]['children'];
        }
        var self = this;
        return hash;
    };
    
    this._addMpa = function(mpa){
        var opts = this._optionsForMpa(mpa);
        if(mpa.array){
            opts['parent'] = '.' + mpa.get_array().client_id;
        }else{
            opts['parent'] = '.' + mpa.folder;
        }
        var node = self.tree.tree('add', opts);
    };
    
    this._optionsForMpa = function(mpa){
        var opts = mpa.display_properties;
        opts['metadata'] = "{model: '"+mpa.model+"', pk: "+mpa.pk+"}";
        opts['name'] = mpa.name;
        opts['id'] = mpa.model + '_' + mpa.pk;
        /*if(_userManager.user && mpa.user == _userManager.user.pk && mpa.sharing_groups.length){
            opts['extra'] = '<a href="#" class="sharedmsg" title=""><img class="sharing" src="/site-media/images/silk/icons/star.png" width="16" height="16" /></a>';
        }*/
        return opts;
    };
    
    this._replaceMpa = function(mpa, old_mpa){
        var existing = this.tree.find('.'+mpa.client_id);
        if(mpa.array == old_mpa.array && existing.length){
            var html = this._renderMpaToHtml(mpa);
            existing.replaceWith(html);
        }else{
            existing.remove();
            this._addMpa(mpa);
        }
    };
    
    this._renderMpaToHtml = function(mpa){
        var options = this._optionsForMpa(mpa);
        return this.tree.tree('renderTemplate', options);
    };
    
    this._addArray = function(array){
        var opts = this._optionsForArray(array);
        if(array.public_proposal){
            opts['parent'] = '.folder_publicProposals';
        }else if(array.proposed){
            opts['parent'] = '.folder_draftProposals';
        }else{
            opts['parent'] = '.folder_user_arrays';
        }
        var node = self.tree.tree('add', opts);
    };
    
    this._replaceArray = function(array, old_array){
        if(array.proposed == old_array.proposed && array.public_proposal == old_array.public_proposal){
            var html = this._renderArrayToHtml(array);
            this.tree.find('.'+array.client_id).replaceWith(html);
        }else{
            this.tree.find('li.'+array.client_id).remove();
            this._addArray(array);
        }
    };
    
    this._renderArrayToHtml = function(array){
        var options = this._optionsForArray(array);
        return this.tree.tree('renderTemplate', options);        
    };
    
    this._optionsForArray = function(array){
        var opts = array.display_properties;
        opts['metadata'] = "{model: '"+array.model+"', pk: "+array.pk+"}";
        opts['name'] = array.name;
        opts['id'] = array.model + '_' + array.pk;
        /*if(_userManager.user && array.user == _userManager.user.pk && array.sharing_groups.length){
            opts['extra'] = '<a href="#" class="sharedmsg" title=""><img class="sharing" src="/site-media/images/silk/icons/star.png" width="16" height="16" /></a>';
        }*/
        return opts;
    };
    
    function _renderNodeToString(node, data, tree){
        var s;
        var children = false;
        if(node.display_properties.children){
            var rendered = []
            for(var i=0; i<node.display_properties.children.length; i++){
                rendered.push(_renderNodeToString(node.display_properties.children[i], data, tree));
            }
            children = rendered.join('');
        }
        var opts = node.display_properties;
        if(typeof node.pk == 'string'){
            opts['metadata'] = "{model: '"+node.model+"', pk: '"+node.pk+"'}";
        }else{
            opts['metadata'] = "{model: '"+node.model+"', pk: "+node.pk+"}";
        }
        opts['name'] = node.name;
        opts['id'] = node.model + '_' + node.pk
        // var opts = {
        //     metadata: ,
        //     name: node.name,
        //     id: node.model + '_' + node.pk,
        //     toggle: node.toggle,
        //     context: node.context,
        //     select: node.select,
        //     doubleclick: node.doubleclick,
        //     collapsible: node.collapsible,
        //     icon: node.icon,
        //     hideByDefault: node.hideByDefault
        // }
        if(node.model == 'mpa' || node.model == 'array'){
            data[node.model].push(new gwst.data.mlpaFeatures.lookup[node.model](node));
            /*if(_userManager.user && node.user == _userManager.user.pk && node.sharing_groups.length && !node.proposed && !node.public_proposal){
                opts['extra'] = '<a href="#" class="sharedmsg" title=""><img class="sharing" src="/site-media/images/silk/icons/star.png" width="16" height="16" /></a>';
            }*/
        }
        // if(node.model == 'array' || (node.model == 'folder' && !(node.collapsible === false))){
        //     opts['collapsible'] = true;
        // }else{
        //     opts['collapsible'] = false;
        // }
        if(children){
            opts['children'] = children;
        }
        s = tree.tree('renderTemplate', opts);
        return s;
    };
    
    this.disable = function(){
        
    };
    
    this.enable = function(){
        
    };
    
    this.showSpinner = function(){
        this.tree.append('<div class="gwst-text-right-spinner">Loading</div>');
    };
    
    this.hideSpinner = function(){
        this.tree.find('.gwst-text-right-spinner').remove();
    };
    
    this.toggleFeature = function(model,pk){
        this.tree.find('li.'+model+'_'+pk+' > input').click();
    };
    
    this.toggleFolder = function(model,pk){
        this.tree.find('li.'+model+'_'+pk+' > span').click();
    };
    
    this.setFolderLabel = function(folderID,label){
        this.tree.find('li.'+folderID+' > a').html(label);
    };
    
    this.showTools = function(){
        this.extWindow.getBottomToolbar().show();
    },
    
    this.hideTools = function(){
        this.extWindow.getBottomToolbar().hide();
        this.extWindow.doLayout();
    },
    
    // might not be needed
    this.clear = function(){
        this.tree.html('');
    };
    
    this.getExtButton = function(){
        if(this._button){
            return this._button;
        }else{
            var self = this;
            this._button = new Ext.Button({
                text: 'My Shapes',
                enableToggle: true,
                toggleHandler: function(button, state){
                    if(state){
                        self.extWindow.show(button.id);
                    }else{
                        self.extWindow.hide(button.id);
                    }
                }
            });
            return this._button;
        }
    };
}
