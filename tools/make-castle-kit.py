#!/usr/bin/env python3
"""Build the castle tile kit for the reward builder from Kenney's Castle Kit (CC0).

Source: a checkout of Kenney's "Castle Kit 1.0" isometric renders, e.g. the
GitHub mirror ETdoFresh/kenney.nl (castle-kit-1.0/Isometric). Pass its path as
the first argument. Writes:
  assets/build/kit/<sprite>_<orient>.png          the blue (default) set
  assets/build/kit/<color>/<sprite>_<orient>.png  red / green / gold recolours
                                                   (only sprites that carry blue)
and rewrites the "castle" theme in assets/build/pieces.json with kit modules.

Geometry: every kit tile is one isometric cell, 151 px wide and 87 px tall
(true 30° isometric). A sprite's bottom-centre pixel is the cell's front apex.
A stack part sits on the previous part: lift = sprite height - diamond height.
"""
import os, sys, json, glob, colorsys, shutil
import numpy as np
from PIL import Image

ARG = sys.argv[1] if len(sys.argv) > 1 else "kenney-mirror"
# v5: pass the Kenney mirror root (ETdoFresh/kenney.nl checkout). A path ending in castle-kit-1.0/Isometric still works.
if ARG.rstrip("/").endswith("Isometric"):
    MIRROR = os.path.dirname(os.path.dirname(ARG.rstrip("/")))
    SRC = ARG
else:
    MIRROR = ARG
    SRC = os.path.join(MIRROR, "castle-kit-1.0", "Isometric")
EXTRA = {   # other CC0 Kenney kits rendered on 512 px canvases with a 130 px floor cell; suffix style per kit
    "t": (os.path.join(MIRROR, "fantasy-town-kit-1.0", "Isometric"), "road", {"NE": "E", "NW": "N", "SW": "W", "SE": "S"}),
    "n": (os.path.join(MIRROR, "kenney_natureKit_2.1", "Isometric"), "ground_grass", {"NE": "NE", "NW": "NW", "SW": "SW", "SE": "SE"}),
    "g": (os.path.join(MIRROR, "kenney_graveyardkit_3", "Isometric"), "road", {"NE": "NE", "NW": "NW", "SW": "SW", "SE": "SE"}),
}
ANIMALS = os.path.join(MIRROR, "kenney_animalpackredux", "PNG", "Round")
ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "assets", "build", "kit")
CELL_W, CELL_H = 151, 87.2

COLORS = {          # hue in degrees for the blue accents (flags, roofs, colour bands)
    "red":   (355, 1.05, 1.0),
    "green": (128, 0.9, 0.95),
    "gold":  (44, 1.1, 1.08),
}
ORIENTS = ["NE", "NW", "SE", "SW"]

# sprites we ship (name -> orientations)
SPRITES = {  # v5.1: every sprite in all four orientations so pieces can be turned
    "wall": ORIENTS,
    "wallCorner": ORIENTS,
    "wallDoor": ORIENTS,
    "metalGate": ORIENTS,
    "wallNarrowStairs": ORIENTS,
    "wallCornerHalfTower": ORIENTS,
    "wallHalf": ORIENTS,
    "towerBase": ORIENTS,
    "towerTop": ORIENTS,
    "towerTopRoof": ORIENTS,
    "towerBalcony": ORIENTS,
    "towerSquareBase": ORIENTS,
    "towerSquareBaseColor": ORIENTS,
    "towerSquareMid": ORIENTS,
    "towerSquareMidWindows": ORIENTS,
    "towerSquareMidOpen": ORIENTS,
    "towerSquareMidColor": ORIENTS,
    "towerSquareArch": ORIENTS,
    "towerSquareTop": ORIENTS,
    "towerSquareTopRoof": ORIENTS,
    "towerSquareTopRoofHigh": ORIENTS,
    "towerSquareTopColor": ORIENTS,
    "towerSquareRoof": ORIENTS,
    "towerSquarePoles": ORIENTS,
    "flagBlue": ORIENTS,
    "flagBlueWide": ORIENTS,
    "flagBannerLong": ORIENTS,
    "flagBannerShort": ORIENTS,
    "shieldBlue": ORIENTS,
    "bridge": ORIENTS,
    "stairsStone": ORIENTS,
    "king": ORIENTS,
    "knightBlue": ORIENTS,
    "knightRed": ORIENTS,
    "siegeBallista": ORIENTS,
    "siegeCatapult": ORIENTS,
    "siegeRam": ORIENTS,
    "siegeTower": ORIENTS,
    "siegeTrebuchet": ORIENTS,
}

def is_blue(h, s, v):
    return (h > 0.52) & (h < 0.70) & (s > 0.42) & (v > 0.15)

def recolour(img, hue, sgain, vgain):
    a = np.array(img.convert("RGBA")).astype(float) / 255.0
    m = a[..., 3] > 0.02
    rgb = a[m][:, :3]
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in rgb])
    sel = is_blue(hsv[:, 0], hsv[:, 1], hsv[:, 2])
    if not sel.any():
        return None
    hsv[sel, 0] = hue / 360.0
    hsv[sel, 1] = np.clip(hsv[sel, 1] * sgain, 0, 1)
    hsv[sel, 2] = np.clip(hsv[sel, 2] * vgain, 0, 1)
    out = np.array([colorsys.hsv_to_rgb(*p) for p in hsv])
    a[m, :3] = out
    return Image.fromarray((a * 255).round().astype(np.uint8), "RGBA")

