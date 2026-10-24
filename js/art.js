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
}
