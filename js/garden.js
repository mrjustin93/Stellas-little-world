const solid=(id,type,x,y,w,h,message)=>({id,type,x,y,w,h,depth:y+h,message,solid:{x,y,w,h}});
export function createGarden(){
 const objects=[
  solid('cabin','house',150,40,140,90),
  {id:'home',type:'entry',x:210,y:131,w:26,h:10,depth:142,message:'Come inside',travel:'cabin'},
  solid('fence-top','fence',60,180,220,5),solid('fence-left','fence',60,180,5,150),solid('fence-right','fence',275,180,5,150),
  solid('fence-bottom-l','fence',60,330,85,5),solid('fence-bottom-r','fence',195,330,85,5),
  {...solid('gate','gate',145,330,50,5,'Open the garden gate'),open:false},
  solid('pond','pond',337,227,94,63,'Little ripples catch the sky. A peaceful place to pause.'),
 ];
 for(let row=0;row<2;row++)for(let col=0;col<3;col++)objects.push({...solid(`plot-${row}-${col}`,'plot',82+col*61,207+row*60,38,28,'Plant a seed'),stage:0});
 for(const [i,x,y] of [[0,28,35],[1,85,70],[2,350,60],[3,428,100],[4,32,365],[5,425,365]])objects.push(solid(`tree-${i}`,'tree',x,y,14,12));
 return {id:'garden',width:480,height:400,bounds:{x:16,y:20,w:448,h:365},objects};
}
export function toggleGate(gate){gate.open=!gate.open;gate.solid=gate.open?null:{x:gate.x,y:gate.y,w:gate.w,h:gate.h};gate.message=gate.open?'Close the garden gate':'Open the garden gate';}
export function tendPlot(plot){
 const texts=['You tuck a strawberry seed into the soft soil. A little beginning.','A gentle drink of water. Your strawberry plant unfurls its leaves.','A sweet, ripe strawberry! You gather it and leave the soil ready for another seed.'];
 const result=texts[plot.stage];plot.stage=(plot.stage+1)%3;plot.message=['Plant a seed','Water the seedlings','Harvest strawberries'][plot.stage];return result;
}
