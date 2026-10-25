// Sixteen rendered key views, aligned using inspected silhouette bounds.
// Thirty-two facing steps blend the key views; gait is animated at runtime.
import {StellaAtlas} from './stella.js';
import {SCALE,gaitPose,isJogging} from './gait.js';
import {projectedLeg,nearestFacing} from './locomotion.js';
import {paintLeg} from './limbs.js';
export class RenderedStella {
 constructor(){this.fallback=new StellaAtlas();this.ready=false;this.views=[];this.steps=32;this.keyViews=16;this.image=new Image();this.image.onerror=()=>{this.ready=false;};this.image.onload=()=>{this.prepare();};
  fetch(new URL('../assets/characters/stella-rendered-v06.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Missing Stella metadata');return r.json();}).then(data=>{if(data.frames?.length!==16)throw Error('Invalid Stella metadata');this.metadata=data;this.image.src=new URL('../assets/characters/stella-rendered-v06.png',import.meta.url).href;}).catch(()=>{this.ready=false;});
 }
 prepare(){try{
  const keys=this.metadata.frames.map(f=>{const c=document.createElement('canvas');c.width=160;c.height=320;const g=c.getContext('2d');const height=304,width=f.w/f.h*height;g.drawImage(this.image,f.x,f.y,f.w,f.h,(160-width)/2,8,width,height);return c;});
  for(let i=0;i<32;i++){const c=document.createElement('canvas');c.width=160;c.height=320;const g=c.getContext('2d'),left=Math.floor(i/2),right=(left+1)%16;
   g.drawImage(keys[left],0,0);if(i%2){g.globalCompositeOperation='copy';g.globalAlpha=.5;g.drawImage(keys[left],0,0);g.globalCompositeOperation='lighter';g.drawImage(keys[right],0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;}
   this.views.push(c);
  }this.ready=true;
 }catch{this.ready=false;}}
 draw(a,p,pose,t){
  if(!this.ready){a.g.save();a.g.translate(p.x,p.y);a.g.scale(62/64,62/64);this.fallback.draw(a,{...p,x:0,y:0},pose,t);a.g.restore();return;}
  const g=a.g,angle=pose?0:p.facing??0,index=nearestFacing(angle),im=this.views[index];
  const blend=pose?0:p.motion??(p.walking?1:0),jog=isJogging(p.speed),cycle=gaitPose(p.gait,blend,jog),side=Math.sin(angle),front=Math.cos(angle);
  const sourceWidth=this.metadata.frames[Math.floor(index/2)].w/this.metadata.frames[Math.floor(index/2)].h*304;
  const cutL=80-sourceWidth*.235,cutR=80+sourceWidth*.235;
  a.shadow(p.x,p.y,9,2.8);g.save();g.translate(p.x,p.y);g.scale(SCALE.character,SCALE.character);g.translate(-80,-312);
  const drawRect=(x,y,w,h)=>g.drawImage(im,x,y,w,h,x,y,w,h);
  const bob=(jog?12:8)*blend-cycle.bob/SCALE.character;
  const leg=(half,step)=>{
   const sign=half?1:-1,hipX=80+sign*sourceWidth*.125;
   const rig=projectedLeg(hipX,step,angle,blend,jog,bob,cycle.sway/SCALE.character);
   const grounded=projectedLeg(hipX,{...step,lift:0},angle,blend,jog,bob);
   a.oval(grounded.foot.x,grounded.foot.y+12,9-step.lift*2,2,step.contact||blend<.05?'#4b42312b':'#4b423113');
   paintLeg(a,rig,Math.min(25,Math.max(18,sourceWidth*.18)));
   g.save();g.translate(rig.foot.x,rig.foot.y);g.rotate(step.roll*side*blend);g.translate(-hipX,-300);drawRect(half*80,280,80,40);g.restore();
  };
  const far=side>=0?0:1;leg(far,far?cycle.right:cycle.left);leg(1-far,far?cycle.left:cycle.right);
  // Rigid clipped body preserves face detail; arms rotate from shoulders/elbows.
  g.save();g.translate(80+cycle.sway/SCALE.character,196+bob);g.rotate(side*cycle.lean);g.translate(-80,-196);
  g.save();g.beginPath();g.rect(0,0,160,196);g.rect(0,100,cutL,96);g.rect(cutR,100,160-cutR,96);g.clip('evenodd');g.drawImage(im,0,0);g.restore();
  for(const half of [0,1]){
   const sign=half?1:-1,x=half?cutR:0,w=half?160-cutR:cutL,shoulder=half?cutR-2:cutL+2,elbow=half?cutR+6:cutL-6;
   const step=half?cycle.right:cycle.left,swing=-step.forward*blend;
   g.save();g.translate(shoulder,108);g.rotate(side*swing*(jog?.28:.18));g.translate(-shoulder,-108);
   drawRect(x,100,w,62);
   g.translate(elbow,160);g.rotate(side*Math.max(0,swing)*(jog?.2:.1));g.translate(-elbow,-160-front*swing*3);
   drawRect(x,160,w,46);g.restore();
  }
  g.restore();g.restore();
  // Activity props use the same character scale and foot anchor as locomotion.
  g.save();g.translate(p.x,p.y);g.scale(62/76,62/76);
  if(pose==='hug'){a.bear(0,-23,.65);a.line([[-9,-37],[-6,-26],[-1,-27]],'#efa9c6',3.5);a.line([[9,-37],[6,-26],[1,-27]],'#efa9c6',3.5);}
  if(pose==='tea'){a.round(-5,-34,10,8,'#fff0dc',2);a.oval(0,-34,5,1.5,'#8f6e4c');}
  if(pose==='read'){a.round(-10,-34,20,10,'#6c9b89',1);a.round(-9,-33,18,8,'#fff0d3',1);a.line([[0,-33],[0,-25]],'#b9a783',.8);}
  if(pose==='warm'){a.line([[-10,-35],[-3,-30],[-2,-34]],'#efa9c6',3.5);a.line([[10,-35],[3,-30],[2,-34]],'#efa9c6',3.5);}
  g.restore();
 }
 portrait(canvas){if(!this.ready)return;const g=canvas.getContext('2d');g.clearRect(0,0,128,128);const gradient=g.createLinearGradient(0,0,128,128);gradient.addColorStop(0,'#fae4d2');gradient.addColorStop(1,'#e9b9cc');g.fillStyle=gradient;g.fillRect(0,0,128,128);g.drawImage(this.views[0],28,4,104,105,0,0,128,128);}
}
