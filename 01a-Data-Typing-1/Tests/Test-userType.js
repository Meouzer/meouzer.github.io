/*
	Test Classification.js for the following
	(1) isUserClassInstance()	
*/

	function display(b)
	{
		if(b === true)
		{
			console.log("true");
		}
		else
		{
			console.log("false **************************************");
		}
	}

	function Foo() { }
	function Bar(){}
	function FooBar(){}
	function Fii(){}
		
	Bar.prototype = Object.create(null,
	{
		constructor:
		{
			value:Bar
		}
	});

	FooBar.prototype = Object.create(Object.prototype,
	{
		constructor:
		{
			value: FooBar
		}
	});

	Fii.prototype = Object.create(Boolean.prototype,
	{
		constructor:
		{
			value: Fii
		}
	});

	var constructorsOfObjects = [	
		Foo,
		//Bar,
		//FooBar,
		//Fii,
		//Object,
	];
	
		
	function TestConstructors() 
	{
		for (let i = 0; i < constructorsOfObjects.length; i++) 
		{
			const klass = constructorsOfObjects[i];
			display(userType(new klass()) == klass.prototype.constructor.name);
			display(userType(klass.prototype) == "Object");
			display(userType(Object.create(new klass())) == "Object");
			display(userType(Object.create(klass.prototype)) == klass.prototype.constructor.name);
			
			
		}
		
		display(userType(new Function()) == "Function");
		display(userType(Function.prototype) == "Object");
		display(userType(Object.create(new Function())) == "Object");
		display(userType(Object.create(Function.prototype)) == "Object");	

	}

	
	var primitives = 
	[
		null,
		undefined,
		true,
		false,
		0,
		7,
		"cat",
		"",
		Object.create(null),
	];	

	function TestPrimitives()
	{
		display(userType(null) == "null");
		display(userType(undefined) == "undefined");
		display(userType(true) == "boolean");
		display(userType(false) == "boolean");
		display(userType(0) == "number");
		display(userType(7) == "number");
		display(userType("cat") == "string");
		display(userType("") == "string");	
		display(userType(Object.create(null)) == "Object");
	}


	function TestBigIntAndSymbol()
	{
		// BigInt and Symbol not defined in IE11.  BigInt not defined in Edge.		
			
		if(typeof BigInt != "undefined") 
		{
			const x = BigInt(7);
			display(userType(x) == "bigint");         
			display(userType(BigInt.prototype) == "Object");
			display(userType(Object.create(BigInt.prototype)) == "Object"); // BigInt				
		}
			
		if(typeof Symbol != "undefined")
		{
			const y = Symbol();
			//display(userType(y) == "symbol");         
			//display(userType(Symbol.prototype) == "Object");
			//display(userType(Object.create(Symbol.prototype)) == "Object");	
		}			
	}
	
	var klasses = [		
		Map,
		WeakMap,
		Set,
		ArrayBuffer,
		Boolean,
		Number,
		String,
		RegExp,
		Date,
		Array,		
		Int8Array,
		Uint8Array,
		Uint8ClampedArray,
		Int16Array,
		Uint16Array,
		Int32Array,
		Uint32Array,
		Float32Array,
		Float64Array,	
		Error,
		EvalError,
		ReferenceError,
		RangeError,
		SyntaxError,
		TypeError,
		URIError,			
		];
		
	
		
	function TestBuiltInClasses()
	{
		for(let i = 0; i < klasses.length; i++)
		{
			const klass = klasses [i];
			
			const x = new klass();			
			display(userType(x) == klass.name);         
			display(userType(klass.prototype) == "Object"); 
			display(userType(Object.create(x)) == "Object");  
			display(userType(Object.create(klass.prototype)) == "Object");	 		
		}
	}
	
	function TestWeakSet()
	{
		if(typeof WeakSet != "undefined") // WeakSet not defined in IE11.
		{	
			const x = new WeakSet();
			display(userType(x) == "WeakSet");         
			display(userType(WeakSet.prototype) == "Object");
			display(userType(Object.create(x)) == "Object"); 
			display(userType(Object.create(WeakSet.prototype)) == "Object");	
		}	
	}
	
	
	function TestDataView()
	{
		var buffer = new ArrayBuffer(8);
		var view = new Int32Array(buffer);
		view[0] = 123;
		dataview = new DataView(buffer);
		
		display(userType(dataview) == "DataView");
		display(userType(DataView.prototype) == "Object");
		display(userType(Object.create(dataview)) == "Object");
		display(userType(Object.create(DataView.prototype)) == "Object");		
	}	
	
	
	function TestArguments()
	{			
		const args = (function()
		{
			return arguments;
		})();
		
		display(userType(arguments) == "Arguments");
		display(userType(Object.create(arguments)) == "Object");
	}
	
	function TestMisc()
	{
		display(userType(Function.prototype) == "Object");
		display(userType(Object.create(Function.prototype)) == "Object");	
		display(userType(Object.prototype) == "Object");
		display(userType(Object.create(Object.prototype)) == "Object");			
		display(userType(Foo) == "Function");
		display(userType(Object.create(Foo)) == "Object" );				
	}
		
	function TestHostObjects()
	{
		if(typeof window != "undefined")
		{
			display(userType(window) == "Window"); 
			display(userType(window.document) == "HTMLDocument");	
		}	
		else
		{
			display(userType(globalThis) == "global");
		}	
	}
	
	function TestNullObjects()
	{
		const x = Object.create(null);
  		const y = Object.create(x);
		display(userType(x) == "Object");
		display(userType(y) == "Object");
	}
	
	/*function TestErrorPrototypes() duplicative
	{
		display(userType(Error.prototype) == "Object"); 
		display(userType(EvalError.prototype) == "Object"); 
		display(userType(ReferenceError.prototype) == "Object"); 
		display(userType(RangeError.prototype) == "Object"); 
		display(userType(SyntaxError.prototype) == "Object"); 
		display(userType(TypeError.prototype) == "Object"); 
		display(userType(URIError.prototype) == "Object");			
	}*/
	
	//TestErrorPrototypes();
	
	TestConstructors();   // passed (Node.js) (Firefox) (Edge) (Chrome) (Opera) (IE11)	 
	TestPrimitives();		// passed (Node.js) (Firefox) (Edge) (Chrome) (Opera) (IE11) 	
	TestBigIntAndSymbol();	// passed (Firefox) (Edge: BigInt not defined in Edge) (Chrome) (Opera) (BigInt and Symbol not defined in IE11)
	TestBuiltInClasses();		// passed (Node.js) (Firefox) (Edge) (Chrome) (Opera) (FAILED IE11)	 	
	TestDataView();			// passed (Node.js) (Firefox) (Edge) (Chrome) (Opera) (IE11)	
	TestWeakSet();			// passed (Node.js) (Firefox) (Edge) (Chrome) (Opera)	(WeakSet not defined in IE) 
	TestArguments();		// passed (Node.js) (Firefox) (Edge) (Chrome) (Opera)	(IE11)	 				
	TestMisc();				// passed (Node.js) (Firefox) (Edge) (Chrome) (Opera)	(IE11)			 				
	TestHostObjects();		// passed (Node.js) (Firefox) (Edge) (Chrome) (Opera) (IE11)
	TestNullObjects();		// passed (Node.js) (Firefox) (Edge)  (Chrome) (Opera) (IE11)
		 
	
	
	
	
	
	