# v0.4 validation

11 Node gameplay tests pass, including frame-rate-independent acceleration, analogue speed scaling, arbitrary movement angles, collision-driven gait, immediate stop, shortest-path turning, and existing cabin/garden/time checks.

Chromium checks pass for loading the exported PNG, 12 unique walking frames in each of 16 directions, diagonal facing, no movement after release, and vector fallback after the PNG request is deliberately blocked. Existing browser suites pass for touch cancellation, indoor activities, journal persistence and storage failure, scene travel, gate traversal, gardening, clock, and portrait/landscape/desktop layouts. Direction-sheet and in-game screenshots reviewed.

Tests use simulated Chromium, not a physical Galaxy S26. The facial design is an original stylized interpretation of the reference rather than a photorealistic reproduction.
