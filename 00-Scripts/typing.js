	"use strict";
	
	// This file: typing.js
	// uses: no other js file
	
		
	// This file: typing.js includes typing functions
 	// needed by the whole library but includes other 
 	// functions needed in multiple places of the library. 
 	// So it's more than just typing, and a possible rename 
 	// is in order.
 	
	
	function nativeType(x)
    {
        const str = Object.prototype.toString.call(x);
        return str.substring(8,str.length-1);
    } 
    
    // const typeSymbol = Symbol("type"); // now global for ES6 classes
    
	const type = (function()
	{
		const typeSymbol = Symbol("type");
		
		Object.defineProperty(BigInt.prototype, typeSymbol,
		{
			value:function()
			{
				if(typeof(this) === "bigint") return "bigint";
				return "Object";					
			}
		}); 
		
		Object.defineProperty(Symbol.prototype, typeSymbol,
		{
			value:function()
			{
				if(typeof(this) === "symbol") return "symbol";
				return "Object";					
			}
		}); 
			
		Object.defineProperty(Boolean.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === Boolean.prototype) return "Object";
				return nativeType(this);			
			}
		}); 		
	
		Object.defineProperty(String.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === String.prototype) return "Object";
				return nativeType(this);			
			}
		}); 		
	
		
		Object.defineProperty(Number.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === Number.prototype) return "Object";
				return nativeType(this);			
			}
		}); 	
		
		Object.defineProperty(Array.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === Array.prototype) return "Object";
				return nativeType(this);			
			}
		}); 
	
		Object.defineProperty(RegExp.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);   			
			}
		}); 
		
		Object.defineProperty(Error.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === Error.prototype) return "Object";
				return nativeType(this) === "Error"? "Error":"Object";	  			
			}
		}); 
			
		Object.defineProperty(URIError.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === URIError.prototype) return "Object";
				return nativeType(this) === "Error"? "URIError":"Object";	  			
			}
		}); 
		
		Object.defineProperty(EvalError.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === EvalError.prototype) return "Object";
				return nativeType(this) === "Error"? "EvalError":"Object";	  			
			}
		}); 
	
		Object.defineProperty(RangeError.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === RangeError.prototype) return "Object";
				return nativeType(this) === "Error"? "RangeError":"Object";	  			
			}
		}); 

		Object.defineProperty(ReferenceError.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === ReferenceError.prototype) return "Object";
				return nativeType(this) === "Error"? "ReferenceError":"Object";	  			
			}
		}); 
	
		Object.defineProperty(SyntaxError.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === SyntaxError.prototype) return "Object";
				return nativeType(this) === "Error"? "SyntaxError":"Object";	  			
			}
		}); 
	
		Object.defineProperty(TypeError.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === TypeError.prototype) return "Object";
				return nativeType(this) === "Error"? "TypeError":"Object";	  			
			}
		}); 
	
		
		Object.defineProperty(Int8Array.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);	  			
			}
		}); 
		
		Object.defineProperty(Uint8Array.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);	  			
			}
		}); 
		
		Object.defineProperty(Uint8ClampedArray.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);	  			
			}
		}); 
	
		Object.defineProperty(Int16Array.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);	  			
			}
		}); 
	
		Object.defineProperty(Uint16Array.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);	  			
			}
		}); 
	
		Object.defineProperty(Int32Array.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);	  			
			}
		}); 
		
		Object.defineProperty(Uint32Array.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);	  			
			}
		}); 
	
		Object.defineProperty(Float32Array.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);	  			
			}
		}); 

		Object.defineProperty(Float64Array.prototype, typeSymbol,
		{
			value:function()
			{
				return nativeType(this);	  			
			}
		}); 
		
		
		Object.defineProperty(WeakSet.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === WeakSet.prototype) return "Object";
				try {WeakSet.prototype.has.call(this,"value"); } catch (e) { return "Object"; }	
				return "WeakSet";			
			}
		}); 
				
		Object.defineProperty(WeakMap.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === WeakMap.prototype) return "Object";
				try {WeakMap.prototype.has.call(this,"key"); } catch (e) { return "Object"; }	
				return "WeakMap";			
			}
		}); 


		Object.defineProperty(ArrayBuffer.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === ArrayBuffer.prototype) return "Object";
				try {ArrayBuffer.prototype.slice.call(this,0,0);} catch (e) {return "Object"; }	// new DataView(x); For IE11
				return "ArrayBuffer";			
			}
		});
	
		Object.defineProperty(DataView.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === DataView.prototype) return "Object";
				try {DataView.prototype.getUint8.call(this,0);} catch (e) { return "Object"; }	// x.getUint8(0); For IE11
				return "DataView";			
			}
		});
		
		Object.defineProperty(Map.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === Map.prototype) return "Object";
				try {Map.prototype.has.call(this,{}); } catch (e) { return "Object"; }	
				return "Map";			
			}
		});
	
		Object.defineProperty(Set.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === DataView.prototype) return "Object";
				try {Set.prototype.has.call(this,{});} catch (e) { return "Object"; }	   
				return "Set";			
			}
		});
	
		Object.defineProperty(Function.prototype, typeSymbol,
		{
			value:function()
			{
				if(this === Function.prototype) return "Object";
				return nativeType(this);			
			}
		}); 
		
		Object.defineProperty(Object.prototype, typeSymbol,
		{
			value:function()
			{			
				return nativeType(this);			
			}
		}); 
		
		return function type(x)
		{
			if (x === null) return "null";
	        if (typeof(x) !== 'object' && typeof(x) !== 'function') return typeof (x);
			if(x.__proto__ === undefined) return "Object";		
			return x[typeSymbol]();
		}
	})();
  
    
	function isClassPrototype(P) 
	{		
		return P != null && hasOwnProperty(P, "constructor")
			&& typeof(P.constructor) === "function"
			&& P === P.constructor.prototype;	
	}
	
	
	function getClassPrototype(x)
    {
    	// Returns most derived proper class prototype from which x derives,
    	// and the number of degrees from it.
    		
    	var P = x; var n = 0;     
		while(!isClassPrototype(P) && P != null)
        {     	 
        	n++;     	
        	P = Object.getPrototypeOf(P);        	
        }
               
        return {classPrototype:P, degree:n};
    }

	function userType(x) 
    {    
		const t = type(x);
		if(t !== "Object") return t;
		try { x.constructor; } catch(e) { return "CrossOriginObject";} 
		const P = getClassPrototype(x).classPrototype;
		if(P === null) return "Object";   // x is null object
		if(P === x) return "Object";   	  // x is function prototype		
    	if(Object.getPrototypeOf(x) !== P ) return "Object"; // x is at least two degrees from prototype
		return isNativeCode(P.constructor)? "Object": P.constructor.name;
	}
		
	function dtype(x)
	{
		const t = type(x);
		if(t !== "Object") return t;
		try { x.constructor; } catch(e) { return "CrossOriginObject";} 		
		const g = getClassPrototype(x); const P = g.classPrototype; const n = g.degree;		        
		if(P === null) return "NullObject" + ((n === 1)?"":"(" + n + ")");   
       	if(P === x)    return P.constructor.name + "[Prototype]";       	
       	if(P === Object.prototype) return "Object" + ((n === 1)?"":"(" + n + ")");       	
       	if(Object.getPrototypeOf(x) != P ) return P.constructor.name + "[Object" + "(" + n + ")" + "]";  
       	return isNativeCode(P.constructor)? P.constructor.name + "[Object]": P.constructor.name;       	       	   
	}
	
    
	
    //===============================================================================================================
        
    function isHostObject(x)
    {
    	const nt = nativeType(x);
        return nt === "Window" || nt.substring(0,4) === "HTML";
    } 
    
    function isPrimitive(x)
    {
        return (x === null || typeof(x) !== 'object') && typeof(x) !== 'function';
    }
    
	function isObject(x)
    {
        return (x !== null && typeof(x) === 'object') || typeof(x) === 'function';
    }
	
	function isBuiltInClassInstance(x) // used in parseDataString.js
    {
    	return isObject(x) && (type(x) !== "Object") && !isHostObject(x);
    	
    	// Won't catch InternalError class instances because the nativeType and 
    	// type is "Object". However, InternalError is non standard, so we will
    	// let things be.
    }
    		
	function isProgrammerDefinedClassInstance(x)
	{        
		if(isPrimitive(x)) return false;
		const P = getClassPrototype(x);
		return P.degree === 1 && P.classPrototype !== null && !isNativeCode(P.classPrototype.constructor);	   
       	
		// programmer must set constructors appropriately.    	    
	}


	
	// ==========================================================================================================================
	
	function isFunction(x) // Is x a class instance of Function?
	{
		return typeof(x) === "function";
	}
	
	function isBigInt(x) // Is x a class instance of BigInt? 
	{
		return typeof(x) === "bigint";
	}
	
	function isSymbol(x) // Is x a class instance of Symbol? 
	{
		return typeof(x) === "symbol";
	}
	
	// Only written for contrast with isBigInt()
	function isMereBigInt(x) // Is x a mere BigInt instance (x derives from BigInt.prototype but is not a BigInt class instance)
	{
		return nativeType(x) === "BigInt" && x !== BigInt.prototype;
	}
	
	// Only written for contrast with Symbol()
	function isMereSymbol(x) // Is x a mere Symbol instance (x derives from Symbol.prototype but is not a Symbol class instance)
	{
		return nativeType(x) === "Symbol" && x !== Symbol.prototype;
	}
	
	function isBoolean(x) // Is x a class instance of Boolean? 
	{
		return typeof(x) === "object" && nativeType(x) === "Boolean" && x !== Boolean.prototype;
	}
	
	function isNumber(x) // Is x a class instance of Number?
	{
		return typeof(x) === "object" && nativeType(x) === "Number" && x !== Number.prototype;
	}
	
	function isString(x) // Is x a class instance of String?
	{
		return typeof(x) === "object" && nativeType(x) === "String" && x !== String.prototype;
	}
	
	function isArray(x) // Is x a class instance of Array?
	{
		return nativeType(x) === "Array" && x !== Array.prototype;
	}

	function isDate(x) // Is x a class instance of Date?
	{
		return nativeType(x) === "Date";
	}
	
	function isRegExp(x) // Is x a class instance of RegExp x?
	{
		return nativeType(x) === "RegExp";
	}
	
	function isErrorVariant(x) // Is x a class instance of Error or other variant Error class.
	{
		return nativeType(x) === "Error";
	}
	
	function isError(x) // Is x a class instance of Error?
	{
		return nativeType(x) === "Error" && x.__proto__.constructor.name === "Error";
	}
	
	function isEvalError(x) // Is x class instance of EvalError?
	{
		return nativeType(x) === "Error" && x.__proto__.constructor.name === "EvalError";
	}
	
	function InternalError(x) // Is x a class instance of InternalError?
	{
		return nativeType(x) === "Error" && x.__proto__.constructor.name === "InternalError";
	}
	
	function isRangeError(x) // Is x a class instance of RangeError?
	{
		return nativeType(x) === "Error" && x.__proto__.constructor.name === "RangeError";
	}
	
	function isReferenceError(x) // Is x a class instance of ReferenceError?
	{
		return nativeType(x) === "Error" && x.__proto__.constructor.name === "ReferenceError";
	}

	function isSyntaxError(x) // Is x a class instance of SyntaxError?
	{
		return nativeType(x) === "Error" && x.__proto__.constructor.name === "SyntaxError";
	}

	function isTypeError(x) // Is x a class instance of TypeError?
	{
		return nativeType(x) === "Error" && x.__proto__.constructor.name === "TypeError";
	}
	
	function isURIError(x) // Is x a class instance of URIError?
	{
		return nativeType(x) === "Error" && x.__proto__.constructor.name === "URIError";
	}

	function isInt8Array(x) // Is x a class instance of Int8Array?
	{
		return nativeType(x) === "Int8Array"; 
	}
	
	function isUint8Array(x) // Is x a class instance of Uint8Array?
	{
		return nativeType(x) === "Uint8Array"; 
	}

	function isUint8ClampedArray(x) // Is x a class instance of Uint8ClampedArray?
	{
		return nativeType(x) === "Uint8ClampedArray"; 
	}

	function isInt16Array(x) // Is x a class instance of Int16Array ?
	{
		return nativeType(x) === "Int16Array"; 
	}
	
	function isUint16Array(x) // Is x a class instance of Uint16Array?
	{
		return nativeType(x) === "Uint16Array"; 
	}

	function isInt32Array(x) // Is x a class instance of Int32Array?
	{
		return nativeType(x) === "Int32Array"; 
	}

	function isUint32Array(x) // Is x a class instance of Uint32Arrayclass?
	{
		return nativeType(x) === "Uint32Array"; 
	}
	
	function isFloat32Array(x) // Is x a class instance of Float32Array?
	{
		return nativeType(x) === "Float32Array"; 
	}

	function isFloat64Array(x) // Is x a class instance of Float64Array?
	{
		return nativeType(x) === "Float64Array"; 
	}
	
	function isArrayBuffer(x) // Is x a class instance of ArrayBuffer?
	{
		///return isObject(x) && Object.getPrototypeOf(x) === ArrayBuffer.prototype && QuirksInstance["ArrayBuffer"](x);
		
		return type(x) === "ArrayBuffer";
	}
	
	function isDataView(x) // Is x a class instance of DataView?
	{
		//return isObject(x) && Object.getPrototypeOf(x) === DataView.prototype && QuirksInstance["DataView"](x);
		return type(x) === "DataView";

	}
	
	function isMap(x) // Is x a class instance of Map?
	{
		//return isObject(x) && Object.getPrototypeOf(x) === Map.prototype && QuirksInstance["Map"](x);
		return type(x) === "Map";
	}
	
	function isSet(x) // Is x a class instance of Set?
	{
		//return isObject(x) && Object.getPrototypeOf(x) === Set.prototype && QuirksInstance["Set"](x);
		return type(x) === "Set";
	}
	
	function isWeakMap(x) // Is x a class instance of WeakMap?
	{
		//eturn isObject(x) && Object.getPrototypeOf(x) === WeakMap.prototype && QuirksInstance["WeakMap"](x);
		return type(x) === "WeakMap";

	}

	function isWeakSet(x) // Is x a class instance of WeakMap?
	{
		//return window["WeakSet"] && isObject(x) && Object.getPrototypeOf(x) === WeakSet.prototype && QuirksInstance["WeakSet"](x);
		return type(x) === "WeakSet";

	}
	
	function isArguments(x) // Is x the arguments list of some function?
	{
		return nativeType(x) == "Arguments";
	}
	
	function isPureObject(x) // Is x an object but not a function?
	{
		return x != null && typeof(x) == "object";
	}
	
	
	function hasOwnProperty(x, a) 
	{
		return isObject(x) && Object.prototype.hasOwnProperty.call(x, a);
	}

	if(!String.prototype.hasOwnProperty('matchAt'))
	{
		Object.defineProperty(String.prototype, 'matchAt',
		{
			value: function (index, search) {
				var b = true;
				const end = Math.min(index + search.length, this.length);
				if (this.length < index + search.length) return false;
		
				for (let n = index, s = 0; n < end; n++ , s++) 
				{
					if (this[n] !== search[s]) 
					{
						b = false;
						break;
					}
				}
				return b;
			}
		});	
	}
	
	function isNativeCode(func)
	{
		const s = func.toString();		
		var n = s.indexOf("{");
		
		while(s[++n] != '}')
		{
			if(s.matchAt(n, "[native code]"))	
			{
				return true;
			}
		}	
		return false;	
	}
	
	function makeTypeable(className)
    {
        return `Object.defineProperty(this, Symbol.toStringTag,
        {
            get:function()
            {
                return (this.__proto__ === ${className}.prototype)?
                    '${className}':'Object';
            }
        });`
    }

