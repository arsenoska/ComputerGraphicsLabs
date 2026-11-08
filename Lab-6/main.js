import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const perspective = new THREE.PerspectiveCamera(
  75, // Angle, usually 75-90 degrees
  window.innerWidth / window.innerHeight,   
  0.1,  
  100   
);
perspective.position.set(-1,2,15)
perspective.lookAt (0,0,0)
scene.add (perspective)

// Orthographic camera
const aspect = window.innerWidth / window.innerHeight;
const size = 12;

const orthographic = new THREE.OrthographicCamera(
  -size * aspect,  // left
  size * aspect,   // right
  size,            // top
  -size,           // bottom
  0.1,
  100
);
orthographic.position.set(0, 0, 25);
orthographic.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});  // antialias: true to make the edges of the objects smoother
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);  

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
const directionalLight = new THREE.DirectionalLight (0xffffff, 2.5)
scene.add (ambientLight, directionalLight)

// Array of depths
const depths = [5, 0, -8];

// Array of colors
const colors = [ 0xd22576 , 0xff8ac1, 0xffc0dd ];

const positions = [-7, 0, 7];
new PLYLoader().load('/models/3D.ply', (geo) => {
  geo.center()
  colors.forEach((color, index) => {
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5
      })
    );

    mesh.scale.setScalar(0.02);
    mesh.rotation.x = Math.PI;

    mesh.position.x = positions[index];
    mesh.position.z = depths[index];

    scene.add(mesh);
  })
})

const cameras = [perspective, orthographic]
let current = 0
console.log ('Active: Perspective')

addEventListener ('keydown', (e) => 
{
  if(e.code == 'Space')
  {
    e.preventDefault()
    current = current+1
    
    if (current >= cameras.length)
    {
      current=0
    }

    console.log ('Active: ', current == 0 ? ' PerspectiveCamera' : 'OrthographicCamera' )
  }

})

function animate()
{
  requestAnimationFrame(animate)
  renderer.render (scene, cameras[current])
}
animate()

// One more camera, and after that to copy the same object 3 times
// Orthographic camera and perspective camera
// Their difference is that orthographic camera does not have perspective, 
// so the objects will look the same size no matter how far they are from the camera, 
// while perspective camera will make objects look smaller as they get further away.

