	
	function TestDeepCopyLiteral()
	{	
		var x = {}, y = {}
		x.a = y;
		y.b = x;
		x.f = 1;
		y.g = 2;			
																
		var z = {M:x, N:y};				 			  			 		 	
		var cz = deepCopyLiteral(z);
					 			 	
		console.log("TestDeepCopyLiteral passed: " + (stringify(z) == stringify(cz)));
		console.log(stringify(z));
		console.log(stringify(cz));
	}
		
	TestDeepCopyLiteral();