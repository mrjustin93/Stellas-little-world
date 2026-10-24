# v0.2 verification

Passed locally in Chromium through Playwright:

- Existing keyboard/touch movement, Luna dialogue and Escape dismissal.
- All four activity buttons and sprite poses; player movement paused during dialogue.
- Journal entries survive reload. Corrupt storage and blocked writes remain playable.
- Touch drag, release and cancellation; input returns to neutral.
- All 16 movement frames exist as nonempty 32×50 images.
- Layouts 320×640, 360×740, 412×892, 892×412 and 1366×900: no document overflow, journal and dialogue stay in view.
- Reduced-motion rendering; no page errors or failed network responses.
- Five Node gameplay tests passed: diagonal speed, walls/furniture/tunneling, Luna approach, reachable interactions, four directions/idle.

Inspected desktop and mobile cuddle screenshots. These are simulated browser checks, not physical Galaxy S26 tests.

Run `npm test`, then optionally start a local HTTP server and run `GAME_URL=http://127.0.0.1:8765/ node qa/refinement.cjs`. The optional browser runner needs Playwright and Chromium; the game itself has no dependencies.

## Publication status

Publishing was attempted through both the GitHub connector (create update branch) and the authenticated GitHub CLI (push update branch). Both returned HTTP 403 permission errors. No remote files were modified; v0.2 is not deployed. GitHub's repository metadata reported push permission, but actual write requests were rejected. A working write-enabled connection is required before publication.
