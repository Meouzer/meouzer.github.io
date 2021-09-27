	"use strict";
	
	// This file: deepCopy.js
	// uses: valueCopy.js which uses  typing.js 
	
	
	function evaluateGetterSetter(func, evaluator)
	{		
		if(!isNativeCode(func))
		{
			// change any "get" or "set" to "function"
			evaluator = evaluator || globalEvaluator;			
						
			let s = func.toString();
			if(s[0] == 'g' || s[0] == 's')
			{
				s = "function" + s.substring(3);
			}		
			
			return evaluator(s); 
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
		
		
	function deepCopy(source, evaluator)
	{
		if(isPrimitive(source)) return source;
		const target = getTarget(source, evaluator);
		if(target === source) return source;
		const wm = new WeakMap();
		wm.set(source, target);

			
		const stack = [{source:source, target:target}];
			
		while(stack.length > 0)
		{
			const top = stack.pop();				
			const source = top.source;
			const target = top.target;				
				
			// process nodes of the object tree in  preorder	
			for(const p of Object.getOwnPropertyNames(source))
			{			
				const pd = Object.getOwnPropertyDescriptor(source, p);
				
				if(pd.get || pd.set)
				{					
					if(!hasOwnProperty(target, p) ) 
					{		
						if(pd.get) pd.get = evaluateGetterSetter(pd.get, evaluator);
						if(pd.set) pd.set = evaluateGetterSetter(pd.set, evaluator);					
						Object.defineProperty(target, p, pd);
					}
				}
				else if(isPrimitive(source[p]))
				{
					Object.defineProperty(target, p, pd);	
				}				
				else if(wm.has(source[p]))
				{
					pd.value = wm.get(source[p]);
					Object.defineProperty(target, p, pd);		
				}					
				else
				{			
					pd.value = getTarget(source[p], evaluator); 
					Object.defineProperty(target, p, pd);	
					if(target[p] !== source[p]) 
					{ 
						stack.push({source:source[p], target:target[p]}); 
						wm.set(source[p], target[p]);
					}
				}  
			}	
			
			// After target children attached, can freeze etc.
			if(Object.isFrozen(source))
			{
				Object.freeze(target)
			}
			else if (Object.isSealed(source))
			{
				Object.seal(target);
			}	
			else if(!Object.isExtensible(source))
			{
				Object.preventExtensions(target);
			}

			
			if(isSet(source))
			{
				for(const value of source.values())
				{
					if(wm.has(value))
					{						
					 	target.add(wm.get(value)); 
					}
					else
					{
					 	const targetValue = getTarget(value);
						target.add(targetValue);
						
						if(value !== targetValue) 
						{
							stack.push({source:value, target:targetValue});
							wm.set(value, targetValue);
						}
					}				
				}
			}
			else if(isMap(source)) 
			{
				for(const key of source.keys())
				{
					const value = source.get(key);
					
					let targetKey;
					let targetValue;
					
					if(wm.has(key))
					{
						targetKey = wm.get(key);
					}
					else
					{
						targetKey = getTarget(key);
						
						if(key !== targetKey)
						{
							stack.push({source:key, target:targetKey});
							wm.set(key, targetKey);
						}
					}
					
					if(wm.has(value))
					{
						targetValue = wm.get(value);
					}
					else
					{
						targetValue = getTarget(value);
						
						if(value !== targetValue)
						{
							stack.push({source:value, target:targetValue});
							wm.set(value, targetValue);
						}
					}

					target.set(targetKey, targetValue);					
					
				}
			}
						
		}						
				
		return target;	
	} 

	
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

   