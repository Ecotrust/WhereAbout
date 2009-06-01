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

gwst.ui.form = {};

gwst.ui.form.show = function(url, success, error, cancel, html){
    options = {
        closable: false,
        afterRender: function(){
            var w = $('#gwst-htmlmodal');
            w.find('input:first').focus();
            w.find('input[value="cancel"]').click(function(){
                gwst.ui.modal.hide();
                if(cancel){
                    cancel();
                }
            });
            w.find('form').submit(function(){
                gwst.ui.modal.hide(true, true);
                gwst.ui.wait.show({});
                $.ajax({
                    url: url,
                    dataType: 'json',
                    data: $(this).serialize(),
                    type: 'POST',
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        if(XMLHttpRequest.status == 400){
                            gwst.ui.modal.hide(true, true);
                            gwst.ui.form.show(url, success, error, cancel, XMLHttpRequest.responseText);
                        }else if(XMLHttpRequest.status == 401){
                            gwst.ui.error.show({
                                errorText: 'You must be logged in to perform this operation.'
                            });                        
                        }else if(XMLHttpRequest.status == 403){
                            gwst.ui.error.show({
                                errorText: 'You cannot modify objects owned by other users.'
                            });
                        }else if(XMLHttpRequest.status == 404){
                            gwst.ui.error.show({
                                errorText: 'The object you are trying to edit does not exist.'
                            });
                        }else{
                            gwst.ui.error.show({
                                errorText: 'An unknown server error occured. Please try again later.'
                            });
                        }
                    },
                    success: function(data, textStatus){
                        success(data);
                    }
                });
                return false;
            });
            
        },
        errorCallback: function(something, textStatus, XMLHttpRequest){
            if(XMLHttpRequest.status == 400){
                gwst.ui.modal.hide(true, true);
                gwst.ui.form.show(url, success, error, cancel, XMLHttpRequest.responseText);
            }else if(XMLHttpRequest.status == 401){
                gwst.ui.error.show({
                    errorText: 'You must be logged in to perform this operation.'
                });                        
            }else if(XMLHttpRequest.status == 403){
                gwst.ui.error.show({
                    errorText: 'You cannot modify objects owned by other users.'
                });
            }else if(XMLHttpRequest.status == 404){
                gwst.ui.error.show({
                    errorText: 'The object you are trying to edit does not exist.'
                });
            }else{
                gwst.ui.error.show({
                    errorText: 'An unknown server error occured. Please try again later.'
                });
            }
        }
    }
    if(html){
        options['html'] = html;
    }else{
        options['url'] = url;
    }
    gwst.ui.modal.show(options);
}

gwst.ui.form.hide = function(){
    gwst.ui.model.hide();
}