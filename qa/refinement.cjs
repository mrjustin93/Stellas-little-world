const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:412,height:892},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 const base=process.env.GAME_URL||'http://127.0.0.1:8000/';
 await page.goto(base+'?test');await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.click('#start');
 const start=await page.evaluate(()=>__game.player.x);
 await page.keyboard.down('d');await page.waitForTimeout(250);await page.keyboard.up('d');
 assert.ok(await page.evaluate(()=>__game.player.x)>start);
 // Real browser event-path checks for every new optional activity.
 const activities=[['luna',129,213,'hug'],['counter',374,145,'tea'],['shelf',190,130,'read'],['fire',268,130,'warm']];
 for(const [id,x,y,pose] of activities){
   await page.evaluate(([x,y])=>{__game.player.x=x;__game.player.y=y;},[x,y]);
   await page.locator('#interact').tap();assert.equal(await page.locator('#action').isVisible(),true,id);
   await page.locator('#action').tap();assert.equal(await page.evaluate(()=>__game.interactions.pose),pose);
   assert.ok(await page.evaluate(id=>__game.interactions.completed.has(id),id));
   const old=await page.evaluate(()=>({x:__game.player.x,y:__game.player.y}));
   await page.keyboard.down('d');await page.waitForTimeout(70);await page.keyboard.up('d');
   assert.deepEqual(await page.evaluate(()=>({x:__game.player.x,y:__game.player.y})),old,'dialogue pauses movement');
   if(id==='luna')await page.screenshot({path:'qa/cuddle-v0.2.png'});
   await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>__game.interactions.pose),'');
 }
 await page.locator('#journal').tap();assert.equal(await page.locator('#memories .remembered').count(),4);
 await page.keyboard.press('Escape');await page.reload();await page.click('#start');
 assert.equal(await page.evaluate(()=>__game.interactions.completed.size),4,'journal survives reload');
 await page.locator('#journal').tap();assert.equal(await page.locator('#memories .remembered').count(),4);await page.keyboard.press('Escape');
 // Corrupt saved data and failed storage writes are harmless.
 await page.evaluate(()=>localStorage.setItem('stella.cozy-moments.v1','not valid JSON'));await page.reload();await page.click('#start');
 assert.equal(await page.evaluate(()=>__game.interactions.completed.size),0);
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Storage disabled','SecurityError');};__game.player.x=129;__game.player.y=213;});
 await page.locator('#interact').tap();await page.locator('#action').tap();assert.equal(await page.evaluate(()=>__game.interactions.pose),'hug');await page.keyboard.press('Escape');
 // Multi-touch-ready joystick path, release and cancellation.
 await page.evaluate(()=>{__game.player.x=165;__game.player.y=280;});
 const pad=await page.locator('#joystick').boundingBox(),cdp=await page.context().newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:pad.x+pad.width*.8,y:pad.y+pad.height/2}]});
 await page.waitForTimeout(200);assert.ok(await page.evaluate(()=>__game.player.x)>165);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
 assert.equal(await page.evaluate(()=>__game.input.touch.x),0);
 // A frame must exist for every direction, walk frame, and activity pose.
 assert.ok(await page.evaluate(()=>{
   const a=__game.renderer.assets;
   for(const d of ['up','down','left','right'])for(let f=0;f<4;f++){
     const c=a.getStella(d,f);if(c.width!==32||c.height!==50)return false;
     if(!c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v))return false;
   }return !!a.luna;
 }));
 for(const [width,height] of [[320,640],[360,740],[412,892],[892,412],[1366,900]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(100);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false,`overflow at ${width}`);
   await page.locator('#journal').tap();assert.equal(await page.locator('#memories').isVisible(),true);
   const panel=await page.locator('#dialogue').boundingBox();assert.ok(panel.y>=0&&panel.y+panel.height<=height);
   await page.keyboard.press('Escape');
   if(width===412||width===1366){await page.evaluate(()=>{__game.player.x=167;__game.player.y=246;__game.player.direction='down';});await page.waitForTimeout(70);await page.screenshot({path:`qa/${width===412?'portrait':'desktop'}-v0.2.png`});}
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS: movement, all four activities and poses, paused movement, journal persistence, corrupt/disabled storage, touch cancellation, 16 sprite frames, 320–1366px layouts, reduced motion, zero console/network errors.');
})().catch(e=>{console.error(e);process.exit(1);});
