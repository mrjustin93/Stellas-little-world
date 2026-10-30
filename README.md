# Stella’s Little World — mobile closet preview (v0.19)

A cozy browser game with a mobile-first closet. This version keeps Stella in a white tank top, white boyshort underwear, and bare feet. The original clothing catalogue and renderer remain in the source for later outfit development.

## Run

Serve this folder with any static HTTP server (do not open index.html as a file). For example, with Python installed:

    python -m http.server 8000

Open http://localhost:8000. Tap Step inside, then Closet. No build or runtime package installation is required.

## Controls

- Swipe over Stella or use the turn buttons to rotate; arrow keys also work in the closet.
- Face view switches to a closer portrait. Full view returns to the character.
- Walk preview animates in place without moving Stella or advancing game time.
- Reset view restores the front view and stops the walk preview.
- Save & return saves locally. If storage fails, the closet remains open with a retry button.
- Close or Escape returns to the game. The game controls cannot receive focus behind the closet.

Progress is stored in this browser at this site address. It does not sync across phones. Existing world, inventory, garden and journal data retain their original save format. This base-clothing edition deliberately uses the tank and boyshorts when loading an older outfit save.

## Validation

    node --test tests/*.test.js

Browser checks require Playwright and an installed browser. Start the server on port 8796 (or set GAME_URL), then:

    node qa/mobile-closet.cjs

Set BROWSER_CHANNEL=msedge to use Microsoft Edge. SCREENSHOT_DIR selects the capture directory. Coverage includes five viewport sizes, touch targets, rotation, modal focus, input isolation, persistence, failed-storage retry, and joystick release. Physical iOS/Android testing remains to be done.

## Artwork and future outfits

The supplied original Stella reference is the art direction: adult proportions, blonde pixie cut, blue eyes, white tank and short-style underwear. Directional head artwork is new and separate from the original assets; body and movement remain procedural. See assets/characters/STELLA-ART.md for generation details.

To restore outfit selection later, build the picker against CLOTHING and CATEGORY_LABELS in js/clothing.js, replace the base-edition assignment in Game's constructor with restoreClothes, and retain the save-error handling in DressingRoom. Do not replace the existing save key.
