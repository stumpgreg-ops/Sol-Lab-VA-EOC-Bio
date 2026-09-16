# Credits

SOL Lab is the SOL Labyrinth engine rebuilt for Biology. It is built with Phaser 3.80.1 (MIT, shipped in `js/vendor/phaser.min.js`) and PeerJS 1.5.4 (MIT, `js/vendor/peerjs.min.js`). Written for NNPS students practising the Virginia EOC Biology SOL.

## Music
All background music is from **Game Background Music Pack** by **EpsilonGamesOfficial** (itch.io, name-your-own-price):
https://epsilongamesofficial.itch.io/game-background-music-pack

Tracks used (converted from the pack's WAV files to MP3 in `assets/music/`): Boss Fight Piano, Chill Vibe #1–#4 (the pack's lo-fi hip hop tracks), Electricity, Gloomy Piano, Jazz Piano #1, Spring Forest Piano.

Pack terms (from the itch page): "You can use it in any commercial or non-commercial project, you also can modify them in the way you want them to sound."

## Town & Castle reward pieces
The reward pieces in `assets/build/` are 2D sprites pre-rendered from two 3D packs. The original 3D model files are not shipped with the game.

- **Modular Village Pack** by **Keith at Fertile Soil Productions** (itch.io, name-your-own-price):
  https://fertile-soil-productions.itch.io/modular-village-pack
  License: Creative Commons Zero v1.0 Universal (CC0). No attribution required; credited with thanks.
  Used for the Town pieces (cottages, houses, well, carts, market stalls, dock, windmill, watermill, bell tower, market square…). The Slate and Thatch style variants in `assets/build/styles/` are recolours of these renders.

- **FREE Castle and Fort Builder Pack** by **MCSTEEG** (itch.io, name-your-own-price):
  https://mcsteeg.itch.io/castle-and-fort-builder-pack
  Terms (from the itch page): "You may use this asset in your animation or game projects, both personally and commercially. DO NOT redistribute this asset as your own."
  Used for the Castle pieces (walls, gates, towers, keep, halls, citadel). The Sandstone and Whitestone style variants in `assets/build/styles/` are recolours of these renders.

## Castle tile kit
The castle in the reward builder is built from **Castle Kit 1.0** by **Kenney** (www.kenney.nl), Creative Commons Zero (CC0). The isometric renders live in `assets/build/kit/`; the Crimson, Forest and Gold sets are recolours of Kenney's blue accents made by `tools/make-castle-kit.py`. No attribution required; credited with thanks.

## Characters, interiors and props
- **Mana Seed Character Base** by Seliel the Shaper (free demo) — Sol's character sheets.
- **Modern Interiors** by LimeZu (free version) — floor and interior tiles.
- **Traps & Props** (free pack) — hazard and prop sprites.

## Sound effects
All in-game sound effects (grab, alarm, camera beep, catch, chime…) are synthesised at runtime in `js/audio.js`; no sample files.

## Extra castle decorations (v5)
- **Kenney Fantasy Town Kit** (CC0) — house walls and roofs, market stalls, carts, hedges, fences, fountains, lanterns, windmill, water wheel, trees, rocks. https://kenney.nl/assets/fantasy-town-kit
- **Kenney Nature Kit** (CC0) — trees, flowers, bushes, mushrooms, rocks, statues, obelisk, column, campfire, tent, crops, bridge. https://kenney.nl/assets/nature-kit
- **Kenney Graveyard Kit** (CC0) — benches, lamp posts, urns, pillars and the great column. https://kenney.nl/assets/graveyard-kit
- **Kenney Animal Pack Redux** (CC0) — the cow, horse, pig, goat, chicken, dog, rabbit, duck and owl stand-ups. https://kenney.nl/assets/animal-pack-redux
All are cropped, re-anchored and scaled to the castle kit's cell by `tools/make-castle-kit.py`; the stone knight and king are desaturated Castle Kit figures.
