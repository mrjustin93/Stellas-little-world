// Continuous shaded limb surfaces avoid the seams from rotating photo rectangles.
export function drawLimb(g,start,end,wide,narrow,colors){
 const dx=end.x-start.x,dy=end.y-start.y,len=Math.max(.001,Math.hypot(dx,dy)),nx=-dy/len,ny=dx/len;
 const point=(p,w,sign)=>({x:p.x+nx*w*.5*sign,y:p.y+ny*w*.5*sign});
 const a=point(start,wide,1),b=point(end,narrow,1),c=point(end,narrow,-1),d=point(start,wide,-1);
 const shade=g.createLinearGradient(start.x-wide*.6,start.y,start.x+wide*.6,start.y);shade.addColorStop(0,colors[0]);shade.addColorStop(.44,colors[1]);shade.addColorStop(1,colors[2]);
 g.fillStyle=shade;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.quadraticCurveTo(end.x+dx/len*narrow*.25,end.y+dy/len*narrow*.25,c.x,c.y);g.lineTo(d.x,d.y);g.quadraticCurveTo(start.x-dx/len*wide*.25,start.y-dy/len*wide*.25,a.x,a.y);g.fill();
}
export function paintLeg(a,rig,width){
 const g=a.g,skin=['#ffdfb9','#f2c1a0','#d99b84'];
 drawLimb(g,rig.knee,rig.foot,width*.63,width*.43,skin);
 drawLimb(g,rig.hip,rig.knee,width,width*.63,skin);
 a.oval(rig.knee.x,rig.knee.y,width*.29,width*.26,'#f1be9d');
 // A small kneecap highlight and a soft ankle sock join both moving segments.
 a.oval(rig.knee.x-width*.06,rig.knee.y-width*.08,width*.16,width*.13,'#ffe1bc66');
 const sock={x:rig.foot.x+(rig.knee.x-rig.foot.x)*.21,y:rig.foot.y+(rig.knee.y-rig.foot.y)*.21};
 drawLimb(g,sock,rig.foot,width*.57,width*.53,['#fffaf0','#f8f1e5','#d9cbd0']);
}
