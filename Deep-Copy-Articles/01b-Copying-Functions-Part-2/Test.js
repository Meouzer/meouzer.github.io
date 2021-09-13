	"use strict";
		
	function Test1()
	{		
		var co = {"var a":{b:1}, "const b":0};
				
		var evaluator = eval(Evaluator)(co);	
				
		var setAdotB = evaluator(function(value){a.b = value;});
		var getAdotB = evaluator(function(){return a.b;});
			
		setAdotB (9);	
		
		var func = evaluator(function(){b = 89;});		
		func();
	
		var setB = evaluator(function(value){b = value;});
		var getB = evaluator2(function(){return b;});
		
	//	setB(111);
	//	alert(getB());
		
		try
		{
			const evaluator3 =  eval(Evaluator)();	
			function foo (){}
			const bar = evaluator3(foo);
		//	alert(bar);
		}
		catch(e)
		{
			alert(e.message + "\n" + e.lineNumber);
		}  
	}
	//Test1();

	function Test()
	{
		var Z = 100;  // global variable ignored because the evaluator is local

	    (function(){
	        // In some scope A, not the global scope
	
	        var Z = 0; // used since Z is local
	       	var b = 9; // local but not used since b is overriden by the context object. 
		
			const evaluator = eval(Evaluator)({b:2, "const c":3}); // or use "var b":2       
	
	        const sum = evaluator(function(a){return a + b + c + Z});
	
	        console.log(sum(1));  // 1 + 2 + 3 + 0 = 6
	        
	        const setC = evaluator(function(value){c = value}); 
	        
	        try
	        {
	        	setC(100); 
	        }
	        catch(e)
	        {
	        	console.log(e.message);
	        }	        
	
	    })();
	}
	
	//Test();
	
	
	
	
	
	
	
	
	
	/*
	function Test()
	{		
		var co = {"var a":{b:1}, "const b":0};
				
		var evaluator = eval(Evaluator)(co);
		var evaluator2 = eval(Evaluator)(co);		
				
		var setAdotB = evaluator(function(value){a.b = value;});
		var getAdotB = evaluator(function(){return a.b;});
			
		setAdotB (9);	
		
		var func = evaluator(function(){b = 89;});		
		func();
	
	//	alert(getAdotB());
					
		var setB = evaluator(function(value){b = value;});
		var getB = evaluator2(function(){return b;});
		
	//	setB(111);
	//	alert(getB());
		
		try
		{
			const evaluator3 =  eval(Evaluator)();	
			function foo (){}
			const bar = evaluator3(foo);
		//	alert(bar);
		}
		catch(e)
		{
			alert(e.message + "\n" + e.lineNumber);
		}  
	}

	*/
	
	
	
	
	
		