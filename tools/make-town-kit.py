"""Make the Town builder a 3D kit theme on the castle's models: python3 tools/make-town-kit.py

Rewrites the "village" theme and its pieces in assets/build/pieces.json (v6.6). The Town used to be 32 flat
pictures; now it is drawn by js/build3d.js from the same 3D models as the Castle (assets/build/models: the KayKit
buildings, the town kit, the nature, graveyard and castle kits), in the castle's four colours, turns with the map by
the degree, and grows like the castle:

  - every old town piece keeps its id (saved towns, progress codes and the maze perks still find them), name and
    description, and is drawn with the matching 3D model (the tavern is the KayKit tavern, the chapel the church, ...);
  - the three cottages are the cores and grow a storey at each growth step, like the keep;
  - at the wall level a wooden fence with a gate goes up round the town (theme.ring) instead of curtain walls;
  - every other castle model the town did not have yet (trees, flowers, animals, statues, market props, towers,
    flags, people, the Fenrir trophies) is in the town's palette too, so both builds share every model.

Run it again after changing the castle's pieces; it is idempotent (it rebuilds the town from the castle each time).
"""
import json, copy, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PATH = os.path.join(ROOT, "assets", "build", "pieces.json")
data = json.load(open(PATH))
castle_theme = data["themes"]["castle"]
castle = [p for p in data["pieces"] if p["theme"] == "castle"]
sprites = data["kit"]["sprites"]

castle_names = set(json.dumps([p.get("parts"), p.get("grow"), p.get("auto")]) for p in castle)
castle_text = " ".join(castle_names)
def part(name):
    """a sprite name must exist in the kit, or be one the castle already uses (the builder falls back to a run's
       first orientation when a turned one is missing)"""
    if name not in sprites and ('"%s"' % name) not in castle_text:
        sys.exit("make-town-kit: no kit sprite %s" % name)
    return name

# ── the town's own pieces: the old ids, names and descriptions, now 3D ─────────────────────────────────────
# (id, name, desc, role, kind, cat, tier, price, score, cells, parts | grow | auto)
WOOD, STONE = "t_wallWoodBlock_NE", "t_wallBlock_NE"
def grow(wall, roofs):
    """a core that gains a storey at each growth step (theme.growAt), the last two with a taller roof"""
    return [[wall, roofs[0]], [wall, wall, roofs[1]], [wall, wall, roofs[2]], [wall, wall, wall, roofs[3]]]
