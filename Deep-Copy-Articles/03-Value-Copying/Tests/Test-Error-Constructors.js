

function TestErrorConstructor(error)
{
	var target = valueCopy(error);
	
	console.log("TestErrorConstructor passed: " + (stringify(error) == stringify(target)) )
	
	console.log(stringify(error));
	console.log(stringify(target));
	
	
}

function CustomError(message, fileName, lineNumber) 
{
  var instance = new Error(message, fileName, lineNumber);
  instance.name = 'CustomError';
  //instance.foo = foo;
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) 
  {
    Error.captureStackTrace(instance, CustomError);
  }
  return instance;
}

CustomError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

if (Object.setPrototypeOf){
  Object.setPrototypeOf(CustomError, Error);
} else {
  CustomError.__proto__ = Error;
}



