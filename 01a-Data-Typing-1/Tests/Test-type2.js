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
			
			display(type2(new klass()) == "Object");
			display(type2(klass.prototype) == "Object");
			display(type2(Object.create(new klass())) == "Object");
			display(type2(Object.create(klass.prototype)) == "Object");
		}
		
		display(type2(new Function()) == "Function");
		display(type2(Function.prototype) == "Object");
		display(type2(Object.create(new Function())) == "Object");
		display(type2(Object.create(Function.prototype)) == "Object");

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
		display(type2(null) == "null");
		display(type2(undefined) == "undefined");
		display(type2(true) == "boolean");
		display(type2(false) == "boolean");
		display(type2(0) == "number");
		display(type2(7) == "number");
		display(type2("cat") == "string");
		display(type2("") == "string");	
		display(type2(Object.create(null)) == "Object");
	}


	function TestBigIntAndSymbol()
	{
		// BigInt and Symbol not defined in IE11.  BigInt not defined in Edge.		
			
		if(typeof BigInt != "undefined") 
		{
			const x = BigInt(7);
			display(type2(x) == "bigint");         
			display(type2(BigInt.prototype) == "Object");
			display(type2(Object.create(BigInt.prototype)) == "Object"); // BigInt				
		}
			
		if(typeof Symbol != "undefined")
		{
			const y = Symbol();
			display(type2(y) == "symbol");         
			display(type2(Symbol.prototype) == "Object");
			display(type2(Object.create(Symbol.prototype)) == "Object");	
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
			display(type2(x) == klass.name);         
			display(type2(klass.prototype) == "Object"); 
			display(type2(Object.create(x)) == "Object");  
			display(type2(Object.create(klass.prototype)) == "Object");	 		
		}
	}
	
	function TestWeakSet()
	{
		if(typeof WeakSet != "undefined") // WeakSet not defined in IE11.
		{	
			const x = new WeakSet();
			display(type2(x) == "WeakSet");         
			display(type2(WeakSet.prototype) == "Object");
			display(type2(Object.create(x)) == "Object"); 
			display(type2(Object.create(WeakSet.prototype)) == "Object");	
		}	
	}
	
	
	function TestDataView()
	{
		var buffer = new ArrayBuffer(8);
		var view = new Int32Array(buffer);
		view[0] = 123;
		dataview = new DataView(buffer);
		
		display(type2(dataview) == "DataView");
		display(type2(DataView.prototype) == "Object");
		display(type2(Object.create(dataview)) == "Object");
		display(type2(Object.create(DataView.prototype)) == "Object");		
	}	
	
	
	function TestArguments()
	{			
		const args = (function()
		{
			return arguments;
		})();
		
		display(type2(arguments) == "Arguments");
		display(type2(Object.create(arguments)) == "Object");
	}
	
	function TestMisc()
	{
		display(type2(Function.prototype) == "Object");
		display(type2(Object.create(Function.prototype)) == "Object");	
		display(type2(Object.prototype) == "Object");
		display(type2(Object.create(Object.prototype)) == "Object");			
		display(type2(Foo) == "Function");
		display(type2(Object.create(Foo)) == "Object" );				
	}
		
	function TestHostObjects()
	{
		if(typeof window != "undefined")
		{
			display(type2(window) == "Window"); 
			display(type2(window.document) == "HTMLDocument");	
		}	
		else
		{
			display(type2(globalThis) == "global");
		}	
	}
	
	function TestNullObjects()
	{
		const x = Object.create(null);
  		const y = Object.create(x);
		display(type2(x) == "Object");
		display(type2(y) == "Object");
	}
	
	/*function TestErrorPrototypes() duplicative
	{
		display(type2(Error.prototype) == "Object"); 
		display(type2(EvalError.prototype) == "Object"); 
		display(type2(ReferenceError.prototype) == "Object"); 
		display(type2(RangeError.prototype) == "Object"); 
		display(type2(SyntaxError.prototype) == "Object"); 
		display(type2(TypeError.prototype) == "Object"); 
		display(type2(URIError.prototype) == "Object");			
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
		 
	
	
	
	
	
	