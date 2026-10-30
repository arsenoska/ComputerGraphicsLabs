import *  as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import GLTFLoader to load existing 3D models (.glb or .gltf)
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Create the 3D scene
const scene = new THREE.Scene();

// Set the background color
scene.background = new THREE.Color(0xcccccc);

// Create a perspective camera
// 55 = field of view
// window.innerWidth / window.innerHeight = aspect ratio
// 0.1 = near clipping plane
// 100 = far clipping plane
const camera = new THREE.PerspectiveCamera(
  55, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  100
);

// Set the camera position
camera.position.set(3,2,5)

// Create the WebGL renderer
const renderer = new THREE.WebGLRenderer({antialias: true});  //antialias: true to make the edges of the objects smoother

// Set the renderer size to the browser window
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the HTML document
document.body.appendChild(renderer.domElement);

// Ambient light - illuminates the entire scene
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Directional light - simulates sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 8, 4);
scene.add(directionalLight);

// Create a GLTFLoader to import an existing 3D model
const loader = new GLTFLoader();

// Load the model.glb file
// The callback runs when the model has finished loading
loader.load('/model.glb', (gltf) => {

    // Rotate the loaded model 180 degrees around the Y axis
    gltf.scene.rotation.y = Math.PI 

    // Add the loaded model to the scene
    scene.add(gltf.scene);

    // Variables to count meshes, vertices, and faces
    let meshCount = 0;
    let totalVertices =0;
    let totalFaces = 0;

    // Traverse all objects inside the loaded model
    // A model can contain multiple meshes
    gltf.scene.traverse((child) => {

        // Check whether the current object is a mesh
        if(child.isMesh)
        {
            // Increase the number of meshes
            meshCount++

            // Get the geometry of the current mesh
            const geometry = child.geometry

            // Get the vertex positions
            const position = geometry.getAttribute('position')

            // Get the indices that connect vertices into faces
            // Some geometries may not have an index
            const index = geometry.index

            // Count the vertices in this mesh
            const vertices = position.count

            // Count triangular faces
            // Each triangle contains three indices
            // This assumes the geometry is indexed
            const faces = index.count /3

            // Add the counts to the totals
            totalVertices += vertices
            totalFaces += faces

            // Print information about the current mesh
            console.log ('Mesh', child.name)
            console.log ('Vertices', vertices)
            console.log ('Faces', faces)

        }
    })

    // Print the total number of meshes in the model
    console.log('Total Mesh', meshCount)

    // Print the total number of vertices
    console.log('Total Vertices', totalVertices)

    // Print the total number of triangular faces
    console.log('Total Faces', totalFaces)
})

// Enable mouse controls for rotating and zooming the camera
const control = new OrbitControls(camera, renderer.domElement)

// Animation loop
function animate()
{
    // Continuously repeat the animation
    requestAnimationFrame(animate)

    // Update the camera controls
    control.update()

    // Render the scene using the camera
    renderer.render(scene, camera)
}

// Start the animation loop
animate()
