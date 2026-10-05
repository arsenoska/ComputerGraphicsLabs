import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

// new folder
// npm init -y
// we change in main.js
//   "scripts": {
//     "dev": "vite"
//   },
// npm install vite three

// What is a scene?
// A scene is a container that holds all the objects, lights, and cameras in our 3D world. 
// It is like a stage where we can place our 3D models and set up the environment.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// What is the camera? 
// The camera is the point of view from which we are looking at the scene. 
// It defines what we see and how we see it. 
// In Three.js, we can create different types of cameras, such as PerspectiveCamera and OrthographicCamera. 
// In this case, we will use a PerspectiveCamera, which simulates the way the human eye sees the world.
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
)
camera.position.set(4, 4, 6)
camera.lookAt(0, 0, 0)

// What is the renderer?
// The renderer is responsible for drawing the scene from the camera's perspective onto the screen. 
// It takes the scene and camera as input and produces a 2D image that we can see in our browser. 
// In Three.js, we can use different types of renderers, such as WebGLRenderer, CanvasRenderer, and SVGRenderer. 
// In this case, we will use a WebGLRenderer, which uses the WebGL API to render 3D graphics in the browser.
const renderer = new THREE.WebGLRenderer({antialias: true}); // So it won't have pixelated edges
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// What is the OrbitControls?
// The OrbitControls is a class that allows us to control the camera using the mouse or touch gestures. 
// It provides an easy way to rotate, zoom, and pan the camera around the scene. 
// In this case, we will use the OrbitControls to allow the user to explore the 3D world by moving the camera.
const control = new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AxesHelper(3)) // Add an axes helper to the scene

const origin = new THREE.Vector3(0, 0, 0) // Create a vector at the origin
const a = new THREE.Vector3(2, 1, 0) // Create a vector at (2, 1, 0)
const b = new THREE.Vector3(0, 2, 0) // Create a vector at (0, 2, 0)

const arrA = new THREE.ArrowHelper(a.clone().normalize(), origin, a.length(), 0xE8431C, 0.35, 0.2) // Create an arrow helper for vector a
const arrB = new THREE.ArrowHelper(b.clone().normalize(), origin, b.length(), 0x1E40FF, 0.35, 0.2) // Create an arrow helper for vector b

scene.add(arrA, arrB) // Add the arrow helpers to the scene

const sum = new THREE.Vector3().addVectors(a, b) // Create a vector that is the sum of a and b

const arrSum = new THREE.ArrowHelper(sum.clone().normalize(), origin, sum.length(), 0x3ecf8e, 0.35, 0.2) // Create an arrow helper for the sum vector
scene.add(arrSum) // Add the arrow helper for the sum vector to the scene

const gui = new GUI() // Create a new GUI
const params = {
    aX: a.x, aY: a.y, aZ: a.z,
    bX: b.x, bY: b.y, bZ: b.z,
    sum: '',
    dot: '',
    cross: '',
    crossLength: '',
    angle: ''
}
const aFolder = gui.addFolder('Vector A') // Create a folder for vector a
aFolder.add(params, 'aX', -5, 5, 0.1).name('X').onChange(value => {a.x = value; updateVectors()}) // Add a slider for the x component of vector a
aFolder.add(params, 'aY', -5, 5, 0.1).name('Y').onChange(value => {a.y = value; updateVectors()}) 
aFolder.add(params, 'aZ', -5, 5, 0.1).name('Z').onChange(value => {a.z = value; updateVectors()}) 
aFolder.open() // Open the folder for vector a

const bFolder = gui.addFolder('Vector B') // Create a folder for vector b
bFolder.add(params, 'bX', -5, 5, 0.1).name('X').onChange(value => {b.x = value; updateVectors()}) 
bFolder.add(params, 'bY', -5, 5, 0.1).name('Y').onChange(value => {b.y = value; updateVectors()}) 
bFolder.add(params, 'bZ', -5, 5, 0.1).name('Z').onChange(value => {b.z = value; updateVectors()}) 
bFolder.open() // Open the folder for vector b

const resultsFolder = gui.addFolder('Results') // Create a folder for the results
resultsFolder.add(params, 'sum').name('Sum (a+b)').disable() // Add a field for the sum vector
resultsFolder.add(params, 'dot').name('Dot Product (a·b)').disable() // Add a field for the dot product
resultsFolder.add(params, 'cross').name('Cross Product (axb)').disable() // Add a field for the cross product
resultsFolder.add(params, 'crossLength').name('Cross Product Length (|axb|)').disable() // Add a field for the length of the cross product
resultsFolder.add(params, 'angle').name('Angle (a,b)').disable() // Add a field for the angle
resultsFolder.open() // Open the folder for the results

console.log('a + b = ', sum, 'a · b = ', dot); // Log the sum and dot product to the console

function updateVectors() {

    requestAnimationFrame(updateVectors);

    control.update();

    // Update vector A arrow
    arrA.setDirection(a.clone().normalize());
    arrA.setLength(a.length(), 0.35, 0.2);

    // Update vector B arrow
    arrB.setDirection(b.clone().normalize());
    arrB.setLength(b.length(), 0.35, 0.2);

    // Update sum
    sum.addVectors(a, b);
    arrSum.setDirection(sum.clone().normalize());
    arrSum.setLength(sum.length(), 0.35, 0.2);

    // Dot product
    const dot = a.dot(b);

    // Cross product
    const cross = new THREE.Vector3().crossVectors(a, b);

    // Cross product length
    const crossLength = cross.length();

    // Angle between A and B
    const cos = THREE.MathUtils.clamp(
        dot / (a.length() * b.length()),
        -1,
        1
    );

    const angle = THREE.MathUtils.radToDeg(Math.acos(cos));

    // Update GUI values
    params.sum = `(${sum.x}, ${sum.y}, ${sum.z})`;
    params.dot = dot;
    params.cross = `(${cross.x}, ${cross.y}, ${cross.z})`;
    params.crossLength = crossLength;
    params.angle = angle;

    // Update GUI display
    resultsFolder.controllersRecursive().forEach(controller => {
        controller.updateDisplay();
    });

    renderer.render(scene, camera);
}

updateVectors() // Call the updateVectors function for the first time
