import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.01, 10000
);
camera.position.set(0,4,10);

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5,8,4);
scene.add(directionalLight);

scene.add(new THREE.GridHelper(40, 40));

const colors = [0xE8431C, 0x1E40FF, 0xF5C518, 0x3ecf8e];
for (let i = 0; i < 4; i++) {
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        new THREE.MeshStandardMaterial({ color: colors[i] })
    );
    cube.position.set(-3 * i * 2, 0.75, -i * 3);
    scene.add(cube);
}

const planeA = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide })
);
planeA.position.set(0, 3, -8);
scene.add(planeA);

const planeB = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshStandardMaterial({ color: 0x0000ff, side: THREE.DoubleSide })
);  
planeB.position.set(0, 3, -8.001);
scene.add(planeB);

const depthMaterial = new THREE.MeshDepthMaterial();
scene.overrideMaterial = depthMaterial;

const controls = new OrbitControls(camera, renderer.domElement);

const settings = { near: camera.near, far: camera.far, depth: true };
function apply() {
    camera.near = settings.near;
    camera.far = settings.far;
    camera.updateProjectionMatrix();
}

const gui = new GUI();
gui.add(settings, 'depth').name('Depth Modal').onChange(v => {
    scene.overrideMaterial = v ? depthMaterial : null;
});
gui.add(settings, 'near', 0.001, 5, 0.001).onChange(apply);
gui.add(settings, 'far', 20, 10000, 10).onChange(apply);

function animate () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();