import {createCabin} from './scene.js';
import {Player} from './player.js';
import {Input} from './input.js';
import {Interactions,nearest} from './interactions.js';
import {Renderer} from './renderer.js';
import {createAssets} from './assets.js';

export class Game {
  constructor(){
    this.scene=createCabin();this.player=new Player();this.interactions=new Interactions();
    this.started=false;this.renderer=new Renderer(document.querySelector('#game'),createAssets());
    this.input=new Input(()=>{
      if(!this.started)return;
      this.interactions.activate(nearest(this.player,this.scene.objects));this.input.reset();
    },()=>{this.interactions.close();this.input.reset();});
    document.querySelector('#start').onclick=()=>{
      this.started=true;document.querySelector('#welcome').hidden=true;
      this.interactions.close();this.input.reset();
    };
    document.querySelector('#help').onclick=()=>{
      this.input.reset();this.interactions.close();
      this.interactions.activate({message:'Drag the round control to walk, or use WASD / arrow keys. Approach Luna, the kitchen, bookshelf or fireplace and tap Interact. Try the pink activity button! Your Little moments journal remembers these gentle activities on this browser. E / Space interacts; Escape closes. Take your time. ♡'});
    };
    document.querySelector('#journal').addEventListener('click',()=>this.input.reset());
    document.querySelector('#close').addEventListener('click',()=>this.input.reset());
    this.last=0;this.time=0;this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
  }
  frame(now){
    const dt=this.last?Math.min((now-this.last)/1000,.05):0;
    this.last=now;this.time+=dt;
    if(this.started&&!this.interactions.open)this.player.update(dt,this.input.axis(),this.scene);
    else this.player.walking=false;
    this.interactions.update(dt);
    const near=this.started?nearest(this.player,this.scene.objects):null;
    document.querySelector('#hint').textContent=near&&!this.interactions.open?`♡ ${near.id==='luna'?'Say hello to Luna':'Enjoy a little moment'}`:'';
    document.querySelector('#interact').classList.toggle('near',!!near);
    document.querySelector('#activity').textContent=near?'A little moment awaits':'Make yourself at home';
    this.renderer.render(this.scene,this.player,this.interactions,near,this.time);
    requestAnimationFrame(this.frame);
  }
}
