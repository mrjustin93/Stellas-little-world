import {drawLimb} from './limbs.js';
const skin=['#ffdfb9','#f2c1a0','#d99b84'];
export const fabric=color=>[color,color,color];
// Original opaque clothing shapes share the walking rig's torso and limb anchors.
export function paintClothedBody(a,image,angle,items){
 const g=a.g,profile=Math.abs(Math.sin(angle)),cx=80+Math.sin(angle)*7,w=30-11*profile,top=items.top,bottom=items.bottom,under=items.underwear;
 a.round(cx-8,91,16,27,skin[1],5);
 a.round(cx-w,103,w*2,94,a.gradient(cx-w,103,94,skin[0],skin[2]),13);
 if(top.style==='tank'){
  a.round(cx-w+4,125,w*2-8,52,a.gradient(cx,125,52,top.color,'#dfd9d1'),5);
  a.line([[cx-w+8,131],[cx-w+9,110]],top.color,8);a.line([[cx+w-8,131],[cx+w-9,110]],top.color,8);
  a.line([[cx-w+4,174],[cx+w-4,174]],'#d6cec155',1);
 }else{
  a.round(cx-w-1,108,w*2+2,70,a.gradient(cx,108,75,top.color,top.color),8);
  a.oval(cx,110,10,7,skin[1]);
  if(top.style==='hoodie'||top.style==='cardigan'){
   a.round(cx-11,121,22,54,'#fff6e9',3);a.line([[cx-13,118],[cx-13,175]],'#fff4df99',2);a.line([[cx+13,118],[cx+13,175]],'#fff4df99',2);
   if(top.style==='hoodie'){a.line([[cx-17,117],[cx-16,143]],'#fff3e1',1.5);a.line([[cx+17,117],[cx+16,143]],'#fff3e1',1.5);}
  }else if(top.style==='sweater')for(let y=164;y<177;y+=4)a.line([[cx-w+2,y],[cx+w-2,y]],'#fff4df55',1);
 }
 const b=bottom.style==='underwear'?under:bottom,c=b.color,half=34-12*profile;
 if(b.style==='briefs'||b.style==='hipster'){
  const waist=b.style==='hipster'?187:181;
  a.shape([[cx-half,waist],[cx+half,waist],[cx+half-4,194],[cx+9,207],[cx-9,207],[cx-half+4,194]],c);
  a.line([[cx-half+2,waist+2],[cx+half-2,waist+2]],'#d9cbd1',1);
 }else if(b.style==='skirt'||top.style==='dress'){
  const color=top.style==='dress'?top.color:c;
  a.shape([[cx-half+5,178],[cx+half-5,178],[cx+half+9,240],[cx-half-9,240]],color);
  for(let i=-2;i<=2;i++)a.line([[cx+i*10,188],[cx+i*15,237]],'#fff3e544',1);
  a.line([[cx-half+3,181],[cx+half-3,181]],'#fff1dc99',2);
 }else{
  a.round(cx-half,180,half*2,25,c,5);a.line([[cx-half+3,183],[cx+half-3,183]],'#fff3e488',1);
  a.line([[cx,189],[cx,204]],'#90748266',1);
 }
 // Keep the reference face and tousled pixie cut untouched above the collar.
 g.drawImage(image,0,0,160,95,0,0,160,95);
 g.drawImage(image,cx-12,95,24,8,cx-12,95,24,8);
 if(items.neck.style!=='none'&&Math.cos(angle)>.05){
  a.line([[cx-9,107],[cx-5,118],[cx+5,118],[cx+9,107]],items.neck.color,1.2);
  if(items.neck.style==='pearl')for(let i=-2;i<=2;i++)a.oval(cx+i*3.5,117+Math.cos(i)*2,1.8,1.8,'#fff8e6');
  else{a.oval(cx,121,3,3,items.neck.color);if(items.neck.style==='heart')a.shape([[cx-4,120],[cx+4,120],[cx,126]],items.neck.color);}
 }
}
export function paintClothingLeg(a,rig,item){
 if(!['trousers','leggings'].includes(item.style))return;
 drawLimb(a.g,rig.hip,rig.knee,25,17,fabric(item.color));drawLimb(a.g,rig.knee,rig.foot,17,13,fabric(item.color));a.oval(rig.knee.x,rig.knee.y,8.5,7,item.color);
}
export function paintAccessories(a,rig,angle,items){
 const g=a.g,cx=rig.body.x,y=rig.body.y-196;
 g.save();g.translate(rig.body.x,rig.body.y);if(rig.bodyAxis)g.transform(1,0,rig.bodyAxis.x,rig.bodyAxis.y,0,0);g.translate(-80,-196);
 const h=items.head;
 if(h.style==='band'||h.style==='bow'){
  a.line([[49,45],[55,24],[78,16],[102,25],[112,46]],h.color,5);
  if(h.style==='bow'){a.shape([[106,29],[91,16],[90,36]],h.color);a.shape([[107,29],[120,17],[121,37]],h.color);a.oval(106,29,4,4,'#e4d0ef');}
 }else if(h.style==='flowers')for(let i=0;i<7;i++)a.flower(50+i*10,32-Math.sin(i/6*Math.PI)*13,'#fff4cf');
 else if(h.style==='hat'){a.oval(80,32,61,12,'#d6b77c');a.round(44,-1,73,35,a.gradient(44,-1,35,'#f3dba5','#c4a169'),17);a.line([[46,27],[115,27]],'#d891ac',5);a.flower(109,25,'#f6cada');}
 else if(h.style==='beanie'){a.round(39,1,82,39,h.color,21);a.round(39,29,82,12,'#bbddc8',4);a.oval(81,0,10,9,h.color);}
 if(Math.cos(angle)>-.25&&items.ears.style!=='none')for(const x of [48,111]){const e=items.ears;if(e.style==='hoop'){g.strokeStyle=e.color;g.lineWidth=1.5;g.beginPath();g.ellipse(x,81,3,5,0,0,Math.PI*2);g.stroke();}else a.oval(x,80,e.style==='drop'?2.5:2,e.style==='drop'?5:2,e.color);}
 g.restore();
 if(items.wrist.style!=='none')for(const arm of rig.arms){const {wrist:w,elbow:e}=arm;const p={x:w.x+(e.x-w.x)*.06,y:w.y+(e.y-w.y)*.06};a.line([[p.x-6,p.y],[p.x+6,p.y]],items.wrist.color,items.wrist.style==='watch'?4:2.5);if(items.wrist.style==='watch')a.oval(p.x,p.y,3,4,'#f8f0d9');if(items.wrist.style==='beads')for(let i=-2;i<=2;i++)a.oval(p.x+i*2.4,p.y,1.6,1.7,items.wrist.color);}
}
