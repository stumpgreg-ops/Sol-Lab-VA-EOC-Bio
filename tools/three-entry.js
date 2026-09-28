/* Bundled by tools/bundle-three.sh into js/vendor/three.min.js: three.js r160 (MIT) plus the glTF and OBJ loaders, as one plain script. */
import * as THREE from "three";
import { GLTFLoader } from "./three/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "./three/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "./three/jsm/loaders/MTLLoader.js";
window.THREE = THREE; window.THREE.GLTFLoader = GLTFLoader; window.THREE.OBJLoader = OBJLoader; window.THREE.MTLLoader = MTLLoader;
