import * as SistemaSolar from './SistemaSolar.js'

const texturaEstrelas = "../img/stars.jpg";
const texturaSol = "../img/sun.jpg";
const texturaMercurio = "../img/mercury.jpg";
const texturaVenus = "../img/venus.jpg";
const texturaTerra = "../img/earth.jpg";
const texturaMarte = "../img/mars.jpg";
const texturaJupiter = "../img/jupiter.jpg";
const texturaSaturno = "../img/saturn.jpg";
const texturaAnelSaturno = "../img/saturn ring.png";
const texturaUrano = "../img/uranus.jpg";
const texturaAnelUrano = "../img/uranus ring.png";
const texturaNetuno = "../img/neptune.jpg";


const radius = 10;
const MARGIN = 0;
let SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
let SCREEN_WIDTH = window.innerWidth;

//cena
const scene = new THREE.Scene();


//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.x = -200;
camera.position.y = 150;
camera.position.z = 0;


//Renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls( camera, renderer.domElement );

//tentativa de fazer o FlyControls
// let controls = new FlyControls( camera, renderer.domElement );
/* controls.movementSpeed = 1000;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false; */


//Luz Ambiente
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

AdicionarEstrelas();


/* const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    texturaEstrelas,
    texturaEstrelas,
    texturaEstrelas,
    texturaEstrelas,
    texturaEstrelas,
    texturaEstrelas
]); */


const textureLoader = new THREE.TextureLoader();
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(texturaSol)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);


function createPlanete(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    
    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
            const ringMat = new THREE.MeshBasicMaterial({
                map: textureLoader.load(ring.texture),
                side: THREE.DoubleSide
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            obj.add(ringMesh);
            ringMesh.position.x = position;
            ringMesh.rotation.x = -0.5 * Math.PI;
        }
        
        scene.add(obj);
        mesh.position.x = position;
        return {mesh, obj}
    }
    
    const mercury = createPlanete(3.2, texturaMercurio, 28);
    const venus = createPlanete(5.8, texturaVenus, 44);
    const earth = createPlanete(6, texturaTerra, 62);
    const mars = createPlanete(4, texturaMarte, 78);
const jupiter = createPlanete(12, texturaJupiter, 100);
const saturn = createPlanete(10, texturaSaturno, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: texturaAnelSaturno
});
const uranus = createPlanete(7, texturaUrano, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: texturaAnelUrano
});
const neptune = createPlanete(7, texturaNetuno, 200);

function AdicionarEstrelas()
{
    const r = radius, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];

    const vertices1 = [];
    const vertices2 = [];

    const vertex = new THREE.Vector3();

    for ( let i = 0; i < 250; i ++ ) {

        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );

        vertices1.push( vertex.x, vertex.y, vertex.z );

    }

    for ( let i = 0; i < 1500; i ++ ) {

        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );

        vertices2.push( vertex.x, vertex.y, vertex.z );

    }

    starsGeometry[ 0 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
    starsGeometry[ 1 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

    const starsMaterials = [
        new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
    ];

    for ( let i = 10; i < 30; i ++ ) {

        const stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;
        stars.scale.setScalar( i * 10 );

        stars.matrixAutoUpdate = false;
        stars.updateMatrix();

        scene.add( stars );

    }

    // renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    document.body.appendChild( renderer.domElement );
}

var animate = function() {
    requestAnimationFrame(animate);
	//Rotação
	sun.rotateY(0.004);
	mercury.mesh.rotateY(0.004);
	venus.mesh.rotateY(0.002);
	earth.mesh.rotateY(0.02);
	mars.mesh.rotateY(0.018);
	jupiter.mesh.rotateY(0.04);
	saturn.mesh.rotateY(0.038);
	uranus.mesh.rotateY(0.03);
	neptune.mesh.rotateY(0.032);
    
	//Translação
	mercury.obj.rotateY(0.04);
	venus.obj.rotateY(0.015);
	earth.obj.rotateY(0.01);
	mars.obj.rotateY(0.008);
	jupiter.obj.rotateY(0.002);
	saturn.obj.rotateY(0.0009);
	uranus.obj.rotateY(0.0004);
	neptune.obj.rotateY(0.0001);
    
	renderer.render(scene, camera);
    /* 	console.log(camera.position.x);
	console.log(camera.position.y);
	console.log(camera.position.z);
	console.log("------------"); */
	
};

animate();
