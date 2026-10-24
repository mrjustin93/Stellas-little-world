const obj=(id,type,x,y,w,h,message,solid=true)=>({id,type,x,y,w,h,message,solid:solid?{x,y:y+Math.min(8,h/3),w,h:h-Math.min(8,h/3)}:null,depth:y+h});
export function createCabin(){return {width:480,height:360,bounds:{x:24,y:91,w:432,h:245},objects:[
obj('window','window',65,43,65,43,'The Oregon pines are swaying in the mountain breeze.',false),
obj('window2','window',330,43,65,43,'What a beautiful day in the mountains!',false),
obj('bed','bed',40,112,72,95,'Stella’s bed looks so cozy. Just five more minutes…'),
obj('nightstand','lamp',117,123,25,30,'A little golden light makes everything feel like home.'),
obj('luna','bear',116,175,24,27,'Luna looks happy to see you! ♡'),
obj('shelf','shelf',166,83,54,34,'So many stories to explore. Which adventure next?'),
obj('fire','fire',240,65,57,52,'The fire feels nice and warm. Stay a little while.'),
obj('plant','plant',307,100,21,28,'A new leaf! You’re doing beautifully, little fern.'),
obj('counter','counter',344,99,69,32,'A cup of tea and a slow morning. Perfect.'),
obj('fridge','fridge',417,87,27,49,'Strawberries, milk, and something sweet for later.'),
obj('sofa','sofa',204,161,84,43,'The best spot for a book and a cuddle with Luna.'),
obj('coffee','table',216,234,60,28,'A warm mug and a half-finished journal.'),
obj('dining','dining',358,185,56,48,'A little table for little moments of happiness.'),
obj('plant2','plant',418,282,23,31,'A tiny patch of green, even indoors.'),
obj('door','door',58,304,49,27,'The forest can wait. Let’s enjoy being home today.',false)
]};}
