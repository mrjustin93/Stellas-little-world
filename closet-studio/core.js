/* World movement is independent of rendering, input devices, and character art. */
(function(root){
 const palettes=[{name:'Lavender',color:'#c4b1cf',wall:'#f3ede6'},{name:'Rose',color:'#d9b7b1',wall:'#f3e7e2'},{name:'Sage',color:'#b3bfa4',wall:'#e9ede2'},{name:'Vanilla',color:'#d7c6a7',wall:'#f4eddc'}];
 const obstacles=[{x:3.2,z:1.45,r:.94},{x:4.1,z:0,r:.82},{x:-4.3,z:.65,r:.62}];
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function allowed(x,z){return x>=-4.55&&x<=4.55&&z>=-.15&&z<=3.45&&!obstacles.some(o=>Math.hypot(x-o.x,z-o.z)<o.r);}
 function motion(){return {x:0,z:.7,yaw:0,input:{x:0,z:0},target:null,walking:false,distance:0,gesture:'relaxed'};}
 function setTarget(m,x,z){if(!Number.isFinite(x)||!Number.isFinite(z)||!allowed(x,z))return false;m.target={x,z};m.gesture='relaxed';return true;}
 function advance(m,dt,cameraAngle=0){
  dt=clamp(dt,0,.05);let {x,z}=m.input;let magnitude=Math.hypot(x,z);
  if(magnitude>.08){m.target=null;const s=Math.min(1,magnitude)/magnitude;const a=x*s,b=z*s;x=a*Math.cos(cameraAngle)+b*Math.sin(cameraAngle);z=-a*Math.sin(cameraAngle)+b*Math.cos(cameraAngle);}
  else if(m.target){x=m.target.x-m.x;z=m.target.z-m.z;magnitude=Math.hypot(x,z);if(magnitude<.04){m.target=null;x=z=0;}else{x/=magnitude;z/=magnitude;}}
  else{x=z=0;}
  const step=Math.min(1.22*dt,m.target?Math.hypot(m.target.x-m.x,m.target.z-m.z):Infinity),oldX=m.x,oldZ=m.z;
  if(allowed(m.x+x*step,m.z+z*step)){m.x+=x*step;m.z+=z*step;}
  else{if(allowed(m.x+x*step,m.z))m.x+=x*step;if(allowed(m.x,m.z+z*step))m.z+=z*step;}
  const traveled=Math.hypot(m.x-oldX,m.z-oldZ);m.walking=traveled>.0001;m.distance+=traveled;
  if(m.walking){const wanted=Math.atan2(x,z),delta=Math.atan2(Math.sin(wanted-m.yaw),Math.cos(wanted-m.yaw));m.yaw+=delta*Math.min(1,dt*12);m.gesture='relaxed';}
  else if(m.target&&magnitude>.04)m.target=null;
  return traveled;
 }
 const api={palettes,obstacles,allowed,motion,setTarget,advance};root.StellaCore=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
