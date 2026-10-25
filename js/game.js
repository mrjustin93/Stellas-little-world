import {createCabin} from './scene.js';
import {Player} from './player.js';
import {Input} from './input.js';
import {Interactions,nearest} from './interactions.js';
import {Renderer} from './renderer.js';
import {createGarden,toggleGate,tendPlot,updateGarden} from './garden.js';
import {WorldClock} from './clock.js';
import {overlaps,feet} from './collision.js';
import {newInventory,loadProgress,saveProgress} from './progress.js';
import {drawMap} from './map.js';
import {SCALE} from './gait.js';
export class Game {
 constructor(){
  this.cabin=createCabin();this.cabin.id='cabin';this.garden=createGarden();this.scene=this.cabin;
  this.clock=new WorldClock();this.player=new Player();this.inventory=newInventory();this.running=false;this.wideView=false;
  this.interactions=new Interactions();this.started=false;this.saveTimer=0;this.last=0;this.time=0;this.flowerCooldown=0;
  try{this.resumed=loadProgress(this,localStorage);}catch{this.resumed=false;}
  this.renderer=new Renderer(document.querySelector('#game'));
  this.mapPanel=document.querySelector('#map-panel');
  this.input=new Input(()=>{if(!this.started)return;this.interact();this.input.reset();},()=>{this.closeOverlays();this.input.reset();});
  document.querySelector('#start').textContent=this.resumed?'Welcome back →':'Step inside →';
  document.querySelector('#start').onclick=()=>{this.started=true;document.querySelector('#welcome').hidden=true;this.closeOverlays();this.input.reset();this.save();};
  document.querySelector('#help').onclick=()=>{this.closeOverlays();this.input.reset();this.interactions.activate({message:'Drag the joystick or use WASD / arrows. Use the Garden mat to go outside. Bag shows your seeds, berries, flowers and watering can; Map shows the larger world. Open the gate to plant and water strawberries. They ripen after one game day and never die. The basket beside the cabin has free seeds. Tap Walk to jog. In Map, use View to choose a cozy or wider camera. The clock can pause time. Progress saves on this browser every five seconds and after actions; keep browser data to keep your farm.'});};
  document.querySelector('#bag').onclick=()=>this.showBag();
  document.querySelector('#map-button').onclick=()=>{this.interactions.close();this.input.reset();this.mapPanel.hidden=!this.mapPanel.hidden;if(!this.mapPanel.hidden)drawMap(document.querySelector('#map-canvas'),this);};
  document.querySelector('#close-map').onclick=()=>{this.mapPanel.hidden=true;this.input.reset();};
  document.querySelector('#view-toggle').onclick=()=>{this.wideView=!this.wideView;this.save();};
  document.querySelector('#pace').onclick=()=>{this.running=!this.running;this.save();};
  document.querySelector('#world-clock').onclick=()=>{this.clock.paused=!this.clock.paused;this.save();};
  document.querySelector('#journal').addEventListener('click',()=>{this.mapPanel.hidden=true;this.input.reset();});
  document.querySelector('#close').addEventListener('click',()=>this.input.reset());
  window.addEventListener('pagehide',()=>{if(this.started)this.save();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){this.input.reset();this.player.stop();if(this.started)this.save();}});
  this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
 }
 closeOverlays(){this.interactions.close();this.mapPanel.hidden=true;}
 save(){let ok=false;try{ok=saveProgress(this,localStorage);}catch{}document.querySelector('#save-state').textContent=ok?'Saved on this device':'Saving unavailable · keep this tab open';return ok;}
 showBag(){this.closeOverlays();this.input.reset();this.interactions.activate({message:'Your little backpack. Tools stay with you, and there is always room for a few more berries.'});document.querySelector('#speaker').textContent='STELLA’S BACKPACK';const list=document.querySelector('#memories');list.replaceChildren();for(const text of [`🌱 Strawberry seeds · ${this.inventory.seeds}`,`🍓 Strawberries · ${this.inventory.berries}`,`🌼 Meadow flowers · ${this.inventory.flowers}`,'💧 Watering can · always ready']){const li=document.createElement('li');li.textContent=text;list.append(li);}list.hidden=false;}
 interact(){
  if(!this.mapPanel.hidden){this.mapPanel.hidden=true;return;}
  if(this.interactions.open){this.interactions.close();return;}
  const o=nearest(this.player,this.scene.objects);if(!o)return;
  if(o.id==='door'||o.id==='home'){this.scene=o.id==='door'?this.garden:this.cabin;this.player.x=o.id==='door'?223:83;this.player.y=o.id==='door'?153:289;this.player.direction='down';this.player.facing=0;this.player.targetFacing=0;this.player.stop();this.save();return;}
  if(o.id==='gate'){
   if(o.open&&overlaps(feet(this.player.x,this.player.y),{x:o.x,y:o.y,w:o.w,h:o.h})){this.interactions.activate({message:'Take a step away from the opening so the gate can close.'});return;}
   toggleGate(o);this.save();return;
  }
  let message=o.message;
  if(o.type==='plot'){message=tendPlot(o,this.inventory,this.clock);updateGarden(this.garden,this.clock);}
  if(o.id==='seeds'){this.inventory.seeds=Math.max(12,this.inventory.seeds);message='A little gift for your garden. Your pouch now holds at least twelve strawberry seeds.';}
  if(o.id==='flowers'){if(this.time>=this.flowerCooldown){this.inventory.flowers++;this.flowerCooldown=this.time+15;message='A meadow flower for your backpack. You leave plenty for the bees.';}else message='Let’s leave the meadow to the bees for a moment.';}
  this.interactions.activate({...o,message});this.save();
 }
 frame(now){
  const dt=this.last?Math.min((now-this.last)/1000,.05):0;this.last=now;this.time+=dt;
  const blocked=this.interactions.open||!this.mapPanel.hidden||document.hidden;
  this.renderer.zoom=this.wideView?.85:1;
  const view=document.querySelector('#view-toggle');view.textContent=this.wideView?'View: Wide':'View: Cozy';view.setAttribute('aria-pressed',String(this.wideView));
  this.player.speed=this.running?SCALE.jogSpeed:SCALE.walkSpeed;
  if(this.started&&!blocked){this.player.update(dt,this.input.axis(),this.scene);this.clock.update(dt);}else this.player.stop(dt);
  updateGarden(this.garden,this.clock);
  if(this.started){this.saveTimer+=dt;if(this.saveTimer>=5){this.saveTimer=0;this.save();}}
  const clockButton=document.querySelector('#world-clock');clockButton.textContent=this.clock.label+(this.clock.paused?' · paused':'');clockButton.setAttribute('aria-pressed',String(this.clock.paused));
  const pace=document.querySelector('#pace');pace.textContent=this.running?'Jog':'Walk';pace.setAttribute('aria-pressed',String(this.running));
  const region=this.scene.id==='cabin'?'HOME':this.player.x>570?(this.player.y>390?'PICNIC CLEARING':'FLOWER MEADOW'):this.player.x>470?'PINE TRAIL':'GARDEN';
  document.querySelector('.location small').textContent=region+' · V0.9.1';
  this.interactions.update(dt);const near=this.started&&!blocked?nearest(this.player,this.scene.objects):null;
  document.querySelector('#hint').textContent=near?`♡ ${near.type==='plot'||near.id==='gate'?near.message:near.id==='door'?'Explore the garden':near.id==='home'?'Go inside':near.id==='luna'?'Say hello to Luna':near.id==='seeds'?'Free strawberry seeds':near.id==='flowers'?'Pick a meadow flower':'Enjoy a little moment'}`:'';
  document.querySelector('#interact').classList.toggle('near',!!near);document.querySelector('#activity').textContent=near?'A little moment awaits':'Make yourself at home';
  this.renderer.render(this.scene,this.player,this.interactions,near,this.time,this.clock);
  requestAnimationFrame(this.frame);
 }
}
