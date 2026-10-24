import {createCabin} from './scene.js';
import {Player} from './player.js';
import {Input} from './input.js';
import {Interactions,nearest} from './interactions.js';
import {Renderer} from './renderer.js';
import {createGarden,toggleGate,tendPlot} from './garden.js';
import {WorldClock} from './clock.js';
import {overlaps,feet} from './collision.js';

export class Game {
  constructor(){
    this.cabin=createCabin();this.cabin.id="cabin";this.garden=createGarden();this.scene=this.cabin;this.clock=new WorldClock();this.player=new Player();this.interactions=new Interactions();
    this.started=false;this.renderer=new Renderer(document.querySelector('#game'));
    this.input=new Input(()=>{
      if(!this.started)return;
      this.interact();this.input.reset();
    },()=>{this.interactions.close();this.input.reset();});
    document.querySelector('#start').onclick=()=>{
      this.started=true;document.querySelector('#welcome').hidden=true;
      this.interactions.close();this.input.reset();
    };
    document.querySelector('#help').onclick=()=>{
      this.input.reset();this.interactions.close();
      this.interactions.activate({message:'Drag the round control to walk, or use WASD / arrow keys. Approach Luna, the kitchen, bookshelf or fireplace and tap Interact. Try the pink activity button! Use the Garden mat to go outside. Open the gate, then plant, water and harvest strawberries. Tap the clock to pause time. A day takes ten real minutes; sunrise is 06:00 and sunset is 18:00. Your Little moments journal remembers indoor activities on this browser. E / Space interacts; Escape closes. Take your time. ♡'});
    };
    document.querySelector('#journal').addEventListener('click',()=>this.input.reset());
    document.querySelector('#close').addEventListener('click',()=>this.input.reset());
    document.querySelector('#world-clock').onclick=()=>{this.clock.paused=!this.clock.paused;};
    this.last=0;this.time=0;this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
  }
  interact(){
    if(this.interactions.open){this.interactions.close();return;}
    const o=nearest(this.player,this.scene.objects);if(!o)return;
    if(o.id==='door'||o.id==='home'){
      this.scene=o.id==='door'?this.garden:this.cabin;
      this.player.x=o.id==='door'?223:83;this.player.y=o.id==='door'?153:289;
      this.player.direction='down';this.interactions.close();return;
    }
    if(o.id==='gate'){
      if(o.open&&overlaps(feet(this.player.x,this.player.y),{x:o.x,y:o.y,w:o.w,h:o.h})){
        this.interactions.activate({message:'Take a step away from the opening so the gate can close.'});return;
      }
      toggleGate(o);return;
    }
    if(o.type==='plot'){this.interactions.activate({...o,message:tendPlot(o)});return;}
    this.interactions.activate(o);
  }
  frame(now){
    const dt=this.last?Math.min((now-this.last)/1000,.05):0;
    this.last=now;this.time+=dt;
    if(this.started&&!this.interactions.open)this.player.update(dt,this.input.axis(),this.scene);
    else this.player.walking=false;
    if(this.started&&!this.interactions.open)this.clock.update(dt);
    const clockButton=document.querySelector("#world-clock");clockButton.textContent=this.clock.label+(this.clock.paused?" · paused":"");clockButton.setAttribute("aria-pressed",String(this.clock.paused));
    document.querySelector(".location small").textContent=(this.scene.id==="garden"?"GARDEN":"HOME")+" · V0.3";
    this.interactions.update(dt);
    const near=this.started?nearest(this.player,this.scene.objects):null;
    document.querySelector('#hint').textContent=near&&!this.interactions.open?`♡ ${near.type==='plot'||near.id==='gate'?near.message:near.id==='door'?'Explore the garden':near.id==='home'?'Go inside':near.id==='luna'?'Say hello to Luna':'Enjoy a little moment'}`:'';
    document.querySelector('#interact').classList.toggle('near',!!near);
    document.querySelector('#activity').textContent=near?'A little moment awaits':'Make yourself at home';
    this.renderer.render(this.scene,this.player,this.interactions,near,this.time,this.clock);
    requestAnimationFrame(this.frame);
  }
}
