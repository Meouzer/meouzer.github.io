	var tree = 
	{
		a:{
			b:{e:{},f:{}},
			c:{g:{}, h:{}, i:{}},
			d:{j:{}, k:{}}
		}
	};		
		
	function aPreorderTransversal(tree)
	{
		var stack = [];
		stack.push({node:tree, ownName:"tree", childKeys:Object.getOwnPropertyNames(tree), index:0});
		
		function path()
		{
			var p = "";
			for(let i = 0; i < stack.length; i++)
			{
				p += stack[i].ownName + ".";
			}
			
			return p;
		}
		
		while(stack.length > 0)
		{
			var T = stack[stack.length - 1];             // top of stack
			var node = T.node;                           // node at top of stack 
			var childKeys = T.childKeys;                 // its child keys to acess children
			
			if(T.index < childKeys.length ) 	
			{				
				// process child of node at current index here	
			
				console.log(childKeys[T.index]);                 // alert key of child  
				var child = node[childKeys[T.index]];  		     // child of node
					
				// push child node onto the stack
				stack.push({node:child, ownName:childKeys[T.index],
					childKeys:Object.getOwnPropertyNames(child), index:0});
						
				T.index++;	// process next child of node	
			}
			else
			{					
				stack.pop();
			}
		}
	}

	aPreorderTransversal(tree);
		
		// The nodes are alerted in preorder a, b, e, f, c, g, h, d, i, j, k.
