# v0.11 verification

All 11 Node test files pass (42 individual cases). Seven new skeleton tests evaluate 32,768 combinations of facing, phase, movement strength and walking/jogging. They cover fixed unprojected bone lengths, reachable ankle targets, ground clearance, anatomical side continuity, arm/leg opposition, visible front/back motion, stable idle, and position/velocity continuity at phase transitions.

Chromium checks pass:

- 768 rendered walk/jog poses across 32 facings, smooth turn settling and immediate position stopping.
- Actual simulated touch events: short joystick drag, full walking speed, release and jog.
- Rendered portrait, Luna cuddle, diagonal movement, and fallback after deliberately blocking the character PNG.
- Garden travel/camera, crops/harvest, inventory, saved position/time/gate/crops, reload, map and mobile layouts.

Front, side, back and diagonal contact sheets reviewed. No JavaScript errors detected. Browser tests use simulated mobile Chromium; no physical Galaxy S26 was available.

The rig provides connected, length-preserving limbs with clearer projected depth and support-driven pelvis motion. It remains a stylized 2D drawing of a skeleton. At the preserved brisk game speeds, feet are not locked to world coordinates throughout support.
