# Reference-guided Stella model

`stella-reference.jpg` is the user-supplied appearance reference. It is never sliced into poses, displayed as a gameplay character, or projected onto the model as a flat face.

`build_stella.py` adapts the CC0 MakeHuman anatomy, female face morph, eye surface and skin weights in `vendor/`. It fits new white tank/shorts geometry, creates a layered side-swept ash-blonde pixie, adjusts proportions and expression, creates an eyelid blink morph, and exports the existing 16-bone game rig. Source and asset license details are in `../THIRD_PARTY.md` and `vendor/LICENSE-CC0.md`; asset hashes are retained in `vendor/checksums.json`.

Run `blender -b -t 2 --python art/build_stella.py`, then `python scripts/package.py` from the project directory. Blender 4.3 writes the editable `art/Stella.blend` and game asset `stella.glb` (under `dist/` locally). The generated `.blend` is available locally; the script and all required data assets are tracked in GitHub.

Runtime motion is in `character.js`, with independent collision and movement rules in `core.js`. Skin, finger, foot and eye topology is preserved; body mesh simplification limits mobile rendering cost. Rig rotations are derived from anatomical rest frames, and a real Blink shape closes the eyelids.
