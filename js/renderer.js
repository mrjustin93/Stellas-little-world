import {cropStatus} from './cozy-goals.js';
import {Art} from './art.js';
import {RenderedStella} from './stella-rendered.js';
export class Renderer {
 constructor(canvas){this.canvas=canvas;this.g=canvas.getContext('2d');this.a=new Art(this.g);this.stella=new RenderedStella();this.motion=matchMedia('(prefers-reduced-motion: reduce)');new ResizeObserver(()=>this.resize()).observe(canvas);this.resize();}
 resize(){const r=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(r.width*d);this.canvas.height=Math.round(r.height*d);}
 room(scene){if(scene.id==='garden'){if(!this.land){this.land=document.createElement('canvas');this.land.width=scene.width;this.land.height=scene.height;const g=this.g,a=this.a;this.g=this.land.getContext('2d');this.a=new Art(this.g);this.drawRoom(scene);this.g=g;this.a=a;}this.g.drawImage(this.land,0,0);return;}this.drawRoom(scene);}
 drawRoom(scene){const a=this.a,g=this.g;const outside=scene.id==='garden';
 a.round(0,0,scene.width,scene.height,outside?a.gradient(0,0,680,'#b6ce95','#7da77e'):'#425e50',0);
 if(scene.id==='bathroom'){
  a.box(18,27,284,260,'#c6d4c7');a.round(25,80,270,200,'#e9e2d2',2);
  for(let y=82;y<279;y+=20)for(let x=27;x<295;x+=20)a.round(x,y,18,18,(x+y)%40<20?'#d3ddd1':'#f3ecdf',1);
  a.round(24,30,272,50,a.gradient(24,30,50,'#f0d3da','#d2b3c4'),3);a.line([[24,79],[296,79]],'#fff0dc',3);return;
 }
 if(outside){
  // Curving cream paths and a grassy meadow, with stable flower placement.
  a.line([[223,130],[223,153],[311,175],[320,327],[230,353],[170,356]],'#c6b992',26);a.line([[223,130],[223,153],[311,175],[320,327],[230,353],[170,356]],'#dfd1ab',21);
  a.line([[320,350],[530,350],[530,135]],'#c6b992',26);a.line([[320,350],[530,350],[530,135]],'#dfd1ab',21);a.line([[530,350],[670,480],[720,590]],'#c6b992',26);a.line([[530,350],[670,480],[720,590]],'#dfd1ab',21);
  for(let i=0;i<300;i++){const x=20+(i*79)%800,y=24+(i*97)%630;if(x>55&&x<295&&y>170&&y<342)continue;if(x>145&&x<295&&y<145)continue;const c=['#f4dfb1','#ecb7c7','#fff0cf'][i%3];if(i%3===0)a.flower(x,y,c);else a.line([[x-2,y],[x-3,y-3],[x,y],[x+2,y-4]],'#6e986a66',.8);}
  a.round(66,185,208,144,'#91ab73',4);return;
 }
 a.box(18,27,444,313,'#bb8d67');a.round(26,92,428,239,a.gradient(0,90,245,'#d5ae81','#ba8f69'),2);
 for(let y=96;y<332;y+=16){a.line([[27,y],[453,y]],'#99735066',.7);for(let x=30+(y%32)*3;x<452;x+=78){a.line([[x,y],[x,y+16]],'#a17a5655',.7);a.line([[x+8,y+6],[Math.min(x+50,450),y+5]],'#e8c69c66',.6);}}
 a.round(24,30,432,60,a.gradient(0,30,60,'#b78d6a','#967453'),2);for(let y=42;y<90;y+=14)a.line([[26,y],[454,y]],'#d4af8644',1);a.round(18,29,10,310,'#795b45',3);a.round(451,29,10,310,'#795b45',3);a.round(24,85,430,8,'#826046',2);
 for(const [x,y,w,h,c] of [[32,216,110,70,'#d4a1ad'],[184,211,122,76,'#ded0b2'],[346,246,69,33,'#a5b496']]){a.round(x,y,w,h,'#83634f33',12);a.round(x+1,y,w-2,h-3,c,11);g.strokeStyle='#fff2d388';g.lineWidth=1;g.beginPath();g.roundRect(x+6,y+6,w-12,h-15,8);g.stroke();for(let i=15;i<w-10;i+=16)a.flower(x+i,y+11,'#f4ddcf');}
 }
 object(o,t){const a=this.a,g=this.g,{x,y,w,h}=o;
 if(o.type==='house'&&w!==140){g.save();g.translate(x,y);g.scale(w/140,h/90);this.object({...o,x:0,y:0,w:140,h:90},t);g.restore();return;}
 const cushion=(px,py,pw,ph,c)=>{a.round(px,py+2,pw,ph,'#8d667055',6);a.round(px,py,pw,ph,a.gradient(px,py,ph,c,'#c08c9b'),6);};
 switch(o.type){
 case 'closet':
  a.shadow(x+w/2,y+h,w*.6,4);a.round(x,y-35,w,h+35,a.gradient(x,y-35,h+35,'#d7b28b','#a57d5c'),4);a.round(x+3,y-31,w/2-4,h+28,'#e7c6a5',2);a.round(x+w/2+1,y-31,w/2-4,h+28,'#e3bea1',2);a.line([[x+w/2,y-29],[x+w/2,y+h-5]],'#ba9475',1);a.oval(x+w/2-5,y+5,1.5,2,'#a37363');a.oval(x+w/2+5,y+5,1.5,2,'#a37363');a.flower(x+w/2,y-23,'#f2bbcf');break;
 case 'room-door':
  a.round(x,y,w,h,'#cdb1bf',5);a.line([[x+4,y+4],[x+w-4,y+4]],'#fff3dc',1);g.fillStyle='#70556b';g.font='8px Georgia';g.textAlign='center';g.fillText(o.id==='bathroom-exit'?'Cabin ↓':'Bath →',x+w/2,y+16);break;
 case 'tub':
  a.shadow(x+w/2,y+h,w*.5,4);a.round(x,y+10,w,h-10,a.gradient(x,y,h,'#fff8ed','#d3dcd4'),16);a.oval(x+w/2,y+23,w*.44,18,'#faf7ed');a.oval(x+w/2,y+24,w*.37,12,'#b5d9da');a.line([[x+12,y+13],[x+12,y+4],[x+21,y+4]],'#b9b39d',3);a.line([[x-2,y-22],[x+w+2,y-22]],'#b99b7f',2);a.round(x+3,y-19,31,65,a.gradient(x,y-19,65,'#f3c4d7','#ce97b6'),3);for(let i=8;i<30;i+=7)a.line([[x+i,y-18],[x+i,y+44]],'#fff0de66',1);a.flower(x+85,y+47,'#e9b4cc');break;
 case 'washbasin':
  a.round(x+9,y-43,w-18,40,'#c3aa87',12);a.round(x+12,y-40,w-24,34,a.gradient(x,y-40,35,'#e3eef0','#adc9cf'),10);a.line([[x+18,y-33],[x+24,y-36]],'#ffffff88',2);a.box(x,y+8,w,h-8,'#b8cdb8');a.round(x-3,y,w+6,16,'#fff5e4',4);a.oval(x+w/2,y+6,19,6,'#b8d3d0');a.line([[x+w/2,y+3],[x+w/2,y-7],[x+w/2+5,y-7]],'#aaa995',2);a.round(x+4,y-4,8,5,'#e4a9bf',2);a.oval(x+w/2,y+31,1.5,1.5,'#8a947c');break;
 case 'toilet':
  a.round(x+7,y-8,w-14,24,'#f8f3e9',4);a.oval(x+w/2,y+24,w*.43,19,'#e5e8df');a.oval(x+w/2,y+20,w*.36,14,'#fff9ee');a.oval(x+w/2,y+20,w*.22,9,'#bcced0');a.round(x+11,y+35,w-22,14,'#e8e5db',4);a.round(x+w-12,y-4,5,2,'#acb1a3',1);break;
 case 'towels':
  a.line([[x,y-5],[x+w,y-5]],'#b39a7c',2);for(let i=0;i<3;i++){a.round(x+4+i*16,y-5,13,h+5,['#f0c5d5','#fff2d9','#c1d6c5'][i],2);a.line([[x+6+i*16,y+h-3],[x+15+i*16,y+h-3]],'#ffffff77',1);}break;
 case 'bathmat':a.round(x,y,w,h,'#e1b4c7',10);for(let i=6;i<h-3;i+=5)a.line([[x+6,y+i],[x+w-6,y+i]],'#f9dbe5',1);break;
 case 'window':a.round(x-4,y-4,w+8,h+8,'#755a46',4);a.round(x,y,w,h,a.gradient(x,y,h,'#9fcbd6','#deebce'),2);for(let i=0;i<6;i++){const tx=x+8+i*10;a.shape([[tx,y+9+i%2*6],[tx-10,y+36],[tx+10,y+36]],'#6f9b8d');a.line([[tx,y+28],[tx,y+42]],'#648474',1);}a.line([[x+w/2,y],[x+w/2,y+h]],'#f0d8af',3);a.line([[x,y+22],[x+w,y+22]],'#f0d8af',3);a.round(x-8,y-3,8,h+5,'#e6b6c3',3);a.round(x+w,y-3,8,h+5,'#e6b6c3',3);a.round(x-6,y+h-1,w+12,5,'#dbc19a',2);break;
 case 'bed':a.box(x,y-9,w,h+9,'#ac7e58');a.round(x+3,y-12,w-6,24,a.gradient(x,y-12,24,'#ceaa7b','#ad805b'),9);a.round(x+4,y+7,w-8,h-16,'#f8e8d2',7);cushion(x+7,y+9,26,18,'#fff7e6');cushion(x+39,y+9,26,18,'#fff7e6');a.round(x+3,y+33,w-6,h-39,a.gradient(x,y+33,65,'#f2c0d0','#cf8fad'),5);a.round(x+3,y+31,w-6,10,'#f9d4dd',4);for(let i=0;i<12;i++)a.flower(x+13+(i%4)*15,y+48+Math.floor(i/4)*15,'#f9dde1');break;
 case 'bear':a.bear(x+w/2,y+h-2,.75);break;
 case 'lamp':a.box(x,y+9,w,h-9,'#bc906c');a.round(x+3,y+14,w-6,10,'#d4ac84',2);a.oval(x+w/2,y+19,1.5,1,'#98774e');a.line([[x+12,y+6],[x+12,y-8]],'#b99462',2);a.oval(x+12,y+7,7,2,'#9c7958');a.shape([[x+5,y-17],[x+19,y-17],[x+23,y-4],[x+1,y-4]],'#ffe6ab');a.oval(x+12,y-4,11,2,'#fff0c6');break;
 case 'sofa':a.shadow(x+w/2,y+h,w/2,5);cushion(x,y-7,w,37,'#e4b2c3');cushion(x+7,y+17,33,19,'#efc4cf');cushion(x+43,y+17,33,19,'#efc4cf');cushion(x-4,y+6,13,33,'#dca3b9');cushion(x+w-9,y+6,13,33,'#dca3b9');cushion(x+13,y,18,16,'#f5e1c7');a.round(x+57,y+2,15,29,'#a7baa0',4);for(let i=0;i<4;i++)a.line([[x+59+i*3,y+4],[x+59+i*3,y+32]],'#d4dfbd',.7);break;
 case 'table':case 'dining':a.line([[x+7,y+12],[x+7,y+h]],'#906d4d',4);a.line([[x+w-7,y+12],[x+w-7,y+h]],'#906d4d',4);a.box(x,y,w,20,'#d3b08a');if(o.type==='table'){a.round(x+9,y+4,19,10,'#7e9c8b',2);a.line([[x+12,y+6],[x+24,y+6]],'#e5e1bd',1);a.round(x+37,y+4,8,7,'#fff1da',2);a.oval(x+41,y+4,4,1.5,'#907354');}else{a.oval(x+28,y+10,5,5,'#e9b9c7');a.line([[x+28,y+8],[x+28,y-3]],'#80a06d',1);a.flower(x+28,y-3);}break;
 case 'plant':a.box(x+3,y+14,w-6,h-14,'#dfae8f');for(let i=0;i<7;i++){const an=i*2.4;a.line([[x+w/2,y+14],[x+w/2+Math.cos(an)*8,y+3+Math.sin(an)*7]],'#648957',1.3);g.save();g.translate(x+w/2+Math.cos(an)*8,y+3+Math.sin(an)*7);g.rotate(an);a.oval(0,0,6,3,i%2?'#8fb47e':'#6a996d');g.restore();}break;
 case 'shelf':a.box(x,y-23,w,h+23,'#bb8e62');a.round(x+4,y-18,w-8,h+13,'#775e49',2);for(let row=0;row<2;row++){for(let i=0;i<8;i++){const bx=x+6+i*5,by=y-14+row*22;a.round(bx,by,4,16-i%3,['#bf8d9e','#a8ba97','#d2af7e','#8fb0af'][i%4],.7);a.line([[bx+1,by+3],[bx+3,by+3]],'#fff0ce',.7);}a.round(x+2,y+4+row*22,w-4,3,'#d4ae7e',1);}break;
 case 'fire':a.box(x-3,y,w+6,h,'#b9b0a0');a.round(x+8,y+13,w-16,h-14,'#52473f',12);for(let i=0;i<5;i++){a.oval(x+17+i*6,y+h-9,4,7+Math.sin(t*5+i)*3,'#edac59');a.oval(x+18+i*6,y+h-8,2,4,'#ffe0a1');}a.round(x-7,y-4,w+14,8,'#c19875',3);break;
 case 'counter':a.box(x,y,w,h,'#c3a17c');for(let i=0;i<2;i++){a.round(x+4+i*34,y+12,27,16,'#e2c5a0',2);a.oval(x+24+i*22,y+16,1.5,1.5,'#987a57');}a.round(x-2,y-2,w+4,10,'#eee3cc',3);a.round(x+16,y,29,6,'#9db9b6',3);a.line([[x+29,y],[x+29,y-7],[x+34,y-7]],'#cbd6d1',2);a.oval(x+56,y,6,5,'#a8c1a3');a.oval(x+56,y-5,4,1.5,'#d7e4ca');break;
 case 'fridge':a.box(x,y,w,h,'#e2e7d7');a.line([[x+2,y+18],[x+w-2,y+18]],'#a6b5a3',1);a.line([[x+5,y+8],[x+5,y+13]],'#93a896',1.5);a.line([[x+5,y+24],[x+5,y+32]],'#93a896',1.5);a.round(x+13,y+25,8,9,'#efb7cc',1);break;
 case 'door':a.round(x,y,w,h,'#a4b18a',5);a.line([[x+5,y+5],[x+w-5,y+5]],'#ece4c7',1);g.fillStyle='#fff5dc';g.font='9px Georgia';g.textAlign='center';g.fillText('Garden ↓',x+w/2,y+18);break;
 case 'house':a.shadow(x+w/2,y+h+3,w*.6,8);a.round(x,y,w,h,'#d1ad80',4);for(let j=12;j<h;j+=12)a.line([[x,y+j],[x+w,y+j]],'#ad875f',1);a.shape([[x-15,y+5],[x+w/2,y-48],[x+w+15,y+5],[x+w+10,y+17],[x-10,y+17]],a.gradient(x,y-40,60,'#8ca99a','#577b71'));for(let i=0;i<6;i++)a.line([[x-5+i*25,y+8],[x+w/2,y-40]],'#b7c7ae44',1);a.round(x+59,y+44,29,46,'#8e7160',12);a.oval(x+82,y+69,2,2,'#eac784');for(const dx of [17,104]){a.round(x+dx,y+40,23,26,'#fff0c8',3);a.round(x+dx+3,y+43,17,20,'#8dbdc7',2);a.line([[x+dx+11,y+43],[x+dx+11,y+63]],'#f3e4c5',2);}break;
 case 'entry':a.round(x-3,y,w+6,h,'#d6bd91',3);break;
 case 'fence':case 'gate':{const vertical=h>w,open=o.open;a.shadow(x+w/2,y+h,Math.max(w/2,5),3);const end=open?x+8:x+w;a.line([[x,y-10],[vertical?x:end,vertical?y+h-10:y-10]],'#c5a17a',3);a.line([[x,y-3],[vertical?x:end,vertical?y+h-3:y-3]],'#ecd0a3',3);const len=vertical?h:open?8:w;for(let i=0;i<=len;i+=12){const px=vertical?x:x+i,py=vertical?y+i:y;a.round(px-2,py-18,4,22,a.gradient(px,py-18,22,'#f1d8af','#c19b72'),1.5);}if(o.type==='gate'&&!open)a.line([[x+3,y-13],[x+w-3,y-2]],'#a88059',2);break;}
 case 'plot':a.round(x-2,y-1,w+4,h+4,'#7c885b',5);a.round(x,y,w,h,a.gradient(x,y,h,o.stage>=2?'#725746':'#9b7455',o.stage>=2?'#4e4038':'#765741'),4);for(let j=5;j<h;j+=8)a.line([[x+3,y+j],[x+w-3,y+j]],o.stage>=2?'#aa948044':'#c0966c66',2);if(o.stage===2)for(let i=0;i<5;i++)a.oval(x+5+i*7,y+6+(i%2)*13,1.8,.6,'#a8c5c14d');if(o.stage)for(let i=0;i<4;i++){const px=x+9+(i%2)*20,py=y+9+Math.floor(i/2)*12;a.oval(px-2,py,4,2,'#88b56c');a.oval(px+2,py-2,3,2,'#bad18b');if(o.stage===3){a.oval(px,py+2,2.8,3,'#dd6e7d');a.oval(px-.5,py+1,.5,.6,'#ffe6b4');}}break;
 case 'reward-pot':
  a.shadow(x+w/2,y+h,w*.6,2);a.round(x+2,y+11,w-4,9,a.gradient(x,y+11,10,'#f3c8d8','#ca8da6'),3);a.oval(x+w/2,y+11,w*.45,2.5,'#ecc6d2');
  for(let i=0;i<3;i++){const px=x+4+i*4,py=y+4-(i%2)*4;a.line([[x+w/2,y+12],[px,py]],'#709261',1);a.oval(px+2,py+5,3,1.5,'#9cb47e');a.flower(px,py,['#f6d1df','#fff1c3','#e7a6bf'][i]);}a.shape([[x+5,y+15],[x+8,y+17],[x+11,y+15],[x+8,y+19]],'#fff1df');break;
 case 'reward-border':
  a.round(x,y+7,w,3,'#8c77594d',3);for(let i=0;i<Math.floor(w/7);i++){const px=x+4+i*7,py=y+4+(i%3);a.line([[px,y+9],[px,py]],'#63885c',1);a.oval(px-2,py+3,3,1.4,'#8eab72');a.flower(px,py,['#f4b7cb','#fff0c2','#f6dce6'][i%3]);}break;
 case 'reward-lanterns':
  a.line([[x,y+2],[x+w*.25,y+9],[x+w*.5,y+11],[x+w*.75,y+9],[x+w,y+2]],'#8f7660',.8);
  for(let i=0;i<5;i++){const px=x+12+i*(w-24)/4,py=y+7+Math.sin((i+1)/6*Math.PI)*6;a.line([[px,py],[px,py+4]],'#a48b6d',.8);a.oval(px,py+12,10,12,'#ffe9ab22');a.round(px-4,py+3,8,13,a.gradient(px,py+3,13,'#fff4be','#edbd7e'),3);a.line([[px-3,py+7],[px+3,py+7]],'#cb976b66',.6);a.oval(px,py+9,1,2,'#fffad4');}break;
 case 'pond':a.oval(x+w/2,y+h/2,w/2+5,h/2+5,'#aac29a');a.oval(x+w/2,y+h/2,w/2+2,h/2+2,'#dac9a3');a.oval(x+w/2,y+h/2,w/2,h/2,a.gradient(x,y,h,'#7dcddd','#439ec4'));for(let i=0;i<5;i++){g.beginPath();g.ellipse(x+20+i*13,y+18+i%2*20,7+Math.sin(t+i)*2,2,0,0,Math.PI);g.strokeStyle='#d6f5ef88';g.lineWidth=1;g.stroke();}a.oval(x+65,y+12,7,4,'#7fad80');a.flower(x+64,y+11,'#f4d2e3');break;
 case 'picnic':a.round(x-4,y,w+8,h,'#d1af9177',8);a.round(x,y,w,h,'#edc6c4',6);for(let i=4;i<w;i+=10)a.line([[x+i,y+2],[x+i,y+h-2]],'#fff1d4aa',3);for(let i=4;i<h;i+=10)a.line([[x+2,y+i],[x+w-2,y+i]],'#fff1d4aa',3);a.box(x+8,y+8,22,15,'#bd9768');a.oval(x+60,y+25,12,7,'#fff2dc');a.oval(x+59,y+23,4,3,'#d37c88');if(o.celebrated){for(let i=0;i<3;i++)a.oval(x+55+i*5,y+24,2,2.5,'#dd788b');a.flower(x+42,y+15,'#f9e4c2');a.round(x+72,y+14,7,8,'#fff2da',2);}break;
 case 'basket':a.box(x,y+4,w,h-4,'#b68e62');for(let i=4;i<w;i+=5)a.line([[x+i,y+6],[x+i,y+h-2]],'#e4bf89',1);a.round(x+4,y-1,w-8,10,'#f5e2b9',2);a.flower(x+w/2,y+3,'#e9b1bf');break;
 case 'flowers':for(let i=0;i<8;i++){const px=x+4+i*11%30,py=y+4+i*7%20;a.line([[px,py+5],[px,py]],'#648a5b',1);a.flower(px,py,['#f1bed0','#f9e8b8','#fff4df'][i%3]);}break;
 case 'sign':a.line([[x+12,y+5],[x+12,y+h]],'#9e7b56',3);a.round(x,y-5,w,14,'#e7cfa6',2);a.line([[x+5,y+2],[x+20,y+2],[x+17,y-1]],'#8a7660',1);break;
 case 'tree':a.shadow(x+7,y+8,23,8);a.round(x+3,y-25,8,34,'#a2825e',3);for(const [dx,dy,rx,ry] of [[-12,-29,18,18],[11,-30,21,21],[0,-48,20,22]])a.oval(x+7+dx,y+dy,rx,ry,a.gradient(x,y-65,55,'#a6c490','#608f73'));break;
 }
 }
 render(scene,p,interactions,near,t,clock){const g=this.g,a=this.a,c=this.canvas;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c.width,c.height);g.fillStyle='#344f43';g.fillRect(0,0,c.width,c.height);
 const ratio=c.width/c.height,vh=(scene.id==='garden'?400:360)/(this.zoom||1),vw=ratio<1.2?Math.max(245,vh*ratio):480;const scale=Math.min(c.width/vw,c.height/vh),sx=Math.max(0,Math.min(scene.width-vw,p.x-vw/2)),sy=Math.max(0,Math.min(scene.height-vh,p.y-vh/2-20));this.camera={x:sx,y:sy,w:vw,h:vh};g.save();g.translate((c.width-vw*scale)/2-sx*scale,(c.height-vh*scale)/2-sy*scale);g.scale(scale,scale);this.room(scene);
 const time=this.motion.matches?0:t,list=scene.objects.filter(o=>!o.hidden&&o.x+o.w>sx-80&&o.x<sx+vw+80&&o.y+o.h>sy-80&&o.y<sy+vh+100&&!(o.id==='luna'&&interactions.pose==='hug')).map(o=>({depth:o.depth,draw:()=>this.object(o,time)}));list.push({depth:p.y,draw:()=>this.stella.draw(a,p,interactions.pose,time)});list.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
 for(const plot of scene.objects.filter(o=>o.type==='plot'&&o.stage>0)){
  const status=cropStatus(plot,clock),x=plot.x+plot.w/2,y=plot.y-8;
  a.round(x-12,y-5,24,9,'#fff3dce8',4);g.textAlign='center';g.fillStyle='#765568';g.font='7px system-ui';
  if(plot.stage===2){a.round(x-9,y-2,18,3,'#d8ceaa',1);if(status.progress>0)a.round(x-9,y-2,Math.max(1,18*status.progress),3,'#80a875',1);}
  else g.fillText(plot.stage===1?'Water':'Ripe',x,y+2);
 }
 this.stella.effects(a,p);
 if(clock.darkness){g.fillStyle=`rgba(27,42,85,${clock.darkness*(scene.id==='garden'?1:.55)})`;g.fillRect(0,0,scene.width,scene.height);if(scene.id==='cabin'){const glow=g.createRadialGradient(268,100,1,268,100,90);glow.addColorStop(0,'#ffc56c50');glow.addColorStop(1,'#ffc56c00');g.fillStyle=glow;g.fillRect(175,20,185,180);}}
 if(near&&!interactions.open){a.oval(near.x+near.w/2,near.y-24,8,8,'#fff5e8e8');g.fillStyle='#ae6b8c';g.textAlign='center';g.font='12px Georgia';g.fillText('♡',near.x+near.w/2,near.y-20);}
 for(const h of interactions.hearts){g.globalAlpha=Math.min(1,h.life);g.fillStyle='#f0a4c1';g.font='13px Georgia';g.fillText('♥',h.x,h.y);}g.globalAlpha=1;g.restore();if(interactions.open)this.stella.portrait(document.querySelector("#stella-portrait"));
 }
}
