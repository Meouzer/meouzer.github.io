
	function TestObject(object)
	{
		const string = serializeSimpleData(object);
		const x = parseDataString(string);
				
		if(compareObjects(x,object))
		{
			console.log(true)
		}
		else
		{
			console.log("false ****************************************************");
		}
	}	

	function TestBigInt()
	{
		if(window["BigInt"]) TestObject(BigInt(1));  // make sure test 1 digit
	}
	//TestBigInt(); IE11 doesn't support BigInt
	
		
	function TestLevelOne()
	{ 
		TestObject({a:true, b:false, c:77, d:/ab/g, e:"cat", g:new Date()});
		TestObject([new Boolean(true)]);
		TestObject(["cat", 6, true, new Boolean(true)]);
		TestObject(true);
		TestObject(false);
		TestObject(777);
		TestObject("cat");
		TestObject(new Boolean(true));
		TestObject(new Boolean(false));
		TestObject(new Number(777));
		TestObject(new String("cat"));
		TestObject(new Date());
		TestObject(new RegExp(/abc/gi));
		TestObject(new Error("Error thrown"));
		TestObject(new Error());		
		TestObject(new EvalError("EvalError thrown"));
		TestObject(new EvalError());
		//TestObject(new InternalError("InternalError thrown")); // InternalError not standard
		//TestObject(new InternalError(""));
		TestObject(new RangeError("RangeError thrown"));
		TestObject(new ReferenceError("ReferenceError thrown"));
		TestObject(new SyntaxError("SyntaxError error thrown"));
		TestObject(new TypeError("TypeError error thrown"));
		TestObject(new URIError("URIError thrown"));	
		TestObject(new Int8Array([5, 7, 17]));
		TestObject(new Uint8Array([5, 7, 17]));	
		TestObject(new Uint8ClampedArray([5, 7, 17]));
		TestObject(new Int16Array([5, 7, 17]));
		TestObject(new Uint16Array([5, 7, 17]));
		TestObject(new Int32Array([5, 7, 17]));
		TestObject(new Uint32Array([5, 7, 17]));
		TestObject(new Float32Array([5, 7, 17]));
		TestObject(new Float64Array([5, 7, 17]));
		TestObject(new Set([777, true, false, new Boolean(false)]));	
		TestObject(new Map([[7,true], ['key1', 'value1'], ['key2', {a:1,b:2}], [new Boolean(true), new Number(7)] ]));		
		const buffer = new ArrayBuffer(4);
	    const view = new DataView(buffer);
	    view.setInt8(0, 127);
	    view.setInt8(1, 11);
	    view.setInt8(2, 17);
	   	view.setInt8(3, -17);		    
	    TestObject(buffer);
	    TestObject(view);			
	}
	
	TestLevelOne();
	
	function TestLevelTwo()
	{	
		var object = new String("cat");
		object.date = new Date();
		object.date.a = 1;
		object.date.b = 1;	
		object.date.b = new Number(7);			
		object.date.b.reg = /abc/ig;			
		object.date.b.reg.ta = new Uint8Array(5);			
		TestObject(object);	
	}
	
	TestLevelTwo();
	
	function TameTest()
 	{
 		const buffer = new ArrayBuffer(4);
	    const view = new DataView(buffer);
	    view.setInt8(0, 127);
	    view.setInt8(1, 11);
	    view.setInt8(2, 17);
	    view.setInt8(3, -17);
	    const map1 = new Map([ [[1,2], new Date()],   [7,true], ['key1', 'value1'] ]);	
 	
 		
 		//const x = new Set([new Number(1), new Number(2)]);
 		const x = new Set([1]);
 		x.buf = buffer;
 		 		
 		const deepCopy_x = parseDataString(serializeSimpleData(x));
 		 		
 		const param= {doHost:false, doWriteGetsSets:true, doAbbriviate:true, doPrototypes:false, doPropertyDescriptors:true};	
		console.log(stringify(x,param) === stringify(deepCopy_x, param));
		
		//console.log(stringify(x,param));
		//console.log(stringify(deepCopy_x,param));

 	 		
 		if(compareObjects(x, deepCopy_x) && type(x) === type(deepCopy_x))
		{
			console.log("Tame Test Passed: true");
		}
		else
		{
			console.log("Tame Test Passed: false");
		}
 	}
	
	TameTest();

		
	function WildTest()
	{	
		const buffer = new ArrayBuffer(4);
	    const view = new DataView(buffer);
	    view.setInt8(0, 127);
	    view.setInt8(1, 11);
	    view.setInt8(2, 17);
	    view.setInt8(3, -17);
	
		const map1 = new Map([ [[1,2], new Date()],   [7,true], ['key1', 'value1'] ]);	
		const map2 = new Map([ ['key2', {a:1,b:2}], [new Boolean(true), new Number(7)] ]);
		
		map1.buf = buffer;
		map2.view = view; 
		view.x = new Boolean(true);
		buffer.x = new Boolean(true);
			
		const x = new Set([map1, map2]);		
		x.a = new Date(1618595373337);
		x.a.b = new Set(["cat", "dog", ["a", new String("b")]]); 
				
		const deepCopy_x = parseDataString(serializeSimpleData(x));			
				
		if(compareObjects(x, deepCopy_x) && type(x) === type(deepCopy_x))
		{
			console.log("Wild Test Passed: true");
		}
		else
		{
			console.log("Wild Test Passed: false");
		}	
		
		//alert(serializeSimpleData(x));
	}
	
	WildTest();

	
	function WildCircularTest()
	{
		const buffer = new ArrayBuffer(4);
	    const view = new DataView(buffer);
	    view.setInt8(0, 127);
	    view.setInt8(1, 11);
	    view.setInt8(2, 17);
	    view.setInt8(3, -17);	
	    
		buffer[0] = "fred";
		view[0] = "fred";      
	
		const map1 = new Map([ [ [1,2], new Date()],   [7,true], ['key1', 'value1'], [buffer, view] ]);	
		const map2 = new Map([ ['key2', {a:1,b:2}], [new Boolean(true), new Number(7)] ]);
		
		map1.buf = buffer; buffer.z = map1;
		map2.view = view; 
		
		view.x = new Boolean(true);
		buffer.x = new Boolean(true);
			
		const x = new Set([map1, map2]);
		x[1] = "fred";		
		x.a = new Date(1618595373337);
		x.a.b = new Set(["cat", "dog", buffer, view, ["a", new String("b")]]);
		x.a.b.c = x; 
		x.buff = buffer;
		
		map1.Q = x.a.b;
		map1.set(x.a.b, x.a);
					
		const deepCopy_x = parseDataString(serializeSimpleData(x));
		
		
		
								
		if(compareObjects(x, deepCopy_x) && type(x) === type(deepCopy_x))
		{
			console.log("Wild Circular Test Passed: true");
		}
		else
		{
			console.log("Wild Circular Test Passed: false");
		}	
	}
	
	WildCircularTest();
	
	
 	function TestLong()
	{	
		var x = {q:100}, y = {q:101};
		x.a = y;
		y.b = x;
			
		var z = {M:x, N:y};
		
		try
		{	
			var buffer = new ArrayBuffer(8);			
			var view   = new Int32Array(buffer);
			view[0] = 123;	
			var dataview = new DataView(buffer);
			buffer.zoo = "animals";
			var b = Boolean(true);	
			function foo()
			{
				this.x = 99; 
				this.y = 100;
				this.copy = function(){return new foo();};
			}
			foo.a = 8;
			var N = Object.create(null);
			N.x = 99; N.y = 100;
			function bar(){return arguments;}
			var kvArray = [['key1', 'value1'], ['key2', {a:1,b:2}]];				
			
			var abool = new Boolean(true);
			abool.cat = "meouzer";
			abool.o = z;
			
			var array = ["cat", "dog", "hamster"];
			var error = new Error("err message", "file.js", 7);
			var regexp = /abc/g;				
			
			  const object = 
			  {				  	  
			  	a:abool,
				b: {f:"cat", g:{i:new Date()}},				  			 
				c:[["HTML", "CSS", "JavaScript"], Number(7)], 						                   
				d: new Set(["cat", "dog"]),
				e: array,	
				//ee: BigInt(0xFFFF),
				f:new Int8Array([21,31]),
				g:new Uint8Array([21,31]),
				h:new Uint8ClampedArray([21,31]),
				hh:new Int16Array([21,31]),
				i:new Uint16Array([21,31]),
				j:new Int32Array([21,31]),	
				k:new Uint32Array([21,31]),
				l:new Float32Array([21,31]),
				m:new Float64Array([21,31]),
				o:buffer,
				p:dataview,	
				q:error,
				r:regexp,
				zzz: new Date()		  
			};
		
			const str = serializeSimpleData(object);
			const dobj = parseDataString(str);
			
			if(compareObjects(dobj,object))
			{
				console.log("Long Test Passed: true");
			}
			else
			{
				console.log("Long Test Passed: false");
			}
		 }
		 catch(e)
		 {
		 	console.log("Error: " + e.message + '\n' + e.lineNumber);
		 }
	}

	TestLong();	

	function TestCircularFunctions()
    {
    	const A = {};
        A.z = {};  
        A.x = {a:{b:{c:1}}};
        A.y = {c:{a:{b:1}}};

       	Object.defineProperty(A.z, "x",
        {
            value:function(){return A.x;},

        });

        Object.defineProperty(A.x, "y",
        {
            value:function(){return A.y;},
        });

        Object.defineProperty(A.y, "z",
        {
            value:function(){return A.z;},
        });
        
        var string = serializeFData(A);
        
       function deserializeA()
       {	        	
        	const evaluator = function(){return eval('(' + arguments[0] + ')');}         	     	
        	var A = parseDataString(string, evaluator);
        	return A; 		
        }
        
        const B = deserializeA();
        console.log("TestCircularFunctions passed: " + compareObjects(A,B) );
        
        console.log("TestCircularFunctions ref 1 passed: " + (B.z != A.z));
        console.log("TestCircularFunctions ref 2 passed: " + (B.z.x() != A.z.x()));
        console.log("TestCircularFunctions ref 3 passed: " + (B.z.x().y() != A.z.x().y()));
        console.log("TestCircularFunctions ref 4 passed: " + (B.z.x().y().z() != A.z.x().y().z()));         
  }

 TestCircularFunctions();
    
    function TestCircularGets()
    {
    	const A = {};
        A.z = {};  
        A.x = {a:{b:{c:1}}};
        A.y = {c:{a:{b:1}}};

       	Object.defineProperty(A.z, "x", 
        {
            get:function(){return A.x;},
        });

        Object.defineProperty(A.x, "y",
        {
            get:function(){return A.y;},
        });

        Object.defineProperty(A.y, "z",
        {
            get:function(){return A.z;},
        });
        
        var string = serializeFData(A);
        
       function deserializeA()
       {	        	
        	const evaluator = function(){return eval('(' + arguments[0] + ')');}         	     	
        	var A = parseDataString(string, evaluator);
        	return A; 		
        }       
        
        const B = deserializeA();        
        
        console.log("TestCircularGets passed: " + compareObjects(A,B));
        console.log("TestCircularGets ref 1 passed: " + (B.z != A.z));
        console.log("TestCircularGets ref 2 passed: " + (B.z.x != A.z.x));
        console.log("TestCircularGets ref 3 passed: " + (B.z.x.y != A.z.x.y));
        console.log("TestCircularGets ref 4 passed: " + (B.z.x.y.z != A.z.x.y.z));        
     }
    
  TestCircularGets();

    
   function TestCircularMaps()
   {
   		const a = {a:1};
   		const b = {b:1};
   
   		const map1 = new Map([ [a,b]  ]);
   		map1[0] = "fred";
   	    
   		const x = {map1:map1};
   		x.a = {};
   		x.a.b = new Map([ [x.a, x], [a,b]  ]);
   		
   		x.a["!s"] = 0;
   		
   		const str = serializeSimpleData(x);
   		const y = parseDataString(str);
   		
   		console.log("TestMap passed: " + compareObjects(x,y));	
   		
   		  		
   } 
    
	TestCircularMaps();		
				
			
	function TestQuirkClamsAndPropertyDescriptors()
	{		
		const amap =new  Map([["key", "value"]]);
		amap[0] = {a:8};
		amap["!0"] = {a:9};
		amap["!!0"] = {a:9};
		amap["cat"] = {a:9};
		amap["!cat"] = {a:9};
		amap["!!cat"] = {a:9};
		
		const aset = new Set(["cat"]);
		aset[0] = {a:8};
		aset ["!0"] = {a:9};
		aset ["!!0"] = {a:9};
		aset ["cat"] = {a:9};
		aset ["!cat"] = {a:9};
		aset ["!!cat"] = {a:9};
		
		const buffer = new ArrayBuffer(4);
	    const view = new DataView(buffer);
	    view.setInt8(0, 127);
	    view.setInt8(1, 11);
	    view.setInt8(2, 17);
	    view.setInt8(3, -17);
	    
	    buffer[0] = {a:8};
		buffer["!0"] = {a:9};
		buffer["!!0"] = {a:9};
		buffer["cat"] = {a:9};
		buffer["!cat"] = {a:9};
		buffer["!!cat"] = {a:9};

	    view[0] = {a:8};
		view["!0"] = {a:9};
		view["!!0"] = {a:9};
		view["cat"] = {a:9};
		view["!cat"] = {a:9};
		view["!!cat"] = {a:9};

		const x = {a:amap, b:aset, c:buffer, d:view}; 
		
		const str = serializeSimpleData(x);
   		const y = parseDataString(str);
   		
   		console.log("TestQuirkClamsAndPropertyDescriptors passed: " + compareObjects(x,y));	

	}
		
	TestQuirkClamsAndPropertyDescriptors();				
					
					
				