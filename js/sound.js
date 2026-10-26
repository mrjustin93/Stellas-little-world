// Soft original synthesized effects. No downloads, music service or timers.
export class CozySound {
 constructor(){this.focused=true;globalThis.addEventListener?.('blur',()=>{this.focused=false;this.quiet();});globalThis.addEventListener?.('focus',()=>{this.focused=true;});this.context=null;this.muted=false;this.step=0;this.bird=4;this.water=0;try{this.muted=localStorage.getItem('stella.sound.muted')==='true';}catch{} }
 async unlock(){
  try{if(!this.context){const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return;this.context=new Audio();this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);}
   if(!this.muted&&this.context.state==='suspended')await this.context.resume();
  }catch{/* Sound is optional when a browser blocks audio. */}
 }
 toggle(){this.muted=!this.muted;try{localStorage.setItem('stella.sound.muted',String(this.muted));}catch{}if(this.master)this.master.gain.value=0;if(!this.muted)this.unlock();}
 quiet(){if(this.master)this.master.gain.value=0;}
 tone(frequency,duration,volume=.12,end=frequency){
  const c=this.context;if(!c||this.muted||c.state!=='running')return;
  const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type='sine';o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(end,t+duration);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+duration+.02);o.onended=()=>{o.disconnect();g.disconnect();};
 }
 rustle(duration,frequency,volume){
  const c=this.context;if(!c||this.muted||c.state!=='running')return;
  const b=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),data=b.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/data.length);
  const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=b;f.type='lowpass';f.frequency.value=frequency;g.gain.value=volume;s.connect(f);f.connect(g);g.connect(this.master);s.start();s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};
 }
 effect(kind){if(kind==='harvest'||kind==='picnic'){this.tone(660,.3,.1,880);this.tone(990,.5,.05,1320);}if(kind==='plant')this.rustle(.16,500,.18);}
 update(dt,game,blocked){
  const active=this.focused&&game.started&&!document.hidden&&!blocked&&!this.muted;
  if(this.master)this.master.gain.setTargetAtTime(active?.3:0,this.context.currentTime,.03);
  if(!active){this.step=0;this.water=0;return;}
  this.step-=dt;this.water-=dt;this.bird-=dt;
  if(game.player.walking&&this.step<=0){this.rustle(.09,game.scene.id==='cabin'?320:900,.16);this.tone(95,.08,.06,65);this.step=game.running?.22:.3;}
  const a=game.farming.active;if(a?.kind==='water'&&a.progress>.24&&a.progress<.79&&this.water<=0){this.rustle(.24,2300,.13);this.water=.18;}
  if(this.bird<=0){if(game.scene.id==='garden'&&!game.clock.night){this.tone(2100,.22,.055,3100);this.tone(2700,.35,.025,1900);}this.bird=7+Math.random()*6;}
 }
}
