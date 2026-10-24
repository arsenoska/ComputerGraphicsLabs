import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.set(8, 6, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
)
ground.rotation.x = -Math.PI / 2;

const grid = new THREE.GridHelper(20, 20);
scene.add(ground, grid);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(ambientLight, directionalLight);


const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);

const shoulderJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    baseMaterial
);
shoulder.add(shoulderJoint);

const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff });

const upperArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 3, 0.7),
    armMaterial
);
upperArm.position.y = 1.2;
shoulder.add(upperArm);
// if we don't position the upperArm, it will be centered at the shoulder joint, which is not what we want.
// it will go on both sides of the shoulder joint, so we need to move it up by half its height (1.5) to make it sit on top of the shoulder joint.


const elbow = new THREE.Group();
elbow.position.y = 2.6;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 32, 32),
    baseMaterial
);
elbow.add(elbowJoint);

const forearm = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 3, 0.6),
    armMaterial
);
forearm.position.y = 1.25;
elbow.add(forearm);


const wrist = new THREE.Group();
wrist.position.y = 2.8;
elbow.add(wrist);

const wristJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    baseMaterial
);
wrist.add(wristJoint);

const palm = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.5, 1.5),
    new THREE.MeshStandardMaterial({ color: 0xffaa55 })
);
palm.position.y = 1;
wrist.add(palm);

shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);


const fingers = [];
const fingerGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
const fingerMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc88 });

for (let i = 0; i < 5; i++) {
    const finger = new THREE.Mesh(fingerGeo, fingerMaterial);

    finger.position.x = (i - 2) * 0.35;
    finger.position.y = 2.25;
    finger.position.z = 0;

    wrist.add(finger);
    fingers.push(finger);
}


window.addEventListener('keydown', (event) => {
    const step = THREE.MathUtils.degToRad(5);
    const key = event.key.toLowerCase();

    if (key === 'q')
        shoulder.rotation.z += step;

    if (key === 'a')
        shoulder.rotation.z -= step;

    if (key === 'w')
        elbow.rotation.z += step;

    if (key === 's')
        elbow.rotation.z -= step;

    if (key === 'e')
        wrist.rotation.z += step;

    if (key === 'd')
        wrist.rotation.z -= step;
});


const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
}
animate();