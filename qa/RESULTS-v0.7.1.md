# v0.7.1 verification

19 Node tests passed, including new coverage for short joystick drags, normalized diagonal input, near-neutral noise, quicker acceleration, and correct walk/jog animation selection after raising speed.

Chromium touch checks passed: an 8px thumb drag moves Stella promptly, a 25px drag reaches full walking speed, release stops movement, and Jog selects the higher speed. Existing browser startup, keyboard, Luna, Escape, touch, and portrait/landscape/desktop checks passed. No JavaScript errors detected. Simulated browser testing; no physical Galaxy S26 access.
