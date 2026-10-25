# Rendered Stella v0.6

`stella-rendered-v06.png` is original generated artwork made with the FIRST Stella concept (`file_00000000c5e88230addb06fdbbfd848b.png`) supplied as the direct visual reference. The source concept itself is not sliced into game sprites. The new image is a 16-view transparent character turnaround. Preserve the original generated image in `/workspace/generated_images` during development.

The inspected silhouette bounds in `stella-rendered-v06.json` align each view to a consistent foot anchor and body height. `js/stella-rendered.js` normalizes the views into cached 160×320 cells and creates 32 facing steps by blending adjacent views. Gameplay height is about 62 world units, with a separate feet collision footprint.

Walking uses subtle procedural lower-leg deformation and body motion tied to travelled distance. These are rendered standing key views with procedural gait, not 32 independently authored 3D models or full motion-captured animation. Activity props are composited in front of the rendered character. A dialogue portrait uses the front-view face. The previous v0.4 animated atlas remains the missing-asset fallback.

No runtime image generation, external asset service, or framework is required. The render, metadata, and fallback are served as static files.

As of v0.9, the face, outfit and shoes still use the rendered views, while articulated leg surfaces are shaded continuously by js/limbs.js and driven by the joint solver in js/locomotion.js. Heel/toe and support phases live in js/gait.js.

As of v0.9.1, js/shoes.js draws compact shaded sneakers anchored at the ankle instead of cropping the shoe area from the standing turnaround.

As of v0.11, `js/skeleton.js` supplies the active walking rig. Hips and shoulders use anatomical lateral/forward/vertical coordinates, which rotate into the camera view. Fixed-length leg chains reach the ankle targets; the pelvis height is derived from the targets so the support knee can extend naturally. Arms use connected upper-arm/forearm/hand chains with opposite leg timing. `js/limbs.js` shades sleeves, hands and legs, while cached torso masks preserve the rendered face, hair and clothing. Near/far limb ordering handles occlusion. The older two-dimensional leg helpers in `js/locomotion.js` are retained for comparison; its facing index helper is still used.

This remains a stylized Canvas character, not a full 3D mesh. Brisk world travel is intentionally faster than anatomical foot travel at this character scale; the rig does not provide world-locked feet. An authored walk cycle or a fully skinned model would support more detailed deformation later.
