(function($){
    var Tree = {
        
        _init: function(){
            var self = this;
            this.element.addClass('gwst-tree');
            this.defaults = {
                classname: '',
                id: '',
                context: false,
                select: false,
                doubleclick: false,
                hideByDefault: false,
                collapsible: false,
                toggle: false,
                icon: false,
                metadata: '',
                children: false,
                extra: '',
                description: false
            };
            
            this._template = tmpl([
                '<li class="',
                '<%= (context ? "context " : "") %>',
                '<%= (toggle ? "toggle " : "") %>',
                '<%= (select ? "select " : "unselectable ") %>',
                '<%= (doubleclick ? "doubleclick " : "") %>',
                '<%= (hideByDefault ? "hideByDefault " : "") %>',
                '<%= classname %> <%= id %> <%= metadata %> gwst-tree-item',
                '">',
                    '<% if(collapsible) { %>',
                        '<span class="collapsible"><img src="/site-media/images/core/arrow-right.png" width="9" height="9" /></span>',
                    '<% } %>',
                    '<% if(toggle) { %>',
                        '<input type="checkbox"></input>',
                    '<% } %>',
                    '<% if(icon) { %>',
                        '<img class="icon" src="<%= icon %>" width="16" height="16" />',
                    '<% } %>',
                    '<a href="#"><%= name %></a>',
                    '<span class="badges"><%= extra %></span>',
                    '<% if(description){ %>',
                        '<p class="description"><%= description %></p>',
                    '<% } %>',
                    '<% if(children) { %>',
                    '<% if(collapsible) { %>',
                    '<ul style="display:none;"><%= children %></ul>',
                    '<% }else{ %>',
                    '<ul><%= children %></ul>',
                    '<% } %>',
                    '<% } else if(collapsible) { %>',
                        '<ul style="display:none;"></ul>',
                    '<% } %>',
                '</li>'
            ].join(''))
            
            $(this).find('span.collapsible').live('click', function(event){
                event.preventDefault();
                // alert('collapsible click');
                var list = $(this).parent().find('>ul');
                if(list.find('li').length == 0){
                    list.html('<p class="no-items">No items. You need to add them.</p>');
                }else{
                    list.find('p.no-items').remove();
                }
                if(list.css('display') == 'none'){
                    $(this).toggleClass('expanded', true);
                }else{
                    $(this).toggleClass('expanded', false);
                }
                if(event && event.button != undefined){
                    list.slideToggle('fast');
                }else{
                    list.toggle();
                }
                var img = $(this).find('img');
                if($(this).find('img[src*=/site-media/images/core/arrow-right.png]').length != 0){
                    img.attr('src', "/site-media/images/core/arrow-down.png");
                }else{
                    img.attr('src', "/site-media/images/core/arrow-right.png");
                }
                return false;
            });
            
            $(this).find('li.gwst-tree-item a').live('dblclick', function(event){
                if($(event.target).parent().hasClass('doubleclick')){
                    $(self.element).trigger('itemDoubleClick', [$(event.target).parent().metadata(), event]);
                }
                event.preventDefault();
                return false;
            });
                        
            $(this).find('li a').live('contextmenu', function(event){
                var item = $(event.target).parent();
                if(item.hasClass('context')){
                    self.element.trigger('itemContext', [event, item.metadata(), item]);
                }
                event.preventDefault();
                return false;
            });
            
            $(this).find('li.gwst-tree-item a').live('click', function(event){
                if(event.button == 2){
                    
                }else{
                    var parent = $(event.target).parent();
                    if(parent.hasClass('select')){
                        var e = jQuery.Event("itemSelect");
                        self.element.trigger(e, [parent.metadata(), parent]);
                        if(!e.isDefaultPrevented()){
                            self.selectItem(parent);
                        }
                    }else{
                        var e = jQuery.Event("itemSelect");
                        self.element.trigger(e, [parent.metadata(), parent]);
                        if(!e.isDefaultPrevented()){
                            self.clearSelection();
                        }
                    }
                    event.preventDefault();
                    return false;
                }
            });

            $(this).find('li span.collapsible, li span.collapsible a').live('contextmenu', function(event){
                event.preventDefault();
                return false;
            });
            // $(this).find('li').live('click', function(event){
            //     // var sorted = jQuery.makeArray($(event.target).find('>ul>li').sort(function(a, b){
            //     //     return $(a).data('data') != undefined && $(b).data('data') != undefined && $(a).data('data').date_modified > $(b).data('data').date_modified;
            //     // }));
            //     // var ul = $(event.target).find('>ul');
            //     // ul.empty('');
            //     // for(var i=0; i<sorted.length; i++){
            //     //     ul.append(sorted[i]);
            //     // }
            // });
            
            $(this).find('li.gwst-tree-item input[type=checkbox]').live('click', function(e){
                var element = $(this);
                var checked = element.attr('checked');
                var parent = element.parent();
                if(parent.hasClass('selected')){
                    var e = jQuery.Event('itemSelect');
                    self.element.trigger(e, [null, null]);
                    if(!e.isDefaultPrevented()){
                        self.clearSelection();
                    }
                }
                var clickedData = [parent.metadata()];
                var list = parent.find('>ul');
                if(list.length > 0){
                    self._toggleCheckboxes(list, checked, clickedData);
                }
                // if(checked == true){
                parent.parents('li.toggle').each(function(){
                    var el = $(this);
                    if(checked == true){
                        el.find(' > input[type=checkbox]').attr('checked', true);
                    }else{
                        if(el.find('> ul input[type=checkbox][checked=true]').length == 0){
                            el.find('> input[type=checkbox]').attr('checked', false);
                        }
                        if(el.hasClass('selected')){
                            self.clearSelection();
                            self.element.trigger('itemSelect', [null, null]);
                        }
                    }
                });
                self.element.trigger('itemToggle', [clickedData, checked]);
                if(checked == false){
                    if(parent.find('li.selected').length > 0){
                        parent.find('li.selected').removeClass('selected');
                        var e = jQuery.Event("itemSelect");
                        self.element.trigger(e, [null, null]);
                    }
                }
            });
        },
        
        checkItem: function(item){
            var wasHidden = false;
            if(typeof item == 'string'){
                item = this.element.find(item);
            }else{
                item = $(item);
            }
            var input = item.find('>input');
            var wasChecked = input.attr('checked');
            if(!wasChecked){
                input.click();
            }
        },
        
        selectItem: function(item, scrollTo){
            var wasHidden = false;
            if(typeof item == 'string'){
                item = this.element.find(item);
                wasHidden = this._expandAndToggleRecursive(item);
            }else{
                item = $(item);
            }
            var input = item.find('>input');
            var wasChecked = input.attr('checked');
            if(!wasChecked){
                input.click();
            }
            
            var list = item.find('>ul');
            var checked = []
            if(list.length > 0){
                this._toggleCheckboxes(list, true, checked);
            }
            if(!wasChecked || checked.length){
                this.element.trigger('itemToggle', [checked, true]);
            }
            
            var data = [];
            this.clearSelection();
            this._toggleCheckboxes(item, true, data);
            item.addClass('selected');
            
            if(scrollTo){
                var s = (this.options.scrollEl) ? $(this.options.scrollEl) : $(this.element).parent();
                var parent = s.parent();
                var ph = parent.height();
                var st = s.scrollTop();
                var visibleBounds = [st, st + ph - 20];
                var position = $(item).position().top + st;
                if(position > visibleBounds[0] && position < visibleBounds[1]){
                    // already visible
                }else{
                    s.scrollTop(position - (ph / 2) + 20);
                }
            }
        },
        
        _expandAndToggleRecursive: function(item, wasHidden){
            if(!(wasHidden === true || wasHidden === false)){
                wasHidden = false;
            }
            var parent = item.parent().parent();
            if(parent.hasClass('gwst-tree-item')){
                if(parent.find('>ul:visible').length == 0){
                    wasHidden = true;
                    parent.find('>span.collapsible').click();
                }
                var input = parent.find('>input');
                if(input){
                    input.attr('checked', true);
                }
                return this._expandAndToggleRecursive(parent, wasHidden);
            }else{
                return wasHidden;
            }
        },
        
        clearSelection: function(){
            $(".gwst-tree li.selected").removeClass('selected');
        },
        
        _toggleCheckboxes: function(el, state, data){
            var self = this;
            el.find('>li.toggle').each(function(){
                var hideByDefault = $(this).hasClass('hideByDefault');
                if(hideByDefault && state){
                    // do nothing
                }else{
                    // dont uncheck hideByDefault nodes that are already unchecked
                    var input = $(this).find('>input');
                    // this code might not work for deeply nested trees, needs
                    // testing for use cases other than array->mpa
                    if(input.attr('checked') != state){
                        input.attr('checked', state);
                        data.push($(this).metadata());
                    }
                    var ul = $(this).find('>ul');
                    if(ul.length > 0){
                        self._toggleCheckboxes(ul, state, data);
                    }
                }
            });
        },

        add: function(options){
            var element = this._rTemplate(options);
            var parent;
            if(typeof options['parent'] == 'string'){
                parent = this.element.find(options['parent']);
            }else if(typeof options['parent'] == 'undefined'){
                parent = this.element;
            }else{
                parent = options['parent'];
            }
            if(parent == this.element){
                var ul = parent;
            }else{
                var ul = parent.find('>ul');
                if(ul.size() == 0){
                    parent.append('<ul></ul>');
                    var ul = parent.find('>ul');
                }
            }
            if(ul.find('li').length == 0){
                ul.html('');
            }
            ul.append(element);
            var element = ul.find('.'+options['id']);
            options = null;
            return element;
        },
        
        renderTemplate: function(options){
            if(jQuery.isArray(options)){
                var strings = [];
                for(var i=0;i<options.length;i++){
                    strings.push(this._rTemplate(options[i]));
                }
                return strings.join('');
            }else{
                var string = this._rTemplate(options);
                return string;
            }
        },
        
        _rTemplate: function(options){
            return this._template(
                jQuery.extend({}, this.defaults, options)
            );
        },
        
        nodeExists: function(selector){
            if(this.element.find(selector).length > 0){
                return true;
            }else{
                return false;
            }
        }
    }

    $.widget('gwst.tree', Tree);
    
    $.extend($.gwst.tree, {
        getter: ['add', 'nodeExists', 'renderTemplate'],
        defaults: {
            // uses micro-templating. 
            // See http://ejohn.org/blog/javascript-micro-templating/
            defaultItemTemplate: '<li><h3><%= name %></h3></li>',
            categoryTemplate: '<li><h2><img src="<%= ( obj.icon ? icon : "/site-media/images/silk/icons/folder.png") %>" width="9" height="9" /><%= label %></h2></li>',
            idProperty: 'id',
            modelProperty: 'model',
            modelTemplates: {},
            scrollEl: false,
            contextMenu: function(event, element, id){
                
            }
        }
    });
    
    // var CustomTree = $.extend({}, $.gwst.tree.prototype);
    
})(jQuery);