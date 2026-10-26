const obj=(id,type,x,y,w,h,message,solid=true)=>({id,type,x,y,w,h,message,solid:solid?{x,y:y+Math.min(8,h/3),w,h:h-Math.min(8,h/3)}:null,depth:y+h});
export function createCabin(){return {width:480,height:360,bounds:{x:24,y:91,w:432,h:245},objects:[
obj('window','window',65,43,65,43,'The Oregon pines are swaying in the mountain breeze.',false),
obj('window2','window',330,43,65,43,'A lovely view… though Stella catches you looking at her instead. ♡',false),
obj('bed','bed',40,112,72,95,'Stella’s bed looks so cozy. Just five more minutes…'),
obj('nightstand','lamp',117,123,25,30,'A little golden light makes everything feel like home.'),
obj('luna','bear',116,175,24,27,'Luna looks happy to see you! ♡'),
obj('shelf','shelf',166,83,54,34,'So many stories to explore. Which adventure next?'),
obj('fire','fire',240,65,57,52,'The fire feels nice and warm. Stay a little while.'),
obj('plant','plant',307,100,21,28,'A new leaf! You’re doing beautifully, little fern.'),
obj('counter','counter',344,99,69,32,'A cup of tea and a slow morning. Perfect.'),
obj('fridge','fridge',417,87,27,49,'Strawberries, milk, and something sweet for later.'),
obj('sofa','sofa',204,161,84,43,'Stella pats the cushion beside her. “There’s room for you too, you know.” ♡'),
obj('coffee','table',216,234,60,28,'A warm mug and a half-finished journal.'),
obj('dining','dining',358,185,56,48,'“I saved you the sunny seat,” Stella says with a little wink.'),
obj('plant2','plant',418,282,23,31,'A tiny patch of green, even indoors.'),
obj('door','door',58,304,49,27,'The forest can wait. Let’s enjoy being home today.',false),
obj('closet','closet',148,277,48,54,'Open Stella’s closet'),
obj('bathroom-door','room-door',310,304,48,27,'Visit the bathroom',false)
]};}

export function createBathroom(){return {id:'bathroom',width:320,height:300,bounds:{x:24,y:80,w:272,h:200},objects:[
obj('bath','tub',36,94,104,65,'A warm bath behind a soft pink curtain.'),
obj('washbasin','washbasin',211,95,65,43,'Fresh water, rose soap and a little mirror.'),
obj('toilet','toilet',225,184,40,49,'A little privacy and a fresh start.'),
obj('towels','towels',47,194,52,24,'Fluffy towels, warm from the sunny window.',false),
obj('bathmat','bathmat',116,184,65,35,null,false),
obj('bathroom-exit','room-door',135,254,48,22,'Return to the cabin',false)
]};}
