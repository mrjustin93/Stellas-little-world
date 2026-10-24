export function nearest(player, objects) {
  let best=null,distance=39;
  for(const object of objects){
    if(!object.message)continue;
    const s=object.solid||object;
    const x=Math.max(s.x,Math.min(player.x,s.x+s.w));
    const y=Math.max(s.y,Math.min(player.y,s.y+s.h));
    const d=Math.hypot(player.x-x,player.y-y);
    if(d<distance){distance=d;best=object;}
  }
  return best;
}

export const MOMENTS = {
  luna:{label:'Give Luna a cuddle',title:'A bear-sized hug',pose:'hug',message:'You scoop Luna into a gentle hug. Her little pink bow tickles your chin. Home is wherever you two are. ♡'},
  counter:{label:'Brew a cup of tea',title:'A warm cup of tea',pose:'tea',message:'Chamomile, a spoonful of honey, and a warm cup between your hands. There’s nowhere else you need to be.'},
  shelf:{label:'Read a little story',title:'One more page',pose:'read',message:'“Beyond the pines, a little house glowed like a lantern…” You smile and turn another page.'},
  fire:{label:'Warm your hands',title:'A fireside pause',pose:'warm',message:'You stretch your fingers toward the hearth. The wood crackles softly, and the mountain air feels far away.'},
};
const STORAGE_KEY='stella.cozy-moments.v1';
export class Interactions {
  constructor(){
    this.panel=document.querySelector('#dialogue');this.open=false;this.hearts=[];
    this.pose='';this.poseTime=0;this.active=null;this.view='';this.completed=new Set();
    try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');if(Array.isArray(saved))for(const id of saved)if(MOMENTS[id])this.completed.add(id);}catch{/* Private browsing and disabled storage remain playable. */}
    document.querySelector('#close').onclick=()=>this.close();
    document.querySelector('#action').onclick=()=>this.perform();
    document.querySelector('#journal').onclick=()=>this.showJournal();
    this.updateJournal();
  }
  close(){
    this.open=false;this.panel.hidden=true;this.active=null;
    // Closing a dialogue always returns Luna to her cozy corner.
    this.pose='';this.poseTime=0;
  }
  updateJournal(){document.querySelector('#journal').textContent=`✿ Little moments · ${this.completed.size}/4`;}
  showJournal(){
    if(this.open&&this.view==='journal'){this.close();return;}
    this.close();this.open=true;this.view='journal';this.panel.hidden=false;
    document.querySelector('#speaker').textContent='YOUR LITTLE MOMENTS';
    document.querySelector('#message').textContent='Small things, softly remembered. No rush to find them all.';
    const list=document.querySelector('#memories');list.replaceChildren();
    for(const [id,m] of Object.entries(MOMENTS)){
      const item=document.createElement('li');item.textContent=`${this.completed.has(id)?'♡':'○'} ${m.title}`;
      item.classList.toggle('remembered',this.completed.has(id));list.append(item);
    }
    list.hidden=false;document.querySelector('#action').hidden=true;
  }
  activate(object){
    if(this.open){this.close();return;}
    if(!object)return;
    this.active=object;this.open=true;this.view='object';this.panel.hidden=false;
    document.querySelector('#speaker').textContent=object.id==='luna'?'LUNA & STELLA':'LITTLE MOMENTS';
    document.querySelector('#message').textContent=object.message;
    document.querySelector('#memories').hidden=true;
    const action=document.querySelector('#action'),moment=MOMENTS[object.id];
    action.hidden=!moment;if(moment){action.textContent=moment.label;action.disabled=false;}
    if(object.id==='luna')this.emitHearts(object);
  }
  emitHearts(object){for(let i=0;i<5;i++)this.hearts.push({x:object.x+5+i*4,y:object.y-2,life:2+i*.15});}
  perform(){
    const moment=MOMENTS[this.active?.id];if(!moment)return;
    this.pose=moment.pose;this.poseTime=4;this.completed.add(this.active.id);
    document.querySelector('#message').textContent=moment.message;
    document.querySelector('#action').hidden=true;
    if(this.pose==='hug')this.emitHearts(this.active);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify([...this.completed]));}catch{/* Storage is optional. */}
    this.updateJournal();
  }
  update(dt){
    this.hearts=this.hearts.filter(h=>(h.life-=dt)>0);
    for(const heart of this.hearts)heart.y-=dt*12;
    if(this.poseTime>0){this.poseTime=Math.max(0,this.poseTime-dt);if(!this.poseTime)this.pose='';}
  }
}
