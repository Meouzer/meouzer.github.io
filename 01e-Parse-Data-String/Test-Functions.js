

function foo()
{
	const y = 5*2  /  (3+4);
	const reg = /a{bc /gi;
	/*hello*/
	/**/
	const x = a/ /*jello*/ b;
	const q = '{{{';
}



var x = {a:foo};


const evaluator = function(){return eval('(' + arguments[0] + ')');}

var str = serializeFData(x);

var y = parseDataString(str, evaluator);

console.log(compareObjects(x,y));
