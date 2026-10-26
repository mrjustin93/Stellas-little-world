# Character and clothing review — v0.18

The reported missing feet were reproduced: bare feet were flat 6×4 ellipses at the ankle, which read as cut-off legs at phone scale. Replaced them with continuous heel, ankle, instep and toe geometry. Checked all six footwear choices through 32 facing directions. Sneakers remain compact and retain the existing restrained sole rotation.

The review also found visible seams between separately painted thighs/calves and upper/lower arms, a rectangular source-clothing fragment beneath the head, and shoulder caps misaligned with the torso in side views. Corrected the limb surfaces, isolated and blended the neck, fitted shoulders to the torso, and attached tank straps to those shoulders. The original reference face/hair pixels above the neckline remain unchanged, checked across all 32 rendered views.

All 69 clothing/accessory choices were selected in the actual closet UI and captured front/profile/back. The contact sheets now include the entire preview height. Checked complete outfits with tanks, hoodies, dresses, skirts, trousers, leggings, base layers, headwear and footwear in eight directions. Walk preview lets the player inspect the draft outfit in motion while the game stays paused.

Validation commands (GAME_URL points at the local static server):

- `npm test`: all 19 test files pass.
- `node qa/full-figure.cjs`: 192 footwear raster checks; 960 complete figures across idle/walk/jog/plant/water/harvest poses; reference face preservation; preview animation and paused gameplay; mobile framing at 320×640, 412×892 and 892×412.
- `node qa/closet-audit.cjs`: all 69 real item selections, 207 preview poses and 11 labelled review sheets.
- `node qa/dressing.cjs`: draft/apply/cancel, base layers, accessories, persistence, movement lock, scrolling and 552 item/direction renders.
- `node qa/appearance.cjs`: dress coverage, removable pendant, 312 walking/activity renders and JavaScript error checks.
- `node qa/activities.cjs`: farming, inventory commit/cancellation, Luna, rewards, decorations and saved state.
- `node qa/controls.cjs`: touch sensitivity, release stop and jogging speed.

Visual evidence is generated under `/tmp/stella-*` and `/tmp/closet-audit-*` by these scripts. Screenshots include the actual closet and walking on unobstructed cabin floor. Testing uses Chromium with simulated mobile dimensions/touch/DPR, not a physical Galaxy S26. The character remains a layered Canvas rendering with a procedural rig, not a fully modeled 3D character.
