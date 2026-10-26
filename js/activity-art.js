import {RIG,walkingRig,projectJoint,solveChain} from './skeleton.js';
import {SCALE} from './gait.js';

const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const t=clamp(n);return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;
const pointMix=(a,b,t)=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),z:mix(a.z,b.z,t)});
const unit=v=>{const d=Math.hypot(v.x,v.y,v.z)||1;return {x:v.x/d,y:v.y/d,z:v.z/d};};
const projected=(local,angle)=>Object.fromEntries(Object.entries(local).map(([key,value])=>[key,projectJoint(value,angle)]));
export function activityEnvelope(progress){return smooth(progress/.2)*(1-smooth((progress-.8)/.2));}

// Reach the wrist with a fixed upper arm and forearm. The elbow pole blends
// from the idle elbow to an outward bend so entering an activity cannot pop.
function reachArm(base,shoulder,wristTarget,handDirection,weight,angle,sign){
 const relative=p=>({x:p.x-base.shoulder.x,y:p.y-base.shoulder.y,z:p.z-base.shoulder.z});
 const oldWrist=relative(base.wrist),oldElbow=relative(base.elbow);
 const restingWrist={x:shoulder.x+oldWrist.x,y:shoulder.y+oldWrist.y,z:shoulder.z+oldWrist.z};
 const target=pointMix(restingWrist,wristTarget,weight),delta={x:target.x-shoulder.x,y:target.y-shoulder.y,z:target.z-shoulder.z};
 const raw=Math.hypot(delta.x,delta.y,delta.z),length=Math.max(RIG.upperArm-RIG.forearm+.001,Math.min(RIG.upperArm+RIG.forearm-.001,raw));
 const axis=unit(delta),pole=pointMix(oldElbow,{x:sign*32,y:20,z:-8},weight);
 const dot=axis.x*pole.x+axis.y*pole.y+axis.z*pole.z;
 const bend=unit({x:pole.x-axis.x*dot,y:pole.y-axis.y*dot,z:pole.z-axis.z*dot});
 const along=(RIG.upperArm**2+length**2-RIG.forearm**2)/(2*length),out=Math.sqrt(Math.max(0,RIG.upperArm**2-along**2));
 const elbow={},wrist={};for(const key of ['x','y','z']){elbow[key]=shoulder[key]+axis[key]*along+bend[key]*out;wrist[key]=shoulder[key]+axis[key]*length;}
 const oldHand=unit({x:base.hand.x-base.wrist.x,y:base.hand.y-base.wrist.y,z:base.hand.z-base.wrist.z});
 const direction=unit(pointMix(oldHand,unit(handDirection),weight));
 const hand={x:wrist.x+direction.x*RIG.hand,y:wrist.y+direction.y*RIG.hand,z:wrist.z+direction.z*RIG.hand};
 const local={shoulder,elbow,wrist,hand};
 return {...projected(local,angle),local,clamped:Math.abs(raw-length)>.002};
}

export function activityRig(phase,blend,jog,angle,activity=null,carrying=false){
 const rig=walkingRig(phase,activity?0:blend,jog,angle);
 const progress=clamp(activity?.progress??0),weight=activity?activityEnvelope(progress):carrying?1:0;
 if(!weight)return rig;
 const kind=activity?.kind,low=kind==='plant'||kind==='harvest';
 const drop=(low?54:kind==='water'?3:0)*weight,bow=(low?12:kind==='water'?3:0)*weight,lean=(low?22:kind==='water'?7:0)*weight;
 const hip={x:(rig.legs[0].local.hip.x+rig.legs[1].local.hip.x)/2,y:rig.legs[0].local.hip.y+drop,z:-8*weight*(low?1:0)};
 if(activity)rig.legs=rig.legs.map(leg=>{
  const local=solveChain({x:leg.local.hip.x,y:hip.y,z:hip.z},leg.local.foot);
  return {...leg,...projected({hip:local.hip,knee:local.knee,foot:local.foot},angle),local};
 });
 rig.body=projectJoint(hip,angle);
 rig.arms=rig.arms.map((arm,i)=>{
  const sign=i?1:-1,shoulder={...arm.local.shoulder,y:arm.local.shoulder.y+drop+bow,z:arm.local.shoulder.z+hip.z+lean};
  let wrist,direction;
  if(low){
   // The reaching hand opens over the bed while the other steadies the pouch.
   wrist=i?{x:sign*14+hip.x,y:shoulder.y+67,z:shoulder.z+30}:{x:-22+hip.x,y:shoulder.y+51,z:shoulder.z+28};
   direction={x:i?-.2:.2,y:.8,z:.5};
  }else{
   wrist={x:hip.x+(kind==='water'?(i?36:13):sign*16),y:shoulder.y+(kind==='water'?50:48),z:shoulder.z+(kind==='water'?43:46)};
   direction={x:-sign*.55,y:.3,z:.78};
  }
  return reachArm(arm.local,shoulder,wrist,direction,weight,angle,sign);
 });
 if(activity)rig.bodyAxis={x:-lean*Math.sin(angle)/86,y:1-(bow+lean*Math.cos(angle)*RIG.depth)/86};
 rig.prop=projectJoint({x:hip.x+(kind==='water'?31:0),y:hip.y+(kind==='water'?-18:6),z:kind==='water'?48:44},angle);
 rig.actionWeight=weight;rig.progress=progress;
 return rig;
}

