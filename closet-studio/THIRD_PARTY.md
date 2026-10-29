# Third-party character anatomy data

Stella’s refined human topology, skin weights, female face morph and eye surface are adapted from assets bundled with [MakeHuman Community](https://github.com/makehumancommunity/makehuman). These data assets are explicitly released under **CC0 1.0 Universal**. No MakeHuman application source code is incorporated into the game.

The bundled assets' legal statement is retained in `art/vendor/LICENSE-CC0.md`. Upstream files are:

- `makehuman/data/3dobjs/base.obj` → `art/vendor/base.obj`
- `makehuman/data/targets/macrodetails/caucasian-female-young.target` → `art/vendor/female-young.target`
- `makehuman/data/rigs/default.mhskel` → `art/vendor/rig.json`
- `makehuman/data/rigs/default_weights.mhw` → `art/vendor/weights.json`
- `makehuman/data/eyes/low-poly/low-poly.obj` → `art/vendor/eyes.obj`

The files retain upstream copyright and license notices. MakeHuman's overall licensing explanation states that bundled graphical assets, including base meshes, targets and rigs, are CC0, while its application code is separately licensed. Local adaptation code, Stella's reference-guided shaping, hair, fitted white outfit, game integration and runtime animation are maintained in this project.

The user-supplied image remains an appearance reference in `art/stella-reference.jpg`, not a runtime sprite or projected face texture.
