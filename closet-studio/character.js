/* A real deform rig: joint rotations drive the skinned Blender mesh, never the reference image. */
window.createStellaCharacter=async function(T){
 const {GLTFLoader}=await import('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js');
 const loader=new GLTFLoader();
 const gltf=window.STELLA_MODEL?await loader.parseAsync(Uint8Array.from(atob(window.STELLA_MODEL),c=>c.charCodeAt(0)).buffer,''):await loader.loadAsync('stella.glb');
 const model=gltf.scene, group=new T.Group();group.name='Stella3D';group.add(model);
 const bones={},rest={},targets={},eyes=[],blinkMeshes=[];
 model.traverse(o=>{
  if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}
  if(o.morphTargetDictionary&&o.morphTargetDictionary.Blink!==undefined)blinkMeshes.push(o);
  if(o.isBone){bones[o.name]=o;rest[o.name]=o.quaternion.clone();targets[o.name]=o.quaternion.clone();}
  if(/^(Eye|Iris|Pupil|Eye_sparkle)/.test(o.name))eyes.push(o);
 });
 group.updateMatrixWorld(true);
 const axes={},q=new T.Quaternion();
 for(const [name,bone] of Object.entries(bones)){
  const inverse=bone.getWorldQuaternion(new T.Quaternion()).invert();
  axes[name]=[new T.Vector3(1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,0,1)].map(a=>a.applyQuaternion(inverse));
 }
 function rotate(name,x=0,y=0,z=0){const b=bones[name];if(!b)return;targets[name].copy(rest[name]);for(const [a,v] of [[axes[name][0],x],[axes[name][1],y],[axes[name][2],z]])if(v)targets[name].multiply(q.setFromAxisAngle(a,v));}
 group.updateMatrixWorld(true);
 const restL=new T.Vector3(),restR=new T.Vector3();bones.FootL.getWorldPosition(restL);bones.FootR.getWorldPosition(restR);
 const footGround=Math.min(restL.y,restR.y)+.045;
 let blend=0,time=0;
 function update(dt,walk,idle=true,immediate=false){
  if(idle||walk.walking)time+=dt;
  const smooth=immediate?1:1-Math.exp(-dt*12);blend+=(Number(walk.walking)-blend)*smooth;
  const phase=walk.distance*9,breath=idle?Math.sin(time*1.9)*.012:0;
  group.position.set(walk.x,.045+Math.abs(Math.sin(phase*2))*.014*blend,walk.z);
  group.rotation.y=walk.yaw;
  rotate('Hips',0,0,Math.sin(phase)*.025*blend);
  rotate('Chest',breath,0,idle?Math.sin(time*.75)*.013:0);
  rotate('Neck',0,0,0);rotate('Head',0,idle?Math.sin(time*.55)*.045:0,idle?Math.sin(time*.7)*.018:0);
  for(const [side,offset] of [['L',0],['R',Math.PI]]){
   const s=Math.sin(phase+offset);
   rotate('UpperLeg'+side,s*.43*blend);
   rotate('LowerLeg'+side,-Math.max(0,-s)*.62*blend);
   rotate('Foot'+side,Math.max(0,s)*.13*blend);
   rotate('UpperArm'+side,-s*.29*blend,0,idle?Math.sin(time*1.4+offset)*.012:0);
   rotate('Forearm'+side,-.07-Math.max(0,s)*.16*blend);
   rotate('Hand'+side,0,0,0);
  }
  if(!walk.walking&&walk.gesture==='wave'){
   rotate('UpperArmR',-.2,0,-1.0);rotate('ForearmR',-.35,0,-.9+(idle?Math.sin(time*7)*.15:0));rotate('HandR',0,0,idle?Math.sin(time*7)*.15:0);
  }
  if(!walk.walking&&walk.gesture==='confident'){
   rotate('UpperArmL',-.12,0,-.22);rotate('ForearmL',-.32,0,.55);rotate('UpperArmR',-.12,0,.22);rotate('ForearmR',-.32,0,-.55);
  }
  let transitioning=false;
  for(const [name,bone] of Object.entries(bones)){
    if(bone.quaternion.angleTo(targets[name])>.001)transitioning=true;
    bone.quaternion.slerp(targets[name],immediate?1:1-Math.exp(-dt*14));
  }
  // The face behind the eyes remains intact when the eye surfaces close.
  const t=time%4.8,blink=idle&&t>4.55?Math.sin((t-4.55)/.25*Math.PI):0;
  if(blinkMeshes.length){for(const mesh of blinkMeshes)mesh.morphTargetInfluences[mesh.morphTargetDictionary.Blink]=blink;}else{for(const eye of eyes)eye.scale.y=1-blink*.96;}
  group.updateMatrixWorld(true);
  if(bones.FootL&&bones.FootR){
    const a=new T.Vector3(),b=new T.Vector3();bones.FootL.getWorldPosition(a);bones.FootR.getWorldPosition(b);
    group.position.y+=footGround-Math.min(a.y,b.y);
    group.updateMatrixWorld(true);
  }
  return blend>.001||transitioning;
 }
 return {group,model,bones,update,stats:{bones:Object.keys(bones).length,blinkMeshes:blinkMeshes.length,skinnedMeshes:(()=>{let n=0;model.traverse(o=>{if(o.isSkinnedMesh)n++});return n})()}};
};
