import {createCabin} from './scene.js';
import {Player} from './player.js';
import {Input} from './input.js';
import {Interactions,nearest} from './interactions.js';
import {Renderer} from './renderer.js';
import {createGarden,toggleGate,updateGarden} from './garden.js';
import {WorldClock} from './clock.js';
import {overlaps,feet} from './collision.js';
import {newInventory,loadProgress,saveProgress} from './progress.js';
import {drawMap} from './map.js';
import {cropStatus,picnicStatus,sharePicnic} from './cozy-goals.js';
import {CozySound} from './sound.js';
import {SCALE} from './gait.js';
import {FarmingActions} from './activities.js';
import {createKeepsakes,DECORATIONS,earnHarvest,toggleDecoration,setLunaCarried,syncKeepsakes} from './keepsakes.js';
export class Game {
 constructor(){
  this.cabin=createCabin();this.cabin.id='cabin';this.garden=createGarden();this.scene=this.cabin;
  this.sound=new CozySound();this.clock=new WorldClock();this.player=new Player();this.inventory=newInventory();this.keepsakes=createKeepsakes();this.farming=new FarmingActions();this.running=false;this.wideView=false;this.toastTime=0;
  this.interactions=new Interactions();this.started=false;this.saveTimer=0;this.last=0;this.time=0;this.flowerCooldown=0;
  try{this.resumed=loadProgress(this,localStorage);}catch{this.resumed=false;}
  syncKeepsakes(this);
  this.renderer=new Renderer(document.querySelector('#game'));
  this.mapPanel=document.querySelector('#map-panel');
  const soundButton=document.querySelector('#sound-toggle');
  const soundLabel=()=>{soundButton.textContent=this.sound.muted?'Sound off':'Sound on';soundButton.setAttribute('aria-pressed',String(this.sound.muted));soundButton.setAttribute('aria-label',this.sound.muted?'Enable gentle sounds':'Mute gentle sounds');};
  soundLabel();soundButton.onclick=()=>{this.sound.toggle();soundLabel();};
  document.addEventListener('pointerdown',()=>this.sound.unlock(),{passive:true});document.addEventListener('keydown',()=>this.sound.unlock());
  window.addEventListener('blur',()=>this.sound.quiet());

  this.input=new Input(()=>{if(!this.started)return;this.interact();this.input.reset();},()=>{if(this.farming.active){const done=this.farming.active.committed;this.farming.cancel();this.player.activity=null;if(!done)this.notify('A little pause. Nothing used.');}this.closeOverlays();this.input.reset();});
  document.querySelector('#start').textContent=this.resumed?'Welcome back →':'Step inside →';
  document.querySelector('#start').onclick=()=>{this.started=true;document.querySelector('#welcome').hidden=true;this.closeOverlays();this.input.reset();this.save();};
  document.querySelector('#help').onclick=()=>{if(this.farming.active)return;this.closeOverlays();this.input.reset();this.interactions.activate({message:'Drag the joystick or use WASD / arrows. Step close to a garden plot and tap Interact to plant, water or harvest. Watch Stella finish her little task. Strawberries ripen after one game day and never die; the cabin basket has free seeds. Visit Luna and choose Take Luna along; Bag lets you return her home. Harvests unlock decorations in Bag → Decorate. Map shows the wider world. Tap Walk to jog, or the clock to pause time. Progress saves here automatically.'});};
  document.querySelector('#bag').onclick=()=>this.showBag();
  document.querySelector('#map-button').onclick=()=>{if(this.farming.active)return;this.interactions.close();this.input.reset();this.mapPanel.hidden=!this.mapPanel.hidden;if(!this.mapPanel.hidden)drawMap(document.querySelector('#map-canvas'),this);};
  document.querySelector('#close-map').onclick=()=>{this.mapPanel.hidden=true;this.input.reset();};
  document.querySelector('#view-toggle').onclick=()=>{this.wideView=!this.wideView;this.save();};
  document.querySelector('#pace').onclick=()=>{this.running=!this.running;this.save();};
  document.querySelector('#world-clock').onclick=()=>{this.clock.paused=!this.clock.paused;this.save();};
  document.querySelector('#journal').addEventListener('click',()=>{this.mapPanel.hidden=true;this.input.reset();});
  document.querySelector('#close').addEventListener('click',()=>this.input.reset());
  window.addEventListener('pagehide',()=>{if(this.started)this.save();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){this.sound.quiet();this.input.reset();this.player.stop();if(this.started)this.save();}});
  this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
 }
 closeOverlays(){this.interactions.close();this.mapPanel.hidden=true;}
 notify(message){document.querySelector('#toast').textContent=message;document.querySelector('#toast').hidden=false;this.toastTime=5;}
 save(){let ok=false;try{ok=saveProgress(this,localStorage);}catch{}document.querySelector('#save-state').textContent=ok?'Saved on this device':'Saving unavailable · keep this tab open';return ok;}
 showBag(){
  if(this.farming.active)return;this.closeOverlays();this.input.reset();
  const choices=[{id:'picnic-goal',label:'A picnic with Luna',run:()=>this.showPicnicGoal()},{id:'decorate',label:'Decorate your little world',run:()=>this.showDecorations()}];
  if(this.keepsakes.carryingLuna)choices.unshift({id:'luna-home',label:'Return Luna to her cozy corner',run:()=>this.returnLuna()});
  this.interactions.activate({message:this.keepsakes.carryingLuna?'Luna is along for the adventure. She rests beside you while you tend the garden.':'Tools, little treasures, and room for a few more berries.'},choices);
  document.querySelector('#speaker').textContent='STELLA’S BACKPACK';
  const list=document.querySelector('#memories');list.replaceChildren();
  for(const text of [`🌱 Strawberry seeds · ${this.inventory.seeds}`,`🍓 Strawberries · ${this.inventory.berries}`,`🌼 Meadow flowers · ${this.inventory.flowers}`,'💧 Watering can · always ready',`♡ Harvests gathered · ${this.keepsakes.harvests}`]){const li=document.createElement('li');li.textContent=text;list.append(li);}list.hidden=false;
 }
 showPicnicGoal(){
  this.closeOverlays();this.input.reset();this.interactions.activate({message:picnicStatus(this)});
  document.querySelector('#speaker').textContent=this.keepsakes.picnicComplete?'A SWEET MEMORY':'A LITTLE GARDEN WISH';
 }
 enjoyPicnic(){
  if(!sharePicnic(this))return;
  this.save();this.interactions.close();this.interactions.activate({message:'Six sweet strawberries, two little cups, and your favorite bear. Stella settles beside Luna beneath the pines. “I saved the sweetest one for you.” ♡ A sweet memory is now in your Bag.'});
  this.interactions.pose='hug';this.interactions.poseTime=8;this.interactions.emitHearts(this.player);this.sound.effect('picnic');
 }
 showDecorations(){
  this.closeOverlays();this.input.reset();
  this.interactions.activate({message:'Little gifts from a growing garden. Each harvest brings you closer; placing decorations costs no berries.'},DECORATIONS.map(d=>({id:d.id,disabled:this.keepsakes.harvests<d.required,label:this.keepsakes.harvests<d.required?`${d.title} · ${this.keepsakes.harvests}/${d.required} harvests`:`${this.keepsakes.decorations.includes(d.id)?'Put away':'Place'} ${d.title}`,run:()=>{const result=toggleDecoration(this.keepsakes,d.id);if(result.ok){syncKeepsakes(this);this.save();this.showDecorations();}}})));
  document.querySelector('#speaker').textContent='MAKE IT YOUR OWN';
  const list=document.querySelector('#memories');list.replaceChildren();for(const d of DECORATIONS){const li=document.createElement('li');li.textContent=`${d.title} · ${d.description}`;list.append(li);}list.hidden=false;
 }
 takeLuna(){setLunaCarried(this,true);this.closeOverlays();this.input.reset();this.save();this.notify('Luna is coming along! ♡');}
 returnLuna(){
  const luna=this.cabin.objects.find(o=>o.id==='luna');
  if(this.scene===this.cabin&&overlaps(feet(this.player.x,this.player.y),{x:luna.x,y:luna.y,w:luna.w,h:luna.h})){this.notify('Step away from Luna’s corner so she has room to sit.');return;}
  setLunaCarried(this,false);this.closeOverlays();this.input.reset();this.save();this.notify('Luna is settled in her cozy corner at home. ♡');
 }
 interact(){
  if(this.farming.active)return;
  if(!this.mapPanel.hidden){this.mapPanel.hidden=true;return;}
  if(this.interactions.open){this.interactions.close();return;}
  const o=nearest(this.player,this.scene.objects);if(!o)return;
  if(o.id==='door'||o.id==='home'){this.scene=o.id==='door'?this.garden:this.cabin;this.player.x=o.id==='door'?223:83;this.player.y=o.id==='door'?153:289;this.player.direction='down';this.player.facing=0;this.player.targetFacing=0;this.player.stop();this.save();return;}
  if(o.id==='gate'){
   if(o.open&&overlaps(feet(this.player.x,this.player.y),{x:o.x,y:o.y,w:o.w,h:o.h})){this.interactions.activate({message:'Take a step away from the opening so the gate can close.'});return;}
   toggleGate(o);this.save();return;
  }
  if(o.id==='picnic'){
   this.interactions.activate({message:picnicStatus(this)},[{id:'share-picnic',label:!this.keepsakes.carryingLuna?'Bring Luna along first':this.keepsakes.picnicComplete?'Enjoy another picnic ♡':`Share 6 strawberries · ${Math.min(6,this.inventory.berries)}/6`,disabled:!this.keepsakes.carryingLuna||(!this.keepsakes.picnicComplete&&this.inventory.berries<6),run:()=>this.enjoyPicnic()}]);return;
  }
  let message=o.message;
  if(o.type==='plot'){
   if(this.farming.start(o,this.player,this.scene,this.inventory)){this.player.activity=this.farming.active;this.toastTime=0;this.input.reset();return;}
   message=o.stage===2?cropStatus(o,this.clock).label+'. No extra watering needed.':'Your seed pouch is empty. The basket beside the cabin has free seeds.';
  }
  if(o.id==='seeds'){this.inventory.seeds=Math.max(12,this.inventory.seeds);message='A little gift for your garden. Your pouch now holds at least twelve strawberry seeds.';}
  if(o.id==='flowers'){if(this.time>=this.flowerCooldown){this.inventory.flowers++;this.flowerCooldown=this.time+15;message='A meadow flower for your backpack. You leave plenty for the bees.';}else message='Let’s leave the meadow to the bees for a moment.';}
  this.interactions.activate({...o,message},o.id==='luna'?[{id:'luna-carry',label:'Take Luna along ♡',run:()=>this.takeLuna()}]:[]);this.save();
 }
 frame(now){
  const dt=this.last?Math.min((now-this.last)/1000,.05):0;this.last=now;this.time+=dt;
  const blocked=this.interactions.open||!this.mapPanel.hidden||document.hidden||!!this.farming.active;
  if(this.started&&!document.hidden&&this.farming.active){
   const result=this.farming.update(dt,this.scene,this.inventory,this.clock);this.input.reset();
   if(result){
    this.sound.effect(result.kind);
    const rewards=result.kind==='harvest'?earnHarvest(this.keepsakes):[];syncKeepsakes(this);this.save();
    const message={plant:'Seed planted · water it next.',water:'Soil watered · ripe in one game day.',harvest:'+3 strawberries · +1 seed'}[result.kind];
    this.notify(message+(rewards.length?` · ${rewards[0].title} unlocked! Bag → Decorate`:''));
   }
  }
  this.player.activity=this.farming.active;
  for(const id of ['help','bag','map-button','journal','pace','world-clock','interact'])document.getElementById(id).disabled=!!this.farming.active;
  this.toastTime=Math.max(0,this.toastTime-dt);document.querySelector('#toast').hidden=this.toastTime===0;
  this.renderer.zoom=this.wideView?.85:1;
  const view=document.querySelector('#view-toggle');view.textContent=this.wideView?'View: Wide':'View: Cozy';view.setAttribute('aria-pressed',String(this.wideView));
  this.player.speed=this.running?SCALE.jogSpeed:SCALE.walkSpeed;
  if(this.started&&!blocked){this.player.update(dt,this.input.axis(),this.scene);this.clock.update(dt);}else this.player.stop(dt);
  updateGarden(this.garden,this.clock);
  if(this.started){this.saveTimer+=dt;if(this.saveTimer>=5){this.saveTimer=0;this.save();}}
  const clockButton=document.querySelector('#world-clock');clockButton.textContent=this.clock.label+(this.clock.paused?' · paused':'');clockButton.setAttribute('aria-pressed',String(this.clock.paused));
  const pace=document.querySelector('#pace');pace.textContent=this.running?'Jog':'Walk';pace.setAttribute('aria-pressed',String(this.running));
  const region=this.scene.id==='cabin'?'HOME':this.player.x>570?(this.player.y>390?'PICNIC CLEARING':'FLOWER MEADOW'):this.player.x>470?'PINE TRAIL':'GARDEN';
  document.querySelector('.location small').textContent=region+' · V0.13';
  this.interactions.update(dt);const near=this.started&&!blocked?nearest(this.player,this.scene.objects):null;
  document.querySelector('#hint').textContent=near?`♡ ${near.type==='plot'||near.id==='gate'?near.message:near.id==='door'?'Explore the garden':near.id==='home'?'Go inside':near.id==='luna'?'Say hello to Luna':near.id==='seeds'?'Free strawberry seeds':near.id==='flowers'?'Pick a meadow flower':'Enjoy a little moment'}`:'';
  document.querySelector('#hint').hidden=this.toastTime>0||!!this.farming.active;
  document.querySelector('#interact').classList.toggle('near',!!near);document.querySelector('#activity').textContent=this.farming.active?.label||(near?'A little moment awaits':'Make yourself at home');
  this.sound.update(dt,this,this.interactions.open||!this.mapPanel.hidden);
  const picnic=this.garden.objects.find(o=>o.id==='picnic');picnic.celebrated=this.keepsakes.picnicComplete===true;
  this.renderer.render(this.scene,this.player,this.interactions,near,this.time,this.clock);
  requestAnimationFrame(this.frame);
 }
}
