import {shade} from './clothing-art.js';
// Every style has a continuous heel, instep and toe attached to the ankle.
// The compact footprint stays fixed while only the sole rolls during a step.
export function shoeGeometry(angle,roll=0,blend=1){
 const side=Math.sin(angle),profile=Math.abs(side);
 return {width:17+profile*10,height:17,toe:profile*4,mirror:side<0?-1:1,front:Math.cos(angle),profile,roll:Math.max(-.045,Math.min(.045,roll*side*blend*.2))};
}
function footPath(g,s,top=-5,bottom=10){
 const left=-s.width/2+s.toe,right=left+s.width,heel=left+3;
 g.beginPath();g.moveTo(-5,top);
 g.bezierCurveTo(-5,top+4,left,1,left,5);
 g.quadraticCurveTo(left,bottom,heel,bottom);
 g.lineTo(right-4,bottom);
 g.quadraticCurveTo(right,bottom,right,6);
 g.bezierCurveTo(right,2,6,1,5,top);
 g.closePath();
}
function fillFoot(a,s,color,top=-5,bottom=10){
 footPath(a.g,s,top,bottom);a.g.fillStyle=a.gradient(-s.width/2,-5,17,shade(color,.24),shade(color,-.19));a.g.fill();
}
function bareFoot(a,s){
 // A shaped instep and rounded toe replace the old flat oval at the leg end.
 fillFoot(a,s,'#f2c1a0');
 const left=-s.width/2+s.toe,right=left+s.width;
 a.line([[left+3,9],[right-4,9]],'#c88e7d',.7);
 if(s.front>.15){
  // Tiny toe creases stay on the forward edge, never across the heel.
  const toeX=s.profile*7;
  a.line([[toeX-3,6.5],[toeX-3,8]],'#d69b83',.65);
  a.line([[toeX,7],[toeX,8.5]],'#d69b83',.6);
 }else if(s.front<-.2)a.line([[-2,3],[0,5],[2,3]],'#e1a98d',.6);
 a.line([[-2,-2],[-1,2]],'#ffe0bd',1.1);
}
export function paintShoe(a,ankle,angle,roll,blend,item){
 const color=item?.color||'#dda1ba',style=item?.style||'sneakers';
 const g=a.g,s=shoeGeometry(angle,roll,blend),left=-s.width/2+s.toe,right=left+s.width;
 g.save();g.translate(ankle.x,ankle.y);g.rotate(s.roll);g.scale(s.mirror,1);
 if(style==='bare'){s.width*=.8;s.toe*=.8;bareFoot(a,s);g.restore();return;}
 if(style==='slippers'){
  bareFoot(a,s);
  a.round(left,6,s.width,4,shade(color,-.26),2);
  g.beginPath();g.moveTo(left+1,6);g.quadraticCurveTo(left+2,-1,left+s.width*.57,-1);g.quadraticCurveTo(right,-1,right,6);g.quadraticCurveTo(right,9,right-4,9);g.lineTo(left+4,9);g.quadraticCurveTo(left,9,left+1,6);g.closePath();g.fillStyle=a.gradient(left,-1,11,shade(color,.3),shade(color,-.18));g.fill();
  a.line([[left+3,8],[right-3,8]],'#fff2dd',.8);g.restore();return;
 }
 // The full shoe upper overlaps the ankle; no exposed gap can open on a step.
 fillFoot(a,s,color,-6,10);
 g.beginPath();g.moveTo(left,6);g.quadraticCurveTo(left,10,left+4,10);g.lineTo(right-4,10);g.quadraticCurveTo(right,10,right,6);g.lineTo(right,8);g.quadraticCurveTo(right,12,right-4,12);g.lineTo(left+4,12);g.quadraticCurveTo(left,12,left,8);g.closePath();g.fillStyle=style==='boots'?'#72523f':'#f8eee4';g.fill();
 if(style==='boots'){
  a.round(-6,-18,12,23,a.gradient(-6,-18,23,shade(color,.22),shade(color,-.2)),2.5);
  a.line([[-5,-16],[5,-16]],shade(color,-.24),1);
  if(s.profile>.3){a.line([[-3,-13],[-3,2]],shade(color,-.28),.9);a.round(-5,-7,4,3,'#c9a776',.7);}
  a.line([[left+3,7],[right-3,7]],shade(color,-.23),.8);
 }else{
  a.round(-5,-7,10,12,a.gradient(-5,-7,15,shade(color,.32),shade(color,-.12)),2.3);
  if(s.front>.05){
   for(const y of [-3,-.5,2])a.line([[-2,y],[2,y]],'#fff6ec',.85);
   a.line([[left+3,5],[left+s.width*.55,6],[right-3,5]],shade(color,.4),.9);
  }else{
   // Rear views show the heel panel, not front-facing laces.
   a.line([[0,-4],[0,5]],shade(color,-.23),.8);
   a.round(-2,-5,4,2,'#fff0e6',.6);
  }
  if(s.profile>.35)a.line([[right-6,2],[right-3,5]],shade(color,.35),1);
 }
 a.line([[left+3,10],[right-3,10]],style==='boots'?'#ac8965':'#fffaf0',.7);
 g.restore();
}
