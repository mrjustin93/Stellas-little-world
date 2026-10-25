// Shared world scale and distance-based animation. A bed is ~95 units long;
// Stella is ~62 units tall, so furniture no longer looks miniature beside her.
export const SCALE={character:62/304,walkSpeed:140,jogSpeed:190,walkStride:70,jogStride:82};
const smooth=t=>t*t*(3-2*t);
export function legCycle(phase,stance=.62){
 const q=((phase%1)+1)%1;
 if(q<stance){
  const u=q/stance,roll=u<.16?-.16*(1-smooth(u/.16)):u>.76?.27*smooth((u-.76)/.24):0;
  return {forward:1-2*u,lift:0,bend:0,roll,contact:true};
 }
 const u=(q-stance)/(1-stance),s=smooth(u);
 // Toe clearance peaks during leg recovery, then the heel comes forward.
 return {forward:-1+2*s,lift:Math.sin(Math.PI*u)**2,bend:Math.sin(Math.PI*u),roll:.27*(1-s)-.16*s,contact:false};
}
export function gaitPose(phase,blend=1,jog=false){
 const stance=jog?.48:.62,left=legCycle(phase,stance),right=legCycle(phase+.5,stance);
 const amplitude=jog?1.24:1;
 return {left,right,bob:(1-Math.cos(phase*Math.PI*4))*(jog?.8:.45)*blend,lean:(jog?.035:.015)*blend,sway:Math.sin(phase*Math.PI*2)*(jog?.32:.38)*blend,amplitude,blend};
}

export function isJogging(speed){return speed>(SCALE.walkSpeed+SCALE.jogSpeed)/2;}
