 
	"use strict";
	
	function isGetter(x, a)
	{
		const pd = Object.getOwnPropertyDescriptor(x,a);
		return !!pd.get;
	}
	
	const defaultConstructorSymbol = Symbol("defaultConstructorSymbol");
	
	var Z = -1000000;
	var W = 500000;
	
	function classInstanceCopy() 
	{
		var Z = 1000000;
				
		class foo
		{	
			#F = {a:{b:1,c:1}};
			get fab() 
			{
        		return this.#F.a.b;	
   		 	}	
   		 	#Z = function()
   		 	{
   		 		return Z + W; 
   		 	}  		 	
				
			#initialize = function(a,b,c)
			{
				// will synonym of this carry over to deep copy?
		    	const that = this;
		    	this.getThat = function(){return that;}
		    	Object.defineProperty(this, "getThat2", 
		        {
		        	get:function(){return this.getThat()}
		        });
		        // gettor and settor on this
		        Object.defineProperty(this, 'A',    
		        {
		            get:function () { return a;},
		            set:function (v) { a = v; }
		        });
		        
		        this.#F.a.b = this;
	        
		    	// private variables
		    	const PI = 3.14;
		    	var d = 100;	
		    	//var sg = {get (){}, set(){}}   
		    	
				Object.defineProperty(this.#F.a, "PI",
				{
					get:function(){return PI;}
				}); 	
		    	
		    	// create circular reference between this and function paramter c
		    	this.cat = c.cat;
		    	c.t = this;            
		        this.c = c;  
		        
				this.#F.a.c = c.cat;
				c.tt = this.#F.a.c;   	
		    	 
				// create circular reference between public property and parameter c	        
		        this.literal = {dog:{food:"beef", sound:"woof"},a:{b:{c:1}}};
		        c.test = this.literal;
	       	
				// will adding to parameter c carry over to deep copy?        	        
		        c.func = function(){return that.literal.dog.food;};
		        this.func = function(){return c.func();};
		      	c.func2 = function(){return that.func();};
		      	Object.defineProperty(c,'dogFood',    				// gettor and settor
		        {
		            get: function () {return that.literal.dog.food; },
		            set: function (v) { that.literal.dog.food = v; }
		        });
		      		      	
		      	// methods returning parameter
		      	this.getC = function(){return c;}
		      	Object.defineProperty(this, 'C',    // gettor
		        {
		            get:function () { return c; },
		        });
		    		
				// method changing constant    	
		    	this.changePI = function()
		    	{	
		    		PI = 3.14159;
		    	}    	   
						
		        var X = 100;  			
		        this.favNumber = 7; 	
		
		        function changeX()     
		        { 
		            X = Math.random() + Z;
		            return X;
		        }
		        
		        this.logChangeX = function()
		        {
		        	console.log(stringify(changeX));
		        }
		
		        this.getX = function () 
		        {	        
		            return X;
		        }
		
		        this.showChangeX = function () 
		        {   	       		       	
		            return changeX();
		        }
		
		        this.getChangeXFunction = function () 
		        {
		            return changeX;
		        }
	
		        this.sum = function ()  // method
		        {                              
		            return this.A + b + X;
		        }	  
	        
				this.InternalTest = function()
		        {
		        	console.log("this.fab === this: " + (this.fab === this))
		        	console.log("this.#F.a.b === this: " + (this.#F.a.b === this));
		        	console.log("this.#F.a.c = c.cat: " + (this.#F.a.c === c.cat));
		        	console.log("c.tt = this.#F.a.c: " + (c.tt === this.#F.a.c));
		        	console.log("this.#F.a.PI === PI: " + (this.#F.a.PI === PI));
		        	console.log("this.#Z() === 1500000: " + (this.#Z() === 1500000));		
		        	        
		        	console.log("this === that: " + (this === that));
		        	console.log("1b: " + (this === that.getThat2));
		        	console.log("1c: " + (this.getThat() == that));
		        	console.log("1c: " + (this.A == a));
		        	try
		        	{
		        		console.log("1c: " + (PI == 3.14));
		        		PI = 3.14159;
		        		console.log("1d: " + false);
		        	}
		        	catch(e)
		        	{
		        		console.log("1d: " + true);
		        	}
	 				console.log("1e: " + (this.cat === c.cat));
	 				console.log("1f: " + (c.t === this));
	 				console.log("1g: " + (this.c === c)); 				 
					console.log("1h: " + (c.func() === that.literal.dog.food));
					console.log("1i: " + (this.func() === c.func()));
					console.log("1j: " + (this.func() === c.func2()));
					console.log("1k: " + (c.dogFood === that.literal.dog.food)); // also test setter
					console.log("1l: " + (c.test == this.literal));				
					console.log("1m: " + (this.getC() === c));
					console.log("1n: " + (this.C === c));				
		        	console.log("1o 0: " + (isGetter(c, "dogFood")))
		        	c.dogFood = "chicken";
		        	console.log("1p 10: " + (c.dogFood == that.literal.dog.food));
		        	try
		        	{
		        		that = {};
		        		console.log("1q: false");
		        	}
		        	catch(e)
		        	{
		        		console.log("1q: true");
		        	}	
		        }        
		                
				this.serialize = function()
				{					
					var cleanContextObject = {this$:this, that:that, a:a, b:b, X:X, changeX:changeX, c:c, PI:PI, "#F":this.#F, "#Z":this.#Z};
					return serializeClassData(cleanContextObject);
				} 
			}		
	
			constructor(a, b, c)
			{
				if(arguments[0] === defaultConstructorSymbol) return;
				this.#initialize(a,b,c); 				
			}
			
			static deserialize = function(str)
			{
				return (function ()				
				{					
					this.evaluator = function(){return eval('('+ arguments[0] +')');};
					this.contextObject = parseDataString(str, this.evaluator, new foo(defaultConstructorSymbol), "foo");
					const that = this.contextObject.that;
					var a = this.contextObject.a;
					var b = this.contextObject.b;
					var X = this.contextObject.X;
					var changeX = this.contextObject.changeX;
					var c = this.contextObject.c;
					const PI = this.contextObject.PI;
					this.contextObject.this$.#F = this.contextObject['#F'];
					return this.contextObject.this$;	
				}).call({});
			}
		}
					
	    foo.prototype.SquareA = function () 
	    {
	        return this.A * this.A;
	    }
	    
	    var x = new foo(2, 3, {cat:{food:"tuna", sound:"meouz"},x:{y:{z:1}}});
				
		//var y = foo.deserialize(x.serialize());				
		var z = foo.deserialize(x.serialize());
		console.log("x.serialize() === z.serialize: " + (x.serialize() === z.serialize())); 
		console.log("compareObjects(x) === compareObjects(z): " + (compareObjects(x) === compareObjects(z))); 
		console.log("stringify(x, {doWriteGetsSets:true}) == stringify(z, {doWriteGetsSets:true}): " + (stringify(x, {doWriteGetsSets:true}) == stringify(z, {doWriteGetsSets:true})));
		compare(x,z);
		
				
		function compare(x,z)
		{	
			z.InternalTest();
			 			  			
  			console.log("s1: " + (compareObjects(x) == compareObjects(z))); 
  			
  			 	    
		    console.log(x.getThat() != z.getThat());
		    console.log(z.getThat() === z);
				    
			// Getter and setter copied
			//console.log("2a getter: " +  (stringify(Object.getOwnPropertyDescriptor(x, "A")) == stringify(Object.getOwnPropertyDescriptor(z, "A"))) );	
						    
		    // Initial state same
		    console.log("2b: " + (x.favNumber == z.favNumber));
		    console.log("2c: " + (x.sum() == z.sum()));   
		    console.log("2d: " + (x.A == z.A));
		    console.log("2e: " + (x.getX() == z.getX()));
				
		    // Public methods different
		    console.log("2f: " + (x.getX != z.getX));
		    console.log("2g: " + (x.showChangeX != z.showChangeX));
		    console.log("2h: " + (x.getChangeXFunction != z.getChangeXFunction));
		    console.log("2i: " + (x.sum != z.sum));
		    console.log("2k: " + (x.getC != z.getC));
				    	
		    // Private methods different
		    console.log("3: " + (x.getChangeXFunction() != z.getChangeXFunction()));
				
		    // Change state of copy. 
		    z.favNumber = 15;
		    z.A = 100;
			
		    // Show it's a good copy independent copy source.
		    console.log("2l: " + (z.favNumber == 15));
		    console.log("2m: " + (x.favNumber == 7));
			
	    	console.log("2n: " + (z.A == 100));
		    console.log("2o: " + (x.A == 2));
		    console.log("2p: " + (z.SquareA() == 10000));
		    console.log("2r: " + (x.SquareA() == 4));
			
		    console.log("2s: " + (x.sum() == 105));
		    console.log("2t: " + (z.sum() == 203));		       
		      
		   console.log(z.showChangeX());    
		   console.log("2tu: " + (z.getX() != x.getX()));
		   console.log("2v: " + (z.getX() != x.getX()));			  
			  
		  console.log("2w: " + (x.getC() != z.getC()));
		  console.log("2x: " + (x.getC().cat != z.getC().cat));	
		  console.log("2y: " + (x.getC().t != z.getC().t));	
		  console.log("2z: " + (x.C != z.C));
		   try
		   {
		   		z.changePI();
		   }
		   catch(e)
		   {
		   		console.log("success:  can't change constant");
		   }
		}   
	}
	 
  	classInstanceCopy();
  	
  	
  	
  	