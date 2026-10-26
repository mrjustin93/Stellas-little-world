import test from 'node:test';
import assert from 'node:assert/strict';
import {activityRig,activityEnvelope,waterSpout} from '../js/activity-art.js';
import {walkingRig,RIG} from '../js/skeleton.js';

const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} vs ${b}`);

test('farming and carrying keep connected fixed-length limbs in every direction',()=>{
 for(const kind of ['plant','water','harvest','carry'])for(let direction=0;direction<32;direction++)for(let frame=0;frame<=60;frame++){
  const q=frame/60,activity=kind==='carry'?null:{kind,progress:q};
  const rig=activityRig(q,kind==='carry'?1:0,false,direction*Math.PI/16,activity,kind==='carry');
  for(const leg of rig.legs){
   const l=leg.local;assert.equal(l.clamped,false);close(length(l.hip,l.knee),RIG.upperLeg);close(length(l.knee,l.foot),RIG.lowerLeg);
   if(activity)close(l.foot.y,300);
  }
  for(const arm of rig.arms){
   const l=arm.local;assert.ok(!arm.clamped);close(length(l.shoulder,l.elbow),RIG.upperArm);close(length(l.elbow,l.wrist),RIG.forearm);close(length(l.wrist,l.hand),RIG.hand);
   for(const point of [arm.shoulder,arm.elbow,arm.wrist,arm.hand])assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y));
  }
 }
});

test('planting and harvesting crouch and reach while watering remains upright',()=>{
 const standing=walkingRig(0,0,false,Math.PI/2);
 for(const kind of ['plant','harvest']){
  const rig=activityRig(0,0,false,Math.PI/2,{kind,progress:.5});
  assert.ok(rig.body.y-standing.body.y>40,'hips should lower visibly into a crouch');
  assert.ok(rig.arms[1].hand.x>standing.arms[1].hand.x+35,'working hand should reach forward');
 }
 const water=activityRig(0,0,false,0,{kind:'water',progress:.5});
 assert.ok(Math.abs(water.body.y-standing.body.y)<6);
 assert.ok(water.prop&&water.arms.every(a=>a.local.hand.z>30),'hands hold the can in front');
});

test('activity entry and exit ease into the standing pose without moving feet',()=>{
 for(const kind of ['plant','water','harvest'])for(const angle of [0,.7,Math.PI,5.8]){
  const idle=walkingRig(.31,0,false,angle);
  for(const progress of [0,1])assert.deepEqual(activityRig(.31,0,false,angle,{kind,progress}),idle);
  for(const progress of [.00001,.99999]){
   const rig=activityRig(.31,0,false,angle,{kind,progress});
   for(let i=0;i<2;i++)for(const key of ['shoulder','elbow','wrist','hand'])assert.ok(Math.hypot(rig.arms[i][key].x-idle.arms[i][key].x,rig.arms[i][key].y-idle.arms[i][key].y)<.001);
  }
 }
 close(activityEnvelope(0),0);close(activityEnvelope(1),0);assert.equal(activityEnvelope(.5),1);
});

test('carrying Luna preserves the walking legs and faces the held bear with the body',()=>{
 for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
  const walk=walkingRig(.4,.8,false,angle),carry=activityRig(.4,.8,false,angle,null,true);
  assert.deepEqual(carry.legs,walk.legs,'carrying should preserve the improved gait');
  assert.ok(carry.prop&&carry.arms.every(a=>a.local.hand.z>30));
  if(angle===0)assert.ok(carry.prop.depth>0);
  if(angle===Math.PI)assert.ok(carry.prop.depth<0);
 }
});

test('the watering can sits beside the torso and its stream starts at the tilted nozzle',()=>{
 for(const angle of [0,Math.PI]){
  const rig=activityRig(0,0,false,angle,{kind:'water',progress:.5});
  assert.ok(Math.abs(rig.prop.x-rig.body.x)>=30,'the side of the can remains visible beside the torso');
  for(const arm of rig.arms)assert.ok(!arm.clamped,'both hands can reach the shifted can');
 }
 const angle=Math.PI/3,rig=activityRig(0,0,false,angle,{kind:'water',progress:.5}),tip=waterSpout(rig,angle);
 const rotation=Math.sin(angle)*.18,x=Math.sin(angle)*42,y=Math.cos(angle)*13-9;
 close(tip.x-rig.prop.x,x*Math.cos(rotation)-y*Math.sin(rotation));
 close(tip.y-rig.prop.y,x*Math.sin(rotation)+y*Math.cos(rotation));
});
