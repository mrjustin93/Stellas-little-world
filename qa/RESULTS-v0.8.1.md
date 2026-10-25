# v0.8.1 verification

26 Node tests passed, including new checks that front/back knee and ankle projections stay under the hip, stance ankles remain on the support plane, and all walk/jog targets remain reachable across phases and blend weights.

Chromium passed 384 rendered poses over 32 facings, movement/settling, unchanged brisk touch response, saved farm reload, crop/inventory/map behavior and mobile layouts. A 48-pose contact sheet covering front, side, back and diagonal views was rendered and visually inspected. No page errors. Simulated browser testing; no physical Galaxy S26 access.

The fix solves the leg in its own forward/vertical plane, then projects to the view with bone foreshortening. It also gives the hip enough reach margin for the planted foot and clips upper-leg textures to exclude overlapping hands/sleeves.