def geom(path):
    im = Image.open(path)
    w, h = im.size
    diamond = w * 0.5774                      # true-iso diamond height for this sprite's width
    return {"w": w, "h": h, "lift": max(0, round(h - diamond))}

# ── extra kits (town / nature / graveyard) ──────────────────────────────────
# Every render is a 512×512 canvas; the object's ground origin is the centre of a 130 px floor cell whose
# front apex sits at (256, apexY). We crop symmetrically about x=256 down to that apex, scale to the castle
# cell (151 px) and record oy = how far the sprite hangs below the apex (0 for almost everything).
_ref = {}
def kit_ref(key):
    if key in _ref:
        return _ref[key]
    src, floor, suf = EXTRA[key]
    im = Image.open(os.path.join(src, floor + "_" + suf["NE"] + ".png")).convert("RGBA")
    bb = im.getbbox()
    _ref[key] = {"apexY": bb[3], "cell": bb[2] - bb[0], "scale": CELL_W / float(bb[2] - bb[0])}
    return _ref[key]

def scale_about(im, k, ox, oy):
    """Scale a canvas by k keeping the point (ox, oy) fixed (used to make tiny flowers readable)."""
    w, h = im.size
    big = im.resize((int(round(w * k)), int(round(h * k))), Image.LANCZOS)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.alpha_composite(big, (int(round(ox - ox * k)), int(round(oy - oy * k))))
    return out

def import_canvas(key, name, orient, out_name, k=1.0, lift=None, offsets=None, variants=None, base=False):
    """Import one render from an extra kit. offsets/variants composite several copies (flower beds)."""
    src, floor, suf = EXTRA[key]
    ref = kit_ref(key)
    if offsets:
        canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        for i, (dx, dy) in enumerate(offsets):
            v = variants[i % len(variants)]
            im = Image.open(os.path.join(src, v + "_" + suf[orient] + ".png")).convert("RGBA")
            if k != 1.0:
                im = scale_about(im, k, 256, ref["apexY"] - ref["cell"] * 0.25)
            canvas.alpha_composite(im, (dx, dy))
        im = canvas
    else:
        im = Image.open(os.path.join(src, name + "_" + suf[orient] + ".png")).convert("RGBA")
        if k != 1.0:
            im = scale_about(im, k, 256, ref["apexY"] - ref["cell"] * 0.25)
    bb = im.getbbox()
    hw = max(256 - bb[0], bb[2] - 256)
    apex = bb[3] if base else ref["apexY"]           # base=True: the render's own bottom is its ground line (windmill, water wheel)
    y1 = max(bb[3], apex)
    crop = im.crop((256 - hw, bb[1], 256 + hw, y1))
    sc = ref["scale"]
    crop = crop.resize((max(1, int(round(crop.width * sc))), max(1, int(round(crop.height * sc)))), Image.LANCZOS)
    dst = os.path.join(OUT, out_name + ".png")
    crop.save(dst, optimize=True)
    g = {"w": crop.width, "h": crop.height, "lift": lift if lift is not None else max(0, round(crop.height - CELL_H)),
         "oy": int(round((y1 - apex) * sc))}
    return g

