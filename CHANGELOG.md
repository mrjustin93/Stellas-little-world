# Stella’s Little World

## 0.17 — Every-item closet review

- Visually reviewed all 69 catalogue choices in the actual closet preview, front/profile/back. Added repeatable labelled review-sheet capture.
- Corrected side-view waist alignment, removed shorts-like sections from trousers/leggings, distinguished their fit, and removed jeans details from boyshorts.
- Recolored rendered hoodie/shorts shadows consistently, refined hats, and made bracelets follow wrist angle and depth. A watch is worn on one wrist. Household poses respect sleeve colors.
- Added high-density preview rendering and an underwear inspection toggle that preserves the selected outer outfit.


## 0.16.1 — Appearance review fixes

- Dresses keep their skirt layer with every bottoms and underwear selection.
- Profile earrings and hair bands follow the head instead of retaining front-view positions.
- Removed the source hoodie pendant when No necklace is selected and cleaned stray pink collar pixels at the neck in other outfits.
- Reviewed clothing while turning, walking and performing garden activities.


## 0.16 — Stella appearance polish

- Replaced boxy clothing silhouettes with curved shoulders, waist and hems, soft material shading, fabric folds, seams, pockets and trim.
- Restored rendered source detail to hoodie and shorts layers, recolored per selection in a bounded cache. Front/back clothing details now follow facing.
- Rounded limb contours and softened joint joins; refined shoe shading while preserving compact dimensions and existing gait.
- Preserved the reference face, hair, all clothing selections, saved progress and controls.


## 0.15 — Dressing room and mix-and-match wardrobe

- Closet opens a separate full-screen dressing room with a large rotating Stella preview, category tabs, draft selections, Apply, Cancel and Reset. Movement and time pause while choosing.
- Undress switches to an opaque white tank top and white briefs. Choose briefs, hipsters or boyshorts in white, pink or lilac.
- 69 catalogue choices across tops/dresses, bottoms, underwear, footwear, hats/hair accessories, necklaces, bracelets/watches and earrings. Selected pieces appear in gameplay and save independently.
- Added original layered clothing art around the existing character rig and preserved Stella’s reference face and hair. Older three-color outfits migrate to matching pieces.


## 0.14 — Closet and bathroom

- Added a cabin closet with rose, mint and lavender lounge sets. Undress behind a changing curtain and choose an outfit to dress; closing the curtain menu restores the worn outfit.
- Added a separate bathroom with bath and curtain, sink/mirror, toilet, fluffy towels, bathmat and a return door. Bathing uses a private curtain interaction.
- Saved outfit and bathroom location with backward-compatible recovery. Clothing recolors preserve Stella’s reference face, hair and skin.


## 0.13.1 — Watering animation fix

- Anchor the can handle to Stella’s working hand and ease its tilt through pouring and recovery. Mirror the can and spout together for left-facing views.
- Draw the stream behind Stella when she faces away, while keeping splashes visible on the soil. Water no longer paints over her back and legs.
- Keep the stream attached to the tilted nozzle and preserve crop timing and inventory.


## 0.13 — A picnic wish and gentle sounds

- Crop beds show water/ripe labels and growth bars; nearby beds show remaining game time and clock-pause status.
- Bag offers an optional six-strawberry picnic wish. Bring Luna to the southeast blanket to share berries once, save a sweet memory and enjoy repeat picnics freely.
- Soft synthesized footsteps, watering, birds and harvest chimes, with a saved mute preference. Audio starts on interaction and quiets in menus, hidden tabs and unfocused windows.


## 0.12 — Garden moments

- Animated planting, watering and harvesting with jointed crouches, tools, water droplets, damp soil and berries going into a basket. Crop and inventory changes happen once at contact.
- Carry Luna around the cabin and garden; she rests beside Stella during tasks. Return her to her corner from Bag.
- Free optional decoration rewards after 1, 3 and 6 harvests: a pink flowerpot, garden blooms and picnic lanterns. Place or put away through Bag → Decorate.
- Preserve old saves and credit earlier harvests. Save Luna, rewards and placed decorations.


## 0.11 — Connected walking rig

- Rotate anatomical hips, shoulders and limbs together. Side views now overlap the hips correctly; front and back views show the depth of each step.
- Use fixed-length thigh/calf joints, a longer recovery step, and a pelvis height derived from ankle reach. The supporting knee straightens as Stella passes over that foot.
- Replace moving rectangular arm crops with connected shoulders, elbows, cuffs and hands. Relaxed arms counter-swing against the legs, with near/far drawing order around the torso.
- Cache torso masks while retaining Stella's original rendered face, hair and pink outfit. Preserve compact sneakers, responsive 140/190 movement speeds and saved progress.
- Add geometry checks over 32,768 walk/jog poses and refresh versioned imports for phone caches.

## 0.10 — Smoother foot paths

- Matched forward foot velocity through push-off and landing, removing abrupt changes at the stance/swing boundaries.
- Softened the foot-clearance curve, lowered swing height, reduced bounce and eased the animation cadence.
- Small joystick movements use smaller steps. Starting from rest begins near toe-off instead of expanding straight into a full stride.
- Kept compact shoes, 140/190 movement speeds, joystick sensitivity and saved farm progress.

## 0.9.1 — Smaller, steadier shoes

- Replaced broad shoe-image crops with compact shaded pink sneakers sized consistently to the ankle and calf.
- Limited sole tilt to under three degrees and flattened it at rest, removing the floppy rotation.
- Reduced foot-contact shadows to match the smaller footwear.

## 0.9 — Heel-to-toe walking

- Replaced cut-up leg image sections with continuously shaded articulated thighs, knees, calves and socks, retaining the rendered face, outfit and shoes.
- Added heel contact, flat support, toe push-off and smooth foot recovery. Walking always has a supporting foot; jogging has a short flight phase.
- Added per-foot contact shadows and a stronger weight shift. Hip sway no longer carries the support ankle sideways.
- Preserved the 140/190 movement speeds, joystick sensitivity, character scale and saved progress.

## 0.8.1 — Correct leg projection

- Corrected knee bending: solve in the character’s forward/vertical plane before projecting into the camera view. Front/back legs no longer use sideways knee bends.
- Added projected bone foreshortening and reachable hip/ankle spacing to reduce stretching and foot lift during the support phase.
- Trimmed upper-leg texture regions to avoid moving hands/sleeves with the thighs.
- Kept brisk movement speed, touch sensitivity, character scale and saves.

## 0.8 — A clearer walking cycle

- Added explicit foot targets and a two-bone knee/ankle solver so limbs keep consistent lengths through support and swing. Added separate toe roll and smoother foot-lift curves.
- Timed arm counter-swing to the legs, added lateral torso sway and improved vertical weight transfer.
- Increased animation cadence for the existing brisk movement speed. Default movement remains 140 units/second and jog remains 190; joystick sensitivity is unchanged.
- Turns finish smoothly after release without position drift; restored facing initializes its turn target correctly.
- Updated release import-map versions so mobile browsers receive the new animation code.

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
