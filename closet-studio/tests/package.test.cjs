const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
test('direct-open game embeds the image and all local code in dependency order',()=>{
  const html=fs.readFileSync(path.join(root,'Play-Stellas-Closet.html'),'utf8');
  assert.match(html,/window.STELLA_IMAGE="data:image\/jpeg;base64,/);
  assert(!/<script[^>]*src=/.test(html));
  assert(!html.includes('href="style.css"'));
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  assert.equal(scripts.length,3);
  scripts.forEach(s=>assert.doesNotThrow(()=>new vm.Script(s)));
  assert(scripts[0].includes('root.StellaCore=api'));
  assert(scripts[1].includes('window.STELLA_IMAGE'));
  assert(scripts[2].includes('import('));
});
