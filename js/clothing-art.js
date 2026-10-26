import {drawLimb} from './limbs.js';
const skin=['#ffdfb9','#f2c1a0','#d99b84'];
export function shade(color,amount){
 const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
 return '#'+rgb.map(c=>Math.round(amount>=0?c+(255-c)*amount:c*(1+amount)).toString(16).padStart(2,'0')).join('');
}
export const fabric=color=>[shade(color,.28),color,shade(color,-.22)];
function material(g,cx,w,color){const [light,mid,dark]=fabric(color),v=g.createLinearGradient(cx-w,0,cx+w,0);v.addColorStop(0,dark);v.addColorStop(.28,light);v.addColorStop(.62,mid);v.addColorStop(1,dark);return v;}
function surface(g,path,fill,edge){g.beginPath();path(g);g.closePath();g.fillStyle=fill;g.fill();if(edge){g.strokeStyle=edge;g.lineWidth=.8;g.stroke();}}
function torsoPath(g,cx,w,top=108,hem=177){
 g.moveTo(cx-w+7,top);g.quadraticCurveTo(cx-w-5,top+3,cx-w,top+24);g.bezierCurveTo(cx-w+2,148,cx-w+7,158,cx-w+5,hem);g.quadraticCurveTo(cx,hem+4,cx+w-5,hem);g.bezierCurveTo(cx+w-7,158,cx+w-2,148,cx+w,top+24);g.quadraticCurveTo(cx+w+5,top+3,cx+w-7,top);
}
// Sculpted silhouettes, opaque fabric and source shading share the same anchors.
export function paintClothedBody(a,image,angle,items,textures={}){
 const g=a.g,profile=Math.abs(Math.sin(angle)),front=Math.cos(angle),cx=80+Math.sin(angle)*7,w=30-11*profile,top=items.top,bottom=items.bottom,under=items.underwear;
 a.round(cx-7,91,14,27,a.gradient(cx,91,27,'#e8ae91','#f6cba9'),5);
 surface(g,p=>{torsoPath(p,cx,w-1,103,191);},material(g,cx,w,'#f3c6a5'));
 a.oval(cx,106,7,2,'#c88f7c44');
 if(top.style==='tank'){
  surface(g,p=>{p.moveTo(cx-w+6,123);p.quadraticCurveTo(cx,137,cx+w-6,123);p.bezierCurveTo(cx+w-3,144,cx+w-9,158,cx+w-6,175);p.quadraticCurveTo(cx,179,cx-w+6,175);p.bezierCurveTo(cx-w+9,158,cx-w+3,144,cx-w+6,123);},material(g,cx,w,top.color),shade(top.color,-.15));
  for(const sign of [-1,1])a.line([[cx+sign*(w-7),126],[cx+sign*(w-9),110]],shade(top.color,.1),6);
  a.line([[cx-w+8,173],[cx+w-8,173]],shade(top.color,-.12),1);
  a.line([[cx-w+10,149],[cx-w+12,162]],'#ffffff66',1);
 }else{
  surface(g,p=>torsoPath(p,cx,w,108,177),material(g,cx,w,top.color),shade(top.color,-.22));
  a.oval(cx,110,10,front<0?4:7,shade(top.color,-.2));a.oval(cx,108,8,front<0?3:6,skin[1]);
  if(top.style==='hoodie'||top.style==='cardigan'){
   if(front>.12){const opening=Math.max(3,11*front);a.round(cx-opening,120,opening*2,55,material(g,cx,opening,'#fff4e7'),3);for(const sign of [-1,1])a.line([[cx+sign*(opening+3),117],[cx+sign*(opening+2),175]],shade(top.color,.4),2);}
   else if(top.style==='hoodie'){surface(g,p=>{p.moveTo(cx-w+4,109);p.quadraticCurveTo(cx,104,cx+w-4,109);p.quadraticCurveTo(cx+w-1,130,cx,134);p.quadraticCurveTo(cx-w+1,130,cx-w+4,109);},material(g,cx,w,shade(top.color,.09)),shade(top.color,-.25));a.line([[cx-w+9,117],[cx,128],[cx+w-9,117]],'#fff4e544',1);}
   if(top.style==='hoodie'&&front>.12)for(const sign of [-1,1]){a.line([[cx+sign*16,120],[cx+sign*15,144]],'#fff3e1',1.3);a.oval(cx+sign*15,145,1,2,'#e4d6c2');}
  }
  a.line([[cx-w+6,171],[cx,173],[cx+w-6,171]],shade(top.color,-.17),1.2);
  for(const sign of [-1,1])a.line([[cx+sign*(w-5),148],[cx+sign*(w-10),154]],shade(top.color,-.13),.9);
  if(top.style==='sweater')for(let y=166;y<176;y+=3)a.line([[cx-w+6,y],[cx+w-6,y]],'#fff4df44',.8);
 }
 if(textures.top)g.drawImage(textures.top,0,100,160,78,0,100,160,78);
 const b=bottom.style==='underwear'?under:bottom,c=b.color,half=32-11*profile;
 if(b.style==='briefs'||b.style==='hipster'){
  const waist=b.style==='hipster'?187:181;
  surface(g,p=>{p.moveTo(cx-half,waist);p.quadraticCurveTo(cx,waist+2,cx+half,waist);p.quadraticCurveTo(cx+half-5,197,cx+9,207);p.lineTo(cx-9,207);p.quadraticCurveTo(cx-half+5,197,cx-half,waist);},material(g,cx,half,c),shade(c,-.14));
  a.line([[cx-half+2,waist+2],[cx,waist+3],[cx+half-2,waist+2]],shade(c,-.12),1);
 }else if(b.style==='skirt'||top.style==='dress'){
  const color=top.style==='dress'?top.color:c;
  surface(g,p=>{p.moveTo(cx-half+6,177);p.lineTo(cx+half-6,177);p.quadraticCurveTo(cx+half-3,212,cx+half+9,237);p.quadraticCurveTo(cx,245,cx-half-9,237);p.quadraticCurveTo(cx-half+3,212,cx-half+6,177);},material(g,cx,half+9,color),shade(color,-.22));
  for(let i=-2;i<=2;i++)a.line([[cx+i*9,190],[cx+i*14,235]],shade(color,i%2===0?.15:-.13),1.3);
  a.line([[cx-half+7,182],[cx,183],[cx+half-7,182]],shade(color,-.18),2);
  a.line([[cx-half-5,236],[cx,240],[cx+half+5,236]],shade(color,.2),1);
 }else{
  surface(g,p=>{p.moveTo(cx-half+3,180);p.quadraticCurveTo(cx,184,cx+half-3,180);p.lineTo(cx+half,202);p.quadraticCurveTo(cx+16,209,cx+2,204);p.lineTo(cx,197);p.lineTo(cx-2,204);p.quadraticCurveTo(cx-16,209,cx-half,202);p.closePath();},material(g,cx,half,c),shade(c,-.2));
  a.line([[cx-half+4,183],[cx,185],[cx+half-4,183]],shade(c,.25),2);
  if(front>.1){a.line([[cx,186],[cx,200]],shade(c,-.25),.8);a.oval(cx,187,1.4,1.4,shade(c,.4));if(b.style==='shorts'){a.line([[cx,187],[cx-5,193],[cx-4,198]],'#f9efde',.9);a.line([[cx,187],[cx+4,193],[cx+5,198]],'#f9efde',.9);}}
  for(const sign of [-1,1])a.line([[cx+sign*(half-7),187],[cx+sign*(half-9),195],[cx+sign*(half-16),198]],shade(c,-.18),.9);
 }
 if(textures.bottom&&top.style!=='dress')g.drawImage(textures.bottom,0,178,160,31,0,178,160,31);
 // Keep Stella's original face and pixie-cut texture clean at the neck join.
 g.drawImage(image,0,0,160,95,0,0,160,95);g.drawImage(image,cx-12,95,24,8,cx-12,95,24,8);
 if(items.neck.style!=='none'&&front>.05){
  a.line([[cx-9,107],[cx-5,118],[cx+5,118],[cx+9,107]],items.neck.color,1.2);
  if(items.neck.style==='pearl')for(let i=-2;i<=2;i++)a.oval(cx+i*3.5,117+Math.cos(i)*2,1.8,1.8,'#fff8e6');
  else{a.oval(cx,121,3,3,items.neck.color);if(items.neck.style==='heart')a.shape([[cx-4,120],[cx+4,120],[cx,126]],items.neck.color);}
 }
}
export function paintClothingLeg(a,rig,item){
 if(!['trousers','leggings'].includes(item.style))return;
 drawLimb(a.g,rig.hip,rig.knee,25,17,fabric(item.color));drawLimb(a.g,rig.knee,rig.foot,17,13,fabric(item.color));
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
