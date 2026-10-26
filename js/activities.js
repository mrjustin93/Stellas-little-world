import {tendPlot} from './garden.js';

export const FARM_ACTIONS={
 plant:{stage:0,duration:1.65,label:'Planting a little seed…'},
 water:{stage:1,duration:2,label:'A gentle drink of water…'},
 harvest:{stage:3,duration:1.85,label:'Picking sweet strawberries…'},
};
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));

// Effects happen once, at the visible contact moment. A cancelled action before
// that moment spends nothing; reloads after it use the already-saved result.
export class FarmingActions {
 constructor(){this.active=null;}
 start(plot,player,scene,inventory){
  if(this.active||plot.type!=='plot'||!scene.objects.includes(plot))return false;
  const kind=Object.keys(FARM_ACTIONS).find(k=>FARM_ACTIONS[k].stage===plot.stage);
  if(!kind||(kind==='plant'&&inventory.seeds<=0))return false;
  const target={x:clamp(player.x,plot.x+4,plot.x+plot.w-4),y:clamp(player.y,plot.y+4,plot.y+plot.h-4)};
  const facing=Math.atan2(target.x-player.x,target.y-player.y);
  this.active={kind,plot,sceneId:scene.id,stage:plot.stage,target,facing,progress:0,elapsed:0,committed:false,...FARM_ACTIONS[kind]};
  player.facing=facing;player.targetFacing=facing;player.stop();
  return true;
 }
 cancel(){const cancelled=this.active;this.active=null;return cancelled;}
 update(dt,scene,inventory,clock){
  const action=this.active;if(!action)return null;
  if(scene.id!==action.sceneId||!scene.objects.includes(action.plot)){this.cancel();return null;}
  action.elapsed+=Math.max(0,Number.isFinite(dt)?dt:0);
  action.progress=Math.min(1,action.elapsed/action.duration);
  let result=null;
  if(!action.committed&&action.progress>=.72){
   if(action.plot.stage!==action.stage||(action.kind==='plant'&&inventory.seeds<=0)){this.cancel();return null;}
   action.committed=true;
   result={kind:action.kind,message:tendPlot(action.plot,inventory,clock)};
  }
  if(action.progress>=1)this.active=null;
  return result;
 }
}
