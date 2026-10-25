// A small two-bone solver keeps limb lengths stable while the ankle follows
// a planted/swing trajectory. Angles are canvas rotations from a downward bone.
export function solveLeg(hip,ankle,bend=1,upper=56,lower=48){
 const dx=ankle.x-hip.x,dy=ankle.y-hip.y,raw=Math.hypot(dx,dy),d=Math.max(.001,Math.min(upper+lower-.01,Math.max(Math.abs(upper-lower)+.01,raw)));
 const axis=Math.atan2(dx,dy),offset=Math.acos(Math.max(-1,Math.min(1,(upper*upper+d*d-lower*lower)/(2*upper*d))));
 const thigh=axis+bend*offset,knee={x:hip.x+Math.sin(thigh)*upper,y:hip.y+Math.cos(thigh)*upper};
 const foot={x:hip.x+Math.sin(axis)*d,y:hip.y+Math.cos(axis)*d};
 return {hip,knee,foot,thigh:-thigh,shin:-Math.atan2(foot.x-knee.x,foot.y-knee.y)};
}
export function footTarget(hipX,step,angle,blend,jog){
 const reach=jog?24:20,side=Math.sin(angle),front=Math.cos(angle);
 return {x:hipX+side*step.forward*reach*blend,y:300+front*step.forward*6*blend-step.lift*(jog?22:16)*blend};
}
export function nearestFacing(angle){return ((Math.round(angle/(Math.PI/16))%32)+32)%32;}

// Solve in the character's forward/vertical plane, then project into the view.
// A frontal view foreshortens a knee bend; it must not bend the knee sideways.
export function projectedLeg(hipX,step,angle,blend,jog,hipOffset=0){
 const raw=solveLeg({x:0,y:196+hipOffset},footTarget(0,step,Math.PI/2,blend,jog),1);
 const side=Math.sin(angle),depth=Math.cos(angle)*.15;
 const project=p=>({x:hipX+p.x*side,y:p.y+p.x*depth});
 const hip=project(raw.hip),knee=project(raw.knee),foot=project(raw.foot);
 return {hip,knee,foot,thigh:-Math.atan2(knee.x-hip.x,knee.y-hip.y),shin:-Math.atan2(foot.x-knee.x,foot.y-knee.y),thighScale:Math.hypot(knee.x-hip.x,knee.y-hip.y)/56,shinScale:Math.hypot(foot.x-knee.x,foot.y-knee.y)/48,clamped:Math.hypot(raw.foot.x-footTarget(0,step,Math.PI/2,blend,jog).x,raw.foot.y-footTarget(0,step,Math.PI/2,blend,jog).y)>.02};
}
