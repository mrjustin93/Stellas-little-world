const assets=require('node:fs').existsSync(require('node:path').join(__dirname,'../dist/core.js'))?'../dist/':'../';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {poses,orbit,nextView,removeBackground,inside}=require(assets+'core.js');
test('turn arrows complete one circle and reverse without jumping into unrelated stances',()=>{
  let pose=1;const seen=[];
  for(let i=0;i<6;i++){seen.push(pose);const next=nextView(pose,1);assert.equal(nextView(next,-1),pose);pose=next;}
  assert.deepEqual(seen,orbit);assert.equal(pose,1);
  assert.equal(nextView(7,1),2);assert.equal(nextView(0,-1),3);
});
test('all reference crops stay above captions and within the source image',()=>{
  assert.equal(poses.length,8);
  for(const p of poses){assert(p.crop[0]>=0);assert(p.crop[1]<=1280);assert(p.crop[1]>p.crop[0]);assert(p.garments.length>0);}
});
test('background cleanup retains neutral white clothes and drops detached neighboring fragments',()=>{
  const w=20,h=20,p=new Uint8ClampedArray(w*h*4);
  for(let i=0;i<w*h;i++)p.set([208,208,208,255],i*4);
  // White garment touches the background, with a colored skin pixel above it.
  for(let y=6;y<16;y++)for(let x=6;x<14;x++)p.set([205,207,211,255],(y*w+x)*4);
  p.set([220,170,140,255],(5*w+9)*4);
  p.set([220,170,140,255],(2*w+2)*4); // Neighbor fragment.
  removeBackground(p,w,h,[[[6,6],[14,6],[14,16],[6,16]]]);
  assert.equal(p[0*4+3],0);
  assert.equal(p[(10*w+9)*4+3],255);
  assert.equal(p[(5*w+9)*4+3],255);
  assert.equal(p[(2*w+2)*4+3],0);
});
test('garment protection maps source coordinates into each crop',()=>{
  assert(inside(270,280,poses[1].garments[0]));
  const p=new Uint8ClampedArray(4*4*4).fill(208);
  for(let i=3;i<p.length;i+=4)p[i]=255;
  removeBackground(p,4,4,[[[101,101],[103,101],[103,103],[101,103]]],100,100);
  assert.equal(p[(1*4+1)*4+3],255);assert.equal(p[3],0);
});
