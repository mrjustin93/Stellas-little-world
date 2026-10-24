// Resolution-independent original cartoon art: curved silhouettes, soft shading,
// and three-quarter furniture. Drawn directly at display resolution, never pixel-scaled.
export class Art {
 constructor(g){this.g=g;}
 gradient(x,y,h,light,dark){const v=this.g.createLinearGradient(x,y,x+h*.2,y+h);v.addColorStop(0,light);v.addColorStop(1,dark);return v;}
 round(x,y,w,h,color,r=5,stroke){const g=this.g;g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=color;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=.7;g.stroke();}}
 oval(x,y,rx,ry,color){const g=this.g;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=color;g.fill();}
 line(points,color,width=1){const g=this.g;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.stroke();}
 shape(points,color){const g=this.g;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=color;g.fill();}
 shadow(x,y,w,h){this.oval(x,y,w,h,'#283b2e28');}
 box(x,y,w,h,color){this.shadow(x+w/2,y+h,w*.55,4);this.round(x,y+4,w,h,this.gradient(x,y,h,color,'#8f6d56'),4);this.round(x,y,w,h-5,color,4);}
 flower(x,y,c='#f4bfcd'){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;this.oval(x+Math.cos(a)*2,y+Math.sin(a)*2,1.8,1.8,c);}this.oval(x,y,1.1,1.1,'#f7dda1');}
 bear(x,y,scale=1){const g=this.g;g.save();g.translate(x,y);g.scale(scale,scale);const fur=this.gradient(0,-26,28,'#d6a16b','#9e663c');this.shadow(0,0,11,3);this.oval(0,-9,9,10,fur);this.oval(-8,-26,4,4,fur);this.oval(8,-26,4,4,fur);this.oval(-8,-26,2.5,2.5,'#e8baa0');this.oval(8,-26,2.5,2.5,'#e8baa0');this.oval(0,-21,10,9,fur);this.oval(-4,-22,1.2,1.6,'#3c2d2a');this.oval(4,-22,1.2,1.6,'#3c2d2a');this.oval(-4.3,-22.6,.4,.5,'white');this.oval(3.7,-22.6,.4,.5,'white');this.oval(0,-18,4.6,3.2,'#edc79a');this.oval(0,-19,1.5,1,'#5b3c2d');this.line([[0,-18],[0,-16.5],[2,-17]],'#80533b',.6);this.oval(0,-8,5,6,'#e5b883');this.oval(-9,-10,3.5,6,fur);this.oval(9,-10,3.5,6,fur);this.oval(-6,-1,4.5,4,fur);this.oval(6,-1,4.5,4,fur);this.oval(-6,0,2.5,2,'#e6b392');this.oval(6,0,2.5,2,'#e6b392');this.shape([[-1,-14],[-7,-17],[-7,-11]],'#e892b7');this.shape([[1,-14],[7,-17],[7,-11]],'#e892b7');this.oval(0,-14,2,2,'#bc5d8f');g.restore();}
 stella(p,pose,t){const g=this.g;g.save();g.translate(p.x,p.y);const side=p.direction==='left'||p.direction==='right',back=p.direction==='up'&&!pose;const swing=p.walking?Math.sin(p.time*12)*2:0;this.shadow(0,0,10,3.5);if(p.direction==='left'&&!pose)g.scale(-1,1);
 // Adult petite proportions, cream camisole, pink zip hoodie and shorts.
 for(const [x,s] of [[-4,swing],[4,-swing]]){this.line([[x,-16],[x,-7+s],[x+1,-2+s]],'#e8af91',4);this.line([[x,-5+s],[x,-2+s]],'#fff5e7',4.3);this.oval(x+1,-1+s,3.4,2,this.gradient(0,-4,5,'#f3bfd1','#b76791'));this.line([[x-1,-2+s],[x+1,-2+s]],'#fff5f0',.7);}
 g.translate(0,p.walking?Math.abs(swing)*.25:Math.sin(t*1.6)*.25);
 this.round(-7,-23,14,8,this.gradient(0,-23,8,'#f5afc9','#c4759b'),3);this.line([[-6,-17],[-1,-17],[0,-20],[1,-17],[6,-17]],'#f9c7d7',.8);
 this.round(-6.5,-36,13,15,this.gradient(0,-36,16,'#f1a6c5','#c7759b'),4);if(!back)this.round(-3.5,-34,7,12,'#fff7ed',2);else{this.oval(0,-32,5,4,'#e798b9');this.line([[-4,-32],[0,-29],[4,-32]],'#f6bfd1',1);}
 for(const [x,s] of [[-8,-swing],[8,swing]]){this.line([[x*.75,-33],[x,-27+s],[x,-22+s]],'#dd91b2',4);this.oval(x,-21+s,1.8,2.2,'#f5c6a6');}
 this.round(-2.5,-39,5,5,'#f2bc9d',1);this.oval(side&&!pose?1:0,-45,8.5,10,this.gradient(0,-53,18,'#ffdfbd','#efb394'));
 // Sculpted short pixie hair with swept locks, distinct from long blonde hair.
 this.oval(-1,-50,9.5,7.5,this.gradient(0,-56,14,'#f9d995','#c48b44'));this.oval(-7,-46,2.5,6,'#d8a35e');this.oval(7,-48,2.5,5,'#dca75c');
 if(back){this.oval(0,-45,8.5,8,'#e4b76d');for(let i=-5;i<6;i+=3)this.line([[i,-52],[i-1,-46],[i+1,-41]],'#f3cf88',1.2);}
 else {this.oval(0,-44,7,6.5,this.gradient(0,-49,13,'#ffe3c4','#f2bd9d'));this.oval(-7,-44,1.4,2,'#f2bd9d');this.oval(7,-44,1.4,2,'#f2bd9d');
 for(const [x,y,rx,ry] of [[-5,-51,4,5],[0,-53,5,4],[4,-51,4,3],[-6,-48,2,4]]){g.save();g.translate(x,y);g.rotate(.5);this.oval(0,0,rx,ry,this.gradient(0,-4,9,'#ffe2a1','#dfae61'));g.restore();}
 const eyes=side&&!pose?[4]:[-3.3,3.3];for(const x of eyes){if(pose==='hug')this.line([[x-1.4,-44],[x,-43.5],[x+1.4,-44]],'#60464b',.8);else{this.oval(x,-44,1.7,2.1,'#fffdf5');this.oval(x+.2,-43.8,1.15,1.6,'#438fb8');this.oval(x+.4,-43.8,.55,1.1,'#2c4d69');this.oval(x,-44.5,.4,.6,'white');this.line([[x-1.4,-45.5],[x+.9,-45.7]],'#76574e',.7);}}
 this.oval(-5,-41.5,1.7,.7,'#edaa9e66');this.oval(5,-41.5,1.7,.7,'#edaa9e66');this.line([[-1.5,-39.5],[0,-39],[1.5,-39.5]],'#b46b76',.8);this.line([[0,-43],[.7,-41.5]],'#dca58a',.6);
 this.line([[-1,-34],[0,-30],[1,-34]],'#cba568',.5);this.oval(0,-30,1.2,1.2,'#da83a3');}
 if(pose==='hug'){this.bear(0,-16,.53);this.line([[-8,-28],[-5,-21],[-1,-22]],'#e5a0bc',4);this.line([[8,-28],[5,-21],[1,-22]],'#e5a0bc',4);}
 if(pose==='read'){this.round(-8,-26,16,8,'#648c7d',1);this.round(-7,-25,14,6,'#fff0ce',1);this.line([[0,-25],[0,-19]],'#b9a784',.7);}
 if(pose==='warm'){this.line([[-8,-28],[-3,-27],[-2,-30]],'#e5a0bc',4);this.line([[8,-28],[3,-27],[2,-30]],'#e5a0bc',4);this.oval(-2,-30,1.8,2,'#f5c6a6');this.oval(2,-30,1.8,2,'#f5c6a6');}
 if(pose==='tea'){this.round(-4,-27,8,7,'#f9ead1',2);this.oval(0,-27,4,1.5,'#9a7651');}
 g.restore();}
}
