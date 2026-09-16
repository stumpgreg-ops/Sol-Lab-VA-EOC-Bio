#!/usr/bin/env python3
"""Generate the style variants of the reward-builder sprites.

Reads assets/build/village-*.png and castle-*.png (pre-rendered from the
Modular Village Pack and the Castle and Fort Builder Pack) and writes
recoloured copies to assets/build/styles/<style>/<file>.png.

Town styles   : tile (original) · slate · thatch
Castle styles : stone (original) · sand · white

Roof and wall pixels are found by hue/saturation/value clusters, then given a
new hue/saturation and a value gain so the shading of the render is kept.
Run:  python3 tools/make-styles.py
"""
import os, glob, colorsys
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "assets", "build")
OUT = os.path.join(ROOT, "styles")

def to_hsv(rgb):
    return np.array([colorsys.rgb_to_hsv(*p) for p in rgb])

def to_rgb(hsv):
    return np.array([colorsys.hsv_to_rgb(*p) for p in hsv])

def recolour(path, rules):
    """rules: list of (mask_fn(h,s,v) -> bool array, (hue|None, sat|None, vgain, vadd))."""
    im = Image.open(path).convert("RGBA")
    a = np.array(im).astype(float) / 255.0
    alpha = a[..., 3]
    m = alpha > 0.02
    rgb = a[m][:, :3]
    hsv = to_hsv(rgb)
    h, s, v = hsv[:, 0], hsv[:, 1], hsv[:, 2]
    out = hsv.copy()
    done = np.zeros(len(hsv), dtype=bool)
    for mask_fn, (hue, sat, vgain, vadd) in rules:
        sel = mask_fn(h, s, v) & ~done
        if hue is not None: out[sel, 0] = hue / 360.0
        if sat is not None: out[sel, 1] = sat
        out[sel, 2] = np.clip(v[sel] * vgain + vadd, 0, 1)
        done |= sel
    a[m, :3] = to_rgb(out)
    return Image.fromarray((a * 255).round().astype(np.uint8), "RGBA")

# ── pixel classes ────────────────────────────────────────────────────────────
def v_roof(h, s, v):      # village red tile roof
    return (s >= 0.18) & ((h < 0.09) | (h > 0.95))
def v_wall(h, s, v):      # village stucco / stone (low saturation)
    return (s < 0.18) & (v > 0.25)
def v_wood(h, s, v):      # village timber, doors, stone-cottage brick
    return (s >= 0.18) & (h >= 0.09) & (h < 0.2)
def c_stone(h, s, v):     # castle grey masonry
    return (s < 0.2) & (v < 0.7)
def c_roof(h, s, v):      # castle dark shingle roofs (brown/tan cluster)
    return (s >= 0.2) & (h >= 0.05) & (h < 0.2)
def c_glass(h, s, v):     # castle purple windows
    return (s >= 0.2) & (h >= 0.55) & (h < 0.9)

# (hue degrees, saturation, value gain, value add)
STYLES = {
    "village": {
        "slate":  [(v_roof, (212, 0.30, 0.95, 0.06)), (v_wall, (40, 0.04, 1.18, 0.10)), (v_wood, (28, 0.28, 0.85, 0.0))],
        "thatch": [(v_roof, (42, 0.55, 1.15, 0.12)), (v_wall, (30, 0.22, 0.92, 0.0)), (v_wood, (22, 0.45, 0.75, 0.0))],
    },
    "castle": {
        "sand":  [(c_stone, (36, 0.32, 1.9, 0.08)), (c_roof, (18, 0.45, 1.5, 0.02)), (c_glass, (200, 0.5, 1.4, 0.05))],
        "white": [(c_stone, (45, 0.06, 2.6, 0.18)), (c_roof, (215, 0.35, 1.6, 0.02)), (c_glass, (230, 0.45, 1.5, 0.05))],
    },
}

def main():
    n = 0
    for theme, styles in STYLES.items():
        files = sorted(glob.glob(os.path.join(ROOT, theme + "-*.png")))
        for style, rules in styles.items():
            d = os.path.join(OUT, style)
            os.makedirs(d, exist_ok=True)
            for f in files:
                recolour(f, rules).save(os.path.join(d, os.path.basename(f)), optimize=True)
                n += 1
    print("wrote", n, "sprites under", os.path.relpath(OUT))

if __name__ == "__main__":
    main()
