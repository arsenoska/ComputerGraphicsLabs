import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // This imports the OrbitControls class, which allows us to control the camera with the mouse.


// We need to create a scene, camera, and renderer to display our 3D content.
// The scene is where we place our objects, 
// the camera is how we view the scene, 
// and the renderer is what draws the scene to the screen.
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
camera.position.set(6, 5, 8);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement); // This adds the renderer's canvas element to the HTML document so we can see it.

const control = new OrbitControls(camera, renderer.domElement); // This allows us to move the camera around the scene with the mouse.

// floor(plane)
const n = new THREE.Vector3(0, 1, 0); // This is the normal vector of the plane, pointing upwards.
const p0 = new THREE.Vector3(0, 0, 0); // This is a point on the plane, at the origin.
const d = n.dot(p0); // This calculates the distance from the origin to the plane along the normal vector.

// What is Mesh? 
// A mesh is a 3D object made up of vertices, edges, and faces. 
// In Three.js, we create a mesh by combining a geometry (which defines the shape) 
// with a material (which defines how it looks).

const geometry = new THREE.PlaneGeometry(12, 12); // This creates a flat square plane with a width and height of 20 units.
const material = new THREE.MeshBasicMaterial({ color: 0x2a3140 }); // This creates a basic material with color. 
const floor = new THREE.Mesh(geometry, material); // This combines the geometry and material into a mesh.
floor.rotation.x = -Math.PI / 2; // This rotates the floor mesh so it's facing upwards.
floor.updateMatrixWorld(true); // This updates the world matrix of the floor mesh, which is necessary after changing its rotation.
const grid = new THREE.GridHelper(12, 12)
scene.add(floor, grid); // This adds the floor mesh to the scene so it will be rendered.

// Ray 
const o = new THREE.Vector3(2, 5, 1) // This is the origin point of the ray, where it starts in 3D space.
const dir = new THREE.Vector3(0.3, -1, 0.1).normalize() // This is the direction vector of the ray, which we normalize to make it a unit vector.

// What is unit vector? 
// A unit vector is a vector with a magnitude of 1. 
// It is often used to represent direction without considering the length.

// Formula
const t = (d - n.dot(o)) / n.dot(dir) // This calculates the parameter t, which tells us how far along the ray we need to go to intersect the plane.
const hit = o.clone().addScaledVector(dir, t) // This calculates the intersection point by starting at the ray's origin and moving along the direction vector by t units.
// Why did we clone the origin vector?
// We clone the origin vector to create a new vector that we can modify without changing the original origin vector. 
// This is important because we want to keep the original ray's origin intact for other calculations or visualizations.

// Ray
scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([o, hit]), // This creates a line geometry from the ray's origin to the intersection point.
    new THREE.MeshBasicMaterial({ color: 0xff4422 }) // This creates a basic material for the line with a specific color.
))

// Why we add a dot at the intersection point?
// Adding a dot at the intersection point helps visualize where the ray intersects the plane. 
// It provides a clear indication of the exact point of intersection in the 3D space.
const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.18),
    new THREE.MeshBasicMaterial({ color: 0xffd700 })
);
dot.position.copy(hit); // This sets the position of the dot mesh to the intersection point, so it appears exactly where the ray hits the plane.
scene.add(dot); // This adds the dot mesh to the scene so it will be rendered.

const rayCaster = new THREE.Raycaster(o, dir).intersectObject(floor)[0]; // This creates a Raycaster object, which is used to perform raycasting in the scene. 
console.log('Our formula',hit.toArray().map(x => x.toFixed(3))) // This logs the intersection point calculated using our formula, formatted to two decimal places.
console.log('Ray Caster', rayCaster.point.toArray().map(x => x.toFixed(3))) // This logs the intersection point calculated using the Raycaster, formatted to two decimal places.
// It takes the origin and direction of the ray as parameters. It takes them for params because 
// it needs to know where the ray starts and in which direction it should cast the ray to detect 
// intersections with objects in the scene.

function animate () {
    requestAnimationFrame(animate)
    control.update() // This updates the camera's position based on user input.
    renderer.render(scene, camera)
}
animate() // This starts the animation loop, which continuously updates and renders the scene.
