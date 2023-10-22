import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { SaberModel } from './Saber';


class Scene {
    scene: any
    camera: any
    renderer: any
    controls: any
    blocks: any
    saber: SaberModel;

    constructor() {

        this.init()
    }

    async init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
    
        const clock = new THREE.Clock();
    
    
        
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 100 );
        this.camera.position.set( 0, 3, 7 );
        this.scene.add(this.camera);
    
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true
        this.renderer.xr.enabled = true;
        this.renderer.setAnimationLoop(this.animateXR.bind(this));

        document.querySelector("#screen").appendChild( this.renderer.domElement );
        document.querySelector("#screen").insertAdjacentElement("beforeend", VRButton.createButton( this.renderer ))

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( -40, 400, -70 );
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.bottom = -150;
        dirLight.shadow.camera.left = -150;
        dirLight.castShadow = true;
    
    
        this.scene.add(dirLight);
        
        const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
        hemiLight.position.set( 0, 120, 0 );
        this.scene.add(hemiLight);
        
        const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true} ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);

        this.saber = new SaberModel(this.renderer)

        this.scene.add(this.saber.model)
    
    
    
        const helper = new THREE.CameraHelper( dirLight.shadow.camera );
        this.scene.add( helper );
        
        this.animate();

    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.renderer.render( this.scene, this.camera );
    }

    animateXR() {
        const controller = this.renderer.xr.getController(0); 
        // console.log(controller)

        this.saber.model.position.set(controller.position.x, controller.position.y, controller.position.z)
        this.saber.model.rotation.x = controller.rotation.x
        this.saber.model.rotation.y = controller.rotation.y
        this.saber.model.rotation.z = controller.rotation.z

        this.renderer.render( this.scene, this.camera );
    }
    
}




export { Scene }