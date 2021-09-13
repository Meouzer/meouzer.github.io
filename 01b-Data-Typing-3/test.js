
	function Baz()
	{
		eval(makeTypeable('Baz'))	
	}		
			
	const x = new Baz();
	console.log(nativeType(x) === "Baz"); 
	console.log(nativeType(Baz.prototype) === "Object"); 
	console.log(nativeType(Object.create(Baz.prototype)) === "Object"); 
	console.log(nativeType(Object.create(x)) === "Object"); 
		
	console.log(type(x) === "Baz"); 
	console.log(type(Baz.prototype) === "Object"); 
	console.log(type(Object.create(Baz.prototype)) === "Object"); 
	console.log(type(Object.create(x)) === "Object"); 
