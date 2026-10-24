import {feet,overlaps} from './collision.js';
import {toggleGate,updateGarden} from './garden.js';
export const SAVE_KEY='stella.world.v1';
export const newInventory=()=>({seeds:12,berries:0,flowers:0,wateringCan:true});
const finite=(v,lo,hi)=>typeof v==='number'&&Number.isFinite(v)&&v>=lo&&v<=hi;
export function snapshot(game){return {version:1,scene:game.scene.id,player:{x:game.player.x,y:game.player.y,facing:game.player.facing},clock:{day:game.clock.day,hour:game.clock.hour,paused:game.clock.paused},inventory:{...game.inventory},gate:game.garden.objects.find(o=>o.id==='gate').open,plots:game.garden.objects.filter(o=>o.type==='plot').map(o=>({id:o.id,stage:o.stage,readyAt:o.readyAt})),running:game.running,wideView:game.wideView===true};}
export function restore(game,data){
 if(!data||data.version!==1)return false;
 if(data.clock&&Number.isInteger(data.clock.day)&&finite(data.clock.day,1,1000000)&&finite(data.clock.hour,0,23.999999)){Object.assign(game.clock,{day:data.clock.day,hour:data.clock.hour,paused:data.clock.paused===true});}
 for(const key of ['seeds','berries','flowers'])if(Number.isInteger(data.inventory?.[key])&&finite(data.inventory[key],0,99999))game.inventory[key]=data.inventory[key];
 const gate=game.garden.objects.find(o=>o.id==='gate');if(data.gate===true&&!gate.open)toggleGate(gate);
 if(Array.isArray(data.plots))for(const saved of data.plots){if(!saved||typeof saved!=='object')continue;const o=game.garden.objects.find(o=>o.id===saved.id&&o.type==='plot');if(o&&Number.isInteger(saved.stage)&&finite(saved.stage,0,3)){o.stage=saved.stage;if(finite(saved.readyAt,0,24000024))o.readyAt=saved.readyAt;else if(o.stage===2)o.readyAt=game.clock.day*24+game.clock.hour+24;}}
 updateGarden(game.garden,game.clock);game.scene=data.scene==='garden'?game.garden:game.cabin;
 const b=game.scene.bounds,p=data.player;
 if(p&&finite(p.x,b.x+5,b.x+b.w-5)&&finite(p.y,b.y+4,b.y+b.h-3)&&!game.scene.objects.some(o=>o.solid&&overlaps(feet(p.x,p.y),o.solid))){game.player.x=p.x;game.player.y=p.y;game.player.facing=finite(p.facing,-10000,10000)?p.facing:0;}
 else if(game.scene.id==='garden'){game.player.x=223;game.player.y=153;}
 game.running=data.running===true;game.wideView=data.wideView===true;return true;
}
export function loadProgress(game,storage){try{const data=JSON.parse(storage.getItem(SAVE_KEY)||'null');return restore(game,data);}catch{return false;}}
export function saveProgress(game,storage){try{storage.setItem(SAVE_KEY,JSON.stringify(snapshot(game)));return true;}catch{return false;}}
