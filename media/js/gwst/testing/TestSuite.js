Ext.namespace('gwst.testing');

/** Requires firebug or firebug-lite **/
gwst.testing.TestSuite = function(name, tests){
    this.name = name;
    this.tests = tests;
    this.assertions = 0;
    this.failures = 0;
    this.errors = 0;
    this.currentTest = null;
    
    this.runTests = function(){
        this.assertions = 0;
        this.errors = 0;
        this.numTests = 0;
        this.failures = 0;
        console.log("Running " + this.name + '...')
        for(var key in tests){
            this.numTests = this.numTests + 1;
            try{
                this.currentTest = key;
                tests[key](this);
            }catch(e){
                this.errors = this.errors + 1;
                console.error(key + ' has errors');
                console.error(e);
            }
        }
        var message = this.finishedMessage(
            this.numTests, 
            this.assertions, 
            this.failures, 
            this.errors
        )
        if(this.errors > 0 || this.failures > 0){
            console.warn(message);
        }else{
            console.info(message);
        }
    };
    
    this.assert = function(bool, failComment){
        this.assertions = this.assertions + 1;
        if(bool){
            // log nothing to keep things non-verbose
        }else{
            this.failures = this.failures + 1;
            console.error(this.name + "." + this.currentTest + ' failure: ' + failComment);
        }
    };
    
    this.finishedMessage = function(tests, assertions, failures, errors){
        var message = "Finished running " + tests + " tests with ";
        message = message + assertions + " assertions, ";
        message = message + failures + " failures, ";
        message = message + errors + " errors";
        return message;
    }
};