function SistemaSolar()
{
    constructor(nome)
    {
        this.nome = nome;
    }

    nome()
    {
        return this.nome;
    }
}


/* function CriarSol(scene)
{
    const textureLoader = new THREE.TextureLoader();
    const solGeo = new THREE.SphereGeometry(16, 30, 30);
    const solMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(texturaSol)
    });
    return sol = new THREE.Mesh(solGeo, solMat);
    return scene.add(sun);
} */