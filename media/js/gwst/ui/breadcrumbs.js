(function($){
    var Breadcrumbs = {
        
        _init: function(){
            this.element.addClass('gwst-ui-breadcrumbs');
            this.element.after('<br style="clear:both;" />');
            // where objects assigned to list-items are cached
            this._li = [];
        },

        push: function(object){
            this.element.find('li:last').removeClass('selected');
            var label = gwst.ui.accessObjectProperty(object, this.options.labelProperty);
            var li = $(this.options.liTemplate.replace(/#\{label\}/, label));
            li.css('display', 'none');
            li.css('white-space', 'nowrap');
            li.addClass('selected');
            var self = this;
            li.bind('click', function(event){
                var index = $(event.target).prevAll().length;
                self.element.trigger('itemClick', [object, index], self.options.itemClick);
                event.stopPropagation();
                event.preventDefault();
                return false;
            });
            this.element.append(li);
            li.animate({width: 'show'}, 'fast', 'linear');
            this._li.push(object);
            this.element.trigger('push', [object, this._li.length - 1], this.options.push);
        },
        
        clear: function(dontAnimate){
            // bring all animations to end
            var lis = this.element.find('li');
            lis.stop(true, true);
            this._remove(lis, dontAnimate);
            this.element.trigger('clear', [this._li], this.options.clear);
            this._li = [];
        },
        
        pop: function(dontAnimate){
            this._remove($(this.element.find('li')[this._li.length - 1]), dontAnimate);
            var item = this._li.pop();
            this.element.trigger('pop', [item], this.options.pop);
        },
        
        length: function(){
            return this._li.length;
        },
        
        _remove: function(els, dontAnimate){
            if(dontAnimate){
                els.remove();
            }else{
                els.animate({width: 'hide'}, 'fast', 'linear', function(){
                    $(this).remove();
                });
            }
        },
        
        destroy: function(){
            this.clear(true);
            $.widget.prototype.destroy.apply(this, arguments);
        }
    }

    $.widget('gwst.breadcrumbs', Breadcrumbs);
    
    $.extend($.gwst.breadcrumbs, {
        getter: 'length',
        defaults: {
            labelProperty: 'label',
            liTemplate: '<li>#{label}</li>'
        }
    });
    
    var SelectionCrumbs = $.extend({}, $.gwst.breadcrumbs.prototype);
    
    SelectionCrumbs._init = function(){
        $.gwst.breadcrumbs.prototype._init.apply(this, arguments);
        $(this.options.selectionManager).bind('selectionChange', this, this._onSelectionChange);
        this.options.labelProperty = 'bcLabel';
        var self = this;
        $(this.element).bind('itemClick', function(event, object, index){
            if(index == self.length() - 1){
                //gwst.app.reportsVisor.toggle();
            }else{
                if(object.model == 'array'){
                    self.options.selectionManager.setSelectedFeature(object, this);
                }else{
                    // is cluster, not supported
                }
            }
            return false;
        });        
    };
    
    SelectionCrumbs.disable = function(){
        $(this.options.selectionManager).unbind('selectionChange', this, this._onSelectionChange);
    };
    
    SelectionCrumbs.enable = function(){
        $(this.options.selectionManager).unbind('selectionChange', this, this._onSelectionChange);
        $(this.options.selectionManager).bind('selectionChange', this, this._onSelectionChange);
        // this.options.selectionManager.removeListener('change', this._onSelectionChange, this);
        // this.options.selectionManager.addListener('change', this._onSelectionChange, this);
    };
    
    SelectionCrumbs._onSelectionChange = function(event, mngr, selectedFeature, oldFeature){
        var self = event.data;
        if(selectedFeature == null){
            self.clear();
        }else{
            if(selectedFeature.model == 'mpa'){
                selectedFeature.bcLabel = selectedFeature.name;
                if(oldFeature && oldFeature.model == 'mpa'){
                    var oldArray = oldFeature.get_array();
                    var selArray = selectedFeature.get_array();
                    if(oldArray && selArray && oldArray.pk == selArray.pk){
                        self.pop(true);
                        self.push(selectedFeature);
                        return;
                    }else{
                        self.clear();
                    }
                }else{
                    if(oldFeature && oldFeature.model == 'array'){
                        if(selectedFeature.get_array() && oldFeature.pk == selectedFeature.get_array().pk){
                            self.push(selectedFeature);
                            return;
                        }else{
                            self.clear();
                        }
                    }else{
                        // was cluster
                        self.clear();
                    }
                }
                var selArray = selectedFeature.get_array();
                if(selArray){
                    var a = selArray;
                    a.bcLabel = a.name + '<span class="array-mpa-count"> (contains '+ a.get_mpas().length +' MPAs) </span>';
                    self.push(a);
                }
                self.push(selectedFeature);
            }else{
                if(selectedFeature.model == 'array'){
                    self.clear();
                    selectedFeature.bcLabel = selectedFeature.name + '<span class="array-mpa-count"> (contains '+ selectedFeature.get_mpas().length +' MPAs) </span>';
                    // Array must have label accessible using labelProperty
                    self.push(selectedFeature);
                }else{
                    // is cluster
                    // not currently supported so just clear
                    self.clear();
                }
            }
        }
    }
    
    $.widget('gwst.selectioncrumbs', SelectionCrumbs);
    
    $.extend($.gwst.selectioncrumbs, {
        getter: 'length',
        
        defaults: {
            // must be called with a selectionManager specified, ie
            // selectionManager: sm,
            labelProperty: 'label',
            liTemplate: '<li>#{label}</li>'
        }
    });
    
})(jQuery);