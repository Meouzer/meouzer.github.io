

function TestGetsOnly()
	{
		const z = {};
		const x = {};
		const y = {a:1};
				
		Object.defineProperty(z, "x",
		{
			get:function(){return x;},
			//set:function(value){x = value;}

		});
		
		Object.defineProperty(x, "y",
		{
			get:function(){return y;},
			//set:function(value){y = value;}
		});
		
		Object.defineProperty(y, "z",
		{
			get:function(){return z;},
		});
		
		var dcs = eval(deepCopySystem)({z:z, x:x, y:y});
		var cz = dcs.z;
		console.log("TestGetsOnly passed: " + compareObjects(z,cz) );			
	}

	TestGetsOnly();
	
	
	function TestCircularReferenceWithGetsSets()
	{
		var x = {q:100}, y = {q:101};
		
		Object.defineProperty(x, "a",
		{
			get:function(){return y;},
			//set:function(value){y = value;}
		});
		
		Object.defineProperty(y, "b",
		{
			get:function(){return x;},			
			//set:function(value){x = value;}
		});
					
			
		var z = {M:x, N:y};	
		
		
		var dcs = eval(deepCopySystem)({z:z, x:x, y:y});
		var cz = dcs.z;

		
		console.log("ref test: " + (cz.M.a.b == cz.M));	
		
		console.log("TestCircularReferenceWithGetsSets passed: " + compareObjects(z,cz) );	
	}
	
	TestCircularReferenceWithGetsSets();
