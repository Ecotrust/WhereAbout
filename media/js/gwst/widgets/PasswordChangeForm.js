Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PasswordChangeForm = Ext.extend(Ext.form.FormPanel, {
    // Constructor Defaults, can be overridden by user's config object
    // id: 'frmChangePassword',

    initComponent: function() {
        var submitAction = {
            text: 'Change my password',
            scope: this,
            handler: function() {
                var mask = new Ext.LoadMask(this.getEl(), {msg: 'Changing your password...'});
                mask.show();
                this.buttons[0].disable();
                this.form.submit({
                    url: gwst.urls.changePassword,
                    method: 'POST',
                    success: function(theForm, responseObj) {
                        mask.hide();
                        this.buttons[0].enable();
                        this.ownerCt.hide();
                        this.hide();
                        Ext.Msg.alert('Password Changed!', 'An email has been sent with your new password.');
                    },
                    failure: function(theForm, responseObj) {
                        mask.hide();
                        if(responseObj.result){
                            Ext.Msg.alert('There was a problem changing your password', responseObj.result.message);
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
            title: 'Change Your Password',
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
                        html: '<h1>Want to change your password?</h1><p style="margin-bottom:15px;">Enter your old and new passwords below, and we\'ll email your new password to the email address we have on file.</p>'
                    }
                }
                , {
                    fieldLabel: 'Enter your old password',
                    name: 'password_old',
                    allowBlank: false,
                    inputType: 'password'
                }
                , {
                    fieldLabel: 'Enter your new password',
                    name: 'password_new',
                    allowBlank: false,
                    inputType: 'password'
                }
                , {
                    fieldLabel: 'Confirm your new password',
                    name: 'password_confirm',
                    allowBlank: false,
                    inputType: 'password'
                }
            ]

        });

        gwst.widgets.PasswordChangeForm.superclass.initComponent.apply(this, arguments);
        //this.show();
        var form = this.getForm();
        setTimeout(function(){
            var field = form.findField('password_old');
            if(field){
                field.focus();
            }
        }, 200);
    }

});