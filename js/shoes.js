// Compact sneakers are drawn around the ankle, with a restrained sole roll.
// Whole-cell shoe crops could contain both feet and swing like oversized flaps.
export function shoeGeometry(angle,roll=0,blend=1){
 const side=Math.sin(angle),profile=Math.abs(side);
 return {width:17+profile*10,height:17,toe:profile*3,mirror:side<0?-1:1,roll:Math.max(-.045,Math.min(.045,roll*side*blend*.2))};
}
export function paintShoe(a,ankle,angle,roll,blend,item){
 const g=a.g,s=shoeGeometry(angle,roll,blend),x=-s.width/2+s.toe;
 if(item?.style==='bare'){a.oval(ankle.x+Math.sin(angle)*2,ankle.y+4,6+Math.abs(Math.sin(angle))*3,4,'#f2c1a0');return;}
 g.save();g.translate(ankle.x,ankle.y);g.rotate(s.roll);g.scale(s.mirror,1);
 if(item?.style==='slippers'){a.round(x,1,s.width,9,item.color,4);a.line([[x+2,8],[x+s.width-2,8]],'#fff2dd',1);g.restore();return;}
 if(item?.style==='boots')a.round(-6,-16,12,21,item.color,3);
 // Stable cream sole; narrow high-top collar hugs the sock at the ankle.
 a.round(x,6,s.width,5,'#c6afb6',2.5);
 a.round(x,5,s.width,4,'#fff1e7',2);
 a.round(x,-1,s.width,9,a.gradient(x,-2,12,item?.color||'#f0b8ca',item?.color||'#c77c9f'),3.5);
 a.round(-5,-6,10,12,a.gradient(-5,-6,14,item?.color||'#f3bfd0',item?.color||'#ce86a7'),2.3);
 a.line([[-2,-3],[2,-3]],'#fff1e8',.8);
 a.line([[-2,-.5],[2,-.5]],'#fff1e8',.8);
 a.line([[-2,2],[2,2]],'#fff1e8',.8);
 a.line([[x+2,7],[x+s.width-2,7]],'#fff8ee',.7);
 if(Math.abs(Math.sin(angle))>.35)a.line([[x+s.width-5,1],[x+s.width-3,4]],'#fbd8df',1);
 g.restore();
}
