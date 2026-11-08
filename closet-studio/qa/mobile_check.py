"""Local-only Chrome QA for the walkable 3D character. No hosting or deployment."""
import functools,http.server,json,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/Play-Stellas-Closet.html'
results=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h in [(390,844),(375,667),(360,740),(844,390)]:
   page=browser.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,reduced_motion='reduce',device_scale_factor=2,accept_downloads=True)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(url,wait_until='domcontentloaded');page.wait_for_function('window.stellaGame?.state.ready && window.stellaCharacter',timeout=45000)
   assert page.evaluate('window.stellaCharacter.stats.bones')==16
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   assert page.evaluate('document.body.scrollHeight<=innerHeight+1')
   for selector in ['#photo','#home','[data-tab="stella"]']:
    box=page.locator(selector).bounding_box();assert box['height']>=44 and box['y']+box['height']<=h+1
   # A real pointer drag, not assignment to the game state, drives the thumbstick.
   stick=page.locator('#joystick').bounding_box();cx=stick['x']+stick['width']/2;cy=stick['y']+stick['height']/2
   page.mouse.move(cx,cy);page.mouse.down();page.mouse.move(cx+25,cy)
   page.wait_for_function('window.stellaGame.walking.x>.35',timeout=10000)
   page.mouse.up();page.wait_for_timeout(250)
   x=page.evaluate('window.stellaGame.walking.x');page.wait_for_timeout(250)
   assert abs(page.evaluate('window.stellaGame.walking.x')-x)<.02
   page.locator('#home').tap();assert abs(page.evaluate('window.stellaGame.walking.x'))<.001
   # Tap the visible floor and verify that the pointer-to-floor ray starts movement.
   stage=page.locator('#viewport').bounding_box()
   page.touchscreen.tap(stage['x']+stage['width']*.65,stage['y']+stage['height']*.80)
   page.wait_for_function('window.stellaGame.walking.distance>.1',timeout=10000)
   page.locator('#home').tap()
   page.locator('[data-tab="stella"]').tap();page.locator('[data-gesture="wave"]').tap()
   assert page.evaluate('window.stellaGame.walking.gesture')=='wave'
   if w==390:
    page.wait_for_timeout(300)
    page.screenshot(path=str(root/'qa/stella3d-wave.png'),full_page=True)
    with page.expect_download() as photo:page.locator('#photo').tap()
    photo.value.save_as(str(root/'qa/stella3d-photo.png'))
   page.locator('[data-gesture="relaxed"]').tap();page.locator('[data-tab="room"]').tap();page.locator('[data-palette="Rose"]').tap()
   page.locator('#roomlight').tap();assert page.evaluate('window.stellaGame.state.night')
   page.locator('#roomlight').tap();page.locator('[data-tab="wardrobe"]').tap()
   page.wait_for_timeout(3100)
   page.screenshot(path=str(root/f'qa/3d-mobile-{w}x{h}.png'),full_page=True)
   assert not errors
   results.append({'size':f'{w}x{h}','rigged_3d':True,'joystick_walk_and_stop':True,'floor_tap_walk':True,'home_reset':True,'wave':True,'layout_and_controls':True,'errors':errors})
   page.close()
  # Dependency failure is explicit: no sprite substitutes for the real character.
  page=browser.new_page();page.route('**/three.module.js',lambda r:r.abort())
  page.goto(url,wait_until='domcontentloaded');page.wait_for_function('window.stellaGame?.state.failed',timeout=15000)
  assert not page.evaluate('window.stellaGame.state.ready');assert page.locator('#retry').is_visible();assert page.locator('#photo').is_disabled()
  results.append({'3d_failure_recovery':True,'no_sprite_fallback':True})
  browser.close()
 (root/'qa/character-results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
finally:server.shutdown()
