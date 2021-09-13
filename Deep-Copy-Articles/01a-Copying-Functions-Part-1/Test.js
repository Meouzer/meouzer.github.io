	"use strict";
		
	
	
	function Test()
	{
		var Z = 100;  // global variable

	    (function(){
	        // In some scope, not the global scope
	
	        // This local Z, and X are not ignored by evaluator 
	        // copies because the factory is written at this scope.
	        var Z = 0;
	        var X = 1;
	
	        const localFactory = eval(cefString);
	
	        const evaluator = localFactory({b:2, c:3});
	
	        const sum = evaluator(function(a){return a + b + c + Z});
	
	        console.log(sum(1));  // 1 + 2 + 3 + 0 = 6
	
	    })(); 
	}
	
	Test();
	
	
	
		