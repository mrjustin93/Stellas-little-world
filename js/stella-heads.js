// Original, reference-guided head artwork. Individual crop and neck anchors
// avoid treating a concept sheet as an animation-ready grid.
export const HEAD_LAYOUT={crown:34,chin:94,accessoryScale:.67,accessoryPivotY:100};

export class ReferenceHeads {
 constructor(){
  this.ready=false;this.failed=false;this.views=[];
  this.loading=this.load().catch(()=>{this.failed=true;});
 }
 async load(){
  const response=await fetch(new URL('../assets/characters/stella-heads-v19.json',import.meta.url));
  if(!response.ok)throw Error('Missing head metadata');
  const data=await response.json();
  if(data.frames?.length!==8||data.frames.some(f=>!['x','y','w','h','chinY','neckX'].every(k=>Number.isFinite(f[k]))||f.chinY<=0||f.w<=0||f.h<=0))throw Error('Invalid head metadata');
  const image=new Image();
  await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=new URL('../assets/characters/stella-heads-v19.png',import.meta.url).href;});
  // Keep eight clean facial views. The rig still turns through 32 directions;
  // aligning the neck at every step avoids double eyes from portrait blending.
  for(let i=0;i<32;i++){
   const frame=data.frames[Math.round(i/4)%8],angle=i*Math.PI/16;
   const c=document.createElement('canvas');c.width=160;c.height=320;
   const g=c.getContext('2d'),scale=(HEAD_LAYOUT.chin-HEAD_LAYOUT.crown)/frame.chinY;
   const nx=80+Math.sin(angle)*7;
   g.drawImage(image,frame.x,frame.y,frame.w,frame.h,nx-frame.neckX*scale,HEAD_LAYOUT.crown,frame.w*scale,frame.h*scale);
   const pixels=g.getImageData(0,0,160,120);
   for(let n=3;n<pixels.data.length;n+=4)if(pixels.data[n]<(data.alphaCutoff??12))pixels.data[n]=0;
   g.putImageData(pixels,0,0);c.neckX=nx;c.referenceHead=true;this.views.push(c);
  }
  this.ready=true;
 }
}
