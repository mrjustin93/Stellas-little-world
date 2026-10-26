const {chromium}=require('playwright');
const assert=require('node:assert/strict');

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:412,height:892},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const base=process.env.GAME_URL||'http://127.0.0.1:8791/';
  await page.goto(base+'?test');await page.evaluate(()=>localStorage.clear());await page.reload();await page.locator('#start').tap();
  await page.waitForFunction(()=>__game.renderer.stella.ready);
  const position=async(x,y)=>page.evaluate(([x,y])=>{__game.player.x=x;__game.player.y=y;__game.input.reset();},[x,y]);
  const finish=async(stage)=>page.waitForFunction(stage=>!__game.farming.active&&__game.garden.objects.find(o=>o.id==='plot-0-0').stage===stage,stage);
  const choose=id=>page.locator(`[data-choice="${id}"]`);

  // Carry is a real dialogue choice; the original cuddle is still available.
  await position(129,213);await page.locator('#interact').tap();
  assert.equal(await page.locator('#action').isVisible(),true);
  await choose('luna-carry').tap();
  assert.ok(await page.evaluate(()=>__game.keepsakes.carryingLuna&&__game.player.carryingLuna));
  assert.ok(await page.evaluate(()=>{const l=__game.cabin.objects.find(o=>o.id==='luna');return l.hidden&&!l.solid;}));
  assert.equal(await page.locator('#dialogue').isVisible(),false);
  await page.screenshot({path:'/tmp/stella-v012-carry.png'});
  await position(83,289);await page.locator('#interact').tap();
  assert.equal(await page.evaluate(()=>__game.scene.id),'garden');
  assert.equal(await page.evaluate(()=>__game.player.carryingLuna),true);
  await position(170,350);await page.locator('#interact').tap();
  await position(100,245);await page.evaluate(()=>{__game.clock.paused=true;__game.clock.day=1;__game.clock.hour=9;});

  // Movement and repeated interaction cannot consume resources before contact.
  await page.locator('#interact').tap();
  await page.waitForFunction(()=>__game.farming.active?.kind==='plant');
  const initial=await page.evaluate(()=>({x:__game.player.x,y:__game.player.y,seeds:__game.inventory.seeds,stage:__game.garden.objects.find(o=>o.id==='plot-0-0').stage}));
  assert.equal(initial.seeds,12);assert.equal(initial.stage,0);
  await page.keyboard.down('d');await page.keyboard.press('e');await page.waitForTimeout(100);await page.keyboard.up('d');
  assert.deepEqual(await page.evaluate(()=>({x:__game.player.x,y:__game.player.y})),{x:initial.x,y:initial.y});
  assert.equal(await page.locator('#bag').isDisabled(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>__game.farming.active),null);
  assert.equal(await page.evaluate(()=>__game.inventory.seeds),12);
  assert.equal(await page.evaluate(()=>__game.garden.objects.find(o=>o.id==='plot-0-0').stage),0);

  // Complete the visible plant/water/harvest flow while carrying Luna.
  await page.locator('#interact').tap();
  await page.waitForFunction(()=>__game.farming.active?.kind==='plant'&&__game.farming.active.progress>.35);
  assert.equal(await page.evaluate(()=>__game.player.carryingLuna),true);
  await page.screenshot({path:'/tmp/stella-v012-plant.png'});
  await finish(1);assert.equal(await page.evaluate(()=>__game.inventory.seeds),11);
  assert.equal(await page.locator('#dialogue').isVisible(),false);
  await page.locator('#interact').tap();
  await page.waitForFunction(()=>__game.farming.active?.kind==='water'&&__game.farming.active.progress>.4);
  await page.screenshot({path:'/tmp/stella-v012-water.png'});
  await finish(2);
  const deadline=await page.evaluate(()=>__game.garden.objects.find(o=>o.id==='plot-0-0').readyAt);
  assert.equal(deadline,57);
  await page.locator('#interact').tap();
  assert.equal(await page.evaluate(()=>__game.farming.active),null,'growing crop has no repeated watering action');
  await page.keyboard.press('Escape');
  await page.evaluate(()=>{__game.clock.day++;});
  await page.waitForFunction(()=>__game.garden.objects.find(o=>o.id==='plot-0-0').stage===3);
  await page.locator('#interact').tap();
  await page.waitForFunction(()=>__game.farming.active?.kind==='harvest'&&__game.farming.active.progress>.4);
  await page.screenshot({path:'/tmp/stella-v012-harvest.png'});
  await finish(0);
  assert.equal(await page.evaluate(()=>__game.inventory.berries),3);
  assert.equal(await page.evaluate(()=>__game.inventory.seeds),12);
  assert.equal(await page.evaluate(()=>__game.keepsakes.harvests),1);
  assert.ok((await page.locator('#toast').textContent()).includes('unlocked'));

  // First reward is available; later rewards cannot be placed prematurely.
  await page.locator('#bag').tap();await choose('decorate').tap();
  assert.equal(await choose('pink-pot').isDisabled(),false);
  assert.equal(await choose('flower-border').isDisabled(),true);
  assert.equal(await choose('picnic-lanterns').isDisabled(),true);
  await choose('pink-pot').tap();
  assert.equal(await page.evaluate(()=>__game.cabin.objects.filter(o=>o.keepsake==='pink-pot').length),1);
  await page.keyboard.press('Escape');

  // Ripened fixtures exercise every harvest milestone through the UI, without
  // making the test wait through five additional full game days.
  for(let harvest=2;harvest<=6;harvest++){
   await page.evaluate(()=>{__game.garden.objects.find(o=>o.id==='plot-0-0').stage=3;});
   await page.locator('#interact').tap();await finish(0);
   assert.equal(await page.evaluate(()=>__game.keepsakes.harvests),harvest);
  }
  await page.locator('#bag').tap();await choose('decorate').tap();
  for(const id of ['flower-border','picnic-lanterns']){assert.equal(await choose(id).isDisabled(),false);await choose(id).tap();}
  assert.equal(await page.evaluate(()=>__game.inventory.berries),18,'decorations never spend berries');
  assert.equal(await page.evaluate(()=>__game.garden.objects.filter(o=>o.keepsake==='flower-border').length),2);
  assert.equal(await page.evaluate(()=>__game.garden.objects.filter(o=>o.keepsake==='picnic-lanterns').length),1);
  assert.equal(await page.evaluate(()=>[...__game.cabin.objects,...__game.garden.objects].some(o=>o.keepsake&&o.solid)),false);
  await page.keyboard.press('Escape');await page.reload();await page.locator('#start').tap();
  assert.equal(await page.evaluate(()=>__game.player.carryingLuna),true);
  assert.equal(await page.evaluate(()=>__game.keepsakes.harvests),6);
  assert.equal(await page.evaluate(()=>__game.inventory.berries),18);
  assert.deepEqual(await page.evaluate(()=>__game.keepsakes.decorations.slice().sort()),['flower-border','picnic-lanterns','pink-pot']);
  assert.equal(await page.evaluate(()=>__game.cabin.objects.find(o=>o.id==='luna').hidden),true);
  assert.equal(await page.evaluate(()=>__game.farming.active),null);

  // Return and decoration toggles persist, and choices remain usable on phones.
  await page.locator('#bag').tap();await choose('luna-home').tap();
  assert.equal(await page.evaluate(()=>__game.player.carryingLuna),false);
  assert.ok(await page.evaluate(()=>{const l=__game.cabin.objects.find(o=>o.id==='luna');return !l.hidden&&!!l.solid;}));
  for(const [width,height] of [[320,640],[412,892],[892,412]]){
   await page.setViewportSize({width,height});await page.locator('#bag').tap();await choose('decorate').tap();
   const panel=await page.locator('#dialogue').boundingBox();assert.ok(panel.y>=0&&panel.y+panel.height<=height,`decoration panel within ${width}×${height}`);
   await choose('picnic-lanterns').scrollIntoViewIfNeeded();assert.equal(await choose('picnic-lanterns').isVisible(),true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false);
   await page.keyboard.press('Escape');
  }
  await page.locator('#bag').tap();await choose('decorate').tap();await choose('pink-pot').tap();await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>__game.cabin.objects.filter(o=>o.keepsake==='pink-pot').length),0);
  await page.reload();await page.locator('#start').tap();
  assert.equal(await page.evaluate(()=>__game.player.carryingLuna),false);
  assert.equal(await page.evaluate(()=>__game.keepsakes.decorations.includes('pink-pot')),false);
  assert.deepEqual(errors,[]);
  console.log('PASS animated farming, contact-time inventory, cancellation/input lock, carrying Luna across scenes, six harvest rewards, free decorations, save/reload and mobile choice layouts.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
