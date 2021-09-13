
	function Test1()
	{
		const e = new Error(7, "hello");
		
		const e2 = valueCopy(e);
		
		console.log("Test1 passed: " + (stringify(e) == stringify(e2)));
		
		//console.log(stringify(e));
		//console.log(stringify(e2));
		
	}
	
	
	
	Test1();

	function Test2()
	{
		const e = new Error("bad number", "hello");
		const e2 = valueCopy(e);		
		console.log("Test2 passed: " + (stringify(e) == stringify(e2)));
	}
	
	Test2();
	
	
	function Test3()
	{
		const e = new Error("hello");
		const e2 = valueCopy(e);		
		console.log("Test3 passed: " + (stringify(e) == stringify(e2)));
	}
	
	Test3();

	function Test4()
	{
		const e = new Error("message", "file.js", 7);
		const e2 = valueCopy(e);
		
		console.log("Test4 passed: " + (stringify(e) == stringify(e2)));
	}

	Test4();
	
	