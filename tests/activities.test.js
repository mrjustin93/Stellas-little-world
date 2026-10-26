import test from 'node:test';
import assert from 'node:assert/strict';
import {FarmingActions,FARM_ACTIONS} from '../js/activities.js';
import {createGarden} from '../js/garden.js';
import {Player} from '../js/player.js';

function setup(stage=0){
 const scene=createGarden(),plot=scene.objects.find(o=>o.type==='plot'),player=new Player();
 plot.stage=stage;player.x=100;player.y=245;
 return {scene,plot,player,inventory:{seeds:12,berries:0},clock:{day:1,hour:9},actions:new FarmingActions()};
}
const tick=(s,dt)=>s.actions.update(dt,s.scene,s.inventory,s.clock);

test('planting waits for hand contact, ignores repeated starts, and spends exactly one seed',()=>{
 const s=setup();assert.equal(s.actions.start(s.plot,s.player,s.scene,s.inventory),true);
 assert.equal(s.plot.stage,0);assert.equal(s.inventory.seeds,12);
 assert.equal(s.actions.start(s.plot,s.player,s.scene,s.inventory),false);
 assert.equal(tick(s,FARM_ACTIONS.plant.duration*.70),null);
 assert.equal(s.plot.stage,0);assert.equal(s.inventory.seeds,12);
 const result=tick(s,FARM_ACTIONS.plant.duration*.03);
 assert.equal(result.kind,'plant');assert.equal(s.plot.stage,1);assert.equal(s.inventory.seeds,11);
 assert.equal(tick(s,20),null);assert.equal(tick(s,20),null);
 assert.equal(s.actions.active,null);assert.equal(s.inventory.seeds,11);
});

test('watering sets one ripening deadline and harvesting awards berries and a seed once',()=>{
 const s=setup(1);s.actions.start(s.plot,s.player,s.scene,s.inventory);
 tick(s,FARM_ACTIONS.water.duration*.5);assert.equal(s.plot.stage,1);
 assert.equal(tick(s,FARM_ACTIONS.water.duration*.5).kind,'water');
 assert.equal(s.plot.stage,2);assert.equal(s.plot.readyAt,57);assert.equal(s.inventory.seeds,12);
 assert.equal(s.actions.start(s.plot,s.player,s.scene,s.inventory),false,'growing crops cannot be watered again');
 s.plot.stage=3;s.actions.start(s.plot,s.player,s.scene,s.inventory);
 assert.equal(tick(s,FARM_ACTIONS.harvest.duration+1).kind,'harvest');
 assert.equal(s.plot.stage,0);assert.equal(s.inventory.berries,3);assert.equal(s.inventory.seeds,13);assert.equal(s.plot.readyAt,undefined);
 tick(s,100);assert.equal(s.inventory.berries,3);assert.equal(s.inventory.seeds,13);
});

test('cancelling before contact spends nothing and cancelling after contact cannot duplicate a harvest',()=>{
 const s=setup();s.actions.start(s.plot,s.player,s.scene,s.inventory);tick(s,.4);
 assert.equal(s.actions.cancel().committed,false);tick(s,100);
 assert.equal(s.inventory.seeds,12);assert.equal(s.plot.stage,0);
 s.plot.stage=3;s.actions.start(s.plot,s.player,s.scene,s.inventory);tick(s,FARM_ACTIONS.harvest.duration*.75);
 assert.equal(s.actions.cancel().committed,true);tick(s,100);
 assert.equal(s.inventory.berries,3);assert.equal(s.inventory.seeds,13);
});

test('empty inventory, changed targets and scene changes cannot consume resources',()=>{
 const s=setup();s.inventory.seeds=0;assert.equal(s.actions.start(s.plot,s.player,s.scene,s.inventory),false);
 s.inventory.seeds=1;s.actions.start(s.plot,s.player,s.scene,s.inventory);s.inventory.seeds=0;
 assert.equal(tick(s,10),null);assert.equal(s.plot.stage,0);assert.equal(s.actions.active,null);
 s.inventory.seeds=1;s.actions.start(s.plot,s.player,s.scene,s.inventory);s.plot.stage=2;
 assert.equal(tick(s,10),null);assert.equal(s.inventory.seeds,1);
 s.plot.stage=0;s.actions.start(s.plot,s.player,s.scene,s.inventory);
 assert.equal(s.actions.update(10,{id:'cabin',objects:[]},s.inventory,s.clock),null);assert.equal(s.inventory.seeds,1);
 s.actions.start(s.plot,s.player,s.scene,s.inventory);s.scene.objects=s.scene.objects.filter(o=>o!==s.plot);
 assert.equal(tick(s,10),null);assert.equal(s.inventory.seeds,1);
});

test('small and large frame steps produce the same single completed result',()=>{
 for(const stage of [0,1,3]){
  const a=setup(stage),b=setup(stage);a.actions.start(a.plot,a.player,a.scene,a.inventory);b.actions.start(b.plot,b.player,b.scene,b.inventory);
  const duration=a.actions.active.duration,large=tick(a,duration+.001),small=[];
  for(let n=0;n<241;n++){const result=tick(b,duration/240);if(result)small.push(result);}
  assert.deepEqual(small,[large]);assert.deepEqual(a.inventory,b.inventory);assert.equal(a.plot.stage,b.plot.stage);assert.equal(a.plot.readyAt,b.plot.readyAt);
  assert.equal(a.actions.active,null);assert.equal(b.actions.active,null);
 }
});

test('the action faces a nearby point in the soil without moving Stella or advancing on invalid time',()=>{
 const s=setup();const before={x:s.player.x,y:s.player.y};s.actions.start(s.plot,s.player,s.scene,s.inventory);
 const a=s.actions.active;assert.ok(a.target.x>=s.plot.x&&a.target.x<=s.plot.x+s.plot.w);assert.ok(a.target.y>=s.plot.y&&a.target.y<=s.plot.y+s.plot.h);
 assert.ok(Math.abs(a.facing-Math.PI)<1e-8);assert.equal(s.player.targetFacing,a.facing);assert.deepEqual({x:s.player.x,y:s.player.y},before);
 for(const dt of [-1,NaN,Infinity])assert.equal(tick(s,dt),null);
 assert.equal(a.progress,0);assert.equal(s.inventory.seeds,12);
});
