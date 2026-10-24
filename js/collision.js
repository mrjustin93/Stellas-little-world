export function overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
export function feet(x,y){return {x:x-5,y:y-4,w:10,h:7};}
export function move(player,dx,dy,scene){
  const valid=(x,y)=>x>=scene.bounds.x+5&&x<=scene.bounds.x+scene.bounds.w-5&&y>=scene.bounds.y+4&&y<=scene.bounds.y+scene.bounds.h-3&&!scene.objects.some(o=>o.solid&&overlaps(feet(x,y),o.solid));
  // Small steps prevent tunneling even after a slow frame.
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/3));
  for(let i=0;i<steps;i++){if(valid(player.x+dx/steps,player.y))player.x+=dx/steps;if(valid(player.x,player.y+dy/steps))player.y+=dy/steps;}
}
