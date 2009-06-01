if(typeof Ext != 'undefined'){
    Ext.namespace('gwst', 'gwst.ui');
}else{
    // Alternative setup for testing sans-ext
    if(typeof gwst != 'object'){
        gwst = {};
    }

    if(typeof gwst.ui != 'object'){
        gwst.ui = {};
    }
}

gwst.ui.handlers = {};

gwst.ui.copy = {
    failedToLoadContent: 'We could not load content from this url. The server may be experiencing temporary downtime. Please try again later, and contact an administrator if the error persists.',
    unknownError: 'An unknown error occurred. Please try again and if the problem persists, contact an administrator.',
    errorTitle: 'An Error Occurred',
    fatalErrorTitle: 'A Fatal Error Occurred',
    fatalErrorMsg: 'Due to the nature of this error, the application needs to be restarted. Please press the refresh button on your browser. We have been notified of the problem, but if the error persists please follow up with an administrator.',
    htmlLoadMessage: 'While we load this content.'
};

gwst.ui.showMask = function(){
    $('#gwst-mask').css('display', 'block');
};

gwst.ui.hideMask = function(){
    $('#gwst-mask').css('display', 'none');
};

gwst.ui.accessObjectProperty = function(object, propstring){
    var trail = propstring.split('.');
    for(var i = 0; i < trail.length; i++){
        object = object[trail[i]];
    }
    return object;
}

gwst.ui.modalManager = {
    currentModal: null,
    nextModal: null,
    display: function(modal){
        if(modal.isAsync(modal.options)){
            modal.startAsync(modal.options);            
            $(modal).bind('asyncDone', {mngr: this}, this.asyncDone);
            gwst.ui.wait.show({msg: modal.options['waitMsg']});
            this.nextModal = modal;
        }else{
            if(this.currentModal){
                this.nextModal = modal;
                if(this.currentModal.open){
                    // is either opening or open
                    if(this.currentModal.animating){
                        // is opening, close immediately
                        this.currentModal.hide(true, true);
                    }else{
                        // has been full opened. Play closing animation
                        this.currentModal.hide(true, false);
                    }
                }else{
                    // already closing, just wait for "hidden" event
                }
            }else{
                this.currentModal = modal;
                modal.display();
            }
            $(this.currentModal).bind('hidden', {mngr: this}, this.afterHide);
        }
    },
    
    afterHide: function(event){
        var m = event.data['mngr'];
        if(m.nextModal){
            m.currentModal = m.nextModal;
            $(m.currentModal).bind('hidden', event.handler);
            m.currentModal.display();
        }else{
            m.currentModal = null;
        }
        m.nextModal = null;
    },
    
    asyncDone: function(e, success){
        if(success){
            // if opening, close wait modal immediately. If the wait modal
            // has had enough time to open fully, animate its closing.
            e.data['mngr'].currentModal.hide(true, gwst.ui.wait.animating);
        }else{
            e.data['mngr'].nextModal = null;
        }
    }
}

