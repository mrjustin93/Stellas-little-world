import {undress} from './clothing.js';
import {Art} from './art.js';
import {SCALE} from './gait.js';
export class DressingRoom {
 constructor(game){
  this.game=game;this.open=false;this.angle=0;this.walkPreview=false;this.portrait=false;
  this.panel=document.createElement('section');this.panel.id='dressing-room';this.panel.hidden=true;
  this.panel.setAttribute('role','dialog');this.panel.setAttribute('aria-modal','true');this.panel.setAttribute('aria-labelledby','dressing-title');
  this.panel.innerHTML=`<div class="dress-heading"><div><span class="eyebrow">A LITTLE SPACE FOR YOU</span><h2 id="dressing-title">Stella’s closet</h2></div><button id="dress-cancel" aria-label="Close closet">✕</button></div>
   <div class="dress-preview"><div class="dress-preview-label"><span id="dress-view">Front view</span><button id="dress-zoom" aria-pressed="false">Face view</button></div><canvas id="dress-preview" aria-label="Stella preview. Swipe to turn."></canvas><p class="dress-gesture">Swipe to turn · take a little look around</p><div class="dress-turn"><button id="dress-left" aria-label="Rotate Stella left">↶</button><button id="dress-walk" aria-pressed="false">Walk preview</button><button id="dress-right" aria-label="Rotate Stella right">↷</button></div></div>
   <section class="dress-picker" aria-labelledby="essentials-title"><div class="dress-section-heading"><h3 id="essentials-title">Her essentials</h3><span>2 pieces</span></div><div id="dress-items"><div class="dress-essential"><span class="dress-item-icon" aria-hidden="true">♡</span><div><strong>White tank top</strong><small>Soft & simple</small></div><span class="dress-check" aria-label="Wearing">✓</span></div><div class="dress-essential"><span class="dress-item-icon" aria-hidden="true">✿</span><div><strong>White underwear</strong><small>Everyday comfort</small></div><span class="dress-check" aria-label="Wearing">✓</span></div></div><p class="dress-coming">A little room for future favorites.</p></section>
   <div class="dress-footer"><p id="dress-note" role="status">Save this look on this device.</p><div><button id="dress-reset">Reset view</button><button id="dress-apply">Save & return →</button></div></div>`;
  document.querySelector('#app').append(this.panel);this.canvas=this.panel.querySelector('canvas');this.art=new Art(this.canvas.getContext('2d'));
  const button=id=>this.panel.querySelector(id);
  button('#dress-cancel').onclick=()=>this.close();
  button('#dress-apply').onclick=()=>{
   this.game.player.clothes={...this.draft};
   if(this.game.save()){this.close();this.game.notify('Stella’s look is saved on this device. ♡');}
   else {button('#dress-note').textContent='This look is on for now, but could not be saved. Try again or close to keep playing.';button('#dress-apply').textContent='Try saving again';}
  };
  button('#dress-reset').onclick=()=>{this.angle=0;this.portrait=false;this.walkPreview=false;this.refresh();};
  button('#dress-walk').onclick=()=>{this.walkPreview=!this.walkPreview;this.refresh();};
  button('#dress-zoom').onclick=()=>{this.portrait=!this.portrait;this.refresh();};
  button('#dress-left').onclick=()=>this.turn(-Math.PI/8);button('#dress-right').onclick=()=>this.turn(Math.PI/8);
  this.canvas.addEventListener('pointerdown',e=>{if(this.pointer!=null||!e.isPrimary)return;this.pointer=e.pointerId;this.lastX=e.clientX;this.canvas.setPointerCapture(e.pointerId);});
  this.canvas.addEventListener('pointermove',e=>{if(e.pointerId!==this.pointer)return;this.turn((e.clientX-this.lastX)/Math.max(1,this.canvas.clientWidth)*Math.PI*2);this.lastX=e.clientX;});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])this.canvas.addEventListener(event,e=>{if(e.pointerId===this.pointer)this.pointer=null;});
  this.panel.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();this.close();}
   if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();this.turn(e.key==='ArrowLeft'?-Math.PI/8:Math.PI/8);}
   if(e.key==='Tab'){const nodes=[...this.panel.querySelectorAll('button')].filter(b=>!b.disabled&&b.getClientRects().length),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
 }
 show(){
  this.previous=document.activeElement;this.game.closeOverlays();this.open=true;this.walkPreview=false;this.portrait=false;this.draft=undress();this.angle=0;this.panel.hidden=false;
  this.background=[...document.querySelector('#app').children].filter(el=>el!==this.panel).map(el=>[el,el.inert]);for(const [el] of this.background)el.inert=true;
  this.game.input.reset();this.panel.querySelector('#dress-note').textContent='Save this look on this device.';this.panel.querySelector('#dress-apply').textContent='Save & return →';this.refresh();this.panel.querySelector('#dress-cancel').focus();
 }
 close(){this.open=false;this.panel.hidden=true;this.pointer=null;for(const [el,inert] of this.background||[])el.inert=inert;this.game.input.reset();if(this.previous?.getClientRects?.().length)this.previous.focus();else document.querySelector('#interact').focus();}
 turn(delta){this.angle=(this.angle+delta+Math.PI*2)%(Math.PI*2);this.refresh();}
 refresh(){
  this.panel.querySelector('#dress-walk').setAttribute('aria-pressed',String(this.walkPreview));this.panel.querySelector('#dress-walk').textContent=this.walkPreview?'Pause walk':'Walk preview';
  this.panel.querySelector('#dress-zoom').setAttribute('aria-pressed',String(this.portrait));this.panel.querySelector('#dress-zoom').textContent=this.portrait?'Full view':'Face view';
  this.panel.querySelector('#dress-view').textContent=['Front view','Three-quarter view','Side view','Three-quarter back','Back view','Three-quarter back','Side view','Three-quarter view'][Math.round(this.angle/(Math.PI/4))%8];
  this.canvas.setAttribute('aria-label',`${this.portrait?'Face':'Full-body'} preview of Stella in a white tank top and underwear. Swipe to turn.`);this.preview();
 }
 preview(){
  if(!this.open)return;const width=this.canvas.clientWidth,height=this.canvas.clientHeight;if(!width||!height)return;
  const ratio=Math.min(globalThis.devicePixelRatio||1,2),pw=Math.round(width*ratio),ph=Math.round(height*ratio);
  if(this.canvas.width!==pw||this.canvas.height!==ph){this.canvas.width=pw;this.canvas.height=ph;}
  const g=this.art.g;g.setTransform(ratio,0,0,ratio,0,0);g.clearRect(0,0,width,height);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  const scale=Math.min(width/(this.portrait?36:58),height/(this.portrait?24:64));
  g.save();g.translate(width/2,this.portrait?height*.5+scale*47:height*.95);g.scale(scale,scale);
  this.game.renderer.stella.draw(this.art,{...this.game.player,x:0,y:0,facing:this.angle,gait:this.walkPreview?performance.now()/1000*SCALE.walkSpeed/SCALE.walkStride:0,motion:this.walkPreview?1:0,walking:this.walkPreview,speed:SCALE.walkSpeed,changing:false,activity:null,carryingLuna:false,clothes:this.draft},'',0);g.restore();
 }
}
