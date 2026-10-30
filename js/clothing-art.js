import {drawLimb,drawJointedLimb} from './limbs.js';
export const visibleBottom=items=>items.top.style==='dress'?{...items.top,style:'skirt'}:items.bottom.style==='underwear'?items.underwear:items.bottom;
export function earPositions(angle){
 const side=Math.sin(angle),front=Math.cos(angle);if(front<-.4)return [];
 const signs=Math.abs(side)>.55?[side>0?-1:1]:[-1,1];
 return signs.map(sign=>({x:80+sign*31*front-12*side,y:78+(-12*front-sign*31*side)*.1}));
}
const skin=['#ffdfb9','#f2c1a0','#d99b84'];
export function shade(color,amount){
 const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
 return '#'+rgb.map(c=>Math.round(amount>=0?c+(255-c)*amount:c*(1+amount)).toString(16).padStart(2,'0')).join('');
}
export const fabric=color=>[shade(color,.28),color,shade(color,-.14)];
function material(g,cx,w,color){const [light,mid,dark]=fabric(color),v=g.createLinearGradient(cx-w,0,cx+w,0);v.addColorStop(0,dark);v.addColorStop(.28,light);v.addColorStop(.62,mid);v.addColorStop(1,dark);return v;}
function surface(g,path,fill,edge){g.beginPath();path(g);g.closePath();g.fillStyle=fill;g.fill();if(edge){g.strokeStyle=edge;g.lineWidth=.8;g.stroke();}}
function torsoPath(g,cx,w,top=108,hem=177){
 g.moveTo(cx-w+7,top);g.quadraticCurveTo(cx-w-5,top+3,cx-w,top+24);g.bezierCurveTo(cx-w+2,148,80-w+7,158,80-w+5,hem);g.quadraticCurveTo(80,hem+4,80+w-5,hem);g.bezierCurveTo(80+w-7,158,cx+w-2,148,cx+w,top+24);g.quadraticCurveTo(cx+w+5,top+3,cx+w-7,top);
}
// Sculpted silhouettes, opaque fabric and source shading share the same anchors.
export function paintClothedBody(a,image,angle,items,textures={},shoulders=null){
 const g=a.g,profile=Math.abs(Math.sin(angle)),front=Math.cos(angle),cx=80+Math.sin(angle)*7,w=30-11*profile,top=items.top,bottom=items.bottom,under=items.underwear;
 const nx=image.neckX??cx;
 surface(g,p=>{p.moveTo(nx-8,89);p.lineTo(nx+8,89);p.bezierCurveTo(nx+8,101,cx+8,107,cx+10,118);p.quadraticCurveTo(cx,121,cx-10,118);p.bezierCurveTo(cx-8,107,nx-8,101,nx-8,89);},a.gradient(nx,89,30,'#e8ae91','#f6cba9'));
 surface(g,p=>{p.moveTo(nx-8,100);p.quadraticCurveTo(cx-15,107,cx-w+2,110);p.quadraticCurveTo(cx-w-3,119,cx-w+1,133);p.bezierCurveTo(cx-w+4,151,80-w+10,167,80-w+3,191);p.quadraticCurveTo(80,197,80+w-3,191);p.bezierCurveTo(80+w-10,167,cx+w-4,151,cx+w-1,133);p.quadraticCurveTo(cx+w+3,119,cx+w-2,110);p.quadraticCurveTo(cx+15,107,nx+8,100);},material(g,cx,w,'#f3c6a5'));
 a.oval(cx,106,7,2,'#c88f7c44');
 if(top.style==='tank'){
  surface(g,p=>{p.moveTo(cx-w+6,123);p.quadraticCurveTo(cx,137,cx+w-6,123);p.bezierCurveTo(cx+w-3,144,80+w-9,158,80+w-6,181);p.quadraticCurveTo(80,185,80-w+6,181);p.bezierCurveTo(80-w+9,158,cx-w+3,144,cx-w+6,123);},material(g,cx,w,top.color),shade(top.color,-.15));
  for(const sign of [-1,1]){
   const shoulder=shoulders?.[sign<0?0:1],x=shoulder?shoulder.x+(cx-shoulder.x)*.18:cx+sign*(w-9),y=shoulder?.y??110;
   // Straps follow the actual shoulder height as the far shoulder turns away.
   a.line([[x,127],[x,y]],shade(top.color,.1),4);
  }
  a.line([[80-w+8,180],[80+w-8,180]],shade(top.color,-.12),1);
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
 if(textures.top){const shear=-Math.sin(angle)*7/78;g.save();g.transform(1,0,shear,1,-shear*100,0);g.drawImage(textures.top,0,100,160,78,0,100,160,78);g.restore();}
 const b=visibleBottom(items),c=b.color,half=32-11*profile,bx=80;
 if(b.style==='briefs'||b.style==='hipster'){
  const waist=b.style==='hipster'?187:181;
  surface(g,p=>{p.moveTo(bx-half,waist);p.quadraticCurveTo(bx,waist+2,bx+half,waist);p.quadraticCurveTo(bx+half-5,197,bx+9,207);p.lineTo(bx-9,207);p.quadraticCurveTo(bx-half+5,197,bx-half,waist);},material(g,bx,half,c),shade(c,-.14));
  a.line([[bx-half+2,waist+2],[bx,waist+3],[bx+half-2,waist+2]],shade(c,-.12),1);
 }else if(b.style==='skirt'||top.style==='dress'){
  const color=top.style==='dress'?top.color:c;
  surface(g,p=>{p.moveTo(bx-half+6,177);p.lineTo(bx+half-6,177);p.quadraticCurveTo(bx+half-3,212,bx+half+9,237);p.quadraticCurveTo(bx,245,bx-half-9,237);p.quadraticCurveTo(bx-half+3,212,bx-half+6,177);},material(g,bx,half+9,color),shade(color,-.22));
  for(let i=-2;i<=2;i++)a.line([[bx+i*9,190],[bx+i*14,235]],shade(color,i%2===0?.15:-.13),1.3);
  a.line([[bx-half+7,182],[bx,183],[bx+half-7,182]],shade(color,-.18),2);
  a.line([[bx-half-5,236],[bx,240],[bx+half+5,236]],shade(color,.2),1);
 }else if(['trousers','leggings','boyshorts'].includes(b.style)){
  surface(g,p=>{p.moveTo(bx-half+3,180);p.quadraticCurveTo(bx,183,bx+half-3,180);const end=b.style==='boyshorts'?half-1:(b.style==='leggings'?29:30)-16*profile;p.quadraticCurveTo(bx+half,193,bx+end,207);p.lineTo(bx-end,207);p.quadraticCurveTo(bx-half,193,bx-half+3,180);p.closePath();},material(g,bx,half,c));
  a.line([[bx-half+3,183],[bx,185],[bx+half-3,183]],shade(c,-.15),b.style==='leggings'?2:1.1);
  if(b.style==='trousers'){
   if(front>.1){a.line([[bx,187],[bx,200]],shade(c,-.25),.8);a.oval(bx,187,1.2,1.2,shade(c,.3));}
   for(const sign of [-1,1])a.line([[bx+sign*(half-6),187],[bx+sign*(half-9),195],[bx+sign*(half-15),197]],shade(c,-.18),.8);
  }else if(b.style==='boyshorts'){
   a.line([[bx,190],[bx,205]],shade(c,-.1),.6);a.line([[bx-half+3,205],[bx-3,205]],shade(c,-.14),.8);a.line([[bx+3,205],[bx+half-3,205]],shade(c,-.14),.8);
  }
 }else{
  surface(g,p=>{p.moveTo(bx-half+3,180);p.quadraticCurveTo(bx,184,bx+half-3,180);p.lineTo(bx+half,202);p.quadraticCurveTo(bx+16,209,bx+2,204);p.lineTo(bx,197);p.lineTo(bx-2,204);p.quadraticCurveTo(bx-16,209,bx-half,202);p.closePath();},material(g,bx,half,c),shade(c,-.2));
  a.line([[bx-half+4,183],[bx,185],[bx+half-4,183]],shade(c,.25),2);
  if(front>.1){a.line([[bx,186],[bx,200]],shade(c,-.25),.8);a.oval(bx,187,1.4,1.4,shade(c,.4));if(b.style==='shorts'){a.line([[bx,187],[bx-5,193],[bx-4,198]],'#f9efde',.9);a.line([[bx,187],[bx+4,193],[bx+5,198]],'#f9efde',.9);}}
  for(const sign of [-1,1])a.line([[bx+sign*(half-7),187],[bx+sign*(half-9),195],[bx+sign*(half-16),198]],shade(c,-.18),.9);
 }
 if(textures.bottom&&top.style!=='dress')g.drawImage(textures.bottom,0,178,160,31,-Math.sin(angle)*7,178,160,31);
 // Keep Stella's original face and pixie-cut texture clean at the neck join.
 const density=image.pixelRatio||1;g.drawImage(image,0,0,160*density,113*density,0,0,160,113);
 if(items.neck.style!=='none'&&front>.05){
  a.line([[cx-9,107],[cx-5,118],[cx+5,118],[cx+9,107]],items.neck.color,1.2);
  if(items.neck.style==='pearl')for(let i=-2;i<=2;i++)a.oval(cx+i*3.5,117+Math.cos(i)*2,1.8,1.8,'#fff8e6');
  else{a.oval(cx,121,3,3,items.neck.color);if(items.neck.style==='heart')a.shape([[cx-4,120],[cx+4,120],[cx,126]],items.neck.color);}
 }
}
export function paintClothingLeg(a,rig,item){
 if(!['trousers','leggings'].includes(item.style))return;
 const tight=item.style==='leggings',widths=tight?[24,15,11]:[27,20,17];drawJointedLimb(a.g,rig.hip,rig.knee,rig.foot,widths,fabric(item.color));
 if(!tight){const cuff={x:rig.foot.x+(rig.knee.x-rig.foot.x)*.08,y:rig.foot.y+(rig.knee.y-rig.foot.y)*.08};drawLimb(a.g,cuff,rig.foot,17.5,17.5,fabric(shade(item.color,-.08)));}
}
export function paintAccessories(a,rig,angle,items){
 const g=a.g,side=Math.sin(angle),front=Math.cos(angle),hx=80+side*5,hw=31-8*Math.abs(side);
 g.save();g.translate(rig.body.x,rig.body.y);if(rig.bodyAxis)g.transform(1,0,rig.bodyAxis.x,rig.bodyAxis.y,0,0);g.translate(-80,-196);
 const h=items.head;
 if(h.style==='band'||h.style==='bow'){
  g.beginPath();g.moveTo(hx-hw,45);g.bezierCurveTo(hx-hw+2,9,hx+hw-2,9,hx+hw,45);g.strokeStyle=h.color;g.lineWidth=5;g.stroke();
  if(h.style==='bow'&&side<.55){const bx=80+29*front-12*side;a.shape([[bx,29],[bx-13,18],[bx-13,36]],h.color);a.shape([[bx,29],[bx+13,18],[bx+13,36]],h.color);a.oval(bx,29,4,4,'#e4d0ef');}
 }else if(h.style==='flowers')for(let i=0;i<7;i++)a.flower(hx-hw+i*hw/3,32-Math.sin(i/6*Math.PI)*13,'#fff4cf');
 else if(h.style==='hat'){
  const x=80+side*3; a.oval(x,34,59,11,'#987a4b44');a.oval(x,31,59,11,a.gradient(x-59,20,23,'#f3d9a0','#c2a06b'));
  surface(g,p=>{p.moveTo(x-35,28);p.lineTo(x-33,10);p.quadraticCurveTo(x-28,-5,x,-4);p.quadraticCurveTo(x+28,-5,x+33,10);p.lineTo(x+35,28);p.quadraticCurveTo(x,36,x-35,28);},material(g,x,35,h.color),shade(h.color,-.2));
  a.line([[x-33,25],[x,30],[x+33,25]],'#d891ac',5);a.line([[x-31,9],[x-30,22]],'#fff2c755',1);if(side<.55)a.flower(x+29*front-8*side,27,'#f6cada');
 }else if(h.style==='beanie'){
  const x=80+side*4,w=40-5*Math.abs(side);surface(g,p=>{p.moveTo(x-w,33);p.quadraticCurveTo(x-w-2,-4,x,-4);p.quadraticCurveTo(x+w+2,-4,x+w,33);p.quadraticCurveTo(x,40,x-w,33);},material(g,x,w,h.color));
  a.oval(x,-4,8,8,shade(h.color,.18));a.round(x-w,27,w*2,12,material(g,x,w,shade(h.color,.12)),4);for(let i=-w+4;i<w;i+=5)a.line([[x+i,29],[x+i,37]],shade(h.color,-.1),.7);
 }
 if(items.ears.style!=='none')for(const {x,y} of earPositions(angle)){const e=items.ears;if(e.style==='hoop'){g.strokeStyle=e.color;g.lineWidth=1.5;g.beginPath();g.ellipse(x,y+3,3,5,0,0,Math.PI*2);g.stroke();}else a.oval(x,y,e.style==='drop'?2.5:2,e.style==='drop'?5:2,e.color);}
 g.restore();
}

export function paintWristAccessory(a,arm,item,index){
 if(item.style==='none'||(item.style==='watch'&&index!==0))return;
 const w=arm.wrist,e=arm.elbow,p={x:w.x+(e.x-w.x)*.08,y:w.y+(e.y-w.y)*.08},g=a.g;
 g.save();g.translate(p.x,p.y);g.rotate(Math.atan2(w.y-e.y,w.x-e.x)-Math.PI/2);
 a.line([[-5,0],[5,0]],item.color,item.style==='watch'?3:2.2);
 if(item.style==='watch'){a.round(-2.7,-3.5,5.4,7,'#e5e6dd',1.5);a.round(-1.9,-2.6,3.8,5.2,'#fff5dc',1);a.line([[0,-1.8],[0,0],[1.3,.8]],'#797a78',.55);}
 if(item.style==='beads')for(let i=-2;i<=2;i++)a.oval(i*2.3,0,1.5,1.6,item.color);
 if(item.style==='bangle')a.line([[-5,3],[5,3]],shade(item.color,.22),1.2);
 g.restore();
}
