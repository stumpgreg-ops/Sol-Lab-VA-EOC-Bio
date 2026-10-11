#!/usr/bin/env python3
"""Build the "village" (Town) theme of assets/build/pieces.json from the castle kit.

Algebra 1.1.4: the Town is drawn with the same 3D models (and the same atlas sprites for the 2D fallback) as the
Castle. Its pieces are the castle kit's houses, village life, nature, animals, monuments, hedges and fences, plus
three town cores that grow a storey as the town grows, a bakery and a bell tower. The old Modular Village sprites
(assets/build/village-*.png, assets/build/styles/) are no longer referenced; js/build.js maps the old piece ids
to these when an old town is loaded.

Run it after tools/make-castle-kit.py (which rewrites the castle theme only):
  python3 tools/make-town-kit.py
"""
import os, json, copy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PJ = os.path.join(ROOT, "assets", "build", "pieces.json")

S = lambda name, o="NE": name + "_" + o

# castle pieces the town does not sell: the keeps, towers, curtain walls, flags, people and siege engines, the army
LEAVE_KINDS = {"core", "tower", "topper"}
LEAVE_CATS = {"people", "flag", "tower", "core"}
LEAVE_IDS = {"wall", "gate", "doorway", "stairs-wall", "corner-tower", "k-castle", "k-barracks", "k-archery", "k-tent",
             "k-tower-a", "k-tower-b", "k-tower-base", "k-tower-cannon", "k-tower-catapult",
             "k-target", "k-weapons", "k-cannonballs", "k-catapult", "k-cannon", "k-soldier", "k-banner", "k-flag"}
# the town's tiers (reward k offers tier ≤ ceil(k/5)): the castle's tier-1 pieces are towers and walls, which the town has not
TIER = {"c-cottage": 1, "hut": 1, "stable": 1, "k-home-a": 1, "k-home-b": 1,
        "barn": 2, "c-tavern": 2, "stone-hall": 2, "k-blacksmith": 2, "k-inn": 2, "k-lumbermill": 2, "k-workshop": 2, "k-market": 2, "k-stables": 2,
        "c-chapel": 3, "c-manor": 3, "c-windmill": 3, "k-church": 3, "k-watermill": 3, "k-windmill": 3, "k-mine": 3, "k-shrine": 3,
        "k-townhall": 4, "k-shipyard": 4}
# town names where the castle's read oddly
RENAME = {
    "c-cottage": ("Stone cottage", "A stone cottage with a gabled roof."),
    "c-tavern": ("Tavern", "A timber tavern with a tall gabled roof."),
    "c-chapel": ("Chapel", "A stone chapel with a steeple."),
    "c-manor": ("Manor house", "A two-storey manor with a dormer window."),
    "c-windmill": ("Windmill", "A stone tower with sails on top."),
    "k-inn": ("Inn", "A timbered inn with a sign over the door."),
    "k-watchtower": ("Watchtower", "A wooden lookout over the rooftops."),
    "c-hay-cart": ("Hay cart", "A cart piled with hay."),
    "k-well": ("Stone well", "A well with a roof in your colour."),
}

def core(id, name, desc, grow):
    return {"id": id, "theme": "village", "name": name, "desc": desc, "role": "core", "kind": "core", "tier": 1, "price": 80, "score": 40,
            "cells": 1, "cat": "core", "parts": grow[0], "grow": grow, "img": "", "nostyle": False}

def house(id, name, desc, parts, tier, price, score):
    return {"id": id, "theme": "village", "name": name, "desc": desc, "role": "module", "kind": "house", "tier": tier, "price": price, "score": score,
            "cells": 1, "cat": "house", "parts": parts, "img": "", "nostyle": False}