gwst.ui.Modal = function(){
    this.options = {}
    this.animating = false;
    this.open = false;
    // var instance = this;
    
    this.show = function(opts){
        this.parseOpts(opts);
        gwst.ui.modalManager.display(this);
    };
        
    this.display = function(opts){
        var opts = this.options;
        gwst.ui.showMask();
        showElements(this.elements);
        this.render(this.options);
        this.open = true;
        this.animating = true;
        // Make reference to avoid scoping issue
        var i = this;
        // Using animate rather than show as show animates margins in 1.3.1,
        // Our centering since it is based on margin-left/right:auto;
        
        if(/chrome/.test(navigator.userAgent.toLowerCase())){
            $(this.animatedElement).show();
            i.animating = false;
            i.afterRender(i.options);
            if(i.options['afterRender']){
                i.options['afterRender'](i.options);
            }
            $(i).trigger('shown');
        }else{
            $(this.animatedElement).animate({
                    // order here is important. Height MUST come first or it will
                    // end up taller than it should and have to "pop back" after
                    // animating
                    height: 'show',
                    width: 'show',
                    opacity: 'show'
                },
                'fast',
                function(){
                    i.animating = false;
                    i.afterRender(i.options);
                    if(i.options['afterRender']){
                        i.options['afterRender'](i.options);
                    }
                    $(i).trigger('shown');
                }
            );        
        }        
    };
    
    this.hide = function(keepMask, immediately){
        $(this.animatedElement).stop(true, true);
        var cleanup = this.cleanup;
        var opts = this.options;
        var i = this;
        this.animating = true;
        this.open = false;
        this.beforeHide(this.options);
        if(immediately || /chrome/.test(navigator.userAgent.toLowerCase())){
            $(this.animatedElement).hide();
            this.animating = false;
            hideElements(this.elements);
            if(!keepMask){
                gwst.ui.hideMask();
            }
            this.cleanup(this.options);
            $(this).trigger('hidden');
        }else{
            $(this.animatedElement).animate({
                    height: 'hide',
                    width: 'hide',
                    opacity: 'hide'
                },
                'fast', 
                function(){
                    i.animating = false;
                    hideElements(i.elements);
                    if(!keepMask){
                        gwst.ui.hideMask();
                    }
                    i.cleanup(i.options);
                    $(i).trigger('hidden');
                }
            );        
        }
    };
    
    // called before animatedElement is shown
    this.render = function(opts){
        // override
    };
    
    // called after animatedElement is shown
    this.afterRender = function(opts){
        // override
    };
    
    this.beforeHide = function(opts){
        //override
    };
    
    // Called after modal is hidden
    this.cleanup = function(opts){
        // override
    };
    
    this.parseOpts = function(opts){
        if(typeof opts != 'object'){
            opts = {}
        }
        $.extend(this.options, this.defaults, opts);
        return this.options;
    };
    
    this.isAsync = function(opts){
        return false;
    };
    
    function showElements(elements){
        for(var i = 0; i<elements.length; i++){
            $(elements[i]).show();
        }
    };
    
    function hideElements(elements){
        for(var i = 0; i<elements.length; i++){
            $(elements[i]).hide();
        }
    };
    
    function showContent(el, callback){
        $(el).show('fast', callback);
    };
    
    function hideContent(el, callback){
        $(el).hide('fast', callback);
    };
    
    return true;
}

gwst.ui.Wait = function(){
    this.elements = ['#gwst-small-modals'];
    this.animatedElement = '#gwst-wait';
    this.defaults = {
        // default message is an empty string. Set to something more useful
        msg: ''
    };
    this.render = function(opts){
        $('#gwst-wait').find('p').html(opts['msg']);       
    },
    this.cleanup = function(opts){
        $('#gwst-wait').find('p').html('');
    }
};

gwst.ui.Wait.prototype = new gwst.ui.Modal();
gwst.ui.wait = new gwst.ui.Wait();

gwst.ui.Error = function(){
    this.elements = ['#gwst-small-modals'];
    this.animatedElement = '#gwst-error';
    this.defaults = {
        // Error message to display to the user
        errorText: gwst.ui.copy.unknownError,
        // Additional debugging information that is only shown to users who 
        // request it
        debugText: false,
        // A message to log to the server for recording client errors
        // See gwst.ui.logToServer
        logText: false,
        // If fatal, an error message cannot be closed and a message is logged
        // to the server
        fatal: false
    };
    
    this.render = function(opts){
        var error = $('#gwst-error');
        var button = $('#gwst-error').find('button');
        var heading = gwst.ui.copy.errorTitle;
        if(opts['fatal']){
            heading = gwst.ui.copy.fatalErrorTitle;
            // Change the message when fatal if it has been unchanged from
            // the default for normal errors
            if(opts['errorText'] == gwst.ui.copy.unknownError){
                opts['errorText'] = gwst.ui.copy.fatalErrorMsg;
            }
            button.hide();
        }else{
            button.show();
        }
        error.find('h3').html(heading);
        error.find('p').html(opts['errorText']);
        
        if(opts['logText'] || opts['fatal']){
            gwst.ui.logToServer(opts['logText']);
        }
    },
    
    this.afterRender = function(opts){
        // Only allow users to close the error if not fatal
        if(!opts['fatal']){
            var button = $('#gwst-error').find('button');
            button.focus();
            button.click(function(){gwst.ui.error.hide()});
        }
    },
    
    this.cleanup = function(opts){
        $('#gwst-error').find('p').html('');
    }
}

