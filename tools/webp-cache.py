"""v6.3.1 (from SOL Labyrinth v5.8.1): lossless WebP copies of PNG files, for tools/build-appsscript.js (the bundle the
Apps Script and Canvas versions load). python3 tools/webp-cache.py <cache dir> <png>...  writes
<cache dir>/<sha1 of the PNG>.webp for each PNG not already there. Lossless: every pixel stays the same, the file
just gets smaller."""
import hashlib, os, sys
from PIL import Image

cache = sys.argv[1]
os.makedirs(cache, exist_ok=True)
for p in sys.argv[2:]:
    data = open(p, "rb").read()
    out = os.path.join(cache, hashlib.sha1(data).hexdigest() + ".webp")
    if os.path.exists(out):
        continue
    im = Image.open(p)
    im.load()
    tmp = out + ".tmp"
    im.save(tmp, "WEBP", lossless=True, quality=100, method=5, exact=True)
    os.replace(tmp, out)