def main():
    d = json.load(open(PJ))
    castle = [p for p in d["pieces"] if p["theme"] == "castle"]
    sprites = d["kit"]["sprites"]
    if not castle or not sprites:
        raise SystemExit("pieces.json has no castle kit: run tools/make-castle-kit.py first")
    town = [
        # cores (reward 1): a home that grows a storey at each theme.growAt building count
        core("cottage", "Cottage", "A snug stone cottage with a gabled roof. It grows a storey as your town grows.",
             [[S("t_wallBlock"), S("t_roofGable")],
              [S("t_wallBlock"), S("t_wallBlock"), S("t_roofGable")],
              [S("t_wallBlock"), S("t_wallBlock"), S("t_roofHighWindow")],
              [S("t_wallBlock"), S("t_wallBlock"), S("t_wallBlock"), S("t_roofHighWindow")]]),
        core("house", "Timber house", "A timber house with a pointed roof. It grows a storey as your town grows.",
             [[S("t_wallWoodBlock"), S("t_roofPoint")],
              [S("t_wallWoodBlock"), S("t_wallWoodBlock"), S("t_roofPoint")],
              [S("t_wallWoodBlock"), S("t_wallWoodBlock"), S("t_roofHighGable")],
              [S("t_wallWoodBlock"), S("t_wallWoodBlock"), S("t_wallWoodBlock"), S("t_roofHighGable")]]),
        core("stone-cottage", "Village home", "A small house in your colour. It becomes a tall house, then an inn, as your town grows.",
             [[S("k_home_A")], [S("k_home_B")], [S("k_tavern")]]),
        # town-only buildings
        house("bakery", "Bakery", "A stone bakery with a dormer over the ovens.", [S("t_wallBlock"), S("t_roofHighWindow")], 2, 85, 35),
        house("bell-tower", "Bell tower", "A stone tower with an open bell loft and a tiled roof.", [S("towerSquareBase"), S("towerSquareMidOpen"), S("towerSquareTopRoof")], 3, 120, 50),
    ]
    for p in castle:
        if p.get("kind") in LEAVE_KINDS or p.get("cat") in LEAVE_CATS or p["id"] in LEAVE_IDS or p.get("boss"):
            continue
        q = copy.deepcopy(p); q["theme"] = "village"; q["img"] = ""
        if q["id"] in RENAME: q["name"], q["desc"] = RENAME[q["id"]]
        if q["id"] in TIER: q["tier"] = TIER[q["id"]]
        town.append(q)
    # every part must be in the kit atlas (the 2D view, thumbnails) — the 3D view falls back to the sprite for a part with
    # no model. Runs (auto) are drawn as geometry; only their NE sprite (the thumbnail) is checked, the atlas is NE-only.
    for p in town:
        names = list(p.get("parts") or []) + [n for g in (p.get("grow") or []) for n in g]
        a = p.get("auto")
        if a: names += a["u"] if isinstance(a["u"], list) else [a["u"]]
        for n in names:
            if n not in sprites: raise SystemExit("town piece %s uses a sprite the kit does not have: %s" % (p["id"], n))
    for t in (1, 2, 3, 4):
        if not any(p["role"] == "module" and p["tier"] == t for p in town): raise SystemExit("no town building of tier %d" % t)
    ids = [p["id"] for p in town]
    if len(ids) != len(set(ids)): raise SystemExit("duplicate town ids")
    d["pieces"] = [p for p in d["pieces"] if p["theme"] != "village"] + town
    old = d["themes"].get("village", {})
    d["themes"]["village"] = {
        "name": "Town", "desc": "A cottage that grows into a whole town: houses, mills, a market and a town hall, fences that turn corners, roofs in your colour.",
        "kit": True, "cell": d["kit"]["cellW"], "cellH": d["kit"]["cellH"], "unitPx": 1, "drawScale": 1, "wallLevel": 8,
        "growAt": [1, 4, 8, 13],
        "tabs": [["core", "Home"], ["house", "Buildings"], ["village", "Village life"], ["nature", "Nature"], ["animal", "Animals"], ["statue", "Monuments"]],
        # the old style ids stay (an old town keeps its colours): tile = red roofs, slate = blue, thatch = gold
        "styles": [
            {"id": "slate", "name": "Slate", "desc": "Blue slate roofs and awnings.", "dir": "", "pairs": ["thatch"]},
            {"id": "tile", "name": "Red Tile", "desc": "Red tile roofs and awnings.", "dir": "red/", "pairs": ["thatch"]},
            {"id": "green", "name": "Forest", "desc": "Green roofs and awnings.", "dir": "green/", "pairs": ["slate"]},
            {"id": "thatch", "name": "Thatch", "desc": "Golden straw roofs and awnings.", "dir": "gold/", "pairs": ["tile"]},
        ],
        "ranks": [[0, "Camp"], [120, "Hamlet"], [300, "Village"], [600, "Town"], [1000, "Market Town"], [1600, "Borough"], [2400, "City"]],
        # the ring that goes up by itself at wallLevel buildings (js/build.js raiseWalls): a wooden fence with a gate
        "ring": {"seg": "c-fence", "gate": "fence-gate"},
        "packs": [
            {"id": "lane", "name": "Lane pack", "desc": "Two lamp posts, a bench and two stone paths, 25% off.", "items": ["lamp-post", "lamp-post", "bench", "stone-path", "stone-path"], "discount": 0.25},
            {"id": "market", "name": "Market pack", "desc": "A market hall, two stalls, a cart and a well, 20% off.", "items": ["k-market", "stall-red", "stall-green", "cart", "k-well"], "discount": 0.2},
            {"id": "garden", "name": "Garden pack", "desc": "Flowers, an oak, bushes and a hedge, 25% off.", "items": ["flowers-mixed", "flowers-red", "oak", "bushes", "hedge"], "discount": 0.25},
            {"id": "farm", "name": "Farm pack", "desc": "A stable, a rail fence, a cow, a horse and a chicken, 20% off.", "items": ["stable", "rail-fence", "cow", "horse", "chicken"], "discount": 0.2},
            {"id": "town", "name": "Town pack", "desc": "A town hall, two houses, a well and a market hall, 20% off.", "items": ["k-townhall", "k-home-a", "k-home-b", "k-well", "k-market"], "discount": 0.2},
            {"id": "mills", "name": "Mill pack", "desc": "A lumber mill, a stone windmill and a water mill, 15% off.", "items": ["k-lumbermill", "k-windmill", "k-watermill"], "discount": 0.15},
            {"id": "monuments", "name": "Monument pack", "desc": "A fountain, an obelisk, a column and a knight statue, 20% off.", "items": ["fountain", "obelisk", "column", "knight-statue"], "discount": 0.2},
        ],
    }
    byid = {p["id"]: p for p in town}
    for pk in d["themes"]["village"]["packs"]:
        for it in pk["items"]:
            if it not in byid: raise SystemExit("pack %s names a piece the town does not have: %s" % (pk["id"], it))
    for k in ("c-fence", "fence-gate"):
        if k not in byid: raise SystemExit("ring piece missing: " + k)
    json.dump(d, open(PJ, "w"), indent=1)
    print("town pieces: %d (castle %d) -> %s" % (len(town), len(castle), PJ))

if __name__ == "__main__":
    main()
