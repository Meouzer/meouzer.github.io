    	    	
		function CheaterStack()
		{
			var wm = new WeakMap();			
			var l = 0;
			
			this.push = function(x)
			{
				this[l++] = x;
				wm.set(x.source, x.target);				
			} 
			this.pop = function()
			{
				var x = this[--l];
				//wm.delete(x.source);
				return x;
			}
			
			this.peek = function()
			{
				return this[l - 1];
			}
			
			this.inSource = function(value)
			{
				return wm.has(value);
			}
			
			this.getTarget = function(source)
			{
				return wm.get(source);
			}			
			
			Object.defineProperty(this, 'length',
			{
				get:function(){return l;}
			});
		}
		       		
		function deepCopyLiteralOriginal(source)
		{
			var stack = new CheaterStack();			
			var target = {}; 						
			stack.push({source:source, target:target,  keys:Object.getOwnPropertyNames(source), index:0});						
					
			while(stack.length > 0)
			{						
				var T = stack.peek();
											
				if(T.index < T.keys.length ) //process next key of source at current index
				{		
					var key = T.keys[T.index]; //key at current index
					var source = T.source[key];	
					
					if(!stack.inSource(source))
					{
						if(isPrimitive(source))
						{
							T.target[key] = source;	
						}
						else
						{
							T.target[key] = {}; 												
							stack.push({source:source, target:T.target[key] , 
								keys:Object.getOwnPropertyNames(source), index:0});
						}
					}
					else
					{							
						T.target[key] = stack.getTarget(T.source[key]); // add circular reference to deep copy.
					}											
					
					T.index++;				
				}
				else 
				{
					stack.pop();																				
				}
			}		
						
			return target;	
		}	
			
		
		function isPrimitive(x)
	    {
	        return (x == null || typeof(x) != 'object') && typeof(x) != 'function';
	    }

		
		
		function shallowCopyLiteral(source)
		{
			if(isPrimitive(source)) return source;
			const target = {};
			
			for(const p of Object.getOwnPropertyNames(source))
			{
				target[p] = source[p];
			}
			
			return target;			
		}
		
		
		function deepCopyLiteral(source)
		{			
			const target = shallowCopyLiteral(source);
			const stack = [target];		
			const wm = new WeakMap();	
			wm.set(source, target)
			
			while(stack.length > 0)
			{
				const top = stack.pop();
				
				for(const p of Object.getOwnPropertyNames(top))
				{
					if(wm.has(top[p])) 
					{ 						
						top[p] = wm.get(top[p]); 
					}
					else if(isObject(top[p]))
					{
						const source = top[p];
						top[p] = shallowCopyLiteral(source);
						wm.set(source, top[p]);
						stack.push(top[p]);						
					}
				}	
			}
			
			return target;
		}
						
		function deepCopyLiteral3(source)
		{
			if(isPrimitive(source)) return source;
			const target = {}
			const wm = new WeakMap([[source, target]]);	
			const stack = [{source:source, target:target}];
						
			while(stack.length > 0)
			{
				const top = stack.pop();
				let source = top.source;
				let target = top.target;
								
				for(const p of Object.getOwnPropertyNames(source))
				{
					if(wm.has(source[p])) 
					{ 
						target[p] = wm.get(source[p]); 
					}
					else if(isPrimitive(source[p]))
					{
						target[p] = source[p];
					}
					else
					{
						target[p] = {}		
						wm.set(source[p], target[p]);								
						if(isObject(source[p])) { stack.push({source:source[p], target:target[p]}); } 
					}
				}				
			}
			
			return target;
		}
		
		

		
		

		
		
		
		
		
		
		
		
		
		
		
		
		