def import_animal(name, width=66):
    im = Image.open(os.path.join(ANIMALS, name + ".png")).convert("RGBA")
    bb = im.getbbox(); im = im.crop(bb)
    k = width / float(im.width)
    im = im.resize((width, max(1, int(round(im.height * k)))), Image.LANCZOS)
    # a soft ground shadow so the stand-up reads as standing on the cell
    pad = 6
    out = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    from PIL import ImageDraw
    sh = Image.new("RGBA", out.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse((pad, im.height - 6 + pad, im.width + pad, im.height + 8 + pad), fill=(0, 0, 0, 70))
    out.alpha_composite(sh); out.alpha_composite(im, (pad, pad))
    dst = os.path.join(OUT, "a_" + name + ".png")
    out.save(dst, optimize=True)
    return {"w": out.width, "h": out.height, "lift": 0, "oy": -int(round(CELL_H * 0.32))}

def to_stone(path_in, out_name):
    """A statue version of a castle figure: desaturated, lightened, slightly bluish stone."""
    a = np.array(Image.open(path_in).convert("RGBA")).astype(float)
    lum = a[..., :3] @ np.array([0.3, 0.59, 0.11])
    stone = np.stack([lum * 0.78 + 60, lum * 0.78 + 62, lum * 0.78 + 70], axis=-1)
    a[..., :3] = np.clip(stone, 0, 255)
    im = Image.fromarray(a.round().astype(np.uint8), "RGBA")
    im.save(os.path.join(OUT, out_name + ".png"), optimize=True)
    return geom(os.path.join(OUT, out_name + ".png"))

def main():
    os.makedirs(OUT, exist_ok=True)
    for c in COLORS: os.makedirs(os.path.join(OUT, c), exist_ok=True)
    sprites = {}
    n_files = 0
    for name, orients in SPRITES.items():
        for o in orients:
            src = os.path.join(SRC, "%s_%s.png" % (name, o))
            if not os.path.exists(src):
                print("missing", src); continue
            dst = os.path.join(OUT, "%s_%s.png" % (name, o))
            shutil.copyfile(src, dst); n_files += 1
            sprites["%s_%s" % (name, o)] = geom(dst)
            img = Image.open(src)
            for c, (hue, sg, vg) in COLORS.items():
                r = recolour(img, hue, sg, vg)
                if r is not None:
                    r.save(os.path.join(OUT, c, "%s_%s.png" % (name, o)), optimize=True); n_files += 1
                    sprites["%s_%s" % (name, o)]["coloured"] = True
    print("wrote", n_files, "castle sprites")

    # ── extra sprites: town, nature, graveyard, animals, stone statues ────────
    have_extra = all(os.path.isdir(EXTRA[k][0]) for k in EXTRA) and os.path.isdir(ANIMALS)
    if not have_extra:
        print("extra kits not found under", MIRROR, "— castle only")
    def X(key, name, orient="NE", out=None, **kw):
        out = out or (key + "_" + name + "_" + orient)
        sprites[out] = import_canvas(key, name, orient, out, **kw)
        sprites[out]["coloured"] = False
        return out
    if have_extra:
        # town kit: house blocks and roofs (stackable), village props, hedges and fences (all four orientations)
        for nm in ["wallBlock", "wallWoodBlock", "roofGable", "roofHigh", "roofHighPoint", "roofPoint", "roofHighGable", "roof", "roofHighWindow",
                   "stallRed", "stallGreen", "cart", "cartHigh", "lantern", "fountainRound", "fountainSquare",
                   "tree", "treeHigh", "treeHighRound", "rockLarge", "pillarStone", "planks", "hedge", "hedgeGate", "fence", "fenceGate", "hedgeCurved", "fenceCurved"]:
            for o in ORIENTS: X("t", nm, o)
        for o in ORIENTS: X("t", "windmill", o, base=True); X("t", "watermill", o, base=True)
        # nature kit
        for nm in ["tree_oak", "tree_pineDefaultA", "tree_default_fall", "tree_detailed", "tree_small", "tree_tall", "tree_pineRoundA",
                   "plant_bush", "plant_bushLarge", "mushroom_redGroup", "mushroom_tanGroup", "rock_largeA", "rock_smallA", "rock_tallA",
                   "statue_column", "statue_obelisk", "statue_head", "statue_ring", "log_stack", "campfire_stones", "tent_detailedOpen",
                   "sign", "pot_large", "crops_wheatStageB", "crop_pumpkin", "bridge_wood", "path_stone", "lily_large", "stump_round",
                   "fence_simple", "fence_gate", "fence_corner"]:
            for o in ORIENTS: X("n", nm, o)
        for o in ORIENTS: X("n", "statue_block", o, lift=34)                             # a pedestal: figures stand on it
        # flower beds: six flowers of one colour (or mixed) scattered on the cell, scaled up so they read
        beds = {"red": ["flower_redA", "flower_redB", "flower_redC"], "purple": ["flower_purpleA", "flower_purpleB", "flower_purpleC"],
                "yellow": ["flower_yellowA", "flower_yellowB", "flower_yellowC"],
                "mixed": ["flower_redA", "flower_yellowB", "flower_purpleC", "flower_redC", "flower_yellowA", "flower_purpleB"]}
        offs = [(0, -16), (-30, -4), (30, -4), (-15, 9), (15, 9), (0, 1)]
        for col, vs in beds.items():
            X("n", "flowerbed_" + col, out="n_flowerbed_" + col, k=1.7, offsets=offs, variants=vs)
        X("n", "plant_bush", out="n_bushes", k=1.3, offsets=[(-22, 2), (24, -8), (0, 12)], variants=["plant_bush", "plant_bushLarge", "plant_bushSmall"])
        # graveyard kit: benches, lamp posts, urns, a big column
        for nm in ["bench", "lightpostSingle", "lightpostDouble", "urn", "columnLarge", "lanternGlass", "pillarObelisk"]:
            for o in ORIENTS: X("g", nm, o)
        # animals (flat stand-ups)
        for nm in ["cow", "horse", "pig", "goat", "chicken", "dog", "rabbit", "duck", "owl"]:
            sprites["a_" + nm] = import_animal(nm); sprites["a_" + nm]["coloured"] = False
        # stone statues of the castle figures
        for base_name, src_name in [("s_knight", "knightBlue"), ("s_king", "king")]:
            for o in ORIENTS:
                nm = base_name + "_" + o
                sprites[nm] = to_stone(os.path.join(OUT, src_name + "_" + o + ".png"), nm); sprites[nm]["coloured"] = False
        print("wrote extra sprites:", sum(1 for k in sprites if k[:2] in ("t_", "n_", "g_", "a_", "s_")))

    # ── modules ──────────────────────────────────────────────────────────────
    def M(id, name, desc, kind, tier, price, score, parts=None, fits=None, extra=None, cat=None):
        m = {"id": id, "theme": "castle", "name": name, "desc": desc, "role": "core" if kind == "core" else ("deco" if kind in ("topper", "prop") else "module"),
             "kind": kind, "tier": tier, "price": price, "score": score, "cells": 1,
             "cat": cat or {"core": "core", "tower": "tower", "wall": "wall", "topper": "flag", "prop": "people", "house": "house"}.get(kind, "people")}
        if parts: m["parts"] = parts
        if extra: m.update(extra)
        return m
    def P(id, name, desc, sprite, tier, price, score, cat, parts=None):          # a ground prop from the extra kits
        return M(id, name, desc, "prop", tier, price, score, parts or [sprite], None, None, cat)
    def A(id, name, desc, u, v, corners, tier, price, score, cat):                  # an auto-tiled fence/hedge run (a decoration, not a reward building)
        ex = {"auto": {"u": u, "v": v}, "role": "deco"}
        if corners: ex["auto"]["corner"] = corners
        return M(id, name, desc, "wall", tier, price, score, None, None, ex, cat)
    S = lambda name, o="NE": name + "_" + o
    modules = [
        # cores (reward 1): a modest keep that grows a storey as the castle grows (theme.growAt = building counts per stage)
        M("keep", "Keep", "A modest square keep with a tiled roof. It grows taller as your castle grows.", "core", 1, 80, 40,
          [S("towerSquareBase"), S("towerSquareTopRoof")], None,
          {"grow": [[S("towerSquareBase"), S("towerSquareTopRoof")],
                    [S("towerSquareBase"), S("towerSquareMidWindows"), S("towerSquareTopRoof")],
                    [S("towerSquareBaseColor"), S("towerSquareMidWindows"), S("towerSquareMidColor"), S("towerSquareTopRoofHigh")],
                    [S("towerSquareBaseColor"), S("towerSquareMidWindows"), S("towerSquareMidColor"), S("towerSquareMidWindows"), S("towerSquareTopRoofHigh")]]}),
        M("round-keep", "Round keep", "A small round keep with a pointed roof. It grows taller as your castle grows.", "core", 1, 80, 40,
          [S("towerBase"), S("towerTopRoof")], None,
          {"grow": [[S("towerBase"), S("towerTopRoof")],
                    [S("towerBase"), S("towerTop"), S("towerTopRoof")],
                    [S("towerBase"), S("towerBase"), S("towerBalcony"), S("towerTopRoof")],
                    [S("towerBase"), S("towerBase"), S("towerBalcony"), S("towerTop"), S("towerTopRoof")]]}),
        M("watch-keep", "Watch keep", "A squat keep with battlements. It grows a lookout as your castle grows.", "core", 1, 80, 38,
          [S("towerSquareBase"), S("towerSquareTop")], None,
          {"grow": [[S("towerSquareBase"), S("towerSquareTop")],
                    [S("towerSquareBase"), S("towerSquareMidOpen"), S("towerSquareTop")],
                    [S("towerSquareBase"), S("towerSquareMid"), S("towerSquareMidOpen"), S("towerSquareTop"), S("towerSquarePoles")],
                    [S("towerSquareBaseColor"), S("towerSquareMidColor"), S("towerSquareMidOpen"), S("towerSquareMidWindows"), S("towerSquareTop"), S("towerSquarePoles")]]}),
        # walls (auto-tiled: straight / corner / gate from their neighbours). Rewards 2-5 offer only towers and gate pieces (tier 1).
        M("wall", "Wall", "One length of curtain wall. It turns corners by itself.", "wall", 2, 15, 8, None, None,
          {"auto": {"u": S("wall", "NE"), "v": S("wall", "NW"), "corner": {"-u+v": S("wallCorner", "NE"), "-u-v": S("wallCorner", "SE"), "+u-v": S("wallCorner", "SW"), "+u+v": S("wallCorner", "NW")}}}),
        M("gate", "Portcullis gate", "A wall with an iron portcullis.", "wall", 1, 30, 14, None, None,
          {"auto": {"u": [S("wallDoor", "NE"), S("metalGate", "NE")], "v": [S("wallDoor", "NW"), S("metalGate", "NW")]}}),
        M("doorway", "Open gate", "A wall with an open archway through it.", "wall", 1, 25, 12, None, None,
          {"auto": {"u": S("wallDoor", "NE"), "v": S("wallDoor", "NW")}}),
        M("stairs-wall", "Wall stairs", "A wall with steps up to the walkway.", "wall", 2, 25, 10, None, None,
          {"auto": {"u": S("wallNarrowStairs", "NE"), "v": S("wallNarrowStairs", "NW")}}),
        M("corner-tower", "Corner turret", "A turret built into a corner of the wall.", "wall", 2, 40, 18, None, None,
          {"auto": {"u": S("wallCornerHalfTower", "NE"), "v": S("wallCornerHalfTower", "NW"), "corner": {"-u+v": S("wallCornerHalfTower", "NE"), "-u-v": S("wallCornerHalfTower", "SE"), "+u-v": S("wallCornerHalfTower", "SW"), "+u+v": S("wallCornerHalfTower", "NW")}}}),
        # towers
        M("round-tower", "Round tower", "A round tower with a pointed roof.", "tower", 1, 45, 25, [S("towerBase"), S("towerTop"), S("towerTopRoof")]),
        M("square-tower", "Square tower", "A square tower with battlements.", "tower", 1, 45, 25, [S("towerSquareBase"), S("towerSquareTop")]),
        M("gate-tower", "Gate tower", "A tower with an archway through its foot — a gate with battlements.", "tower", 1, 50, 28, [S("towerSquareArch"), S("towerSquareTop")]),
        M("roof-tower", "Roofed tower", "A square tower with a tiled roof.", "tower", 2, 70, 35, [S("towerSquareBase"), S("towerSquareMid"), S("towerSquareTopRoof")]),
        M("balcony-tower", "Balcony tower", "A round tower with a balcony under the roof.", "tower", 2, 70, 35, [S("towerBase"), S("towerBalcony"), S("towerTopRoof")]),
        M("watchtower", "Watchtower", "A tall open tower with a lookout deck.", "tower", 2, 75, 38, [S("towerSquareBase"), S("towerSquareMid"), S("towerSquareTop"), S("towerSquarePoles")]),
        M("grand-tower", "Grand tower", "Three storeys with coloured bands and a high roof.", "tower", 3, 120, 60, [S("towerSquareBaseColor"), S("towerSquareMidColor"), S("towerSquareMidWindows"), S("towerSquareTopRoofHigh")]),
        M("arch-tower", "Gatehouse tower", "A tall gate tower with an open gallery above the archway.", "tower", 2, 110, 55, [S("towerSquareArch"), S("towerSquareMidOpen"), S("towerSquareTopColor")]),
        M("great-tower", "Great round tower", "The tallest round tower, four storeys high.", "tower", 4, 160, 80, [S("towerBase"), S("towerBase"), S("towerBalcony"), S("towerTop"), S("towerTopRoof")]),
        M("royal-tower", "Royal tower", "Five storeys with a roof to see for miles.", "tower", 4, 180, 90, [S("towerSquareBaseColor"), S("towerSquareMidWindows"), S("towerSquareMidColor"), S("towerSquareMidWindows"), S("towerSquareTopRoofHigh")]),
        # toppers: sit on top of a tower or keep
        M("flag", "Flag", "A flag in your colour on top of a tower.", "topper", 1, 12, 6, [S("flagBlue")]),
        M("flag-wide", "Wide flag", "A big banner flag for the tallest tower.", "topper", 2, 18, 8, [S("flagBlueWide")]),
        M("banner-long", "Long banner", "A long hanging banner.", "topper", 2, 18, 8, [S("flagBannerLong")]),
        M("banner-short", "Short banner", "A short hanging banner.", "topper", 1, 12, 6, [S("flagBannerShort")]),
        # props: ground pieces in the courtyard or outside the walls
        M("bridge", "Bridge", "A wooden bridge over the moat.", "prop", 1, 25, 10, [S("bridge")]),
        M("stone-stairs", "Stone stairs", "Stone steps up to a doorway.", "prop", 1, 15, 6, [S("stairsStone")]),
        M("knight", "Knight", "A knight of your colour standing guard.", "prop", 1, 20, 8, [S("knightBlue")]),
        M("knight-red", "Red knight", "A knight in red on patrol.", "prop", 2, 20, 8, [S("knightRed")]),
        M("king", "The king", "The king himself, come to inspect the castle.", "prop", 3, 60, 25, [S("king")]),
        M("ballista", "Ballista", "A giant crossbow on the walls.", "prop", 2, 45, 18, [S("siegeBallista")]),
        M("catapult", "Catapult", "A catapult in the courtyard.", "prop", 2, 55, 22, [S("siegeCatapult")]),
        M("ram", "Battering ram", "A covered battering ram.", "prop", 3, 60, 24, [S("siegeRam")]),
        M("trebuchet", "Trebuchet", "The biggest siege engine of all.", "prop", 3, 90, 40, [S("siegeTrebuchet")]),
        M("siege-tower", "Siege tower", "A rolling tower for storming walls.", "prop", 4, 110, 45, [S("siegeTower")]),
    ]
    if have_extra:
        C = lambda o: {"-u+v": "t_hedgeCurved_NE".replace("hedgeCurved", o), "-u-v": "t_%s_SE" % o, "+u-v": "t_%s_SW" % o, "+u+v": "t_%s_NW" % o}
        NC = {"-u+v": "n_fence_corner_NE", "-u-v": "n_fence_corner_SE", "+u-v": "n_fence_corner_SW", "+u+v": "n_fence_corner_NW"}
        modules += [
            # buildings you would find inside or around a castle (town kit blocks + roofs)
            M("c-cottage", "Cottage", "A stone cottage with a gabled roof.", "house", 2, 60, 30, ["t_wallBlock_NE", "t_roofGable_NE"]),
            M("hut", "Wooden hut", "A small timber hut with a pointed roof.", "house", 2, 50, 26, ["t_wallWoodBlock_NE", "t_roofPoint_NE"]),
            M("stable", "Stable", "A timber stable with a wide roof.", "house", 2, 65, 30, ["t_wallWoodBlock_NE", "t_roof_NE"]),
            M("barn", "Barn", "A tall barn for hay and horses.", "house", 2, 90, 40, ["t_wallWoodBlock_NE", "t_roofHigh_NE"]),
            M("c-tavern", "Tavern", "A timber tavern with a high gabled roof.", "house", 2, 95, 42, ["t_wallWoodBlock_NE", "t_roofHighGable_NE"]),
            M("stone-hall", "Stone hall", "Two storeys of stone under a steep roof.", "house", 2, 110, 48, ["t_wallBlock_NE", "t_wallBlock_NE", "t_roofHigh_NE"]),
            M("c-chapel", "Chapel", "A tall chapel with a pointed roof.", "house", 3, 130, 55, ["t_wallBlock_NE", "t_wallBlock_NE", "t_roofHighPoint_NE"]),
            M("c-manor", "Manor", "A grand stone house with a windowed roof.", "house", 3, 150, 60, ["t_wallBlock_NE", "t_wallBlock_NE", "t_roofHighWindow_NE"]),
            M("c-windmill", "Windmill", "A windmill on a stone tower.", "house", 3, 140, 55, ["t_wallBlock_NE", "t_wallBlock_NE", "t_windmill_NE"]),
            # village life
            P("stall-red", "Market stall", "A red market stall.", "t_stallRed_NE", 1, 30, 12, "village"),
            P("stall-green", "Green stall", "A green market stall.", "t_stallGreen_NE", 1, 30, 12, "village"),
            P("cart", "Cart", "A wooden cart.", "t_cart_NE", 1, 20, 8, "village"),
            P("c-hay-cart", "Hay cart", "A cart piled with hay.", "t_cartHigh_NE", 1, 25, 10, "village"),
            P("lantern", "Lantern post", "A lantern on a post.", "t_lantern_NE", 1, 15, 6, "village"),
            P("lamp-post", "Lamp post", "An iron lamp post.", "g_lightpostSingle_NE", 2, 20, 8, "village"),
            P("lamp-double", "Double lamp", "A lamp post with two lanterns.", "g_lightpostDouble_NE", 2, 25, 10, "village"),
            P("bench", "Bench", "A wooden bench.", "g_bench_NE", 1, 15, 6, "village"),
            P("fountain", "Fountain", "A round stone fountain.", "t_fountainRound_NE", 2, 70, 30, "statue"),
            P("pool", "Pool", "A square pool of water.", "t_fountainSquare_NE", 2, 80, 32, "statue"),
            P("waterwheel", "Water wheel", "A big wooden water wheel.", "t_watermill_NE", 2, 60, 24, "village"),
            P("planks", "Wooden deck", "A deck of planks.", "t_planks_NE", 1, 12, 4, "village"),
            P("stone-path", "Stone path", "Flat stones to walk on.", "n_path_stone_NE", 1, 10, 4, "village"),
            P("well-sign", "Signpost", "A wooden signpost.", "n_sign_NE", 1, 10, 4, "village"),
            P("campfire", "Campfire", "A ring of stones with a fire.", "n_campfire_stones_NE", 1, 15, 6, "village"),
            P("tent", "Tent", "A red camp tent.", "n_tent_detailedOpen_NE", 1, 25, 10, "village"),
            P("log-pile", "Log pile", "A stack of logs.", "n_log_stack_NE", 1, 12, 4, "village"),
            P("wheat", "Wheat", "A patch of wheat.", "n_crops_wheatStageB_NE", 1, 12, 5, "nature"),
            P("pumpkins", "Pumpkin patch", "Pumpkins on the vine.", "n_crop_pumpkin_NE", 1, 12, 5, "nature"),
            P("pot", "Clay pot", "A big clay pot.", "n_pot_large_NE", 1, 10, 4, "village"),
            P("urn", "Stone urn", "A carved stone urn.", "g_urn_NE", 2, 20, 8, "statue"),
            P("wood-bridge", "Wooden bridge", "A little wooden bridge.", "n_bridge_wood_NE", 1, 25, 10, "village"),
            A("hedge", "Hedge", "A trimmed hedge. It turns corners by itself.", "t_hedge_NE", "t_hedge_NW", C("hedgeCurved"), 1, 10, 4, "nature"),
            A("hedge-gate", "Hedge gate", "A gap in the hedge.", "t_hedgeGate_NE", "t_hedgeGate_NW", None, 1, 12, 4, "nature"),
            A("c-fence", "Wooden fence", "A wooden fence. It turns corners by itself.", "t_fence_NE", "t_fence_NW", C("fenceCurved"), 1, 8, 3, "village"),
            A("fence-gate", "Fence gate", "A gate in the fence.", "t_fenceGate_NE", "t_fenceGate_NW", None, 1, 10, 3, "village"),
            A("rail-fence", "Rail fence", "A simple rail fence for the animals.", "n_fence_simple_NE", "n_fence_simple_NW", NC, 1, 8, 3, "village"),
            # nature
            P("oak", "Oak tree", "A round oak.", "n_tree_oak_NE", 1, 15, 8, "nature"),
            P("pine", "Pine tree", "A tall pine.", "n_tree_pineDefaultA_NE", 1, 15, 8, "nature"),
            P("round-pine", "Round pine", "A bushy pine.", "n_tree_pineRoundA_NE", 1, 15, 8, "nature"),
            P("autumn-tree", "Autumn tree", "A tree in orange autumn leaves.", "n_tree_default_fall_NE", 1, 18, 8, "nature"),
            P("tall-tree", "Tall tree", "A tall leafy tree.", "n_tree_tall_NE", 1, 15, 8, "nature"),
            P("small-tree", "Small tree", "A young tree.", "n_tree_small_NE", 1, 10, 5, "nature"),
            P("fir", "Fir tree", "A dark green fir.", "t_tree_NE", 1, 15, 8, "nature"),
            P("tall-fir", "Tall fir", "A very tall fir.", "t_treeHigh_NE", 2, 18, 9, "nature"),
            P("poplar", "Poplar", "A tall rounded tree.", "t_treeHighRound_NE", 2, 18, 9, "nature"),
            P("bush", "Bush", "A leafy bush.", "n_plant_bushLarge_NE", 1, 8, 3, "nature"),
            P("bushes", "Bushes", "A clump of bushes.", "n_bushes", 1, 12, 5, "nature"),
            P("flowers-red", "Red flowers", "A bed of red flowers.", "n_flowerbed_red", 1, 10, 5, "nature"),
            P("flowers-yellow", "Yellow flowers", "A bed of yellow flowers.", "n_flowerbed_yellow", 1, 10, 5, "nature"),
            P("flowers-purple", "Purple flowers", "A bed of purple flowers.", "n_flowerbed_purple", 1, 10, 5, "nature"),
            P("flowers-mixed", "Mixed flowers", "A bed of every colour.", "n_flowerbed_mixed", 1, 12, 6, "nature"),
            P("mushrooms", "Red mushrooms", "A group of red mushrooms.", "n_mushroom_redGroup_NE", 1, 8, 3, "nature"),
            P("tan-mushrooms", "Tan mushrooms", "A group of tan mushrooms.", "n_mushroom_tanGroup_NE", 1, 8, 3, "nature"),
            P("boulder", "Boulder", "A big grey boulder.", "n_rock_largeA_NE", 1, 10, 4, "nature"),
            P("rocks", "Rocks", "A few small rocks.", "n_rock_smallA_NE", 1, 6, 2, "nature"),
            P("tall-rock", "Tall rock", "A tall standing rock.", "n_rock_tallA_NE", 1, 10, 4, "nature"),
            P("crag", "Crag", "A jagged outcrop of rock.", "t_rockLarge_NE", 2, 20, 8, "nature"),
            P("stump", "Tree stump", "An old stump.", "n_stump_round_NE", 1, 5, 2, "nature"),
            P("lily-pads", "Lily pads", "Lily pads for a pond.", "n_lily_large_NE", 1, 6, 2, "nature"),
            # statues and monuments
            P("obelisk", "Obelisk", "A tall stone obelisk.", "n_statue_obelisk_NE", 2, 40, 18, "statue"),
            P("column", "Stone column", "A carved stone column.", "n_statue_column_NE", 2, 40, 18, "statue"),
            P("great-column", "Great column", "A towering column.", "g_columnLarge_NE", 3, 60, 26, "statue"),
            P("stone-head", "Stone head", "A giant carved head.", "n_statue_head_NE", 3, 60, 26, "statue"),
            P("stone-ring", "Stone ring", "A ring of carved stone.", "n_statue_ring_NE", 3, 55, 24, "statue"),
            P("pedestal", "Pedestal", "A stone pedestal.", "n_statue_block_NE", 1, 15, 6, "statue"),
            P("knight-statue", "Knight statue", "A stone knight on a pedestal.", "n_statue_block_NE", 2, 50, 22, "statue", ["n_statue_block_NE", "s_knight_NE"]),
            P("king-statue", "King statue", "A stone king on a pedestal.", "n_statue_block_NE", 3, 80, 34, "statue", ["n_statue_block_NE", "s_king_NE"]),
            P("stone-pillar", "Stone pillar", "A slim stone pillar.", "t_pillarStone_NE", 1, 15, 6, "statue"),
            P("small-obelisk", "Small obelisk", "A small pointed pillar.", "g_pillarObelisk_NE", 2, 30, 12, "statue"),
            P("glass-lantern", "Glass lantern", "A lantern in a glass case.", "g_lanternGlass_NE", 1, 12, 5, "village"),
            # animals
            P("cow", "Cow", "A cow for the meadow.", "a_cow", 1, 20, 6, "animal"),
            P("horse", "Horse", "A horse for the stable.", "a_horse", 1, 25, 8, "animal"),
            P("pig", "Pig", "A pink pig.", "a_pig", 1, 15, 5, "animal"),
            P("goat", "Goat", "A goat with horns.", "a_goat", 1, 15, 5, "animal"),
            P("chicken", "Chicken", "A hen for the yard.", "a_chicken", 1, 10, 4, "animal"),
            P("dog", "Dog", "A loyal hound.", "a_dog", 1, 15, 5, "animal"),
            P("rabbit", "Rabbit", "A rabbit in the grass.", "a_rabbit", 1, 10, 4, "animal"),
            P("duck", "Duck", "A duck for the pond.", "a_duck", 1, 10, 4, "animal"),
            P("owl", "Owl", "An owl for the tower.", "a_owl", 2, 15, 5, "animal"),
        ]
    for m in modules:
        m["img"] = "assets/build/kit/" + ((m.get("parts") or [None])[0] or (m.get("auto") or {}).get("u") if not isinstance((m.get("auto") or {}).get("u"), list) else m["auto"]["u"][0]) + ".png" if (m.get("parts") or m.get("auto")) else ""
        m["nostyle"] = False
    # ── write pieces.json ────────────────────────────────────────────────────
    pj = os.path.join(ROOT, "assets", "build", "pieces.json")
    d = json.load(open(pj))
    d["pieces"] = [p for p in d["pieces"] if p["theme"] != "castle"] + modules
    d["kit"] = {"dir": "assets/build/kit/", "cellW": CELL_W, "cellH": CELL_H, "sprites": sprites}
    d["themes"]["castle"] = {
        "name": "Castle", "desc": "A modest keep that grows into a grand castle: towers and gates first, walls that turn corners, flags in your colour.",
        "kit": True, "cell": CELL_W, "cellH": CELL_H, "unitPx": 1, "drawScale": 1, "wallLevel": 8,
        "growAt": [1, 4, 8, 13],   # buildings (rewards + shop, not the auto walls) at which the keep reaches growth stage 0..3
        "tabs": [["core", "Keep"], ["tower", "Towers"], ["wall", "Walls & gates"], ["house", "Buildings"], ["nature", "Nature"],
                 ["statue", "Statues"], ["village", "Village"], ["animal", "Animals"], ["people", "People & siege"], ["flag", "Flags"]],
        "styles": [
            {"id": "blue", "name": "Royal Blue", "desc": "Blue roofs, flags and bands.", "dir": "", "pairs": ["gold"]},
            {"id": "red", "name": "Crimson", "desc": "Red roofs, flags and bands.", "dir": "red/", "pairs": ["gold"]},
            {"id": "green", "name": "Forest", "desc": "Green roofs, flags and bands.", "dir": "green/", "pairs": ["blue"]},
            {"id": "gold", "name": "Gold", "desc": "Gold roofs, flags and bands.", "dir": "gold/", "pairs": ["red"]},
        ],
        "ranks": [[0, "Camp"], [120, "Fort"], [300, "Stronghold"], [600, "Castle"], [1000, "Fortress"], [1600, "Citadel"], [2400, "Royal Seat"]],
        "packs": [
            {"id": "walls", "name": "Wall pack", "desc": "Four lengths of curtain wall, 25% off. They turn corners by themselves.", "items": ["wall", "wall", "wall", "wall"], "discount": 0.25},
            {"id": "gatehouse", "name": "Gatehouse pack", "desc": "A gate with a square tower either side, 15% off.", "items": ["square-tower", "gate", "square-tower"], "discount": 0.15},
            {"id": "tower", "name": "Tower pack", "desc": "A round tower with a flag on top, 15% off.", "items": ["round-tower", "flag"], "discount": 0.15},
            {"id": "siege", "name": "Siege pack", "desc": "A catapult and a ballista for the courtyard, 20% off.", "items": ["catapult", "ballista"], "discount": 0.2},
            {"id": "garden", "name": "Garden pack", "desc": "Flowers, an oak, bushes and a hedge, 25% off.", "items": ["flowers-mixed", "flowers-red", "oak", "bushes", "hedge"], "discount": 0.25},
            {"id": "farm", "name": "Farm pack", "desc": "A stable, a rail fence, a cow, a horse and a chicken, 20% off.", "items": ["stable", "rail-fence", "cow", "horse", "chicken"], "discount": 0.2},
            {"id": "village", "name": "Village pack", "desc": "A cottage, a market stall, a cart, a lantern and a bench, 20% off.", "items": ["c-cottage", "stall-red", "cart", "lantern", "bench"], "discount": 0.2},
            {"id": "monuments", "name": "Monument pack", "desc": "A fountain, an obelisk, a column and a knight statue, 20% off.", "items": ["fountain", "obelisk", "column", "knight-statue"], "discount": 0.2},
        ],
    }
    d["v"] = 2
    json.dump(d, open(pj, "w"), indent=1)
    print("castle modules:", len(modules), "→", pj)
    # ── atlas: pack every directory's sprites into a few 2048² sheets (itch.io allows 1000 files per build; one request per
    # sheet instead of one per sprite). Sheets are 256-colour palette PNGs — flat-shaded art loses nothing visible. ──
    atlas, sheets_by_dir = {}, {}
    for sub in [""] + [c + "/" for c in COLORS]:
        dp = os.path.join(OUT, sub)
        if not os.path.isdir(dp):
            continue
        files = sorted(f for f in os.listdir(dp) if f.endswith(".png") and not f.startswith("atlas-"))
        items = []
        for f in files:
            im = Image.open(os.path.join(dp, f)).convert("RGBA")
            items.append((f[:-4], im))
        items.sort(key=lambda t: (-t[1].height, -t[1].width))
        SIZE, PAD = 2048, 2
        sheets, placed = [], {}
        for name, im in items:
            w, h = im.size
            done = False
            for si, sh in enumerate(sheets):
                for shelf in sh["shelves"]:
                    if shelf["x"] + w + PAD <= SIZE and h <= shelf["h"]:
                        placed[name] = [si, shelf["x"], shelf["y"]]; sh["img"].alpha_composite(im, (shelf["x"], shelf["y"])); shelf["x"] += w + PAD; done = True; break
                if done: break
                if sh["y"] + h + PAD <= SIZE:
                    shelf = {"x": 0, "y": sh["y"], "h": h + PAD}; sh["shelves"].append(shelf); sh["y"] += h + PAD
                    placed[name] = [si, shelf["x"], shelf["y"]]; sh["img"].alpha_composite(im, (shelf["x"], shelf["y"])); shelf["x"] += w + PAD; done = True; break
            if not done:
                sh = {"img": Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0)), "shelves": [], "y": 0}; sheets.append(sh)
                shelf = {"x": 0, "y": 0, "h": h + PAD}; sh["shelves"].append(shelf); sh["y"] = h + PAD
                placed[name] = [len(sheets) - 1, 0, 0]; sh["img"].alpha_composite(im, (0, 0)); shelf["x"] = w + PAD
        for si, sh in enumerate(sheets):
            used_h = sh["y"]
            sh["img"].crop((0, 0, SIZE, min(SIZE, used_h))).quantize(256, method=Image.Quantize.FASTOCTREE).save(os.path.join(dp, "atlas-%d.png" % si), optimize=True)
        for f in files:
            os.remove(os.path.join(dp, f))
        atlas[sub] = placed; sheets_by_dir[sub] = len(sheets)
        print("atlas %-6s %3d sprites -> %d sheet(s)" % (sub or "base", len(items), len(sheets)))
    d["kit"]["atlas"] = atlas
    d["kit"]["sheets"] = sheets_by_dir
    for m in d["pieces"]:
        if m.get("theme") == "castle": m["img"] = ""
    json.dump(d, open(pj, "w"), indent=1)

if __name__ == "__main__":
    main()
