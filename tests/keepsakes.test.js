import test from 'node:test';
import assert from 'node:assert/strict';
import {createKeepsakes,DECORATIONS,earnHarvest,toggleDecoration,syncKeepsakes,setLunaCarried,restoreKeepsakes} from '../js/keepsakes.js';
import {newInventory,snapshot,restore} from '../js/progress.js';
import {createCabin} from '../js/scene.js';
import {createGarden} from '../js/garden.js';
import {Player} from '../js/player.js';
import {WorldClock} from '../js/clock.js';

function game(){const cabin=createCabin();cabin.id='cabin';return {cabin,garden:createGarden(),scene:cabin,player:new Player(),clock:new WorldClock(),inventory:newInventory(),keepsakes:createKeepsakes()};}

test('harvest milestones unlock free decorations once and placement stays optional',()=>{
 const g=game(),seen=[];
 for(let i=1;i<=8;i++){
  seen.push(...earnHarvest(g.keepsakes).map(d=>d.id));
  assert.equal(g.keepsakes.harvests,i);assert.deepEqual(g.keepsakes.decorations,[]);
 }
 assert.deepEqual(seen,DECORATIONS.map(d=>d.id));
 assert.equal(g.inventory.berries,0,'rewards do not spend or invent berries');
 assert.equal(earnHarvest({harvests:99999}).length,0);
});

test('only unlocked decorations can be placed; syncing is idempotent and keeps the gate clear',()=>{
 const g=game();assert.equal(toggleDecoration(g.keepsakes,'pink-pot').ok,false);
 assert.equal(toggleDecoration(g.keepsakes,'unknown').ok,false);
 g.keepsakes.harvests=6;
 for(const d of DECORATIONS)assert.equal(toggleDecoration(g.keepsakes,d.id).placed,true);
 syncKeepsakes(g);syncKeepsakes(g);
 const decor=[...g.cabin.objects,...g.garden.objects].filter(o=>o.keepsake);
 assert.equal(decor.length,4);assert.equal(new Set(decor.map(o=>o.id)).size,4);
 assert.ok(decor.every(o=>o.solid===null));
 const border=decor.filter(o=>o.type==='reward-border');
 assert.ok(border.every(o=>o.x+o.w<145||o.x>195),'flower borders leave the gate opening clear');
 assert.equal(toggleDecoration(g.keepsakes,'pink-pot').placed,false);syncKeepsakes(g);
 assert.equal(g.cabin.objects.some(o=>o.keepsake==='pink-pot'),false);
});

test('Luna has exactly one representation and restores her original corner footprint',()=>{
 const g=game(),luna=g.cabin.objects.find(o=>o.id==='luna'),original={...luna.solid};
 setLunaCarried(g,true);assert.equal(g.player.carryingLuna,true);assert.equal(luna.hidden,true);assert.equal(luna.solid,null);
 syncKeepsakes(g);syncKeepsakes(g);assert.equal(g.cabin.objects.filter(o=>o.id==='luna').length,1);
 setLunaCarried(g,false);assert.equal(g.player.carryingLuna,false);assert.equal(luna.hidden,false);assert.deepEqual(luna.solid,original);
});

test('new saves retain carrying, decorations and harvest progress alongside the old farm data',()=>{
 const a=game();a.keepsakes.harvests=6;toggleDecoration(a.keepsakes,'pink-pot');toggleDecoration(a.keepsakes,'picnic-lanterns');setLunaCarried(a,true);
 a.scene=a.garden;a.player.x=600;a.player.y=350;a.inventory.berries=18;a.clock.day=4;
 const saved=JSON.parse(JSON.stringify(snapshot(a))),b=game();assert.equal(saved.version,1);assert.ok(restore(b,saved));
 assert.deepEqual(b.keepsakes,a.keepsakes);assert.equal(b.player.carryingLuna,true);assert.equal(b.cabin.objects.find(o=>o.id==='luna').hidden,true);
 assert.equal(b.player.x,600);assert.equal(b.scene.id,'garden');assert.equal(b.clock.day,4);assert.equal(b.inventory.berries,18);
 assert.equal(b.cabin.objects.filter(o=>o.keepsake).length,1);assert.equal(b.garden.objects.filter(o=>o.keepsake).length,1);
 saved.keepsakes.decorations.push('flower-border');assert.equal(a.keepsakes.decorations.includes('flower-border'),false,'snapshot does not alias live arrays');
});

test('carried Luna is removed from collision before a saved position in her corner is restored',()=>{
 const a=game();setLunaCarried(a,true);a.player.x=128;a.player.y=190;
 const b=game();assert.ok(restore(b,snapshot(a)));assert.equal(b.player.x,128);assert.equal(b.player.y,190);
});

test('legacy saves credit existing berries but malformed optional data never grants locked rewards',()=>{
 const old={version:1,inventory:{berries:9},scene:'cabin'},g=game();assert.ok(restore(g,old));
 assert.equal(g.keepsakes.harvests,3);assert.equal(g.keepsakes.carryingLuna,false);assert.deepEqual(g.keepsakes.decorations,[]);
 for(const value of [null,[],false,'bad',{harvests:-1},{harvests:NaN},{harvests:'6'}]){
  const state=restoreKeepsakes(value,18);assert.equal(state.harvests,0);assert.deepEqual(state.decorations,[]);
 }
 const safe=restoreKeepsakes({carryingLuna:'true',harvests:1,decorations:['pink-pot','pink-pot','flower-border','unknown',null]});
 assert.deepEqual(safe,{carryingLuna:false,harvests:1,decorations:['pink-pot']});
 assert.equal(restoreKeepsakes({harvests:Number.MAX_SAFE_INTEGER}).harvests,99999);
});
