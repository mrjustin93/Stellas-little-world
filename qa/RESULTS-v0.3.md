# v0.3 verification

Eight Node gameplay tests passed: normalized movement, collisions/tunneling, reachable indoor interactions, walking directions, clock rollover/pause and day/night boundaries, solid garden fences/gate/pond, and seed/water/harvest cycle.

Chromium/Playwright browser tests passed for cabin/garden travel, opening and traversing the gate, tending garden beds, clock pause, daytime/nighttime rendering, Luna cuddles, existing household activities and poses, journal persistence, corrupt/disabled storage, and touch cancellation. Responsive layouts checked at 320, 360, 412, 892 and 1366px. No page errors or failed asset requests. Mobile screenshots inspected. Tests simulate browsers; no physical Galaxy S26 access.

Run `npm test`. Optional browser QA: serve the project and set `GAME_URL` for `node qa/garden.cjs` and `node qa/refinement.cjs` (Playwright/Chromium required only for QA).
