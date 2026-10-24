// Original, hand-drawn pixel art. All frames share a 32×50 cell and foot anchor.
// The atlas API can later return professionally prepared image-sheet frames.
const palette = {
  outline: '#654c42', skin: '#f3c39f', skinLight: '#ffdbb4', skinShade: '#d9967e',
  hairDark: '#ad793e', hairShade: '#cf974c', hair: '#e8b65e', hairLight: '#f5d084',
  hairShine: '#ffe5a6', pinkDark: '#9c5875', pinkShade: '#c57b98', pink: '#e49bb5',
  pinkLight: '#f9c1cf', cream: '#fff1de', shoe: '#a7617c', blue: '#478fb1',
};

function drawBear(g, x, y) {
  const r = (a,b,w,h,c) => {g.fillStyle=c;g.fillRect(x+a,y+b,w,h);};
  // Rounded ears, cheeks, paws and a tiny satin bow.
  r(3,0,5,5,'#775032');r(16,0,5,5,'#775032');
  r(4,1,3,3,'#dea47e');r(17,1,3,3,'#dea47e');
  r(5,2,14,2,'#a56c3d');r(3,5,18,8,'#8c5c37');
  r(5,4,14,10,'#bd864c');r(6,4,11,2,'#d29a59');
  r(4,7,2,4,'#d49c60');r(19,7,2,4,'#a1693e');
  r(7,8,2,2,'#382c29');r(15,8,2,2,'#382c29');
  r(7,8,1,1,'#fff0d2');r(15,8,1,1,'#fff0d2');
  r(8,10,9,5,'#edc993');r(11,10,4,2,'#62432e');
  r(12,12,1,2,'#765138');r(10,14,5,1,'#a47547');
  r(4,11,3,1,'#e0a18a');r(17,11,3,1,'#e0a18a');
  r(5,15,14,10,'#8f5e37');r(7,15,10,11,'#bb824a');
  r(8,18,8,7,'#dfb274');r(9,19,6,4,'#e8c18a');
  r(1,16,5,8,'#b37b46');r(18,16,5,8,'#b37b46');
  r(1,23,8,6,'#855532');r(16,23,8,6,'#855532');
  r(2,23,6,5,'#ca9259');r(17,23,6,5,'#ca9259');
  r(3,24,4,3,'#e0ae7f');r(18,24,4,3,'#e0ae7f');
  r(5,15,6,4,'#ce7195');r(14,15,6,4,'#ce7195');
  r(6,15,4,2,'#ffbad2');r(15,15,4,2,'#ffbad2');
  r(10,16,5,3,'#a94f79');r(11,16,3,2,'#f19bbb');
  r(9,19,3,3,'#e793b3');r(14,19,3,3,'#e793b3');
}

