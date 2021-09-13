	//"use strict";
	
	function isInStrictMode(func)
	{
		try
		{
			const dummy = func.caller;  // for functions 
			const dummy2 = func.callee; // for arguments
			return false;
		}
		catch(e)
		{
			return true;
		}	
	}

	function globalEvaluator()
	{ 		
		if(isInStrictMode(arguments[0]))  // CAN WE GET RID OF THIS CASE???? Regular evaluators don't check for strict mode.
		{
			return (function()
			{
				"use strict";
				return eval('('+arguments[0]+')');
			})(arguments[0]);			
		}
		else
		{			
			return (function()
			{	
				return eval('('+arguments[0]+')');
			})(arguments[0]);
		}
	}
	
	Object.defineProperty(Object, 'keyValues',
	{
	       value:function(X)
	       {
	           return Object.keys(X).map(function(x){return X[x];});
	       }
	 });	
	
	const ceFactory = function()
    {
        // The context object is arguments[0]. We can't use
        // variables.  

        return eval("(function(" + Object.keys(arguments[0]) + ")\
          {\
              return function(){return eval('('+arguments[0]+')');}\
          }).apply(null,Object.keyValues(arguments[0]));");
    }
	
	const cefString = '('+ ceFactory + ')';
//=========================================================================================================	
	
	function writeVars(contextObject)
	{	
		var vars = "";
		
		if(contextObject != null && typeof contextObject == "object")
		{
			const regVar = /^(var |let |const )?([a-zA-z_$][a-zA-z_$0-9]*)$/;		
									
			for(let i = 0, keys = Object.keys(contextObject), length = keys.length; i < length; i++)
			{
				var a = regVar.exec(keys[i]);
				vars +=	(a[1]?a[1]:"var ") + a[2] + " = arguments[0]['" + keys[i] + "'];"; 
			}
		}
								
		return vars;
	}
	
		
	function getEvaluator()
	{	
		return eval("(function()\
		{"				
			+ 
				writeVars(arguments[0])			
			+
						
			"return function(){return eval('('+arguments[0]+')');}\
		});")(arguments[0]);
	}

	const Evaluator = '(' + getEvaluator + ')';
	
	
	

	