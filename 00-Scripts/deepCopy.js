	"use strict";
	
	// This file: deepCopy.js
	// uses: typing.js and valueCopy.js
	
	function getInternalState(source)
		{
			const x = [];
		
			if(isSet(source))
			{
				source.forEach(function (value1, value2, thisSet) 
				{
					x.push(value2);					
				});			
			}
			else if(isMap(source))
			{
				source.forEach(function (value, key, map) 
				{
					x.push({key: key, value: value });
				});		
			}
			
			return x;
		}

		
		function setValue(obj, p, pd, value) 
		{
			pd.value = value;
			if(pd.configurable) Object.defineProperty(obj, p, pd);
			else if(pd.writable) obj[p] = value;			
		} 
		
		function evaluateGetterSetter(func, evaluator)
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
		
		function getTarget(obj, evaluator)
		{
			if(isSet(obj)) return new Set();
			if(isMap(obj)) return new Map();
			return valueCopy(obj, evaluator);
		}
		
		function loadQuirk(q)
		{
			//for (const q of quirkArray)
			//{
				const target = q.target;
				const originalTarget = q.originalTarget;
								
				if(isSet(originalTarget))
				{	
					for(let i = 0, length = target.length; i < length; i++)
					{
						originalTarget.add(target[i]);
					}
				}
				else if(isMap(originalTarget))
				{					
					for(let i = 0, length = target.length; i < length; i++)
					{
						originalTarget.set(target[i].key, target[i].value);
					}
				}				
			//}
		}
		       
    	function deepCopy(source, evaluator)
		{			
			if(isPrimitive(source)) return source;
			const stack = [];
			const quirkArray = [];
			const wm = new WeakMap();
							
			function addToStack(source)
			{
				const target = getTarget(source, evaluator);
				if(target === source) return null;
				stack.push({source:source, target:target, keys:Object.getOwnPropertyNames(source), index:0});
				wm.set(source, target);
				if(isSet(source) || isMap(source))
				{
					const inState = getInternalState(source);
					const keys = []; for(let i = 0; i < inState.length; i++) keys[i] = i; 
					const element = {source:inState, target:[],  originalTarget:target, keys:keys, index:0}
					stack.push(element);
					quirkArray.push(element);
				}					  	
				
				return target;
			}
			
			const target = addToStack(source);
			if(target === null) return source;			
						
			while(stack.length > 0)
			{
				const top = stack[stack.length - 1];
				const source = top.source;
				const target = top.target;
				
				if(top.index < top.keys.length)
				{
					for(const p of Object.getOwnPropertyNames(source))
					{
						const pd = Object.getOwnPropertyDescriptor(source, p);
						
						if(pd.get || pd.set)
						{												
							if(pd.get) pd.get = evaluateGetterSetter(pd.get, evaluator);
							if(pd.set) pd.set = evaluateGetterSetter(pd.set, evaluator);
							if(!hasOwnProperty(target, p) ) // to do: check configurability
							{							
								Object.defineProperty(target, p, pd);
							}
						}
						else if(isPrimitive(source[p]))
						{	
							// This case not needed, but does process primitives faster.
							setValue(target, p, pd, pd.value);		
						}	
						else if(wm.has(source[p])) 
						{ 
							setValue(target, p, pd, wm.get(source[p]));		
						}																	
						else
						{	
							const t = addToStack(source[p]);
							t !== null? setValue(target, p, pd, t) : setValue(target, p, pd, pd.value); 			
						}
					}
					
					top.index++;
				}
				else
				{
					const top = stack.pop();
					
					if(top.originalTarget)
					{
						loadQuirk(top);
					}
					
					if(Object.isFrozen(top.source))
					{
						Object.freeze(top.target)
					}
					else if (Object.isSealed(top.source))
					{
						Object.seal(top.target);
					}	
					else if(!Object.isExtensible(top.source))
					{
						Object.preventExtensions(top.target);
					}				
				}												
			}
			
			// loadQuirks(quirkArray);
						
			return target;
		}	

        
    //===============================
    
   // ==================================
	
	
	// ===================================================================================================================
	
	function writeVariables(contextObject, startIndex)  
	{
		var vars = "";
							
		if(contextObject != null && typeof contextObject == "object")
		{
			const regVar = /^(var |let |const )?([a-zA-z_$][a-zA-z_$0-9]*)$/;		
												
			for(let i = startIndex, keys = Object.keys(contextObject), length = keys.length; i < length; i++)
			{
				const a = regVar.exec(keys[i]);
				vars +=	(a[1]?a[1]:"var ") + a[2] + " = this.contextObject." + a[2] + ";\n"; 							
			}
		}
										
		return vars;
	}
				
	function cleanContext(contextObject)
	{			
		const co= {};
				
		if(contextObject != null && typeof contextObject == "object")
		{
			const regVar = /^(var |let |const )?([a-zA-z_$][a-zA-z_$0-9]*)$/;		
										
			for(let i = 0, keys = Object.keys(contextObject), length = keys.length; i < length; i++)
			{	
				const a = regVar.exec(keys[i]);	
				co[a[2]] = contextObject[keys[i]];			
			}
		}			
		
		return co;
	}
	
	const deepCopySystem = 
	'(' 
		+ 
			function() 
			{						
				return eval("(function ()\
				{\
					this.evaluator = function(){return eval('('+ arguments[0] +')');};\
					this.contextObject = deepCopy(cleanContext(this.contextObject), this.evaluator);" 
					+
						writeVariables(arguments[0], 0)
					+
					"return this.contextObject;\
				});").call({contextObject:arguments[0]});					
			}

		+')';	
	
    const deepCopyClass = 
	'(' 
		+ 
			function() 
			{						
				return eval("(function ()\
				{\
					this.evaluator = function(){return eval('('+ arguments[0] +')');};\
					this.contextObject = deepCopy(cleanContext(this.contextObject), this.evaluator);" 
					+
						writeVariables(arguments[0], 1)
					+
					"return this.contextObject;\
				});").call({contextObject:arguments[0]});					
			}

		+')';	

       	
  /*			
  function ()				
  {					
	  	this.evaluator = function(){return eval('('+ arguments[0] +')');};					
	  	this.contextObject = deepCopy(cleanContext(this.contextObject), this.evaluator, true);
	  	var this$ = this.contextObject.this$;
		const that = this.contextObject.that;
		var a = this.contextObject.a;
		var b = this.contextObject.b;
		var X = this.contextObject.X;
		var changeX = this.contextObject.changeX;
		var c = this.contextObject.c;
		const PI = this.contextObject.PI;
		return this.contextObject;	
	}
    */
    
    
    //=========================================================================================================================		
	// =========================================================================================================================	
	//==========================================================================================================================
		
		
		
    
    