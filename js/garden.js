const solid=(id,type,x,y,w,h,message)=>({id,type,x,y,w,h,depth:y+h,message,solid:{x,y,w,h}});
export function createGarden(){
 const objects=[
  solid('cabin','house',130,12,188,118),
  {id:'home',type:'entry',x:210,y:131,w:26,h:10,depth:142,message:'Come inside',travel:'cabin'},
  solid('fence-top','fence',60,180,220,5),solid('fence-left','fence',60,180,5,150),solid('fence-right','fence',275,180,5,150),
  solid('fence-bottom-l','fence',60,330,85,5),solid('fence-bottom-r','fence',195,330,85,5),
  {...solid('gate','gate',145,330,50,5,'Open the garden gate'),open:false},
  solid('pond','pond',337,227,94,63,'Little ripples catch the sky. A peaceful place to pause.'),
 ];
 for(let row=0;row<2;row++)for(let col=0;col<3;col++)objects.push({...solid(`plot-${row}-${col}`,'plot',82+col*61,207+row*60,38,28,'Plant a seed'),stage:0});
 for(const [i,x,y] of [[0,28,35],[1,85,70],[2,350,60],[3,428,100],[4,32,365],[5,425,365]])objects.push(solid(`tree-${i}`,'tree',x,y,14,12));
 objects.push(
  {id:'seeds',type:'basket',x:300,y:130,w:22,h:20,depth:150,message:'Take free strawberry seeds'},
  {...solid('picnic','picnic',610,450,90,52,'A little picnic beneath the trees. A lovely place to enjoy the afternoon.')},
  {id:'flowers',type:'flowers',x:615,y:282,w:35,h:25,depth:307,message:'Pick a meadow flower'},
  {id:'forest-sign',type:'sign',x:500,y:100,w:25,h:20,depth:120,message:'Pine trail · follow the path east to the meadow and south to the picnic clearing.'}
 );
 for(let i=0;i<32;i++){const x=370+(i*73)%420,y=40+(i*107)%570;if((x>470&&x<590)||(y>220&&y<340)||(x>580&&y>390&&y<540))continue;objects.push(solid(`pine-${i}`,'tree',x,y,14,12));}
 return {id:'garden',width:840,height:680,bounds:{x:16,y:20,w:808,h:645},objects};
}
export function toggleGate(gate){gate.open=!gate.open;gate.solid=gate.open?null:{x:gate.x,y:gate.y,w:gate.w,h:gate.h};gate.message=gate.open?'Close the garden gate':'Open the garden gate';}
export function updateGarden(scene,clock){
 const now=clock.day*24+clock.hour;
 for(const plot of scene.objects.filter(o=>o.type==='plot')){
  if(plot.stage===2&&now>=plot.readyAt)plot.stage=3;
  plot.message=['Plant a strawberry seed','Water the seedlings','Growing · ready after one game day','Harvest strawberries'][plot.stage];
 }
}
export function tendPlot(plot,inventory,clock){
 if(plot.stage===0){if(inventory.seeds<=0)return 'Your seed pouch is empty. The basket beside the cabin has free seeds.';inventory.seeds--;plot.stage=1;return 'You tuck a strawberry seed into the soft soil. Water it to help it grow.';}
 if(plot.stage===1){plot.stage=2;plot.readyAt=clock.day*24+clock.hour+24;return 'A gentle drink of water. Your strawberries will ripen in one game day. They will stay safe until you return.';}
 if(plot.stage===2)return 'Your strawberries are growing happily. Come back after a game day. No extra watering needed.';
 inventory.berries+=3;inventory.seeds++;plot.stage=0;delete plot.readyAt;return 'Three sweet strawberries and a seed for next time! Tucked safely in your backpack.';
}
