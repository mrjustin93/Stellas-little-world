# Stella character source

`stella-reference.jpg` is an appearance reference only. It is never sliced, loaded, or displayed as a gameplay character.

`build_stella.py` creates the original stylized mesh, continuous skin, white tank/shorts, blonde hair, face and 16-bone deform rig in Blender 4.3. It writes `Stella.blend` here and exports `stella.glb` to the game assets directory.

Run `blender -b -t 2 --python art/build_stella.py`, then `python scripts/package.py` from the game project. The editable `.blend` is generated locally; the script is the reproducible source tracked in GitHub. Animation and locomotion use the rig through `character.js` and `core.js`.
