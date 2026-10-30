# Stella v0.19 artwork

Source of identity: user-supplied original reference, file_00000000e40c81fd9a2c0d28ee0b3204.png. The original was left unchanged.

Asset: stella-heads-v19.svg. Generated with the built-in image generation tool, then copied into the project. 1536 × 1024 RGBA. Four columns, two rows: front, front-right, right, back-right, back, back-left, left, front-left. Runtime alpha bounds align each neck; high-resolution cached heads preserve detail in the enlarged preview. The rig selects the nearest directional head rather than cross-fading facial features.

Final generation prompt:

Create a production game character HEAD sprite atlas based exactly on the attached original Stella reference. Reference identity: adult woman, blue almond eyes, delicate heart-shaped face, small natural smile, short tousled side-swept honey blonde pixie cut. Match her original adult face, NOT a child or chibi doll. Rendered soft 3D illustration matching reference. OUTPUT: transparent background PNG, 4 columns by 2 rows of eight perfectly equal square cells; each cell contains ONLY her complete head and short neck, NO shoulders, NO body, NO clothing, NO text or labels or frames. All heads identical scale, hair tops aligned, neck cut ends aligned; generous transparent padding no overlap. Read left to right top row: front facing camera, 45-degree turned facing screen right, true right profile looking screen right, 135-degree back-right view. Bottom row: straight back of head, back-left 225-degree view, true left profile facing screen left, 315-degree front-left three-quarter view. Neutral level head, upright neck and eyes horizontal in each view. Same character consistent hair identity, soft balanced lighting. Fine natural hair strands, clear blue eyes, no accessories. This head atlas will be attached to an existing animated adult character body.

Correction pass prompt:

Edit this head atlas: remove ALL brown background to genuine alpha transparency around the heads and necks, including space between cells. Keep exactly the 4 by 2 layout and original dimensions. Preserve face identity, hair detail, scale and position. Correct only these directions: top row second head should turn nose towards screen RIGHT (mirror its facing); bottom row second head must show BACK-LEFT of head, ear on screen LEFT (mirror its facing). Other six heads unchanged. Absolutely transparent background, no brown, no checkerboard painted in, no cast shadows or glows outside silhouette. These are isolated game sprites.

Alpha was verified programmatically (transparent pixels exist). No generated background is rendered in the game.

Distribution: the SVG contains the generated PNG unchanged as an embedded data image, so the connected GitHub text-file API can upload it losslessly. It is not a vector replacement for the generated artwork.
