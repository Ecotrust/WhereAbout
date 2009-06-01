Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PasswordResetForm = Ext.extend(Ext.form.FormPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function() {

        var submitAction = {
            text: 'Reset my password',
            scope: this,
            handler: function() {
                //Display status text
                var mask = new Ext.LoadMask(this.getEl(), {msg: 'Resetting your password...'});
                mask.show();
                        
                this.buttons[0].disable();
                this.form.submit({
                    url: gwst.urls.sendPassword,
                    method: 'POST',
                    success: function(theForm, responseObj) {
                        mask.hide();
                        this.buttons[0].enable();
                        this.ownerCt.hide();
                        this.hide();
                        Ext.Msg.alert('Password Reset!', 'An email has been send with your new password.');
                    },
                    failure: function(theForm, responseObj) {
                        mask.hide();
                        if(responseObj.result){
                            Ext.Msg.alert('There was a problem resetting your password', responseObj.result.message);
                            this.ownerCt.hide();
                            this.hide();
                        }else{
                            // validation of the form failed
                            Ext.Msg.alert('', 'Please correct any errors in the form.');
                            this.buttons[0].enable();
                        }
                    },
                    scope: this
                });
            }
        }

        var cancelAction = {
            text: 'Cancel',
            scope: this,
            handler: function() {
                this.ownerCt.hide();
                this.hide();
            }
        }


        var keyAction = {
            key: Ext.EventObject.ENTER,
            fn: submitAction.handler,
            scope: this
        }


        Ext.apply(this, {
            url: gwst.urls.sendPassword,
            method: 'POST',
            frame: true,
            title: 'Reset Password',
            bodyStyle: 'padding:5px 5px 0',
            labelWidth: 150,
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
                    xtype: 'container',
                    autoEl: {
                        html: '<h1>Did you forget your password?</h1><p style="margin-bottom:15px;">Enter your username below, and we\'ll email a NEW password to the email address we have on file.</p>'
                    }
                }
                , {
                    fieldLabel: 'Enter your username',
                    name: 'username',
                    allowBlank: false
                }
            ]

        });

        gwst.widgets.PasswordResetForm.superclass.initComponent.apply(this, arguments);
        var form = this.getForm();
        setTimeout(function(){
            var field = form.findField('username');
            if(field){
                field.focus();
            }
        }, 200);
    }

});