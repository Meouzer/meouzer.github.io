	"use strict";
	
	// this file: stringif.js
	// uses: typing.js

 const stringify = (function ENCLOSURE_FOR_STRINGIFY()
 {	
 	// Variables that stringify() uses that are also used
 	// by utility functions are public. No awkward passing
 	// of parameters to utility functions.
 	var isSimpleData = false;
 	var isFData = false;
 	
 	function exceptionAlert(message)
 	{
 		alert(message);
 		return message;
 		
 		// usuage: throw exceptionAlert("My first exception alert to annoy viewer.");
 	}
 	
 	function isDigitString(x)    // Is x a string of digits?
	{
		for(let i = 0; i < x.length; i++)
		{
			if(x[i] < '0' || x[i] > '9') return false;
		}
		return true;
	}

 	function getProperProperties(x, excludePrototype) // used in stringify.js and deepCopy.js
	{	
		if(excludePrototype === undefined) excludePrototype = true;
	
		const names = Object.getOwnPropertyNames(x); 	
	
		if(isString(x))
		{
			return names.slice(x.length);	
		}	
		else if(isFunction(x))
		{			
			const goodNames = [];
			for(let i = 0; i < names.length; i++)
			{
				const key = names[i];
				if(key !== "length" && key !== "arguments" && key !== "caller" ) 
				{
					if(!excludePrototype || key !== "prototype")
					{
						goodNames.push(key)
					}					
				}
			} 
			return goodNames;
		}
		else if(isArray(x))
		{			
			const goodNames = [];
			const length = names.length;
			for(let i = 0; i < length; i++)
			{
				const key = names[i];
				if(key !== "length" )
				{
					goodNames.push(key);
				}
			} 
			return goodNames;
		}
		
		else
		{
			return names;
		}	
	}	 	
 	
	function SCheaterStack()
	{		
		const wmStack = new WeakMap();
		const wmTree = new WeakMap();
		var l = 0;
		
		this.push = function(x)
		{
				this[l++] = x;	
				x.originalType = type(x.originalSource);			
				const path = this.path();
				wmStack.set(x.originalSource, {depth:l-1, ownKey:x.ownKey, path:path}); // 2nd param used by client on circular reference detection.
				wmTree.set(x.originalSource, {path:path});	// 2nd param used by client on duplicate reference detection.					
		} 
		
		this.pop = function()
		{
			const x = this[--l];
			wmStack.delete(x.originalSource);
			return x;
		}
		
		this.peek = function(n)
		{
			if(n === undefined) n = 1;
			return this[l - n];
		}
		
		this.isOnStack = function(source)
		{	
			// Means of circular reference detection.	
			return wmStack.has(source);
		}
		
		this.isOnTree = function(source)
		{
			// Means of duplicate reference detection.
			return wmTree.has(source);
		}
			
		this.getCircularRefInfo = function(source)   
		{		
			// Return the info related to a circular reference.	
			return wmStack.get(source);
		}
		
		this.getDuplicateRefInfo = function(source) 
		{
			// Return the info related to a duplicate reference.
			return wmTree.get(source);
		}
			
		Object.defineProperty(this, 'length',
		{
			get:function(){return l;}
		});
		
		this.path = function()	
		{
			var path = [];
		
			for(let i = 0; i < l; i++)
			{
				path.push(this[i].ownKey);
			}
			
			return path.join('.');
		}
	}
							
    function newLineWithTabs(n)
    {
    	// Start a new line and write n tabs.
    
    	const S = []; var s = 0;
    	S[s++] = '\n';
    	for(let j = 0; j < n; j++)
    	{
    		S[s++] = '\t';
    	}
    		
    	return S.join('');
    }
    
    function Tabs(n)
    {
    	// Write n tabs.
    	
    	const S = []; var s = 0;
    	for(let j = 0; j < n; j++)
    	{
    		S[s++] = '\t';
    	}
    	
    	return S.join('');
    }
	
	
	const escapeReg = /^!*0$|^!*[123456789][1234567890]*$/;
						
	function escapeKey(key)
	{
		return escapeReg.test(key)? "!" + key: key;	
	}		


	const ADMS = // A = ArrayBuffer, D = DataView, M = Map,  S = Set, 
	{	
		// If originalSource is an ArrayBuffer, DataView, Set, or Map class instance
		// then turn it inside out. Internal properties of originalSource become
		// external properties of proxySource. 
	
		Map:function(originalSource)
		{
			// Turn the Map originalSource inside out. What do you get?
			// proxySource!
			
			const proxySource = {}; var n = 0;
					
			originalSource.forEach(function (value, key, map) 
			{
				// Internal properties of originalSource are now
				// external/public properties proxySource.
				proxySource[n++] = { key: key, value: value };
			});
	
			const keys = Object.getOwnPropertyNames(originalSource);
	
			// Now transfer the external properties of originalSource
			// to external properties of proxySource.	
			for (let i = 0; i < keys.length; i++) 
			{
				const clam = isDigitString(keys[i])? '!' :'';
				//proxySource[clam + keys[i]] = originalSource[keys[i]];
				proxySource[escapeKey(keys[i])] = originalSource[keys[i]];
			}
			
			// The internal properties of Map are now the external properties of proxySource.					
			return proxySource;

		},
		Set:function(originalSource)
		{
			// Turn the Set originalSource inside out. What do you get?
			// proxySource!
		
			const proxySource = {}; var n = 0;
					
			originalSource.forEach(function (value1, value2, thisSet) 
			{
				// Internal properties of originalSource are now
				// external properties proxySource.
				proxySource[n++] = value2;
			});
	
			const keys = Object.getOwnPropertyNames(originalSource);
			
			// Now transfer the external properties of originalSource
			// to external properties of proxySource.			
			for (let i = 0; i < keys.length; i++) 
			{
				const clam = isDigitString(keys[i])? '!' :'';
				//proxySource[clam + keys[i]] = originalSource[keys[i]];	
				proxySource[escapeKey(keys[i])] = originalSource[keys[i]];

				
				// Not a clam. An exclam! Sung to the tune of
				// Rock Lobster.					
			}
					
			return proxySource;

		},
		DataView:function(originalSource)
		{
			// Turn the DataView originalSource inside out. What do you get?
			// proxySource!
		
			const proxySource = {}; var n = 0;
			
			for (let i = 0; i < originalSource.byteLength; i++) 
			{
				// Turn internal properties of originalSource into
				// external properties proxySource.
				proxySource[n++] = originalSource.getInt8(i);
			}
	
			const keys = Object.getOwnPropertyNames(originalSource);
				
			// Now transfer the external properties of originalSource
			// to external properties of proxySource.	
			for (let i = 0; i < keys.length; i++) 
			{
				const clam = isDigitString(keys[i])? '!' :'';
				//proxySource[clam + keys[i]] = originalSource[keys[i]];
				proxySource[escapeKey(keys[i])] = originalSource[keys[i]];
			}					
					
			return proxySource;

		},
		ArrayBuffer:function(originalSource)
		{	
			// Turn the ArrayBuffer originalSource inside out. What do you get?
			// proxySource!
				
			const view = new DataView(originalSource);
			const proxySource = ADMS.DataView(view); 
			// Internal properties of originalSource are now
			// external properties proxySource.
	
			const keys = Object.getOwnPropertyNames(originalSource);
	
			// Now transfer the external properties of originalSource
			// to external properties of proxySource.
			for (let i = 0; i < keys.length; i++) 
			{
				const clam = isDigitString(keys[i])? '!' :'';
				//proxySource[clam + keys[i]] = originalSource[keys[i]];
				proxySource[escapeKey(keys[i])] = originalSource[keys[i]];

			}
					
			return proxySource;
		},
	}
	
	function getProxySource(originalSource)
	{		
		const t = type(originalSource);		
		return ADMS[t]? ADMS[t](originalSource):originalSource;
				
		// Only quirk class instances are turned inside out and have proper proxies. 
		// For other class instances, the proxy is the class instance itself.		
	}
		
	function tabifyFunction(s, tab)
	{	
		// You don't need to know about formatting functions too much.
		// Basically every time an opening brace is found you tab
		// over one more on new lines. Every time a closing brace
		// is found you tab over one less. In this regards You must 
		// ignore braces in block comments, end of line comments, quotes 
		// and regular expressions. We don't format switch statements
		// any further as that would explode code size. As far a 
		// deserialization goes, everything is A-OK because formatting 
		// doesn't affect how the function acts.
		
		// In regular expressions, braces come in pairs unless preceded
		// by a backward slash as an escape.
			
		var netBraces = 0;
		const J = [];
		var j = 0;
		var n = 0;
		const end = s.length;
		
		while (s[n] === '\t' || s[n] === ' ' || s[n] === '\n') n++;
		
		while (n < end) 
		{			
			if (s[n] === '\n') 
			{	
				n++;
				while (s[n] === '\t' || s[n] === ' ') n++;
				if (s[n] === '{'  && s[n-1] != "\\") 
				{
					J[j++] = '\n' + tab + Tabs(netBraces);
					netBraces++;
					J[j++] = s[n++];
				}
				else if (s[n] === '}' && s[n-1] != "\\") 
				{
					netBraces--;
					J[j++] = '\n' + tab + Tabs(netBraces);
					J[j++] = s[n++];
				}
				else 
				{
					J[j++] = '\n' + tab + Tabs(netBraces);				
				}
			}
			else 
			{
				if ((s[n] === '/') && (s[n + 1] === '*')) 
				{		
					// Process Block comment.			
					while (s[n] !== '*' || s[n + 1] !== '/' && n < end) 
					{
						if (s[n] === '\n') 
						{
							n++;
							while (s[n] == '\t' || s[n] == ' ') n++;
							J[j++] = '\n' + tab + Tabs(netBraces);
						}
						else 
						{
							J[j++] = s[n++];
						}
					}

					J[j++] = s[n];
					J[j++] = s[n + 1];
					n += 2;
				}
				else if (s[n] === '/' && s[n + 1] === '/') 
				{	
					// Process end of line comment.				
					while (s[n] !== '\n' && n < end) J[j++] = s[n++];
				}
				else if (s[n] === "'") 
				{		
					// Process single quote.				
					J[j++] = s[n++];
					while (n < end && s[n] !== "'") 
					{
						J[j++] = s[n++];
					}

					J[j++] = s[n++];
				}
				else if (s[n] === '"') 
				{		
					// Process double quote.				
					J[j++] = s[n++];
					while (n < end && s[n] !== '"') 
					{
						J[j++] = s[n++];
					}

					J[j++] = s[n++];
				}				
				else if (s[n] === '{' && s[n-1] != "\\") 
				{	
					netBraces++;
					J[j++] = s[n++];

				}
				else if (s[n] === '}' && s[n-1] != "\\") 
				{	
					netBraces--;
					J[j++] = s[n++];
				}
				else 
				{	
					J[j++] = s[n++];
				}
			}
		}		
		
		return J.join('');
	}
	
	
	function encodePropertyDescriptor(pd)
	{
		if(pd === null) return "";
		
		var code = 0;
		if(pd.hasOwnProperty("value")) code += 1;
		if(pd.writable) code += 2;
		if(pd.configurable) code += 4;
		if(pd.enumerable) code += 8;
		
		return " <" + code + ">";
	}

	function header(x, nTabs) 
	{
		// The header comes after the colon, and before
		// the properties list.	
		
		/*
			key: header 
			{
				properties list here			
			}		
		*/
		
	        
		const dt = dtype(x);	
		
		if(writeHeader[dt])
		{
			return writeHeader[dt](x, nTabs);
		} 		
		else 
		{
			if(isSimpleData || isFData)
			{
				throw exceptionAlert("Serialization Exception: dtype =  " + dt 
					+  " Too Complex for Purported Simple or Fdata");
			}	
			return dt;
		}
	}
	
	const writeHeader =
	{
		// Write headers for all the built in types.
	
		// Primitives
		"symbol":function(x)
		{
			if(isSimpleData || isFData)
				{throw exceptionAlert("Serialization Exception: Symbol Found in Purported Simple or F Data.");}
			return "Symbol(*)";
		},
		"bigint":function(x){return "BigInt(" + x + ")";},
		"number":function(x){return "" + x},
		"boolean":function(x){return "" + x},
		"string":function(x){return '"' + x + '"'},
		"undefined":function(x){return "undefined"},
		"null":function(x){return "null"},				
		// Elementary Classes
		"String":function(x){return 'String("' + x.valueOf() + '")';},
		"Boolean":function(x){return 'Boolean(' + x.valueOf() + ')';},
		"Number":function(x){return 'Number(' + x.valueOf() + ')';},
		"Date":function(x){return 'Date(' + x.valueOf() + ')';},
		"RegExp":function(x){return 'RegExp(' + x.valueOf() + ')';},
		// Quirk Classes
		"Set":function(x){return "Set"},
		"Map":function(x){return "Map"},		
		"DataView":function(x){return "DataView(" + x.byteLength + ")";},
		"ArrayBuffer":function(x){return "ArrayBuffer(" + x.byteLength + ")";},
		"WeakMap":function(x)
		{
			if(isSimpleData || isFData)
				{throw exceptionAlert("Serialization Exception: WeakMap Found in Purported Simple or FData");}	
			return "WeakMap(*)";
		},
		"WeakSet":function(x)
		{
			if(isSimpleData || isFData)
				{throw exceptionAlert("Serialization Exception: WeakMap Found in Purported Simple or FData");}	
			return "WeakSet(*)";
		},
		// Function
		"Function":function(x, nTabs)
		{
			if(isSimpleData)
				{throw exceptionAlert("Serialization Exception: Function Found in Purported Simple Data.");}			
			return tabifyFunction(x.toString(), Tabs(nTabs));		
		},
		// Array and Typed Arrays 
		"Array":function(x){return "Array";},
		"Int8Array":function(x){return 'Int8Array(' + x.length + ')';},
		"Uint8Array":function(x){return 'Uint8Array(' + x.length + ')';},
		"Uint8ClampedArray":function(x){return 'Uint8ClampedArray(' + x.length + ')';},
		"Int16Array":function(x){return 'Int16Array(' + x.length + ')';},
		"Uint16Array":function(x){return 'Uint16Array(' + x.length + ')';},
		"Int32Array":function(x){return 'Int32Array(' + x.length + ')';},
		"Uint32Array":function(x){return 'Uint32Array(' + x.length + ')';},
		"Float32Array":function(x){return 'Float32Array(' + x.length + ')';},
		"Float64Array":function(x){return 'Float64Array(' + x.length + ')';},
		// Error Classes
		"Error":function(x){return "Error";},
		"InternalError":function(x){return "InternalError";},
		"EvalError":function(x){return "EvalError";},
		"RangeError":function(x){return "RangeError";},
		"ReferenceError":function(x){return "ReferenceError";},
		"SyntaxError":function(x){return "SyntaxError";},
		"TypeError":function(x){return "TypeError";},
		"URIError":function(x){return "URIError";},
		// Fake Arguments Class
		"Arguments":function(x)
		{
			if(isSimpleData || isFData)
				{throw exceptionAlert("Serialization Exception: Arguments List Found in Purported Simple or FData");}	
			return "Arguments";
		},
		// Objects one degree aways from null, or one degree away from Object.prototype.
		"Object":function(){return "Object";}
	};
	
	
		   			
    return function stringify(x, param)
	{	
		isSimpleData = param && param.datatype === "simpledata";
		isFData = param && param.datatype === "fdata";
		
		const doHost = !isSimpleData && !isFData && (param && param.doHost !== undefined? param.doHost: false);
		const doWriteGetsSets = isFData || !isSimpleData && (param && param.doWriteGetsSets !== undefined? param.doWriteGetsSets: false); 
		const doAbbreviate = isSimpleData || isFData || (param && param.doAbbreviate !== undefined? param.doAbbreviate: true); 
		const doPrototypes = !isSimpleData && !isFData && (param && param.doPrototypes!== undefined? param.doPrototypes: true); 
		const doPropertyDescriptors = isSimpleData || isFData 
								|| (param && param.doPropertyDescriptors!== undefined? param.doPropertyDescriptors: false);
 
		
		/*
		simpledata							fdata								default (no param or param == {})
	    ---------------------------			---------------------------			---------------------------------
		doHost = false						doHost = false						doHost = false
	    doWriteGetsSets = false				doWriteGetsSets = true    			doWriteGets = false
	    doAbbreviate = true					doAbbreviate = true					doAbbreviate = true
	    doPrototypes = false				doPrototypes = false				doPrototypes = true
	    doPropertyDescriptors = true		doPropertyDescriptors = true		doPropertyDescriptors = false	 		
		*/


		var nTabs = 1;	
		const stack = new SCheaterStack();
		const str = [];
		var s = 0;
		if (isPrimitive(x)) 
		{
			return header(x, nTabs);
		}
		else 
		{
			str[s++] = header(x, nTabs);
		}			
			
			
		str[s++] = '\n{\t';  
		
		if(!isHostObject(x) || doHost )	
		{			
			const y = getProxySource(x);	
			stack.push({source:y, originalSource:x, ownKey:'top', keys:getProperProperties(y, !doPrototypes), index:0});			
		}	
		else
		{
			str[s++] = '\n}';
		}
				
		while(stack.length > 0)
		{						
			const T = stack.peek(); 
				
			if(T.index < T.keys.length ) 
			{		
				// Get and write key.							
				const key = T.keys[T.index];
				str[s++] = newLineWithTabs(nTabs) + key + ":";
			
				try // try catch is for host objects
				{					
					var source = T.source[key]; //value of key
				}
				catch(e)
				{						
					//alert(hasOwnProperty(T.source, key));	 // Always true,			
					source = "Access Violation";	         // but can't read it.							
				}
				
				var comma = true;				
				var pd = null; // If pd is not to be encoded, then pd is set to null.
				
				if(hasOwnProperty(T.originalSource, key))
				 	{ pd =  Object.getOwnPropertyDescriptor(T.originalSource, key); }

				var wroteGetterSetter = false;		
	
				if(pd !== null && (pd.get || pd.set)) // need to write enumerable/configurable/writable
				{
					if(doPropertyDescriptors || !pd.get)
					{
						// Write getter/setter header.
						str[s++] = "[getter/setter]";
						
						// Now write the property descriptor. 
						str[s++] = newLineWithTabs(nTabs);
						str[s++] = '{'; nTabs++;					
						if(pd.get)
						{	
							// Write the getter
							str[s++] = newLineWithTabs(nTabs);
							str[s++] = "get:" + tabifyFunction(pd.get.toString().replace(/^get/, "function"), Tabs(nTabs));
							str[s++] = ','; 
							
							/* Old time getters/setters look like
							{
								get: get(){}
								set:set(value){}
							},
							which can not be reused by the programmer (in deserialization or whatever), 
							whence the replacement above is necessary.
							*/
						}
						if(pd.set)
						{
							// Write the setter.
							str[s++] = newLineWithTabs(nTabs);
							str[s++] = "set:" + tabifyFunction(pd.set.toString().replace(/^set/, "function"), Tabs(nTabs));
							str[s++] = ','; 
							
							// The replacement is necessary for deserialization (see note above).
						}
						
						// Write the enumerability
						str[s++] = newLineWithTabs(nTabs);
						str[s++] = "enumerable:" + pd.enumerable;
						str[s++] = ',';
						
						// Write the configurability
						str[s++] = newLineWithTabs(nTabs);
						str[s++] = "configurable:" + pd.configurable;
	
						nTabs--; // because we next write a right brace.
						str[s++] = newLineWithTabs(nTabs);
						str[s++] = '}';
						wroteGetterSetter = true;
					}
					else
					{
						pd = null;
						// source is the value returned by the getter and will be processed below. pd is set to null
						// because the property descriptor has no meaning for a value returned by a getter.
					}
				}		
				
				// Three more times where property descriptor is not to be encoded.
				if(!doPropertyDescriptors) {pd = null;}				
				// Children and grandchildern of quirk instances
				
				//if(isDigitString(key) && stack.isQuirk(1)) {pd = null;} // No pd for child, which is a container for grandchild.
				//if(stack.isQuirk(2)) {pd = null;} // No pd for grandchild, which is an internal property of quirks instance.
				
				if(stack.peek(1).originalType === "Map" && isDigitString(key)) {pd = null;}
				if(stack.length >=2 &&  stack.peek(2).originalType === "Map" && isDigitString(stack.peek(1).ownKey)) {pd = null;}				
				if(stack.peek(1).originalType === "Set" && isDigitString(key)) {pd = null;}
				if(stack.peek(1).originalType === "ArrayBuffer" && isDigitString(key)) {pd = null;}
				if(stack.peek(1).originalType === "DataView" && isDigitString(key)) {pd = null;}

							
				if(wroteGetterSetter)
				{
					// Better to do nothing here than nest everything below.
				}					
				else if(isPrimitive(source))
				{					
					str[s++] = header(source, nTabs) + encodePropertyDescriptor(pd);								
				}					
				else if(isHostObject(source) && !doHost)	
				{						
					str[s++] = nativeType(source); 					
				}
				else if(stack.isOnStack(source))
				{			
					// Circular reference detected. Write a spcialized
					// header for it.		
					const info = stack.getCircularRefInfo(source); // Get info related to circular reference.
					const circRefDepth = info.depth; // Depth at which circular reference found.
					const levelUp = stack.length - circRefDepth; // Number levels up to find circular reference.
					// info.path is path to circular reference.
						
					str[s++] = "@" + "(" + levelUp + ")" + dtype(source)  
						+ "(" + info.path + ")" + encodePropertyDescriptor(pd);
						
				}
				else if(stack.isOnTree(source))
				{
					// Duplicate reference detected. Write a spcialized header
					// for it. info.path is path to the duplicate reference.		
					const info = stack.getDuplicateRefInfo(source);
					str[s++] = "#" + dtype(source) + "(" + (info.path) + ")" + encodePropertyDescriptor(pd);
				}					
				else //source is object
				{								
					comma = false;	// Don't write a comma after a left brace '{'.			
						
					// Write the header for the object (after colon but before property list)
					str[s++] = header(source, nTabs) +  encodePropertyDescriptor(pd)
						
						// Start new line for the properties of the object.
						+ newLineWithTabs(nTabs++) + '{';											
									
					if(source != window.opener) // Exlude window.opener to allow the window to be stringified.
					{
						
						// If source is a quirks class instance, then turn it inside out to get proxySource.
						// Otherwise proxySource = source.
						const proxySource = getProxySource(source);	
						
						if(isString(source) || doAbbreviate) 
						{			
							// Only process a properties subset.				
							stack.push({source:proxySource, originalSource:source, 
								ownKey:key, keys:getProperProperties(proxySource, !doPrototypes), index:0}); 
						}
						else
						{
							// Process all the properties.
							stack.push({source:proxySource, originalSource:originalSource, ownKey:key, 
								keys:Object.getOwnPropertyNames(proxySource), index:0}); 		
						}			
					}
					else
					{	// only happens with host objects.					
						str[s++] = newLineWithTabs(--nTabs) + '}';	// Decrement nTabs because right brace written.
					}																				
				}
				if(comma)
				{
					if(T.index < T.keys.length - 1) { str[s++] = ',' } ; // Separate properties with comma. 
				}
														
				T.index++;								
			}
			else 
			{			
				stack.pop(); 
				
				if(stack.length > 0)
				{ 
					nTabs--; // Decrement nTabs because a right brace is about to be written.
					str[s++] = newLineWithTabs(nTabs);
					str[s++] = '}'; // A source is completed so write end brace.								
					let node = stack.peek();  // Uncover previous source node.
					if(node.index < node.keys.length)
					{
						// node has not completely been processed (child node of node still outstanding)
						str[s++] = ',';  // current child node of node has subsequent sibling (commas beteween child nodes)
					}  					
				}
				else
				{
					str[s++] = '\n}'; 
				}									
			}
		}	// end while loop			
				
		return str.join('');		
	}	
 })();			
	
function serializeSimpleData(x)
{
	return stringify(x, {datatype:"simpledata"});
}

function serializeFData(x)
{
	return stringify(x, {datatype:"fdata"});
} 

function serializeClassData(x)
{
	const param = {doHost:false, doWriteGetsSets:true, doAbbreviate:true, doPrototypes:false, doPropertyDescriptors:true};
	return stringify(x, param);
}

function compareObjects(x,y)
{
	const param = {doHost:false, doWriteGetsSets:true, doAbbreviate:true, doPrototypes:false, doPropertyDescriptors:true};	
	return (stringify(x,param) === stringify(y,param)) && (stringify(x) === stringify(y)); 
}



	