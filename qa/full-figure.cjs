// Raster checks catch invisible/cropped feet that a successful draw call misses.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:412,height:892},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto((process.env.GAME_URL||'http://127.0.0.1:8800/')+'?test');
  await page.click('#start');await page.waitForFunction(()=>__game.renderer.stella.ready);
  const result=await page.evaluate(async()=>{
   const [{Art},{CLOTHING,restoreClothes},{paintShoe},{activityRig},{SCALE}]=await Promise.all([
    import('./js/art.js'),import('./js/clothing.js'),import('./js/shoes.js'),import('./js/activity-art.js'),import('./js/gait.js')
   ]);
   const make=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
   const bounds=canvas=>{
    const {width:w,height:h}=canvas,data=canvas.getContext('2d').getImageData(0,0,w,h).data;
    let minX=w,minY=h,maxX=-1,maxY=-1,count=0;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>200){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);count++;}
    return {minX,minY,maxX,maxY,count};
   };
   const feet=make(1024,600),fg=feet.getContext('2d');fg.fillStyle='#f7e9dc';fg.fillRect(0,0,feet.width,feet.height);
   let footSamples=0;
   for(let row=0;row<CLOTHING.shoes.length;row++){
    const item=CLOTHING.shoes[row];
    for(let d=0;d<32;d++){
     const c=make(100,100),g=c.getContext('2d'),a=new Art(g),angle=d*Math.PI/16;
     paintShoe(a,{x:50,y:50},angle,.2,1,item);
     const b=bounds(c),label=`${item.id}, direction ${d}`;
     if(b.minY>48||b.maxY<54)throw Error(`Missing ankle or toe volume: ${label} ${JSON.stringify(b)}`);
     if(b.minX<10||b.maxX>90||b.minY<10||b.maxY>90)throw Error(`Foot escaped its canvas: ${label}`);
     if(b.count<85)throw Error(`Foot is too small to read: ${label} (${b.count} pixels)`);
     if(d%4===0){const col=d/4;fg.drawImage(c,25,24,50,50,col*128+14,row*100+10,100,80);fg.fillStyle='#674e4b';fg.font='10px sans-serif';fg.fillText(item.label,col*128+5,row*100+97);}
     footSamples++;
    }
   }
   const styles=[
    {label:'Reference outfit',clothes:restoreClothes()},
    {label:'White tank / bare feet',clothes:{...restoreClothes(),top:'white-tank',bottom:'underwear',shoes:'bare',neck:'none'}},
    {label:'Day dress / slippers',clothes:{...restoreClothes(),top:'lavender-dress',bottom:'underwear',shoes:'mint-slippers'}},
    {label:'Jeans / ankle boots',clothes:{...restoreClothes(),top:'mint-cardigan',bottom:'denim-trousers',shoes:'brown-boots',head:'straw-hat'}},
    {label:'Leggings / sneakers',clothes:{...restoreClothes(),top:'rose-tee',bottom:'lavender-leggings',shoes:'white-sneakers'}},
    {label:'Skirt / slippers',clothes:{...restoreClothes(),top:'lavender-sweater',bottom:'rose-skirt',shoes:'cream-slippers',head:'mint-beanie'}}
   ];
   const sheet=make(1120,1380),sg=sheet.getContext('2d');sg.fillStyle='#f7e9dc';sg.fillRect(0,0,sheet.width,sheet.height);
   const actorCanvas=make(240,280),ag=actorCanvas.getContext('2d'),art=new Art(ag),renderer=__game.renderer.stella;
   // Reference eyes, mouth and hair above the neckline must remain intact.
   for(let view=0;view<32;view++){
    const source=renderer.views[view].getContext('2d').getImageData(0,0,160,88).data;
    const head=renderer.heads[view].getContext('2d').getImageData(0,0,160,88).data;
    if(source.some((value,index)=>value!==head[index]))throw Error(`Reference face changed in view ${view}`);
   }
   let figures=0;
   function render(actor,label){
    ag.setTransform(1,0,0,1,0,0);ag.clearRect(0,0,240,280);ag.translate(120,250);ag.scale(3,3);renderer.draw(art,actor,'',0);
    const b=bounds(actorCanvas);if(b.minX<=1||b.maxX>=238||b.minY<=1||b.maxY>=278||b.count<700)throw Error(`Incomplete full figure: ${label} ${JSON.stringify(b)}`);
    const rig=activityRig(actor.gait,actor.motion,actor.speed>165,actor.facing,actor.activity||null,false);
    for(const leg of rig.legs){
     const x=Math.round(120+(leg.foot.x-80)*SCALE.character*3),y=Math.round(250+(leg.foot.y-312)*SCALE.character*3);
     const pixels=ag.getImageData(x-5,y-3,11,12).data;let opaque=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>200)opaque++;
     if(opaque<14)throw Error(`Invisible foot beneath clothing: ${label}`);
    }
    figures++;
   }
   for(let row=0;row<styles.length;row++)for(let d=0;d<8;d++){
    const style=styles[row],angle=d*Math.PI/4;
    for(const speed of [140,190])for(const phase of [0,.2,.4,.6,.8])render({x:0,y:0,facing:angle,gait:phase,motion:1,speed,clothes:style.clothes},`${style.label}, ${d}, ${speed}, ${phase}`);
    render({x:0,y:0,facing:angle,gait:0,motion:0,speed:140,clothes:style.clothes},`${style.label}, idle ${d}`);
    sg.drawImage(actorCanvas,0,0,240,280,d*140,row*230,140,210);sg.fillStyle='#674e4b';sg.font='10px sans-serif';sg.fillText(style.label,d*140+4,row*230+223);
    for(const kind of ['plant','water','harvest'])for(const progress of [.25,.5,.75])render({x:0,y:0,facing:angle,gait:0,motion:0,speed:140,clothes:style.clothes,activity:{kind,progress,facing:angle,target:{x:8,y:12}}},`${style.label}, ${kind}, ${d}, ${progress}`);
   }
   return {footSamples,figures,feet:feet.toDataURL().split(',')[1],figure:sheet.toDataURL().split(',')[1]};
  });
  fs.writeFileSync('/tmp/stella-footwear-review.png',Buffer.from(result.feet,'base64'));
  fs.writeFileSync('/tmp/stella-full-figure-review.png',Buffer.from(result.figure,'base64'));
  await page.evaluate(()=>{__game.player.x=205;__game.player.y=310;});await page.locator('#interact').tap();
  await page.locator('#dress-walk').tap();
  assert.equal(await page.locator('#dress-walk').getAttribute('aria-pressed'),'true');
  const still=await page.evaluate(()=>({x:__game.player.x,y:__game.player.y,hour:__game.clock.hour,pixels:__game.dressing.canvas.toDataURL()}));
  await page.waitForTimeout(150);
  const moving=await page.evaluate(()=>({x:__game.player.x,y:__game.player.y,hour:__game.clock.hour,pixels:__game.dressing.canvas.toDataURL()}));
  assert.notEqual(moving.pixels,still.pixels,'Walk preview actually animates');
  assert.deepEqual([moving.x,moving.y,moving.hour],[still.x,still.y,still.hour],'Preview leaves game position and clock paused');
  for(const [width,height] of [[320,640],[412,892],[892,412]]){
   await page.setViewportSize({width,height});
   const canvas=await page.locator('#dress-preview').boundingBox(),panel=await page.locator('.dress-preview').boundingBox(),turn=await page.locator('.dress-turn').boundingBox();
   assert.ok(canvas.width>0&&canvas.height>0,'Preview has a visible drawing area');
   assert.ok(canvas.x>=panel.x&&canvas.y>=panel.y&&canvas.x+canvas.width<=panel.x+panel.width+1,'Canvas stays in preview panel');
   assert.ok(canvas.y+canvas.height<=turn.y+1,'Rotation controls do not cover the figure');
   for(const shoes of ['bare','pink-sneakers']){
    await page.evaluate(async shoes=>{const {restoreClothes}=await import('./js/clothing.js');const r=__game.dressing;r.draft={...restoreClothes(),top:'white-tank',bottom:'rose-shorts',shoes};r.angle=Math.PI/4;r.refresh();},shoes);
    await page.screenshot({path:`/tmp/stella-closet-${width}-${shoes}.png`});
   }
  }
  await page.locator('#dress-apply').tap();await page.setViewportSize({width:412,height:892});
  await page.evaluate(()=>{__game.player.x=305;__game.player.y=270;});await page.keyboard.down('d');await page.waitForTimeout(200);await page.screenshot({path:'/tmp/stella-walking-phone.png'});await page.keyboard.up('d');
  assert.deepEqual(errors,[]);
  console.log(`PASS ${result.footSamples} visible footwear silhouettes, ${result.figures} complete idle/walk/jog/activity figures, animated closet preview with paused game, and framing at 320×640, 412×892 and 892×412. Review images in /tmp/stella-*.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
