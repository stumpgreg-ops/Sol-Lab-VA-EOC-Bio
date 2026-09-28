#!/bin/sh
# Bundle three.js (tools/three/, fetched by tools/render-kaykit.js) with its glTF/OBJ loaders into js/vendor/three.min.js
cd "$(dirname "$0")/.." && npx --yes esbuild@0.21.5 tools/three-entry.js --bundle --minify --format=iife --alias:three=./tools/three/three.module.js --outfile=js/vendor/three.min.js --legal-comments=none
