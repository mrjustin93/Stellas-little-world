'use strict';
const $ = s => document.querySelector(s);
const {poses, palettes, nextView, removeBackground} = StellaCore;
const canvas = $('#stella'), ctx = canvas.getContext('2d');
const host = $('#viewport'), world = $('#world');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const state = {pose:1, paused:motion.matches, night:false, tab:'wardrobe', ready:false, failed:false, palette:palettes[0]};
let frames=[];
window.stellaGame = {state, canvas, motion};
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
function setPose(n) {
  state.pose=n;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(state.ready) {
    const frame=frames[n], scale=740/frame.height;
    ctx.drawImage(frame,(230-frame.width*scale)/2,20,frame.width*scale,740);
  }
  canvas.setAttribute('aria-label',`Stella in her white tank and shorts: ${poses[n].name}`);
  $('#viewname').textContent=poses[n].name;
  emit('pose');
  if(state.tab==='poses') updatePoseButtons();
  if(state.tab==='wardrobe') updateThumbnail();
}
$('#left').onclick=()=>setPose(nextView(state.pose,-1));
$('#right').onclick=()=>setPose(nextView(state.pose,1));
function updateThumbnail() {
  const small=$('.outfit canvas');
  if(small){const x=small.getContext('2d');x.clearRect(0,0,230,780);x.drawImage(canvas,0,0);}
}
function updatePoseButtons() {
  $('#panel').querySelectorAll('[data-pose]').forEach(b=>{
    const selected=+b.dataset.pose===state.pose;
    b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));
  });
}
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
    panel.innerHTML='<div class="category-title">The essentials <span>1 outfit</span></div><button class="outfit" aria-pressed="true"><canvas width="230" height="780" aria-hidden="true"></canvas><strong>The everyday basics</strong><small>White tank + soft shorts · Equipped</small></button><div class="empty"><span>♧</span><h3>A wardrobe waiting to happen</h3><p>New clothes, new possibilities.<br>Your next collection belongs here.</p></div>';
    updateThumbnail();
    $('.outfit').onclick=()=>toast('Everyday basics are already equipped ✧');
  } else if(state.tab==='poses') {
    panel.innerHTML='<div class="category-title">Strike a pose <span>8 views</span></div><div class="pose-grid">'+poses.map((p,i)=>`<button data-pose="${i}"${state.ready?'':' disabled'}>${p.name}</button>`).join('')+'</div><p class="panel-caption">Use the turn arrows for a full circle. Choose a pose here for a different stance.</p>';
    panel.querySelectorAll('[data-pose]').forEach(b=>b.onclick=()=>setPose(+b.dataset.pose));
    updatePoseButtons();
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
selectTab(tabs[0]);setPose(1);
let dragging=null, dragAngle=0;
function endDrag() {
  dragging=null;host.classList.remove('dragging');
  // Keep the same room angle in CSS and WebGL after the drag ends.
}
host.addEventListener('pointerdown',e=>{
  if(e.target.closest('button')||(e.pointerType==='mouse'&&e.button!==0))return;
  dragging={id:e.pointerId,x:e.clientX,angle:dragAngle};
  host.classList.add('dragging');host.setPointerCapture(e.pointerId);
});
host.addEventListener('pointermove',e=>{
  if(!dragging||e.pointerId!==dragging.id)return;
  dragAngle=Math.max(-.32,Math.min(.32,dragging.angle+(e.clientX-dragging.x)*.002));
  world.style.setProperty('--angle',`${dragAngle*180/Math.PI}deg`);
  window.stellaGame.angle=dragAngle;emit('camera');
});
host.addEventListener('pointerup',endDrag);host.addEventListener('pointercancel',endDrag);host.addEventListener('lostpointercapture',endDrag);
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
function setLoading(message, failed=false) {
  $('#loading').hidden=state.ready;$('#loading').textContent=message;
  $('#retry').hidden=!failed;
  ['#left','#right','#photo'].forEach(s=>$(s).disabled=!state.ready);
  if(state.tab==='poses')render();
}
function loadStella() {
  state.failed=false;state.ready=false;setLoading('Stella is getting ready…');
  const img=new Image();
  img.onload=()=>{
    try {
      frames=poses.map(p=>{
        const [a,b]=p.crop,c=document.createElement('canvas');c.width=b-a;c.height=760;
        const x=c.getContext('2d',{willReadFrequently:true});
        x.drawImage(img,a,40,b-a,760,0,0,b-a,760);
        const d=x.getImageData(0,0,c.width,c.height);
        removeBackground(d.data,c.width,c.height,p.garments,a,40);
        x.putImageData(d,0,0);return c;
      });
      state.ready=true;setPose(state.pose);setLoading('');render();emit('ready');
    }catch {state.failed=true;setLoading('Stella couldn’t load. Please try again.',true);}
  };
  img.onerror=()=>{state.failed=true;setLoading('Stella’s image couldn’t load. Please try again.',true);};
  // Register load handlers before setting src, including for cached or embedded images.
  img.src=window.STELLA_IMAGE||'stella.jpg';
}
$('#retry').onclick=loadStella;
function downloadCanvas(c) {
  return new Promise((resolve,reject)=>c.toBlob(blob=>{
    if(!blob){reject(new Error('Photo unavailable'));return;}
    const a=document.createElement('a'),url=URL.createObjectURL(blob);
    a.href=url;a.download='stellas-closet.png';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),30000);resolve();
  },'image/png'));
}
function fallbackPhoto() {
  const c=document.createElement('canvas');c.width=1000;c.height=1100;
  const x=c.getContext('2d');
  x.fillStyle=state.palette.wall;x.fillRect(0,0,1000,1100);
  x.fillStyle='#d9bea0';x.fillRect(0,820,1000,280);
  x.fillStyle=state.palette.color;x.beginPath();x.ellipse(500,900,330,110,0,0,Math.PI*2);x.fill();
  for(const left of [65,715]){
    x.fillStyle='#faf4e9';x.fillRect(left,170,220,650);x.fillStyle='#dfd2c1';x.fillRect(left+12,182,196,616);
    for(let j=0;j<4;j++){x.fillStyle='#faf4e9';x.fillRect(left,310+j*145,220,12);x.fillStyle=j%2?'#c4b299':state.palette.color;x.fillRect(left+40,280+j*145,80,30);}
  }
  x.fillStyle='#bfa37a';x.beginPath();x.roundRect(345,180,310,590,[150,150,5,5]);x.fill();
  x.fillStyle='#e4e4d8';x.beginPath();x.roundRect(357,192,286,565,[140,140,3,3]);x.fill();
  x.drawImage(canvas,380,165,240,815);
  if(state.night){x.fillStyle='rgba(35,24,55,.22)';x.fillRect(0,0,1000,1100);}
  x.fillStyle='#584b60';x.font='italic 45px Georgia';x.textAlign='center';x.fillText('Stella’s closet',500,85);
  x.font='16px sans-serif';x.fillText('A little moment of creativity · '+poses[state.pose].name,500,1040);
  return c;
}
$('#photo').onclick=async()=>{
  if(!state.ready)return;
  $('#photo').disabled=true;
  try {
    await downloadCanvas(window.stellaCapture?window.stellaCapture():fallbackPhoto());
    toast(window.stellaCapture?'Your closet moment, saved ✧':'Illustrated keepsake saved ✧');
  }catch{toast('The photo couldn’t be saved. Please try again.');}
  finally{$('#photo').disabled=false;}
};
loadStella();
