import {CLOTHING,CATEGORY_LABELS,restoreClothes,undress} from './clothing.js';
import {Art} from './art.js';
import {SCALE} from './gait.js';
export class DressingRoom {
 constructor(game){
  this.game=game;this.open=false;this.angle=0;this.category='top';this.basePreview=true;this.walkPreview=false;
  this.panel=document.createElement('section');this.panel.id='dressing-room';this.panel.hidden=true;this.panel.setAttribute('role','dialog');this.panel.setAttribute('aria-modal','true');this.panel.setAttribute('aria-labelledby','dressing-title');
  this.panel.innerHTML=`<div class="dress-heading"><div><span class="eyebrow">A LITTLE SOMETHING TO WEAR</span><h2 id="dressing-title">Stella’s dressing room</h2></div><button id="dress-cancel">Cancel</button></div><div class="dress-preview"><canvas id="dress-preview" width="400" height="480" aria-label="Stella wearing your selected clothes"></canvas><div class="dress-turn"><button id="dress-left" aria-label="Rotate Stella left">↶</button><button id="dress-walk" aria-pressed="false">Walk preview</button><button id="dress-right" aria-label="Rotate Stella right">↷</button></div></div><div class="dress-picker"><nav id="dress-tabs" aria-label="Clothing categories"></nav><p id="dress-note" role="status"></p><button id="dress-underwear-view" hidden>Preview: base layers</button><div id="dress-items"></div></div><div class="dress-footer"><button id="dress-undress">Undress</button><button id="dress-reset">Reset outfit</button><button id="dress-apply">Wear this outfit</button></div>`;
  document.querySelector('#app').append(this.panel);this.canvas=this.panel.querySelector('canvas');this.pixelRatio=Math.min(globalThis.devicePixelRatio||1,2);this.canvas.width=400*this.pixelRatio;this.canvas.height=480*this.pixelRatio;this.art=new Art(this.canvas.getContext('2d'));
  this.panel.querySelector('#dress-cancel').onclick=()=>this.close();this.panel.querySelector('#dress-apply').onclick=()=>{game.player.clothes={...this.draft};game.save();this.close();game.notify('Your new outfit is ready. ♡');};
  this.panel.querySelector('#dress-undress').onclick=()=>{this.draft=undress();this.category='underwear';this.refresh();};
  this.panel.querySelector('#dress-underwear-view').onclick=()=>{this.basePreview=!this.basePreview;this.refresh();this.panel.querySelector('#dress-underwear-view').focus();};
  this.panel.querySelector('#dress-reset').onclick=()=>{this.draft=restoreClothes(null);this.refresh();};
  this.panel.querySelector('#dress-walk').onclick=()=>{this.walkPreview=!this.walkPreview;this.panel.querySelector('#dress-walk').setAttribute('aria-pressed',String(this.walkPreview));this.preview();};
  this.panel.querySelector('#dress-left').onclick=()=>{this.angle-=Math.PI/4;this.preview();};this.panel.querySelector('#dress-right').onclick=()=>{this.angle+=Math.PI/4;this.preview();};
  this.panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();this.close();}if(e.key==='Tab'){const nodes=[...this.panel.querySelectorAll('button')].filter(b=>!b.disabled),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 }
 show(){this.previous=document.activeElement;this.game.closeOverlays();this.open=true;this.walkPreview=false;this.panel.querySelector('#dress-walk').setAttribute('aria-pressed','false');this.category='top';this.basePreview=true;this.draft=restoreClothes(this.game.player.clothes,this.game.player.outfit);this.angle=0;this.panel.hidden=false;this.game.input.reset();this.refresh();this.panel.querySelector('#dress-cancel').focus();}
 close(){this.open=false;this.panel.hidden=true;this.game.input.reset();if(this.previous?.getClientRects?.().length)this.previous.focus();else document.querySelector('#interact').focus();}
 refresh(){
  const tabs=this.panel.querySelector('#dress-tabs');tabs.replaceChildren();
  for(const [key,label] of Object.entries(CATEGORY_LABELS)){const b=document.createElement('button');b.textContent=label;b.dataset.category=key;b.setAttribute('aria-pressed',String(this.category===key));b.onclick=()=>{this.category=key;this.refresh();this.panel.querySelector(`[data-category="${key}"]`).focus();};tabs.append(b);}
  const list=this.panel.querySelector('#dress-items');list.replaceChildren();
  for(const item of CLOTHING[this.category]){const b=document.createElement('button');b.textContent=item.label;b.dataset.item=item.id;b.setAttribute('aria-pressed',String(this.draft[this.category]===item.id));const chip=document.createElement('span');chip.className='dress-chip';chip.style.backgroundColor=item.color||'#e7dfd2';b.prepend(chip);b.onclick=()=>{this.draft[this.category]=item.id;this.refresh();this.panel.querySelector(`[data-item="${item.id}"]`).focus();};list.append(b);}
  const underView=this.panel.querySelector('#dress-underwear-view');underView.hidden=this.category!=='underwear';underView.textContent=this.basePreview?'Preview: base layers':'Preview: chosen outfit';underView.setAttribute('aria-pressed',String(this.basePreview));
  this.panel.querySelector('#dress-note').textContent=this.category==='underwear'?'Inspect your underwear here. This preview keeps your selected outfit unchanged.':this.category==='top'?'Mix tops with bottoms, or choose a dress that covers them.':'Choose a piece, then Wear this outfit to save it.';
  this.preview();
 }
 preview(){
  if(!this.open)return;const g=this.art.g;g.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0);g.clearRect(0,0,400,480);const gradient=g.createLinearGradient(0,0,400,480);gradient.addColorStop(0,'#fbe7dc');gradient.addColorStop(1,'#e0d9cf');g.fillStyle=gradient;g.fillRect(0,0,400,480);this.art.oval(200,439,104,16,'#d3b8ba');g.save();g.translate(200,440);g.scale(6.1,6.1);this.game.renderer.stella.draw(this.art,{...this.game.player,x:0,y:0,facing:this.angle,gait:this.walkPreview?performance.now()/1000*SCALE.walkSpeed/SCALE.walkStride:0,motion:this.walkPreview?1:0,walking:this.walkPreview,speed:SCALE.walkSpeed,changing:false,activity:null,carryingLuna:false,clothes:this.category==='underwear'&&this.basePreview?{...this.draft,top:'white-tank',bottom:'underwear'}:this.draft},'',0);g.restore();
 }
}
