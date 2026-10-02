#!/bin/sh
# Publish the game to GitHub Pages: sh tools/publish-pages.sh
# Builds a site with the game at its root (index.html, admin.html, css/, js/, assets/, CREDITS.md) and
# pushes it to the gh-pages branch as one commit (the branch keeps no history: every publish replaces it).
#   https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Algebra/        → the game
#   https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Algebra/admin.html → the teacher monitor
# Turn Pages on once: repository Settings → Pages → Source "Deploy from a branch", branch gh-pages, folder / (root).
set -e
cd "$(dirname "$0")/.."
site=$(mktemp -d)
cp index.html admin.html CREDITS.md "$site/"
cp -r css js assets "$site/"
find "$site" -name .DS_Store -delete
touch "$site/.nojekyll"
idx=$(mktemp -u)
export GIT_INDEX_FILE="$idx"
git --work-tree="$site" add -A .
tree=$(git write-tree)
ver=$(grep -o 'v[0-9.]*</p>' index.html | head -1 | tr -d 'v</p>')
commit=$(printf 'Publish SOL Lab (Virginia Algebra I) v%s to GitHub Pages\n' "$ver" | git commit-tree "$tree")
unset GIT_INDEX_FILE
git update-ref refs/heads/gh-pages "$commit"
git push --force -u origin gh-pages
rm -rf "$site"; rm -f "$idx"
echo "published $commit (v$ver): https://stumpgreg-ops.github.io/Sol-Lab-VA-EOC-Algebra/"
