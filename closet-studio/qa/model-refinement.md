# Reference-guided refinement

The supplied Stella image was visually compared with the game model. It remains an appearance reference only; no gameplay sprite slicing or face projection is used.

This pass replaces primitive head/body/hand/foot geometry with adapted CC0 human topology, including eyelids and anatomical fingers/toes. Proportions, restrained mouth expression, blue irises, ash-blonde layered pixie, fitted white scoop-neck tank with narrow straps, and white shorts follow the reference's visual cues. The clothing and skin use the same deform rig; the actual eyelid surface closes through a Blink morph.

Browser visual checks caught and corrected disconnected primitive feet, recessed prototype eyes, incorrectly remapped metacarpal weights, clothing patches on the arms, and bone-axis assumptions that put the wave behind the torso. A visual walking check showed continuous limbs and attached hands/feet after those fixes.

The model is an approximation of the reference. Facial identity, nuanced hair texture, skin detailing and final animation polish remain opportunities for further refinement; this pass does not claim an exact likeness.

`refinement-model-stats.json` records the actual model size and geometry. Twelve movement/asset/package checks pass. `character-results.json` records the current browser checks. Physical iPhone/Android validation is still pending. No hosting deployment or merge has been performed.
