import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


// Scene is the container that holds all the objects, lights, and cameras in the 3D world.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);


// Camera is needed for rendering the scene. 
// It defines what part of the scene is visible to the user.
const camera = new THREE.PerspectiveCamera(
   75,
   window.innerWidth / window.innerHeight,
   0.1,
   1000);
camera.position.set(0, 1, 2);


// Renderer is responsible for rendering the scene from the perspective of the camera.
const renderer = new THREE.WebGLRenderer;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Create a cube and add it to the scene.
/* const cube=new THREE.Mesh(
   new THREE.BoxGeometry(1.5,4,1.5),
   new THREE.MeshStandardMaterial({ color: 0xFFC0CB })
);
scene.add(cube); */


// Create a sphere and add it to the scene.
// Wireframe is a visual representation of a 3D object that shows only its 
// edges and vertices, without any surface shading or textures. 
const geometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshBasicMaterial({ color: 0xFF25A7 });
const sphere = new THREE.Mesh(geometry, material);
sphere.material.wireframe = true;
scene.add(sphere);


// Add an ambient light to the scene. 
const light = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(light);


// OrbitControls allows the user to rotate, zoom, and pan the camera around the scene using mouse or touch input.
const control = new OrbitControls(camera, renderer.domElement);
const timer =  new THREE.Timer();


// Animation loop is a function that updates the scene and renders it continuously, creating the illusion of motion.
function animate() {
   requestAnimationFrame(animate);
   timer.update();
   const dt = timer.getDelta();
   sphere.rotation.x += dt * 0.5;
   sphere.rotation.y += dt * 0.5;

   control.update();
   renderer.render(scene, camera);
}
animate();


// Handle window resize events to adjust the camera and renderer accordingly.
window.addEventListener("resize", () => {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
});

