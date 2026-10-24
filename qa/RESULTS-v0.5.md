# v0.5 verification

14 Node tests passed: movement, collisions, indoor reachability, day/night/time, timed crop growth and inventory yields, save/restore, invalid/corrupt storage, blocked save writes, safe position recovery, and walkable routes connecting the expanded outdoor regions.

Chromium/Playwright passed: larger world and camera following on both axes, backpack item counts, planting/watering/day-based ripening/harvest, persistent location/time/gate/crops/inventory after reload, jog toggle, map, flower gathering and 320px portrait through desktop layouts. Existing browser suites passed for touch movement/cancellation, keyboard, Luna and household activities, journal persistence/storage failure, garden travel, gate traversal and clock. No page errors or failed assets. Meadow screenshot inspected. These are simulated browsers, not a physical Galaxy S26.

`node qa/farm.cjs` tests the new farm flow. Set GAME_URL for other local ports. Other tests remain under tests/ and qa/.
