import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Orbit Controls (Mouse Zoom, Rotate, Pan)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 5;

// Load Brain Model
let brainModel;
const loader = new GLTFLoader();
loader.load('/assets/brain.glb', function (gltf) {
    brainModel = gltf.scene;

    // ✅ FIX 1: Scale Down the Brain Model
    brainModel.scale.set(0.1, 0.1, 0.1); // Smaller size

    // ✅ FIX 2: Center the Brain Model
    const box = new THREE.Box3().setFromObject(brainModel);
    const center = box.getCenter(new THREE.Vector3());
    brainModel.position.sub(center);

    // ✅ FIX 3: Adjust Position for Better View
    brainModel.position.y = -0.5; 

    scene.add(brainModel);
    console.log("Brain model loaded successfully!");
}, undefined, function (error) {
    console.error("Error loading model:", error);
});

// ✅ FIX 4: Move Camera Further Away for Proper View
camera.position.set(0, 1, 3);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    if (brainModel) {
        brainModel.rotation.y += 0.005; // Slow rotation
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();