TOWN = [
    # the cores: one is the first reward, and it grows with the town
    dict(id="cottage", name="Cottage", desc="A snug timber home to start from. It grows a storey as your town grows.",
         role="core", kind="core", cat="core", tier=1, price=80, score=40, cells=1,
         grow=grow(WOOD, ["t_roofGable_NE", "t_roofGable_NE", "t_roofHighGable_NE", "t_roofHighWindow_NE"])),
    dict(id="stone-cottage", name="Stone cottage", desc="Thick stone walls and a pointed roof. It grows a storey as your town grows.",
         role="core", kind="core", cat="core", tier=1, price=80, score=40, cells=1,
         grow=grow(STONE, ["t_roofPoint_NE", "t_roofPoint_NE", "t_roofHighPoint_NE", "t_roofHighPoint_NE"])),
    dict(id="house", name="Two-storey house", desc="Windows upstairs and a tall roof. It grows a storey as your town grows.",
         role="core", kind="core", cat="core", tier=1, price=80, score=40, cells=1,
         grow=grow(STONE, ["t_roofHighWindow_NE", "t_roofHighWindow_NE", "t_roofHighWindow_NE", "t_roofHighWindow_NE"])),
    # buildings (the reward offers and the Buildings tab)
    dict(id="stall", name="Market hall", desc="A covered market with stalls all round. Two cells wide.", role="module", kind="house", cat="house", tier=1, price=60, score=30, cells=2, parts=["k_market_NE"]),
    dict(id="cottage-wing", name="Cottage wing", desc="A second timber cottage beside the first.", role="module", kind="house", cat="house", tier=1, price=40, score=20, cells=1, parts=[WOOD, "t_roofGable_NE"]),
    dict(id="stone-wing", name="Stone wing", desc="A stone room with a pointed roof.", role="module", kind="house", cat="house", tier=1, price=45, score=22, cells=1, parts=[STONE, "t_roofPoint_NE"]),
    dict(id="house-wing", name="House wing", desc="A two-storey wing with a tall roof.", role="module", kind="house", cat="house", tier=2, price=80, score=34, cells=1, parts=[STONE, STONE, "t_roofHigh_NE"]),
    dict(id="bakery", name="Bakery", desc="A baker's house with a big chimney and fresh bread.", role="module", kind="house", cat="house", tier=2, price=80, score=34, cells=1, parts=["k_home_B_NE"]),
    dict(id="chapel", name="Chapel", desc="A church with a bell over the door.", role="module", kind="house", cat="house", tier=2, price=90, score=38, cells=1, parts=["k_church_NE"]),
    dict(id="arch", name="Stone arch", desc="A grand stone archway into the yard.", role="module", kind="tower", cat="tower", tier=2, price=80, score=34, cells=1, parts=["towerSquareArch_NE", "towerSquareTop_NE"]),
    dict(id="dock", name="Boat dock", desc="A wooden pier over the water.", role="module", kind="house", cat="house", tier=2, price=60, score=26, cells=1, parts=["n_bridge_wood_NE"]),
    dict(id="tavern", name="Tavern", desc="A sign, a lamp and a warm door.", role="module", kind="house", cat="house", tier=3, price=110, score=46, cells=1, parts=["k_tavern_NE"]),
    dict(id="windmill", name="Windmill", desc="Sails turning over the fields.", role="module", kind="house", cat="house", tier=3, price=110, score=46, cells=1, parts=["k_windmill_NE"]),
    dict(id="watermill", name="Watermill", desc="A wheel turned by the stream.", role="module", kind="house", cat="house", tier=3, price=110, score=46, cells=1, parts=["k_watermill_NE"]),
    dict(id="square", name="Market square", desc="A paved square round a fountain.", role="module", kind="house", cat="house", tier=3, price=120, score=50, cells=1, parts=["t_fountainSquare_NE"]),
    dict(id="harbour", name="Harbour", desc="A shipyard with a boat on the slip. Two cells wide.", role="module", kind="house", cat="house", tier=3, price=140, score=58, cells=2, parts=["k_shipyard_NE"]),
    dict(id="manor", name="Manor house", desc="Three storeys of stone and a windowed roof.", role="module", kind="house", cat="house", tier=4, price=160, score=66, cells=1, parts=[STONE, STONE, STONE, "t_roofHighWindow_NE"]),
    dict(id="town-hall", name="Town hall", desc="Steps, a bell and an ornate door. Two cells wide.", role="module", kind="house", cat="house", tier=4, price=180, score=74, cells=2, parts=["k_townhall_NE"]),
    dict(id="bell-tower", name="Bell tower", desc="The tallest thing in town, open at the top for the bell.", role="module", kind="tower", cat="tower", tier=4, price=170, score=70, cells=1,
         parts=["towerSquareBase_NE", "towerSquareMid_NE", "towerSquareMidOpen_NE", "towerSquareTopRoofHigh_NE"]),
    dict(id="grand-mill", name="Grand windmill", desc="A stone mill with huge sails.", role="module", kind="house", cat="house", tier=4, price=170, score=70, cells=1, parts=[STONE, STONE, "t_windmill_NE"]),
    # the fence that goes round the town at the wall level (theme.ring), and its gate
    dict(id="fence", name="Wooden fence", desc="Posts and rails round the town. It turns corners by itself.", role="module", kind="wall", cat="wall", tier=1, price=8, score=4, cells=1,
         auto={"u": "t_fence_NE", "v": "t_fence_NW", "corner": {"-u+v": "t_fenceCurved_NE", "-u-v": "t_fenceCurved_SE", "+u-v": "t_fenceCurved_SW", "+u+v": "t_fenceCurved_NW"}}),
    dict(id="fence-gate", name="Fence gate", desc="A gate in the town fence.", role="module", kind="wall", cat="wall", tier=1, price=10, score=5, cells=1,
         auto={"u": "t_fenceGate_NE", "v": "t_fenceGate_NW"}),
    # decorations
    dict(id="steps", name="Stone steps", desc="Stone steps up to a door or a wall.", role="deco", kind="prop", cat="village", tier=1, price=15, score=6, cells=1, parts=["stairsStone_NE"]),
    dict(id="lamp-path", name="Lamp-lit lane", desc="A lamp post to light the lane.", role="deco", kind="prop", cat="village", tier=1, price=20, score=8, cells=1, parts=["g_lightpostDouble_NE"]),
    dict(id="well", name="Village well", desc="Fresh water in the square.", role="deco", kind="prop", cat="village", tier=1, price=30, score=12, cells=1, parts=["k_well_NE"]),
    dict(id="lamp", name="Street lamp", desc="A little light for the path.", role="deco", kind="prop", cat="village", tier=1, price=15, score=6, cells=1, parts=["t_lantern_NE"]),
    dict(id="barrels", name="Barrel stack", desc="Barrels by the door.", role="deco", kind="prop", cat="village", tier=1, price=12, score=5, cells=1, parts=["k_barrels_NE"]),
    dict(id="crates", name="Crates", desc="Supplies for the household.", role="deco", kind="prop", cat="village", tier=1, price=12, score=5, cells=1, parts=["k_crates_NE"]),
    dict(id="hay-cart", name="Hay cart", desc="A farmer's cart full of hay.", role="deco", kind="prop", cat="village", tier=1, price=25, score=10, cells=1, parts=["t_cartHigh_NE"]),
    dict(id="barrel-cart", name="Merchant cart", desc="A merchant's cart bound for market.", role="deco", kind="prop", cat="village", tier=1, price=30, score=12, cells=1, parts=["k_merchant_cart_NE"]),
    dict(id="haystacks", name="Haystacks", desc="Harvest piled high.", role="deco", kind="prop", cat="village", tier=1, price=12, score=5, cells=1, parts=["k_haybales_NE"]),
    dict(id="cobbles", name="Cobbled path", desc="A paved stone path.", role="deco", kind="prop", cat="village", tier=1, price=10, score=4, cells=1, parts=["n_path_stone_NE"]),
    dict(id="signpost", name="Sign post", desc="Which way to the market?", role="deco", kind="prop", cat="village", tier=1, price=10, score=4, cells=1, parts=["n_sign_NE"]),
]
town = []
for t in TOWN:
    p = {"id": t["id"], "theme": "village", "name": t["name"], "desc": t["desc"], "role": t["role"], "kind": t["kind"],
         "tier": t["tier"], "price": t["price"], "score": t["score"], "cells": t["cells"], "cat": t["cat"]}
    for k in ("parts", "grow", "auto"):
        if k in t: p[k] = t[k]
    if "auto" in t: p["shopOnly"] = True      # the fence and its gate come from the shop and the wall level, not as rewards
    if "grow" in p: p["parts"] = p["grow"][0]
    for nm in (p.get("parts") or []) + [x for g in p.get("grow", []) for x in g]:
        part(nm)
    if "auto" in p:
        for v in p["auto"].values():
            for nm in (v.values() if isinstance(v, dict) else (v if isinstance(v, list) else [v])):
                part(nm)
    p["img"] = ""; p["nostyle"] = False
    town.append(p)

