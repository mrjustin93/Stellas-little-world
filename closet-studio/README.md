# Stella’s Closet Studio

An unpublished mobile-first browser dress-up game: a furnished WebGL 3D walk-in closet with Stella’s reference poses and gentle idle movement. Her only outfit is the basic white tank and shorts.

## Play locally
Open **Play-Stellas-Closet.html** directly in a browser. This file embeds the character image, app code, and styles, so there is no local server to install. Internet access is required for Three.js and the 3D room. If loading fails, the simple CSS room remains playable. Optional web fonts also use the internet.

Alternatively, serve this directory with `python -m http.server 8000` and open `http://localhost:8000`.

## Mobile layout
The phone layout keeps Stella visible above a scrollable dressing tray, with 44px touch controls, a closer camera, safe-area padding, and a landscape split view. Three.js uses a lower pixel ratio and shadow resolution on touch devices.

## Controls
- Drag the room to adjust the camera; turn arrows cycle through the six directional views.
- Poses includes all eight reference stances. Arrow keys, Home, and End work in the tab bar.
- Room changes palette; valid palette choices are saved locally when browser storage is available.
- Daylight switches to evening. Pause idle stops character motion; reduced-motion preferences pause it by default. Resume explicitly enables it.
- Sound toggles optional ambient audio. Photo saves the 3D view, or a labeled illustrated keepsake when using the simple room.

Stella is a flat sprite within a 3D room, not a rigged 3D model. Stances are discrete, not interpolated animations. The arched mirror is decorative and does not reflect Stella. Clothing silhouettes are protected when removing the source sheet’s neutral background; the crowded reference crops may still need hand-authored transparent artwork for production-quality edges.

## Adding clothing later
Add transparent clothing layers aligned to each pose, composite them into the character canvas, and register the outfit in `app.js`. No additional outfits are included.

## Development and validation
In the project checkout, source lives in `dist/` locally, or at `closet-studio/` in the GitHub branch. Run `node --test tests/*.test.cjs` for game-rule and app-handler regression checks. Run `python scripts/package.py` to rebuild the direct-open file and ZIP from the same sources. The ZIP puts the web assets at its root for static hosting.

JavaScript syntax and 15 regression checks passed. Chrome browser checks passed for 3D loading, all eight poses, turn arrows, pause/resume, photo download, saved palettes, help, reduced motion, and the dependency-failure fallback. Mobile emulation checks cover 390×844, 375×667, 360×740, and 844×390, including touch controls and layout overflow. These are emulated Chrome checks; testing on physical iOS and Android devices is still pending. No deployment or merge has been performed.
