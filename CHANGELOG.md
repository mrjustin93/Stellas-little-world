# Stella’s Little World

## 0.7.2 — Brisk farm movement

- Versioned the complete module graph, entry script and stylesheet so a phone receives the new control code immediately after an update.

- Increased default movement from 80 to 140 world units/second and jogging from 120 to 190. Shortened acceleration further.
- Added a stronger near-center joystick response, with full pace after about 11px on the standard pad and a small neutral zone to prevent drift.
- Adjusted distance-based strides for the faster pace.
- Added a few playful, lightly flirty lines around the couch, tea, window and fireplace.

## 0.7.1 — More responsive controls

- Full joystick speed now needs 22% of the pad width of thumb travel, down from 33%. The visual stick still follows the finger.
- Reduced movement dead zone from 9% to 4% and shortened acceleration time. Small thumb movements engage sooner; release still stops immediately.
- Walking increased from 54 to 80 world units/second and jogging from 86 to 120. Retuned stride lengths and walk/jog animation selection for the faster pace.

## 0.7 — Proportions and a gentler stride

- Reduced Stella’s displayed height from about 76 to 62 world units to suit the 95-unit bed and room furniture. Activity props and fallback artwork use the same scale. Reduced sitting Luna and enlarged the exterior cabin while preserving its entrance and walkable paths.
- Replaced lower-leg strip distortion with clipped hip/knee and shoulder/elbow articulation. Added alternating stance/swing, knee lift, arm counter-swing, torso sway, and smooth animation settling.
- Walk/jog speeds and stride lengths now produce distinct, gentler cadences tied to travelled distance. Releasing controls still stops position immediately.
- Added a saved Cozy/Wide view option inside Map.

## 0.6 — A more defined Stella

- Generated a detailed 3D-style character turnaround using the first original concept as direct reference: blonde pixie, blue eyes, soft adult face, pink hoodie/shorts, white camisole and pink sneakers.
- Aligned 16 rendered views and added 32 blended facing steps with procedural gait. Stella is more prominent on screen; collision size stays consistent.
- Added a close-up dialogue portrait and preserved activity props, saves, and the previous sprite atlas as a missing-asset fallback.

## 0.5 — A farm to come home to

- Expanded the outdoor world to 840×680, almost three times its former area, with a pine trail, flower meadow and picnic clearing. Camera follows on both axes; terrain is cached and off-screen objects are culled.
- Added a backpack with seeds, strawberries, flowers and a reusable watering can; free seed refills beside the cabin.
- Watered crops ripen after one game day, yield three berries and one seed, and never die. Time pauses in menus; no offline penalties.
- Added a world map and Walk/Jog toggle.
- Save location, clock, pause, gate, crops, inventory and jogging preference automatically on this browser/device. Invalid saves and unavailable storage are handled safely.

## 0.4 — A smoother Stella

- Added a real transparent sprite atlas: 16 directions, 12 distinct walking frames per direction, idle and blink (224 frames total), with editable vector source and frame metadata.
- Refined the face, blue almond eyes, softer tapered jaw, smile and swept pixie hair toward the first reference.
- Added proportional analogue movement, gentle acceleration, eased turning, immediate release-to-stop, and walking phase based on actual distance travelled. Walking stops when blocked.
- Preserved household activity poses and a smooth vector fallback if the atlas fails to load.

## 0.3 — A little garden

- Replaced pixel rendering with resolution-independent cartoon artwork, rounded silhouettes, soft shading and shadows. Stella retains the reference’s blonde pixie hair, blue eyes, pink outfit and heart pendant. Luna retains brown fur and a pink bow.
- Added an outdoor cabin scene, fenced garden with an operable gate, six strawberry beds and a small blue pond. Use the Garden mat inside the cabin to travel outside; interact with the front doorstep to return.
- Interact with a garden bed to plant, water, then harvest. This is a gentle instant activity cycle; growth timers and inventory are not implemented. Garden state lasts for the current session.
- Added a 24-hour clock with daylight 06:00–18:00, night 18:00–06:00 and gradual lighting transitions. A full day takes ten real minutes. Tap the clock to pause it. Time pauses while reading dialogue and starts fresh when the page reloads.
- Preserved indoor activities, journal persistence, touch controls and collision. Art remains Canvas 2D, with a shaded cartoon depth effect.

## 0.2 — Little moments

- Redrew original Stella sprites at 32×50 pixels with tousled blonde hair, blue eyes, hoodie folds, shorts, socks, and lace-up shoes. Four directions and four walk frames keep consistent proportions.
- Redrew Luna with rounded paws, warm fur shading and a pastel-pink bow.
- Added a cuddle pose with Luna held at Stella’s chest, tea and reading poses, and warming-hands pose. Luna returns to her spot when the cuddle ends or dialogue closes.
- Added four optional activities: cuddle Luna, brew tea at the kitchen counter, read at the bookshelf, and pause beside the fire.
- Added the Little moments journal. Completed moments persist in local browser storage; no account or server is used. Storage failures do not prevent play. Position is not saved yet.
- Detailed quilts, rugs, wood grain, sofa stitching, books, plants, teapot and frames. Added gentle sunbeams, dust motes, hearth embers and tea steam. Decorative sunbeam motes remain still for reduced-motion preference.
- Improved input reset when leaving dialogues and checked 320px portrait through desktop layouts.

Still one indoor scene. Art is original programmatic pixel art guided by the concept, ready for later replacement with production sprite sheets. No sound or outdoors in this update.
