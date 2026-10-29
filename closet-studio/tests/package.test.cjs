const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
test('direct-open game embeds its actual 3D model and all local code',()=>{
 const html=fs.readFileSync(path.join(root,'Play-Stellas-Closet.html'),'utf8');
 assert.match(html,/window.STELLA_MODEL="[A-Za-z0-9+/=]+"/);
 assert(!html.includes('STELLA_IMAGE'));assert(!html.includes('removeBackground'));assert(!/<script[^>]*src=/.test(html));
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);assert.equal(scripts.length,4);scripts.forEach(s=>assert.doesNotThrow(()=>new vm.Script(s)));
 assert(html.includes('type="importmap"'));
});
test('character asset has an actual deformation skeleton and skin-weighted meshes',()=>{
 const assets=fs.existsSync(path.join(root,'dist/stella.glb'))?'dist/':'';
 const bytes=fs.readFileSync(path.join(root,assets+'stella.glb'));assert.equal(bytes.readUInt32LE(0),0x46546c67);
 const doc=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
 assert(doc.skins.length>0);assert(doc.skins[0].joints.length>=16);
 for(const name of ['Head','Chest','UpperLegL','LowerLegR','UpperArmL'])assert(doc.nodes.some(n=>n.name===name));
 assert(doc.meshes.some(m=>m.primitives.some(p=>p.attributes.WEIGHTS_0!==undefined)));
});
test('refined character has an actual eyelid morph and stays within the mobile mesh budget',()=>{
 const assets=fs.existsSync(path.join(root,'dist/stella.glb'))?'dist/':'';
 const bytes=fs.readFileSync(path.join(root,assets+'stella.glb'));const doc=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
 assert(bytes.length<4*1024*1024,'character exceeds 4 MiB budget');
 const vertices=doc.meshes.reduce((n,m)=>n+m.primitives.reduce((s,p)=>s+doc.accessors[p.attributes.POSITION].count,0),0);
 assert(vertices<100000,'character exceeds 100k vertex budget');
 assert(doc.meshes.some(m=>m.extras?.targetNames?.includes('Blink')&&m.primitives.some(p=>p.targets?.some(t=>t.POSITION!==undefined))),'missing actual eyelid deformation');
});
