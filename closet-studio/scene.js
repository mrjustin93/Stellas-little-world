// WebGL enhancement; the CSS room remains available if the renderer cannot load.
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
const host=document.querySelector('#viewport'),source=document.querySelector('#stella');
try{
const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0xeee5db);renderer.domElement.className='webgl-room';renderer.domElement.setAttribute('aria-label','3D walk-in closet with Stella, shelves, vanity and dressing platform');host.prepend(renderer.domElement);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(37,1,.1,100);camera.position.set(0,3.25,10.5);const target=new T.Vector3(0,2.1,0);camera.lookAt(target);
scene.add(new T.HemisphereLight(0xfff5e5,0x9f8d7a,2.4));const sun=new T.DirectionalLight(0xfff5df,3);sun.position.set(-4,8,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7});sun.shadow.bias=-.001;scene.add(sun);
const mats={wood:new T.MeshStandardMaterial({color:0xf4e8d6,roughness:.7}),wall:new T.MeshStandardMaterial({color:0xeee6dc}),floor:new T.MeshStandardMaterial({color:0xcbb08e,roughness:.8}),gold:new T.MeshStandardMaterial({color:0xb79b6e,metalness:.65,roughness:.35}),purple:new T.MeshStandardMaterial({color:0xc4b1cf,roughness:.95}),rose:new T.MeshStandardMaterial({color:0xd3b3ae}),sage:new T.MeshStandardMaterial({color:0x9aa78a}),mirror:new T.MeshStandardMaterial({color:0xd1dcd7,metalness:.55,roughness:.13})};
function box(x,y,z,w,h,d,mat=mats.wood){const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
function cylinder(x,y,z,r,h,mat=mats.purple,r2=r){const o=new T.Mesh(new T.CylinderGeometry(r,r2,h,48),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
box(0,-.1,0,12,.2,10,mats.floor);box(0,2.5,-2,12,5,.15,mats.wall);box(-5.2,2.5,0,.15,5,4,mats.wall);box(5.2,2.5,0,.15,5,4,mats.wall);
for(let i=-12;i<13;i++)box(i*.45,.008,0,.012,.008,9,new T.MeshStandardMaterial({color:0xbda080}));
box(0,.14,-1.85,10,.2,.1);box(0,4.7,-1.85,10,.1,.15);
for(const x of [-3.2,3.2]){box(x,2,-1.3,2.45,4,.12);for(const dx of [-1.2,1.2])box(x+dx,2,-.95,.09,4,.85);for(const y of [.1,.7,1.35,3.35,4])box(x,y,-.95,2.5,.08,.85);for(const y of [.4,1.04]){box(x,y,-.47,2.3,.54,.09);box(x,y,-.4,.3,.035,.05,mats.gold)}box(x,2.95,-.95,2.3,.035,.035,mats.gold);
for(let i=0;i<5;i++){const shape=new T.Shape();shape.moveTo(-.19,0);shape.lineTo(0,.14);shape.lineTo(.19,0);shape.lineTo(-.19,0);const points=shape.getPoints(4).map(p=>new T.Vector3(p.x+x-.8+i*.39,p.y+2.68,-.95));scene.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0xa58a60})));box(x-.8+i*.39,2.89,-.95,.015,.17,.015,mats.gold)}
for(let j=0;j<3;j++){box(x-.55,1.43+j*.11,-.9,.7,.1,.55,j%2?mats.purple:mats.wood);box(x+.55,1.43+j*.11,-.9,.7,.1,.55,j%2?mats.rose:mats.wood)}box(x-.55,3.61,-1,.6,.45,.5,mats.purple);box(x+.5,3.62,-1,.58,.5,.35,mats.rose);
}
// Arched dressing mirror and its brass surround.
function arch(w,h){const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h-w/2);s.absarc(0,h-w/2,w/2,0,Math.PI,false);s.lineTo(-w/2,0);return s}
const rim=new T.Mesh(new T.ExtrudeGeometry(arch(1.85,3.55),{depth:.08,bevelEnabled:false}),mats.gold);rim.position.set(0,.25,-1.78);scene.add(rim);const glass=new T.Mesh(new T.ShapeGeometry(arch(1.68,3.39)),mats.mirror);glass.position.set(0,.33,-1.68);scene.add(glass);
const rug=cylinder(0,.025,1.1,2.1,.035,mats.purple);rug.scale.z=.7;cylinder(0,.12,.7,1.07,.22,mats.wood);
cylinder(3.2,.48,1.45,.64,.65,mats.purple);for(const x of [2.9,3.5])box(x,.13,1.45,.08,.3,.08,mats.gold);
box(4.1,1.05,0,1.1,.12,.8);for(const x of [3.65,4.55])box(x,.52,0,.08,1,.08,mats.gold);cylinder(3.9,1.28,0,.075,.32,mats.rose);cylinder(4.12,1.21,0,.06,.18,mats.gold);
cylinder(-4.3,.28,.65,.31,.55,mats.wood,.23);for(let i=0;i<9;i++){const a=i*2.4;const leaf=new T.Mesh(new T.SphereGeometry(1,16,12),mats.sage);leaf.scale.set(.14,.58,.09);leaf.position.set(-4.3+Math.cos(a)*.23,.9+(i%3)*.2,.65+Math.sin(a)*.23);leaf.rotation.z=Math.sin(a)*.6;scene.add(leaf)}
const texture=new T.CanvasTexture(source);texture.colorSpace=T.SRGBColorSpace;const sprite=new T.Mesh(new T.PlaneGeometry(.92,3.12),new T.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.05,side:T.DoubleSide,depthWrite:false}));sprite.position.set(0,1.79,.7);scene.add(sprite);
let running=true;document.querySelector('#animate').addEventListener('click',()=>{running=!host.classList.contains('paused')});let angle=0,down=null;
host.addEventListener('pointerdown',e=>{if(!e.target.closest('button'))down=e.clientX});host.addEventListener('pointermove',e=>{if(down!==null)angle=Math.max(-.32,Math.min(.32,(e.clientX-down)*.002))});host.addEventListener('pointerup',()=>down=null);host.addEventListener('pointercancel',()=>down=null);
new ResizeObserver(()=>{renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix()}).observe(host);
host.classList.add('has-webgl');window.stellaCapture=()=>renderer.domElement;
let previousPalette='';function tick(ms){requestAnimationFrame(tick);texture.needsUpdate=true;if(running){sprite.rotation.z=Math.sin(ms*.0014)*.004;sprite.scale.y=1+Math.sin(ms*.0018)*.003}sprite.rotation.y=angle;camera.position.x=Math.sin(angle)*10.5;camera.position.z=Math.cos(angle)*10.5;camera.lookAt(target);const palette=getComputedStyle(host).getPropertyValue('--room').trim();if(palette!==previousPalette){mats.wall.color.set(palette);mats.purple.color.set(getComputedStyle(document.querySelector('.rug')).backgroundColor);previousPalette=palette}renderer.render(scene,camera)}requestAnimationFrame(tick);
}catch(error){console.warn('Using CSS closet fallback:',error.message)}
