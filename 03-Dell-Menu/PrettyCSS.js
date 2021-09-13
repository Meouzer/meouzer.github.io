		
		function prettyCSS(innerCSS)
		{
			var s = innerCSS;
			var R = [], r = 0, end = s.length;
			var i = 0;
			
			const spanRed = "<span style=\"color:red;\">";
			const spanBlue = "<span style=\"color:blue;\">";
			const spanGreen = "<span style=\"color:green;\">";
			const spanMaroon = "<span style=\"color:maroon;\">";
			const spanEnd = "</span>";
		
		
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
							R[r++] = "<br>"
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
			};
					
			while(i < end)
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
			return R.join('');			 
		}
		