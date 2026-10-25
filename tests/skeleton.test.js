import test from 'node:test';
import assert from 'node:assert/strict';
import {RIG, walkingRig} from '../js/skeleton.js';

const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const close=(actual,expected,message)=>assert.ok(Math.abs(actual-expected)<1e-8,`${message}: ${actual} vs ${expected}`);
const joints=rig=>[...rig.legs.flatMap(l=>[l.hip,l.knee,l.foot]),...rig.arms.flatMap(a=>[a.shoulder,a.elbow,a.wrist,a.hand]),rig.body];

test('anatomical bones keep their lengths and ankles remain reachable throughout walking and jogging',()=>{
 for(const jog of [false,true])for(const amount of [0,.1,.5,1])for(let frame=0;frame<128;frame++)for(let direction=0;direction<32;direction++){
  const rig=walkingRig(frame/128,amount,jog,direction*Math.PI/16);
  for(const leg of rig.legs){
   const {hip,knee,foot,clamped}=leg.local;
   close(distance(hip,knee),RIG.upperLeg,'thigh length');
   close(distance(knee,foot),RIG.lowerLeg,'calf length');
   assert.equal(clamped,false,'the intended ankle target must be reachable');
   assert.ok(foot.y<=300+1e-8,'feet cannot penetrate the floor');
   if(leg.step.contact)close(foot.y,300,'support ankle height');
  }
  for(const arm of rig.arms){
   const {shoulder,elbow,wrist,hand}=arm.local;
   close(distance(shoulder,elbow),RIG.upperArm,'upper arm length');
   close(distance(elbow,wrist),RIG.forearm,'forearm length');
   close(distance(wrist,hand),RIG.hand,'hand attachment');
  }
  for(const joint of joints(rig))assert.ok(Number.isFinite(joint.x)&&Number.isFinite(joint.y)&&Number.isFinite(joint.depth));
 }
});

test('left and right hips and shoulders rotate anatomically through side and back views',()=>{
 const front=walkingRig(0,0,false,0),side=walkingRig(0,0,false,Math.PI/2),back=walkingRig(0,0,false,Math.PI);
 for(const [limbs,joint] of [['legs','hip'],['arms','shoulder']]){
  assert.ok(front[limbs][0][joint].x<front[limbs][1][joint].x);
  assert.ok(back[limbs][0][joint].x>back[limbs][1][joint].x,'anatomical sides must exchange screen sides when facing away');
  close(side[limbs][0][joint].x,side[limbs][1][joint].x,'hips/shoulders overlap horizontally in profile');
  assert.ok(side[limbs][0][joint].depth>side[limbs][1][joint].depth,'profile limbs still have distinct near/far depth');
 }
});

test('advancing a leg swings the arm on that side backward with a relaxed elbow',()=>{
 for(const jog of [false,true])for(const amount of [.2,.5,1]){
  const ahead=walkingRig(0,amount,jog),behind=walkingRig(jog?.48:.62,amount,jog);
  assert.ok(ahead.legs[0].local.foot.z>behind.legs[0].local.foot.z);
  for(const joint of ['elbow','wrist','hand']){
   const forwardArm=ahead.arms[0].local[joint].z-ahead.arms[0].local.shoulder.z;
   const backArm=behind.arms[0].local[joint].z-behind.arms[0].local.shoulder.z;
   assert.ok(forwardArm<backArm,`${joint} must counter-swing against the same-side leg`);
  }
 }
});

test('front and back views retain visible foot and arm movement',()=>{
 for(const angle of [0,Math.PI]){
  const poses=Array.from({length:128},(_,i)=>walkingRig(i/128,1,false,angle));
  for(const [limbs,joint,minRange] of [['legs','foot',25],['arms','hand',15]]){
   for(let i=0;i<2;i++){
    const values=poses.map(r=>r[limbs][i][joint].y);
    assert.ok(Math.max(...values)-Math.min(...values)>minRange,`${limbs} must visibly advance in a frontal projection`);
   }
  }
 }
});

test('joints remain continuous through ground contact, support transfers and direction wrapping',()=>{
 const epsilon=1e-6;
 for(const jog of [false,true])for(const amount of [.1,.5,1]){
  const stance=jog?.48:.62;
  for(const phase of [0,.5,stance,stance-.5,stance/2,(stance+1)/2])for(let direction=0;direction<32;direction++){
   const angle=direction*Math.PI/16;
   const before=joints(walkingRig(phase-epsilon,amount,jog,angle)),after=joints(walkingRig(phase+epsilon,amount,jog,angle));
   before.forEach((point,i)=>assert.ok(Math.hypot(point.x-after[i].x,point.y-after[i].y)<.01,'phase boundary must not snap a joint'));
  }
  const before=joints(walkingRig(.81,amount,jog,-epsilon)),after=joints(walkingRig(.81,amount,jog,2*Math.PI+epsilon));
  before.forEach((point,i)=>assert.ok(Math.hypot(point.x-after[i].x,point.y-after[i].y)<.001,'direction seam must not swap or snap limbs'));
 }
});

test('hand and ankle velocities change smoothly at support and neutral-swing transitions',()=>{
 const epsilon=1e-6;
 for(const jog of [false,true]){
  const stance=jog?.48:.62;
  for(const phase of [0,.5,stance,stance-.5,stance/2,(stance+1)/2]){
   const before=joints(walkingRig(phase-epsilon,1,jog,Math.PI/2)),at=joints(walkingRig(phase,1,jog,Math.PI/2)),after=joints(walkingRig(phase+epsilon,1,jog,Math.PI/2));
   at.forEach((point,i)=>{for(const axis of ['x','y']){
    const incoming=(point[axis]-before[i][axis])/epsilon,outgoing=(after[i][axis]-point[axis])/epsilon;
    assert.ok(Math.abs(incoming-outgoing)<.1,`joint ${i} ${axis} velocity jumps at phase ${phase}: ${incoming} vs ${outgoing}`);
   }});
  }
 }
});

test('standing has a stable pose regardless of the last gait phase',()=>{
 for(const jog of [false,true])for(let direction=0;direction<32;direction++){
  const angle=direction*Math.PI/16,standing=joints(walkingRig(0,0,jog,angle));
  for(const phase of [.12,.31,.62,.81,.99]){
   const stopped=joints(walkingRig(phase,0,jog,angle));
   standing.forEach((point,i)=>{close(stopped[i].x,point.x,'idle joint x');close(stopped[i].y,point.y,'idle joint y');});
  }
 }
});
