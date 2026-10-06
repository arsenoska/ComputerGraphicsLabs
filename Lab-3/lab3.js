import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { roughness } from 'three/tsl';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(6,5,8)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const control = new OrbitControls(camera, renderer.domElement); 

// Point light is a light source that emits light in all directions from a single point in space.
// Ambient light is a light source that illuminates all objects in the scene equally, regardless of their position or orientation.
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(pointLight, ambientLight);

// The sun is a sphere with a radius of 2 units, and it is positioned at the origin of the scene.
const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);

// Create an object to represent the earth's orbit around the sun.
// This object will be used to rotate the earth around the sun.
const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit); 

// Create the earth mesh and add it to the earthOrbit object.
// This means that when we rotate the earthOrbit object, the earth will move around the sun in a circular path.
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x1E40FF, roughness: 0.9 })
);
earth.position.x = 6
earthOrbit.add(earth);  

function animate(){
    requestAnimationFrame(animate);
    control.update();  
    earthOrbit.rotation.y += 0.01; 
    renderer.render(scene, camera);
}
animate();