function berry(a,x,y,size=1){
 a.oval(x,y,3*size,4*size,'#d8667b');a.line([[x-2*size,y-3*size],[x,y-4*size],[x+2*size,y-3*size]],'#6e9e64',size);
 a.oval(x-size,y-size,.5*size,.7*size,'#ffe4bc');a.oval(x+size,y+size,.5*size,.7*size,'#ffe4bc');
}
function basket(a,x,y,filled){
 a.shadow(x,y+1,9,2);a.round(x-8,y-10,16,11,a.gradient(x,y-10,12,'#dfb782','#a47a51'),2);
 for(let i=-5;i<=5;i+=5)a.line([[x+i,y-9],[x+i,y]],'#efd4a5',.7);
 a.line([[x-6,y-10],[x-5,y-15],[x+5,y-15],[x+6,y-10]],'#a98059',1.5);
 if(filled){berry(a,x-3,y-11,.8);berry(a,x+2,y-12,.8);}
}

// Props in source-sprite coordinates, drawn between torso and near hands.
export function paintHeldProp(a,rig,activity,carrying,angle){
 if(!rig.prop)return;
 const {x,y}=rig.prop,g=a.g;
 if(activity?.kind==='water'){
  g.save();g.globalAlpha=rig.actionWeight;g.translate(x,y);g.rotate(Math.sin(angle)*.18*rig.actionWeight);
  a.oval(-13,-14,11,16,'#638b8e');a.oval(-13,-14,6,11,'#d8e6d7');
  a.round(-17,-21,35,29,a.gradient(-17,-21,32,'#b9d9cd','#6a9fa0'),7);
  a.oval(0,-21,17,5,'#d7e8d6');a.oval(0,-21,11,3,'#668d88');
  const dx=Math.sin(angle)*33,dy=Math.cos(angle)*13;
  a.line([[11,0],[dx,dy-8],[dx+Math.sin(angle)*9,dy-9]],'#84b2ad',7);
  a.oval(dx+Math.sin(angle)*9,dy-9,5,3,'#d6e5d4');
  a.flower(0,-5,'#f3c1d0');g.restore();
 }else if(carrying&&!activity)a.bear(x,y,2.2);
}

function sourceToWorld(p,point){return {x:p.x+(point.x-80)*SCALE.character,y:p.y+(point.y-312)*SCALE.character};}

export function waterSpout(rig,angle){
 const rotation=Math.sin(angle)*.18*rig.actionWeight,x=Math.sin(angle)*42,y=Math.cos(angle)*13-9;
 return {x:rig.prop.x+x*Math.cos(rotation)-y*Math.sin(rotation),y:rig.prop.y+x*Math.sin(rotation)+y*Math.cos(rotation)};
}

// Ground props share Stella's depth pass; particles get a separate overlay pass.
export function paintActivityGround(a,p,activity,carrying){
 if(!activity)return;
 if(carrying)a.bear(p.x-12,p.y-1,.45);
 if(activity.kind==='harvest')basket(a,p.x+13,p.y+1,activity.progress>.7);
}

// Draw after the world depth list so a bed cannot cover the stream or a seed
// just because Stella is standing on its north side. The target stays fixed.
export function paintActivityEffects(a,p,rig,activity,angle){
 if(!activity)return;
 const q=clamp(activity.progress),weight=activityEnvelope(q),kind=activity.kind;
 const target=activity.target||{x:p.x+Math.sin(angle)*18,y:p.y+Math.cos(angle)*18};
 const hand=sourceToWorld(p,rig.arms[1].hand),g=a.g;
 if(kind==='water'&&rig.prop&&q>.24&&q<.79){
  const spout=sourceToWorld(p,waterSpout(rig,angle));
  g.save();g.globalAlpha=weight*.8;
  for(let i=0;i<9;i++){
   const t=((q*4+i/9)%1),x=mix(spout.x,target.x,t),y=mix(spout.y,target.y,t)-Math.sin(Math.PI*t)*3;
   a.line([[x,y-1.5],[x+.2,y+1]],i%2?'#c5eff4':'#8bcedd',1.2);
  }
  for(let i=0;i<3;i++)a.oval(target.x+(i-1)*3,target.y+Math.sin(q*35+i)*1.5,2,.6,'#c5e5e699');
  g.restore();
 }
 if(kind==='plant'&&q>.4&&q<.72){
  const t=smooth((q-.4)/.32),x=mix(hand.x,target.x,t),y=mix(hand.y,target.y,t);
  a.oval(x,y,1.1,1.5,'#ddbf84');
  if(t>.8)for(let i=0;i<4;i++)a.oval(target.x+(i-1.5)*2,target.y+Math.sin(i*2),.8,.6,'#ad835e');
 }
 if(kind==='harvest'&&q>.28&&q<.72){
  const t=smooth((q-.28)/.44),mid={x:hand.x,y:hand.y-4},end={x:p.x+13,y:p.y-11};
  const x=(1-t)**2*target.x+2*(1-t)*t*mid.x+t*t*end.x;
  const y=(1-t)**2*target.y+2*(1-t)*t*mid.y+t*t*end.y;
  berry(a,x,y,.9);
 }
}
