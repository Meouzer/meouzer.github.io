© 2019 Meouzer Consortium
		var DO_ASSERT = true;	
	
		if(DO_ASSERT)
		{				
			var Assert = function(b, message) { 
				if(!b) { alert(message); }
			}
		}		
		else { var Assert = function(){}; }	

		function prettyHTML(html)
		{				
			s = html; // s is some inner or outer html
			var R = [], r = 0, end = s.length;
			var i = 0;
		
			const spanRed = "<span style=\"color:red;\">";
			const spanBlue = "<span style=\"color:blue;\">";
			const spanGreen = "<span style=\"color:green;\">";
			const spanMaroon = "<span style=\"color:maroon;\">";
			const spanEnd = "</span>";
			
			function isWhiteSpace()
			{
				return s[i] == ' ' || s[i] == '\t' || s[i] == '\n'; 
			}	
			
			function processWhiteSpaces() 
			{
					
				if(s[i] == ' ' || s[i] == '\t' || s[i] =='\n')
				{			
					var doContinue = true;
					while(doContinue && i < end )
					{
						switch(s[i])
						{
							case ' ':
								R[r++] = "&nbsp;";
								i++;											
								break;
							case '\t':
								R[r++] = "&nbsp;&nbsp;&nbsp;&nbsp;";
								i++;
								break;
							case '\n':
								R[r++] = "<br>";
								i++;
								break;
							default:							
								doContinue = false;	
								break;		
						}
					}									
				}							
			}			

			const endTag = Object.create(null,
			{
				process:
				{
					value:function()
					{
						Assert(s[i] == '<' && s[i+1] == '/', "endTag.process(1) error");
						R[r++] = spanBlue;
						R[r++] = "&lt;/"; 
						i +=2;
						R[r++] = spanEnd;
						R[r++] = spanMaroon;
						while(!isWhiteSpace() && s[i] != '>')
						{							
							R[r++] = s[i++];
						}
						R[r++] = spanEnd;
						processWhiteSpaces();						
						Assert(s[i] == '>', "endTag.process(2) error");
						R[r++] = spanBlue;
						R[r++] = "&gt;"; 
						i++;
						R[r++] = spanEnd;												
					}
				}
			});	
			// startTag=====================================================================	
			// startTag=====================================================================	
			// startTag===================================================================== 
				
			const startTag = (function()
			{			
				function processQuote()
				{
					Assert(s[i] == '"', "processQuote(1) error");
					R[r++] = spanBlue;
					R[r++] = '"';
					i++;						
					while(s[i] != '"')
					{
						if(s[i] == '\n')
						{
							R[r++] = "<br>";
							i++;
						}
						else
						{
							R[r++] = s[i++];
						}
					}
					R[r++] = '"';
					i++;
					R[r++] = spanEnd;	
					processWhiteSpaces();					
				}
						
				function processTagName()// process opening <, tag name, and white spaces after.
				{						
					Assert(s[i] == '<', "processTagName(1) error");	
					R[r++] = spanBlue;											
					R[r++] = "&lt;"; 
					R[r++] = spanEnd;
					i++;				
					R[r++] = spanMaroon;						
					// write tag name							
					while(!isWhiteSpace() && s[i] != '>' && i < end)
					{
						R[r++] = s[i++];
					}								
					R[r++] = spanEnd;						
					processWhiteSpaces();						
				}
						
				function processAttribute()// process attribute and subsequent '='
				{				
					if(s[i] == '>'){return null;}
					Assert(!isWhiteSpace(), "processAttribute(1) error");					
					var Attribute = [], a = 0;						
															
					while(!isWhiteSpace() && s[i] != '=' &&  i < end)
					{
						Attribute[a++] = s[i++];
					}												
					var attribute = Attribute.join('');	
					if(attribute != "data-break")
					{
						R[r++] = spanRed;						
						R[r++] = attribute;									
						R[r++] = spanEnd;							
						processWhiteSpaces();																
						Assert(s[i] == '=', "processAttribute(2) error");						
						R[r++] = spanBlue;
						R[r++] = s[i++];
						R[r++] = spanEnd;
						processWhiteSpaces(); 
						return attribute;	
					}	
					else
					{
						return "data-break";						
					}				
				}
				function processStyle() 
				{	
					Assert(s[i] == '"', "processStyle: '\"' expected");
			
					R[r++] = s[i++];
					var saver = r;
					R[r++] = spanRed;
					var  hasContent = false;			
					var flipRed = true;		
					var flipBlue = false;				
							
					while(s[i] != '"' && i <end)
					{
						switch(s[i])
						{						
							case ' ':
								R[r++] = "&nbsp;"
								i++;											
								break;
							case '\t':
								R[r++] = "&nbsp;&nbsp;&nbsp;&nbsp;"
								i++;
								break;
							case '\n':
								R[r++] = "<br>"
								i++;
								break;						
							case ':':
								hasContent = true;
								flipRed = !flipRed;	
								R[r++] = spanEnd;  // end spanRed
								R[r++] = s[i++];
								flipBlue = !flipBlue 							
								R[r++] = spanBlue;
								break;	
							case ';':
								flipBlue = !flipBlue
								R[r++] = spanEnd; // end spanBlue
								R[r++] = s[i++];	
								if(s[i] != '}') 
								{
									flipRed = !flipRed;
									saver = r;
									R[r++] = spanRed;  // oops
								}
								break;
							default:
								R[r++] = s[i++];
								break;	
						}
					} 	
					if(flipBlue) {R[r++] = spanEnd;}
					R[r++] = s[i++];	
					if(flipRed){R[saver] = '';}							
					processWhiteSpaces();					
				}
					
				const startTag = Object.create(null,
				{
					process:
					{
						value:function()
						{
	
							Assert(s[i] == '<' && s[i+1] != '/', "startTag(1) error");					
							processTagName();
																		
							while(s[i] != '>')
							{
								var attribute = processAttribute();
								if(attribute == "style")
								{
									processStyle();
								}		
								else if(attribute == "data-break")
								{
									processWhiteSpaces();
									Assert(s[i] == '=', "startTag.process: '=' expected");
									i++;
									processWhiteSpaces();
									Assert(s[i] == '"', "startTag.process: quote expected");
									i++;
									while(s[i] != '"')
									{
										if(s[i] == 'n') {R[r++] = "<br>"; }
										if(s[i] == 't') {R[r++] = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"; }
										i++;
									}
									i++;									
									processWhiteSpaces();
								}						
								else
								{								
									processQuote();
								}
																							
							}
							R[r++] = spanBlue;
							R[r++] = "&gt;";
							R[r++] = spanEnd;
							i++;						
						}					
					},	
					
					processStyle:
					{
						value:function processStyle() 
						{	
							Assert(s[i] == '"', "processStyle: '\"' expected");
			
							R[r++] = s[i++];
							var saver = r;
							R[r++] = spanRed;
							var  hasContent = false;			
							var flipRed = true;						
							
							while(s[i] != '"' && i <end)
							{
								switch(s[i])
								{						
									case ' ':
										R[r++] = "&nbsp;"
										i++;											
										break;
									case '\t':
										R[r++] = "&nbsp;&nbsp;&nbsp;&nbsp;"
										i++;
										break;
									case '\n':
										R[r++] = "<br>"
										i++;
										break;						
									case ':':
										hasContent = true;
										flipRed = !flipRed;	
										R[r++] = spanEnd;  // end spanRed
										R[r++] = s[i++];							
										R[r++] = spanBlue;
										break;	
									case ';':
										R[r++] = spanEnd; // end spanBlue
										R[r++] = s[i++];	
										if(s[i] != '}') 
										{
											flipRed = !flipRed;
											saver = r;
											R[r++] = spanRed;  // oops
										}
										break;
									default:
										R[r++] = s[i++];
										break;	
								}
							} 	
							R[r++] = s[i++];	
							if(flipRed){R[saver] = '';}							
							processWhiteSpaces();					
						}
					},				
				});
				
				return startTag;
			})();	
			
			// end startTag=====================================================================	
			// end startTag=====================================================================	
			// end startTag=====================================================================	
			
			// style ==================================================================================================================
			// style =================================================================================================================
			// style =================================================================================================================
			const style = (function()
			{
				function processSelector()
				{
					R[r++] = spanMaroon;
				
					while(s[i] != '{' && i < end)
					{
						switch(s[i])
						{
							case ' ':
								R[r++] = "&nbsp;"
								i++;											
								break;
							case '\t':
								R[r++] = "&nbsp;&nbsp;&nbsp;&nbsp;"
								i++;
								break;
							case '\n':
								R[r++] = "<br>";
								i++;
								break;
							default:
								R[r++] = s[i++];	
								break;		
						}	
					}
					
					R[r++] = spanEnd;
				}
		
				function processComments()
				{	
					R[r++] = spanGreen;
					while( !(s[i] == '*' && s[i+1] == '/') && i < end)
					{		
						switch(s[i])
						{
							case ' ':
								R[r++] = "&nbsp;"
								i++;											
								break;
							case '\t':
								R[r++] = "&nbsp;&nbsp;&nbsp;&nbsp;"
								i++;
								break;
							case '\n':
								R[r++] = "<br>"
								i++;
								break;
							default:
								R[r++] = s[i++];	
								break;		
						}			
						
					}
					R[r++] = s[i++];
					R[r++] = s[i++];
					R[r++] = spanEnd;
				}
					
				function processBraces() // s[i] = '{'
				{	
					R[r++] = s[i++];
					var saver = r;
					R[r++] = spanRed;
					var  hasContent = false;
					var flipRed = true;
					
					while(s[i] != '}' && i <end)
					{
						switch(s[i])
						{						
							case ' ':
								R[r++] = "&nbsp;"
								i++;											
								break;
							case '\t':
								R[r++] = "&nbsp;&nbsp;&nbsp;&nbsp;"
								i++;
								break;
							case '\n':
								R[r++] = "<br>"
								i++;
								break;						
							case ':':
								hasContent = true;
								flipRed = !flipRed;	
								R[r++] = spanEnd;
								R[r++] = s[i++];							
								R[r++] = spanBlue;
								break;	
							case ';':
								R[r++] = spanEnd;
								R[r++] = s[i++];	
								if(s[i] != '}') 
								{
									flipRed = !flipRed;
									saver = r;
									R[r++] = spanRed; // oops
								}
								break;
							default:
								R[r++] = s[i++];
								break;	
						}
					} 	
					R[r++] = s[i++]; // write end brace '}'			
					if(!hasContent){R[saver] = '';}
				}
				
				const style = Object.create(null,
				{
					process:
					{
						value:function()
						{
							startTag.process();
							while(!(s[i] == '<' && s[i+1] == '/' &&   s[i+2] == 's' && s[i+3] == 't' && s[i+4] == 'y' 
								&& s[i+5] == 'l' && s[i+6] == 'e') && i < end)
							{
								switch(s[i])
								{
									case ' ':
										R[r++] = "&nbsp;"
										i++;											
										break;
									case '\t':
										R[r++] = "&nbsp;&nbsp;&nbsp;&nbsp;"
										i++;
										break;
									case '\n':
										R[r++] = "<br>";
										i++;
										break;
									case '{':	
										processBraces();		
										break;	
									case '/':
										processComments();
										break;							
									default:						
										processSelector();										
										break;									
								}
							}	
											
							endTag.process();
						}
					}
				});	
				
				return style;			
			})();	
			// end style ==================================================================================================================
			// end style ==================================================================================================================
			// end style ==================================================================================================================

						
			while(i < end)
			{
				switch(s[i])
				{
					case '&':
						R[r++] = spanRed;						
						R[r++] = "&amp;";
						i++;
						while(s[i] != ';' && i < end)
						{
							R[r++] = s[i++];
						}
						R[r++] = s[i++];						
						R[r++] = spanEnd;
						break;
					case ' ':
						R[r++] = "&nbsp;";
						i++;	
						break;
					case '\t':
						R[r++] = "&nbsp;&nbsp;&nbsp;&nbsp;";
						i++;
						break;
					case '\n':
						R[r++] = "<br>";
						i++;
						break;
					case '<':
						if(s[i+1] == 's' && s[i+2] == 't' && s[i+3] == 'y' && s[i+4] == 'l' && s[i+5] == 'e')
						{																			
							style.process();
						}	
						else if(s[i+1] == '/')
						{
							endTag.process();
						}
						else
						{
							startTag.process();
						}
						break;
					default:
						R[r++] = s[i++];
						break;				
				}	
			}
			
			return R.join('');
		} // end of processHTML;
