const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.GAME_URL||'http://127.0.0.1:8796/')+'?test');
  await page.click('#start');await page.waitForFunction(()=>__game.renderer.stella.ready&&__game.renderer.stella.referenceReady);
  assert.equal(await page.evaluate(()=>__game.player.clothes.top),'white-tank');assert.equal(await page.evaluate(()=>__game.player.clothes.underwear),'white-boyshorts');
  for(const [width,height] of [[320,568],[390,844],[412,915],[844,390],[1280,800]]){
   await page.setViewportSize({width,height});await page.click('#closet-button');
   for(const selector of ['#dress-cancel','#dress-zoom','#dress-left','#dress-right','#dress-walk','#dress-reset','#dress-apply']){
    const box=await page.locator(selector).boundingBox();assert.ok(box.width>=44&&box.height>=44,`${selector} touch size at ${width}x${height}`);assert.ok(box.y>=0&&box.y+box.height<=height&&box.x>=0&&box.x+box.width<=width,`${selector} on screen at ${width}x${height}: ${JSON.stringify(box)}`);
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('#dress-cancel').click();
  }
  await page.setViewportSize({width:390,height:844});await page.click('#closet-button');
  const initial=await page.evaluate(()=>({x:__game.player.x,y:__game.player.y,hour:__game.clock.hour}));
  await page.click('#dress-walk');await page.keyboard.press('Space');
  assert.equal(await page.locator('#dressing-room').isVisible(),true);
  await page.keyboard.press('ArrowRight');assert.ok(await page.evaluate(()=>__game.dressing.angle>0));
  const canvas=await page.locator('#dress-preview').boundingBox();await page.mouse.move(canvas.x+canvas.width*.3,canvas.y+canvas.height*.5);await page.mouse.down();const before=await page.evaluate(()=>__game.dressing.angle);await page.mouse.move(canvas.x+canvas.width*.7,canvas.y+canvas.height*.5,{steps:8});await page.mouse.up();assert.notEqual(await page.evaluate(()=>__game.dressing.angle),before);
  assert.deepEqual(await page.evaluate(()=>({x:__game.player.x,y:__game.player.y,hour:__game.clock.hour})),initial);
  await page.click('#dress-reset');await page.click('#dress-apply');assert.equal(await page.locator('#dressing-room').isVisible(),false);
  await page.reload();await page.click('#start');await page.waitForFunction(()=>__game.renderer.stella.referenceReady);assert.equal(await page.evaluate(()=>__game.player.clothes.underwear),'white-boyshorts');
  await page.click('#closet-button');await page.locator('#dress-cancel').focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'dress-apply');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'dress-cancel');
  await page.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('Storage unavailable');};});await page.click('#dress-apply');assert.equal(await page.locator('#dressing-room').isVisible(),true);assert.match(await page.locator('#dress-note').innerText(),/could not be saved/);await page.evaluate(()=>Storage.prototype.setItem=window.originalSetItem);await page.click('#dress-apply');assert.equal(await page.locator('#dressing-room').isVisible(),false);
  await page.click('#closet-button');await page.keyboard.press('Escape');assert.equal(await page.locator('#dressing-room').isVisible(),false);assert.equal(await page.evaluate(()=>document.querySelector('header').inert),false);
  await page.keyboard.down('d');assert.equal(await page.evaluate(()=>__game.input.keys.has('d')),true);await page.keyboard.up('d');
  // Movement works after closing and resets when pointer capture is cancelled.
  const pad=await page.locator('#joystick').boundingBox();await page.mouse.move(pad.x+pad.width*.5,pad.y+pad.height*.5);await page.mouse.down();await page.mouse.move(pad.x+pad.width*.7,pad.y+pad.height*.5);assert.ok(await page.evaluate(()=>__game.input.touch.x>0));await page.mouse.up();assert.equal(await page.evaluate(()=>__game.input.touch.x),0);
  const dir=process.env.SCREENSHOT_DIR||'qa/mobile-closet-captures';fs.mkdirSync(dir,{recursive:true});
  await page.click('#closet-button');await page.screenshot({path:path.join(dir,'stella-closet-mobile.png')});await page.click('#dress-zoom');await page.screenshot({path:path.join(dir,'stella-face.png')});await page.click('#dress-reset');
  await page.evaluate(()=>__game.dressing.turn(Math.PI/2));await page.screenshot({path:path.join(dir,'stella-side.png')});await page.evaluate(()=>__game.dressing.turn(Math.PI/2));await page.screenshot({path:path.join(dir,'stella-back.png')});
  await page.setViewportSize({width:844,height:390});await page.click('#dress-reset');await page.screenshot({path:path.join(dir,'stella-closet-landscape.png')});
  assert.deepEqual(errors,[]);console.log('PASS: 5 viewport layouts; touch targets; swipe and keyboard rotation; paused game; focus trap; save/reload; storage failure and retry; joystick release; reference art loading; zero browser errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
