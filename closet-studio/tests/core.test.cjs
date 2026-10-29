const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const assets=fs.existsSync(path.join(__dirname,'../dist/core.js'))?'../dist/':'../';
const {motion,advance,setTarget,allowed,obstacles}=require(assets+'core.js');
test('Stella walks toward a destination and stops without overshooting',()=>{
 const m=motion();assert(setTarget(m,1.2,1.8));for(let i=0;i<500;i++)advance(m,1/60);
 assert(Math.hypot(m.x-1.2,m.z-1.8)<.05);assert(!m.walking);assert.equal(m.target,null);assert(m.distance>1);
});
test('diagonal stick movement has the same speed as axial movement',()=>{
 const a=motion(),b=motion();a.input={x:1,z:0};b.input={x:1,z:1};
 for(let i=0;i<30;i++){advance(a,1/60);advance(b,1/60);}
 assert(Math.abs(a.distance-b.distance)<1e-8);
});
test('movement is time based at 30 and 60 frames per second',()=>{
 const a=motion(),b=motion();a.input.x=b.input.x=1;
 for(let i=0;i<30;i++)advance(a,1/30);for(let i=0;i<60;i++)advance(b,1/60);
 assert(Math.abs(a.x-b.x)<1e-8);
});
test('stick release stops movement and joystick input cancels a tap destination',()=>{
 const m=motion();setTarget(m,2,2);m.input.x=-1;advance(m,.03);assert.equal(m.target,null);
 m.input.x=0;const x=m.x;advance(m,.03);assert.equal(m.x,x);assert(!m.walking);
});
test('camera-relative controls turn the walk direction',()=>{
 const m=motion();m.input.z=1;advance(m,.05,Math.PI/2);assert(m.x>0);assert(Math.abs(m.z-.7)<1e-8);
});
test('furniture and out-of-room taps are rejected',()=>{
 const m=motion();for(const o of obstacles)assert.equal(setTarget(m,o.x,o.z),false);
 assert.equal(setTarget(m,99,0),false);assert.equal(setTarget(m,NaN,0),false);assert.equal(setTarget(m,0,Infinity),false);
});
test('continuous walking cannot pass through furniture or room walls',()=>{
 const m=motion();m.input.x=1;for(let i=0;i<1000;i++)advance(m,.05);assert(allowed(m.x,m.z));assert(m.x<=4.55);
 m.input={x:0,z:-1};for(let i=0;i<1000;i++)advance(m,.05);assert(allowed(m.x,m.z));assert(m.z>=-.15);
});
test('long frame delays do not teleport through obstacles',()=>{
 const m=motion();m.input.x=1;advance(m,40);assert(m.distance<=1.22*.05+.00001);
});
test('home defaults return the character to the safe dressing rug',()=>{
 const m=motion();assert(allowed(m.x,m.z));assert.equal(m.x,0);assert.equal(m.z,.7);assert.equal(m.yaw,0);
});
