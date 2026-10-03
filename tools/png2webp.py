# Lossless WebP for the Canvas bundle: reads "src\tdst" lines on stdin, writes dst only when it is smaller than src,
# prints the paths it wrote. Needs Pillow with WebP (python3 -m pip install pillow).
import sys, os
from PIL import Image
for line in sys.stdin:
    src, dst = line.rstrip("\n").split("\t")
    try:
        im = Image.open(src); im.load()
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        im.save(dst, "WEBP", lossless=True, quality=100, method=6)
        if os.path.getsize(dst) < os.path.getsize(src): print(dst)
        else: os.remove(dst)
    except Exception as e:
        sys.stderr.write("skip %s: %s\n" % (src, e))
