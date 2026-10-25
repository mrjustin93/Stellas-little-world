import {move} from './collision.js';
import {SCALE,isJogging} from './gait.js';
export const FACINGS=32;
export function angleDelta(a,b){return Math.atan2(Math.sin(b-a),Math.cos(b-a));}
export class Player {
 constructor(){this.x=167;this.y=246;this.direction='down';this.facing=0;this.targetFacing=0;this.walking=false;this.time=0;this.gait=0;this.motion=0;this.speed=SCALE.walkSpeed;this.vx=0;this.vy=0;}
 stop(dt=1/60){this.facing+=angleDelta(this.facing,this.targetFacing)*(1-Math.exp(-24*dt));this.motion*=Math.exp(-22*dt);if(this.motion<.001)this.motion=0;this.vx=0;this.vy=0;this.walking=false;this.time=0;}
 update(dt,axis,scene){
  const length=Math.hypot(axis.x,axis.y);
  if(length<.04){this.stop(dt);return;}
  const amount=Math.min(1,(length-.04)/.96),nx=axis.x/length,ny=axis.y/length;
  this.targetFacing=Math.atan2(nx,ny);
  const names=['down','down-right','right','up-right','up','up-left','left','down-left'];
  this.direction=names[(Math.round(this.targetFacing/(Math.PI/4))+8)%8];
  this.facing+=angleDelta(this.facing,this.targetFacing)*(1-Math.exp(-24*dt));
  const tx=nx*this.speed*amount,ty=ny*this.speed*amount,k=60,e=Math.exp(-k*dt);
  // Integrate acceleration analytically so distance is independent of frame rate.
  const dx=tx*dt+(this.vx-tx)*(1-e)/k,dy=ty*dt+(this.vy-ty)*(1-e)/k;
  this.vx=tx+(this.vx-tx)*e;this.vy=ty+(this.vy-ty)*e;
  const x=this.x,y=this.y;move(this,dx,dy,scene);
  const travelled=Math.hypot(this.x-x,this.y-y);
  this.walking=travelled>.0001;
  if(this.walking){this.gait+=travelled/(isJogging(this.speed)?SCALE.jogStride:SCALE.walkStride);this.motion+=(1-this.motion)*(1-Math.exp(-18*dt));this.time+=dt;}else{this.motion*=Math.exp(-22*dt);this.vx=0;this.vy=0;this.time=0;}
 }
}
