#!/usr/bin/env sh
# Builds the itch.io HTML5 upload: sh tools/make-itch-zip.sh [out.zip]
# index.html sits at the zip root; tools/, docs and git files are left out so the
# upload stays under itch.io's 1,000-file limit (the game is ~270 files, ~27 MB).
set -e
cd "$(dirname "$0")/.."
OUT="${1:-sol-lab-va-bio.zip}"
rm -f "$OUT"
zip -q -r -X "$OUT" index.html admin.html css js assets -x '*.DS_Store' -x '*Thumbs.db'
echo "$OUT: $(unzip -l "$OUT" | tail -1)"
