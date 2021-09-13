//"use strict";
	function TestDeepCopyBuiltIns()
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
			var args = bar("arg1", "arg2");
			var kvArray = [['key1', 'value1'], ['key2', {a:1,b:2}]];				
			var map = new Map([['key1', 'value1'], ['key2', {a:1,b:2}]]);				
			
			var abool = new Boolean(true);
			abool.cat = "meouzer";
			abool.q = N;
			abool.o = z;
			
			var array = ["cat", "dog", "hamster"];
			var error = new Error("err message", "file.js", 7);
			var regexp = /abc/g;
													
			  const object = 
			  {				  	  
			  	a:abool,
				b: {f:"cat", h:window, g:{i:new Date()}},
				c:[["HTML", "CSS", "JavaScript"], Number(7)], 
				//e: new Set(["cat", "dog", map ]), //
				f: array,	
				g: BigInt(0xFFFF),								
				h:new Int8Array([21,31]),
				i:new Uint8Array([21,31]),
				j:new Uint8ClampedArray([21,31]),
				k:new Int16Array([21,31]),
				l:new Uint16Array([21,31]),
				m:new Int32Array([21,31]),	
				n:new Uint32Array([21,31]),
				o:new Float32Array([21,31]),
				p:new Float64Array([21,31]),		 		
				q:buffer,							
				t:error,                     			
				u:regexp,
				v:N,
				//w:foo,	
				x:7,							
				y:map,
				z:z,
				zz:window,
				zzz: Object.create(new Boolean(true)),
						
				get information(){"get information";},		
				set information(value){"set information";}
				
			  };	
			
			var obj = deepCopy(object);			 	
			console.log("deepCopy() passed: " + compareObjects(obj, object));
			//alert(stringify(object) === stringify(obj));
			
			const param = {doHost:false, doWriteGetsSets:true, doAbbreviate:true, doPrototypes:false, doPropertyDescriptors:true};	
								
		 }
		 catch(e)
		 {
		 	alert("Error : " + e.message + '\n' + e.lineNumber + "\n" + e.stack);
		 }
	}
	
	TestDeepCopyBuiltIns();
	
	
	function TestError1()
	{					
		var err = new Error("Edge error message", "somefile"); // ok in ie11				
		var err2 = deepCopy(err);
		console.log("TestError1 passed: " + (stringify(err) ==  stringify(err2)));
	}
	
	function TestError2()
	{				
		var err = new Error("Edge error message");			
		var err2 = deepCopy(err);				
		console.log("TestError2 passed: " + (stringify(err) ==  stringify(err2)));
	}

	TestError1(); 
	TestError2();


	function CopyPureDataWithCircularReference()
	{
		var x = new Map([['key1', 'value1'], ['key2', {a:1,b:2}],
        [new Boolean(true), new Number(7)]]);
        
        var y = new Set(["cat", "dog", ["a", new String("b")]]);
        
        x.a = y;
		y.b = x;
		x.f = 1;
		y.g = 2;	
		
		var z = {M:x, N:y};				 			  			 		 	
		var cz = deepCopy(z);	
		console.log ("CopyPureDataWithCircularReference  ref 1 passed " + (z.M.a != cz.N.a));
		console.log ("CopyPureDataWithCircularReference  ref 2 passed " + (z.N.b != cz.N.b));				 			 	
		console.log("CopyPureDataWithCircularReference passed: " + (stringify(z) == stringify(cz)));
		
	}
	
	//CopyPureDataWithCircularReference();
	
	
	
	function TestGet()
	{
		const z = {};
		
		const x = new Map([['key1', 'value1'], ['key2', {a:1,b:2}],
        [new Boolean(true), new Number(7)]]);
        
        x.y = new Set(["cat", "dog", ["a", new String("b")]]);

		Object.defineProperty(z, "x",
		{
			get:function(){return x;},

		});
		
		const evaluator = eval(Evaluator)({"const x":deepCopy(x)});						
		
		var cz = deepCopy(z, evaluator);
		
			
		console.log("TestGet ref 1 passed: " + (z.x != cz.x) );
		console.log("TestGet ref 2 passed: " + (z.x.y != cz.x.y) );	
		console.log("TestGet passed: " + (stringify(cz) == stringify(z)) );			
	}
	
	//TestGet();
	
		
	function TestTwoGets()
	{
		const z = {};
		const x = {a:{b:{c:1}}};
		const y = {c:{a:{b:1}}};
				
		Object.defineProperty(z, "x",
		{
			get:function(){return x;},

		});
		
		Object.defineProperty(x, "y",
		{
			get:function(){return y;},
		});
		
		const evaluator1 =  eval(cefString)({y:deepCopy(y)});
		const cx =  deepCopy(x, evaluator1);
				
		const evaluator = eval(cefString)({x:cx});				
		
		var cz = deepCopy(z, evaluator);
		
		console.log("TestTwoGets ref 1 passed: " + (z.x != cz.x));	
		console.log("TestTwoGets ref 1 passed: " + (z.x.y != cz.x.y));	
		console.log("TestTwoGets passed: " + (stringify(cz) == stringify(z)));				
	}

	TestTwoGets();

	
	function TestCircularGets()
	{
		const z = {};
		const x = {a:{b:{c:1}}};
		const y = {c:{a:{b:1}}};
				
		Object.defineProperty(z, "x",
		{
			get:function(){return x;},

		});
		
		Object.defineProperty(x, "y",
		{
			get:function(){return y;},
		});
		
		Object.defineProperty(y, "z",
		{
			get:function(){return z;},
		});

		
		const dcs = eval(deepCopySystem)({"const y":y, "const z":z, "const x":x});		
		const cz = dcs.z;
				
		console.log("TestCircularGets ref 1 passed: " + (z.x != cz.x));
		console.log("TestCircularGets ref 2 passed: " + (z.x.y != cz.x.y));		
		console.log("TestCircularGets ref 3 passed: " + (z.x.y.z != cz.x.y.z));
		console.log("TestCircularGets passed: " + (stringify(cz) == stringify(z)));				
	}

	
	TestCircularGets();
	
	
	function TestCircularGetsExpanded()
	{
		const z = {};
		const x = {a:{b:{c:1}}};
		const y = {c:{a:{b:1}}};
				
		Object.defineProperty(z, "x",
		{
			get:function(){return x;},

		});
		
		Object.defineProperty(x, "y",
		{
			get:function(){return y;},
		});
		
		Object.defineProperty(y, "z",
		{
			get:function(){return z;},
		});
				
		const dcs = (function ()
		{	
			const evaluator = function()
			{
				return eval('('+ arguments[0] +')');
			}				
			this.dcs =	deepCopy(this.contextObject, evaluator);	
				
			const z = this.dcs.z;
			const x = this.dcs.x
			const y = this.dcs.y
			return this.dcs;
		}).call({contextObject:{z:z, x:x, y:y}})
		
		
		const cz = dcs.z;
				
		console.log("TestCircularGetsExpanded ref 1 passed: " + (z.x != cz.x));
		console.log("TestCircularGetsExpanded ref 2 passed: " + (z.x.y != cz.x.y));		
		console.log("TestCircularGetsExpanded ref 3 passed: " + (z.x.y.z != cz.x.y.z));
		console.log("TestCircularGetsExpanded passed: " + (stringify(cz) == stringify(z)));				
	}

	TestCircularGetsExpanded();

	
	