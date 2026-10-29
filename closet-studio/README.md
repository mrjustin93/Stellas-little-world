# Stella’s Closet Studio

A standalone dress-up foundation featuring a furnished WebGL 3D walk-in closet and an animated sprite character from the supplied reference sheet. Stella wears her basic white tank and shorts; clothing options can be added later.

## Run
Serve this directory with any static web server, for example `python -m http.server 8000`, then open `http://localhost:8000`. The Three.js module loads from jsDelivr; a CSS room fallback remains available if the CDN or WebGL is unavailable. Google Fonts is optional.

## Features
Eight reference pose views, gentle idle motion, drag camera controls, shelves and hanging rails, an arched mirror, vanity, plants, dressing platform, ottoman, persistent room palettes, lighting toggle, optional ambient sound, and PNG photo download.

Stella is a flat sprite within the 3D scene, not a rigged 3D model. Poses are discrete views, not interpolated walking animation. Photos capture the WebGL room when available, with a composed illustration fallback.

## Future clothing
Add transparent clothing layers aligned to each pose, composite them into the character canvas, and register the outfit in `app.js`. No additional outfits are supplied in this version.

## Validation
JavaScript syntax checks passed. Browser QA and hosted deployment were unavailable in the build environment.
