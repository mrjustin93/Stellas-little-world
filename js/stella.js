// Original vector source for a 16-direction animation sheet. The first concept
// guides the heart-shaped face, blue almond eyes, swept pixie, hoodie and shorts.
export const SHEET={columns:14,rows:16,cellWidth:120,cellHeight:216,scale:3,anchorX:20,anchorY:68,walkFrames:12};
export function drawStella(a,angle,phase=0,moving=false,blink=false,pose=''){
 const g=a.g,rawSide=Math.sin(angle),side=Math.abs(rawSide),back=Math.cos(angle)<-.32,profile=Math.abs(side),front=Math.max(0,Math.cos(angle));
 g.save();if(rawSide<0)g.scale(-1,1);
 const curve=(path,fill,stroke,width=.5)=>{g.beginPath();path(g);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}};
 const skin=a.gradient(0,-58,26,'#ffe0bd','#e8ab8f'),pink=a.gradient(0,-40,22,'#f6b5cd','#cb7e9f');
 const swing=moving?Math.sin(phase*Math.PI*2):0,bob=moving?Math.cos(phase*Math.PI*4)*.35:0;
 const spread=4*(1-profile*.65);
 const leg=(sign)=>{const x=sign*spread,step=swing*sign,forward=step*2.5,lift=moving?Math.max(0,Math.cos(phase*Math.PI*2)*sign)*1.8:0;
  a.line([[x,-20],[x+side*forward,-11+forward*.3-lift*.5],[x+side*forward,-3+forward-lift]],'#dca188',4.3);
  a.line([[x-.4,-20],[x+side*forward-.4,-11+forward*.3-lift*.5],[x+side*forward-.4,-3+forward-lift]],'#f4c8a9',3);
  a.line([[x+side*forward,-6+forward-lift],[x+side*forward,-3+forward-lift]],'#faf4e9',4.2);
  a.oval(x+side*(forward+1),-1.7+forward-lift,3.2,1.9,a.gradient(0,-4+forward-lift,5,'#f4bfd0','#b86b8e'));
  a.line([[x-1+side*forward,-2+forward-lift],[x+1+side*forward,-2+forward-lift]],'#fff6eb',.6);
 };
 leg(side>0?-1:1);leg(side>0?1:-1);
 g.save();g.translate(0,bob);
 const torso=1-profile*.23;
 g.save();g.scale(torso,1);
 a.round(-6.3,-26,12.6,8,pink,2.5);a.line([[-5.3,-19.4],[-1,-19.4],[0,-22],[1,-19.4],[5.3,-19.4]],'#ffe0e3',.8);
 a.line([[-5.5,-25],[5.5,-25]],'#fbd5df',1);a.line([[0,-24],[-1,-21],[0,-22],[1,-21]],'#fff1e3',.65);
 a.round(-6,-41,12,16,pink,3.8);
 if(!back){a.round(-3.3+side,-38,6.6,12,'#fff8ed',2);a.line([[-4,-38],[-4,-27]],'#fbd4df',.8);a.line([[4,-38],[4,-27]],'#b56b8d',.7);a.line([[-2,-37],[0,-33],[2,-37]],'#b69a6a',.45);curve(q=>{q.moveTo(0,-31);q.bezierCurveTo(-4,-34,-1,-35,0,-33.5);q.bezierCurveTo(2,-36,4,-33,0,-31);},'#d97ca6');}
 else {a.oval(0,-36.5,4.8,3.5,'#e8a0bd');a.line([[-4,-37],[0,-34],[4,-37]],'#ffd1de',.8);a.line([[-3,-28],[3,-28]],'#be7094',.6);}
 g.restore();
 for(const sign of [-1,1]){const ax=sign*6.8*torso,step=sign*swing*1.8;a.line([[ax*.75,-38],[ax+side*step,-31+step],[ax+side*step,-25+step]],'#c980a1',3.8);a.line([[ax*.75-.4,-38],[ax+side*step-.4,-31+step],[ax+side*step-.4,-26+step]],'#f0acc7',2.8);a.oval(ax+side*step,-24.7+step,1.5,2,'#f6c6a7');}
 a.round(-2,-44,4,5,skin,1);
 // Hair volume sits behind a tapered jaw rather than a circular doll face.
 a.oval(0,-51.5,8.1,10,a.gradient(0,-62,20,'#e9bd75','#b98240'));
 g.save();g.translate(side*1.2,-.2);g.scale(1-profile*.2,1);
 if(!back){
  curve(q=>{q.moveTo(-6.6,-54);q.bezierCurveTo(-8,-46,-4,-42,0,-41.2);q.bezierCurveTo(4.6,-42,7.5,-47,6.4,-54);q.bezierCurveTo(3,-59,-3,-59,-6.6,-54);},skin);
  a.oval(side>0?-6.7:6.7,-48.5,1.3,2,'#edb292');
  const faceX=side*1.8;
  for(const sign of [-1,1]){
   if(profile>.9&&sign*side<0)continue;
   const ex=faceX+sign*2.95,ey=-49.2,ew=1.9*(sign*side<0?1-profile*.4:1);
   if(blink||pose==='hug')curve(q=>{q.moveTo(ex-ew,ey);q.quadraticCurveTo(ex,ey+1,ex+ew,ey-.1);},null,'#79534b',.55);
   else{
    curve(q=>{q.moveTo(ex-ew,ey);q.bezierCurveTo(ex-ew*.4,ey-2,ex+ew*.5,ey-1.9,ex+ew,ey-.1);q.bezierCurveTo(ex+ew*.4,ey+1.2,ex-ew*.6,ey+1.3,ex-ew,ey);},'#fff8ee');
    a.oval(ex+side*.25,ey-.15,.95,1.3,a.gradient(ex,ey-1.5,3,'#77c2e5','#286b9d'));a.oval(ex+side*.3,ey-.1,.43,.95,'#284b69');a.oval(ex-.3,ey-.65,.34,.4,'#ffffff');
    curve(q=>{q.moveTo(ex-ew-.3,ey-.3);q.quadraticCurveTo(ex,ey-2.2,ex+ew,ey-.3);},null,'#765147',.5);
    a.line([[ex+ew,ey-.4],[ex+ew+.4,ey-.9]],'#765147',.4);
   }
   curve(q=>{q.moveTo(ex-ew,ey-2.8);q.quadraticCurveTo(ex,ey-3.8,ex+ew,ey-3);},null,'#af804f',.6);
   a.oval(ex,ey+2,1.5,.55,'#e79a9160');
  }
  curve(q=>{q.moveTo(faceX+.2,-48.7);q.quadraticCurveTo(faceX+1,-46.8,faceX+.4,-46.5);},null,'#c68e78',.45);
  curve(q=>{q.moveTo(faceX-1.7,-44.7);q.quadraticCurveTo(faceX,-43.3,faceX+1.7,-44.8);q.quadraticCurveTo(faceX,-44.3,faceX-1.7,-44.7);},'#b96e78');
  a.line([[faceX-.8,-44.55],[faceX+.7,-44.55]],'#fff0df',.4);
 }
 // Curved individual locks make an asymmetric, tousled pixie silhouette.
 const locks=back?[[0,-61,-8,-56,-6,-46],[3,-61,-2,-57,-1,-44],[5,-60,8,-54,6,-46],[-3,-60,-9,-55,-7,-48]]:[[-1,-61,-11,-58,-6,-49],[3,-61,-5,-60,-4,-52],[6,-60,1,-59,-1,-52],[7,-57,4,-57,6,-50],[-4,-59,-9,-56,-7,-46]];
 for(const [x,y,cx,cy,ex,ey] of locks){curve(q=>{q.moveTo(x,y);q.bezierCurveTo(cx,cy,cx,ey,ex,ey);q.bezierCurveTo(ex+3,ey-2,x+5,y+3,x,y);},a.gradient(x,y,13,'#ffe3a3','#d6a353'),'#bf8c4c55',.4);curve(q=>{q.moveTo(x+.4,y+1.3);q.quadraticCurveTo(cx+2,cy+1,ex+.6,ey-2);},null,'#fff0be99',.5);}
 // Small lifted crown tufts; cropped sides stay close to the head.
 curve(q=>{q.moveTo(-2,-59);q.quadraticCurveTo(-6,-64,-1,-63);q.quadraticCurveTo(-3,-62,1,-60);},'#f6d18b');
 g.restore();
 if(pose==='hug'){a.bear(0,-19,.5);a.line([[-7,-30],[-3,-24],[0,-25]],'#edabc4',3);a.line([[7,-30],[3,-24],[0,-25]],'#edabc4',3);}
 if(pose==='tea'){a.round(-4,-30,8,7,'#f7e7ce',2);a.oval(0,-30,4,1.2,'#92734c');}
 if(pose==='read'){a.round(-8,-30,16,8,'#709c8b',1);a.round(-7,-29,14,6,'#fff0d2',1);a.line([[0,-29],[0,-23]],'#b9a783',.7);}
 if(pose==='warm'){a.line([[-7,-32],[-2,-29],[-2,-32]],'#eda4c1',3);a.line([[7,-32],[2,-29],[2,-32]],'#eda4c1',3);}
 g.restore();g.restore();
}
export function makeSheet(Art){const c=document.createElement('canvas');c.width=SHEET.cellWidth*SHEET.columns;c.height=SHEET.cellHeight*SHEET.rows;const g=c.getContext('2d'),a=new Art(g);for(let row=0;row<16;row++)for(let col=0;col<14;col++){g.save();g.translate(col*120+60,row*216+204);g.scale(3,3);drawStella(a,row*Math.PI/8,col/12,col<12,col===13);g.restore();}return c;}
export class StellaAtlas{
 constructor(){this.ready=false;this.image=new Image();this.image.onload=()=>{this.ready=this.image.naturalWidth===1680&&this.image.naturalHeight===3456;};this.image.onerror=()=>{this.ready=false;};this.image.src=new URL('../assets/characters/stella-v04.png',import.meta.url).href;}
 draw(a,p,pose,t){a.shadow(p.x,p.y,9,3);const angle=p.facing??0;const blink=t%5>4.84;
  if(this.ready&&!pose){const row=(Math.round(angle/(Math.PI/8))%16+16)%16,col=p.walking?Math.floor(p.gait*12)%12:blink?13:12;
   a.g.drawImage(this.image,col*120,row*216,120,216,p.x-20,p.y-68,40,72);
  }else{a.g.save();a.g.translate(p.x,p.y);drawStella(a,pose?0:angle,p.gait%1,p.walking,blink,pose);a.g.restore();}
 }
}