gwst.ui.Error.prototype = new gwst.ui.Modal();
gwst.ui.error = new gwst.ui.Error();


gwst.ui.ModalWindow = function(){
    this.elements = ['#gwst-large-modals'];
    this.animatedElement = '#gwst-htmlmodal';
    
    this.defaults = {
        // Width of the window, height cannot be specified
        width: 500,
        // Shows a close icon
        closable: true,
        // is excecuted after the window is fully loaded
        afterRender: false,
        // Set the html attribute for a syncronous window
        html: false,
        // fetches content from the url. Only set html or url, not both
        // url can be set using the jquery load() method syntax, meaning
        // you can specify only a certain element of the resulting page to
        // be rendered.
        // see http://docs.jquery.com/Ajax/load#urldatacallback
        url: false,
        // If setting a url, you also have all of the following options
        // Displays using a gwst.ui.wait dialog
        waitMsg: gwst.ui.copy.htmlLoadMessage,
        // Callback to excecute if fetching of the content from *url fails
        // This overrides normal error handling, which displays via 
        // gwst.ui.error
        errorCallback: false,
        // number of times to retry the request if there are any server-side
        // errors
        retries: 4,
        // see gwst.ui.logToServer
        logText: 'Problem loading url',
        // see gwst.ui.error
        fatal: false,
        // see gwst.ui.error
        errorText: gwst.ui.copy.failedToLoadContent
    };
    
    this.isAsync = function(opts){
        if(opts['html']){
            return false;
        }else{
            return true;
        }
    };
    
    this.startAsync = function(opts){
        // oh lord! It's pretty easy to see from the test that msie is
        // cacheing pages where it shouldn't
        if($.browser.msie){
            $.ajaxSetup({
                cache: false
            });            
        }
        var i = this;
        $('#gwst-htmlmodal').load(opts['url'], null, function(response, status, request){
            i.asyncHandler(response, status, request);
        });
    };
    
    this.asyncHandler = function(response, status, request){
        modal = $('#gwst-htmlmodal');
        if(status == 'error'){
            if(this.options['retries'] > 0){
                this.options['retries'] = this.options['retries'] - 1;
                var i = this;
                modal.load(this.options['url'], false, function(response, status, request){
                    i.asyncHandler(response, status, request);
                });
            }else{
                $(this).trigger('asyncDone', false);
                // gwst.ui.wait.hide(false);
                if(this.options['errorCallback']){
                    gwst.ui.wait.hide(false);
                    this.options['errorCallback'](response, status, request);
                }else{
                    this.options['logText'] = this.options['logText'] + ': ' + this.options['url'];
                    gwst.ui.error.show(this.options);
                }
            }
        }else{
            $(this).trigger('asyncDone', true);
        }
    };
    
    this.render = function(opts){
        var modal = $('#gwst-htmlmodal');
        modal.width(opts['width']);
        var buttons = $('#gwst-htmlmodalbuttons');
        if(opts['closable']){
            buttons.width(opts['width']);
            // $('#gwst-mask').bind('click', gwst.ui.hideHTMLModal);
            // register this, otherwise clicking on the modal, which is contained
            // by the mask, will trigger hideHTMLModal
            // $('#gwst-htmlmodal').bind('click', function(){return false;});
            $(document).bind('keydown', this.keydownHandler);
            $('#gwst-htmlmodal-close')[0].onclick = function(){
                gwst.ui.modal.hide();
                return false;
            };
        }else{
            // Do nothing, they should be hidden by the beforeHide method
        }
        if(opts['html']){
            modal.html(opts['html']);
        }else{
            // will be handled by this.beforeAsyncShow
        }
    };
    
    this.afterRender = function(opts){
        if(opts['closable']){
            $('#gwst-htmlmodalbuttons').show();
            $('#gwst-htmlmodal-close').show();
        }
    };
    
    this.beforeHide = function(opts){
        $('#gwst-htmlmodalbuttons').hide();
        $('#gwst-htmlmodal-close').hide();
    };
    
    this.cleanup = function(opts){
        // $('#gwst-mask').unbind('click', gwst.ui.hideHTMLModal);
        $(document).unbind('keydown', this.keydownHandler);
        var modal = $('#gwst-htmlmodal');
        modal.html('');
    };
    
    this.keydownHandler = function(event){
        // 88 = x
        // 27 = Esc
        if(event.keyCode == 88 || event.keyCode == 27){
             $('#gwst-htmlmodal-close').click();
            return false;
        }else{
        
        }
    };
}

