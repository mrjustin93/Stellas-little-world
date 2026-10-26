export function cropStatus(plot,clock){
 if(plot.stage===0)return {label:'Ready for a seed',progress:0};
 if(plot.stage===1)return {label:'Needs water',progress:0};
 if(plot.stage===3)return {label:'Ripe · ready to harvest',progress:1};
 const remaining=Math.max(0,(plot.readyAt??(clock.day*24+clock.hour+24))-(clock.day*24+clock.hour));
 const minutes=Math.ceil(remaining*60),hours=Math.floor(minutes/60),mins=minutes%60;
 return {label:`Growing · ${hours}h ${String(mins).padStart(2,'0')}m game time left${clock.paused?' · clock paused':''}`,progress:Math.max(0,Math.min(1,1-remaining/24))};
}
export function picnicStatus(game){
 if(game.keepsakes.picnicComplete)return 'A sweet memory · enjoy another picnic with Luna any time.';
 return `Gather strawberries for a picnic with Luna · ${Math.min(6,game.inventory.berries)}/6 berries. Bring Luna to the picnic blanket southeast of the meadow.`;
}
export function sharePicnic(game){
 if(!game.keepsakes.carryingLuna)return false;
 if(!game.keepsakes.picnicComplete){if(game.inventory.berries<6)return false;game.inventory.berries-=6;game.keepsakes.picnicComplete=true;}
 return true;
}
