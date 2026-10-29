const assets=require('node:fs').existsSync(require('node:path').join(__dirname,'../dist/core.js'))?'../dist/':'../';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require(assets+'core.js');

// A minimal DOM host exercises the real app handlers without a browser or network.
function boot({failImage=false,stored=null,reduced=false,tainted=false}={}){
  const nodes=new Map(), listeners=new Map();let fail=failImage,draws=0,srcHadHandlers=false,photoBlob;
  const context2d={clearRect(){},drawImage(){draws++},getImageData(x,y,w,h){if(tainted)throw Error('SecurityError');const data=new Uint8ClampedArray(w*h*4);for(let i=0;i<data.length;i+=4)data.set([220,170,140,255],i);return {data};},putImageData(){},fillRect(){},beginPath(){},ellipse(){},fill(){},roundRect(){},fillText(){}};
  class Node{
    constructor(){this.dataset={};this.attrs={};this.style={setProperty(){}};this.children=[];this.hidden=false;this.disabled=false;this.classList={values:new Set(),add(v){this.values.add(v)},remove(v){this.values.delete(v)},toggle(v,on){on?this.values.add(v):this.values.delete(v)},contains(v){return this.values.has(v)}};}
    setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]}
    getContext(){return context2d}toBlob(cb){photoBlob={type:'image/png'};cb(photoBlob)}
    addEventListener(k,f){this[k+'Listener']=f}setPointerCapture(){}
    focus(){this.focused=true}showModal(){this.open=true}close(){this.open=false}
    click(){this.onclick?.()}querySelectorAll(s){if(s==='[data-pose]')return this.poseButtons||[];if(s==='[data-palette]')return this.paletteButtons||[];return [];}
    set innerHTML(s){this.html=s;
      this.poseButtons=[...s.matchAll(/data-pose="(\d+)"/g)].map(m=>{const n=new Node();n.dataset.pose=m[1];return n});
      this.paletteButtons=[...s.matchAll(/data-palette="([^"]+)"/g)].map(m=>{const n=new Node();n.dataset.palette=m[1];return n});
    }
  }
  const get=s=>{if(!nodes.has(s))nodes.set(s,new Node());return nodes.get(s)};
  ['#stella','#loading','#retry','#left','#right','#photo','#panel','#viewport'].forEach(get);
  get('#stella').width=230;get('#stella').height=780;
  const tabs=['wardrobe','poses','room'].map(name=>{const n=new Node();n.dataset.tab=name;return n});
  const motion={matches:reduced,addEventListener(k,f){this.listener=f}};
  const sandbox={console,StellaCore:core,Uint8ClampedArray,Image:class{set src(v){srcHadHandlers=!!this.onload&&!!this.onerror;fail?this.onerror():this.onload()}},document:{querySelector:get,querySelectorAll:()=>tabs,createElement:()=>new Node()},matchMedia:()=>motion,localStorage:{getItem:()=>stored,setItem(k,v){stored=v}},setTimeout(){return 1},clearTimeout(){},CustomEvent:class{constructor(type){this.type=type}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},window:{dispatchEvent(e){for(const f of listeners.get(e.type)||[])f()},addEventListener(k,f){listeners.set(k,[...(listeners.get(k)||[]),f])}}};
  vm.createContext(sandbox);vm.runInContext(fs.readFileSync(require.resolve(assets+'app.js'),'utf8'),sandbox);
  return {get,tabs,motion,game:sandbox.window.stellaGame,window:sandbox.window,srcHadHandlers,get draws(){return draws},get stored(){return stored},recover(){fail=false;get('#retry').onclick()},get photoBlob(){return photoBlob}};
}
test('cached images load with handlers registered, controls enable, and poses turn in order',()=>{
  const app=boot();assert(app.srcHadHandlers);assert(app.game.state.ready);assert.equal(app.get('#photo').disabled,false);assert.equal(app.get('#viewname').textContent,'Relaxed');
  app.get('#right').onclick();assert.equal(app.game.state.pose,2);app.get('#left').onclick();assert.equal(app.game.state.pose,1);
});
test('image failure is recoverable and never enables an empty photo',()=>{
  const app=boot({failImage:true});assert(!app.game.state.ready);assert(app.get('#photo').disabled);assert(!app.get('#retry').hidden);
  app.recover();assert(app.game.state.ready);assert(app.get('#retry').hidden);assert(!app.get('#photo').disabled);
});
test('canvas security errors display recovery instead of crashing the app',()=>{
  const app=boot({tainted:true});assert(!app.game.state.ready);assert(app.game.state.failed);assert(!app.get('#retry').hidden);
});
test('reduced motion is honored on startup and when the system preference changes',()=>{
  const app=boot({reduced:true});assert(app.game.state.paused);assert.equal(app.get('#animate').attrs['aria-pressed'],'true');
  const other=boot();other.motion.matches=true;other.motion.listener();assert(other.game.state.paused);
});
test('tab keyboard navigation works and changing pose keeps the focused button',()=>{
  const app=boot();app.tabs[0].onkeydown({key:'ArrowRight',preventDefault(){}});assert.equal(app.game.state.tab,'poses');assert(app.tabs[1].focused);
  const buttons=app.get('#panel').poseButtons;buttons[7].onclick();assert.equal(app.game.state.pose,7);assert.equal(app.get('#panel').poseButtons,buttons);assert.equal(buttons[7].attrs['aria-pressed'],'true');
});
test('room preference validation ignores corrupted values and accepts saved palettes',()=>{
  assert.equal(boot({stored:'["bad","bad"]'}).game.state.palette.name,'Lavender');
  const app=boot({stored:'["#b3bfa4","#e9ede2"]'});assert.equal(app.game.state.palette.name,'Sage');
  app.tabs[2].onclick();app.get('#panel').paletteButtons[1].onclick();assert.equal(app.game.state.palette.name,'Rose');assert.equal(app.stored,'["#d9b7b1","#f3e7e2"]');
});
test('equipping the only outfit preserves the selected pose',()=>{
  const app=boot();app.get('#right').onclick();const pose=app.game.state.pose;app.get('.outfit').onclick();assert.equal(app.game.state.pose,pose);
});
test('audio unsupported by the browser produces a status message',async()=>{
  const app=boot();await app.get('#sound').onclick();assert.match(app.get('#toast').textContent,/isn’t available/);
});
test('photo failure always restores the photo button',async()=>{
  const app=boot();app.window.stellaCapture=()=>{throw Error('Context lost')};await app.get('#photo').onclick();assert(!app.get('#photo').disabled);assert.match(app.get('#toast').textContent,/couldn’t be saved/);
});
test('fallback photo can be downloaded with the selected evening state',async()=>{
  const app=boot();app.get('#light').onclick();assert(app.game.state.night);await app.get('#photo').onclick();assert.equal(app.photoBlob.type,'image/png');assert(!app.get('#photo').disabled);
});