gwst.ui.ModalWindow.prototype = new gwst.ui.Modal();
gwst.ui.modal = new gwst.ui.ModalWindow();

gwst.ui.logToServer = function(msg, success, error){
    $.ajax({
        type: 'POST',
        url: '/gwst/client-logger',
        data: {msg: msg},
        success: success,
        error: error
    });
};

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
  
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

gwst.ui.ContextMenu = {}
gwst.ui.ContextMenu.show = function(opts, data, target){
    gwst.ui.ContextMenu.clear();
    if(target){
        $(target).addClass('contextified');
    }
    if(!(opts['x'] && opts['y'] && opts['actions'])){
        throw('gwst.ui.ContextMenu.show(opts): you must specify "x", "y", and "actions".');
    }
    if(!opts['icon']){
        opts['icon'] = '';
    }
    var div = $('<div />');
    div.addClass('gwst-contextmenu');
    div.attr('style', 'left:'+opts['x']+'px;top:'+opts['y']+'px;');
    var ul = $('<ul />');
    div.append(ul);
    for(var i=0; i<opts['actions'].length; i++){
        var li = $('<li class="'+opts['actions'][i]['iconcls']+'"><span>'+opts['actions'][i]['name']+'</span></li>');
        li.bind('click', data, opts['actions'][i]['handler']);
        ul.append(li);
    }
    $('body').append(div);
    var width = div.width();
    div.width(width + 15);
    var height = div.height();
    if(jQuery.browser.msie){
        div.addClass('ie');
    }
    div.height(height);
    $('body').bind('click', gwst.ui.ContextMenu.clear);
};

gwst.ui.ContextMenu.clear = function(){
    $('.contextified').removeClass('contextified');
    $('body').unbind('click', gwst.ui.ContextMenu.clear);
    $('.gwst-contextmenu').remove();
};

// needs unit tests
gwst.ui.SelectionManager = function(){
    this.selectedFeature = null;
    
    this.setSelectedFeature = function(feature, caller, force){
        if(force || feature != this.selectedFeature){
            var oldFeature = this.selectedFeature;
            this.selectedFeature = feature;
            var event = jQuery.Event('selectionChange');
            if(caller){
                event.caller = caller;
            }
            $(this).trigger(event, [this, this.selectedFeature, oldFeature]);
        }
    };
    
    this.clearSelection = function(caller){
        var oldFeature = this.selectedFeature;
        this.selectedFeature = null;
        var event = jQuery.Event('selectionChange');
        if(caller){
            event.caller = caller;
        }
        $(this).trigger(event, [this, this.selectedFeature, oldFeature]);
    };
};