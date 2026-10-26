export const OUTFITS={
 rose:{label:'Rose lounge set',colors:['#f8c5d8','#eaa0c0','#c47e9f'],tint:[1,1,1]},
 mint:{label:'Mint lounge set',colors:['#d1eddf','#9dceba','#6eaa97'],tint:[.68,1.24,.98]},
 lavender:{label:'Lavender lounge set',colors:['#e3d8f5','#b9a6db','#907cad'],tint:[.81,1.03,1.2]},
};
export const outfitId=id=>Object.hasOwn(OUTFITS,id)?id:'rose';
export function tintClothes(data,id){
 const tint=OUTFITS[outfitId(id)].tint;
 for(let i=160*100*4;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];if(r>g*1.08&&b>g*1.03&&r>b*.9){data[i]=Math.min(255,r*tint[0]);data[i+1]=Math.min(255,g*tint[1]);data[i+2]=Math.min(255,b*tint[2]);}}
 return data;
}
