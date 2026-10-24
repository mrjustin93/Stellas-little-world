# Stella v0.4 animation atlas

Original smooth cartoon artwork generated from `js/stella.js`, guided by the first Stella concept reference: petite adult silhouette, blue almond eyes, tapered soft jaw, asymmetrical blonde pixie, pink hoodie/shorts, cream top and heart necklace.

`stella-v04.png`: 1680×3456 transparent PNG; 16 rows × 14 columns. Each cell is 120×216 at 3× drawing resolution. Rows rotate from facing down in 22.5° steps toward right, up, then left. Columns 0–11 are a walking cycle, 12 is idle, 13 is blink. Logical cell 40×72, foot anchor (20,68). Metadata is in `stella-v04.json`.

Frames are selected from travelled distance. Turning eases toward the joystick angle and the selected facing is the closest of 16 directions. Movement itself supports continuous 360° input. No image smoothing is disabled. The vector source provides a fallback and the existing activity poses.

To rebuild: serve the repository, then run `GAME_URL=http://127.0.0.1:PORT/ node qa/build-stella.cjs`. Playwright/Chromium are development-only dependencies. The exported PNG needs no build or dependency on the player's device.
