# v0.8 verification

24 Node tests passed, including the two-bone knee/ankle solver over all 32 facings and 120 phases, unreachable target safety, stance/swing height, shortest-path facing wrap, turn completion without position drift, and existing control/farm/save/time coverage.

Chromium rendered 384 sampled movement poses across 32 directions, checked distinct phase images, position stopping, motion/facing settling and unchanged 140-unit default movement. Existing scale/camera, touch response, missing-art fallback, portrait/cuddle and saved-farm/mobile checks passed. Side-view contact strip and game screenshots reviewed. No page errors detected; physical Galaxy S26 testing unavailable.

The attempted generated walking sheet had repeated poses and a visible background, so it is not included in this release. The original rendered character artwork is preserved. Animation improvements use explicit ankle targets, a two-bone leg solve, separate ankle/toe rotation and counter-swing on the existing rig.
