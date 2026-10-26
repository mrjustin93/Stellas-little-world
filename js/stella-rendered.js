import {restoreClothes,clothingItems} from './clothing.js';
import {fabric,paintClothedBody,paintClothingLeg,paintAccessories,paintWristAccessory} from './clothing-art.js';
import {OUTFITS,outfitId,tintClothes} from './wardrobe.js';
// Sixteen rendered key views, aligned using inspected silhouette bounds.
// Thirty-two facing steps blend the key views; gait is animated at runtime.
import {StellaAtlas} from './stella.js';
import {SCALE,isJogging} from './gait.js';
import {nearestFacing} from './locomotion.js';
import {activityRig,paintHeldProp,paintActivityGround,paintActivityEffects} from './activity-art.js';
import {paintLeg,paintArm} from './limbs.js';
import {paintShoe} from './shoes.js';
export class RenderedStella {
 constructor(){this.fallback=new StellaAtlas();this.ready=false;this.views=[];this.heads=[];this.bodies=[];this.outfits={};this.garments=new Map();this.steps=32;this.keyViews=16;this.image=new Image();this.image.onerror=()=>{this.ready=false;};this.image.onload=()=>{this.prepare();};
  fetch(new URL('../assets/characters/stella-rendered-v06.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Missing Stella metadata');return r.json();}).then(data=>{if(data.frames?.length!==16)throw Error('Invalid Stella metadata');this.metadata=data;this.image.src=new URL('../assets/characters/stella-rendered-v06.png',import.meta.url).href;}).catch(()=>{this.ready=false;});
 }
 prepare(){try{
  const keys=this.metadata.frames.map(f=>{const c=document.createElement('canvas');c.width=160;c.height=320;const g=c.getContext('2d');const height=304,width=f.w/f.h*height;g.drawImage(this.image,f.x,f.y,f.w,f.h,(160-width)/2,8,width,height);return c;});
  for(let i=0;i<32;i++){const c=document.createElement('canvas');c.width=160;c.height=320;const g=c.getContext('2d'),left=Math.floor(i/2),right=(left+1)%16;
   g.drawImage(keys[left],0,0);if(i%2){g.globalCompositeOperation='copy';g.globalAlpha=.5;g.drawImage(keys[left],0,0);g.globalCompositeOperation='lighter';g.drawImage(keys[right],0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;}
   this.views.push(c);
   const head=document.createElement('canvas');head.width=160;head.height=320;const hg=head.getContext('2d');hg.drawImage(c,0,0);
   // Keep the reference face and hair, then isolate the exposed neck rather
   // than pasting a rectangular slice of the original hoodie under the chin.
   const neckX=80+Math.sin(i*Math.PI/16)*7,collar=hg.getImageData(0,88,160,25);
   let weight=0,weightedX=0;
   const skin=(r,v,b)=>r>v+14&&v>b+6&&r>b+26;
   for(let y=5;y<11;y++)for(let x=55;x<108;x++){const n=(y*160+x)*4;if(skin(...collar.data.slice(n,n+3))){const alpha=collar.data[n+3];weightedX+=x*alpha;weight+=alpha;}}
   const sourceX=weight?weightedX/weight:neckX;
   head.neckX=sourceX;
   for(let y=0;y<25;y++)for(let x=0;x<160;x++){
    const n=(y*160+x)*4,r=collar.data[n],v=collar.data[n+1],b=collar.data[n+2];
    if(y<7){if((r>v+5&&b>v-5)||Math.abs(x-sourceX)>23-y*.6)collar.data[n+3]=0;continue;}
    const t=(y-7)/18,cx=sourceX+(neckX-sourceX)*t,radius=18-11*t;
    if(!skin(r,v,b)||Math.abs(x-cx)>radius)collar.data[n+3]=0;
    else if(y>18)collar.data[n+3]*=(24-y)/6;
   }
   hg.putImageData(collar,0,88);
   this.heads.push(head);
   // Cache a torso/head mask once. Moving sleeves and hands are connected
   // geometry, so no rectangular strips of the torso swing with the arms.
   const body=document.createElement('canvas');body.width=160;body.height=320;
   const bg=body.getContext('2d'),side=Math.sin(i*Math.PI/16),profile=Math.abs(side),center=80+side*7;
   const points=[[0,0],[160,0],[160,96],[center+33-12*profile,96],[center+30-9*profile,124],[center+28-10*profile,163],[center+36-14*profile,191],[center+33-12*profile,208-7*profile],[center-33+12*profile,208-7*profile],[center-36+14*profile,191],[center-28+10*profile,163],[center-30+9*profile,124],[center-33+12*profile,96],[0,96]];
   bg.beginPath();points.forEach(([x,y],n)=>n?bg.lineTo(x,y):bg.moveTo(x,y));bg.closePath();bg.clip();bg.drawImage(c,0,0);this.bodies.push(body);
  }this.ready=true;
 }catch{this.ready=false;}}
 bodyFor(index,id){
  id=outfitId(id);if(id==='rose')return this.bodies[index];
  const key=id+index;if(!this.outfits[key]){const c=document.createElement('canvas');c.width=160;c.height=320;const g=c.getContext('2d');g.drawImage(this.bodies[index],0,0);const pixels=g.getImageData(0,0,160,320);tintClothes(pixels.data,id);g.putImageData(pixels,0,0);this.outfits[key]=c;}return this.outfits[key];
 }
 garmentFor(index,item,part){
  if((part==='top'&&item.style!=='hoodie')||(part==='bottom'&&item.style!=='shorts'))return null;
  const key=index+item.id+part;if(this.garments.has(key))return this.garments.get(key);
  const c=document.createElement('canvas');c.width=160;c.height=320;const g=c.getContext('2d');g.drawImage(this.bodies[index],0,0);
  const p=g.getImageData(0,0,160,320),rgb=[1,3,5].map(i=>parseInt(item.color.slice(i,i+2),16));
  for(let i=160*100*4;i<p.data.length;i+=4){const r=p.data[i],v=p.data[i+1],b=p.data[i+2];if(r>v+6&&b>v-8&&r>b*.9){const light=(r*.2126+v*.7152+b*.0722)/178;for(let channel=0;channel<3;channel++)p.data[i+channel]=Math.min(255,rgb[channel]*light);}}
  g.putImageData(p,0,0);if(part==='top'&&Math.cos(index*Math.PI/16)>.05)g.clearRect(80+Math.sin(index*Math.PI/16)*7-11,101,22,27);if(this.garments.size>=64)this.garments.delete(this.garments.keys().next().value);this.garments.set(key,c);return c;
 }
 draw(a,p,pose,t){
  if(p.changing){const g=a.g;a.shadow(p.x,p.y,16,3);a.line([[p.x-18,p.y],[p.x-18,p.y-67],[p.x+18,p.y-67],[p.x+18,p.y]],'#ac8c69',2);a.round(p.x-17,p.y-65,34,62,a.gradient(p.x,p.y-65,62,'#f5ccdc','#bd8ba8'),3);for(let i=-12;i<15;i+=7)a.line([[p.x+i,p.y-64],[p.x+i,p.y-5]],'#fff0df55',1);if(p.carryingLuna)a.bear(p.x+25,p.y,.45);return;}
  const items=p.clothes?clothingItems(restoreClothes(p.clothes,p.outfit)):null;
  const palette=items?fabric(items.top.color):OUTFITS[outfitId(p.outfit)].colors;
  const sleeve=items?(items.top.style==='tank'?'bare':items.top.style==='tee'||items.top.style==='dress'?'tee':'long'):'long';
  const poseSleeve=sleeve==='bare'?'#f2c1a0':items?.top.color||'#efa9c6';
  const activity=p.activity,carrying=p.carryingLuna===true;
  const g=a.g,angle=activity?.facing??(pose?0:p.facing??0),index=nearestFacing(angle);
  const blend=pose?0:p.motion??(p.walking?1:0),jog=isJogging(p.speed),rig=activityRig(p.gait,blend,jog,angle,activity,carrying&&!pose);
  paintActivityGround(a,p,activity,carrying);
  if(activity?.kind==='water'&&Math.cos(angle)<0)paintActivityEffects(a,p,rig,activity,angle,'stream');
  if(carrying&&!activity&&pose&&pose!=='hug')a.bear(p.x-12,p.y-1,.45);
  if(!this.ready){
   g.save();g.translate(p.x,p.y);g.scale(62/64,62/64);this.fallback.draw(a,{...p,x:0,y:0,facing:angle,walking:activity?false:p.walking},pose,t);g.restore();
   g.save();g.translate(p.x,p.y);g.scale(SCALE.character,SCALE.character);g.translate(-80,-312);paintHeldProp(a,rig,activity,carrying&&!pose,angle);g.restore();return;
  }
  a.shadow(p.x,p.y,9,2.8);g.save();g.translate(p.x,p.y);g.scale(SCALE.character,SCALE.character);g.translate(-80,-312);
  for(const leg of rig.legs)a.oval(leg.ground.x,leg.ground.y+11,7.5-leg.step.lift*1.5,1.7,leg.step.contact||blend<.05?'#4b42312b':'#4b423113');
  for(const leg of [...rig.legs].sort((a,b)=>a.hip.depth-b.hip.depth||a.foot.depth-b.foot.depth)){
   const covered=items&&['trousers','leggings'].includes(items.bottom.style);if(!covered)paintLeg(a,leg,26,items?.shoes.style!=='bare');if(items)paintClothingLeg(a,leg,items.bottom);paintShoe(a,leg.foot,angle,leg.step.roll,blend,items?.shoes);
  }
  // Fit shoulder caps to the rendered torso neckline. The torso artwork has
  // a fixed shoulder plane; projecting its arm caps above/below that plane
  // leaves floating shoulders and slipping straps in profile. Elbows, wrists
  // and hand/prop anchors keep their anatomical rig positions.
  const shoulderLine=rig.body.y-86*(rig.bodyAxis?.y??1);
  const fittedArms=rig.arms.map((arm,index)=>({...arm,index,shoulder:{...arm.shoulder,y:shoulderLine}}));
  const arms=[...fittedArms].sort((a,b)=>a.shoulder.depth-b.shoulder.depth);
  const behind=arm=>arm.shoulder.depth< -6||Math.cos(angle)<-.85;
  for(const arm of arms)if(behind(arm)){paintArm(a,arm,palette,sleeve);if(items)paintWristAccessory(a,arm,items.wrist,arm.index);}
  if(Math.cos(angle)<0)paintHeldProp(a,rig,activity,carrying&&!pose,angle);
  g.save();g.translate(rig.body.x,rig.body.y);
  if(rig.bodyAxis)g.transform(1,0,rig.bodyAxis.x,rig.bodyAxis.y,0,0);
  if(items){
   const axis=rig.bodyAxis||{x:0,y:1},shoulders=fittedArms.map(arm=>{const y=(arm.shoulder.y-rig.body.y)/axis.y;return {x:80+arm.shoulder.x-rig.body.x-axis.x*y,y:196+y};});
   g.translate(-80,-196);paintClothedBody(a,this.heads[index],angle,items,{top:this.garmentFor(index,items.top,'top'),bottom:this.garmentFor(index,items.bottom,'bottom')},shoulders);
  }else g.drawImage(this.bodyFor(index,p.outfit),-80,-196);g.restore();
  if(Math.cos(angle)>=0)paintHeldProp(a,rig,activity,carrying&&!pose,angle);
  for(const arm of arms)if(!behind(arm)){paintArm(a,arm,palette,sleeve);if(items)paintWristAccessory(a,arm,items.wrist,arm.index);}
  if(items)paintAccessories(a,rig,angle,items);
  g.restore();
  // Activity props use the same character scale and foot anchor as locomotion.
  g.save();g.translate(p.x,p.y);g.scale(62/76,62/76);
  if(pose==='hug'){a.bear(0,-23,.65);a.line([[-9,-37],[-6,-26],[-1,-27]],poseSleeve,3.5);a.line([[9,-37],[6,-26],[1,-27]],poseSleeve,3.5);}
  if(pose==='tea'){a.round(-5,-34,10,8,'#fff0dc',2);a.oval(0,-34,5,1.5,'#8f6e4c');}
  if(pose==='read'){a.round(-10,-34,20,10,'#6c9b89',1);a.round(-9,-33,18,8,'#fff0d3',1);a.line([[0,-33],[0,-25]],'#b9a783',.8);}
  if(pose==='warm'){a.line([[-10,-35],[-3,-30],[-2,-34]],poseSleeve,3.5);a.line([[10,-35],[3,-30],[2,-34]],poseSleeve,3.5);}
  g.restore();
 }
 effects(a,p){
  if(!p.activity)return;
  const activity=p.activity,angle=activity.facing??p.facing??0;
  const rig=activityRig(p.gait,0,isJogging(p.speed),angle,activity,p.carryingLuna===true);
  paintActivityEffects(a,p,rig,activity,angle,activity.kind==='water'&&Math.cos(angle)<0?'splash':'all');
 }
 portrait(canvas){if(!this.ready)return;const g=canvas.getContext('2d');g.clearRect(0,0,128,128);const gradient=g.createLinearGradient(0,0,128,128);gradient.addColorStop(0,'#fae4d2');gradient.addColorStop(1,'#e9b9cc');g.fillStyle=gradient;g.fillRect(0,0,128,128);g.drawImage(this.views[0],28,4,104,105,0,0,128,128);}
}
