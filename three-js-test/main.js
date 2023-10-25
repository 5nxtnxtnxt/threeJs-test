import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.querySelector("#app").appendChild(renderer.domElement);
const loader = new GLTFLoader();
/*
, (gltf) => {
    const mesh = gltf.scene.children[0];
    mesh.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });
    mesh.scale.setX(0.1);
    mesh.scale.setY(0.1);
    mesh.scale.setZ(0.1);
    mesh.castShadow = true;
    scene.add(mesh);

    console.log(scene.getObjectByName("lowpoly_treeMesh"));
}
*/
const gltf = await loader.loadAsync("/public/tree01.glb");

const tree = gltf.scene.children[0];
tree.traverse((node) => {
    if (node.isMesh) {
        node.castShadow = true;
    }
});
tree.scale.setX(0.1);
tree.scale.setY(0.1);
tree.scale.setZ(0.1);
tree.castShadow = true;
scene.add(tree);

const geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(geometry, material);
//const light = new THREE.AmbientLight(0x404040); //자연광
const light1 = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 1);
const light2 = new THREE.PointLight(0x996600, 2000);
const helper = new THREE.PointLightHelper(light2, 1, 0x0000ff);

light2.castShadow = true;
light2.shadow.mapSize.width = 2048;
light2.shadow.mapSize.height = 2048;
light2.shadow.radius = 8;
light2.position.set(5, 30, 5);

cube.rotateX(-0.5 * Math.PI);
cube.position.y = 0;

cube.receiveShadow = true;

//camera.rotateX(-0.7);
// camera.rotateY(-1);
// camera.rotateZ(-0.5);
//camera.position.x = 0;
camera.position.y = 5;
//camera.position.z = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const geo2 = new THREE.BoxGeometry(2, 2, 2);
const material2 = new THREE.MeshToonMaterial({ color: 0x00aa00 });
const cube2 = new THREE.Mesh(geo2, material2);
cube2.castShadow = true;
cube2.position.setY(3);

scene.add(light1);
//scene.add(cube2);
scene.add(light2);
scene.add(helper);
scene.add(cube);

const snows = Array.from(Array(30), createSnow);
// const snows = new THREE.Mesh(snowGeo, snowMat);
// snows.position.setX(Math.random() * 5);
// snows.position.setY(3);
// snows.position.setZ(Math.random() * 5);
console.log(snows);
snows.forEach((snowMesh) => {
    scene.add(snowMesh);
});

function createSnow() {
    const snowGeo = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 8, 4);
    const snowMat = new THREE.MeshToonMaterial({ color: 0xffffff });
    const snows = new THREE.Mesh(snowGeo, snowMat);
    snows.castShadow = true;
    snows.position.setX(-5 + Math.random() * 10);
    snows.position.setY(10 + Math.random() * 10);
    snows.position.setZ(-5 + Math.random() * 10);
    return snows;
}
console.log(camera);
let angle = 90;
let radi = 10;
let dragged = false;
const cursor = {
    x: 0,
    y: 0,
};

camera.position.x = Math.cos((angle * Math.PI) / 180) * radi;
camera.position.z = Math.sin((angle * Math.PI) / 180) * radi;
window.addEventListener("mousedown", (event) => {
    cursor.x = event.offsetX / window.innerWidth - 0.5;
    dragged = true;
});
window.addEventListener("mouseup", (event) => {
    dragged = false;
});
window.addEventListener("wheel", (event) => {
    console.log(event.deltaY);
    radi = radi + event.deltaY / 100;

    camera.position.x = Math.cos((angle * Math.PI) / 180) * radi;
    camera.position.z = Math.sin((angle * Math.PI) / 180) * radi;
});

window.addEventListener("mousemove", (event) => {
    if (dragged) {
        const currentX = event.offsetX / window.innerWidth - 0.5;
        //console.log(cursor.x, currentX);
        angle = (angle + (currentX - cursor.x) * 360) % 360;
        cursor.x = currentX;

        camera.position.x = Math.cos((angle * Math.PI) / 180) * radi;
        camera.position.z = Math.sin((angle * Math.PI) / 180) * radi;
        //console.log(angle);
    }
    // ThreeJS에서와 브라우저에서 y축을 음양의 방향이 서로 다르므로 -1을 곱해준다.

    //console.log(cursor.y);
});
function animate() {
    //snows.position.setY(snows.position.y - 0.03);
    renderer.setSize(window.innerWidth, window.innerHeight);

    /*
    camera.position.x = cursor.x * 100;
    camera.position.y = cursor.y * 100;
    */
    //camera.updateProjectionMatrix(); // zoom이랑 같이사용
    camera.lookAt(new THREE.Vector3(0, 3, 0));
    snows.forEach((snow) => {
        if (snow.position.y < 0) {
            snow.position.setY(10 + Math.random() * 5);
        }
        snow.position.setY(snow.position.y - 0.03);
    });
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();