# ── every other castle model, so the Town and the Castle share all of them ───────────────────────────────────
def key(p):
    """what a piece looks like: its parts, its run, or its grown form"""
    if "auto" in p: return json.dumps(p["auto"], sort_keys=True)
    if "grow" in p: return json.dumps(p["grow"][-1])
    return json.dumps(p.get("parts") or [])
have_ids = {p["id"] for p in town}
have_look = {key(p) for p in town}
SKIP = {"keep", "round-keep", "watch-keep",        # the castle's cores (the town has its cottages)
        "wall", "gate", "doorway", "stairs-wall", "corner-tower"}   # curtain walls (the town has its fence)
MILITARY = {"k-castle", "k-barracks", "k-archery"}
added = 0
for p in castle:
    if p["id"] in SKIP or p["id"] in have_ids or key(p) in have_look:
        continue
    q = copy.deepcopy(p); q["theme"] = "village"
    # castle towers and military buildings are in the town's shop and palette, never in its free reward offers
    if q["role"] == "module" and (q.get("kind") == "tower" or q["id"] in MILITARY):
        q["shopOnly"] = True
    town.append(q); have_ids.add(q["id"]); have_look.add(key(q)); added += 1

# ── the theme ───────────────────────────────────────────────────────────────────────────────────────────────
old = data["themes"].get("village", {})
theme = {
    "name": "Town",
    "desc": "A cottage that grows into a whole town: homes, a tavern, mills, a market and a town hall, in your colour.",
    "kit": True, "cell": castle_theme["cell"], "cellH": castle_theme["cellH"], "unitPx": 1, "drawScale": 1,
    "wallLevel": castle_theme.get("wallLevel", 8), "growAt": castle_theme.get("growAt", [1, 4, 8, 13]),
    "styles": copy.deepcopy(castle_theme["styles"]),
    "tabs": [["core", "Home"], ["house", "Buildings"], ["wall", "Fences & gates"], ["tower", "Towers"], ["village", "Market & yard"],
             ["nature", "Nature"], ["statue", "Statues"], ["animal", "Animals"], ["people", "People"], ["flag", "Flags"]],
    "ranks": [[0, "Hamlet"], [120, "Village"], [300, "Town"], [600, "Market town"], [1000, "Borough"], [1600, "City"], [2400, "Royal city"]],
    # at the wall level a fence (with one gate) goes up round the town (js/build.js raiseWalls)
    "ring": {"seg": "fence", "gate": "fence-gate"},
    "notes": {"core": "cottage", "walls": "A fence went up round your town — drag any length to reshape it!",
              "wallsSoon": "One more building and a fence goes up round your town.", "grew": "Your cottage grew a storey"},
    "packs": [
        {"id": "homes", "name": "Homes pack", "desc": "A cottage wing, a stone wing and a bakery, 15% off.", "items": ["cottage-wing", "stone-wing", "bakery"], "discount": 0.15},
        {"id": "market", "name": "Market pack", "desc": "A market hall, a well, a merchant cart and crates, 20% off.", "items": ["stall", "well", "barrel-cart", "crates"], "discount": 0.2},
        {"id": "mills", "name": "Mills pack", "desc": "A windmill, a watermill and haystacks, 15% off.", "items": ["windmill", "watermill", "haystacks"], "discount": 0.15},
        {"id": "fence", "name": "Fence pack", "desc": "Four lengths of fence and a gate, 25% off. They turn corners by themselves.", "items": ["fence", "fence", "fence", "fence", "fence-gate"], "discount": 0.25},
        {"id": "garden", "name": "Garden pack", "desc": "Flowers, an oak, bushes and a hedge, 25% off.", "items": ["flowers-mixed", "flowers-red", "oak", "bushes", "hedge"], "discount": 0.25},
        {"id": "farm", "name": "Farm pack", "desc": "A stable, a rail fence, a cow, a horse and a chicken, 20% off.", "items": ["stable", "rail-fence", "cow", "horse", "chicken"], "discount": 0.2},
        {"id": "civic", "name": "Civic pack", "desc": "A town hall, a chapel and a market square, 15% off.", "items": ["town-hall", "chapel", "square"], "discount": 0.15},
        {"id": "monuments", "name": "Monument pack", "desc": "A fountain, an obelisk, a column and a knight statue, 20% off.", "items": ["fountain", "obelisk", "column", "knight-statue"], "discount": 0.2},
    ],
}
for pk in theme["packs"]:
    for it in pk["items"]:
        if it not in have_ids: sys.exit("make-town-kit: pack %s names %s, which the town does not have" % (pk["id"], it))
data["themes"]["village"] = theme
data["pieces"] = [p for p in data["pieces"] if p["theme"] != "village"] + town
json.dump(data, open(PATH, "w"), ensure_ascii=False, indent=1)
roles = {}
for p in town: roles[p["role"]] = roles.get(p["role"], 0) + 1
print("assets/build/pieces.json: the Town is a 3D kit theme: %d pieces (%d town pieces, %d shared from the castle) %s"
      % (len(town), len(TOWN), added, json.dumps(roles)))
