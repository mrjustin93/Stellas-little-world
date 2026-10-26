// Small, free rewards for tending the garden. Placement is deliberately fixed
// so decorating never blocks a path or needs a precision drag on a phone.
export const DECORATIONS=Object.freeze([
 {id:'pink-pot',title:'Pink flowerpot',required:1,description:'A little bouquet for the cabin windowsill.',scene:'cabin',objects:[{id:'decor-pink-pot',type:'reward-pot',x:85,y:70,w:16,h:20,depth:90}]},
 {id:'flower-border',title:'Garden blooms',required:3,description:'Soft pink flowers beside the garden fence.',scene:'garden',objects:[{id:'decor-border-left',type:'reward-border',x:68,y:339,w:65,h:10,depth:349},{id:'decor-border-right',type:'reward-border',x:207,y:339,w:63,h:10,depth:349}]},
 {id:'picnic-lanterns',title:'Picnic lanterns',required:6,description:'A warm little glow above the picnic blanket.',scene:'garden',objects:[{id:'decor-picnic-lanterns',type:'reward-lanterns',x:601,y:407,w:112,h:34,depth:441}]},
]);
const MAX_HARVESTS=99999;
export const createKeepsakes=()=>({carryingLuna:false,harvests:0,decorations:[]});

// Before keepsakes existed, every harvest gave exactly three berries and
// berries could not be spent. Missing legacy data can therefore credit those
// harvests. A malformed present field gets defaults, rather than more rewards.
export function restoreKeepsakes(value,legacyBerries=0){
 const state=createKeepsakes();
 if(value===undefined){
  if(Number.isSafeInteger(legacyBerries)&&legacyBerries>0)state.harvests=Math.min(MAX_HARVESTS,Math.floor(legacyBerries/3));
  return state;
 }
 if(!value||typeof value!=='object'||Array.isArray(value))return state;
 state.carryingLuna=value.carryingLuna===true;
 if(Number.isSafeInteger(value.harvests)&&value.harvests>=0)state.harvests=Math.min(MAX_HARVESTS,value.harvests);
 if(Array.isArray(value.decorations))state.decorations=DECORATIONS.filter(d=>state.harvests>=d.required&&value.decorations.includes(d.id)).map(d=>d.id);
 return state;
}

export function earnHarvest(state){
 const before=Number.isSafeInteger(state.harvests)&&state.harvests>=0?Math.min(MAX_HARVESTS,state.harvests):0;
 state.harvests=Math.min(MAX_HARVESTS,before+1);
 return DECORATIONS.filter(d=>d.required>before&&d.required<=state.harvests);
}

export function toggleDecoration(state,id){
 const decoration=DECORATIONS.find(d=>d.id===id);
 if(!decoration||state.harvests<decoration.required)return {ok:false,placed:false,decoration};
 if(!Array.isArray(state.decorations))state.decorations=[];
 const placed=!state.decorations.includes(id);
 state.decorations=state.decorations.filter(item=>item!==id);
 if(placed)state.decorations.push(id);
 return {ok:true,placed,decoration};
}

export function syncKeepsakes(game){
 const state=game.keepsakes||(game.keepsakes=createKeepsakes());
 game.player.carryingLuna=state.carryingLuna===true;
 const luna=game.cabin.objects.find(o=>o.id==='luna');
 if(luna){
  // Preserve the original footprint before the carried bear leaves her spot.
  if(!luna.homeSolid&&luna.solid)luna.homeSolid={...luna.solid};
  luna.hidden=game.player.carryingLuna;
  luna.solid=luna.hidden?null:luna.homeSolid?{...luna.homeSolid}:null;
 }
 for(const scene of [game.cabin,game.garden]){
  scene.objects=scene.objects.filter(o=>!o.keepsake);
  for(const decoration of DECORATIONS){
   if(decoration.scene!==scene.id||state.harvests<decoration.required||!state.decorations.includes(decoration.id))continue;
   for(const object of decoration.objects)scene.objects.push({...object,keepsake:decoration.id,solid:null});
  }
 }
}

export function setLunaCarried(game,carried){
 if(!game.keepsakes)game.keepsakes=createKeepsakes();
 const changed=game.keepsakes.carryingLuna!==(carried===true);
 game.keepsakes.carryingLuna=carried===true;syncKeepsakes(game);
 return changed;
}
