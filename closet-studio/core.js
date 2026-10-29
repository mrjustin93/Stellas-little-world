/* Pure game rules shared by the browser and regression checks. */
(function (root) {
  'use strict';
  const poses = [
    {name:'Front view', crop:[0,200], garments:[[[59,194],[64,226],[100,236],[135,222],[146,194],[155,318],[148,346],[49,347],[48,310]],[[42,365],[152,359],[170,423],[105,437],[30,423]]]},
    {name:'Relaxed', crop:[191,354], garments:[[[234,192],[241,225],[276,240],[307,225],[313,195],[330,319],[323,345],[226,346],[222,310]],[[222,361],[323,365],[333,423],[276,436],[211,421]]]},
    {name:'Three-quarter left', crop:[345,496], garments:[[[398,204],[377,240],[369,274],[377,345],[444,342],[456,300],[448,211],[427,227]],[[378,366],[447,357],[457,411],[398,434],[368,422]]]},
    {name:'Three-quarter right', crop:[493,635], garments:[[[560,210],[564,248],[574,309],[557,343],[606,352],[619,301],[621,269],[599,242]],[[543,350],[594,356],[596,406],[524,437],[514,410]]]},
    {name:'Left profile', crop:[632,779], garments:[[[708,209],[685,238],[658,255],[654,281],[677,325],[699,347],[729,320],[737,254]],[[698,348],[743,359],[761,416],[744,438],[689,417]]]},
    {name:'Right profile', crop:[779,915], garments:[[[839,210],[843,248],[868,261],[884,287],[878,326],[859,348],[820,331],[819,274]],[[824,348],[872,361],[881,409],[839,428],[792,439],[791,405]]]},
    {name:'Back view', crop:[911,1096], garments:[[[961,194],[963,253],[983,269],[1030,272],[1052,249],[1057,194],[1059,316],[1048,345],[960,345],[951,313]],[[958,357],[1051,359],[1067,416],[1014,434],[941,421]]]},
    {name:'Playful', crop:[1083,1279], garments:[[[1133,202],[1150,235],[1187,242],[1219,225],[1223,206],[1237,311],[1225,343],[1123,343],[1121,306]],[[1124,358],[1227,360],[1252,420],[1195,435],[1112,416]]]}
  ];
  const orbit = [1,2,4,6,5,3];
  const palettes = [
    {name:'Lavender',color:'#c4b1cf',wall:'#f3ede6'},
    {name:'Rose',color:'#d9b7b1',wall:'#f3e7e2'},
    {name:'Sage',color:'#b3bfa4',wall:'#e9ede2'},
    {name:'Vanilla',color:'#d7c6a7',wall:'#f4eddc'}
  ];
  function nextView(pose, step) {
    const i = orbit.indexOf(pose);
    return orbit[((i < 0 ? 0 : i) + step + orbit.length) % orbit.length];
  }
  function inside(x,y,polygon) {
    let result=false;
    for(let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
      const [xi,yi]=polygon[i], [xj,yj]=polygon[j];
      if((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) result=!result;
    }
    return result;
  }
  function removeBackground(pixels,w,h,garments=[],offsetX=0,offsetY=0) {
    const visited=new Uint8Array(w*h), queue=new Int32Array(w*h);
    let start=0,end=0;
    function push(i) {
      if(i<0||i>=w*h||visited[i]) return;
      visited[i]=1;
      const k=i*4, r=pixels[k],g=pixels[k+1],b=pixels[k+2];
      const x=i%w+offsetX, y=Math.floor(i/w)+offsetY;
      // White clothes share the neutral sheet's colors: preserve their silhouettes.
      if(garments.some(p=>inside(x,y,p))) return;
      if(Math.max(r,g,b)-Math.min(r,g,b)<17 && r>132 && r<237) queue[end++]=i;
    }
    for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
    for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
    while(start<end){const i=queue[start++];pixels[i*4+3]=0;
      if(i%w>0)push(i-1);if(i%w<w-1)push(i+1);push(i-w);push(i+w);
    }
    // Drop detached fragments of neighboring figures from the reference sheet.
    visited.fill(0); let largest=[];
    for(let i=0;i<w*h;i++){
      if(visited[i]||pixels[i*4+3]===0)continue;
      start=0;end=0;queue[end++]=i;visited[i]=1;
      while(start<end){const k=queue[start++];
        for(const n of [k%w>0?k-1:-1,k%w<w-1?k+1:-1,k-w,k+w]){
          if(n>=0&&n<w*h&&!visited[n]&&pixels[n*4+3]){visited[n]=1;queue[end++]=n;}
        }
      }
      if(end>largest.length)largest=Array.from(queue.subarray(0,end));
    }
    const keep=new Uint8Array(w*h);largest.forEach(i=>keep[i]=1);
    for(let i=0;i<w*h;i++)if(!keep[i])pixels[i*4+3]=0;
    return pixels;
  }
  const api={poses,orbit,palettes,nextView,inside,removeBackground};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.StellaCore=api;
})(globalThis);
