import functools,http.server,json,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:print('CONSOLE',m.type,m.text[:200]) if m.type in ['error','warning'] else None)
  page.goto(f'http://127.0.0.1:{server.server_port}/Play-Stellas-Closet.html',wait_until='domcontentloaded')
  page.wait_for_function('window.stellaGame?.state.ready && window.stellaCharacter',timeout=45000)
  print('Rig',page.evaluate('window.stellaCharacter.stats'))
  page.locator('#animate').click()
  page.screenshot(path=str(root/'qa/stella3d-front.png'),full_page=True)
  page.evaluate("StellaCore.setTarget(window.stellaGame.walking,1.3,1.8)")
  page.wait_for_function('window.stellaGame.walking.distance>.4',timeout=15000)
  page.screenshot(path=str(root/'qa/stella3d-walking.png'),full_page=True)
  page.wait_for_function('!window.stellaGame.walking.target',timeout=20000)
  print('Position',page.evaluate('({x:window.stellaGame.walking.x,z:window.stellaGame.walking.z,distance:window.stellaGame.walking.distance})'))
  page.locator('#home').tap();page.locator('[data-tab="stella"]').tap();page.locator('[data-gesture="wave"]').tap()
  page.screenshot(path=str(root/'qa/stella3d-wave.png'),full_page=True)
  print('Errors',errors)
  browser.close()
finally:server.shutdown()
