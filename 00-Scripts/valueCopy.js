	"use strict";	
	
	// This file: valueCopy.js
	// uses: typing.js
	
	const copySymbol = Symbol("copy"); // Made global for ES6 classes.
	
	function globalEvaluator()
	{
		return eval('('+arguments[0]+')');
	}
	
	const valueCopy = (function()
	{				
		// const copySymbol = Symbol("copy");		
			
		Object.defineProperty(Array.prototype, copySymbol,
		{			
			value:function()
			{	
				if(isArray(this)) return [];
				if(this === Array.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});
				
		Object.defineProperty(ArrayBuffer.prototype, copySymbol,  
		{			
			value:function()
			{		
				if(isArrayBuffer(this)) return new Int8Array(new Int8Array(this)).buffer;			
				if(this === ArrayBuffer.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));				
			}
		});
			
		Object.defineProperty(DataView.prototype, copySymbol,  
		{			
			value:function()
			{	
				if(isDataView(this)) return new DataView(this.buffer[copySymbol]());
				if(this === DataView.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));					
			}
		});	
		
		

		
		// Override for Functions 
		Object.defineProperty(Function.prototype, copySymbol,
		{
			value:function(evaluator)
			{		
				if(isFunction(this))
				{		 
					try
					{			
						// for sundry functions
						if(evaluator)
						{																	
							return evaluator(this);
						}
						else 
						{					
							return globalEvaluator(this);
						}
					}
					catch(e)
					{								
						return this; // for built in functions.
					}
				}
				if(this === Function.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));	
			}
		});
		
		Object.defineProperty(Window.prototype, copySymbol,
	    {
	        value:function() 
	        {	
				return this;
	        }
	    });
	    
	    Object.defineProperty(HTMLDocument.prototype, copySymbol,
	    {
	        value:function() 
	        {	
				return this;
	        }
	    });

		Object.defineProperty(HTMLElement.prototype, copySymbol,
	    {
	        value:function() 
	        {	
				return this;
	        }
	    });
					
		Object.defineProperty(Object.prototype, copySymbol,
	    {
	        value:function() 
	        {	
				if(this === Object.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
	        }
	    });
	
		// Generic overrides for Built in Classes		
		function makeErrorClassValueCopiable(klass)
		{
			Object.defineProperty(klass.prototype, copySymbol,
			{
				value:function()
				{
					if(isErrorVariant(this))
					{				
						const target = new klass();						
						if(hasOwnProperty(this, "fileName")) target.fileName= this.fileName;
						if(hasOwnProperty(this, "message")) target.message = this.message;						
						if(hasOwnProperty(this, "number")){target.number = this.number;} else{delete target.number;} // else for IE11.
						if(hasOwnProperty(this, "lineNumber")) target.lineNumber= this.lineNumber;
						if(hasOwnProperty(this, "columnNumber")) target.columnNumber = this.columnNumber;
						if(hasOwnProperty(this, "stack")) target.stack= this.stack;
						if(hasOwnProperty(this, "description")) target.description= this.description;						
						return target;
					}
					if(this === klass.prototype) return this;
					return Object.create(Object.getPrototypeOf(this));	
				}
			});				
		}
			
		Object.defineProperty(Boolean.prototype, copySymbol,
		{			
			value:function()         
			{				
				if(isBoolean(this)) return new Boolean(this.valueOf()); // primitives boxed
				if(this === Boolean.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));				
			}
		});	  
	
		Object.defineProperty(Number.prototype, copySymbol,
		{			
			value:function()         
			{				
				if(isNumber(this)) return new Number(this.valueOf()); 
				if(this === Number.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));				
			}
		});		
		
		Object.defineProperty(String.prototype, copySymbol,
		{			
			value:function()         
			{				
				if(isString(this)) return new String(this.valueOf());
				if(this === String.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});		
		
		Object.defineProperty(RegExp.prototype, copySymbol,
		{			
			value:function()         
			{				
				if(isRegExp(this)) return new RegExp(this.valueOf());
				if(this == RegExp.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});	
		
		Object.defineProperty(Date.prototype, copySymbol,
		{			
			value:function()         
			{				
				if(isDate(this)) return new Date(this.valueOf());
				if(this === Date.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});
	
		Object.defineProperty(Set.prototype, copySymbol,
		{			
			value:function()         
			{				
				if(isSet(this)) return new Set(this.valueOf());
				if(this === Set.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});
		
		Object.defineProperty(Map.prototype, copySymbol,
		{			
			value:function()         
			{				
				if(isMap(this)) return new Map(this.valueOf());
				if(this === Map.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});
		
		Object.defineProperty(WeakMap.prototype, copySymbol,
		{			
			value:function()         
			{				
				if(isWeakMap(this)) return this;
				if(this === WeakMap.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});

		if(typeof WeakSet !== "undefined")
		{
			Object.defineProperty(WeakSet.prototype, copySymbol,
			{			
				value:function()         
				{				
					if(isWeakSet (this)) return this;
					if(this === WeakSet.prototype) return this;
					return Object.create(Object.getPrototypeOf(this));
				}
			});
		}
					
		makeErrorClassValueCopiable(Error);
		makeErrorClassValueCopiable(InternalError);				
		makeErrorClassValueCopiable(EvalError);				
		makeErrorClassValueCopiable(ReferenceError);		
		makeErrorClassValueCopiable(RangeError);
		makeErrorClassValueCopiable(SyntaxError);
		makeErrorClassValueCopiable(TypeError);
		makeErrorClassValueCopiable(URIError);
		
		Object.defineProperty(Int8Array.prototype, copySymbol,
		{			
			value:function()
			{		
				if(isInt8Array(this)) return new Int8Array(this.length);
				if(this === Int8Array.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});	
		
		Object.defineProperty(Uint8Array.prototype, copySymbol,
		{			
			value:function()
			{		
				if(isUint8Array(this)) return new Uint8Array(this.length);
				if(this === Uint8Array.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});	
			
				
		Object.defineProperty(Uint8ClampedArray.prototype, copySymbol,
		{			
			value:function()
			{		
				if(isUint8ClampedArray(this)) return new Uint8ClampedArray(this.length);
				if(this === Uint8ClampedArray.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});		
	
		Object.defineProperty(Int16Array.prototype, copySymbol,
		{			
			value:function()
			{		
				if(isInt16Array(this)) return new Int16Array(this.length);
				if(this === Int16Array.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});	
		
		Object.defineProperty(Uint16Array.prototype, copySymbol,
		{			
			value:function()
			{		
				if(isUint16Array(this)) return new Uint16Array(this.length);
				if(this === Uint16Array.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});	
	
		Object.defineProperty(Int32Array.prototype, copySymbol,
		{			
			value:function()
			{		
				if(isInt32Array(this)) return new Int32Array(this.length);
				if(this === Int32Array.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});	
	
		Object.defineProperty(Uint32Array.prototype, copySymbol,
		{			
			value:function()
			{		
				if(isUint32Array(this)) return new Uint32Array(this.length);
				if(this === Uint32Array.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});	
	
		Object.defineProperty(Float32Array.prototype, copySymbol,
		{			
			value:function()
			{		
				if(isFloat32Array(this)) return new Float32Array(this.length);
				if(this === Float32Array.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});	
	
		Object.defineProperty(Float64Array.prototype, copySymbol,
		{			
			value:function()
			{		
				if(isFloat64Array(this)) return new Float64Array(this.length);
				if(this === Float64Array.prototype) return this;
				return Object.create(Object.getPrototypeOf(this));
			}
		});	
						
		return function valueCopy(src, evaluator)  
		{					
			if(isPrimitive(src)) return src; 		
			if(src.__proto__ === undefined) { // return value copy of null object					
				return Object.create(Object.getPrototypeOf(src)); }				
			return src[copySymbol](evaluator);
		}
	})();	
			
	function shallowCopy(x, evaluator)  // look at NaN problem
	{	
		if(typeof(x) === "function" && !evaluator) evaluator = globalEvaluator();		
		const y = valueCopy(x, evaluator);
		if( y === x) return x;
		const keys = Object.getOwnPropertyNames(x); // getOwnPropertyNames
		for(let i = 0; i < keys.length; i++)
		{
			const key = keys[i];
			const pd = Object.getOwnPropertyDescriptor(x, key);
			Object.defineProperty(y, key, pd);
		}
		return y;			
	}

//=======================================================================================================================================

	if(!hasOwnProperty)
	{
		function hasOwnProperty(x,a)
		{
		 	// of course this handles nullObjects x.
		 	return Object.prototype.hasOwnProperty.call(x, a);
		}
	}
	
	function evaluateSetterGetter(func, evaluator)
	{		
		if(!isNativeCode(func))
		{
			// change any "get" or "set" to "function"
			// strip off any name and then evaluate.
			evaluator = evaluator || globalEvaluator;
			
			const s = func.toString();
			let n = 0;
			const R = [];
			let r = 0;
			R[r++] = "function"; 		
			n = (s[0] == 'g' || s[0] == 's')? 3: 8;				
			R[r++] = s.substring(n);
			return evaluator(R.join(''));
		}
		else
		{			
			// can't evaluate native code.
			return func;
		}
	}
	
	
	