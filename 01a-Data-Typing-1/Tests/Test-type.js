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
			value: FooBar
		}
	});

	var constructorsOfObjects = [	
		Foo,
		Bar,
		FooBar,
		Fii,
		Object,
	];
	
	function TestConstructors() 
	{
		for (let i = 0; i < constructorsOfObjects.length; i++) 
		{
			const klass = constructorsOfObjects[i];
			
			display(type(new klass()) == "Object");
			display(type(klass.prototype) == "Object");
			display(type(Object.create(new klass())) == "Object");
			display(type(Object.create(klass.prototype)) == "Object");
		}
		
		display(type(new Function()) == "Function");
		display(type(Function.prototype) == "Object");
		display(type(Object.create(new Function())) == "Object");
		display(type(Object.create(Function.prototype)) == "Object");

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
		display(type(null) == "null");
		display(type(undefined) == "undefined");
		display(type(true) == "boolean");
		display(type(false) == "boolean");
		display(type(0) == "number");
		display(type(7) == "number");
		display(type("cat") == "string");
		display(type("") == "string");	
		display(type(Object.create(null)) == "Object");
	}


	function TestBigIntAndSymbol()
	{
		// BigInt and Symbol not defined in IE11.  BigInt not defined in Edge.		
			
		if(typeof BigInt != "undefined") 
		{
			const x = BigInt(7);
			display(type(x) == "bigint");         
			display(type(BigInt.prototype) == "Object");
			display(type(Object.create(BigInt.prototype)) == "Object"); // BigInt				
		}
			
		if(typeof Symbol != "undefined")
		{
			const y = Symbol();
			display(type(y) == "symbol");         
			display(type(Symbol.prototype) == "Object");
			display(type(Object.create(Symbol.prototype)) == "Object");	
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
			display(type(x) == klass.name);         
			//display(type(klass.prototype) == "Object"); 
			//display(type(Object.create(x)) == "Object");  
			//display(type(Object.create(klass.prototype)) == "Object");	 		
		}
	}
	
	function TestWeakSet()
	{
		if(typeof WeakSet != "undefined") // WeakSet not defined in IE11.
		{	
			const x = new WeakSet();
			display(type(x) == "WeakSet");         
			display(type(WeakSet.prototype) == "Object");
			display(type(Object.create(x)) == "Object"); 
			display(type(Object.create(WeakSet.prototype)) == "Object");	
		}	
	}
	
	
	function TestDataView()
	{
		var buffer = new ArrayBuffer(8);
		var view = new Int32Array(buffer);
		view[0] = 123;
		dataview = new DataView(buffer);
		
		display(type(dataview) == "DataView");
		display(type(DataView.prototype) == "Object");
		display(type(Object.create(dataview)) == "Object");
		display(type(Object.create(DataView.prototype)) == "Object");		
	}	
	
	
	function TestArguments()
	{			
		const args = (function()
		{
			return arguments;
		})();
		
		display(type(arguments) == "Arguments");
		display(type(Object.create(arguments)) == "Object");
	}
	
	function TestMisc()
	{
		display(type(Function.prototype) == "Object");
		display(type(Object.create(Function.prototype)) == "Object");	
		display(type(Object.prototype) == "Object");
		display(type(Object.create(Object.prototype)) == "Object");			
		display(type(Foo) == "Function");
		display(type(Object.create(Foo)) == "Object" );				
	}
		
	function TestHostObjects()
	{
		if(typeof window != "undefined")
		{
			display(type(window) == "Window"); 
			display(type(window.document) == "HTMLDocument");	
		}	
		else
		{
			display(type(globalThis) == "global");
		}	
	}
	
	function TestNullObjects()
	{
		const x = Object.create(null);
  		const y = Object.create(x);
		display(type(x) == "Object");
		display(type(y) == "Object");
	}
	
	/*function TestErrorPrototypes() duplicative
	{
		display(type(Error.prototype) == "Object"); 
		display(type(EvalError.prototype) == "Object"); 
		display(type(ReferenceError.prototype) == "Object"); 
		display(type(RangeError.prototype) == "Object"); 
		display(type(SyntaxError.prototype) == "Object"); 
		display(type(TypeError.prototype) == "Object"); 
		display(type(URIError.prototype) == "Object");			
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
		 
	
	
	
	
	
	