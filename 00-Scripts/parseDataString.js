	"use strict";
	
	// This file: parseDataString.js
	// uses: typing.js

	
	if(!String.prototype.matchAt)
	{
		Object.defineProperty(String.prototype, 'matchAt',
		{
			value:function(index, search)
			{
				var b = true;
				var end = Math.min(index + search.length,  this.length);
				if(this.length < index + search.length) return false;	
					
				for(var n = index, s = 0; n < end; n++, s++)
				{
					if(this[n] !== search[s])
					{					
						b = false;
						break;
					}
				}
				return b;
			}		
		});
	}	
	
	function isDigitString(x)    // Is x a string of digits?
	{
		for(let i = 0; i < x.length; i++)
		{
			if(x[i] < '0' || x[i] > '9') return false;
		}
		return true;
	}
	

const parseDataString = (function()
{	
	const reg = /^!+0$|^!+[123456789][1234567890]*$/;

	function deEscapeKey(key)
	{
		return reg.test(key)?key.substring(1):key;
	}

	const pdsCheaterStack = function()
	{
		var l = 0;
		const wm = new Map();
		
		this.attachNodeToParent = function(x)
		{
			//if(!isBuiltInClassInstance(x.node))alert(type(x)); // alwats Object
		
			if(l > 0) 
			{	
				var n = l-1;
				const parentNode = this[n].node;
					
				if(quirkAddInternalNode[type(parentNode)])
				{
					if(isDigitString(x.key))
					{
						quirkAddInternalNode[type(parentNode)](this[n], x);
					}
					else if(x.key[0] === '!')
					{						
						const key = deEscapeKey(x.key);
						x.pd? Object.defineProperty(parentNode, key, x.pd): parentNode[key] = x.node;
					}
					else
					{
						if(x.pd === null)alert("x.pd is null");
					
						x.pd? Object.defineProperty(parentNode, x.key, x.pd): parentNode[x.key] = x.node;
					}
				}									
				else if(x.pd === null)
				{	
					//const key = x.key[0] === '!'? x.key.substring(1):x.key; 
					/*x.pd? Object.defineProperty(parentNode, x.key, x.pd):*/
					parentNode[x.key] = x.node; 					
				}
				else
				{						
					const parentPD = Object.getOwnPropertyDescriptor(parentNode, x.key);
					if(!parentPD || (x.pd && parentPD.configurable))
					{ 
						Object.defineProperty(parentNode, x.key, x.pd)
					}
					else if(parentPD.writable)
					{
						parentNode[x.key] = x.node;				
					}
				}		
			}	
		}
		
		this.getObjectFromPath = function(path)
		{			
			if(path === "top") return this[0].node;
			return wm.get(path);
		}
	
		this.push = function(x)
		{	
			if(isDataView(x.node))
			{
				x.index = 0;
			}	
			else if(isArrayBuffer(x.node))
			{
				x.index = 0;
				x.view = new DataView(x.node);
			}			
		
			if(l === 0)
			{
				this[l++] = x;								
			}			
			else if(l > 0) 
			{					
				var n = l-1;					
				
				if(isObject(x.node))
				{					
					x.path = this[n].path + "." + x.key;   				
					wm.set(x.path, x.node);
					{ this[l++] = x; }						
				}			
				else
				{	
					this.attachNodeToParent(x);					
				}	
			}																
		}	
		
		this.pop = function()
		{ 
			var x = this[--l];
			this.attachNodeToParent(x);	
			return x;
		}
		
		this.peek = function()
		{
			return this[l - 1];
		}
		
		Object.defineProperty(this, "length",
		{
			get: function(){return l;},
			set: function (value){l = value;}
		});
	}

	var s = "";
	var n = 0;
	var end = 0;
	var stack = new pdsCheaterStack(); 	
	var evaluator;
	var object;
	var objectClassName; 
	var topObject;
		
	function readRegExp()
	{	
		ASSERT(s[n] === '/', "/ expected in readRegExp");
		const token = []; var t = 0;
		token[t++] = s[n++];
		while( n < end && ( s[n] !== "/" || s[n-1] === "\\" ) ) token[t++] = s[n++];
		token[t++] = s[n++]; 
		while(n < end && s[n] === 'g' || s[n] === 'i' || s[n] === 'm' || s[n] === 'u' || s[n] === 'y') token[t++] = s[n++];				
		return token.join('');
	}
	
	function readQuotesInFunction(delim)
	{		
		ASSERT(s[n] === delim, " expected " + delim + "in readQuotesInFunction");
		var token = [], t = 0;
		token[t++] = s[n++];	
		while( n < end && ( s[n] !== delim || s[n-1] === "\\" ) ) token[t++] = s[n++];
		token[t++] = s[n++]; 		
		return token.join('');
	}
	
	function readBlockComment() 
	{
		ASSERT(s.matchAt(n, "/*", "readBlockComment: /* expected"));
		const J = []; var j = 0;
		J[j++] = s[n++]; // read /
		J[j++] = s[n++]; // read *
		while(n < end && (s[n-1] !== "*" || s[n] !== "/")) J[j++] = s[n++];
		J[j++] = s[n++];
		return J.join('');		 
	}
	
	function readEOLComment()
	{
		ASSERT(s.matchAt(n, "//", "readEOLComment: // expected"));
		const J = []; var j = 1;
		J[j++] = s[n++]; // read first /
		J[j++] = s[n++]; // read second /
		while(s[n] !== '\n') J[j++] = s[n++];
		J[j++] = s[n++]; // read '\n'
		return J.join('');
	}
	
	
	function readBraceToBrace()
	{
		ASSERT(s.matchAt(n, "{", "readBraceToBrace: { expected"));
		const J = []; var j = 0;
		
		J[j++] = s[n++]; // read left brace
		
		var netBraces = 1;
		var lastChar = '{';
		
		while(netBraces > 0)
		{			
			switch(s[n])
			{
				case '{':
					lastChar = '{';
					J[j++] = s[n++];
					netBraces++;
					break;
				case '}':
					lastChar = '}';
					J[j++] = s[n++];
					netBraces--;
					break;
				case '"':
					lastChar = s[n];
					J[j++] = readQuotesInFunction('"');
					break;
				case "'":
					lastChar = s[n];
					J[j++] = readQuotesInFunction("'");
					break;
				case "/":
					if(s[n+1] === '*')
					{
						J[j++] = readBlockComment();
					}
					else if(s[n+1] === '/')
					{
						J[j++] = readEOLComment();
					}
					else if(isJLetter(lastChar) || lastChar === ')' || lastChar === ']' )
					{
						// / is division symbol
						J[j++] = s[n++];
					}	
					else
					{
						J[j++] = readRegExp();
					}				
					break;	
				default:
					if(!isWhiteSpace()) lastChar = s[n];
					J[j++] = s[n++];
					break;
			}
		}
		
		return J.join('');
	}
				
	function readFunctionString()
	{
		// complicated because braces can appear in quotes and regular expressions.
		// regular expressions must be distinguished from division.
		// Both types of comments cause problems.
		
		const J = []; var j = 0; 
		J[j++] = "function";				
		while(s[n] !== '{') J[j++] = s[n++];
		J[j++] = readBraceToBrace();		
		return J.join('');		 
	}

	function readGetterSetterString() 
	{
		const J = []; var j = 0; 
		nextCharIs('{', "readGetterSetterString { expected");
		n--;
		J[j++] =  readBraceToBrace();				
		return J.join('');
	}
	
	function makeGetterSetterPropertyDescriptor(pdString, evaluator)
	{
		var pd;
		eval('pd = ' + pdString); 
		if(pd.get) { pd.get = evaluator(pd.get); }
		if(pd.set) { pd.set = evaluator(pd.set); }		
 		return pd;
	}
	
	function isAlpha(c) { return 'a' <= c && c <= 'z' || 'A' <= c && c <= 'Z'; }
	
	function isJLetter(c)
	{
		return 'a' <= c && c <= 'z' || 'A' <= c && c <= 'Z' || '0' <= c && c <= '9' 
			|| c === '_' || c === '$' || c === '!'; 			
	}
	
		
	function isDigit(c) { return '0' <= c && c <= '9'; }
	
	function skipWhiteSpaces()
	{	
		while(s[n] === '\x09' || s[n] === '\x20' || s[n] === '\x0A') n++;
	}
	
	function isWhiteSpace()
	{
		return s[n] === '\x09' || s[n] === '\x20' || s[n] === '\x0A';
	}
	
	function ASSERT(b, message) 
	{ 
		if(!b){console.log(message); alert(message); }
	}
	
	function nextCharIs(c, message) 
	{
		skipWhiteSpaces();
		
		if(s[n++] !== c)
		{
			alert("expected character " + c + "\n" + message);
			console.log("expected character " + c + "\n" + message);
		}
	}
		
	function readKey()
	{	
		ASSERT (isJLetter(s[n] && !isDigit(s[n])), "readKey: JS letter expected; got " + s[n] + s[n+1] + s[n +2]);
		const start = n;
		while(isJLetter(s[++n]));
		const r = s.substring(start, n);
		skipWhiteSpaces();
		return r;
	}
	
	function getRightSideToken()
	{
		const start = n;
		while(isJLetter(s[n]) || s[n] === '-' || s[n] === '.' || s[n] === '[' || s[n] === '/' || s[n] === ']') n++;
		return s.substring(start, n);
	}
		
	const X = 
	{		
		String:
		{
			getParameter:function()
			{
				nextCharIs('(', "X.String.getParameter: expected '('");
				nextCharIs('"', "X.String.getParameter: expected opening double quote");
				const start = n;
				while(s[++n] != '"');
				const r = s.substring(start, n++);	
				nextCharIs(')', "X.String.getParameter: expected ')'");					
				return r;				
			},
			construct:function()
			{
				return new String(this.getParameter(s));
			}					
		},
		Boolean:
		{
			getParameter:function()
			{			
				nextCharIs('(', "X.Boolean.getParameter: '(' expected");
				
				if(s.matchAt(n, "true") && !isJLetter(s[n+4]))
				{
					n += 4;
					nextCharIs(')', "X.Boolean.getParameter.true: ')' expected");
					return true;
				}
				else if(s.matchAt(n, "false") && !isJLetter(s[n+5]))
				{
					n += 5;
					nextCharIs(')', "X.Boolean.getParameter.false: ')' expected");
					return false;
				}
				else
				{
					console.log("X.Boolean: invalid boolean value");
				}				
			},
			construct:function(s)
			{
				return new Boolean(this.getParameter());
			}
		},
		RegExp:
		{
			getParameter:function()
			{
				nextCharIs('(', "X.RegExp.getParameter: '(' expected");
				const r = {}
				var token = [], t = 0;
				n++;	
				while(( s[n] !== "/" || s[n-1] === "\\" ) ) token[t++] = s[n++];
				r.regstring = token.join('');				
				n++; 
				token.length = 0;
				t = 0;
				while(s[n] === 'g' || s[n] === 'i' || s[n] === 'm' || s[n] === 'u' || s[n] === 'y') token[t++] = s[n++];				
				r.flags = token.join('');
				nextCharIs(')', "X.RegExp.getParameter: ')' expected");
				return r;				
			},
			construct:function()
			{
				const param = this.getParameter();
				return new RegExp(param.regstring, param.flags);
			}
		},
		DataView:
		{
			construct:function()
			{
				const param = X.Number.getParameter();
				return new DataView(new ArrayBuffer(param));
			}
		},		
		Number:
		{
			getParameter:function()
			{
				ASSERT(s[n++] === '(', "X.Number.getParameter: '(' expected");
				const start = n;
				while(isDigit(s[++n]));	
				nextCharIs(')', "X.Number.getParameter: ')' expected");				
				return parseFloat(s.substring(start, n));
				
			},
			construct:function(klassName)
			{
				return new window[klassName](this.getParameter());
			}
		},		
		NoParam:
		{
			construct:function(klassName)
			{		
				if(klassName === "Array") { return []; }		
				return new window[klassName](); // doesn't work for klassName = Array
			}
		}		
	};
	
	X.Date = X.Number;
	X.Int8Array = X.Number;
	X.Uint8Array = X.Number;
	X.Uint8ClampedArray = X.Number;
	X.Int16Array = X.Number;
	X.Uint16Array = X.Number;
	X.Int32Array = X.Number;
	X.Uint32Array = X.Number;
	X.Float32Array = X.Number;
	X.Float64Array = X.Number;
	X.ArrayBuffer = X.Number;	
	X.Object = X.NoParam;
	X.Array = X.NoParam;
	X.Set = X.NoParam;
	X.Map = X.NoParam;
	X.Error = X.NoParam;
	X.EvalError = X.NoParam;
	X.InternalError = X.NoParam;
	X.RangeError = X.NoParam;
	X.ReferenceError = X.NoParam;
	X.SyntaxError = X.NoParam;
	X.TypeError= X.NoParam;
	X.URIError= X.NoParam;
	X.Array = X.NoParam;
	
	function readPrimitiveOrKlassName()
	{	
		const x = {type:"primitive"};
		
		if(s[n] === '"')
		{	
			const start = n + 1;						
			while(s[++n] != '"');
			x.value = s.substring(start, n++);		
		}
		else if(s.matchAt(n, "BigInt"))
		{
			n += 6;
			nextCharIs('(');
			start = n;
			while(s[++n] != ')');
			const digits = s.substring(start, n++);
			x.value = BigInt(digits);			
		}		
		else
		{
			const token = getRightSideToken();
									
			if(token[0] === '-' || isDigit(token[0]))
			{
				x.value = parseFloat(token);
			}
			else if(token === "true")
			{
				x.value = true;
			}
			else if(token === "false")
			{ 
				x.value = false;
			}
			else if (token === "null") 
			{
				x.value = null;
			}				
			else if (token === "undefined") 
			{ 
				x.value = undefined; 
			}
			else if(token === "NaN")
			{
				x.value = NaN;
			}			
			else if(token === "Infinity")
			{
				x.value = Infinity;
			}
			else if(token === "-Infinity")
			{
				x.value = -Infinity;
			}
			else if(token === "function")
			{
				x.type = "function";
			}
			else if(token === "[getter/setter]")
			{
				x.type = "[getter/setter]";
			}
			else
			{				
				x.type = "class";
				x.klassName = token;
			}
		}		
						
		return x;		
	}
	
	function getStringPathInsideParenthes()  // FOR CD REFERENCES
	{
		while(s[n++] != '(');
		const start = n;
		while(s[++n] != ')');
		return s.substring(start, n++);     		
	}
	
	function getPropertyDescriptor(value)
	{
		var pd = null;
		
		if(s.matchAt(n, " <")) 
		{			
			n += 2;
			const start = n;
			while(s[n++] != '>');
			const end = n;
			const code = parseFloat(s.substring(start,end));	
			pd = {};								
			pd.value = value;
			pd.writable = code & 2? true:false;
			pd.configurable = code & 4? true:false;
			pd.enumerable = code & 8? true:false;									
		}		
		
		return pd;
	}
		
	function addObjectToStack()
	{		
		const key = readKey();	
		
		nextCharIs(':', "addObjectToStack: ':' expected got " + s[n]);		
				
		if( (s[n] === '@') || (s[n] === '#')) 	// FOR CD REFERENCES
		{				
			if(s[n] === '@') { while(s[n++] != ')'); }		
			const stringPath = getStringPathInsideParenthes();	
			const objRef = stack.getObjectFromPath (stringPath);
			const pd = getPropertyDescriptor(objRef);
			const current = stack.peek();	
			if(pd === null) 
			{
				if(isSet(current.node) && isDigitString(key)) {current.node.add(objRef);}	
				//else if(isMap(current.node) && isDigitString(key)){alert("AAAAAAAA"); current.node.set(objRef.key, objRef.value);}	
				else current.node[key] = objRef;
			}
			else 
			{
				Object.defineProperty(current.node, key, pd);
			}			
			return;	
		}
		
		const x = readPrimitiveOrKlassName();	
		
				
		switch(x.type)
		{
			case "primitive":				
				var pd = getPropertyDescriptor(x.value);
				stack.push({node:x.value, key:key, pd:pd});			
				break;
			case "function":
				const funcString = readFunctionString();								
				if(evaluator === undefined)
				{
					alert("ParseDataString-Add-addObjectToStack: Fatal Error - No evaluator given");
					console.log("ParseDataString-Add-addObjectToStack: Fatal Error - No evaluator given");
				}
				else
				{			
					var klassInstance = evaluator(funcString);
				}	
				var pd = getPropertyDescriptor(klassInstance);	
				stack.push({node:klassInstance, key:key, pd:pd});	
				klassInstance.prototype = klassInstance.prototype; 	// Don't Remove This!			
				nextCharIs('{', "addObjectToStack: '{' expected  got " + s[n]); 
				break;
			case "[getter/setter]":
				const str = readGetterSetterString();
				pd = makeGetterSetterPropertyDescriptor(str, evaluator);
				Object.defineProperty(stack.peek().node, key, pd);					
				break;	
			case "class":
				if(X[x.klassName])
				{
					const klassName = x.klassName;
					var klassInstance = X[klassName].construct(klassName);	
					var pd = getPropertyDescriptor(klassInstance);	
					stack.push({node:klassInstance, key:key, pd:pd});					
					nextCharIs('{', "addObjectToStack: '{' expected  got " + klassName); 	
				}
				else if(x.klassName === objectClassName) 
				{ 						
					var klassInstance = object;
					var pd = getPropertyDescriptor(klassInstance);
					stack.push({node:klassInstance, key:key, pd:pd});					
					nextCharIs('{', "addObjectToStack: '{' expected  got " + s[n]); 
				}
				else
				{
					alert("parseDataString-addObjectToStack Error: Unrecognized class name: + " + x.klassName);
					console.log("parseDataString-addObjectToStack Error: Unrecognized class name: + " + x.klassName); 
				}					
				break;		
		}			
	}		
		
	function addFirstObjectToStack(klassName)
	{		
		if(X[klassName])
		{			
			topObject = X[klassName].construct(klassName);			
		}	
		else
		{
			console.log("addFirstObjectToStack error: unrecognized class name: + " + klassName); 
			alert("addFirstObjectToStack error: unrecognized class name: " + klassName);
		}
		
		stack.push({node:topObject, key:"", path:"top"});
		skipWhiteSpaces();	
	}
	
	const quirkAddInternalNode =
	{
		Set:function(parent, child)
		{			
			parent.node.add(child.node);
		},
		Map:function(parent, child)
		{
			parent.node.set(child.node.key, child.node.value);
		},
		DataView:function(parent, child)
		{		
			parent.node.setInt8(parent.index++, child.node);
		},
		ArrayBuffer:function(parent, child)
		{
			parent.view.setInt8(parent.index++, child.node);
		}		
	}
		
	function parseDataString(dataString, evaluator$, _obj, _objClassName)
	{			
		s = dataString;
		n = 0;
		end = s.length;
		evaluator = evaluator$;
		object = _obj;
		objectClassName = _objClassName;
		stack.length = 0;
				
		const x = readPrimitiveOrKlassName();		
		if(x.klassName) { addFirstObjectToStack(x.klassName); }
		else {return x.value; }
					
		nextCharIs('{'); 
		skipWhiteSpaces();  
								
		while(stack.length > 0 && n < end)
		{				
			if(s[n] != '}')	
			{					
				addObjectToStack();				
				skipWhiteSpaces();
				if(s[n] === ',') n++;
				skipWhiteSpaces();									
			}
			else
			{					
				n++;
				skipWhiteSpaces();
				if(s[n] === ',') n++;				
				stack.pop();
				skipWhiteSpaces();
				
			}
		}
		return topObject;
	}  
	
	return parseDataString;
})();

