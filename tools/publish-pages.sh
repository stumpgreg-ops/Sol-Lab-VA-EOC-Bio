#!/bin/sh
# Publish the game to GitHub Pages: sh tools/publish-pages.sh
# Builds a site with the game at its root (index.html, admin.html, css/, js/, assets/, CREDITS.md) and
# pushes it to the gh-pages branch as one commit (the branch keeps no history: every publish replaces it).
#   https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Bio/        → the game
#   https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Bio/admin.html → the teacher monitor
#   …/appsscript/bio/ and …/appsscript/Code.gs → the Google Apps Script version (v6.3, tools/build-appsscript.js);
#   …/canvas-check.html → the page that tells a teacher whether a spot in Canvas runs scripts (v6.3.1):
#   Code.gs fetches the loader, manifest and parts from this branch through raw.githubusercontent.com.
# Turn Pages on once: repository Settings → Pages → Source "Deploy from a branch", branch gh-pages, folder / (root).
set -e
cd "$(dirname "$0")/.."
node tools/build-appsscript.js
node tools/build-canvas.js   # v6.3.1: dist/canvas/BIO/ and its zip — uploaded to Canvas by the teacher, never published here
site=$(mktemp -d)
cp index.html admin.html CREDITS.md "$site/"; cp tools/canvas-check.html "$site/canvas-check.html"
cp -r css js assets "$site/"
mkdir -p "$site/appsscript"; cp -r dist/appsscript/bio "$site/appsscript/bio"; cp dist/appsscript/Code.gs "$site/appsscript/Code.gs"
find "$site" -name .DS_Store -delete
touch "$site/.nojekyll"
idx=$(mktemp -u)
export GIT_INDEX_FILE="$idx"
git --work-tree="$site" add -A .
tree=$(git write-tree)
ver=$(grep -o 'v[0-9.]*</p>' index.html | head -1 | tr -d 'v</p>')
commit=$(printf 'Publish SOL Lab (Virginia EOC Biology) v%s to GitHub Pages\n' "$ver" | git commit-tree "$tree")
unset GIT_INDEX_FILE
git update-ref refs/heads/gh-pages "$commit"
git push --force -u origin gh-pages
rm -rf "$site"; rm -f "$idx"
echo "published $commit (v$ver): https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Bio/"
