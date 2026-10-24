// Sixteen rendered key views, aligned using inspected silhouette bounds.
// Thirty-two facing steps blend the key views; gait is animated at runtime.
import {StellaAtlas} from './stella.js';
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
 draw(a,p,pose,t){if(!this.ready){this.fallback.draw(a,p,pose,t);return;}
  const g=a.g,angle=pose?0:p.facing??0,index=(Math.round(angle/(Math.PI/16))%32+32)%32,im=this.views[index],walking=p.walking&&!pose;
  a.shadow(p.x,p.y,12,3.5);g.save();g.translate(p.x,p.y);
  const scale=.25,phase=p.gait*Math.PI*2,split=202,bob=walking?Math.cos(phase*2)*.45:Math.sin(t*1.8)*.18;
  // The upper body stays rigid, preserving the detailed face and hoodie.
  g.drawImage(im,0,0,160,split,-20,-78+bob,40,split*scale);
  for(let half=0;half<2;half++)for(let y=split;y<320;y+=6){const height=Math.min(6,320-y),weight=(y-split)/(320-split),sign=half?1:-1,step=walking?Math.sin(phase)*sign:0,lift=walking?Math.max(0,Math.cos(phase)*sign)*1.2:0;
   const dx=Math.sin(angle)*step*weight*1.6,dy=Math.cos(angle)*step*weight*1.2-lift*weight;
   g.drawImage(im,half*80,y,80,height,-20+half*20+dx,-78+y*scale+dy+((1-weight)*bob),20,height*scale+.08);
  }
  if(pose==='hug'){a.bear(0,-23,.65);a.line([[-9,-37],[-6,-26],[-1,-27]],'#efa9c6',3.5);a.line([[9,-37],[6,-26],[1,-27]],'#efa9c6',3.5);}
  if(pose==='tea'){a.round(-5,-34,10,8,'#fff0dc',2);a.oval(0,-34,5,1.5,'#8f6e4c');}
  if(pose==='read'){a.round(-10,-34,20,10,'#6c9b89',1);a.round(-9,-33,18,8,'#fff0d3',1);a.line([[0,-33],[0,-25]],'#b9a783',.8);}
  if(pose==='warm'){a.line([[-10,-35],[-3,-30],[-2,-34]],'#efa9c6',3.5);a.line([[10,-35],[3,-30],[2,-34]],'#efa9c6',3.5);}
  g.restore();
 }
 portrait(canvas){if(!this.ready)return;const g=canvas.getContext('2d');g.clearRect(0,0,128,128);const gradient=g.createLinearGradient(0,0,128,128);gradient.addColorStop(0,'#fae4d2');gradient.addColorStop(1,'#e9b9cc');g.fillStyle=gradient;g.fillRect(0,0,128,128);g.drawImage(this.views[0],28,4,104,105,0,0,128,128);}
}
