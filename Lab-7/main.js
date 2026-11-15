import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

// Create the scene and set the background color
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1e2e);

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(3, 2, 5);

// Create the renderer and add it to the page
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable mouse controles for rotating and zooming the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Add a grid to represent the floor
const grid = new THREE.GridHelper(10, 10);
scene.add(grid);

// Add ambient lighting to illuminate the objects
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Create cubes and store them in the pickables array for raycasting
const pickables = [];
const geometry = new THREE.BoxGeometry(1, 1, 1);

function createCube(color, x) {
  const material = new THREE.MeshStandardMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(x, 0.5, 0);
  scene.add(cube);
  pickables.push(cube);

  return cube;
}

createCube(0xffb3c6, -2);
createCube(0xb8a1e3, 0);
createCube(0xa8dadc, 2);

// Save the initial positions for resetting
const originalPositions = pickables.map(
  cube => cube.position.clone()
);

// Convert mouse coordinates to Normalized Device Coordinates (NDC)
// NDC ranges from -1 to 1 on both axes
const pointer = new THREE.Vector2();

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();

  pointer.x =
    ((event.clientX - rect.left) / rect.width) * 2 - 1;

  pointer.y =
    -((event.clientY - rect.top) / rect.height) * 2 + 1;

  return pointer;
}

// Create a Raycaster to detect which object the mouse points at
const raycaster = new THREE.Raycaster();

// Create a horizontal plane for dragging objects along the floor
const dragPlane = new THREE.Plane(
  new THREE.Vector3(0, 1, 0),
  0
);

// Store the intersection point and dragging offset
const intersection = new THREE.Vector3();
const dragOffset = new THREE.Vector3();

let selected = null;
let hovered = null;
let isDragging = false;

// GUI settings for hover highlighting and resetting positions
const settings = {
  hoverHighlight: true,

  resetPositions: () => {
    stopDragging();

    pickables.forEach((cube, index) => {
      cube.position.copy(originalPositions[index]);
    });

    selected = null;
    hovered = null;
    updateHighlights();
  }
};

// Create GUI controls for hover highlighting and position reset
const gui = new GUI();
gui.add(settings, 'hoverHighlight')
  .name('Hover Highlight')
  .onChange(updateHighlights);

gui.add(settings, 'resetPositions')
  .name('Reset Positions');

// Highlight the selected object in yellow
// Apply a subtle highlight when hovering over an object
// Remove highlights from other objects
function updateHighlights() {
  pickables.forEach(cube => {
    if (cube === selected) {
      cube.material.emissive.set(0xffff00);
    } else if (
      cube === hovered &&
      settings.hoverHighlight &&
      !isDragging
    ) {
      cube.material.emissive.set(0x444444);
    } else {
      cube.material.emissive.set(0x000000);
    }
  });
}

// Detect mouse clicks, select objects, and start dragging
renderer.domElement.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;

  // Cast a ray from the camera through the mouse position
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);

  // Check if the ray intersects any pickable object
  const intersects = raycaster.intersectObjects(pickables);

  if (intersects.length > 0) {
    selected = intersects[0].object;
    hovered = selected;

    console.log('Clicked:', selected);

    // Calculate the offset to prevent the object from jumping
    if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
      dragOffset.set(
        selected.position.x - intersection.x,
        0,
        selected.position.z - intersection.z
      );

      isDragging = true;

      // Disable OrbitControls while dragging
      controls.enabled = false;

      renderer.domElement.setPointerCapture(event.pointerId);
    }
  } else {
    selected = null;
    hovered = null;
  }

  updateHighlights();
});

// Handle object dragging and hover detection
renderer.domElement.addEventListener('pointermove', (event) => {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);

  // Move the selected object along the floor while dragging
  if (isDragging && selected) {
    if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
      selected.position.x = intersection.x + dragOffset.x;
      selected.position.z = intersection.z + dragOffset.z;
    }
    return;
  }

  // Detect objects under the mouse when not dragging
  const intersects = raycaster.intersectObjects(pickables);

  hovered = intersects.length > 0
    ? intersects[0].object
    : null;

  updateHighlights();
});

// Stop dragging and restore OrbitControls
function stopDragging() {
  isDragging = false;
  controls.enabled = true;
  updateHighlights();
}

window.addEventListener('pointerup', stopDragging);
renderer.domElement.addEventListener('pointercancel', stopDragging);

// Remove hover when leaving canvas
renderer.domElement.addEventListener('pointerleave', () => {
  if (!isDragging) {
    hovered = null;
    updateHighlights();
  }
});

// Update camera and renderer when the window is resized
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Continuously update controls and render the scene
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();