# Rendered Stella v0.6

`stella-rendered-v06.png` is original generated artwork made with the FIRST Stella concept (`file_00000000c5e88230addb06fdbbfd848b.png`) supplied as the direct visual reference. The source concept itself is not sliced into game sprites. The new image is a 16-view transparent character turnaround. Preserve the original generated image in `/workspace/generated_images` during development.

The inspected silhouette bounds in `stella-rendered-v06.json` align each view to a consistent foot anchor and body height. `js/stella-rendered.js` normalizes the views into cached 160×320 cells and creates 32 facing steps by blending adjacent views. Gameplay height is about 76 world units, making the character more prominent while keeping the same collision footprint.

Walking uses subtle procedural lower-leg deformation and body motion tied to travelled distance. These are rendered standing key views with procedural gait, not 32 independently authored 3D models or full motion-captured animation. Activity props are composited in front of the rendered character. A dialogue portrait uses the front-view face. The previous v0.4 animated atlas remains the missing-asset fallback.

No runtime image generation, external asset service, or framework is required. The render, metadata, and fallback are served as static files.

As of v0.9, the face, outfit and shoes still use the rendered views, while articulated leg surfaces are shaded continuously by js/limbs.js and driven by the joint solver in js/locomotion.js. Heel/toe and support phases live in js/gait.js.

As of v0.9.1, js/shoes.js draws compact shaded sneakers anchored at the ankle instead of cropping the shoe area from the standing turnaround.
