// Shared world scale and distance-based animation. A bed is ~95 units long;
// Stella is ~62 units tall, so furniture no longer looks miniature beside her.
export const SCALE={character:62/304,walkSpeed:54,jogSpeed:86,walkStride:46,jogStride:58};
export function legCycle(phase){
 const q=((phase%1)+1)%1;
 // 62% stance: the planted foot travels backward as the body moves forward.
 // 38% swing: ease forward, lift the toe, then put the heel down.
 if(q<.62)return {forward:1-2*q/.62,lift:0,bend:0};
 const u=(q-.62)/.38,s=u*u*(3-2*u);
 return {forward:-1+2*s,lift:Math.sin(Math.PI*u),bend:Math.sin(Math.PI*u)};
}
export function gaitPose(phase,blend=1,jog=false){
 const left=legCycle(phase),right=legCycle(phase+.5);
 const amplitude=jog?1.24:1;
 return {left,right,bob:(1-Math.cos(phase*Math.PI*4))*(jog?.6:.28)*blend,lean:(jog?.025:.012)*blend,amplitude,blend};
}
