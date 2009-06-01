Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.LoginForm = Ext.extend(Ext.form.FormPanel, {
    // Constructor Defaults, can be overridden by user's config object
    // id: 'frmLogin',
    
    closeWindow: function(){
        this.ownerCt.hide();
        this.hide();
    },
    
    initComponent: function() {

        var submitAction = {
            text: 'Login',
            scope: this,
            handler: function() {
                var mask = new Ext.LoadMask(this.ownerCt.getEl(), {msg: 'Logging you in...'});
                mask.show();
                
                this.buttons[0].disable();
                this.form.submit({
                    url: gwst.urls.login,
                    method: 'POST',
                    scope: this,
                    success: function(theForm, responseObj) {
                        mask.hide();
                        this.buttons[0].enable();
                        this.closeWindow();
                        gwst.actions.utils.setUser(responseObj.result.returnObj.user);
                    },
                    failure: function(theForm, responseObj) {
                        mask.hide();
                        if (responseObj.failureType == 'client') {
                            alert('You must specify both a username and password.');
                        } else {
                            alert(responseObj.result.message);
                        }
                        this.buttons[0].enable();
                    },
                    scope: this
                });
            }
        }

        var cancelAction = {
            text: 'Cancel',
            scope: this,
            handler: this.closeWindow
        }

        var keyAction = {
            key: Ext.EventObject.ENTER,
            fn: submitAction.handler,
            scope: this
        }


        Ext.apply(this, {
            frame: true,
            title: 'Log in to gwst',
            bodyStyle: 'padding:5px 5px 0',
            defaults: {
                msgTarget: 'side'
            },
            defaultType: 'textfield',
            buttons: [
				submitAction,
                cancelAction
			],
            keys: [
			    keyAction
			],
            items: [
                {
                    fieldLabel: 'Login',
                    name: 'name',
                    allowBlank: false
                }, {
                    fieldLabel: 'Password',
                    name: 'password',
                    allowBlank: false,
                    inputType: 'password'
                }, {
                    xtype: 'container',
                    autoEl: {
                        html: '<a onclick="gwst.actions.currentLoginWindow.hide(); gwst.actions.resetPassword.execute(); return false;" href="#">Help I forgot my password!</a>'
                    }
                }
			]
        });

        gwst.widgets.LoginForm.superclass.initComponent.apply(this, arguments);

        var form = this.getForm();
        setTimeout(function(){
            var field = form.findField('name');
            if(field){
                field.focus();
            }
        }, 200);
    }

});
