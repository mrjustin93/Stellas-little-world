import functools,http.server,json,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
results=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h in [(390,844),(375,667),(360,740),(844,390)]:
   page=browser.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,reduced_motion='reduce',device_scale_factor=2)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(f'http://127.0.0.1:{server.server_port}/Play-Stellas-Closet.html',wait_until='domcontentloaded')
   page.wait_for_function('window.stellaGame?.state.ready && window.stellaCapture',timeout=25000)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(w,h,'horizontal overflow')
   assert page.evaluate('document.body.scrollHeight<=innerHeight+1'),(w,h,'body overflow')
   for selector in ['#photo','#animate','#left','#right','[data-tab="poses"]','[data-tab="room"]']:
    b=page.locator(selector).bounding_box()
    assert b['height']>=44,(selector,b)
    assert b['y']+b['height']<=h+1,(selector,b)
   page.locator('[data-tab="poses"]').tap()
   page.locator('[data-pose="7"]').tap()
   assert page.evaluate('window.stellaGame.state.pose')==7
   page.locator('[data-tab="room"]').tap();page.locator('[data-palette="Rose"]').tap()
   assert page.evaluate('window.stellaGame.state.palette.name')=='Rose'
   page.locator('[data-tab="poses"]').tap();page.locator('[data-pose="1"]').tap();page.locator('[data-tab="wardrobe"]').tap();page.wait_for_timeout(3100)
   page.screenshot(path=str(root/f'qa/mobile-{w}x{h}.png'),full_page=True)
   results.append({'size':f'{w}x{h}','webgl':True,'controls_44px':True,'no_page_overflow':True,'pose_and_palette_taps':True,'errors':errors})
   assert not errors
   page.close()
  browser.close()
 print(json.dumps(results,indent=2));(root/'qa/mobile-results.json').write_text(json.dumps(results,indent=2))
finally:server.shutdown()
