export class Renderer{
constructor(canvas,assets){this.canvas=canvas;this.assets=assets;this.buffer=document.createElement('canvas');this.buffer.width=480;this.buffer.height=360;this.g=this.buffer.getContext('2d');this.static=document.createElement('canvas');this.static.width=480;this.static.height=360;this.drawRoom();this.resize=()=>{const r=canvas.getBoundingClientRect();canvas.width=Math.round(r.width*Math.min(devicePixelRatio||1,2));canvas.height=Math.round(r.height*Math.min(devicePixelRatio||1,2));};new ResizeObserver(this.resize).observe(canvas);this.resize();}
r(x,y,w,h,c){this.g.fillStyle=c;this.g.fillRect(Math.round(x),Math.round(y),w,h);}
box(x,y,w,h,c){this.r(x+2,y+3,w,h,'#3c302b');this.r(x,y,w,h,c);this.r(x,y,w,2,'#ffffff22');this.r(x,y+h-3,w,3,'#00000022');}
drawRoom(){const original=this.g;this.g=this.static.getContext('2d');this.r(0,0,480,360,'#29382f');for(let i=0;i<44;i++){const x=(i*73)%480,y=(i*37)%360;this.r(x,y,3,12,'#3d4b39');}this.box(14,22,452,324,'#4a3427');this.r(24,91,432,245,'#b48253');for(let row=0;row<21;row++){const y=91+row*12;this.r(24,y,432,1,'#815b3d');for(let col=0;col<8;col++){const x=24+col*64+(row%2)*30;this.r(x,y+1,1,11,'#916440');this.r(x+7,y+4,30,1,row%3?'#c4936233':'#e8b97b44');this.r(x+28,y+9,20,1,'#835c3422');this.r(x+3,y+3,1,1,'#694b36');}}for(let row=0;row<6;row++){this.box(18,25+row*11,444,11,row%2?'#76513a':'#805a3e');for(let x=30;x<460;x+=75)this.r(x,29+row*11,30,1,'#b0865033');}this.box(19,25,10,314,'#5d3f2e');this.box(450,25,11,314,'#5d3f2e');this.box(20,331,440,9,'#674730');this.box(20,88,440,7,'#4d372b');this.r(30,96,420,3,'#65483155');
// Woven bedroom and living-room rugs.
this.rug(32,216,110,70,'#bd7d87');this.rug(184,211,122,76,'#bc9481');this.rug(346,246,69,33,'#a9aa7b');
// Wall picture and a garland.
this.box(150,46,25,27,'#c29a62');this.r(153,49,19,21,'#ebe0b8');this.r(159,54,6,11,'#77916d');this.r(155,62,15,5,'#b4b18a');for(let i=0;i<16;i++){this.r(32+i*26,31+Math.round(Math.sin(i/3)*4),2,2,'#efc789');}
// Entry mat and scattered floor details.
this.rug(60,302,48,21,'#8e795d');this.r(153,294,8,3,'#c69566');this.roomDetails();this.g=original;}
rug(x,y,w,h,c){this.r(x,y,w,h,'#674a3a55');this.r(x+2,y+1,w-4,h-2,c);for(let i=5;i<w-4;i+=7){this.r(x+i,y+4,2,1,'#f9d7b688');this.r(x+i,y+h-5,2,1,'#f9d7b688');}this.r(x+6,y+7,w-12,1,'#f6d4bc66');this.r(x+6,y+h-8,w-12,1,'#f6d4bc66');for(let i=4;i<h;i+=5){this.r(x-2,y+i,3,1,c);this.r(x+w-1,y+i,3,1,c);}}
object(o,t){const {x,y,w,h}=o;const r=(a,b,c,d,color)=>this.r(x+a,y+b,c,d,color),box=(a,b,c,d,color)=>this.box(x+a,y+b,c,d,color);switch(o.type){
case 'window':box(-3,-3,w+6,h+6,'#4f382c');r(1,1,w-2,h-2,'#94bec0');r(1,14,w-2,24,'#8fafa1');for(let i=0;i<8;i++){const a=i*9-2,top=9+(i%3)*5;r(a+3,top,2,26,'#4a695b');for(let j=0;j<4;j++)r(a+1-j,top+j*4,6+j*2,3,'#537c68');}r(0,20,w,3,'#e6bc80');r(w/2-2,0,4,h,'#e4b67a');box(-5,h-2,w+10,5,'#c39662');r(-7,0,7,h-5,'#dfaaad');r(w,0,7,h-5,'#dfaaad');r(-6,3,2,h-9,'#f3c4bc');break;
case 'bed':box(0,0,w,h,'#795037');box(2,-10,w-4,23,'#aa774e');r(7,-6,w-14,12,'#bf9264');r(5,7,w-10,h-17,'#f1c5bd');box(7,8,26,18,'#fff0d6');box(38,8,26,18,'#fff0d6');r(10,10,20,2,'#ffffff88');r(4,31,w-8,h-40,'#cf8b9f');r(4,31,w-8,9,'#edb3bf');for(let a=10;a<w-6;a+=13)for(let b=48;b<h-12;b+=15){r(a,b,3,2,'#f3c4c6');r(a-1,b-1,1,2,'#f3c4c6');}r(5,h-9,w-10,5,'#e8aeb8');box(0,h-6,w,6,'#966440');break;
case 'lamp':box(0,8,w,h-8,'#9e6f45');r(3,16,w-6,8,'#b98b60');r(10,19,4,2,'#e3bb7e');r(10,-4,4,14,'#c39a62');r(5,5,15,3,'#7d5940');r(5,-16,15,12,'#f3d6a1');r(2,-6,21,3,'#f8dfb2');r(8,-15,2,10,'#fff1c6');break;
case 'bear':this.g.drawImage(this.assets.luna,x-1,y-2);break;case 'shelf':box(0,-23,w,h+23,'#775039');r(4,-18,w-8,h+13,'#4f3c2e');for(let row=0;row<2;row++){for(let i=0;i<8;i++){const colors=['#9b6575','#a8aa7b','#b77e55','#71958c','#d5b48a'];r(6+i*5,-14+row*22,4,15-(i%3),colors[i%5]);r(7+i*5,-12+row*22,1,3,'#f3d9a088');}r(2,4+row*22,w-4,4,'#b58656');}break;
case 'fire':box(-4,0,w+8,h,'#6d665c');box(1,4,w-2,h-4,'#9c8b75');for(let row=0;row<5;row++)for(let col=0;col<4;col++)r(col*15+(row%2)*5,8+row*8,12,6,row%2?'#b0a08a':'#8a7d6a');r(10,18,w-20,h-19,'#3f3029');r(13,h-10,w-26,5,'#79472f');for(let i=0;i<5;i++){const a=14+i*6,flame=8+Math.round(Math.sin(t*8+i*3)*4);r(a,h-8-flame,5,flame,'#eaa153');r(a+1,h-6-flame,3,flame-2,'#f8ce73');}box(-6,-4,w+12,8,'#976c49');r(6,-14,10,10,'#a2a27a');r(8,-20,5,9,'#667e54');r(37,-14,9,10,'#e0c49b');break;
case 'plant':box(3,14,w-6,h-14,'#ba8766');r(2,12,w-4,4,'#deb18a');r(10,-6,2,21,'#526b42');for(let i=0;i<5;i++){r(3+(i%2)*9,-4+i*3,9,4,i%2?'#829664':'#617c4d');r(6+(i%2)*8,-7+i*3,5,3,'#8b9e6d');}break;
case 'counter':box(0,3,w,h-3,'#b0845b');r(4,12,27,16,'#d2ad7a');r(37,12,27,16,'#d2ad7a');r(24,15,4,2,'#816044');r(40,15,4,2,'#816044');box(-2,0,w+4,9,'#e2cba6');r(15,1,30,6,'#7f9790');r(18,2,24,3,'#abc0b2');r(28,-7,3,9,'#d8d5be');r(28,-8,8,3,'#d8d5be');r(53,-6,9,7,'#dcac9c');r(56,-11,3,6,'#758453');break;
case 'fridge':box(0,0,w,h,'#c4c0a4');r(2,2,w-5,h-5,'#e2ddc0');r(2,17,w-5,2,'#9e9d86');r(4,7,2,7,'#8b8f7e');r(4,24,2,10,'#8b8f7e');r(13,25,8,9,'#dcacaf');r(15,27,4,1,'#fbdfc3');break;
case 'sofa':box(1,0,w-2,h-5,'#8f6571');box(4,-7,w-8,26,'#bd8b95');r(9,-3,w-18,2,'#d5a4a5');box(9,17,30,17,'#d1a1a4');box(43,17,30,17,'#d1a1a4');box(-3,6,12,31,'#ae7c87');box(w-9,6,12,31,'#ae7c87');box(12,0,17,15,'#e5bfad');r(17,3,7,7,'#e8cfaf');r(57,0,14,22,'#9eaa8d');r(59,2,2,23,'#b6b99a');break;
case 'table':box(4,14,5,14,'#785137');box(w-9,14,5,14,'#785137');box(0,0,w,18,'#9e714b');r(3,2,w-6,2,'#c59a68');box(9,3,17,10,'#89947e');r(11,4,13,1,'#c6c7a1');r(37,4,9,7,'#e8c7ae');r(46,5,3,4,'#d4ad91');r(39,4,5,2,'#70503e');break;
case 'dining':box(8,0,12,45,'#8e6549');box(36,0,12,45,'#8e6549');r(10,-4,8,14,'#b68b60');r(38,-4,8,14,'#b68b60');box(0,11,w,23,'#c09a6d');r(2,13,w-4,2,'#dfb583');r(24,15,10,12,'#d6b0a3');r(27,14,4,9,'#eee2bb');r(28,9,2,6,'#78915e');break;
case 'door':r(0,0,w,2,'#d0a36d');break;}this.details(o,t);}
roomDetails(){
  // The floor is pre-rendered once: detailed grain costs nothing per frame.
  for(let row=0;row<20;row++)for(let col=0;col<7;col++){
    const x=31+col*63+(row%2)*15,y=99+row*12;
    if((x<145&&x+35>32&&y>=216&&y<=286)||(x<306&&x+35>184&&y>=211&&y<=287)||(x<415&&x+35>346&&y>=246&&y<=279))continue;
    this.r(x,y,21+(col%3)*5,1,'#e6bb7c33');
    this.r(x+8,y+3,11,1,'#77503422');
    if((row+col)%5===0){this.r(x+29,y+1,5,1,'#77503444');this.r(x+30,y,3,3,'#77503422');}
  }
  // Hand-stitched rug borders and small floral embroidery.
  for(const [x,y,w,h] of [[32,216,110,70],[184,211,122,76]]){
    for(let i=13;i<w-12;i+=14){
      this.r(x+i,y+11,2,2,'#f6d9bd88');this.r(x+i,y+h-13,2,2,'#f6d9bd88');
    }
    for(const [a,b] of [[10,17],[w-14,17],[10,h-21],[w-14,h-21]]){
      this.r(x+a,y+b,4,1,'#ead2af');this.r(x+a+1,y+b-1,2,3,'#ead2af');
      this.r(x+a+1,y+b,1,1,'#b88678');this.r(x+a+2,y+b+3,1,3,'#909271');
    }
  }
  // Pressed-flower frames beside the windows.
  this.box(303,49,16,23,'#b18659');this.r(305,51,12,18,'#eedbb4');
  this.r(311,56,1,10,'#809064');this.r(308,57,6,3,'#c48a9b');
  this.r(310,55,2,7,'#d8a1ac');this.r(309,63,3,1,'#8e9d70');
  // A tiny pair of slippers next to the bed and a basket of folded linen.
  for(const x of [123,132]){this.r(x,246,6,10,'#98716b');this.r(x+1,246,4,7,'#d9a2ab');this.r(x+1,246,4,2,'#f3c9c4');}
  this.box(148,128,18,17,'#a17c53');
  for(let i=0;i<5;i++)this.r(150+i*3,130,1,14,'#dab17b');
  this.r(149,125,15,5,'#d8a3af');this.r(151,123,12,3,'#f4c9c7');
  this.r(149,132,15,1,'#e0b782');this.r(149,138,15,1,'#e0b782');
  // Quilt fringe is decorative, with no invisible new obstacles.
  for(let x=46;x<108;x+=5)this.r(x,204,2,3,'#f3c7cd');
}
details(o,t){
  const {x,y,w,h}=o;
  const r=(a,b,c,d,color)=>this.r(x+a,y+b,c,d,color);
  if(o.type==='bed'){
    r(9,-5,w-18,1,'#e5b77b');r(12,-3,1,8,'#815838');r(w-13,-3,1,8,'#815838');
    r(9,12,22,1,'#e0c5b2');r(41,12,21,1,'#e0c5b2');
    for(let row=0;row<3;row++)for(let col=0;col<4;col++){
      const a=12+col*14,b=47+row*13;
      r(a,b,3,1,'#f5d4cf');r(a+1,b-1,1,3,'#f5d4cf');r(a+1,b+1,1,1,'#db9cab');
    }
    r(7,42,w-14,1,'#b8789244');r(8,82,w-16,1,'#ffe8d544');
  }
  if(o.type==='sofa'){
    for(let i=14;i<w-14;i+=13){r(i,3,2,2,'#a46d80');r(i+1,3,1,1,'#e6b6bc');}
    r(12,29,24,1,'#edc4bf');r(47,29,22,1,'#edc4bf');
    r(1,9,3,21,'#d7a1ac');r(w-5,9,3,21,'#c18c9e');
    for(let i=0;i<4;i++){r(58+i*3,1,1,22,'#b4bf9a');r(58+i*3,23,1,4,'#b4bf9a');}
    r(17,3,7,1,'#f3dcc2');r(20,1,1,8,'#f3dcc2');
  }
  if(o.type==='shelf'){
    for(let row=0;row<2;row++)for(let i=0;i<8;i++)r(6+i*5,-5+row*22,3,1,'#e2c48a');
    r(4,-20,w-8,1,'#c29a62');r(3,8,w-6,1,'#ddad70');
  }
  if(o.type==='counter'){
    // Teapot, lid, spout, cup and a small patterned backsplash.
    r(49,-3,12,7,'#b0bda6');r(51,-5,8,3,'#d4ddc1');r(54,-7,2,2,'#7c8d75');
    r(60,-2,4,2,'#d4ddc1');r(47,-2,2,5,'#718871');
    r(3,-1,7,5,'#f2d2c4');r(4,-1,5,1,'#8c654b');r(9,0,2,2,'#f2d2c4');
    for(let i=4;i<w;i+=8){r(i,-13,4,1,'#dbc69d');r(i+1,-12,2,1,'#b88f77');}
    r(2,28,w-4,1,'#825e3e');
  }
  if(o.type==='table'){
    r(11,6,12,1,'#d3d4b4');r(11,9,12,1,'#c0c7a5');r(26,3,1,10,'#6e836d');
    const steam=Math.round((t*7)%9);r(40,1-steam,1,3,'#f9e5c077');
    r(6,15,w-12,1,'#d1a16c');
  }
  if(o.type==='plant'){
    for(let i=0;i<4;i++){
      r(1+i*5,-2+i%2*4,4,2,'#a0b083');r(4+i*4,4-i%2*4,3,1,'#b8c396');
    }
    r(5,17,w-10,1,'#e8bda0');r(6,h-4,w-12,1,'#936a51');
  }
  if(o.type==='fire'){
    r(13,h-9,25,3,'#775038');r(17,h-10,2,3,'#b48650');r(32,h-10,2,3,'#b48650');
    for(let i=0;i<7;i++){
      const rise=(t*13+i*7)%26;
      r(15+i*4,h-9-Math.round(rise),1,2,rise<17?'#ffe3a5':'#dca15b');
    }
  }
}
atmosphere(player,interactions,t){
  // Slow, translucent sunbeams and dust motes; reduced motion keeps these still.
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock=still?0:t;
  this.g.fillStyle='#ffe8ae0b';
  for(const x of [80,345]){
    this.g.beginPath();this.g.moveTo(x,90);this.g.lineTo(x+25,90);
    this.g.lineTo(x+65,176);this.g.lineTo(x+16,176);this.g.fill();
  }
  for(let i=0;i<14;i++){
    const x=45+(i*47)%385+Math.sin(clock*.18+i)*5;
    const y=104+(i*23+clock*1.5)%202;
    this.r(x,y,1,1,'#ffebba66');
  }
  if(interactions.pose==='tea')for(let i=0;i<3;i++){
    const rise=(clock*10+i*7)%21;
    this.r(player.x+Math.sin(rise*.3)*2,player.y-24-rise,1,3,'#fff2dba0');
  }
}
render(scene,player,interactions,near,t){this.g.drawImage(this.static,0,0);const list=scene.objects.filter(o=>!(o.id==='luna'&&interactions.pose==='hug')).map(o=>({depth:o.depth,draw:()=>this.object(o,t)}));list.push({depth:player.y,draw:()=>{this.g.fillStyle='#49372f44';this.g.beginPath();this.g.ellipse(player.x,player.y,9,3,0,0,Math.PI*2);this.g.fill();const f=player.walking?Math.floor(player.time*9)%4:0;this.g.drawImage(this.assets.getStella(player.direction,f,interactions.pose),Math.round(player.x)-16,Math.round(player.y)-48);}});list.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
// Gentle hearth glow without washing out the pixel art.
const glow=this.g.createRadialGradient(268,109,2,268,109,84);glow.addColorStop(0,'#ffc77b18');glow.addColorStop(1,'#ffc77b00');this.g.fillStyle=glow;this.g.fillRect(180,50,180,150);if(near&&!interactions.open){this.g.fillStyle='#fff0c7';this.g.font='11px Georgia';this.g.textAlign='center';this.g.fillText('♡',near.x+near.w/2,near.y-8+Math.sin(t*3)*2);}for(const h of interactions.hearts){this.g.globalAlpha=Math.min(1,h.life);this.g.fillStyle='#f2a3b6';this.g.font='13px Georgia';this.g.fillText('♥',h.x,h.y);}this.g.globalAlpha=1;this.atmosphere(player,interactions,t);
const c=this.canvas,ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#29382f';ctx.fillRect(0,0,c.width,c.height);const ratio=c.width/c.height;let vw=480,vh=360;if(ratio<1.2){vw=Math.max(205,360*ratio);vh=360;}const sx=Math.max(0,Math.min(480-vw,player.x-vw/2)),sy=Math.max(0,Math.min(360-vh,player.y-vh/2-15));const scale=Math.min(c.width/vw,c.height/vh),dw=vw*scale,dh=vh*scale;ctx.drawImage(this.buffer,sx,sy,vw,vh,(c.width-dw)/2,(c.height-dh)/2,dw,dh);}
}