function stella(direction, frame, pose = '') {
  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 50;
  const g = canvas.getContext('2d');
  const r = (x,y,w,h,c) => {g.fillStyle=palette[c]||c;g.fillRect(x,y,w,h);};
  const side = direction === 'left' || direction === 'right';
  const back = direction === 'up';
  const step = pose ? 0 : [0,-2,0,2][frame];
  const bob = pose || frame % 2 === 0 ? 0 : 1;
  if (direction === 'left') {g.translate(32,0);g.scale(-1,1);}
  // Slender legs, ankle socks and lace-up pink sneakers.
  for (const [x,offset] of [[10,step],[18,-step]]) {
    r(x,33,5,10+offset,'outline');r(x+1,33,3,9+offset,'skin');
    r(x+1,34,1,7+offset,'skinLight');r(x,41+offset,5,4,'cream');
    r(x,42+offset,1,3,'#c7b6b0');r(x-1,44+offset,7,4,'outline');
    r(x,44+offset,5,3,'shoe');r(x,44+offset,3,1,'pinkLight');
    r(x+1,45+offset,2,1,'cream');r(x,47+offset,6,1,'cream');
  }
  g.save();g.translate(0,bob);
  // Shorts, waistband, seams, drawstring and pockets.
  r(9,28,15,8,'pinkDark');r(10,29,13,5,'pink');
  r(10,29,13,1,'pinkLight');r(16,31,1,5,'pinkShade');
  r(10,34,6,1,'cream');r(18,34,5,1,'cream');
  r(15,30,3,1,'cream');r(15,31,1,3,'cream');r(18,31,1,2,'cream');
  if(back){r(11,31,3,2,'pinkShade');r(19,31,3,2,'pinkShade');}
  // Cropped hoodie over a cream camisole, with shaded folds.
  r(9,19,14,11,'pinkDark');r(10,20,12,9,'pink');
  r(12,21,8,7,back?'pink':'cream');
  r(10,20,2,9,'pinkLight');r(21,21,2,8,'pinkShade');
  if(back){r(12,20,8,2,'pinkShade');r(13,22,6,2,'pinkLight');r(15,24,3,1,'pinkShade');}
  else {r(11,21,1,6,'cream');r(21,21,1,6,'cream');r(16,22,1,3,'#b99762');r(15,24,3,2,'#c56d97');}
  // Arms swing independently; keep shoulders and torso aligned.
  for(const [x,offset] of [[6,-step],[23,step]]) {
    r(x,21,4,8+offset,'pinkDark');r(x+1,21,3,7+offset,'pink');
    r(x+1,22,1,5+offset,'pinkLight');r(x,28+offset,4,2,'pinkLight');
    r(x+1,30+offset,3,3,'skin');r(x+1,30+offset,1,2,'skinLight');
  }
  r(13,16,7,4,'skinShade');r(14,17,5,3,'skin');
  // Short tousled pixie silhouette, with warm shadows and pale strands.
  r(8,5,17,11,'hairDark');r(10,3,13,14,'skin');
  r(11,7,12,7,'skinLight');r(12,15,9,3,'skin');r(14,17,5,1,'skinShade');
  r(7,7,3,6,'hairShade');r(24,8,2,5,'skin');
  r(10,2,13,3,'hairDark');r(8,4,17,5,'hair');
  r(11,1,10,4,'hair');r(15,0,6,2,'hairLight');
  r(7,5,4,7,'hair');r(6,7,2,4,'hairShade');r(8,11,2,4,'hairShade');
  r(9,3,5,3,'hairLight');r(12,2,4,3,'hairShine');
  r(17,2,5,3,'hairLight');r(20,3,4,3,'hairShine');
  r(11,5,5,3,'hairLight');r(10,7,4,3,'hair');
  r(14,5,5,2,'hairShine');r(14,7,3,2,'hairLight');
  r(18,5,5,2,'hairLight');r(21,6,4,4,'hairShade');
  r(24,7,2,4,'hairDark');r(23,11,2,3,'hairShade');
  r(10,4,1,3,'hairShine');r(9,7,1,3,'hairShine');
  if(back){
    r(9,7,15,8,'hair');r(10,8,3,6,'hairLight');r(15,6,3,8,'hairShine');
    r(19,7,3,8,'hairShade');r(11,14,11,2,'hairShade');r(13,15,7,2,'hairDark');
    r(12,11,1,3,'hairShine');r(18,11,1,3,'hairLight');
  } else if(side) {
    r(10,8,6,6,'hair');r(10,9,2,5,'hairLight');r(14,12,2,3,'hairShade');
    r(20,10,3,1,'outline');r(20,11,3,3,'blue');r(21,11,1,1,'cream');
    r(24,12,2,2,'skinLight');r(21,15,3,1,'#b96f72');r(19,14,2,1,'#eaa092');
  } else {
    r(11,10,3,1,'outline');r(19,10,3,1,'outline');
    r(11,11,3,3,'blue');r(19,11,3,3,'blue');
    r(11,11,1,1,'cream');r(19,11,1,1,'cream');
    r(10,14,3,1,'#eaa092');r(21,14,3,1,'#eaa092');
    r(16,13,1,2,'skinShade');r(15,16,4,1,'#b66f70');r(16,16,2,1,'cream');
  }
  if(pose==='hug'){
    g.save();g.translate(10,22);g.scale(.55,.55);drawBear(g,0,0);g.restore();
    r(8,27,6,3,'pink');r(20,27,5,3,'pink');
    r(12,28,3,3,'skin');r(18,28,3,3,'skin');
    r(11,11,3,1,'outline');r(19,11,3,1,'outline');
    r(11,12,3,2,'skinLight');r(19,12,3,2,'skinLight');
  }
  if(pose==='tea'){
    r(12,28,10,7,'#9b7e67');r(13,28,8,5,'#efe1bf');
    r(21,29,3,3,'#efe1bf');r(14,28,6,1,'#8b654a');
    r(10,30,3,3,'skin');r(21,30,3,3,'skin');
  }
  if(pose==='read'){
    r(8,27,17,8,'#55796d');r(9,28,7,5,'#f2dfb4');r(17,28,7,5,'#e3cba1');
    r(16,27,1,8,'#8c7153');r(10,29,4,1,'#c6ad86');r(19,29,4,1,'#b79f7b');
    r(8,32,3,2,'skin');r(23,32,3,2,'skin');
  }
  if(pose==='warm'){r(12,26,4,4,'skin');r(18,26,4,4,'skin');r(8,25,5,4,'pink');r(22,25,4,4,'pink');}
  g.restore();return canvas;
}

export function createAssets(){
  const frames={},poses={};
  for(const dir of ['down','up','left','right'])frames[dir]=Array.from({length:4},(_,i)=>stella(dir,i));
  for(const pose of ['hug','tea','read','warm'])poses[pose]=stella('down',0,pose);
  const luna=document.createElement('canvas');luna.width=26;luna.height=30;drawBear(luna.getContext('2d'),0,0);
  return {getStella:(dir,frame,pose)=>poses[pose]||frames[dir]?.[frame]||frames.down[0],luna};
}
