import {gaitPose} from './gait.js';

// Anatomical coordinates: x = left/right, y = down, z = forward.
// Rotate the whole skeleton before projecting. Side views overlap the hips;
// front views retain the depth of a step instead of turning knees sideways.
export const RIG={upperLeg:56,lowerLeg:48,upperArm:46,forearm:38,hand:12,depth:.48};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
export function projectJoint(p,angle){
 const side=Math.sin(angle),front=Math.cos(angle),depth=p.z*front-p.x*side;
 return {x:80+p.x*front+p.z*side,y:p.y+depth*RIG.depth,depth};
}
export function solveChain(hip,target,upper=RIG.upperLeg,lower=RIG.lowerLeg){
 const raw=distance(hip,target),length=Math.max(Math.abs(upper-lower)+.001,Math.min(upper+lower-.001,raw));
 const axis=raw>.00001?{x:(target.x-hip.x)/raw,y:(target.y-hip.y)/raw,z:(target.z-hip.z)/raw}:{x:0,y:1,z:0};
 // Forward is the knee pole. Orthogonalizing it keeps the bend anatomical
 // even when the pelvis shifts sideways over the supporting leg.
 let pole={x:-axis.x*axis.z,y:-axis.y*axis.z,z:1-axis.z*axis.z};
 let n=Math.hypot(pole.x,pole.y,pole.z);
 if(n<.00001){pole={x:1,y:0,z:0};n=1;}
 const along=(upper*upper+length*length-lower*lower)/(2*length),out=Math.sqrt(Math.max(0,upper*upper-along*along));
 const knee={},foot={};
 for(const key of ['x','y','z']){knee[key]=hip[key]+axis[key]*along+pole[key]/n*out;foot[key]=hip[key]+axis[key]*length;}
 return {hip,knee,foot,clamped:Math.abs(raw-length)>.002};
}
function armBone(start,length,swing,lateral){
 const span=Math.sqrt(length*length-lateral*lateral);
 return {x:start.x+lateral,y:start.y+Math.cos(swing)*span,z:start.z+Math.sin(swing)*span};
}
export function walkingRig(phase,amount=1,jog=false,angle=0){
 const blend=Math.max(0,Math.min(1,amount)),cycle=gaitPose(phase,blend,jog);
 const reach=(jog?40:34)*blend,clearance=(jog?27:19)*blend;
 const sway=-Math.sin(phase*Math.PI*2)*1.5*blend;
 const steps=[cycle.left,cycle.right];
 const targets=steps.map((step,i)=>({x:(i?1:-1)*17,y:300-step.lift*clearance,z:step.forward*reach}));
 // Choose a pelvis height both ankles can reach. This raises the hip over
 // the support foot at midstance and lowers it at the longer contact poses.
 // A smooth maximum prevents a pop when support transfers between legs.
 const extension=103.9-1.7*blend;
 const heights=targets.map(p=>p.y-Math.sqrt(extension*extension-p.z*p.z-sway*sway));
 const hipY=(heights[0]+heights[1]+Math.hypot(heights[0]-heights[1],.35))/2;
 const legs=targets.map((target,i)=>{
  const local=solveChain({x:target.x+sway,y:hipY,z:0},target);
  return {...Object.fromEntries(['hip','knee','foot'].map(k=>[k,projectJoint(local[k],angle)])),local,step:steps[i],ground:projectJoint({...target,y:300},angle)};
 });
 const arms=steps.map((step,i)=>{
  const sign=i?1:-1,shoulder={x:sign*31+sway,y:110+hipY-196,z:-5};
  // The arm on the advancing leg's side swings back. A relaxed elbow stays
  // flexed throughout the cycle; the forearm follows the upper arm.
  const swing=-.10-step.forward*(jog?.48:.34)*blend;
  const recovery=(Math.hypot(step.forward,.12)-step.forward)*.5;
  const flex=.23+(jog?.32:.10)*blend+recovery*.12*blend;
  const elbow=armBone(shoulder,RIG.upperArm,swing,sign*5);
  const wrist=armBone(elbow,RIG.forearm,swing+flex,sign*2);
  const hand=armBone(wrist,RIG.hand,swing+flex,0),local={shoulder,elbow,wrist,hand};
  return {...Object.fromEntries(Object.entries(local).map(([k,p])=>[k,projectJoint(p,angle)])),local};
 });
 return {legs,arms,body:projectJoint({x:sway,y:hipY,z:0},angle),blend};
}
