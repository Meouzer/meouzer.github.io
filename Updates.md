9-13-21

The original meouzer.github.io was deleted and reincarnated. The deep copying code is now better, and a lot of code was simply eliminated in part because I found out how to 
do it better, but mostly because I no longer support IE11. There is now a clear straight line from deep-copying JSON like objects and the aphelion of deep copying ES5 and ES6 
classes. 

9-22-2021

Deep Copy Algorithm made 4 times faster in deep copying a particular ES5 class and a particular ES6 class. This is done by using a different technqiue for post order processing: that is null markers on the stack are used to indicate whether a node is in pre-order or post-order. The General Deep Copying article goes over the algorithm, is heavily commented and goes in easy steps from deep copying JSON literal objects all the way to full blown deep copying that can copy classes. Both valueCopy.js and deepCopy.js changed.
