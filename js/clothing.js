const item=(id,label,style,color)=>({id,label,style,color});
const colors=[['rose','Rose','#eaa0c0'],['mint','Mint','#9dceba'],['lavender','Lavender','#b9a6db'],['cream','Cream','#eee1c7'],['sky','Sky','#94bcd7'],['peach','Peach','#efb79b']];
export const CLOTHING={
 top:[item('white-tank','White tank top','tank','#fffaf1'),...['tank','tee','hoodie','sweater','cardigan','dress'].flatMap(style=>colors.slice(0,style==='hoodie'?6:3).map(([id,name,c])=>item(id+'-'+style,name+' '+{tank:'tank top',tee:'T-shirt',hoodie:'hoodie',sweater:'sweater',cardigan:'cardigan',dress:'day dress'}[style],style,c)))],
 bottom:[item('underwear','Underwear only','underwear','#fffaf1'),...['shorts','skirt','trousers','leggings'].flatMap(style=>colors.slice(0,3).map(([id,name,c])=>item(id+'-'+style,name+' '+style,style,c))),item('denim-trousers','Blue jeans','trousers','#769bb7')],
 underwear:['briefs','hipster','boyshorts'].flatMap(style=>[['white','White','#fffaf1'],['pink','Pink','#f2bfd2'],['lilac','Lilac','#d8c8ed']].map(([id,name,c])=>item(id+'-'+style,name+' '+style,style,c))),
 shoes:[item('pink-sneakers','Pink sneakers','sneakers','#dda1ba'),item('white-sneakers','White sneakers','sneakers','#f7eee0'),item('mint-slippers','Mint slippers','slippers','#a8d0b8'),item('cream-slippers','Cream slippers','slippers','#ecddc0'),item('brown-boots','Brown ankle boots','boots','#ab805d'),item('bare','Bare feet','bare','#f2c1a0')],
 head:[item('none','No head accessory','none',''),item('pink-band','Pink headband','band','#e997ba'),item('lilac-bow','Lilac bow','bow','#bfa4da'),item('flower-crown','Daisy crown','flowers','#fff4cb'),item('straw-hat','Garden sunhat','hat','#ddbd83'),item('mint-beanie','Mint beanie','beanie','#9fc7b2')],
 neck:[item('none','No necklace','none',''),item('heart','Pink heart pendant','heart','#e78daf'),item('pearl','Pearl necklace','pearl','#fff4df'),item('gold','Gold pendant','gold','#e1bd6d')],
 wrist:[item('none','No bracelet','none',''),item('gold-bangle','Gold bangles','bangle','#d8b56e'),item('pink-beads','Pink bead bracelet','beads','#e8a0bd'),item('silver-watch','Silver wristwatch','watch','#b7c9c9')],
 ears:[item('none','No earrings','none',''),item('pearl-studs','Pearl studs','stud','#fff5df'),item('gold-hoops','Gold hoops','hoop','#dfbd70'),item('pink-drops','Pink drop earrings','drop','#ec9cbd')]
};
export const CATEGORY_LABELS={top:'Tops & dresses',bottom:'Bottoms',underwear:'Underwear',shoes:'Footwear',head:'Hats & hair',neck:'Necklaces',wrist:'Bracelets & watches',ears:'Earrings'};
export const DEFAULT_CLOTHES={top:'rose-hoodie',bottom:'rose-shorts',underwear:'white-briefs',shoes:'pink-sneakers',head:'none',neck:'heart',wrist:'none',ears:'none'};
export function restoreClothes(value,legacy='rose'){
 const result={...DEFAULT_CLOTHES};if(legacy==='mint'||legacy==='lavender'){result.top=legacy+'-hoodie';result.bottom=legacy+'-shorts';}
 if(value&&typeof value==='object'&&!Array.isArray(value))for(const key of Object.keys(CLOTHING))if(CLOTHING[key].some(i=>i.id===value[key]))result[key]=value[key];return result;
}
export const clothingItems=state=>Object.fromEntries(Object.keys(CLOTHING).map(key=>[key,CLOTHING[key].find(i=>i.id===state[key])||CLOTHING[key].find(i=>i.id===DEFAULT_CLOTHES[key])]));
export const undress=()=>({...DEFAULT_CLOTHES,top:'white-tank',bottom:'underwear',underwear:'white-briefs',shoes:'bare',neck:'none'});
