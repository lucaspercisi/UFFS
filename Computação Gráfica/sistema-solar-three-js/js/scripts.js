//#region Classes
import * as SistemaSolar from './SistemaSolar.js'
//#endregion

//#region Constantes
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
//#endregion

//#region Ambiente
//cena
const scene = new THREE.Scene();

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
scene.add(camera);
camera.position.set(-200,150,0);
camera.lookAt(scene.position);	

// var projector = new THREE.Projector();
var mouse = { x: 0, y: 0 };

//Renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//pegar evento de clique do mouse
document.addEventListener('mousedown', OnDocumentMouseDown, false);

var controls = new THREE.OrbitControls( camera, renderer.domElement );

//tentativa de fazer o FlyControls
// let controls = new FlyControls( camera, renderer.domElement );
/* controls.movementSpeed = 1000;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false; */

//Luz Ambiente
const luzAmbiente = new THREE.AmbientLight(0x333333);
scene.add(luzAmbiente);

//#endregion

//#region Corpos Celestes

AdicionarEstrelas();

const sol = CriarSol();

const mercurio = CriarPlaneta(3.2, texturaMercurio, 28);
const venus = CriarPlaneta(5.8, texturaVenus, 44);
const terra = CriarPlaneta(6, texturaTerra, 62);
const marte = CriarPlaneta(4, texturaMarte, 78);
const jupiter = CriarPlaneta(12, texturaJupiter, 100);

const saturno = CriarPlaneta(10, texturaSaturno, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: texturaAnelSaturno
});

const urano = CriarPlaneta(7, texturaUrano, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: texturaAnelUrano
});

const netuno = CriarPlaneta(7, texturaNetuno, 200);

//#endregion

function CriarSol()
{
    const textureLoader = new THREE.TextureLoader();
    const solGeo = new THREE.SphereGeometry(16, 30, 30);
    const solMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(texturaSol)
    });
    const sol = new THREE.Mesh(solGeo, solMat);
    scene.add(sol);

    //Luz do sol
    const pontoLuzSol = new THREE.PointLight(0xFFFFFF, 2, 300);
    scene.add(pontoLuzSol);

    return sol;
}

function CriarPlaneta(tamanho, textura, posicao, anel) 
{
    const textureLoader = new THREE.TextureLoader();
    const geo = new THREE.SphereGeometry(tamanho, 30, 30);
    
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(textura)
    });

    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    
    if(anel) 
    {
        const ringGeo = new THREE.RingGeometry(anel.innerRadius,anel.outerRadius,32);
        
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(anel.texture),
            side: THREE.DoubleSide
        });
                                
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = posicao;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
        
    scene.add(obj);
    mesh.position.x = posicao;
    return {mesh, obj}
}

function AdicionarEstrelas()
{
    const r = 10, estrelasGeo = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];

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

    estrelasGeo[ 0 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
    estrelasGeo[ 1 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

    const estrelasMat = [
        new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
    ];

    for ( let i = 10; i < 30; i ++ ) {

        const stars = new THREE.Points( estrelasGeo[ i % 2 ], estrelasMat[ i % 6 ] );

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

function OnDocumentMouseDown( event ) 
{
    // Get the mouse X and Y screen positions, and scale them to [-1, 1] ranges, position (-1, 1) being the upper left side of the screen.
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Create Vector3 from mouse position, with Z = 0
    var mousePos = new THREE.Vector3(mouse.x, mouse.y, 0);

    // Create a picking-specific RayCaster from Three.js library 
    var projector = new THREE.Projector();
    var ray = new THREE.Raycaster( camera.position, mousePos.sub( camera.position ).normalize() );
    ray = projector.raycaster.setFromCamera(mousePos, camera);

    // Get the list of all scene children intersected by Raycaster
    var out = ray.intersectObjects(scene.children, false);

    if (old)
    {
        // Unselect the previous building
        old.material.color.setHex(0xaaaaaa);
    }
    if (out.length != 0)
    {
        
        var newEvent = new CustomEvent('meshClicked', {
            detail:{
                'mesh': out[0].object,
                'point': out[0].point 
            }
        });
        window.dispatchEvent(newEvent);

        // Color/uncolor the selected/unselected building
        /*if (old == out[0].object)
            out[0].object.material.color.setHex(0xaaaaaa);
        else
            out[0].object.material.color.setHex(0xff0000);*/

        old = out[0].object;

        //var data = wm.get(out[0])
        camera.lookAt(new THREE.Vector3( out[0].point.x, out[0].point.y, out[0].point.z ));
    }

}

var Animate = function() {
    requestAnimationFrame(Animate);
	//Rotação
	sol.rotateY(0.004);
	mercurio.mesh.rotateY(0.004);
	venus.mesh.rotateY(0.002);
	terra.mesh.rotateY(0.02);
	marte.mesh.rotateY(0.018);
	jupiter.mesh.rotateY(0.04);
	saturno.mesh.rotateY(0.038);
	urano.mesh.rotateY(0.03);
	netuno.mesh.rotateY(0.032);
    
	//Translação
	mercurio.obj.rotateY(0.04);
	venus.obj.rotateY(0.015);
	terra.obj.rotateY(0.01);
	marte.obj.rotateY(0.008);
	jupiter.obj.rotateY(0.002);
	saturno.obj.rotateY(0.0009);
	urano.obj.rotateY(0.0004);
	netuno.obj.rotateY(0.0001);
    
	renderer.render(scene, camera);
    /* 	console.log(camera.position.x);
	console.log(camera.position.y);
	console.log(camera.position.z);
	console.log("------------"); */
	
};

Animate();
