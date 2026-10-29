'use strict';
const $ = s => document.querySelector(s);
const {palettes} = StellaCore;
const host = $('#viewport'), world = $('#world');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const state = {gesture:'relaxed', paused:motion.matches, night:false, tab:'wardrobe', ready:false, failed:false, palette:palettes[0]};
const walking=StellaCore.motion();
window.stellaGame = {state, walking, motion};
function emit(name) { window.dispatchEvent(new CustomEvent('stella:'+name)); }
function toast(message) {
  $('#toast').textContent=message;
  $('#toast').classList.add('show');
  clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),3000);
}
function updateAnimation() {
  host.classList.toggle('paused',state.paused);
  $('#animate').textContent=state.paused?'▷  Resume idle':'Ⅱ  Pause idle';
  $('#animate').setAttribute('aria-pressed',String(state.paused));
  emit('animation');
}
$('#animate').onclick=()=>{state.paused=!state.paused;updateAnimation();};
motion.addEventListener('change',()=>{if(motion.matches){state.paused=true;updateAnimation();}});
updateAnimation();
function lighting() {
  state.night=!state.night;
  host.classList.toggle('evening',state.night);
  $('#light').textContent=state.night?'☾  Evening':'☀  Daylight';
  $('#light').setAttribute('aria-pressed',String(state.night));
  emit('lighting');
}
$('#light').onclick=lighting;
function setColor(palette, save=false) {
  state.palette=palette;
  host.style.setProperty('--room',palette.wall);
  host.style.setProperty('--accent',palette.color);
  $('.rug').style.background=palette.color;
  $('.ottoman').style.background=palette.color;
  $('#panel').querySelectorAll('[data-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.palette===palette.name)));
  if(save)try{localStorage.setItem('stella-room',JSON.stringify([palette.color,palette.wall]));}catch{}
  emit('palette');
}
function render() {
  const panel=$('#panel');
  if(state.tab==='wardrobe') {
    panel.innerHTML='<div class="category-title">The essentials <span>1 outfit</span></div><button class="outfit" aria-pressed="true"><span class="outfit-icon" aria-hidden="true">♧</span><strong>The everyday basics</strong><small>White tank + soft shorts · Equipped</small></button><div class="empty"><span>♧</span><h3>A wardrobe waiting to happen</h3><p>New clothes, new possibilities.<br>Your next collection belongs here.</p></div>';
    $('.outfit').onclick=()=>toast('Everyday basics are already equipped ✧');
  } else if(state.tab==='stella') {
    panel.innerHTML='<div class="category-title">Meet Stella <span>3D character</span></div><div class="pose-grid"><button data-gesture="relaxed">Relax</button><button data-gesture="confident">Stand confidently</button><button data-gesture="wave">Wave hello</button><button id="face-front">Face me</button></div><p class="panel-caption">Use the thumbstick or tap the floor to walk around her closet.</p>';
    panel.querySelectorAll('[data-gesture]').forEach(b=>{b.disabled=!state.ready;b.setAttribute('aria-pressed',String(b.dataset.gesture===walking.gesture));b.onclick=()=>{
      walking.target=null;walking.input.x=walking.input.z=0;walking.gesture=b.dataset.gesture;emit('gesture');render();
    };});
    $('#face-front').onclick=()=>{walking.yaw=window.stellaGame.angle||0;emit('gesture');};
  } else {
    panel.innerHTML='<div class="category-title">Set the mood <span>Your space</span></div><div class="room-label">Closet palette</div><div class="swatches">'+palettes.map(p=>`<button aria-label="${p.name}" aria-pressed="${p.name===state.palette.name}" style="background:${p.color}" data-palette="${p.name}"></button>`).join('')+'</div><button id="roomlight">☀ / ☾ &nbsp; Switch lighting</button><p class="panel-caption">A little refresh for your happy place.</p>';
    panel.querySelectorAll('[data-palette]').forEach(b=>b.onclick=()=>{setColor(palettes.find(p=>p.name===b.dataset.palette),true);toast(b.dataset.palette+' palette selected');});
    $('#roomlight').onclick=lighting;
  }
}
function selectTab(button, focus=false) {
  state.tab=button.dataset.tab;
  document.querySelectorAll('[role="tab"]').forEach(b=>{
    const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;
  });
  $('#panel').setAttribute('aria-labelledby',button.id);
  render();if(focus)button.focus();
}
const tabs=Array.from(document.querySelectorAll('[role="tab"]'));
tabs.forEach((b,i)=>{
  b.id='tab-'+b.dataset.tab;b.setAttribute('aria-controls','panel');
  b.onclick=()=>selectTab(b);
  b.onkeydown=e=>{let n;
    if(e.key==='ArrowRight')n=(i+1)%tabs.length;
    if(e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;
    if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;
    if(n!==undefined){e.preventDefault();selectTab(tabs[n],true);}
  };
});
try {
  const saved=JSON.parse(localStorage.getItem('stella-room'));
  if(Array.isArray(saved)){
    const palette=palettes.find(p=>p.color===saved[0]&&p.wall===saved[1]);
    if(palette)setColor(palette);
  }
}catch{}
selectTab(tabs[0]);
let dragging=null, dragAngle=0;
host.addEventListener('pointerdown',e=>{
  if(e.target.closest('button, .joystick')||(e.pointerType==='mouse'&&e.button!==0))return;
  dragging={id:e.pointerId,x:e.clientX,y:e.clientY,angle:dragAngle,moved:false};
  host.setPointerCapture(e.pointerId);
});
host.addEventListener('pointermove',e=>{
  if(!dragging||e.pointerId!==dragging.id)return;
  if(Math.hypot(e.clientX-dragging.x,e.clientY-dragging.y)>8)dragging.moved=true;
  if(!dragging.moved)return;
  dragAngle=Math.max(-.5,Math.min(.5,dragging.angle+(e.clientX-dragging.x)*.003));
  window.stellaGame.angle=dragAngle;emit('camera');
});
host.addEventListener('pointerup',e=>{
  if(dragging&&!dragging.moved&&state.ready){window.stellaGame.tap={x:e.clientX,y:e.clientY};emit('walkto');}
  dragging=null;
});
host.addEventListener('pointercancel',()=>{dragging=null;});
const stick=$('#joystick');let stickPointer=null;
function moveStick(e){
  if(e.pointerId!==stickPointer)return;
  const r=stick.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,z=e.clientY-r.top-r.height/2;
  const d=Math.hypot(x,z),limit=28,f=d>limit?limit/d:1;
  walking.input.x=x*f/limit;walking.input.z=z*f/limit;
  $('#stick').style.transform=`translate(${x*f}px,${z*f}px)`;emit('move');
}
function stopStick(){stickPointer=null;walking.input.x=walking.input.z=0;$('#stick').style.transform='translate(0,0)';}
stick.addEventListener('pointerdown',e=>{
  if(!state.ready)return;e.stopPropagation();e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e);
});
stick.addEventListener('pointermove',moveStick);
for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,stopStick);
const keys=new Set();
function updateKeys(){walking.input.x=Number(keys.has('d')||keys.has('ArrowRight'))-Number(keys.has('a')||keys.has('ArrowLeft'));walking.input.z=Number(keys.has('s')||keys.has('ArrowDown'))-Number(keys.has('w')||keys.has('ArrowUp'));emit('move');}
window.addEventListener('keydown',e=>{
  if(e.target.closest('button, input, textarea, [role="tablist"]')||$('#dialog').open)return;
  if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();keys.add(e.key);updateKeys();}
});
window.addEventListener('keyup',e=>{if(keys.delete(e.key))updateKeys();});
window.addEventListener('blur',()=>{keys.clear();stopStick();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();stopStick();}});
$('#home').onclick=()=>{
  stopStick();keys.clear();Object.assign(walking,StellaCore.motion());dragAngle=0;window.stellaGame.angle=0;emit('home');emit('camera');toast('Back at the dressing rug ✧');
};
$('#help').onclick=()=>$('#dialog').showModal();
$('#close').onclick=$('#okay').onclick=()=>$('#dialog').close();
let audio=null,soundOn=false;
$('#sound').onclick=async()=>{
  try {
    const AudioClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioClass)throw new Error('Audio unavailable');
    if(!audio){
      audio=new AudioClass();const gain=audio.createGain();gain.gain.value=.018;gain.connect(audio.destination);
      [261.63,329.63,392,523.25].forEach((f,i)=>{
        const o=audio.createOscillator();o.type='sine';o.frequency.value=f;
        const g=audio.createGain();g.gain.value=.17/(i+1);o.connect(g);g.connect(gain);o.start();
      });
    }
    if(soundOn)await audio.suspend();else await audio.resume();
    soundOn=!soundOn;$('#sound').textContent=soundOn?'♫':'♪';
    $('#sound').setAttribute('aria-pressed',String(soundOn));
    toast(soundOn?'Ambient sound on':'Ambient sound off');
  }catch{toast('Ambient sound isn’t available in this browser.');}
};
function setLoading(message,failed=false){
  $('#loading').hidden=state.ready;$('#loading').textContent=message;$('#retry').hidden=!failed;
  $('#home').disabled=$('#photo').disabled=!state.ready;
  stick.setAttribute('aria-disabled',String(!state.ready));
  if(state.tab==='stella')render();
}
window.addEventListener('stella:loaded',()=>{state.ready=true;state.failed=false;setLoading('');});
window.addEventListener('stella:failed',()=>{state.ready=false;state.failed=true;setLoading('3D Stella couldn’t load. Check your connection and try again.',true);});
$('#retry').onclick=()=>location.reload();
setLoading('Getting 3D Stella ready…');
function downloadCanvas(c) {
  return new Promise((resolve,reject)=>c.toBlob(blob=>{
    if(!blob){reject(new Error('Photo unavailable'));return;}
    const a=document.createElement('a'),url=URL.createObjectURL(blob);
    a.href=url;a.download='stellas-closet.png';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),30000);resolve();
  },'image/png'));
}
$('#photo').onclick=async()=>{
  if(!state.ready)return;
  $('#photo').disabled=true;
  try {
    if(!window.stellaCapture)throw Error('3D unavailable');
    await downloadCanvas(window.stellaCapture());
    toast('Your closet moment, saved ✧');
  }catch{toast('The photo couldn’t be saved. Please try again.');}
  finally{$('#photo').disabled=false;}
};

