//"use strict"

	function TestStringify()
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
			//arguments = bar("arg1", "arg2");
			var kvArray = [['key1', 'value1'], ['key2', {a:1,b:2}]];				
			var map = new Map([['key1', 'value1'], ['key2', {a:1,b:2}]]);				
			var abool = new Boolean(true);
			abool.cat = "meouzer";
			//abool.p = window;
			abool.q = N;
			abool.o = z;
			var array = ["cat", "dog", "hamster"];
			var error = new Error("err message", "file.js", 7);
			var regexp = /abc/g;
				
			const baz = function(){};

			  const object = 
			  {				  	  
			  	a:abool,
				b: {f:"cat", g:{i:new Date()}},				  			 
				 c:[["HTML", "CSS", "JavaScript"], Number(7)], 						                   
				d: new Set(["cat", "dog", map]),
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
				//n:arguments,
				o:buffer,
				p:dataview,	
				q:error,
				r:regexp,
				s:N,
				t:foo,	
				u:map,
				v:N,
				w:RegExp.prototype,
				vv:foo.prototype,
				zz: new foo(),
				ww: Boolean.prototype,
				x: Object.create(new Boolean(true)),
				y: Object.create(Boolean.prototype),
				z:baz,		
				zzz: new Date()		  
			};
		
			console.log(stringify(object));
									 	
		 }
		 catch(e)
		 {
		 	console.log("Error: " + e.message + '\n' + e.lineNumber);
		 }
	}

	TestStringify();
	
	
	function TestMap()
	{
		//const map1 = Map.makeMap([ [[1,2], new Date()],   [7,true], ['key1', 'value1'] ]);
		const a1 = {a:1}	
		const map = new Map([ [a1,a1] ] );
		map[0] = "!property";
		
		map.x = a1;
		console.log("stringify")
		console.log(stringify(map));
		console.log("serializeSimpleData")
		console.log(serializeSimpleData(map));
			
	}
	
	TestMap();
	
	function TestQuirkClamsAndPropertyDescriptors()
	{
		
		const amap = new Map([["key", "value"]]);
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
		console.log(serializeSimpleData(x));

	}
	
	TestQuirkClamsAndPropertyDescriptors();

	