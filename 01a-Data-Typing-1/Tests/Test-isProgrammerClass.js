

function foo(){}
function bar(){}
function foobar(){}

foobar.prototype = Object.create(foo.prototype, {

	constructor:
	{
		value:foobar
	}
});

console.log(isProgrammerDefinedClassInstance(new foo()));
console.log(!isProgrammerDefinedClassInstance(Object.create(new foo())));

console.log(isProgrammerDefinedClassInstance(new foobar()));
console.log(!isProgrammerDefinedClassInstance(Object.create(new foobar())));

console.log(!isProgrammerDefinedClassInstance(foobar.prototype));

console.log(isProgrammerDefinedClassInstance(Object.create(foobar.prototype)));

console.log(!isProgrammerDefinedClassInstance(new Boolean(true)));

console.log(!isProgrammerDefinedClassInstance(window));

console.log(!isProgrammerDefinedClassInstance(Object.prototyp));