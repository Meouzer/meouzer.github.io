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
		Bar,
		FooBar,
		Fii,
		//Object,
	];
	
	function TestConstructors() 
	{
		for (let i = 0; i < constructorsOfObjects.length; i++) 
		{
			const klass = constructorsOfObjects[i];
			display(dtype(new klass()) == klass.name );			
			display(dtype(klass.prototype) == klass.name + "[Prototype]");			
			display(dtype(Object.create(new klass())) == klass.name + "[Object(2)]");
			display(dtype(Object.create(klass.prototype)) == klass.name);
		}
		
		display(dtype(new Object()) == "Object");
		display(dtype(Object.prototype) == "Object[Prototype]");
		display(dtype(Object.create(new Object())) == "Object(2)");
		display(dtype(Object.create(Object.prototype)) == "Object");
		
		display(dtype(new Function()) == "Function");
		display(dtype(Function.prototype) == "Function[Prototype]");
		display(dtype(Object.create(new Function())) == "Function[Object(2)]");		
		display(dtype(Object.create(Function.prototype)) == "Function[Object]");

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
		display(dtype(null) == "null");
		display(dtype(undefined) == "undefined");
		display(dtype(true) == "boolean");
		display(dtype(false) == "boolean");
		display(dtype(0) == "number");
		display(dtype(7) == "number");
		display(dtype("cat") == "string");
		display(dtype("") == "string");	
		display(dtype(Object.create(null)) == "NullObject");
	}


	function TestBigIntAndSymbol()
	{
		// BigInt and Symbol not defined in IE11.  BigInt not defined in Edge.		
			
		if(typeof BigInt != "undefined") 
		{
			const x = BigInt(7);
			display(dtype(x) == "bigint");         
			display(dtype(BigInt.prototype) == "BigInt[Prototype]");
			display(dtype(Object.create(BigInt.prototype)) == "BigInt[Object]"); // BigInt				
		}
			
		if(typeof Symbol != "undefined")
		{
			const y = Symbol();
			display(dtype(y) == "symbol");         
			display(dtype(Symbol.prototype) == "Symbol[Prototype]");
			display(dtype(Object.create(Symbol.prototype)) == "Symbol[Object]");	
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
			display(dtype(x) == klass.name);         
			display(dtype(klass.prototype) == klass.name + "[Prototype]"); 
			display(dtype(Object.create(x)) == klass.name + "[Object(2)]"); 			
			display(dtype(Object.create(klass.prototype)) == klass.name + "[Object]");	 		
		}
	}
	
	function TestWeakSet()
	{
		if(typeof WeakSet != "undefined") // WeakSet not defined in IE11.
		{	
			const x = new WeakSet();
			display(dtype(x) == "WeakSet");         
			display(dtype(WeakSet.prototype) == "WeakSet[Prototype]");
			display(dtype(Object.create(x)) == "WeakSet[Object(2)]"); 
			display(dtype(Object.create(WeakSet.prototype)) == "WeakSet[Object]");	
		}	
	}
	
	
	function TestDataView()
	{
		var buffer = new ArrayBuffer(8);
		var view = new Int32Array(buffer);
		view[0] = 123;
		dataview = new DataView(buffer);
		
		display(dtype(dataview) == "DataView");
		display(dtype(DataView.prototype) == "DataView[Prototype]");
		display(dtype(Object.create(dataview)) == "DataView[Object(2)]");
		display(dtype(Object.create(DataView.prototype)) == "DataView[Object]");		
	}	
	
	
	function TestArguments()
	{			
		const args = (function()
		{
			return arguments;
		})();
		
		display(dtype(arguments) == "Arguments");
		display(dtype(Object.create(arguments)) == "Object(2)");
	}
	
	function TestMisc()
	{
		display(dtype(Function.prototype) == "Function[Prototype]");
		display(dtype(Object.create(Function.prototype)) == "Function[Object]");	
		display(dtype(Object.prototype) == "Object[Prototype]");
		display(dtype(Object.create(Object.prototype)) == "Object");			
		display(dtype(Foo) == "Function");
		display(dtype(Object.create(Foo)) == "Function[Object(2)]" );				
	}
		
	function TestHostObjects()
	{
		if(typeof window != "undefined")
		{
			display(dtype(window) == "Window"); 
			display(dtype(window.document) == "HTMLDocument");	
		}	
		else
		{
			display(dtype(globalThis) == "global");
		}	
	}
	
	function TestNullObjects()
	{
		const x = Object.create(null);
  		const y = Object.create(x);
		display(dtype(x) == "NullObject");
		display(dtype(y) == "NullObject(2)");
	}
	
	/*function TestErrorPrototypes() duplicative
	{
		display(dtype(Error.prototype) == "Object"); 
		display(dtype(EvalError.prototype) == "Object"); 
		display(dtype(ReferenceError.prototype) == "Object"); 
		display(dtype(RangeError.prototype) == "Object"); 
		display(dtype(SyntaxError.prototype) == "Object"); 
		display(dtype(TypeError.prototype) == "Object"); 
		display(dtype(URIError.prototype) == "Object");			
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
		 
	
	
	
	
	
	