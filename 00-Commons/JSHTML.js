// © 2018 Meouzer Consortium

"use strict"; // catches some errors. 

	// Export
	var applyJSHTML;	
	
	
	var DO_ASSERT = true;	
	if(DO_ASSERT)
	{	
		// Assert condition b.		
		var Assert = function(b, message) { 
			if(!b) { alert(message); }
		}
	}
	else {	var Assert = function(){}; }
	
	function forEach(collection, func)
	{
		for(let i = 0; i < collection.length; i++)
		{
			func(collection[i]);
		}
	}	
	
	if(!String.prototype.matchAt)
	{	
		Object.defineProperty(String.prototype, 'matchAt',
		{
			// Is the search string found at the indicated index?
		
			value:function(index, search)
			{
				var b = true;
				const end = Math.min(index + search.length,  this.length);
				if(this.length < index + search.length) return false;	
					
				for(let n = index, s = 0; n < end; n++, s++)
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
	
		
(function ENCLOSURE_FOR_JSHTML()
{
	// ENCLOSURE_FOR_JSHTML will define applyJSHTML(), the function to be exported, 
	// at the very end.
	
	// Configure JSHTML defaults as you prefer.		
	const DEFAULT_BODY_INDENT = 4;
	const DEFAULT_BRACE_INDENT = 4;
	const DEFAULT_IMPLICIT_INDENT = 4;
	const DEFAULT_CASE_INDENT = 5;	
	const DO_TELESCOPE_IMPLICIT_INDENT = true;	

	function getDelimStack()
	{
		/* 	delims are '(' and '{' and '[' and 'switch{'.
		 	
		 	By looking at delimStack.peekDelim() we can tell what the current
		 	innermost section is: (...) or {...} or [...]  or switch(){...}  */
	
		const stack = []; var length = 0;		
		
		return Object.create(null,
		{
			push:
			{
				value:function(delim)
				{
					stack[length++] = delim;
				}
			},
			pop:
			{
				value:function()
				{					
					return stack[--length]; 
				}
			},	
			peekDelim:
			{		
				value:function()
				{
					if(length > 0)
					{
						return stack[length - 1];
					}
					else
					{
						return undefined;
					}
				}
			},
			
			length:
			{
				get:function()
				{
					return length;
				},
				set:function(value)
				{
					length = value;
				}
			},			
		});
	};	
		
	// Export
	var FormatJavaScript;			
	
	(function FormatJavaScript_ENCLOSURE()
	{
		// configure telescoping.
		//var doTelescopeImplicitIndent = DO_TELESCOPE_IMPLICIT_INDENT; // directives can change value.
	
		// __________________________________Globals _________________________________________________
			var codeBox = null;	  	// The HTML div of class codeBox whose JavaScript is to be formatted. 
			var s = '';				// The inner HTML of the code box to process into formatted JavaScript.	
			var end = 0;			// The length of s.
			var n = 0;				// The current parsing position in s.
			var JS = [];			// JS once joined will become the formatted JavaScript.
			var j = 0;				// Current position in JS.
			var lastCodeId = null;  // Last JavaScript token parsed. E.g., '{', 'switch', 'var' 'myVar', etc.
			var colorize = true;    // If true, coloroize the JavaScript key words. 
			const CODE_NUMBER_SPACER = "<span class='lineNumber'>&nbsp;</span>"; // vacant space for code number to fill.
			var NWS = 0;			// Number white spaces	
			const delimStack =  getDelimStack(); // See above notes for getDelimStack().			
		
			const Process = new (function()
			{
				{					
					const getNumberLineBreaks = function()
					{			
						var count = 0;					
						var str = JS[j-1];		
						if(str === '\x20' || str === '\x09') {str = JS[j-2]; }
						// After a block is entered and after the block there might be a white 
						// space after it because white space is condensed to a single white space. 
						// So we might have to go back one to get the block tag, if the last entity
						// written is indeed a block. 
												
						var decrement = 0;
						if(str != undefined && str[0] == "<")
						{		
							// Before 		
							if(str.matchAt(0, "<div") || str.matchAt(0, "</div") || isBlock(str, 0))
							{
								decrement = 1;
								// decrement number line breaks by one because there visually
								// is an automatic line break after a block is entered
								// and after the block.
							}
						}
									
						Assert(s[n] === '\n', "writeLineBreaks()['\n']() must start with '\n'");
						
						while(s[n] === '\n')
						{
							n++;
							count++;
							skipWhiteSpaces();
						}
						
						if(j === 0) count = 0; // If j is zero, we are at the start of parsing.
						count -= decrement;	
						return count;
					}
					
					this['\n'] = function()
					{	
						Assert(
							s[n] === '\n', 
							"Process['\\n']() Error: Expected '\\n' but found " + s[n] + " with character code " + s[n].charCodeAt(0) + "."
						);
						
						NWS = -1;
					
						const numLineBreaks= getNumberLineBreaks();			
						
						if(numLineBreaks > 0)
						{
							const breaks = []; var b = 0;			
							for(let k = 0; k < numLineBreaks; k++)
							{
								breaks[b++] = "<br>";
							}
							
							JS[j++] = breaks.join('');				
						 }
						 	 
						skipWhiteSpaces();
												
						if(s[n] === '<' && s[n+1] === '!')
						{
							ignoreHTMLComments();
						}							
									
						skipWhiteSpaces();			
										
						if(isJavaScriptCode() || s.matchAt(n,"<span>")) 
						{
							codeNumberLogic.writeCodeNumbersAndIndentations();	
						}											
					}
				}
				
				this['/*'] = function()
				{
					ProcessBaseIndentationsOnly('/*', '*/');
				}
				
				this['//'] = function()
				{
					// End Of Line Comment. 
					// See previous comment about EOL using writeWhiteSpaces.
									
					if(NWS > 0)				
					{	
						// Handle start of line spaces.									
						var token = new Array(NWS);										
						for(let k = 0; k < NWS; k++){token[k] = '&nbsp;';}
						JS[j++] = token.join('');										
					}						
	
					// Start a section so we don't fragment the comment.							
					switchJS.startSection();
					
					JS[j++] = "//"; 
					n += 2;
					
					var tagDepth = 0;
					 		
					while(n < end)
					{
						if(s[n] === '\n') 
						{				 				
							break;
						}
						else if(s[n] === '<')
						{
					 		writeTextSection();
						}					 			
						else
						{
							if(s[n] === '\x09' || s[n] === '\x20')
							{
								writeHardWhiteSpaces();
							}
							else
							{
								JS[j++] = s[n++];						 			
							}
						}
					}	
									
					switchJS.writeSection('//'); // '//' gives the correct green colorization for the EOL comment.
				}
				
				this['<'] = function() 
				{
					// Possibly write a "Text Section" having nothing to do with JavaScript.
					// Or ignore an HTML comment. 
					// Or write start div tag <div ... > or write end div tag </div>.
				
					var isStartDiv = s.matchAt(n+1, "div"); 
					
					if('a' <= s[n+1] && s[n+1] <= 'z' && !isStartDiv)
					{											
						writeTextSection();  // Write an <abc>...</abc> in one piece.
						skipWhiteSpaces();	 // MIGHT BE ABLE TO TAKE OUT										
					}
					else if(s[n+1] === '!' && s[n+2] === '-' && s[n+3] === '-')
					{	
						ignoreHTMLComments();																			
					}
					else if(s[n+1] === '/')
					{				
						// Can't be an </abc> since these are consumed by writeTextSection().			
						// Thus must be at </div>
							
						Assert(s.matchAt(n, "</div>")  , "Parse Function HTML Error(Not a div end tag)" + "\n"
							+ s[n] + s[n+1] + s[n+2] + s[n+3] + s[n+4] + s[n+5]);						
						writeEndTag();	
																
						skipWhiteSpaces(); // MIGHT BE ABLE TO TAKE OUT					
					}		
					else 
					{						
						Assert(s.matchAt(n, "<div")  , "Parse Function Programmer Error(Not a div start tag)");	
						writeStartTag();
					}
				}
				
				var PreDivSet =				
				{		
					// The PreDivSet is used to distingish between divisions and regular expressions.
					// Just before a division symbol must be a number, an alpha numeric, a	right 
					// parantheses or a right square brace, none of which are legal before a regular 
					// expresssion.
					
					'number':null,			
					'alphaNumeric':null,    
					')':null,
					']':null
				};	
				
				this['/'] = function()
				{
					switch(s[n+1])
					{
						case '*':
							this['/*']();
							break;
						case '/':
							this['//']();	
							break;	
						default:
							if(PreDivSet[lastCodeId] === null)
							{
								// Division:
								writeToken("/"); n++;
							}
							else
							{
								// Regular Expression (\/ escape is handled):						
								var token = [], t = 0;
								token[t++] = "/"; n++;	
								while( n < end && ( s[n] !== "/" || s[n-1] === "\\" ) ) token[t++] = s[n++];
								token[t++] = s[n++]; 
								while(n < end && s[n] === 'g' || s[n] === 'i' || s[n] === 'm' || s[n] === 'u' || s[n] === 'y') token[t++] = s[n++];				
								writeToken(token.join(''),'regexp');	
							}
						break;	
					}
				}

				this['≤'] = function()
				{
					codeNumberLogic.setLastLineHasCode();						
					lastCodeId = '≤';				
					writeToken('≤');
					n++;
				},
				this['≥'] = function()
				{
					codeNumberLogic.setLastLineHasCode();						
					lastCodeId = '≥';				
					writeToken('≥');
					n++;
				},
				this['('] = function()
				{					
					delimStack.push('(');	
					lastCodeId = '(';				
					writeToken('(');
					n++;						
				},
				this[')'] = function()
				{				
					delimStack.pop(); 				
					lastCodeId = ')';				
					writeToken(')');
					n++;
				},
				this['?'] = function()
				{	
					codeNumberLogic.setLastLineHasCode();						
					lastCodeId = '?';				
					writeToken('?');
					n++;
				},
				this['.'] = function()
				{
					codeNumberLogic.setLastLineHasCode();
					lastCodeId = '.';				
					writeToken('.');
					n++;
				},
				this['='] = function()
				{	
					codeNumberLogic.setLastLineHasCode();				
					var token = '=';		
					if(s[n+1] === '=') 
					{
						token = '==';
						if(s[n+2] === '=') token = '===';	
					}	
					writeToken(token);	
					n += token.length;
					lastCodeId = token;
				},
				this['!'] = function()	
				{		
					codeNumberLogic.setLastLineHasCode();		
					var token = '!';		
					if(s[n+1] === '=') 
					{
						token = '!=';
						if(s[n+2] === '=') {token = '!==';}	
					}
					else if(s[n+1] === '!'){token = '!!'};
					writeToken(token);	
					n += token.length;
					lastCodeId = token;
				},
				this['|'] = function()
				{		
					codeNumberLogic.setLastLineHasCode();			
					var token = '|';
					if(s[n+1] === '|') token = '||';
					else if (s[n+1] === '=') token = '|=';			
					writeToken(token);	
					n += token .length;
					lastCodeId = token ;
				},
				this['+'] = function()								// {+,+=,++}. 
				{					
					codeNumberLogic.setLastLineHasCode();							
					var token = '+';
					if(s[n+1] === '+') token = '++';
					else if (s[n+1] === '=') token = '+=';				
					writeToken(token );	
					n += token.length;
					lastCodeId = token;
				},
				this['-'] = function()								// {-,-=,--}.
				{				
					codeNumberLogic.setLastLineHasCode();
					var token = '-';			
					if(s[n+1] === '-') token = '--';
					else if (s[n+1] === '=') token = '-='				
					writeToken(token);	
					n += token.length;
					lastCodeId = token;
				},	
				this['^'] = function()								// {^,^=}. 
				{		
					codeNumberLogic.setLastLineHasCode();
					var token = '^';									
					if(s[n+1] === '=') token = '^=';				
					writeToken(token );	
					n += token.length;
					lastCodeId = token;
				},		
				this['%'] = function()								// {%,%=}. 
				{	
					codeNumberLogic.setLastLineHasCode();
					var token = "%";											
					if(s[n+1] === '=') token = '%=';				
					writeToken(token);	
					n += token.length;
					lastCodeId = token;
				},
				this['*'] = function()								// {*,*=}.
				{					
					codeNumberLogic.setLastLineHasCode();
					var token = '*';
					if(s[n+1] === '=') token = '*=';
					writeToken(token);	
					n += token.length;
					lastCodeId = token;
				},	
				this['~'] = function()								// {~,~~} unary operators.
				{					
					codeNumberLogic.setLastLineHasCode();
					var token = '~';
					if(s[n+1] === '~') token = '~~';								
					writeToken('~', token);	
					n += token.length;
					lastCodeId = token;
				}	
				
				this[';'] = this[','] = this[':'] = function() // For ';', ',', and ':'.
				{	
					lastCodeId = s[n];
					writeToken(s[n]);	
					n++;  
				}
				
				this['{'] = this['['] = function() 
				{				
					// Write sequence of left braces, not continuing past end of line. 
					// Currently any space inbetween is eliminated.
					
					if(s[n] === '{' && indentationLogic.isAtSwitch())
					{
						delimStack.push("switch{");
					}
					else
					{
						delimStack.push(s[n]);
					}                                                                      				
					 	
					lastCodeId = s[n];																	
					JS[j++] = s[n++];	
					indentationLogic.incrementNetBraces();	
				}
			
				this['}'] = this[']'] = function() 
				{					
					delimStack.pop(); 
					lastCodeId = s[n];				 		
					indentationLogic.decrementNetBraces();						
					writeToken(s[n++]); 					
				}
				
				this['\x20'] = this['\x09'] = writeWhiteSpaces;
				
				this["'"] = function()
				{
					codeNumberLogic.setLastLineHasCode();
					lastCodeId = "'";								
					ProcessBaseIndentationsOnly("'", "'");	
				},	
				
				this['"'] = function()
				{
					codeNumberLogic.setLastLineHasCode();
					if(s[n+1] === '\\' && s[n+2] === 'c')
					{					
						lastCodeId = '"\\c';
						
						JS[j++] = '<span js="db-qt-code">'; // Style set in JSHTML.css as maroon italic.
						JS[j++] = s[n++]; 					// Write double quote. 
						n += 2; 							// Move past '\c'.
											
						colorize = false;					// Don't colorize(want all maroon).					
						while( n < end && ( s[n] != '"' || s[n-1] === '\\' )  ) 
						{					
							Parse(); 					
						}
						JS[j++] = s[n++];		// Write double quote.											
						Assert(s[n-1] === '"', "Process.Quotes(): Unterminated double quoted code section.")
						JS[j++] = "</span>";	
						colorize = true;
					}
					else
					{							
						lastCodeId = '"';					
						ProcessBaseIndentationsOnly('"','"');
					}
				}		
				
				this['&']  = function() 	
				{
					Assert(s[n] == '&', "Process error amp");			
					var token = '&'; 
					var isCode = true;				
					switch(true)
					{						
						case s.matchAt(n+1, "amp;") : // {&}.	
							token = "&amp;";
							
							if(s.matchAt(n+5, "&amp;")) // {&&}. 
							{
								token = '&amp;&amp;';
							}
							else if(s[n+5]=== '=')
							{
							 	token = '&amp;=';	
							}					
							break;					
						case s.matchAt(n+1,"lt;"): // {<}. 					
							token = "&lt;";						
							
							if(s[n+4] === '=')
							{
								token = "&lt;=";  // {<=}.
							}
							else if(s.matchAt(n+4,"&lt;")) // {<<}. 
							{
								token = '&lt;&lt;';
								
								if(s.matchAt(n+8,"&lt;")) // {<<<}. 
								{
									token = '&lt;&lt;&lt;';
								}
							}
							
							break;	
						case s.matchAt(n+1,"gt;"): // {>}. 
							token = "&gt;";											
							
							if(s[n+4] === '=')
							{
								token = "&gt;="; // {>=}.
							}
							else if(s.matchAt(n+4,"&gt;")) // {>>}. 
							{
								token = '&gt;&gt;';
								
								if(s.matchAt(n+8,"&gt;")) // {>>>}. 
								{
									token = '&gt;&gt;&gt;'; 
		
								}
							}
							break;						
						default: 
							// Examples: 
							// (1) {&nbsp;} hit. 
							// (2) {&empty;&sect;&ensp;} not hit because editor converts to single ascii characters.
							//lastCodeId = "special character";
							isCode = false;
							var k = 0;
							for(token = "&"; k+n < end && s[k+n] !== ';'  ; token += s[++k + n]);		
							break;							
					}		
		
					if(isCode)
					{			
						lastCodeId = token;	
						codeNumberLogic.setLastLineHasCode();
					}
					
					writeToken(token);											
					n += token.length; 				
				}	
									
				{
					const getBlockIndentationNumber = function () // Helper function for Process['\\']().
					{								
						switch(s[n+2])
						{
							case 'b':
								var N = parseFloat(s[n+3])*indentationLogic.getBraceIndent();
								n += 4;
								break;						
							case 'c':
								var N = parseFloat(s[n+3])*indentationLogic.getCaseIndent();						
								n += 4;
								break;
							case 'i':
								var N = parseFloat(s[n+3])*indentationLogic.getImplicitIndent();
								n += 4;						
								break;		
							default:						
								var N = parseFloat(s[n+2] + s[n+3]);
								n += 4;
								break;							
						}
						
						return N;
					}					
					
					this['\\'] = function()
					{
						// Indentation directives for the programmer to adjust indentation.
						// Code number directives for the programmer to adjust code numbers.
								
						switch(s[n+1])
						{
							/* 	Indentation directives: 
									Must be written at a start or end of a line of code
									before any comment.
							
									\^b3 and \$b3 increments/decrements indent by 3 brace indents.
									\^c3 and \$c5 increments/decrements indent by 5 case indents.
									\^i2 and \$i2 increments/decrements indent by 2 implicit indents.
									\^03 and \$03 increments/decrements indent by 3 spaces.
									\^13 and \$13 increments/decrements indent by 13 spaces.
												
								Code number directives:
														
									See	 codeNumberLogic.processNumberDirectives()					
							*/
							
							case '^':						
								var N = getBlockIndentationNumber();						
								indentationLogic.incrementBlockIndent(N); 												
								skipWhiteSpaces();	
								var atStartOfLine = s[n] !== '\n' || s[n] !== '/'; // If not at end then at start.
								if(atStartOfLine)
								{
									 codeNumberLogic.writeCodeNumbersAndIndentations();	
									// In Process['\n'] isJavaScriptCode() returns false since 
									// after skipping spaces '\^' is found. Thuse once we know
									// the correct indentation we need to write it now because
									// Process['\n'] can't do it because it doesn't know
									// the correct indentation			
								}		
								break;
							case '$':					
								var N = getBlockIndentationNumber();						
								indentationLogic.incrementBlockIndent(-N); 											
								skipWhiteSpaces();
								var atStartOfLine = s[n] !== '\n' || s[n] !== '/'; 
								if(atStartOfLine)
								{
								 	codeNumberLogic.writeCodeNumbersAndIndentations();
								 	// In Process['\n'] isJavaScriptCode() returns false since 
									// after skipping spaces '\$' is found. Thuse once we know
									// the correct indentation we need to write it now because
									// Process['\n'] can't do it because it doesn't know
									// the correct indentation.		
								 }						
								break;					
							case 'n':												
								codeNumberLogic.processNumberDirectives();
								break;
							case 't':
								if(s.matchAt(n, "\\telescopeOn"))
								{
									indentationLogic.telescope(true);									
									n += 12;
								}
								else if(s.matchAt(n, "\\telescopeOff"))
								{
									indentationLogic.telescope(false);
									n += 13;
								}						
								break;						
							default:					
								JS[j++] = s[n++]; // Write backslash.				
								break;
						}
					}					
				}
				{
					
					const KeyWordSet = new Set(
					[
						'break', 	'case', 	'catch', 	'continue', 	'default', 	'delete', 	
						'do', 		'else',		'export', 	'false', 		'for', 		'function',
						'get',		'if',		'in',		'import',		'instance',	'instanceof',
						'let',		'new',		'null',		'return',		'set',		'switch',
						'this',		'throw',	'true',		'try',			'typeof',	'var',
						'void',		'with',		'while',	'yield',		'const'		
					]);
				
					const ProcessNumber = function ()
					{									
						const word = []; var w = 0; // Join of word will be number as a string.
												    // word.type will be determined for colorization.				
						
						if(s[n] === '-' || s[n] === '+') 
						{ 						
							word[w++] = s[n++]; 
						}	
						
						// Get the type and write type preamble
						word.type = "dec";
						word[w++] = s[n++];		// write first char after any sign.					
						
						if(s[n-1] === '0')// '0' aleready read/written
						{
							if(s[n] === 'x'){word[w++] = s[n++]; word.type = "hex";}
							else if('1' <= s[n] && s[n] <= '7'){word[w++] = s[n++]; word.type = "oct";}
						} 
						
						// Write the remaining digits
						switch(word.type)
						{
							case "hex":
								while( isHexDigit() ) 
								{ 
									word[w++] = s[n++];
								}
								break;
							case "oct":
								while(isOctDigit())
								{ 
									word[w++] = s[n++];
								}
								break;
							case "dec":
								var numDecimals = 0;
								
								while( isDigit() || s[n] === '.' )
								{			
									if(s[n] == '.' && ++numDecimals > 1) {break;}					
									word[w++] = s[n++];
								}
								
								if(s[n] === 'e' || s[n] === 'E') 	
								{
									word.type = 'exp';
									word[w++] = s[n++];
									
									if(s[n] === '+' || s[n] === '-') 
									{ 
										word[w++] = s[n++];
									}
									
									while(isDigit())
									{
										word[w++] = s[n++];
									}
								}	
								break;	
						}
						
						return word;
					}
		
					const isAlpha = function() 
					{
						const chr = s[n];
						return 'A' <= chr &&  chr <= 'Z' || 'a' <= chr && chr <= 'z' || chr === '_'  || chr === '$';
					}	
					const isDigit = function()
					{
						const chr = s[n];
						return '0' <= chr &&  chr <= '9';
					}
						
					function isHexDigit()
					{
						return '0' <= s[n] && s[n] <= '9' || 'A' <= s[n] && s[n] <= 'F';
					}	
					
					function isOctDigit()
					{
						return '0' <= s[n] && s[n] <= '7';
					}				
	
					function isNumber()
					{
						const chr = s[n];
						if( '0' <= chr && chr <= '9' ) return true;
						if((chr === '+' || chr === '-' || chr === '.') && '0' <= s[n+1] &&  s[n+1] <= '9') return true;
						if( (chr === '+' || chr === '-' ) && (s[n+1] === '.')) return  '0' <= s[n+2] &&  s[n+2] <= '9';	
						return false;			
					}						
							
					this.writeAlphaNumeric = function()
					{
						var didWrite = false; // Did we write alpha-numeric code? Not yet!
								 		
						if(isNumber())												
						{	
							// NUMBERS:										
							lastCodeId = 'number'; 													
							var word = ProcessNumber();	
							writeToken(word.join(''), word.type); // Write number to JS with proper colorization. 
							didWrite = true;
						}	
						else if( isAlpha())
						{							
							// ALPHA NUMERIC:					
							lastCodeId = 'alphaNumeric';  							
							var word = [], w = 0;
							word[w++] = s[n++];
								
							while(isDigit() || isAlpha() )  
							{
							 	word[w++] = s[n++];
							}
									
							word = word.join('');	
																	
							if(KeyWordSet.has(word))
							{														
								if(word === 'switch')
								{
									indentationLogic.pushNetBracesOntoSwitchStack();  // Our switch found indicator.
									                                                  // Used in sophicated indentation scheme.
								}
								
								writeToken(word,"keyword"); // Write "switch" to JS with proper colorization.
							}
							else
							{
								JS[j++] = word;	
								Assert(JS[j-1].length > 0, "Empty JS entry in writeAlphaNumeric()")				
							}
							
							didWrite = true;
						}
				
						if(didWrite)
						{
							// JavaScript code was found. 					
							codeNumberLogic.setLastLineHasCode(); // Indicate code found for code numbering.
						}
						
						return didWrite; // Return true for Parse() to know AlphaNumeric written.  
					}						
				}					
			})(/*End Process*/);


			function Parse()
			{				
				if(Process.writeAlphaNumeric()) 
				{
					// Alpha numeric, possibly numeric only, already read and processed.
					return;
				}
				else if(Process[s[n]]) // If Process[s[n]] is defined, then process according to what s[n] is. 
				{                      // s[n] = a type of bracket, operator, quotes, etc. Search for "The Process Map."  
					Process[s[n]]();
				}
				else
				{					
					//	SINGLE EXTENDED ASCII CHARACTERS THAT EDITOR CONVERTED FROM HTML ESCAPES OF THE FORM '&...;'  
					//	&ensp; is an example that the editor converts to a single character. 
					//	&nbsp; is an example that the editor does not convert to a single character. 
					// &le; and &ge; are converted to single characters ≤ ≥, but there handled by Process.
					Assert(s[n] !== '&', "Parse Error 1"); 					
					JS[j++] = s[n++];
					Assert(JS[j-1] !== undefined, "Undefined entry made to JS in Parse");	
				}						
			};
			
			FormatJavaScript = function (codeBoxInnerHTML, indentationParams, enableCodeNumbering)
			{
				s = codeBoxInnerHTML;
				end = s.length;	
				n = 0;
				JS.length = 0;
				j = 0;
				lastCodeId = null;
				colorize = true;
				NWS = 0;
				delimStack.length = 0;			
				indentationLogic.initialize(indentationParams);	
				codeNumberLogic.initialize(enableCodeNumbering);				
				
				skipWhiteSpaces();  // Ignore leading white spaces
				
				while(n < end) 
				{
					Parse(); // Read from s and write to JS. 		
				}	
				
				Assert(JS[j] == undefined, "Error in processCodeBox");
				codeNumberLogic.writeCodeNumber(); 	// Back  fill the very last code number in the code box.		
				return JS.join('');    				// Formatted JavaScript
				
			}
		
		//================================================================================================
		// Indentation Logic
		//================================================================================================
		const indentationLogic = new (function() // Oh! Yea! This gets complicated.
		{				
			var bodyIndent = 0;						// Indent (in number of &nbsp;) of extreme left side to JavaScript code.
			var braceIndent = 0;					// Indent from extrem left side of {...} to JavaScript code inside braces.
			var numberOfImplicitIndents = 0;		// See implicitIndent below.
			var netBraces = 0;						// Net total of all net braces. +1 for '{'. -1 for '}'.
			var caseIndent = 0;						// Indent from left side of case statement to JavaScript code.
			var implicitIndent = 0;					// Indent for next line, for each line of code not completed on that line.
			var blockIndent = 0;					// Used by programmer to fine adjust indentation.
			var increment = 0; 						// Used by the program to fine adjust indentation.
			var doTelescope = true;
			const switchStack = []; 
			switchStack.length = 0;				
			// Stack indexed on number nested switches with netBraces as values
			// Assert(switchStack[switchStack.length - 1] == netBraces) 
			// The keyword "switch" is read in  writeAlphaNumeric() at which time 
			// the netBraces are pushed onto the stack.			
					
			// getNumberOfCaseIndents
			//        |
			//    getIndent
			//        |
			// writeCodeNumbersAndIndentations
			//        |             |
			// Process['\n']   Process['\\'] 
	
				
			function getNumberOfCaseIndents()
			{
				var numberOfCaseIndents = switchStack.length;
					
				if(numberOfCaseIndents > 0 && netBraces >= switchStack[numberOfCaseIndents - 1]) // At switch or inside switch body.
				{			
					if(netBraces === switchStack[numberOfCaseIndents - 1]) 
					{
						// At switch statement. Next writen token will be opening brace of switch.
											
						if(s[n] === '{') 
						{				
							// At opening brace of switch
							// First brace of switch statement overrides numberOfCaseIndents because 
							// it provides indentation for the full body of switch statement.
							numberOfCaseIndents--; 
						}
						else if(lastCodeId === '}')
						{
							// Closing brace of switch was at end of line.
							// We are now on the next line
							
							switchStack.pop();
							numberOfCaseIndents--;
						}
					}
					else if(netBraces === 1 + switchStack[numberOfCaseIndents - 1]) 
					{
						// Immediately inside switch body. 
					
						if (s[n] === '}') 				// Closing brace of switch at start of line.
						{
							switchStack.pop(); 			// Pop current switch off stack.
							numberOfCaseIndents--; 		// Decrement numberOfCaseIndents.
						}
						// Immediately inside switch body, no case indents at case or default statements.
						else if(s.matchAt(n,"case") && numberOfCaseIndents > 0) 
						{
							numberOfCaseIndents--;  	// No case indent for this particular switch
						}
						else if(s.matchAt(n,"default") && numberOfCaseIndents > 0)
						{
							numberOfCaseIndents--;		// No case indent for this particular switch						
						}														
					}
				}
				
				return numberOfCaseIndents;
			};
			
			function isDelim(c)
			{
				return c === '{' || c === '[' || c === '(' || c === '}' || c === ']' || c === ')';     
			}
			function isStartDelim(c)
			{
				return c === '{' || c === '[' || c === '(' ;
			}
			function isEndDelim(c)
			{
				return c === '}' || c === ']' || c === ')' ;     
			}
						
			function isBracket(c)
			{
				return c === '{' || c === '[' || c === '}' || c === ']'; 
			}
			
			this.initialize = function(params)
			{
				bodyIndent = params.bodyIndent;	
				braceIndent = params.braceIndent;			
				numberOfImplicitIndents = 0;
				netBraces = 0;
				blockIndent = 0;
				switchStack.length = 0;
				caseIndent = params.caseIndent;	
				implicitIndent = params.implicitIndent;		
				doTelescope = params.doTelescope;
				increment = 0;					
			}
			
			this.incrementNetBraces = function() { netBraces++; }			
			this.decrementNetBraces = function(){netBraces--;}	
			this.incrementBlockIndent = function(increment){blockIndent += increment;}
			this.pushNetBracesOntoSwitchStack = function(){switchStack.push(netBraces);}
			this.getBraceIndent = function(){return braceIndent;}
			this.getImplicitIndent = function(){return implicitIndent;}	
			this.getCaseIndent = function(){return caseIndent;}
			this.isAtSwitch = function(){return netBraces === switchStack[switchStack.length - 1];}
			this.telescope = function(value){doTelescope = value;} 
						
			this.baseIndent = function () 
			{
				const indent = []; var i = 0;	
				indent[i++] = CODE_NUMBER_SPACER;	// <<<<<<<<<<<<<<----------- don't always want this. 
				// Eg if enable code numbering = false.	Doesn't hurt anything.
				
				var nSpaces = bodyIndent + braceIndent*(netBraces) + numberOfImplicitIndents*implicitIndent +
					getNumberOfCaseIndents()*caseIndent;		
						
				indent[i++] = '<span jsSpaces"' + nSpaces + '">';	// Just to look at in view source.					
						
				for(let k = 0; k < nSpaces; k++) { indent[i++] = '&nbsp;'; }						
				indent[i++] = '</span>';						
				return indent.join('');			
			}
			
			this.calculateNumberOfImplicitIndents = function() // Very complicated since indentation logic is very complicated.
					                 // The test file TestIndentation.html must pass.
			{	
				if(lastCodeId === ',')
				{
					if( s[n] === '(' && delimStack.peekDelim() === '(' 
						|| 		delimStack.peekDelim() !== '{' &&  delimStack.peekDelim() !== '[' && !isStartDelim(s[n]))
					{
						numberOfImplicitIndents++;	
					}		
					else if(delimStack.peekDelim() === '{' )
					{
						numberOfImplicitIndents = 0;
					}												
				}
				else if(isBracket(s[n]) || lastCodeId === ';' || s[n] === ';'  || isBracket(lastCodeId))
				{								
					numberOfImplicitIndents = 0;												
				}		
				else if(lastCodeId === ':')
				{							
					delimStack.peekDelim() === "switch{"? numberOfImplicitIndents = 0: numberOfImplicitIndents++;							
				}							 
						
				else if(s[n] === '/' && (s[n+1] === '*' || s[n+1] === '/'))
				{	
					// Exit now for comments. Don't fall through.						
				}						
				else if( lastCodeId != '(' && lastCodeId != ')' || lastCodeId === ')' && s[n] != '{')
				{
					if(lastCodeId != undefined ) // Test to make sure first line is given no implicit indent.	
					{																
						numberOfImplicitIndents++;
					}
				}
					
				if(doTelescope === false && numberOfImplicitIndents > 1) {numberOfImplicitIndents = 1;} 
			}					
			
			this.getIndent = function() 
			{	 			
				this.calculateNumberOfImplicitIndents();
																				
				const numberOfCaseIndents = getNumberOfCaseIndents();				
				const numberBraceIndents = (s[n] === '}' || s[n] === ']')?netBraces-1:netBraces;	
							
				const nSpaces = bodyIndent + increment + blockIndent 
					+ numberOfCaseIndents*caseIndent + (numberOfImplicitIndents)*implicitIndent +  numberBraceIndents*braceIndent;
						
				const indent = []; var i = 0;		
										
				indent[i++] = '<span jsSpaces="' + nSpaces + '">';  // Just to look at in view source.					
				for(let k = 0; k < nSpaces; k++) { indent[i++] = '&nbsp;'; }						
				indent[i++] = '</span>';
				return indent.join('');		
			}						
						
		})(); // - End of indentationLogic
		//================================================================================================
		// End of Indentation logic
		//================================================================================================		
				
		// ________________________________ White Space Utility Functions ________________________________________________________ 
				
			function isJavaScriptCode()  
			{	
				// Includes 
				// (1) Regular JavaScript code.
				// (2) JavaScript comments.
				// 		(a) Asterick comments.
				//		(b) Double slash comments.
				// Nothing else.
			
				return n < end && s[n] !== '<' && s[n] !== '\\';  
			};
							
			function writeWhiteSpaces()  
			{
				// Count NWS the number of white spaces found for EOL comments to use
				// to position themselves with the same number of nbsp;'s.
			
				NWS = 0;
				for(NWS = 0; s[n] === '\x09' || s[n] === '\x20'; NWS++, n++);
				
				if(NWS > 0)
				{				
					JS[j++] = '\x20'; 
				}
			};

			function skipWhiteSpaces()
			{	
				while(s[n] === '\x20' || s[n] === '\x09')
				{
					n++;
				}
			};	
			
			/*
				How EOL comment code uses writeWhiteSpaces() to position EOL comments in a WYSIWYG manner.
			
				Example 1: 
					var x= 7;              // comment 
				
					when the first space after ';' is read, writeWhiteSpaces() is called. It
					records NWS = 14 as the number of white spaces up to '//'. Then EOL comment
					code knows to put in 14 hard white spaces &nbsp;   
					
				Example 2:
					&nbsp;                //comment
					
					skipWhiteSpaces() is called to read up to the &nbsp; Then &nbsp; is read/written.
					Then the first space afer &nbsp; is detected and writeWhiteSpaces() is called.
					The EOL comment knows how to space itself with hard	&nbsp;'s since the NWS
					number of white spaces between the &nbsp; and the comment is recorded for
					EOL comment code to use.			
			*/

						
			function writeHardWhiteSpaces()  
			{	
				// Used in ProcessBaseIndentations(), and EOL comments,
				// where spaces are converted to hard &nbsp; spaces.
			
				const ws = []; var w = 0;
						
				while(s[n] === '\x09' || s[n] === '\x20')
				{
					ws[w++] = '&nbsp;'; 
					n++;
				}		
				
				if(ws.length > 0)  
				{		
					JS[j++] = ws.join('');
				}						
			};
			
			function ignoreHTMLComments()
			{
				Assert(s[n] === '<' && s.matchAt(n+1, "!--"), 
						'Html comment expected in ignoreHTMLComments()');
			
				
				while(n < end && s[n] === '<' && s[n+1] === '!' && s[n+2] === '-' && s[n+3] === '-')
				{		
					while(n < end && !s.matchAt(n,"-->") )
					{
						n++;
					}
				
					n += 3;
					
					skipWhiteSpaces(); 					
				}
				
				Assert(n <= end, "HTML Comment Error: Unclosed HTML comment found.");
					
			};
			
			
			function isTagSingleton(str, m)
			{
				var matches =  str.matchAt(m+1,"br") || str.matchAt(m+1,"hr") || str.matchAt(m+1,"img") 
							 || str.matchAt(m+1,"col") || str.matchAt(m+1,"area") || str.matchAt(m+1,"base") 
							 ||	str.matchAt(m+1,"param") || str.matchAt(m+1,"embed") || str.matchAt(m+1,"input") 
							 ||	str.matchAt(m+1,"command") || str.matchAt(m+1,"track") || str.matchAt(m+1,"wbr");
				
				return matches;
			};

			
			function getTextDisplay(str, m) //Helper function for isBlock()       // WE CAN MAKE THIS MORE ROBUST
			{
				// Get the style display property of start tag.
			
			 	Assert(str[m] == '<', "getTextDisplay 1 " + str[m] + str[m+1] + str[m+2] + str[m+4] + str[m+5]);
			 	Assert(netTags == 0, "getTextDisplay 2");
			 	
			 	var d = "";
			 	var k = m;
			 	while(!str.matchAt(k, "display") && str[k] != '>' && k < end) { k++; }
			 	{
			 		if(str.matchAt(k,"display"))
			 		{
			 			k += 7;
			 			while(str[k] == '\x09' || str[k] == '\x20') {k++;} 
			 			Assert(str[k++] == ':', "HTML error in display");
			 			while(str[k] == '\x09' || str[k] == '\x20') {k++;}
			 			while((str[k] != '\x09') && (str[k] != '\x20') && (str[k] != ";") && (str[k] != "\"")) { d  += str[k++]; }
			 		}
			 	}	
			 	return d;		 				 	
			}

			function isBlock(str, m)  // WE CAN MAKE THIS MORE ROBUST
			{	
				Assert(str[m] == '<', "error in isBlock");	
																		
				switch(getTextDisplay(str, m))
				{
					case "block":
						return true;
						break;
					case "":
						const isTrue = isTagSingleton(str, m) || str.matchAt(m + 1, "header") || str.matchAt(m+1, "hr") 
							|| str.matchAt(m+1, "table") || str.matchAt(m+1,"p"); 
						return isTrue; 
						break;
					default:
						return false;
						break;						
				}							
			}


			// ________________________________ Tag Writing Utility Functions _____________________________________

			function getQuotation()
			{
				// Only for use in parsing a start tag. Inside a start tag escaped quotes
				// are illegal. Thus for example we can't have \". And don't need to
				// test for such. However, tag delimeters '<' and '>' are allowed.
			
				var delimiter = s[n];
				
				Assert(delimiter === '"' || delimiter === "'", "writeQuote() Error: Not a quote");
				
				var token = [s[n++]], t = 1; // Write starting quote "'" or '"'.
							
				while(n < end && s[n] !== delimiter)
				{				
					token[t++] = s[n++];
				}
				
				token[t++] = s[n++]; // Write ending quote "'" or '"'.			
				
				return token.join('');			
			};


			function writeStartTag()
			{					
				Assert(s[n] === '<', 'Start tag expected in writeStartTag()');								
				
				const token = []; var t = 0; 			
		
				while(n < end && s[n] !== '>')
				{
					// The only place tag delimeters can appear inside a start tag are in
					// quotations inside the start tag. Thus we write quotes in whole to 
					// handle tag delimiters inside start tags.
				
					if(s[n] === "'" || s[n] === '"')
					{
						token[t++] = getQuotation();
					}
					else
					{
						token[t++] = s[n++];
					}
				}
				
				Assert(s[n] == '>', 'Unclosed Tag found');
				token[t++] = s[n++];
				JS[j++] = token.join('');				
				
				Assert(n < end, 'Unclosed Tag found');
			};
	
		
			function writeEndTag()
			{				
				Assert(s.matchAt("</", 'End tag expected'));
											
						
				const token = []; var t = 0; 
				while( n < end && ((token[t++] = s[n++]) !== '>') );	
				JS[j++] = token.join('');	
				Assert(n < end, 'Unclosed Tag found');				
			};
			
			const Styles = 
			{	
				'≤':'op',	
				'≥':'op',			
				'&amp;':'op',
				'&amp;&amp;':'op',
				'&amp;=':'op',			
				'&lt;':'op',
				'&lt;=':'op',
				'&lt;&lt;':'op',
				'&lt;&lt;&lt;':'op',
				'&gt;':'op',
				'&gt;=':'op',
				'&gt;&gt;':'op',
				'&gt;&gt;&gt;':'op',
				'|':'op',			
				'||':'op',	
				'^':'op',	
				'^=':'op',	
				'~':'op',		
				'~~':'op',	
				'!':'op',
				'!=':'op',
				'!==':'op',	
				'+':'op',			
				'++':'op',			
				'+=':'op',			
				'-':'op',		
				'--':'op',		
				'-=':'op',		
				'*':'op',		
				'*=':'op',		
				'%':'op',
				'%=':'op',
				'=':'op',			
				'==':'op',			
				'===':'op',							
				'&':'op',	
				'?':'op',			 
				'/':'op',		
				'regexp':'regexp',
				'keyword':'keyword',				
				'int':'number',		
				'oct':'number',
				'hex':'number',
				'dec':'number',	
				'exp':'number',
				'"':'db-qt',		
				"'":'s-qt',					
				'"\\c':'db-qt-code',		
				'//':'eol-comment',		
				'/*':'block-comment',				
			};

			function writeToken(token, description)
			{	
				// Write the token to JS with colorization if indicated.
			
				if(description !== undefined)
				{
					Assert(Styles[description] !== undefined, 'writeToken(): Illegal description paramater = ' + description);			
					
					var styleWord = Styles[description];		
				}
				else 
				{				
					var styleWord = Styles[token]; // might be undefined
				}
				
				if(styleWord  && colorize)
				{
					if(styleWord === "block-comment")
					{
						JS[j++] = ["<span js='" + styleWord  +"'>", token , "</span>"].join('');
					}
					else
				
					JS[j++] = ["<span js='" + styleWord  +"'>", token , "</span>"].join('');						
				}
				else
				{
					JS[j++] = token;					
				}				
			};
			
			// _____________________________ Defragmenting Utility Function _________________________________________________
			
			const switchJS = (function() 
			{
				/* 	switchJS is used to prevent deframenting of logical sections, such as 
				 	writeTextSection(), ProcessBaseIndentationsOnly, writing single quoted, 
				 	double quoted, and double quoted code sections. This isn't totally 
				 	necessary, but it is somewhat useful.
			
				 	Stacks, indexed on variable x, are used to handle separate calls to switchJS.StartSection() and 
				 	switchJS.writeSection() from nested functions. For example double quoted code sections and nested 
				 	comments inside double quoted code sections will each call switchJS.clear() and switchJS.restore(); 
				
				
				 	Do we reall need a stack to handle multiple calls to switchJS?  
				 	Yes Indeed! See ProcessBaseIndentaitonsOnly.
				*/
			
				const JS_New = [];
				const save_j = [];
				const save_JS = [];
				let x = 0;
			
				return Object.create(null,
				{
					startSection:
					{
						value:function()
						{
							JS_New[x] = [];
							save_j[x] = j;
							save_JS[x] = JS;
							JS = JS_New[x];
							j = 0;
							x++;
						}
					},
					
					writeSection:
					{
						value:function(description)
						{
							// Write section and restore JS.			
							x--;
							//if(x > 0){alert("Multiple SwitchJS on assembly stack.");}
							const section = JS.join('');						
							JS = save_JS[x];				
							j = save_j[x];									
							writeToken(section, description);
							
						}
					}
				});		
			})(); // -- switchCS
			
			// ______________________________ Major Write Utility Functions not Defragmented ________________________________
			var netTags = 0;
			
			function writeTextSection() 
			{	
				// Writes a text section <p>......</p>, <header>......</header>        |
				// <table>...</table>, <ol>...</ol>, <ul>...</ul>, etc                  
				//
				// Don't Fracture tags. For example if <p> is writtent to JS at index j then
				// <p> its end tag and all contents between are written to JS at index j.
				//
				// Singleton tags:   
				// 		<br> <hr> <img> <col> <area> <base> <param> <embed> <input> <source> <command>. <command> is depricated.
				// 		<link> <meta>(not coded since occur only in header)				
					
				Assert(s[n] == '<', "writeTextSection error");		
				
				// start a section so we don't frament the text section
				switchJS.startSection();								
								
				while(n < end)
				{				
					if(s[n] === '<')
					{						 	
					 	if(s[n+1] === '!') {
					 		ignoreHTMLComments();
					 	}			 	
					 	else if(s[n+1] === '/') {			 		
					 		writeEndTag();			 	
					 		netTags--;				 		
					 	}
					 	else {	
					 		var singleton = isTagSingleton(s,n);							
					 		writeStartTag();
					 		if(!singleton) netTags++;					 	
						}
							
						if(netTags === 0) {	
							break;
						}										 		 		
					}
					else {			
						JS[j++] = s[n++];					
					}
				}				
				
				switchJS.writeSection();											
			};
			
			function ProcessBaseIndentationsOnly(startDelim, endDelim) 
			{				
				// Copies input string between two delimiters inclusive, possibly
				// over multiple lines, while appending base indentations.				   
				//	(1) "...",                                         
				//	(2) '...'                                          
				//	(3) /*...* /                                        
				
				// start a section so we don't fragment the quotation or comment.
				switchJS.startSection();
				const indent = indentationLogic.baseIndent();
																
				JS[j++] = startDelim;				
				n += startDelim.length; 
				
				var doContinue = true; 		
						
				while (n < end && doContinue) // Loop writes the contents
				{	
					// doContinue needed because use of the 'break' keyword inside an 
					// inner switch refers to breaking on the switch, not the loop.
				
					switch(s[n])
					{					
						case '<':							
							writeTextSection();
							break;		
						case '\n': 
							JS[j++] = s[n++];		// Write end of line for view source.
							skipWhiteSpaces();  	// Get to the text which is left aligned.																				
							JS[j++] = '<br>'; 		// Write line break.											
							JS[j++] = indent;		// Write indentation.							
													
							if(!s.matchAt(n, endDelim))	
							{
								// Left align the separate lines.							
								switch(startDelim)
								{
									case '/*':
										JS[j++] = '&nbsp;&nbsp;&nbsp;';  // One for '/', one for '*', and one for '\x20' = ' '.
										break;
									case '"':
									case "'":
										JS[j++] = '&nbsp;';  // One for starting quote.
										break;	
								}														
							}
							
							break;	
						case endDelim[0]:
							// You can have a conditinal break on a switch, so you either break or 
							// follow through depending. We do this.
												
							if(s.matchAt(n, endDelim))
							{														
								// Write end delimiter and exit loop.							
									
									doContinue = false;
									if(startDelim =='"' || startDelim == "'")
									{
										// count number of preceding back slashes.										
										var x = n;
										var count = 0;
										while(x >=1 && s[--x] == "\\")count++;
										doContinue = count % 2 == 1; // continue if quote is escaped.										 
									}									
									
									JS[j++]  = endDelim;
									n += endDelim.length;											
									break; // break the case not the loop								  
							}	
							else
							{
								// Fall through to next case if not at end delimeter.
							}
						default:
							if(s[n] === '\x09' || s[n] === '\x20')
							{								
								writeHardWhiteSpaces();								
							}
							else
							{
								JS[j++] = s[n++];						
							}
							break;						
					}
				}			
				
				switchJS.writeSection(startDelim);	// startDelim makes sure correct colorization is used.
			};	// Process base indentations only function
			
		// ________________________________________ End of Utility Functions ____________________________________________________ 
		// ______________________________________________________________________________________________________________________
		
					  
		const codeNumberLogic = new (function()
		{
			var codeNumber = 0;  // Code number to display.							
			var codeNumberIndex = undefined;
			var lastLineHasCode = false;
			var numbersOn = true;
			var enableCodeNumbering = true;				
			
			this.initialize = function(_enableCodeNumbering)
			{
				enableCodeNumbering = _enableCodeNumbering;
				codeNumber = 0;		
				var lastLineHasCode = false;
				codeNumberIndex = undefined;		
				numbersOn = true;
			}
			
			this.setLastLineHasCode = function()
			{
				lastLineHasCode = true;
			}
			
			this.getLastLineHasCode = function()
			{
				return lastLineHasCode;
			}
						
			this.writeCodeNumber = function()
			{
				// writeCodeNumber Backfills the code number on the previous code line,
				// because only now do we know whether the previous code line has
				// JavaScript code. 
			
				if(lastLineHasCode && codeNumberIndex !== undefined)
				{
					JS[codeNumberIndex]	= "<span class='lineNumber'>" 
							+ (++codeNumber < 10?'0'+codeNumber:codeNumber) +  "</span>";	
				}						
				lastLineHasCode = false;
			}
			
			this.writeCodeNumbersAndIndentations = function()
			{											
				this.writeCodeNumber();												
						
				const isComment = s[n] === '/' && (s[n+1] === '/');			// || s[n+1] === '*'	
				var value = '';
				codeNumberIndex = undefined;
						
				if(enableCodeNumbering)   
				{
					if(numbersOn && !isComment)
					{									
						value = CODE_NUMBER_SPACER; // Space filler and temporary substitute for code number if found.
						codeNumberIndex = j; // The index at which to place a code number if code is found.								
					}
					else
					{
						value = CODE_NUMBER_SPACER; // Space filler.
					}
				}						
						
				JS[j++] = '\n' + value; 						
				JS[j++] = indentationLogic.getIndent();																	
			}
			
			this.processNumberDirectives  = function()
			{
				Assert(s[n] === '\\' && s[n+1] === 'n', "Illegal call to codeNumberLogic.processNumberDirectives()");
						
				if(s.matchAt(n+2, 'umbersOn'))
				{
					numbersOn = true;							
					n += 10;	
				}
				else if(s.matchAt(n+2, 'umbersOff'))
				{
					numbersOn = false;
					n += 11;					
				}	
				else if(s.matchAt(n+2, 'umbersRestart'))
				{
					n += 15;														
					numbersOn = true;
					this.writeCodeNumber(); // backfill last code number now so we can restart.
					codeNumber = 0;
				}
				else
				{
					Assert(false, "HTML Error: codeNumberLogic() found illegal line directive.");
				}	
						
				skipWhiteSpaces();
				Assert(s[n] == '\n', "HTML Error: End of line expected in codeNumberLogic()");
			}
		})(); // End of codeNumberLogic		
	})(); // -- PROCESS_CODE_BOX_ENCLOSURE
	

	//====================================================================================================================================
	
	
	function FittedElement (element, parentWidth, shieldWidth, max)
	{	
		const fitted = Object.create(null,
		{
			toggle:
			{
				value:function()
				{
					if(max)
					{
						element.style.width = parentWidth + "px";
						element.style.marginLeft = '0px';						
						max = false;
					}
					else
					{
						element.style.width = parentWidth - shieldWidth + "px";
						element.style.marginLeft = shieldWidth + "px";	
						max = true;
					}
				}
			}
		});
		
		fitted.toggle();
		return fitted;
	};
	
	function SliderElement(element, unslidLeft, shieldWidth)
	{
		var isSlid = false;
		const slider = Object.create(null,
		{
			toggle:
			{
				value:function()
				{
					if(isSlid)
					{
						element.style.left = unslidLeft  + "px";		
						isSlid = false;				
					}
					else
					{
						element.style.left = (unslidLeft - shieldWidth) + "px";
						isSlid = true;
					}
				}
			}
		});

		return slider;
	};
		

	function getNumberShield(element) 
	{
		var parent = element.parentNode;
		
		if(parent.getAttribute("js") === "block-comment") {parent = parent.parentNode;}
		
		var shields = parent.getElementsByClassName('numberShield');
		
		switch(shields.length)
		{
			case 1:
				var shield = shields[0];
				
				if(shield.parentNode === parent)
				{
					// shield is a sibling of element.
					return shield;
				}
				break;
			case 0:
				break;
			default:
				alert('Error: Multiple number shields in same parent');		
		}	
	};
	
	function BatchShow(show)
	{
		var args = arguments;
	
		this.toggle = function()
		{
			if(show)
			{				
				for(let k = 1, length = args.length; k < length; k++)
				{
					var array = args[k];					
					
					for(let j = 0, l = array.length; j < l; j++)
					{
						array[j].style.display = '';
					}
				}
				
				show = false;
			} 
			else
			{
				for(let k = 1, length = args.length; k < length; k++)
				{
					var array = args[k];
					
					for(let j = 0, l = array.length; j < l; j++)
					{
						array[j].style.display = 'none';
					}
				}
				
				show = true;
			}
		}
		
		this.toggle();
	};
	
				
	function initializeCodeBoxParameters(codeBox, globalParams)
	{
		// Copy globalParams to params so one code box doesn't change parameters for another codeBox.
			var params = Object.create(null); // No inheritance baggage.
						
			for(let k = 0, gKeys = Object.keys(globalParams), length = gKeys.length; k < length; k++) 
			{				
				params[gKeys[k]] = globalParams[gKeys[k]];
			}
							
			// Override global parameters with codeBox specific parameters.
				// If given attribute not specified then it evaluates to null and the variables 
				// below evaluate to NaN which is equivalent to false.
			const bodyIndent = parseFloat(codeBox.getAttribute('data-bodyIndent'));
			const braceIndent = parseFloat(codeBox.getAttribute('data-braceIndent'));
			const caseIndent = parseFloat(codeBox.getAttribute('data-caseIndent'));
			const implicitIndent = parseFloat(codeBox.getAttribute('data-implicitIndent'));
			const doTelescope = codeBox.getAttribute('data-doTelescope');
			
			if(bodyIndent){params.bodyIndent = bodyIndent;}			
			if(braceIndent){params.braceIndent = parseFloat(braceIndent);}				
			if(caseIndent){params.caseIndent= parseFloat(caseIndent);}				
			if(implicitIndent){params.implicitIndent= parseFloat(implicitIndent);}
			if(doTelescope){params.doTelescope = (doTelescope === "true"?true:false);}
		
		return params;		
	};	
	
			
	function applyJSHTMLCodeBox(codeBox, globalParams)  
	{	
		const enableCodeNumbering = codeBox.getAttribute('data-codeNumbers') === 'true';
		const params = initializeCodeBoxParameters(codeBox, globalParams);	
		codeBox.innerHTML = FormatJavaScript(codeBox.innerHTML, params, enableCodeNumbering);			
								
		const lineNumbers = codeBox.getElementsByClassName('lineNumber');
		const numberShields = codeBox.getElementsByClassName('numberShield');	
		
		function initializeFitters()
		{
			var fitted = [], f = 0;
		
			forEach(codeBox.getElementsByClassName('fitted'), function(element) 
			{					
				var numberShield = getNumberShield(element);
				
				if(numberShield)
				{
					fitted[f++] = FittedElement(element, 
						parseFloat(window.getComputedStyle(element.parentNode,null).width),
						parseFloat(window.getComputedStyle(numberShield,null).width), false );
				}
			});
			
			return fitted;
		}
		
		function initializeNumberShields()
		{
			for(let k = 0, length = numberShields.length; k < length; k++)
			{
				// Parents of number shields must be relatively displayed
				// since the number shield is to be absolutely positioned
				// with respect to its parent.
				
				numberShields[k].parentNode.style.position = 'relative';
			}
		}
		
		function initializeSliders()
		{
			var sliderSelector = "p, ol, ul, blockquote, dl, .slider";
			var sliderArray = codeBox.querySelectorAll(sliderSelector);
			var sliders = [], sl = 0;
					
			forEach(sliderArray, function(slider, index, name)
			{
				if(window.getComputedStyle(slider, null).position == "static")
				{
					slider.style.position = "relative";
					// OK position of sliders must be relative or its computed left is NaN.
				}
											
				var numberShield = getNumberShield(slider);
						
				try
				{
					sliders[sl++] = SliderElement(slider, 
							parseFloat(window.getComputedStyle(slider, null).left),
							parseFloat(window.getComputedStyle(numberShield,null).width));
				}
				catch(e)
				{
					//alert(e.message);	
					//alert(slider.parentNode.outerHTML);				
				}
			});
					
			return sliders;			
		}
		
		function initializeDoubleClick(fitted, batchShow, sliders)
		{
			codeBox.ondblclick = function()
			{
				for(let k = 0; k < fitted.length; k++)
				{
					fitted[k].toggle();
				}
				
				for(let k = 0; k < sliders.length; k++)
				{
					sliders[k].toggle();
				}
				
				batchShow.toggle();
			}	
		}
		
		function hideLineNumbers()
		{
			for(let k = 0, length = lineNumbers.length; k < length; k++)
			{			
				lineNumbers[k].style.display = 'none';
			}
		}
		
		function removeNumberShields()
		{
			for(let k = 0, length = numberShields.length; k < length; k++) 
			{				
				numberShields[0].parentNode.removeChild(numberShields[0]); 		
			}
		}	
	
		if(enableCodeNumbering)  
		{		
			initializeNumberShields();		
			const fitted = initializeFitters();						
			const batchShow = new BatchShow(true, numberShields, lineNumbers);				
			const sliders = initializeSliders();			
			initializeDoubleClick(fitted, batchShow, sliders);			
		}
		else
		{		
			hideLineNumbers();
			removeNumberShields();			
		}		
	};
		
	function initializeGlobalParmeters(globalParams)
	{		
		if(!globalParams)
 		{ 			 		
 			globalParams = 
 			{ 				
 				bodyIndent:DEFAULT_BODY_INDENT,
 				braceIndent:DEFAULT_BRACE_INDENT, 
 				implicitIndent:DEFAULT_IMPLICIT_INDENT,
 				caseIndent:DEFAULT_CASE_INDENT, 
 				doTelescope:DO_TELESCOPE_IMPLICIT_INDENT
 			};    			
 		}
 		else
 		{ 			 
 			globalParams.bodyIndent = globalParams.bodyIndent || DEFAULT_BODY_INDENT; 
 			globalParams.braceIndent = globalParams.braceIndent || DEFAULT_BRACE_INDENT; 
 			globalParams.caseIndent = globalParams.caseIndent || DEFAULT_CASE_INDENT;
 			globalParams.implicitIndent = globalParams.implicitIndent || DEFAULT_CASE_INDENT; 	
 			if(!globalParams.hasOwnProperty("doTelescope")) {globalParams.doTelescope = DO_TELESCOPE_IMPLICIT_INDENT;}		
 		}
 		
 		return globalParams;
	};	
	
	applyJSHTML = function(globalParams)
 	{ 		
 		globalParams = initializeGlobalParmeters(globalParams);
 		
 		try
		{				
			forEach(document.getElementsByClassName('codeBox'), function(codeBox)
			{		
				applyJSHTMLCodeBox(codeBox, globalParams); 			
			});			
		}
		catch(error)
		{
			alert('error: ' + error.message + '\nline: ' + error.lineNumber + '\nfile: ' + error.fineName + "\nstack: " + error.stack); 				
		}		
 	}	

 	//====================================================================================================================================
})();	// -- ENCLOSURE_FOR_JSHTML

	
	
	

