# meouzer.github.io
Deep Copying and Serialization/Deserialization (Circular and Duplicate References Always Supported)

See Updates.md: Latest update 9-13-2021   

Did you know that robust deep copying depends on typing? We have the following, but first our data can be infinitely complex. You can have Sets whose members are Maps whose keys are ArrayBuffers and values are typed arrays. The set can also have properties that are DataViews whose properties are Maps whose properties are Sets whose properties are ArrayBuffers.


(1) The typing system you wish JavaScript had. 
      Robust typing is a basis for for both deep copying and serialization/deserialization. 
      
(2a) The stringify() function that dumps objects for debugging and more.

(2b) The parseDataString() that creates data objects from strings.

(2c) stringify() serializes and parseDataString() deserializes so that parseDataString(stringify(x)) is a deep copy of x. 

(3) The deepCopy() function is very robust. In particular it can be used to deep copy class instances of both ES5 and ES6 classes.

(4) JSHTML.js is the author's code for writing JavaScript code in HTML. You see it throughout most of the articles. What's unique is that it can mix JavaScript and HTML together because it's smart enough to tell the difference. Mix JavaScript code together with tables, pictures, lists, whatever.

(5) A six style infracture to CSS menus, which lets one go horizontal and vertical at will. It's easy peasy.

(6) There's a neat Flex quiz, that you can use to test your understanding of Flex. 


