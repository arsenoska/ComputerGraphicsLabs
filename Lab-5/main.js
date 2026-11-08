import *  as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// Create the scene where all 3D objects will be placed
const scene = new THREE.Scene();

// Set the background color of the scene
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

// Set the camera position (x, y, z)
camera.position.set(3,2,5)

// Create the renderer to display the 3D scene
const renderer = new THREE.WebGLRenderer({antialias: true});  //antialias: true to make the edges of the objects smoother

// Set the renderer size to the browser window
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the HTML page
document.body.appendChild(renderer.domElement);


//add directional light and ambient light

// Ambient light illuminates all objects equally
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

// Directional light illuminates objects from a specific direction
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);

// Set the position of the directional light
directionalLight.position.set(5,8,4)

// Add both lights to the scene
scene.add(ambientLight, directionalLight);


// vertex = points
// Define the vertices (points) of our 3D object
// Each vertex has three coordinates: x, y, z
// Float32Array stores the coordinates as 32-bit floating-point numbers
const positions = new Float32Array([
    0,1.5, 0, //vertex 0 - top
    0,-1.5,0, //vertex 1 - bottom
    1,0,0,    //vertex 2 - right
    0,0,1,    //vertex 3 - front
    -1,0,0,   // vertex 4 - left
    0,0,-1    //vertex 5 - back
])

// faces, they connect the point to create the
// Each group of three indices creates one triangular face
// The numbers refer to the vertex positions defined above
// Example: 0, 3, 2 connects vertices 0, 3, and 2
const index = [
    // Upper four triangular faces
    0, 3, 2, 
    0, 4, 3,
    0, 5, 4,
    0, 2, 5,

    // Lower four triangular faces
    1, 2, 3,
    1, 3, 4,
    1, 4, 5,
    1, 5, 2
]

// Create an empty BufferGeometry
// BufferGeometry stores the vertices and faces of the object
const geometry = new THREE.BufferGeometry()

// Add the vertex positions to the geometry
// 3 means each vertex contains three values (x, y, z)
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Define how the vertices are connected to form triangles
geometry.setIndex(index)

// Calculate vertex normals for correct lighting and shading
geometry.computeVertexNormals();

// Create a mesh by combining geometry and material
// MeshStandardMaterial reacts to lighting
// color defines the object's color
// roughness controls how smooth or rough the surface appears
const mesh = new THREE.Mesh(geometry,
    new THREE.MeshStandardMaterial({
    color: 0xf759a8,
    roughness: 0.4,
    side: THREE.FrontSide
})
)

// Add the object to the scene
scene.add(mesh)

// Convert indexed geometry to non-indexed geometry
// Indexed geometry reuses vertices between faces
// Non-indexed geometry stores separate vertices for each triangle
const nonIndexed = geometry.toNonIndexed()

// Recalculate normals for the non-indexed geometry
nonIndexed.computeVertexNormals()

// Print the number of vertices and faces in the console
// position.count gives the number of vertices
// index.length / 3 gives the number of triangular faces
console.log('Vertices:' , geometry.attributes.position.count, 'Faces', index.length/3)
console.log('Vertices:' , nonIndexed.attributes.position.count, 'Faces', index.length/3)

// Listen for keyboard input
window.addEventListener('keydown', (e)=> {

    // When the user presses the F key
    if (e.key == 'f')
    { 
        // Switch between indexed and non-indexed geometry
        mesh.geometry = mesh.geometry == geometry ? nonIndexed : geometry
    }
})

// Allow the user to rotate and zoom the camera with the mouse
const control = new OrbitControls(camera, renderer.domElement)

// Animation loop
function animate()
{
    // Continuously call the animate function
    requestAnimationFrame(animate)

    // Update camera controls
    control.update()

    // Slowly rotate the object around the Y axis
    mesh.rotation.y +=0.005

    // Render the scene using the camera
    renderer.render(scene, camera)
}

// Start the animation
animate()


/*
    I created a 3D crystal using BufferGeometry. The crystal has 
    6 vertices and 8 triangular faces. I used indexed geometry, 
    where vertices are shared between faces. I also implemented 
    a way to switch between indexed and non-indexed geometry by 
    pressing the F key to compare smooth and flat shading. When 
    a face has the wrong vertex order, its normal points inward, 
    and the face may become invisible when using FrontSide rendering.
*/